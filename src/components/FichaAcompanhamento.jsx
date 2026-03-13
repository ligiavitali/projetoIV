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
        id_pessoa_aluno: alunoSelecionado?.id || "",
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
        id_empresa: empresaSelecionada?.id || "",
        empresa: nomeEmpresa,
        responsavelRH: empresaSelecionada?.nome_responsavel_rh || "",
        contatoCom: contatoEmpresa,
      })
    );
  };

  const handleEditar = (item) => {
    const idAluno = item.id_pessoa_aluno ?? item.idPessoaAluno ?? "";
    const idEmpresa = item.id_empresa ?? item.idEmpresa ?? "";

    const alunoSelecionado = alunos.find((aluno) => String(aluno.id) === String(idAluno));
    const empresaSelecionada = empresas.find((empresa) => String(empresa.id) === String(idEmpresa));

    const nomeEmpresa =
      item.empresa ||
      empresaSelecionada?.nome_fantasia ||
      empresaSelecionada?.razao_social ||
      "";

    dispatch(
      updateFichaAcompanhamento({
        id: item.id,
        id_pessoa_aluno: idAluno,
        id_empresa: idEmpresa,
        nome: item.nome || alunoSelecionado?.nome || "",
        dataAdmissao: item.dataAdmissao || item.data_admissao || "",
        dataVisita: item.dataVisita || item.data_visita || "",
        empresa: nomeEmpresa,
        responsavelRH:
          item.responsavelRH ||
          empresaSelecionada?.nome_responsavel_rh ||
          "",
        contatoCom:
          item.contatoCom ||
          empresaSelecionada?.telefone_responsavel_rh ||
          empresaSelecionada?.email_responsavel_rh ||
          "",
        parecerGeral: item.parecerGeral || item.parecer_geral || "",
      })
    );
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

    const alunoSelecionado = alunos.find((aluno) => aluno.nome === nome);
    const empresaSelecionada = empresas.find(
      (empresaItem) => (empresaItem.nome_fantasia || empresaItem.razao_social) === empresa
    );

    const payload = {
      id: formData.id,
      id_pessoa_aluno: formData.id_pessoa_aluno || alunoSelecionado?.id || null,
      data_admissao: dataAdmissao || null,
      data_visita: dataVisita || null,
      id_empresa: formData.id_empresa || empresaSelecionada?.id || null,
      parecer_geral: parecerGeral || null,
    };

    dispatch(saveFichaAcompanhamento(payload))
      .unwrap()
      .then(() => {
        alert("Ficha de Acompanhamento salva com sucesso!");
        dispatch(fetchFichaAcompanhamentoList());
        dispatch(
          updateFichaAcompanhamento({
            id_pessoa_aluno: "",
            id_empresa: "",
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
        id_pessoa_aluno: "",
        id_empresa: "",
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

  const camposOcultosVisualizacao = new Set([
    "id",
    "id_pessoa_aluno",
    "id_empresa",
    "nome",
    "empresa",
    "dataAdmissao",
    "dataVisita",
    "responsavelRH",
    "contatoCom",
    "parecerGeral",
    "data_admissao",
    "data_visita",
    "parecer_geral",
  ]);

  const formatarData = (valor) => {
    if (!valor) return "-";
    const data = new Date(valor);
    if (Number.isNaN(data.getTime())) return valor;
    return `${String(data.getDate()).padStart(2, "0")}/${String(
      data.getMonth() + 1
    ).padStart(2, "0")}/${data.getFullYear()}`;
  };

  const dadosVisualizacao = itemVisualizado || {};
  const nomeAlunoVisualizacao =
    dadosVisualizacao.nome ||
    alunos.find(
      (aluno) => String(aluno.id) === String(dadosVisualizacao.id_pessoa_aluno)
    )?.nome ||
    "-";
  const nomeEmpresaVisualizacao =
    dadosVisualizacao.empresa ||
    empresas.find(
      (empresa) => String(empresa.id) === String(dadosVisualizacao.id_empresa)
    )?.nome_fantasia ||
    empresas.find(
      (empresa) => String(empresa.id) === String(dadosVisualizacao.id_empresa)
    )?.razao_social ||
    "-";
  const dataAdmissaoVisualizacao =
    dadosVisualizacao.dataAdmissao || dadosVisualizacao.data_admissao || "";
  const dataVisitaVisualizacao =
    dadosVisualizacao.dataVisita || dadosVisualizacao.data_visita || "";
  const responsavelRHVisualizacao = dadosVisualizacao.responsavelRH || "-";
  const contatoComVisualizacao = dadosVisualizacao.contatoCom || "-";
  const parecerGeralVisualizacao =
    dadosVisualizacao.parecerGeral || dadosVisualizacao.parecer_geral || "-";

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
              {itemVisualizado && (
                <>
                  <p>
                    <strong>Nome:</strong> {nomeAlunoVisualizacao}
                  </p>
                  <p>
                    <strong>Data de admissão:</strong> {formatarData(dataAdmissaoVisualizacao)}
                  </p>
                  <p>
                    <strong>Data da visita:</strong> {formatarData(dataVisitaVisualizacao)}
                  </p>
                  <p>
                    <strong>Empresa:</strong> {nomeEmpresaVisualizacao}
                  </p>
                  <p>
                    <strong>Responsável RH:</strong> {responsavelRHVisualizacao}
                  </p>
                  <p>
                    <strong>Contato com:</strong> {contatoComVisualizacao}
                  </p>
                  <p>
                    <strong>Parecer Geral:</strong> {parecerGeralVisualizacao}
                  </p>
                </>
              )}

              {itemVisualizado &&
                Object.entries(itemVisualizado || {})
                  .filter(([key]) => !camposOcultosVisualizacao.has(key))
                  .map(([key, value]) => (
                    <p key={key}>
                      <strong>{key}:</strong> {String(value || "-")}
                    </p>
                  ))}
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
