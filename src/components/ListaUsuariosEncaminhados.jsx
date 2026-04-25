import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateListaUsuariosEncaminhados,
  fetchListaUsuariosEncaminhadosList,
  saveListaUsuariosEncaminhados,
  deleteListaUsuariosEncaminhados,
} from "../redux/slices/formulariosSlice";
import useCadastroOptions from "../hooks/useCadastroOptions";
import ActionMenu from "./ActionMenu";
import SearchInput from "./SearchInput";

const ListaUsuariosEncaminhados = () => {
  const dispatch = useDispatch();
  const {
    listaUsuariosEncaminhados: formData,
    listaUsuariosEncaminhadosList,
    loading,
    error,
  } = useSelector((state) => state.formularios);
  const { alunos, empresas, funcoes } = useCadastroOptions();
  const { usuarios, id } = formData;

  const [visualizando, setVisualizando] = useState(false);
  const [itemVisualizado, setItemVisualizado] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroAno, setFiltroAno] = useState(String(new Date().getFullYear()));

  useEffect(() => {
    dispatch(fetchListaUsuariosEncaminhadosList());
  }, [dispatch]);

  const handleInputChange = (id, field, value) => {
    const updatedUsuarios = usuarios.map((usuario) =>
      usuario.id === id ? { ...usuario, [field]: value } : usuario
    );
    dispatch(updateListaUsuariosEncaminhados({ usuarios: updatedUsuarios }));
  };

  const handleAlunoChange = (id, nomeAluno) => {
    const alunoSelecionado = alunos.find((aluno) => aluno.nome === nomeAluno);
    const updatedUsuarios = usuarios.map((usuario) =>
      usuario.id === id
        ? {
            ...usuario,
            id_pessoa_aluno: alunoSelecionado?.id || "",
            nome: nomeAluno,
            dataAdmissao: alunoSelecionado?.data_ingresso || usuario.dataAdmissao || "",
          }
        : usuario
    );
    dispatch(updateListaUsuariosEncaminhados({ usuarios: updatedUsuarios }));
  };

  const handleEmpresaChange = (id, nomeEmpresa) => {
    const empresaSelecionada = empresas.find(
      (empresa) => (empresa.nome_fantasia || empresa.razao_social) === nomeEmpresa
    );

    const contatoEmpresa =
      empresaSelecionada?.telefone_responsavel_rh ||
      empresaSelecionada?.email_responsavel_rh ||
      empresaSelecionada?.nome_responsavel_rh ||
      "";

    const updatedUsuarios = usuarios.map((usuario) =>
      usuario.id === id
        ? {
            ...usuario,
            empresa: nomeEmpresa,
            contatoRH: contatoEmpresa,
          }
        : usuario
    );
    dispatch(updateListaUsuariosEncaminhados({ usuarios: updatedUsuarios }));
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

    dispatch(saveListaUsuariosEncaminhados({ id, usuarios }))
      .unwrap()
      .then(() => {
        alert("Lista de Usuários Encaminhados salva com sucesso!");
        dispatch(fetchListaUsuariosEncaminhadosList());
        dispatch(
          updateListaUsuariosEncaminhados({
            usuarios: [
              {
                id: 1,
                numero: "01",
                nome: "",
                dataAdmissao: "",
                empresa: "",
                funcao: "",
                contatoRH: "",
                dataEncaminhamento: "",
                provavelDataDesligamento: "",
                statusEncaminhamento: "ativo",
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

  const registrosFiltrados = listaUsuariosEncaminhadosList.filter((item) => {
    if (!filtroAno?.trim()) {
      return true;
    }

    return (item.usuarios || []).some((usuario) => {
      if (!usuario?.dataEncaminhamento) {
        return false;
      }

      const anoUsuario = String(new Date(usuario.dataEncaminhamento).getFullYear());
      return anoUsuario === String(filtroAno).trim();
    });
  });

  const registrosPesquisa = registrosFiltrados.filter((item) => {
    const nomes = (item.usuarios || []).map((usuario) => usuario.nome || "").join(" ");
    return nomes.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const formatarData = (valor) => {
    if (!valor) return "-";
    const data = new Date(valor);
    if (Number.isNaN(data.getTime())) return "-";
    return `${String(data.getDate()).padStart(2, "0")}/${String(
      data.getMonth() + 1
    ).padStart(2, "0")}/${data.getFullYear()}`;
  };

  return (
    <div className="lista-container">
      {/* Header */}
      <div className="lista-header">
        <h1>INSTITUTO DE EDUCAÇÃO ESPECIAL</h1>
        <h2>DIOMÍCIO FREITAS</h2>
        <h3>CRICIÚMA - SC</h3>
        <div className="titulo-ano">
          <h4>Filtro por ano (data de encaminhamento)</h4>
          <input
            type="number"
            value={filtroAno}
            onChange={(e) => setFiltroAno(e.target.value)}
            className="ano-input"
            min="2020"
            max="2030"
          />
        </div>
      </div>

      {/* Tabela de Edição */}
      <div className="table-container">
        <table className="usuarios-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Data Admissão</th>
              <th>Empresa</th>
              <th>Função</th>
              <th>Contato RH</th>
              <th>Data Encaminhamento</th>
              <th>Desligamento</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td>
                  <select
                    value={usuario.nome}
                    onChange={(e) => handleAlunoChange(usuario.id, e.target.value)}
                    className="table-input"
                  >
                    <option value="">Selecionar</option>
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
                  <select
                    value={usuario.empresa}
                    onChange={(e) => handleEmpresaChange(usuario.id, e.target.value)}
                    className="table-input"
                  >
                    <option value="">Selecionar</option>
                    {empresas.map((empresa) => {
                      const nomeEmpresa = empresa.nome_fantasia || empresa.razao_social;
                      return (
                        <option key={empresa.id} value={nomeEmpresa}>
                          {nomeEmpresa}
                        </option>
                      );
                    })}
                  </select>
                </td>
                <td>
                  <select
                    value={usuario.funcao}
                    onChange={(e) =>
                      handleInputChange(usuario.id, "funcao", e.target.value)
                    }
                    className="table-input"
                  >
                    <option value="">Selecionar</option>
                    {funcoes.map((funcao) => (
                      <option key={funcao.id} value={funcao.titulo_funcao}>
                        {funcao.titulo_funcao}
                      </option>
                    ))}
                  </select>
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
                    value={usuario.dataEncaminhamento || ""}
                    onChange={(e) => {
                      handleInputChange(
                        usuario.id,
                        "dataEncaminhamento",
                        e.target.value
                      );
                    }}
                    className="table-input date-input"
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
                  <select
                    value={usuario.statusEncaminhamento || "ativo"}
                    onChange={(e) =>
                      handleInputChange(
                        usuario.id,
                        "statusEncaminhamento",
                        e.target.value
                      )
                    }
                    className="table-input status-select"
                  >
                    <option value="ativo">Ativo</option>
                    <option value="inativo">Inativo</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Botão Salvar */}
      <div className="lista-save-button">
        <button onClick={salvarLista} className="btn-save">
          Salvar
        </button>
      </div>

      {/* Lista Geral (apenas nome) */}
      <div className="lista-registros">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Pesquisar pelo nome..."
        />
        {registrosPesquisa.length === 0 ? (
          <p>Nenhum registro salvo para o filtro informado.</p>
        ) : (
          <div className="record-list">
            {registrosPesquisa.map((item) => {
              const nomes = (item.usuarios || [])
                .map((u) => u.nome)
                .filter(Boolean)
                .join(", ");

              return (
                <div key={item.id} className="record-row">
                  <div className="record-main">
                    <p className="record-title">{nomes || "Sem usuarios"}</p>
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

      {/* Visualização Detalhada */}
      {visualizando && itemVisualizado && (
        <div className="overlay-visualizar">
          <div className="visualizar-card">
            <h3>Detalhes da Lista</h3>
            <div className="visualizar-conteudo">
              {itemVisualizado.usuarios.map((u) => {
                return (
                  <div key={u.id} style={{ marginBottom: "0.9rem" }}>
                    <p>
                      <strong>Nome:</strong> {u.nome || "-"}
                    </p>
                    <p>
                      <strong>Empresa:</strong> {u.empresa || "-"}
                    </p>
                    <p>
                      <strong>Função:</strong> {u.funcao || "-"}
                    </p>
                    <p>
                      <strong>Contato RH:</strong> {u.contatoRH || "-"}
                    </p>
                    <p>
                      <strong>Data de Admissão:</strong> {formatarData(u.dataAdmissao)}
                    </p>
                    <p>
                      <strong>Data de Encaminhamento:</strong> {formatarData(u.dataEncaminhamento)}
                    </p>
                    <p>
                      <strong>Provável data de desligamento:</strong> {formatarData(u.provavelDataDesligamento)}
                    </p>
                    <p>
                      <strong>Status do encaminhamento:</strong> {u.statusEncaminhamento || "ativo"}
                    </p>
                  </div>
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
