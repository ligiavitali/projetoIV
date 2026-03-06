import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateFichaAcompanhamento,
  fetchFichaAcompanhamentoList,
  saveFichaAcompanhamento,
  deleteFichaAcompanhamento,
} from "../redux/slices/formulariosSlice";
import useCadastroOptions from "../hooks/useCadastroOptions";
import ActionMenu from "./ActionMenu";
import SearchInput from "./SearchInput";

const FichaAcompanhamento = () => {
  const dispatch = useDispatch();
  const {
    fichaAcompanhamento: formData,
    fichaAcompanhamentoList,
    loading,
    error,
  } = useSelector((state) => state.formularios);
  const { alunos, empresas } = useCadastroOptions();

  const [visualizando, setVisualizando] = useState(false);
  const [itemVisualizado, setItemVisualizado] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchFichaAcompanhamentoList());
  }, [dispatch]);

  const handleInputChange = (field, value) => {
    dispatch(updateFichaAcompanhamento({ [field]: value }));
  };

  const handleAlunoChange = (nomeAluno) => {
    const alunoSelecionado = alunos.find((aluno) => aluno.nome === nomeAluno);
    dispatch(
      updateFichaAcompanhamento({
        nome: nomeAluno,
        dataAdmissao: alunoSelecionado?.data_ingresso || formData.dataAdmissao || "",
      })
    );
  };

  const handleEmpresaChange = (nomeEmpresa) => {
    const empresaSelecionada = empresas.find(
      (empresa) => (empresa.nome_fantasia || empresa.razao_social) === nomeEmpresa
    );

    const contatoEmpresa =
      empresaSelecionada?.telefone_responsavel_rh ||
      empresaSelecionada?.email_responsavel_rh ||
      "";

    dispatch(
      updateFichaAcompanhamento({
        empresa: nomeEmpresa,
        responsavelRH: empresaSelecionada?.nome_responsavel_rh || "",
        contatoCom: contatoEmpresa,
      })
    );
  };

  const handleEditar = (item) => {
    dispatch(updateFichaAcompanhamento({ ...item, id: item.id }));
  };

  const handleExcluir = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este registro?")) {
      await dispatch(deleteFichaAcompanhamento(id));
      dispatch(fetchFichaAcompanhamentoList());
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
    const {
      nome,
      dataAdmissao,
      dataVisita,
      empresa,
      responsavelRH,
      contatoCom,
      parecerGeral,
    } = formData;

    const camposObrigatorios = {
      nome: "Nome",
      dataAdmissao: "Data de Admissão",
      dataVisita: "Data da Visita",
      empresa: "Empresa",
      responsavelRH: "Responsável RH",
      contatoCom: "Contato com",
      parecerGeral: "Parecer Geral",
    };

    const camposVazios = Object.entries(camposObrigatorios)
      .filter(([campo]) => !formData?.[campo]?.trim())
      .map(([_, label]) => label);

    if (camposVazios.length > 0) {
      alert(
        `Preencha os seguintes campos antes de salvar:\n\n• ${camposVazios.join(
          "\n• "
        )}`
      );
      return;
    }

    dispatch(saveFichaAcompanhamento(formData))
      .unwrap()
      .then(() => {
        alert("Ficha de Acompanhamento salva com sucesso!");
        dispatch(fetchFichaAcompanhamentoList());
        dispatch(
          updateFichaAcompanhamento({
            nome: "",
            dataAdmissao: "",
            dataVisita: "",
            empresa: "",
            responsavelRH: "",
            contatoCom: "",
            parecerGeral: "",
            id: undefined,
          })
        );
      })
      .catch((err) => {
        alert(`Erro ao salvar ficha: ${err.message || "Erro desconhecido"}`);
        console.error("Erro ao salvar:", err);
      });
  };

  const limparFormulario = () => {
    dispatch(
      updateFichaAcompanhamento({
        nome: "",
        dataAdmissao: "",
        dataVisita: "",
        empresa: "",
        responsavelRH: "",
        contatoCom: "",
        parecerGeral: "",
        id: undefined,
      })
    );
  };

  if (loading)
    return (
      <div className="loading-message">
        Carregando Ficha de Acompanhamento...
      </div>
    );
  if (error)
    return (
      <div className="error-message">
        Erro ao carregar ficha: {error.message}
      </div>
    );

  const filteredList = fichaAcompanhamentoList.filter((item) =>
    (item.nome || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="ficha-container">
      <div className="ficha-header">
        <h1>INSTITUTO DE EDUCAÇÃO ESPECIAL</h1>
        <h2>DIOMÍCIO FREITAS</h2>
        <h3>Criciúma - SC</h3>
        <h4>ACOMPANHAMENTO MERCADO DE TRABALHO</h4>
      </div>

      <div className="form-section">
        <div className="form-row">
          <div className="form-group full-width">
            <label>Nome:</label>
            <select
              value={formData.nome}
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
            <label>Data de admissão:</label>
            <input
              type="date"
              value={formData.dataAdmissao}
              onChange={(e) =>
                handleInputChange("dataAdmissao", e.target.value)
              }
            />
          </div>
          <div className="form-group">
            <label>Data da visita:</label>
            <input
              type="date"
              value={formData.dataVisita}
              onChange={(e) => handleInputChange("dataVisita", e.target.value)}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group full-width">
            <label>Empresa:</label>
            <select
              value={formData.empresa}
              onChange={(e) => handleEmpresaChange(e.target.value)}
            >
              <option value="">Selecione a empresa</option>
              {empresas.map((empresa) => {
                const nomeEmpresa = empresa.nome_fantasia || empresa.razao_social;
                return (
                  <option key={empresa.id} value={nomeEmpresa}>
                    {nomeEmpresa}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Responsável RH:</label>
            <input
              type="text"
              value={formData.responsavelRH}
              onChange={(e) =>
                handleInputChange("responsavelRH", e.target.value)
              }
              placeholder="Nome do responsável pelo RH"
            />
          </div>
          <div className="form-group">
            <label>Contato com:</label>
            <input
              type="text"
              value={formData.contatoCom}
              onChange={(e) => handleInputChange("contatoCom", e.target.value)}
              placeholder="Pessoa de contato"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group full-width">
            <label>Parecer Geral:</label>
            <textarea
              value={formData.parecerGeral}
              onChange={(e) =>
                handleInputChange("parecerGeral", e.target.value)
              }
              placeholder="Descreva o parecer geral sobre o acompanhamento..."
              rows="8"
              className="parecer-textarea"
            />
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button onClick={salvarFormulario} className="btn-save">
          Salvar Ficha
        </button>
        <button onClick={limparFormulario} className="btn-clear">
          Limpar Formulário
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
                  <p className="record-title">{item.nome || "Sem nome"}</p>
                  <p className="record-subtitle">
                    {item.empresa || "Sem empresa"} - {item.dataVisita || "Sem data"}
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
              {itemVisualizado &&
                Object.entries(itemVisualizado || {}).map(([key, value]) => {
                  const data = new Date(value);
                  const valorFormatado =
                    !isNaN(data) &&
                    typeof value === "string" &&
                    value.includes("-")
                      ? `${String(data.getDate()).padStart(2, "0")}/${String(
                          data.getMonth() + 1
                        ).padStart(2, "0")}/${data.getFullYear()}`
                      : value;

                  return (
                    <p key={key}>
                      <strong>{key}:</strong> {valorFormatado || "—"}
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

export default FichaAcompanhamento;
