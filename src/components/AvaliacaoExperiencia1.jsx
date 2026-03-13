import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateAvaliacaoExperiencia1,
  fetchAvaliacaoExperiencia1List,
  saveAvaliacaoExperiencia1,
  deleteAvaliacaoExperiencia1,
} from "../redux/slices/formulariosSlice";
import useCadastroOptions from "../hooks/useCadastroOptions";
import ActionMenu from "./ActionMenu";
import SearchInput from "./SearchInput";
import api from "../lib/api";

const TIPO_QUESTIONARIO = "avaliacao-experiencia-1";

const mapQuestoesTemplateParaFormulario = (questoes = []) =>
  questoes
    .map((questao) => ({
      id: String(questao?.id || "").trim(),
      texto: String(questao?.texto || ""),
      tipo: questao?.tipo === "texto" ? "texto" : "opcao",
      resposta: "",
    }))
    .filter((questao) => questao.id.length > 0 && questao.texto.trim().length > 0);

const mapQuestoesFormularioParaTemplate = (questoes = []) =>
  questoes
    .map((questao) => ({
      id: String(questao?.id || "").trim(),
      texto: String(questao?.texto || "").trim(),
      tipo: questao?.tipo === "texto" ? "texto" : "opcao",
    }))
    .filter((questao) => questao.id.length > 0 && questao.texto.length > 0);

const criarIdQuestaoTexto = (questoes = []) => {
  let indice = questoes.filter((questao) => String(questao.id).startsWith("texto-")).length + 1;
  let novoId = `texto-${indice}`;

  while (questoes.some((questao) => String(questao.id) === novoId)) {
    indice += 1;
    novoId = `texto-${indice}`;
  }

  return novoId;
};

