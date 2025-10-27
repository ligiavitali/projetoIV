import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { updateCadastroAbaData, resetCadastroData } from '../redux/slices/cadastroSlice';
import {
  pessoasSchema,
  empresasSchema,
  funcoesSchema,
  avaliacaoSchema,
} from "../utils/validationSchemas";

const Cadastro = () => {
  const dispatch = useDispatch();
  const { cadastroData } = useSelector((state) => state.cadastro);
  
  const [activeTab, setActiveTab] = useState("pessoas");
  // O formData local é substituído por cadastroData do Redux
  const formData = cadastroData;

  const [errors, setErrors] = useState({});
  const [registros, setRegistros] = useState([]);

  const carregarDados = async () => {
    try {
      const response = await fetch(`http://localhost:5000/${activeTab}`);
      const data = await response.json();
      setRegistros(data);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  };

  useEffect(() => {
    carregarDados();
  }, [activeTab]);

  const handleChange = (tab, field, value) => {
    dispatch(updateCadastroAbaData({ aba: tab, data: { [field]: value } }));
    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = `http://localhost:5000/${activeTab}`;
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
        // Limpar o estado do formulário no Redux
        dispatch(updateCadastroAbaData({ aba: activeTab, data: Object.fromEntries(
          Object.keys(formData[activeTab]).map((key) => [key, ""])
        )}));
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
    if (!window.confirm("Tem certeza que deseja excluir este registro?")) return;
    try {
      const response = await fetch(`http://localhost:5000/${activeTab}/${id}`, {
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
    const detalhes = Object.entries(item)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");
    alert(detalhes);
  };

  const handleEditar = (item) => {
    // Carregar dados para edição no Redux
    dispatch(updateCadastroAbaData({ aba: activeTab, data: { ...item } }));
  };

  // 🔹 Renderização dos formulários com mensagens de erro
  const renderFieldError = (field) =>
    errors[field] && <p className="error-message">{errors[field]}</p>;

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
            onChange={(e) => handleChange("pessoas", "telefone", e.target.value)}
            placeholder="(11) 99999-9999"
          />
          {renderFieldError("telefone")}
        </div>

        <div className="form-group">
          <label>Cargo</label>
          <input
            type="text"
            value={formData.pessoas.cargo}
            onChange={(e) => handleChange("pessoas", "cargo", e.target.value)}
            placeholder="Digite o cargo"
          />
          {renderFieldError("cargo")}
        </div>
      </div>

      <div className="form-group">
        <label>Data de Ingresso</label>
        <input
          type="date"
          value={formData.pessoas.dataIngresso}
          onChange={(e) => handleChange("pessoas", "dataIngresso", e.target.value)}
        />
        {renderFieldError("dataIngresso")}
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
          <label>Razão Social</label>
          <input
            type="text"
            value={formData.empresas.razaoSocial}
            onChange={(e) => handleChange("empresas", "razaoSocial", e.target.value)}
            placeholder="Digite a razão social"
          />
          {renderFieldError("razaoSocial")}
        </div>

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
      </div>

      <div className="form-group">
        <label>Endereço</label>
        <input
          type="text"
          value={formData.empresas.endereco}
          onChange={(e) => handleChange("empresas", "endereco", e.target.value)}
          placeholder="Digite o endereço completo"
        />
        {renderFieldError("endereco")}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Telefone</label>
          <input
            type="tel"
            value={formData.empresas.telefone}
            onChange={(e) => handleChange("empresas", "telefone", e.target.value)}
            placeholder="(11) 3333-3333"
          />
          {renderFieldError("telefone")}
        </div>

        <div className="form-group">
          <label>E-mail</label>
          <input
            type="email"
            value={formData.empresas.email}
            onChange={(e) => handleChange("empresas", "email", e.target.value)}
            placeholder="contato@empresa.com"
          />
          {renderFieldError("email")}
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
            onChange={(e) => handleChange("funcoes", "departamento", e.target.value)}
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
            onChange={(e) => handleChange("funcoes", "descricao", e.target.value)}
            placeholder="Descreva as responsabilidades"
          />
          {renderFieldError("descricao")}
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
          <label>Tipo de Avaliação</label>
          <input
            type="text"
            value={formData.avaliacao.tipo}
            onChange={(e) => handleChange("avaliacao", "tipo", e.target.value)}
            placeholder="Ex: Desempenho, Técnica..."
          />
          {renderFieldError("tipo")}
        </div>

        <div className="form-group">
          <label>Período</label>
          <input
            type="text"
            value={formData.avaliacao.periodo}
            onChange={(e) => handleChange("avaliacao", "periodo", e.target.value)}
            placeholder="Ex: 1º semestre / 2025"
          />
          {renderFieldError("periodo")}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Critérios</label>
          <input
            type="text"
            value={formData.avaliacao.criterios}
            onChange={(e) => handleChange("avaliacao", "criterios", e.target.value)}
            placeholder="Digite os critérios de avaliação"
          />
          {renderFieldError("criterios")}
        </div>

        <div className="form-group">
          <label>Responsável</label>
          <input
            type="text"
            value={formData.avaliacao.responsavel}
            onChange={(e) => handleChange("avaliacao", "responsavel", e.target.value)}
            placeholder="Digite o nome do responsável"
          />
          {renderFieldError("responsavel")}
        </div>
      </div>

      <button type="submit" className="submit-btn">
        Salvar Avaliação
      </button>
    </form>
  );

  const tabs = [
    { id: "pessoas", label: "Pessoas" },
    { id: "empresas", label: "Empresas" },
    { id: "funcoes", label: "Funções" },
    { id: "avaliacao", label: "Avaliação" },
  ];

  const renderRegistroItem = (item) => {
    const campos = {
      pessoas: `${item.nome} — ${item.email}`,
      empresas: `${item.razaoSocial} — ${item.cnpj}`,
      funcoes: `${item.titulo} — ${item.departamento}`,
      avaliacao: `${item.tipo} — ${item.responsavel}`,
    };
    return campos[activeTab];
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

          <div className="lista-registros">
  {registros.length === 0 ? (
    <p>Nenhum registro encontrado.</p>
  ) : (
    <ul>
      {registros.map((item) => (
        <li key={item.id}>
          {renderRegistroItem(item)}{" "}
          <button className="btn-editar" onClick={() => handleEditar(item)}>
            Editar
          </button>{" "}
          <button className="btn-visualizar" onClick={() => handleVisualizar(item)}>
            Visualizar
          </button>
          <button className="btn-excluir" onClick={() => handleExcluir(item.id)}>
            Excluir
          </button>{" "}
        </li>
      ))}
    </ul>
  )}
</div>

        </div>
      </div>
    </div>
  );
};

export default Cadastro;