import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateFormularioAvaliacao,
  fetchControleInternoList,
  saveControleInterno,
  deleteControleInterno,
} from "../redux/slices/formulariosSlice";

const FormularioAvaliacao = () => {
  const dispatch = useDispatch();
  const {
    formularioAvaliacao: formData,
    controleInternoList,
    loading,
    error,
  } = useSelector((state) => state.formularios);

  const avaliacoes = formData.data || [
    {
      id: Date.now(),
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

  // Estados da telinha de visualização
  const [visualizando, setVisualizando] = useState(false);
  const [itemVisualizado, setItemVisualizado] = useState(null);

  useEffect(() => {
    dispatch(fetchControleInternoList());
  }, [dispatch]);

  const handleInputChange = (id, field, value) => {
    const updatedAvaliacoes = avaliacoes.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    dispatch(updateFormularioAvaliacao({ data: updatedAvaliacoes }));
  };

  const handleEditar = (item) => {
    dispatch(updateFormularioAvaliacao({ data: item.data, id: item.id }));
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
          nomeUsuario: "Nome do Usuário",
          ingresso: "Ingresso",
          primeiraAval: "Primeira Avaliação",
          segundaAval: "Segunda Avaliação",
          primeiraEntrevistaPais: "Primeira Entrevista com Pais",
          segundaEntrevistaPais: "Segunda Entrevista com Pais",
          resultado: "Resultado",
        };

        const camposVazios = Object.entries(camposObrigatorios)
          .filter(([campo]) => !a[campo]?.trim())
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

    const dataToSave = {
      id: formData.id,
      data: avaliacoes,
      nomeUsuario:
        avaliacoes
          .map((a) => a.nomeUsuario)
          .filter((n) => n)
          .join(", ") || "Registro Sem Nome",
    };

    dispatch(saveControleInterno(dataToSave))
      .unwrap()
      .then(() => {
        alert("Formulário de avaliação salvo com sucesso!");
        dispatch(fetchControleInternoList());
        dispatch(
          updateFormularioAvaliacao({
            data: [
              {
                id: Date.now(),
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

  if (loading) return <div>Carregando Formulário de Avaliação...</div>;
  if (error) return <div>Erro ao carregar formulário: {error.message}</div>;

  return (
    <div className="formulario-container">
      <div className="formulario-header">
        <h1>Controle Interno - Avaliação Usuários Período Experiência</h1>
      </div>

      {mensagem && <p className="mensagem-sucesso">{mensagem}</p>}

      <div className="formulario-actions">
        {/* Botão de adicionar linha removido */}
        <button onClick={salvarFormulario} className="btn-save">
          Salvar Formulário
        </button>
        <button onClick={limparFormulario} className="btn-clear">
          Limpar Tudo
        </button>
      </div>

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
              {/* Ações dentro do formulário removidas */}
            </tr>
          </thead>
          <tbody>
            {avaliacoes.map((avaliacao) => (
              <tr key={avaliacao.id}>
                <td>
                  <input
                    type="text"
                    value={avaliacao.nomeUsuario}
                    onChange={(e) =>
                      handleInputChange(
                        avaliacao.id,
                        "nomeUsuario",
                        e.target.value
                      )
                    }
                    className="table-input"
                  />
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

      <div className="lista-registros">
        {controleInternoList.length === 0 ? (
          <p>Nenhum registro salvo.</p>
        ) : (
          <ul>
            {controleInternoList.map((item) => (
              <li key={item.id}>
                {item.nomeUsuario}{" "}
                <button
                  className="btn-editar"
                  onClick={() => handleEditar(item)}
                >
                  Editar
                </button>{" "}
                <button
                  className="btn-visualizar"
                  onClick={() => handleVisualizar(item)}
                >
                  Visualizar
                </button>{" "}
                <button
                  className="btn-excluir"
                  onClick={() => handleExcluir(item.id)}
                >
                  Excluir
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Telinha de visualização */}
      {visualizando && (
        <div className="overlay-visualizar">
          <div className="visualizar-card">
            <h3>Detalhes do Registro</h3>
            <div className="visualizar-conteudo">
              {itemVisualizado.data && itemVisualizado.data.length > 0 ? (
                itemVisualizado.data.map((avaliacao, index) => (
                  <div key={avaliacao.id} className="visualizacao-item">
                    <h4>Avaliação {index + 1}</h4>
                    <p>
                      <strong>Nome do Usuário:</strong>{" "}
                      {avaliacao.nomeUsuario || "—"}
                    </p>
                    <p>
                      <strong>Ingresso:</strong> {avaliacao.ingresso || "—"}
                    </p>
                    <p>
                      <strong>1ª Avaliação:</strong>{" "}
                      {avaliacao.primeiraAval || "—"}
                    </p>
                    <p>
                      <strong>2ª Avaliação:</strong>{" "}
                      {avaliacao.segundaAval || "—"}
                    </p>
                    <p>
                      <strong>1ª Entrevista Pais:</strong>{" "}
                      {avaliacao.primeiraEntrevistaPais || "—"}
                    </p>
                    <p>
                      <strong>2ª Entrevista Pais:</strong>{" "}
                      {avaliacao.segundaEntrevistaPais || "—"}
                    </p>
                    <p>
                      <strong>Resultado:</strong> {avaliacao.resultado || "—"}
                    </p>
                    <hr />
                  </div>
                ))
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
