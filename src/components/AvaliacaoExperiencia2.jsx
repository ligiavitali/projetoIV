import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateAvaliacaoExperiencia2,
  fetchAvaliacaoExperiencia2List,
  saveAvaliacaoExperiencia2,
  deleteAvaliacaoExperiencia2,
} from "../redux/slices/formulariosSlice";
import useCadastroOptions from "../hooks/useCadastroOptions";
import ActionMenu from "./ActionMenu";
import SearchInput from "./SearchInput";

const AvaliacaoExperiencia2 = () => {
  const dispatch = useDispatch();
  const {
    avaliacaoExperiencia2: formState,
    avaliacaoExperiencia2List,
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
  const [itemSelecionadoId, setItemSelecionadoId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const itensDisponiveis = useMemo(() => {
    const idsSelecionados = new Set(questoes.map((q) => Number(q.id)));
    return itensAvaliacao.filter((item) => {
      const status = (item.status || "").toLowerCase();
      const ativo = status === "ativo" || status === "";
      return ativo && !idsSelecionados.has(Number(item.id));
    });
  }, [itensAvaliacao, questoes]);

  useEffect(() => {
    dispatch(fetchAvaliacaoExperiencia2List());
  }, [dispatch]);

  const opcoes = ["Sim", "Não", "Maioria das vezes", "Raras vezes"];

  const handleInputChange = (field, value) => {
    dispatch(
      updateAvaliacaoExperiencia2({
        formData: { ...reduxFormData, [field]: value },
      })
    );
  };

  const handleAlunoChange = (nomeAluno) => {
    const alunoSelecionado = alunos.find((aluno) => aluno.nome === nomeAluno);
    dispatch(
      updateAvaliacaoExperiencia2({
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
      updateAvaliacaoExperiencia2({
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
      q.id === id ? { ...q, resposta: value } : q
    );
    dispatch(updateAvaliacaoExperiencia2({ questoes: updatedQuestoes }));
  };

  const removerQuestao = (id) => {
    if (!isAdmin) {
      alert("Somente admin pode remover itens do questionário.");
      return;
    }
    const updatedQuestoes = questoes.filter((q) => q.id !== id);
    dispatch(updateAvaliacaoExperiencia2({ questoes: updatedQuestoes }));
  };

  const adicionarQuestao = () => {
    if (!isAdmin) {
      alert("Somente admin pode inserir itens no questionário.");
      return;
    }

    if (!itemSelecionadoId) {
      alert("Selecione um item para adicionar ao questionário.");
      return;
    }

    const itemSelecionado = itensAvaliacao.find(
      (item) => String(item.id) === String(itemSelecionadoId)
    );

    if (!itemSelecionado) {
      alert("Item selecionado inválido.");
      return;
    }

    const updatedQuestoes = [
      ...questoes,
      {
        id: itemSelecionado.id,
        texto: itemSelecionado.itens,
        resposta: "",
        personalizada: true,
      },
    ];

    dispatch(updateAvaliacaoExperiencia2({ questoes: updatedQuestoes }));
    setItemSelecionadoId("");
  };

  const handleEditar = (item) => {
    dispatch(
      updateAvaliacaoExperiencia2({
        formData: item.formData,
        questoes: item.questoes || [],
        id: item.id,
      })
    );
  };

  const handleExcluir = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este registro?")) {
      await dispatch(deleteAvaliacaoExperiencia2(id));
      dispatch(fetchAvaliacaoExperiencia2List());
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
    const camposObrigatorios = {
      nome: "Nome",
      dataAdmissao: "Data de Admissão",
      dataInicio: "Data de Início",
      dataFim: "Data de Fim",
      empresa: "Empresa",
      funcao: "Função",
      responsavelRH: "Responsável RH",
    };
    if (!formState.id) {
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

    dispatch(saveAvaliacaoExperiencia2(dataToSave))
      .unwrap()
      .then(() => {
        alert("Avaliação Experiência 2 salva com sucesso!");
        dispatch(fetchAvaliacaoExperiencia2List());
        dispatch(
          updateAvaliacaoExperiencia2({
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

  if (loading)
    return (
      <div className="loading-message">
        Carregando Avaliação Experiência 2...
      </div>
    );
  if (error)
    return (
      <div className="error-message">Erro ao carregar: {error.message}</div>
    );

  const filteredList = avaliacaoExperiencia2List.filter((item) => {
    const nome = item.formData?.nome || "";
    return nome.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="avaliacao-container">
      <div className="avaliacao-header">
        <h1>INSTITUTO DE EDUCAÇÃO ESPECIAL</h1>
        <h2>DIOMÍCIO FREITAS</h2>
        <h3>Criciúma - SC</h3>
        <h4>Avaliação Usuário em Período de Experiência - 2ª Avaliação</h4>
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
          {questoes.length === 0 && (
            <p>Nenhum item selecionado para esta avaliação.</p>
          )}
          {questoes.map((questao) => (
            <div key={questao.id} className="questao-item">
              <div className="questao-numero">{questao.id}</div>
              <div className="questao-texto">{questao.texto}</div>
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
              {editandoQuestionario && (
                <button
                  onClick={() => removerQuestao(questao.id)}
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
                <button
                  type="button"
                  className="btn-editar"
                  onClick={() => setEditandoQuestionario((prev) => !prev)}
                >
                  {editandoQuestionario ? "Fechar" : "Editar"}
                </button>
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
                    onClick={adicionarQuestao}
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

      <div className="questao-especial">
        <h4>47 - O usuário tem perfil para esta instituição? Por quê?</h4>
        <textarea
          value={reduxFormData.observacoes || ""}
          onChange={(e) => handleInputChange("observacoes", e.target.value)}
          placeholder="Descreva sua opinião..."
          rows="4"
        />
      </div>

      <div className="questao-especial">
        <h4>Em que situações demonstra irritação?</h4>
        <textarea
          value={reduxFormData.situacoesIrritacao || ""}
          onChange={(e) =>
            handleInputChange("situacoesIrritacao", e.target.value)
          }
          placeholder="Descreva as situações..."
          rows="3"
        />
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

      {visualizando && (
        <div className="overlay-visualizar">
          <div className="visualizar-card">
            <h3>Detalhes do Registro</h3>
            <div className="visualizar-conteudo">
              {itemVisualizado &&
                Object.entries(itemVisualizado.formData || {}).map(
                  ([key, value]) => {
                    const data = new Date(value);
                    const valorFormatado = !isNaN(data)
                      ? `${String(data.getDate()).padStart(2, "0")}/${String(
                          data.getMonth() + 1
                        ).padStart(2, "0")}/${data.getFullYear()}`
                      : value;
                    return (
                      <p key={key}>
                        <strong>{key}:</strong> {valorFormatado || "—"}
                      </p>
                    );
                  }
                )}

              {itemVisualizado?.questoes && (
                <div className="visualizar-questoes">
                  <h4>Questões</h4>
                  {itemVisualizado.questoes.map((q) => (
                    <p key={q.id}>
                      <strong>
                        {q.id} - {q.texto}:
                      </strong>{" "}
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

export default AvaliacaoExperiencia2;