const AvaliacaoExperiencia1 = () => {
  const dispatch = useDispatch();
  const {
    avaliacaoExperiencia1: formState,
    avaliacaoExperiencia1List,
    loading,
    error,
  } = useSelector((state) => state.formularios);
  const user = useSelector((state) => state.user.user);
  const { alunos, professores, itensAvaliacao } = useCadastroOptions();
  const isAdmin = ["admin", "adm"].includes((user?.nivel_acesso || "").toLowerCase());

  const reduxFormData = formState?.formData || {};
  const reduxQuestoes = formState?.questoes || [];
  const questoes = reduxQuestoes;
  const [visualizando, setVisualizando] = useState(false);
  const [itemVisualizado, setItemVisualizado] = useState(null);
  const [editandoQuestionario, setEditandoQuestionario] = useState(false);
  const [editandoPerguntasTexto, setEditandoPerguntasTexto] = useState(false);
  const [draftQuestoesOpcao, setDraftQuestoesOpcao] = useState([]);
  const [draftQuestoesTexto, setDraftQuestoesTexto] = useState([]);
  const [itemSelecionadoId, setItemSelecionadoId] = useState("");
  const [novoCampoTexto, setNovoCampoTexto] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const questoesOpcao = questoes.filter((questao) => questao.tipo !== "texto");
  const questoesTexto = questoes.filter((questao) => questao.tipo === "texto");
  const questoesOpcaoEmEdicao = editandoQuestionario ? draftQuestoesOpcao : questoesOpcao;
  const questoesTextoEmEdicao = editandoPerguntasTexto ? draftQuestoesTexto : questoesTexto;

  const itensDisponiveis = useMemo(() => {
    const idsSelecionados = new Set(
      questoesOpcaoEmEdicao
        .filter((q) => q.tipo !== "texto")
        .map((q) => String(q.id))
    );
    return itensAvaliacao.filter((item) => {
      const status = (item.status || "").toLowerCase();
      const ativo = status === "ativo" || status === "";
      return ativo && !idsSelecionados.has(String(item.id));
    });
  }, [itensAvaliacao, questoesOpcaoEmEdicao]);

  useEffect(() => {
    dispatch(fetchAvaliacaoExperiencia1List());
  }, [dispatch]);

  useEffect(() => {
    const loadQuestionarioModelo = async () => {
      if (formState?.id || reduxQuestoes.length > 0) {
        return;
      }

      try {
        const { data } = await api.get(`/questionarios-modelo/${TIPO_QUESTIONARIO}`);
        const questoesPadrao = mapQuestoesTemplateParaFormulario(data?.questoes || []);
        if (questoesPadrao.length > 0) {
          dispatch(updateAvaliacaoExperiencia1({ questoes: questoesPadrao }));
        }
      } catch (error) {
        console.error("Erro ao carregar questionario modelo da 1a avaliacao:", error);
      }
    };

    loadQuestionarioModelo();
  }, [dispatch, formState?.id, reduxQuestoes.length]);

  const salvarQuestionarioModelo = async (questoesAtualizadas) => {
    const payload = mapQuestoesFormularioParaTemplate(questoesAtualizadas);

    if (payload.length === 0) {
      alert("Nao e possivel salvar um questionario vazio.");
      return false;
    }

    try {
      await api.put(`/questionarios-modelo/${TIPO_QUESTIONARIO}`, {
        questoes: payload,
      });
      return true;
    } catch (error) {
      console.error("Erro ao salvar questionario modelo da 1a avaliacao:", error);
      alert("Nao foi possivel salvar o modelo de questionario.");
      return false;
    }
  };

  const opcoes = ["Sim", "Não", "Maioria das vezes", "Raras vezes"];

  const handleInputChange = (field, value) => {
    dispatch(
      updateAvaliacaoExperiencia1({
        formData: { ...reduxFormData, [field]: value },
      })
    );
  };

  const handleAlunoChange = (nomeAluno) => {
    const alunoSelecionado = alunos.find((aluno) => aluno.nome === nomeAluno);
    dispatch(
      updateAvaliacaoExperiencia1({
        formData: {
          ...reduxFormData,
          id_pessoa_aluno: alunoSelecionado?.id || "",
          nome: nomeAluno,
          dataEntrada: alunoSelecionado?.data_ingresso || reduxFormData.dataEntrada || "",
        },
      })
    );
  };

  const handleProfessorChange = (nomeProfessor) => {
    const professorSelecionado = professores.find((professor) => professor.nome === nomeProfessor);
    dispatch(
      updateAvaliacaoExperiencia1({
        formData: {
          ...reduxFormData,
          id_pessoa_professor: professorSelecionado?.id || "",
          nomeAvaliador: nomeProfessor,
        },
      })
    );
  };

  const handleQuestaoChange = (id, value) => {
    const updatedQuestoes = questoes.map((q) =>
      String(q.id) === String(id) ? { ...q, resposta: value } : q
    );
    dispatch(updateAvaliacaoExperiencia1({ questoes: updatedQuestoes }));
  };

  const iniciarEdicaoQuestionario = () => {
    if (editandoPerguntasTexto) {
      alert("Finalize a edicao de perguntas descritivas antes de editar o questionario.");
      return;
    }

    setDraftQuestoesOpcao(questoesOpcao.map((q) => ({ ...q })));
    setItemSelecionadoId("");
    setEditandoQuestionario(true);
  };

  const cancelarEdicaoQuestionario = () => {
    setEditandoQuestionario(false);
    setDraftQuestoesOpcao([]);
    setItemSelecionadoId("");
  };

  const atualizarTextoQuestaoOpcao = (id, texto) => {
    setDraftQuestoesOpcao((prev) =>
      prev.map((q) => (String(q.id) === String(id) ? { ...q, texto } : q))
    );
  };

  const removerQuestaoOpcao = (id) => {
    setDraftQuestoesOpcao((prev) => prev.filter((q) => String(q.id) !== String(id)));
  };

  const adicionarQuestaoOpcao = () => {
    if (!itemSelecionadoId) {
      alert("Selecione um item para adicionar ao questionario.");
      return;
    }

    const itemSelecionado = itensAvaliacao.find(
      (item) => String(item.id) === String(itemSelecionadoId)
    );

    if (!itemSelecionado) {
      alert("Item selecionado invalido.");
      return;
    }

    setDraftQuestoesOpcao((prev) => [
      ...prev,
      {
        id: String(itemSelecionado.id),
        texto: itemSelecionado.itens,
        tipo: "opcao",
        resposta: "",
      },
    ]);
    setItemSelecionadoId("");
  };

  const salvarEdicaoQuestionario = async () => {
    const questoesNormalizadas = draftQuestoesOpcao
      .map((q) => ({ ...q, texto: String(q.texto || "").trim() }))
      .filter((q) => q.texto.length > 0);

    const questoesAtualizadas = [...questoesNormalizadas, ...questoesTexto];
    const salvouModelo = await salvarQuestionarioModelo(questoesAtualizadas);
    if (!salvouModelo) {
      return;
    }

    const respostasPorId = new Map(questoes.map((q) => [String(q.id), q.resposta || ""]));
    const comRespostas = questoesAtualizadas.map((q) => ({
      ...q,
      resposta: respostasPorId.get(String(q.id)) || "",
    }));

    dispatch(updateAvaliacaoExperiencia1({ questoes: comRespostas }));
    setEditandoQuestionario(false);
    setDraftQuestoesOpcao([]);
    setItemSelecionadoId("");
    alert("Questionario atualizado para todos os professores.");
  };

  const iniciarEdicaoPerguntasTexto = () => {
    if (editandoQuestionario) {
      alert("Finalize a edicao do questionario antes de editar perguntas descritivas.");
      return;
    }

    setDraftQuestoesTexto(questoesTexto.map((q) => ({ ...q })));
    setNovoCampoTexto("");
    setEditandoPerguntasTexto(true);
  };

  const cancelarEdicaoPerguntasTexto = () => {
    setEditandoPerguntasTexto(false);
    setDraftQuestoesTexto([]);
    setNovoCampoTexto("");
  };

  const atualizarTextoPerguntaDescritiva = (id, texto) => {
    setDraftQuestoesTexto((prev) =>
      prev.map((q) => (String(q.id) === String(id) ? { ...q, texto } : q))
    );
  };

  const removerPerguntaDescritiva = (id) => {
    setDraftQuestoesTexto((prev) => prev.filter((q) => String(q.id) !== String(id)));
  };

  const adicionarCampoTexto = () => {
    const texto = novoCampoTexto.trim();
    if (!texto) {
      alert("Digite o texto do novo campo.");
      return;
    }

    setDraftQuestoesTexto((prev) => [
      ...prev,
      {
        id: criarIdQuestaoTexto([...questoes, ...prev]),
        texto,
        tipo: "texto",
        resposta: "",
      },
    ]);
    setNovoCampoTexto("");
  };

  const salvarEdicaoPerguntasTexto = async () => {
    const questoesTextoNormalizadas = draftQuestoesTexto
      .map((q) => ({ ...q, texto: String(q.texto || "").trim() }))
      .filter((q) => q.texto.length > 0);

    const questoesAtualizadas = [...questoesOpcao, ...questoesTextoNormalizadas];
    const salvouModelo = await salvarQuestionarioModelo(questoesAtualizadas);
    if (!salvouModelo) {
      return;
    }

    const respostasPorId = new Map(questoes.map((q) => [String(q.id), q.resposta || ""]));
    const comRespostas = questoesAtualizadas.map((q) => ({
      ...q,
      resposta: respostasPorId.get(String(q.id)) || "",
    }));

    dispatch(updateAvaliacaoExperiencia1({ questoes: comRespostas }));
    setEditandoPerguntasTexto(false);
    setDraftQuestoesTexto([]);
    setNovoCampoTexto("");
    alert("Perguntas descritivas atualizadas para todos os professores.");
  };

  const handleEditar = (item) => {
    dispatch(
      updateAvaliacaoExperiencia1({
        formData: item.formData,
        questoes: item.questoes || [],
        id: item.id,
      })
    );
  };

  const handleExcluir = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este registro?")) {
      await dispatch(deleteAvaliacaoExperiencia1(id));
      dispatch(fetchAvaliacaoExperiencia1List());
    }
  };

  const handleVisualizar = (item) => {
    setItemVisualizado(item);
    setVisualizando(true);
  };

  const fecharVisualizacao = () => {
    setVisualizando(false);
    setItemVisualizado(null);
  };

  const salvarFormulario = () => {
    const { nome, dataEntrada, dataAvaliacao, nomeAvaliador } =
      reduxFormData || {};

    const camposObrigatorios = {
      nome: "Nome",
      dataEntrada: "Data da Entrada",
      dataAvaliacao: "Data da Avaliação",
      nomeAvaliador: "Nome do Professor(a)",
    };

    const camposVazios = Object.entries(camposObrigatorios)
      .filter(([campo]) => {
        const valor = reduxFormData?.[campo];
        return typeof valor === "string" ? valor.trim() === "" : !valor;
      })
      .map(([_, label]) => label);

    if (camposVazios.length > 0) {
      alert(
        `Preencha os seguintes campos antes de salvar:\n\n• ${camposVazios.join(
          "\n• "
        )}`
      );
      return;
    }

    const questoesParaSalvar = questoes.map(({ personalizada, ...questao }) =>
      questao
    );

    const dataToSave = {
      id: formState.id,
      formData: reduxFormData,
      questoes: questoesParaSalvar,
      nome: reduxFormData?.nome || "Registro Sem Nome",
    };

    dispatch(saveAvaliacaoExperiencia1(dataToSave))
      .unwrap()
      .then(() => {
        alert("Avaliação Experiência 1 salva com sucesso!");
        dispatch(fetchAvaliacaoExperiencia1List());
        dispatch(
          updateAvaliacaoExperiencia1({
            formData: {},
            questoes: [],
            id: undefined,
          })
        );
      })
      .catch((err) => {
        alert(`Erro ao salvar: ${err.message || "Erro desconhecido"}`);
        console.error("Erro ao salvar:", err);
      });
  };

  if (loading) return <div>Carregando Avaliação Experiência 1...</div>;
  if (error) return <div>Erro ao carregar: {error.message}</div>;

  const filteredList = avaliacaoExperiencia1List.filter((item) => {
    const nome = item.formData?.nome || "";
    return nome.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const formDataVisualizado = itemVisualizado?.formData || {};
  const nomeAlunoVisualizado =
    formDataVisualizado.nome ||
    alunos.find((aluno) => String(aluno.id) === String(formDataVisualizado.id_pessoa_aluno))?.nome ||
    "—";
  const nomeProfessorVisualizado =
    formDataVisualizado.nomeAvaliador ||
    professores.find(
      (professor) => String(professor.id) === String(formDataVisualizado.id_pessoa_professor)
    )?.nome ||
    "—";
  const camposOcultosVisualizacao = new Set([
    "id",
    "id_pessoa_aluno",
    "id_pessoa_professor",
    "nome",
    "nomeAvaliador",
  ]);
  const labelsCamposVisualizacao = {
    dataEntrada: "Data da Entrada",
    dataAvaliacao: "Data da Avaliacao",
    observacoes: "Observacoes",
    situacoesIrritacao: "Situacoes de Irritacao",
  };

  return (
    <div className="avaliacao-container">
      <div className="avaliacao-header">
        <h1>INSTITUTO DE EDUCAÇÃO ESPECIAL</h1>
        <h2>DIOMÍCIO FREITAS</h2>
        <h3>Criciúma - SC</h3>
        <h4>Avaliação Usuário em Período de Experiência - 1ª Avaliação</h4>
      </div>

      <div className="form-section">
        <div className="form-row">
          <div className="form-group">
            <label>Nome:</label>
            <select
              value={reduxFormData.nome || ""}
              onChange={(e) => handleAlunoChange(e.target.value)}
            >
              <option value="">Selecione o aluno</option>
              {alunos.map((aluno) => (
                <option key={aluno.id} value={aluno.nome}>
                  {aluno.nome}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Data da entrada:</label>
            <input
              type="date"
              value={reduxFormData.dataEntrada || ""}
              onChange={(e) => handleInputChange("dataEntrada", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>1ª Avaliação:</label>
            <input
              type="date"
              value={reduxFormData.dataAvaliacao || ""}
              onChange={(e) =>
                handleInputChange("dataAvaliacao", e.target.value)
              }
            />
          </div>
        </div>
      </div>

      <div className="questoes-section">
        <h3>Questionário</h3>
        {itensAvaliacao.length === 0 && (
          <p>Nenhum item cadastrado em Itens a serem avaliados.</p>
        )}
        <div className="questoes-list">
          {questoesOpcao.length === 0 && (
            <p>Nenhum item selecionado para esta avaliação.</p>
          )}
          {questoesOpcaoEmEdicao.map((questao, index) => (
            <div key={questao.id} className="questao-item">
              <div className="questao-numero">{index + 1}</div>
              {editandoQuestionario && isAdmin ? (
                <input
                  type="text"
                  className="questao-input"
                  value={questao.texto}
                  onChange={(e) => atualizarTextoQuestaoOpcao(questao.id, e.target.value)}
                />
              ) : (
                <div className="questao-texto">{questao.texto}</div>
              )}
              {!editandoQuestionario && (
                <div className="questao-opcoes">
                  {opcoes.map((opcao) => (
                    <label key={opcao} className="radio-label">
                      <input
                        type="radio"
                        name={`questao-${questao.id}`}
                        value={opcao}
                        checked={questao.resposta === opcao}
                        onChange={(e) =>
                          handleQuestaoChange(questao.id, e.target.value)
                        }
                      />
                      <span>{opcao}</span>
                    </label>
                  ))}
                </div>
              )}
              {editandoQuestionario && (
                <button
                  onClick={() => removerQuestaoOpcao(questao.id)}
                  className="btn-excluir"
                  title="Remover questão"
                >
                  Excluir
                </button>
              )}
            </div>
          ))}

          {isAdmin && (
            <div className="admin-controls">
              <div className="questionario-actions">
                {editandoQuestionario ? (
                  <>
                    <button
                      type="button"
                      className="btn-editar"
                      onClick={salvarEdicaoQuestionario}
                    >
                      Salvar Questionario
                    </button>
                    <button
                      type="button"
                      className="btn-excluir"
                      onClick={cancelarEdicaoQuestionario}
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="btn-editar"
                    onClick={iniciarEdicaoQuestionario}
                  >
                    Editar Questionario
                  </button>
                )}
              </div>

              {editandoQuestionario && (
                <div className="add-questao">
                  <select
                    className="questao-input"
                    value={itemSelecionadoId}
                    onChange={(e) => setItemSelecionadoId(e.target.value)}
                  >
                    <option value="">Selecione um item cadastrado</option>
                    {itensDisponiveis.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.itens}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="btn-editar"
                    onClick={adicionarQuestaoOpcao}
                    disabled={itensDisponiveis.length === 0}
                  >
                    Adicionar item
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="questoes-section">
        <h3>Perguntas Descritivas</h3>
        <div className="questoes-list">
          {questoesTexto.length === 0 && (
            <p>Nenhuma pergunta descritiva cadastrada.</p>
          )}
          {questoesTextoEmEdicao.map((questao, index) => (
            <div key={questao.id} className="questao-item">
              <div className="questao-numero">{index + 1}</div>
              {editandoPerguntasTexto && isAdmin ? (
                <input
                  type="text"
                  className="questao-input"
                  value={questao.texto}
                  onChange={(e) => atualizarTextoPerguntaDescritiva(questao.id, e.target.value)}
                />
              ) : (
                <div className="questao-texto">{questao.texto}</div>
              )}
              <div className="questao-especial">
                <textarea
                  value={questao.resposta || ""}
                  onChange={(e) => handleQuestaoChange(questao.id, e.target.value)}
                  placeholder="Descreva sua resposta..."
                  rows="3"
                />
              </div>
              {editandoPerguntasTexto && (
                <button
                  onClick={() => removerPerguntaDescritiva(questao.id)}
                  className="btn-excluir"
                  title="Remover pergunta"
                >
                  Excluir
                </button>
              )}
            </div>
          ))}

          {isAdmin && (
            <div className="admin-controls">
              <div className="questionario-actions">
                {editandoPerguntasTexto ? (
                  <>
                    <button
                      type="button"
                      className="btn-editar"
                      onClick={salvarEdicaoPerguntasTexto}
                    >
                      Salvar Perguntas
                    </button>
                    <button
                      type="button"
                      className="btn-excluir"
                      onClick={cancelarEdicaoPerguntasTexto}
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="btn-editar"
                    onClick={iniciarEdicaoPerguntasTexto}
                  >
                    Editar Perguntas
                  </button>
                )}
              </div>

              {editandoPerguntasTexto && (
                <div className="add-questao">
                  <input
                    type="text"
                    className="questao-input"
                    placeholder="Digite uma nova pergunta de texto"
                    value={novoCampoTexto}
                    onChange={(e) => setNovoCampoTexto(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn-editar"
                    onClick={adicionarCampoTexto}
                  >
                    Adicionar campo de texto
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="form-section">
        <div className="form-group">
          <label>Nome do professor(a):</label>
          <select
            value={reduxFormData.nomeAvaliador || ""}
            onChange={(e) => handleProfessorChange(e.target.value)}
          >
            <option value="">Selecione o professor</option>
            {professores.map((professor) => (
              <option key={professor.id} value={professor.nome}>
                {professor.nome}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-actions">
        <button onClick={salvarFormulario} className="btn-save">
          Salvar Avaliação
        </button>
      </div>

      <div className="lista-registros">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Pesquisar pelo nome..."
        />
        {filteredList.length === 0 ? (
          <p>Nenhum registro salvo.</p>
        ) : (
          <div className="record-list">
            {filteredList.map((item) => (
              <div key={item.id} className="record-row">
                <div className="record-main">
                  <p className="record-title">{item.formData?.nome || "Sem nome"}</p>
                  <p className="record-subtitle">
                    Avaliador: {item.formData?.nomeAvaliador || "Sem avaliador"}
                  </p>
                </div>
                <ActionMenu
                  onEdit={() => handleEditar(item)}
                  onView={() => handleVisualizar(item)}
                  onDelete={() => handleExcluir(item.id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Telinha de visualização */}
      {visualizando && (
        <div className="overlay-visualizar">
          <div className="visualizar-card">
            <h3>Detalhes do Registro</h3>
            <div className="visualizar-conteudo">
              {itemVisualizado && (
                <>
                  <p>
                    <strong>Aluno:</strong> {nomeAlunoVisualizado}
                  </p>
                  <p>
                    <strong>Professor(a):</strong> {nomeProfessorVisualizado}
                  </p>
                </>
              )}

              {itemVisualizado &&
                Object.entries(formDataVisualizado)
                  .filter(([key]) => !camposOcultosVisualizacao.has(key))
                  .map(
                  ([key, value]) => {
                    const data = new Date(value);
                    const valorFormatado = !isNaN(data)
                      ? `${String(data.getDate()).padStart(2, "0")}/${String(
                          data.getMonth() + 1
                        ).padStart(2, "0")}/${data.getFullYear()}`
                      : value;

                    return (
                      <p key={key}>
                        <strong>{labelsCamposVisualizacao[key] || key}:</strong> {valorFormatado || "—"}
                      </p>
                    );
                  }
                )}

              {itemVisualizado?.questoes && (
                <div className="visualizar-questoes">
                  <h4>Questões</h4>
                  {itemVisualizado.questoes.map((q) => (
                    <p key={q.id}>
                      <strong>{q.texto}:</strong>{" "}
                      {q.resposta || "—"}
                    </p>
                  ))}
                </div>
              )}
            </div>
            <div className="acoes-card">
              <button className="btn-fechar" onClick={fecharVisualizacao}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvaliacaoExperiencia1;
