import { useState, useEffect } from "react";

const Cadastro = () => {
  const [activeTab, setActiveTab] = useState("pessoas");
  const [formData, setFormData] = useState({
    pessoas: { nome: "", email: "", telefone: "", cargo: "", dataIngresso: "" },
    empresas: { razaoSocial: "", cnpj: "", endereco: "", telefone: "", email: "" },
    funcoes: { titulo: "", descricao: "", departamento: "", nivel: "" },
    avaliacao: { tipo: "", criterios: "", periodo: "", responsavel: "" },
  });

  const [registros, setRegistros] = useState([]);

  // 🔹 Carrega os dados do JSON Server
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
    setFormData((prev) => ({
      ...prev,
      [tab]: { ...prev[tab], [field]: value },
    }));
  };

  // 🔹 Salvar ou atualizar registro
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = `http://localhost:5000/${activeTab}`;
    const data = formData[activeTab];

    try {
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
        setFormData((prev) => ({
          ...prev,
          [activeTab]: Object.fromEntries(
            Object.keys(prev[activeTab]).map((key) => [key, ""])
          ),
        }));
      } else {
        alert("Erro ao salvar dados!");
      }
    } catch (error) {
      console.error("Erro ao enviar dados:", error);
    }
  };

  // 🔹 Excluir registro
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

  // 🔹 Visualizar registro
  const handleVisualizar = (item) => {
    const detalhes = Object.entries(item)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");
    alert(detalhes);
  };

  // 🔹 Editar registro
  const handleEditar = (item) => {
    setFormData((prev) => ({
      ...prev,
      [activeTab]: { ...item },
    }));
  };

  // 🔹 Funções de renderização dos formulários
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
        </div>
        <div className="form-group">
          <label>E-mail</label>
          <input
            type="email"
            value={formData.pessoas.email}
            onChange={(e) => handleChange("pessoas", "email", e.target.value)}
            placeholder="Digite o e-mail"
          />
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
        </div>
        <div className="form-group">
          <label>Cargo</label>
          <input
            type="text"
            value={formData.pessoas.cargo}
            onChange={(e) => handleChange("pessoas", "cargo", e.target.value)}
            placeholder="Digite o cargo"
          />
        </div>
      </div>

      <div className="form-group">
        <label>Data de Ingresso</label>
        <input
          type="date"
          value={formData.pessoas.dataIngresso}
          onChange={(e) => handleChange("pessoas", "dataIngresso", e.target.value)}
        />
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
        </div>
        <div className="form-group">
          <label>CNPJ</label>
          <input
            type="text"
            value={formData.empresas.cnpj}
            onChange={(e) => handleChange("empresas", "cnpj", e.target.value)}
            placeholder="00.000.000/0000-00"
          />
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
        </div>
        <div className="form-group">
          <label>E-mail</label>
          <input
            type="email"
            value={formData.empresas.email}
            onChange={(e) => handleChange("empresas", "email", e.target.value)}
            placeholder="contato@empresa.com"
          />
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
        </div>
        <div className="form-group">
          <label>Departamento</label>
          <input
            type="text"
            value={formData.funcoes.departamento}
            onChange={(e) => handleChange("funcoes", "departamento", e.target.value)}
            placeholder="Digite o departamento"
          />
        </div>
      </div>

      <div className="form-group">
        <label>Descrição</label>
        <textarea
          value={formData.funcoes.descricao}
          onChange={(e) => handleChange("funcoes", "descricao", e.target.value)}
          placeholder="Descreva as responsabilidades da função"
          rows="4"
        />
      </div>

      <div className="form-group">
        <label>Nível</label>
        <select
          value={formData.funcoes.nivel}
          onChange={(e) => handleChange("funcoes", "nivel", e.target.value)}
        >
          <option value="">Selecione o nível</option>
          <option value="junior">Júnior</option>
          <option value="pleno">Pleno</option>
          <option value="senior">Sênior</option>
          <option value="coordenacao">Coordenação</option>
          <option value="gerencia">Gerência</option>
        </select>
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
          <select
            value={formData.avaliacao.tipo}
            onChange={(e) => handleChange("avaliacao", "tipo", e.target.value)}
          >
            <option value="">Selecione o tipo</option>
            <option value="periodo-experiencia">Período de Experiência</option>
            <option value="desempenho-anual">Desempenho Anual</option>
            <option value="promocao">Promoção</option>
            <option value="feedback-360">Feedback 360°</option>
          </select>
        </div>
        <div className="form-group">
          <label>Período</label>
          <input
            type="text"
            value={formData.avaliacao.periodo}
            onChange={(e) => handleChange("avaliacao", "periodo", e.target.value)}
            placeholder="Ex: 1º Trimestre 2025"
          />
        </div>
      </div>

      <div className="form-group">
        <label>Critérios de Avaliação</label>
        <textarea
          value={formData.avaliacao.criterios}
          onChange={(e) => handleChange("avaliacao", "criterios", e.target.value)}
          placeholder="Descreva os critérios que serão avaliados"
          rows="4"
        />
      </div>

      <div className="form-group">
        <label>Responsável pela Avaliação</label>
        <input
          type="text"
          value={formData.avaliacao.responsavel}
          onChange={(e) => handleChange("avaliacao", "responsavel", e.target.value)}
          placeholder="Nome do responsável"
        />
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

          <h3 style={{ marginTop: "30px" }}>
            Lista de {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </h3>

          {registros.length === 0 ? (
            <p>Nenhum cadastro realizado.</p>
          ) : (
            <ul>
              {registros.map((item) => (
                <li
                  key={item.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <span>{renderRegistroItem(item)}</span>
                 <div>
  <button 
    className="btn-visualizar" 
    onClick={() => handleVisualizar(item)}
  >
    Visualizar
  </button>

  <button 
    className="btn-editar" 
    onClick={() => handleEditar(item)}
  >
    Editar
  </button>

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
      </div>
    </div>
  );
};

export default Cadastro;
