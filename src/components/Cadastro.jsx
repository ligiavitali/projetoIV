import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCadastroAbaData } from "../redux/slices/cadastroSlice";
import {
  pessoasSchema,
  empresasSchema,
  funcoesSchema,
  avaliacaoSchema,
} from "../utils/validationSchemas";
import { normalizeDatesInPayload } from "../lib/dateUtils";
import ActionMenu from "./ActionMenu";
import SearchInput from "./SearchInput";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";
const endpointMap = {
  pessoas: "pessoas",
  empresas: "empresas",
  funcoes: "funcoes-cargos",
  avaliacao: "itens-avaliacao",
};

const Cadastro = () => {
  const dispatch = useDispatch();
  const { cadastroData } = useSelector((state) => state.cadastro);

  const [activeTab, setActiveTab] = useState("pessoas");
  const formData = cadastroData;
  const [errors, setErrors] = useState({});
  const [registros, setRegistros] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Estado da telinha (visualização)
  const [visualizando, setVisualizando] = useState(false);
  const [itemVisualizado, setItemVisualizado] = useState(null);

  const carregarDados = async () => {
    try {
      const endpoint = endpointMap[activeTab] || activeTab;
      const response = await fetch(`${API_URL}/${endpoint}`);
      const data = await response.json();
      setRegistros(normalizeDatesInPayload(data));
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  };

  useEffect(() => {
    carregarDados();
  }, [activeTab]);

  useEffect(() => {
    setSearchTerm("");
  }, [activeTab]);

  const handleChange = (tab, field, value) => {
    dispatch(updateCadastroAbaData({ aba: tab, data: { [field]: value } }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const formatCpf = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    return digits
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };

  const formatTelefone = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 10) {
      return digits
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{4})(\d)/, "$1-$2");
    }
    return digits
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpointName = endpointMap[activeTab] || activeTab;
    const url = `${API_URL}/${endpointName}`;
    const data = formData[activeTab];

    try {
      const schemaMap = {
        pessoas: pessoasSchema,
        empresas: empresasSchema,
        funcoes: funcoesSchema,
        avaliacao: avaliacaoSchema,
      };

      const schema = schemaMap[activeTab];
      await schema.validate(data, { abortEarly: false });

      const metodo = data.id ? "PUT" : "POST";
      const endpoint = data.id ? `${url}/${data.id}` : url;

      const response = await fetch(endpoint, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert(`Dados de ${activeTab} salvos com sucesso!`);
        carregarDados();
        dispatch(
          updateCadastroAbaData({
            aba: activeTab,
            data: Object.fromEntries(
              Object.keys(formData[activeTab]).map((key) => [key, ""])
            ),
          })
        );
        setErrors({});
      } else {
        alert("Erro ao salvar dados!");
      }
    } catch (error) {
      if (error.name === "ValidationError") {
        const validationErrors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors);
      } else {
        console.error("Erro ao enviar dados:", error);
      }
    }
  };

  const handleExcluir = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este registro?"))
      return;
    try {
      const endpointName = endpointMap[activeTab] || activeTab;
      const response = await fetch(`${API_URL}/${endpointName}/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        alert("Registro excluído com sucesso!");
        carregarDados();
      } else {
        alert("Erro ao excluir registro!");
      }
    } catch (error) {
      console.error("Erro ao excluir registro:", error);
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

  const handleEditar = (item) => {
    const sanitizedItem = Object.fromEntries(
      Object.entries(item).map(([key, value]) => [key, value ?? ""])
    );
    dispatch(updateCadastroAbaData({ aba: activeTab, data: sanitizedItem }));
  };

  // Renderiza erros de campo
  const renderFieldError = (field) =>
    errors[field] && <p className="error-message">{errors[field]}</p>;

  // Formulários
  const renderPessoasForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label>Nome Completo</label>
          <input
            type="text"
            value={formData.pessoas.nome}
            onChange={(e) => handleChange("pessoas", "nome", e.target.value)}
            placeholder="Digite o nome completo"
          />
          {renderFieldError("nome")}
        </div>

        <div className="form-group">
          <label>E-mail</label>
          <input
            type="email"
            value={formData.pessoas.email}
            onChange={(e) => handleChange("pessoas", "email", e.target.value)}
            placeholder="Digite o e-mail"
          />
          {renderFieldError("email")}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Telefone</label>
          <input
            type="tel"
            value={formData.pessoas.telefone}
            onChange={(e) =>
              handleChange("pessoas", "telefone", formatTelefone(e.target.value))
            }
            placeholder="(11) 99999-9999"
          />
          {renderFieldError("telefone")}
        </div>

        <div className="form-group">
          <label>CPF</label>
          <input
            type="text"
            value={formData.pessoas.cpf}
            onChange={(e) =>
              handleChange("pessoas", "cpf", formatCpf(e.target.value))
            }
            placeholder="000.000.000-00"
          />
          {renderFieldError("cpf")}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Perfil</label>
          <select
            value={formData.pessoas.cargo}
            onChange={(e) => {
              const novoCargo = e.target.value;
              handleChange("pessoas", "cargo", novoCargo);
              if (novoCargo !== "Aluno") {
                handleChange("pessoas", "dataIngresso", "");
                handleChange("pessoas", "data_nascimento", "");
                handleChange("pessoas", "nome_responsavel", "");
                handleChange("pessoas", "telefone_responsavel", "");
                handleChange("pessoas", "usa_medicamento", "");
                handleChange("pessoas", "info_medicamentos", "");
              }
            }}
          >
            <option value="">Selecione</option>
            <option value="Professor">Professor</option>
            <option value="Aluno">Aluno</option>
          </select>
          {renderFieldError("cargo")}
        </div>

        {formData.pessoas.cargo === "Aluno" && (
          <div className="form-group">
            <label>Data de Ingresso</label>
            <input
              type="date"
              value={formData.pessoas.dataIngresso}
              onChange={(e) =>
                handleChange("pessoas", "dataIngresso", e.target.value)
              }
            />
            {renderFieldError("dataIngresso")}
          </div>
        )}
      </div>

      {formData.pessoas.cargo === "Aluno" && (
        <>
          <div className="form-row">
            <div className="form-group">
              <label>Data de Nascimento</label>
              <input
                type="date"
                value={formData.pessoas.data_nascimento}
                onChange={(e) =>
                  handleChange("pessoas", "data_nascimento", e.target.value)
                }
              />
              {renderFieldError("data_nascimento")}
            </div>

            <div className="form-group">
              <label>Nome do Responsável</label>
              <input
                type="text"
                value={formData.pessoas.nome_responsavel}
                onChange={(e) =>
                  handleChange("pessoas", "nome_responsavel", e.target.value)
                }
                placeholder="Digite o nome do responsável"
              />
              {renderFieldError("nome_responsavel")}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Telefone do Responsável</label>
              <input
                type="tel"
                value={formData.pessoas.telefone_responsavel}
                onChange={(e) =>
                  handleChange(
                    "pessoas",
                    "telefone_responsavel",
                    formatTelefone(e.target.value)
                  )
                }
                placeholder="(11) 99999-9999"
              />
              {renderFieldError("telefone_responsavel")}
            </div>

            <div className="form-group">
              <label>Usa Medicamento?</label>
              <select
                value={formData.pessoas.usa_medicamento}
                onChange={(e) => {
                  const usaMedicamento = e.target.value;
                  handleChange("pessoas", "usa_medicamento", usaMedicamento);
                  if (usaMedicamento !== "Sim") {
                    handleChange("pessoas", "info_medicamentos", "");
                  }
                }}
              >
                <option value="">Selecione</option>
                <option value="Sim">Sim</option>
                <option value="Não">Não</option>
              </select>
              {renderFieldError("usa_medicamento")}
            </div>
          </div>

          {formData.pessoas.usa_medicamento === "Sim" && (
            <div className="form-group">
              <label>Informações dos Medicamentos</label>
              <input
                type="text"
                value={formData.pessoas.info_medicamentos}
                onChange={(e) =>
                  handleChange("pessoas", "info_medicamentos", e.target.value)
                }
                placeholder="Informe os medicamentos utilizados"
              />
              {renderFieldError("info_medicamentos")}
            </div>
          )}
        </>
      )}

      <div className="form-row">
        <div className="form-group">
          <label>Status</label>
          <select
            value={formData.pessoas.status}
            onChange={(e) => handleChange("pessoas", "status", e.target.value)}
          >
            <option value="">Selecione</option>
            <option value="Ativo">Ativo</option>
            <option value="Inativo">Inativo</option>
          </select>
          {renderFieldError("status")}
        </div>
      </div>

      <button type="submit" className="submit-btn">
        Salvar Pessoa
      </button>
    </form>
  );

  const renderEmpresasForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label>Nome Fantasia</label>
          <input
            type="text"
            value={formData.empresas.nome_fantasia}
            onChange={(e) =>
              handleChange("empresas", "nome_fantasia", e.target.value)
            }
            placeholder="Digite o nome fantasia"
          />
          {renderFieldError("nome_fantasia")}
        </div>

        <div className="form-group">
          <label>Razão Social</label>
          <input
            type="text"
            value={formData.empresas.razao_social}
            onChange={(e) =>
              handleChange("empresas", "razao_social", e.target.value)
            }
            placeholder="Digite a razão social"
          />
          {renderFieldError("razao_social")}
        </div>

      </div>

      <div className="form-row">

        <div className="form-group">
          <label>CNPJ</label>
          <input
            type="text"
            value={formData.empresas.cnpj}
            onChange={(e) => handleChange("empresas", "cnpj", e.target.value)}
            placeholder="00.000.000/0000-00"
          />
          {renderFieldError("cnpj")}
        </div>

        <div className="form-group">
          <label>Endereço</label>
          <input
            type="text"
            value={formData.empresas.endereco}
            onChange={(e) =>
              handleChange("empresas", "endereco", e.target.value)
            }
            placeholder="Digite o endereço completo"
          />
          {renderFieldError("endereco")}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Telefone</label>
          <input
            type="tel"
            value={formData.empresas.telefone}
            onChange={(e) =>
              handleChange(
                "empresas",
                "telefone",
                formatTelefone(e.target.value)
              )
            }
            placeholder="(11) 3333-3333"
          />
          {renderFieldError("telefone")}
        </div>

        <div className="form-group">
          <label>Nome do Contato RH</label>
          <input
            type="text"
            value={formData.empresas.contato_rh_nome}
            onChange={(e) =>
              handleChange("empresas", "contato_rh_nome", e.target.value)
            }
            placeholder="Digite o nome do contato do RH"
          />
          {renderFieldError("contato_rh_nome")}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Número Contato RH</label>
          <input
            type="tel"
            value={formData.empresas.contato_rh_telefone}
            onChange={(e) =>
              handleChange(
                "empresas",
                "contato_rh_telefone",
                formatTelefone(e.target.value)
              )
            }
            placeholder="(11) 99999-9999"
          />
          {renderFieldError("contato_rh_telefone")}
        </div>

        <div className="form-group">
          <label>E-mail do Contato RH</label>
          <input
            type="email"
            value={formData.empresas.contato_rh_email}
            onChange={(e) =>
              handleChange("empresas", "contato_rh_email", e.target.value)
            }
            placeholder="contato.rh@empresa.com"
          />
          {renderFieldError("contato_rh_email")}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Status</label>
          <select
            value={formData.empresas.status}
            onChange={(e) => handleChange("empresas", "status", e.target.value)}
          >
            <option value="">Selecione</option>
            <option value="Ativo">Ativo</option>
            <option value="Inativo">Inativo</option>
          </select>
          {renderFieldError("status")}
        </div>
      </div>

      <button type="submit" className="submit-btn">
        Salvar Empresa
      </button>
    </form>
  );

  const renderFuncoesForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label>Título da Função</label>
          <input
            type="text"
            value={formData.funcoes.titulo}
            onChange={(e) => handleChange("funcoes", "titulo", e.target.value)}
            placeholder="Digite o título da função"
          />
          {renderFieldError("titulo")}
        </div>

        <div className="form-group">
          <label>Departamento</label>
          <input
            type="text"
            value={formData.funcoes.departamento}
            onChange={(e) =>
              handleChange("funcoes", "departamento", e.target.value)
            }
            placeholder="Digite o departamento"
          />
          {renderFieldError("departamento")}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Nível</label>
          <input
            type="text"
            value={formData.funcoes.nivel}
            onChange={(e) => handleChange("funcoes", "nivel", e.target.value)}
            placeholder="Ex: Júnior, Pleno, Sênior"
          />
          {renderFieldError("nivel")}
        </div>

        <div className="form-group">
          <label>Descrição</label>
          <input
            type="text"
            value={formData.funcoes.descricao}
            onChange={(e) =>
              handleChange("funcoes", "descricao", e.target.value)
            }
            placeholder="Descreva as responsabilidades"
          />
          {renderFieldError("descricao")}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Status</label>
          <select
            value={formData.funcoes.status}
            onChange={(e) => handleChange("funcoes", "status", e.target.value)}
          >
            <option value="">Selecione</option>
            <option value="Ativo">Ativo</option>
            <option value="Inativo">Inativo</option>
          </select>
          {renderFieldError("status")}
        </div>
      </div>

      <button type="submit" className="submit-btn">
        Salvar Função
      </button>
    </form>
  );

  const renderAvaliacaoForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label>Itens</label>
          <input
            type="text"
            value={formData.avaliacao.itens}
            onChange={(e) => handleChange("avaliacao", "itens", e.target.value)}
            placeholder="Ex: Desempenho, Técnica..."
          />
          {renderFieldError("itens")}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Status</label>
          <select
            value={formData.avaliacao.status}
            onChange={(e) => handleChange("avaliacao", "status", e.target.value)}
          >
            <option value="">Selecione</option>
            <option value="Ativo">Ativo</option>
            <option value="Inativo">Inativo</option>
          </select>
          {renderFieldError("status")}
        </div>
      </div>

      <button type="submit" className="submit-btn">
        Salvar Item a Ser Avaliado
      </button>
    </form>
  );

  const tabs = [
    { id: "pessoas", label: "Pessoas" },
    { id: "empresas", label: "Empresas" },
    { id: "funcoes", label: "Funções" },
    { id: "avaliacao", label: "Itens a serem avaliados" },
  ];

  const getRegistroNome = (item) => {
    const nomes = {
      pessoas: item.nome,
      empresas: item.nome_fantasia || item.razao_social,
      funcoes: item.titulo || item.titulo_funcao,
      avaliacao: item.itens || item.tipo,
    };
    return (nomes[activeTab] || "").toLowerCase();
  };

  const filteredRegistros = registros.filter((item) =>
    getRegistroNome(item).includes(searchTerm.toLowerCase())
  );

  const getRegistroMainInfo = (item) => {
    const labels = {
      pessoas: item.nome || "Sem nome",
      empresas: item.nome_fantasia || item.razao_social || "Sem nome",
      funcoes: item.titulo || item.titulo_funcao || "Sem titulo",
      avaliacao: item.itens || item.tipo || "Sem descricao",
    };
    return labels[activeTab];
  };

  const getRegistroSecondaryInfo = (item) => {
    const labels = {
      pessoas: item.email || item.telefone || "Sem contato",
      empresas: item.email_empresa || item.cnpj || "Sem contato",
      funcoes: item.departamento || item.status || "Sem detalhe",
      avaliacao: item.status || "Sem status",
    };
    return labels[activeTab];
  };

  return (
    <div className="cadastro-container">
      <div className="cadastro-header">
        <h1>Cadastros do Sistema</h1>
      </div>

      <div className="tabs-container">
        <div className="tabs-nav">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="tab-content">
          {activeTab === "pessoas" && renderPessoasForm()}
          {activeTab === "empresas" && renderEmpresasForm()}
          {activeTab === "funcoes" && renderFuncoesForm()}
          {activeTab === "avaliacao" && renderAvaliacaoForm()}

          <div className="lista-container">
            <h2>Registros Salvos</h2>
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Pesquisar pelo nome..."
            />
            {filteredRegistros.length === 0 ? (
              <p className="sem-registros">Nenhum registro encontrado.</p>
            ) : (
              <div className="record-list">
                {filteredRegistros.map((item) => (
                  <div key={item.id} className="record-row">
                    <div className="record-main">
                      <p className="record-title">{getRegistroMainInfo(item)}</p>
                      <p className="record-subtitle">{getRegistroSecondaryInfo(item)}</p>
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
        </div>
      </div>

      {/* Telinha de visualização */}
      {visualizando && (
        <div className="overlay-visualizar">
          <div className="visualizar-card">
            <h3>Detalhes do Registro</h3>
            <div className="visualizar-conteudo">
              {Object.entries(itemVisualizado).map(([key, value]) => (
                <p key={key}>
                  <strong>{key}:</strong> {value || "—"}
                </p>
              ))}
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

export default Cadastro;
