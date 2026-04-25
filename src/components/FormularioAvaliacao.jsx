import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateFormularioAvaliacao,
  fetchControleInternoList,
  saveControleInterno,
  deleteControleInterno,
} from "../redux/slices/formulariosSlice";
import useCadastroOptions from "../hooks/useCadastroOptions";
import ActionMenu from "./ActionMenu";
import SearchInput from "./SearchInput";

const FormularioAvaliacao = () => {
  const dispatch = useDispatch();
  const {
    formularioAvaliacao: formData,
    controleInternoList,
    loading,
    error,
  } = useSelector((state) => state.formularios);
  const { alunos } = useCadastroOptions();

  const avaliacoes = formData.data || [
    {
      id: Date.now(),
      id_pessoa_aluno: "",
      nomeUsuario: "",
      ingresso: "",
      primeiraAval: "",
      segundaAval: "",
      primeiraEntrevistaPais: "",
      segundaEntrevistaPais: "",
      resultado: "",
    },
  ];

  const [mensagem, setMensagem] = useState("");
  const [visualizando, setVisualizando] = useState(false);
  const [itemVisualizado, setItemVisualizado] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchControleInternoList());
  }, [dispatch]);

  const handleInputChange = (id, field, value) => {
    const updatedAvaliacoes = avaliacoes.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    dispatch(updateFormularioAvaliacao({ data: updatedAvaliacoes }));
  };

  const handleAlunoChange = (id, nomeAluno) => {
    const alunoSelecionado = alunos.find((aluno) => aluno.nome === nomeAluno);
    const updatedAvaliacoes = avaliacoes.map((item) => {
      if (item.id !== id) {
        return item;
      }

      return {
        ...item,
        id_pessoa_aluno: alunoSelecionado?.id || "",
        nomeUsuario: nomeAluno,
        ingresso: alunoSelecionado?.data_ingresso || item.ingresso || "",
      };
    });

    dispatch(updateFormularioAvaliacao({ data: updatedAvaliacoes }));
  };

  const handleEditar = (item) => {
    const aluno = alunos.find((pessoa) => pessoa.id === item.id_pessoa_aluno);
    dispatch(
      updateFormularioAvaliacao({
        id: item.id,
        data: [
          {
            id: item.id,
            id_pessoa_aluno: item.id_pessoa_aluno,
            nomeUsuario: aluno?.nome || "",
            ingresso: item.data_entrada || "",
            primeiraAval: item.dt_1_avaliacao || "",
            segundaAval: item.dt_2_avaliacao || "",
            primeiraEntrevistaPais: item.dt_1_entrevista_pais || "",
            segundaEntrevistaPais: item.dt_2_entrevista_pais || "",
            resultado: item.resultado || "",
          },
        ],
      })
    );
  };

  const handleVisualizar = (item) => {
    setItemVisualizado(item);
    setVisualizando(true);
  };

  const fecharVisualizacao = () => {
    setVisualizando(false);
    setItemVisualizado(null);
  };

  const handleExcluir = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este registro?")) {
      await dispatch(deleteControleInterno(id));
      dispatch(fetchControleInternoList());
    }
  };

  const salvarFormulario = () => {
    if (!avaliacoes || avaliacoes.length === 0) {
      alert("Adicione pelo menos uma avaliação antes de salvar.");
      return;
    }

    const avaliacoesInvalidas = avaliacoes
      .map((a, index) => {
        const camposObrigatorios = {
          id_pessoa_aluno: "Aluno",
          ingresso: "Ingresso",
          primeiraAval: "Primeira Avaliação",
          segundaAval: "Segunda Avaliação",
          primeiraEntrevistaPais: "Primeira Entrevista com Pais",
          segundaEntrevistaPais: "Segunda Entrevista com Pais",
          resultado: "Resultado",
        };

        const camposVazios = Object.entries(camposObrigatorios)
          .filter(([campo]) => {
            const valor = a[campo];
            if (typeof valor === "string") {
              return !valor.trim();
            }
            return !valor;
          })
          .map(([_, label]) => `• ${label}`);

        if (camposVazios.length > 0) {
          return `Avaliação ${index + 1}:\n${camposVazios.join("\n")}`;
        }
        return null;
      })
      .filter(Boolean);

    if (avaliacoesInvalidas.length > 0) {
      alert(
        `Preencha os campos obrigatórios:\n\n${avaliacoesInvalidas.join(
          "\n\n"
        )}`
      );
      return;
    }

    const payloads = avaliacoes.map((avaliacao, index) => ({
      ...(formData.id && index === 0 ? { id: formData.id } : {}),
      id_pessoa_aluno: Number(avaliacao.id_pessoa_aluno),
      dt_1_avaliacao: avaliacao.primeiraAval || null,
      dt_2_avaliacao: avaliacao.segundaAval || null,
      dt_1_entrevista_pais: avaliacao.primeiraEntrevistaPais || null,
      dt_2_entrevista_pais: avaliacao.segundaEntrevistaPais || null,
      resultado: avaliacao.resultado || null,
    }));

    Promise.all(payloads.map((payload) => dispatch(saveControleInterno(payload)).unwrap()))
      .then(() => {
        alert("Formulário de avaliação salvo com sucesso!");
        dispatch(fetchControleInternoList());
        dispatch(
          updateFormularioAvaliacao({
            data: [
              {
                id: Date.now(),
                id_pessoa_aluno: "",
                nomeUsuario: "",
                ingresso: "",
                primeiraAval: "",
                segundaAval: "",
                primeiraEntrevistaPais: "",
                segundaEntrevistaPais: "",
                resultado: "",
              },
            ],
            id: undefined,
          })
        );
      })
      .catch((err) => {
        alert(
          `Erro ao salvar formulário: ${err.message || "Erro desconhecido"}`
        );
        console.error("Erro ao salvar:", err);
      });
  };

  const limparFormulario = () => {
    dispatch(
      updateFormularioAvaliacao({
        data: [
          {
            id: Date.now(),
            id_pessoa_aluno: "",
            nomeUsuario: "",
            ingresso: "",
            primeiraAval: "",
            segundaAval: "",
            primeiraEntrevistaPais: "",
            segundaEntrevistaPais: "",
            resultado: "",
          },
        ],
        id: undefined,
      })
    );
  };

  // 🧩 Função para formatar datas em dd/mm/aaaa
  const formatarData = (dataISO) => {
    if (!dataISO) return "—";
    const [ano, mes, dia] = dataISO.split("-");
    if (!ano || !mes || !dia) return "—";
    return `${dia}/${mes}/${ano}`;
  };

  if (loading) return <div>Carregando Formulário de Avaliação...</div>;
  if (error) return <div>Erro ao carregar formulário: {error.message}</div>;

  const filteredList = controleInternoList.filter((item) => {
    const aluno = alunos.find((registro) => registro.id === item.id_pessoa_aluno);
    const nome = aluno?.nome || "";
    return nome.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="formulario-container">
      <div className="formulario-header">
        <h1>Controle Interno - Avaliação Usuários Período Experiência</h1>
      </div>

      {mensagem && <p className="mensagem-sucesso">{mensagem}</p>}

      <div className="table-container">
        <table className="avaliacao-table">
          <thead>
            <tr>
              <th>Nome do Usuário</th>
              <th>Ingresso</th>
              <th>1ª Aval</th>
              <th>2ª Aval</th>
              <th>1ª Entrevista Pais</th>
              <th>2ª Entrevista Pais</th>
              <th>Resultado</th>
            </tr>
          </thead>
          <tbody>
            {avaliacoes.map((avaliacao) => (
              <tr key={avaliacao.id}>
                <td>
                  <select
                    value={avaliacao.nomeUsuario}
                    onChange={(e) => handleAlunoChange(avaliacao.id, e.target.value)}
                    className="table-input"
                  >
                    <option value="">Selecione o aluno</option>
                    {alunos.map((aluno) => (
                      <option key={aluno.id} value={aluno.nome}>
                        {aluno.nome}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="date"
                    value={avaliacao.ingresso}
                    onChange={(e) =>
                      handleInputChange(
                        avaliacao.id,
                        "ingresso",
                        e.target.value
                      )
                    }
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="date"
                    value={avaliacao.primeiraAval}
                    onChange={(e) =>
                      handleInputChange(
                        avaliacao.id,
                        "primeiraAval",
                        e.target.value
                      )
                    }
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="date"
                    value={avaliacao.segundaAval}
                    onChange={(e) =>
                      handleInputChange(
                        avaliacao.id,
                        "segundaAval",
                        e.target.value
                      )
                    }
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="date"
                    value={avaliacao.primeiraEntrevistaPais}
                    onChange={(e) =>
                      handleInputChange(
                        avaliacao.id,
                        "primeiraEntrevistaPais",
                        e.target.value
                      )
                    }
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="date"
                    value={avaliacao.segundaEntrevistaPais}
                    onChange={(e) =>
                      handleInputChange(
                        avaliacao.id,
                        "segundaEntrevistaPais",
                        e.target.value
                      )
                    }
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="date"
                    value={avaliacao.resultado}
                    onChange={(e) =>
                      handleInputChange(
                        avaliacao.id,
                        "resultado",
                        e.target.value
                      )
                    }
                    className="table-input"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="lista-save-button">
        <button onClick={salvarFormulario} className="btn-save">
          Salvar
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
            {filteredList.map((item) => {
              const nomeAluno =
                alunos.find((aluno) => aluno.id === item.id_pessoa_aluno)?.nome ||
                `Aluno ${item.id_pessoa_aluno}`;

              return (
                <div key={item.id} className="record-row">
                  <div className="record-main">
                    <p className="record-title">{nomeAluno}</p>
                    <p className="record-subtitle">
                      Ingresso: {formatarData(item.data_entrada)}
                    </p>
                  </div>
                  <ActionMenu
                    onEdit={() => handleEditar(item)}
                    onView={() => handleVisualizar(item)}
                    onDelete={() => handleExcluir(item.id)}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Telinha de visualização */}
      {visualizando && (
        <div className="overlay-visualizar">
          <div className="visualizar-card">
            <h3>Detalhes do Registro</h3>
            <div className="visualizar-conteudo">
              {itemVisualizado ? (
                <div className="visualizacao-item">
                  <p>
                    <strong>Nome do Usuário:</strong>{" "}
                    {alunos.find((aluno) => aluno.id === itemVisualizado.id_pessoa_aluno)?.nome || "—"}
                  </p>
                  <p>
                    <strong>Ingresso:</strong>{" "}
                    {formatarData(itemVisualizado.data_entrada)}
                  </p>
                  <p>
                    <strong>1ª Avaliação:</strong>{" "}
                    {formatarData(itemVisualizado.dt_1_avaliacao)}
                  </p>
                  <p>
                    <strong>2ª Avaliação:</strong>{" "}
                    {formatarData(itemVisualizado.dt_2_avaliacao)}
                  </p>
                  <p>
                    <strong>1ª Entrevista Pais:</strong>{" "}
                    {formatarData(itemVisualizado.dt_1_entrevista_pais)}
                  </p>
                  <p>
                    <strong>2ª Entrevista Pais:</strong>{" "}
                    {formatarData(itemVisualizado.dt_2_entrevista_pais)}
                  </p>
                  <p>
                    <strong>Resultado:</strong>{" "}
                    {itemVisualizado.resultado || "—"}
                  </p>
                </div>
              ) : (
                <p>Nenhum dado disponível.</p>
              )}
            </div>
            <button className="btn-fechar" onClick={fecharVisualizacao}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormularioAvaliacao;
