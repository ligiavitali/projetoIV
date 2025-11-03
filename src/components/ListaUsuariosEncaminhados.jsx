import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateListaUsuariosEncaminhados,
  fetchListaUsuariosEncaminhadosList,
  saveListaUsuariosEncaminhados,
  deleteListaUsuariosEncaminhados,
} from "../redux/slices/formulariosSlice";

const ListaUsuariosEncaminhados = () => {
  const dispatch = useDispatch();
  const {
    listaUsuariosEncaminhados: formData,
    listaUsuariosEncaminhadosList,
    loading,
    error,
  } = useSelector((state) => state.formularios);
  const { anoReferencia, usuarios, id } = formData;

  const [visualizando, setVisualizando] = useState(false);
  const [itemVisualizado, setItemVisualizado] = useState(null);

  useEffect(() => {
    dispatch(fetchListaUsuariosEncaminhadosList());
  }, [dispatch]);

  const handleInputChange = (id, field, value) => {
    const updatedUsuarios = usuarios.map((usuario) =>
      usuario.id === id ? { ...usuario, [field]: value } : usuario
    );
    dispatch(updateListaUsuariosEncaminhados({ usuarios: updatedUsuarios }));
  };

  const handleAnoChange = (value) => {
    dispatch(updateListaUsuariosEncaminhados({ anoReferencia: value }));
  };

  const removerLinha = (id) => {
    if (usuarios.length > 1) {
      const novosUsuarios = usuarios.filter((usuario) => usuario.id !== id);
      const updatedUsuarios = novosUsuarios.map((usuario, index) => ({
        ...usuario,
        numero: String(index + 1).padStart(2, "0"),
      }));
      dispatch(updateListaUsuariosEncaminhados({ usuarios: updatedUsuarios }));
    }
  };

  const handleEditar = (item) => {
    dispatch(updateListaUsuariosEncaminhados({ ...item, id: item.id }));
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
      await dispatch(deleteListaUsuariosEncaminhados(id));
      dispatch(fetchListaUsuariosEncaminhadosList());
    }
  };

  const salvarLista = () => {
    if (!usuarios || usuarios.length === 0) {
      alert("Adicione pelo menos um usuário antes de salvar.");
      return;
    }

    if (!anoReferencia?.trim()) {
      alert("O campo 'Ano de Referência' é obrigatório.");
      return;
    }

    const usuariosComCamposVazios = usuarios
      .map((u, index) => {
        const camposObrigatorios = {
          numero: "Número",
          nome: "Nome",
          empresa: "Empresa",
          funcao: "Função",
          contatoRH: "Contato RH",
          provavelDataDesligamento: "Provável Data de Desligamento",
        };

        const camposVazios = Object.entries(camposObrigatorios)
          .filter(([campo]) => !u[campo]?.trim())
          .map(([_, label]) => `• ${label}`);

        if (camposVazios.length > 0) {
          return `Usuário ${u.numero || index + 1}:\n${camposVazios.join(
            "\n"
          )}`;
        }
        return null;
      })
      .filter(Boolean);

    if (usuariosComCamposVazios.length > 0) {
      alert(
        `Preencha os campos obrigatórios:\n\n${usuariosComCamposVazios.join(
          "\n\n"
        )}`
      );
      return;
    }

    dispatch(saveListaUsuariosEncaminhados({ id, anoReferencia, usuarios }))
      .unwrap()
      .then(() => {
        alert("Lista de Usuários Encaminhados salva com sucesso!");
        dispatch(fetchListaUsuariosEncaminhadosList());
        dispatch(
          updateListaUsuariosEncaminhados({
            anoReferencia: "2025",
            usuarios: [
              {
                id: 1,
                numero: "01",
                nome: "",
                dataAdmissao: "",
                empresa: "",
                funcao: "",
                contatoRH: "",
                provavelDataDesligamento: "",
              },
            ],
            id: undefined,
          })
        );
      })
      .catch((err) => {
        alert(`Erro ao salvar lista: ${err.message || "Erro desconhecido"}`);
        console.error("Erro ao salvar:", err);
      });
  };

  const limparLista = () => {
    dispatch(
      updateListaUsuariosEncaminhados({
        anoReferencia: "2025",
        usuarios: [
          {
            id: 1,
            numero: "01",
            nome: "",
            dataAdmissao: "",
            empresa: "",
            funcao: "",
            contatoRH: "",
            provavelDataDesligamento: "",
          },
        ],
        id: undefined,
      })
    );
  };

  if (loading)
    return (
      <div className="loading-message">
        Carregando Lista de Usuários Encaminhados...
      </div>
    );
  if (error)
    return (
      <div className="error-message">
        Erro ao carregar lista: {error.message}
      </div>
    );

  const registrosFiltrados = listaUsuariosEncaminhadosList.filter(
    (item) => item.anoReferencia === anoReferencia
  );

  return (
    <div className="lista-container">
      {/* Header */}
      <div className="lista-header">
        <h1>INSTITUTO DE EDUCAÇÃO ESPECIAL</h1>
        <h2>DIOMÍCIO FREITAS</h2>
        <h3>CRICIÚMA - SC</h3>
        <div className="titulo-ano">
          <h4>Usuários encaminhados ao Trabalho em</h4>
          <input
            type="number"
            value={anoReferencia}
            onChange={(e) => handleAnoChange(e.target.value)}
            className="ano-input"
            min="2020"
            max="2030"
          />
        </div>
        <p className="instituicao">IEEDF</p>
      </div>

      {/* Ações */}
      <div className="lista-actions">
        <button onClick={salvarLista} className="btn-save">
          Salvar Lista
        </button>
        <button onClick={limparLista} className="btn-clear">
          Limpar Lista
        </button>
      </div>

      {/* Tabela de Edição */}
      <div className="table-container">
        <table className="usuarios-table">
          <thead>
            <tr>
              <th>Nº</th>
              <th>Nome</th>
              <th>Data Admissão</th>
              <th>Empresa</th>
              <th>Função</th>
              <th>Contato RH</th>
              <th>Provável data desligamento IEEDF</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td className="numero-cell">{usuario.numero}</td>
                <td>
                  <input
                    type="text"
                    value={usuario.nome}
                    onChange={(e) =>
                      handleInputChange(usuario.id, "nome", e.target.value)
                    }
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="date"
                    value={usuario.dataAdmissao}
                    onChange={(e) =>
                      handleInputChange(
                        usuario.id,
                        "dataAdmissao",
                        e.target.value
                      )
                    }
                    className="table-input date-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={usuario.empresa}
                    onChange={(e) =>
                      handleInputChange(usuario.id, "empresa", e.target.value)
                    }
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={usuario.funcao}
                    onChange={(e) =>
                      handleInputChange(usuario.id, "funcao", e.target.value)
                    }
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={usuario.contatoRH}
                    onChange={(e) =>
                      handleInputChange(usuario.id, "contatoRH", e.target.value)
                    }
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="date"
                    value={usuario.provavelDataDesligamento}
                    onChange={(e) =>
                      handleInputChange(
                        usuario.id,
                        "provavelDataDesligamento",
                        e.target.value
                      )
                    }
                    className="table-input date-input"
                  />
                </td>
                <td>
                  <button
                    onClick={() => removerLinha(usuario.id)}
                    className="btn-excluir"
                    disabled={usuarios.length === 1}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Lista Geral (apenas nome) */}
      <div className="lista-registros">
        {registrosFiltrados.length === 0 ? (
          <p>Nenhum registro salvo para o ano {anoReferencia}.</p>
        ) : (
          <ul>
            {registrosFiltrados.map((item) => (
              <li key={item.id}>
                <ul>
                  {item.usuarios.map((u) => (
                    <li key={u.id}>{u.nome}</li>
                  ))}
                </ul>
                <div style={{ marginTop: "5px" }}>
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
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Visualização Detalhada */}
      {visualizando && itemVisualizado && (
        <div className="overlay-visualizar">
          <div className="visualizar-card">
            <h3>Detalhes da Lista</h3>
            <div className="visualizar-conteudo">
              <p>
                <strong>Ano de Referência:</strong>{" "}
                {itemVisualizado.anoReferencia}
              </p>
              {itemVisualizado.usuarios.map((u) => {
                const dataAdmissao = u.dataAdmissao
                  ? `${String(new Date(u.dataAdmissao).getDate()).padStart(
                      2,
                      "0"
                    )}/${String(
                      new Date(u.dataAdmissao).getMonth() + 1
                    ).padStart(2, "0")}/${new Date(
                      u.dataAdmissao
                    ).getFullYear()}`
                  : "-";
                const dataDesligamento = u.provavelDataDesligamento
                  ? `${String(
                      new Date(u.provavelDataDesligamento).getDate()
                    ).padStart(2, "0")}/${String(
                      new Date(u.provavelDataDesligamento).getMonth() + 1
                    ).padStart(2, "0")}/${new Date(
                      u.provavelDataDesligamento
                    ).getFullYear()}`
                  : "-";

                return (
                  <p key={u.id}>
                    <strong>
                      {u.numero} - {u.nome}
                    </strong>
                    : {u.empresa} - {u.funcao} - {u.contatoRH} - Admissão:{" "}
                    {dataAdmissao} - Desligamento: {dataDesligamento}
                  </p>
                );
              })}
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

export default ListaUsuariosEncaminhados;
