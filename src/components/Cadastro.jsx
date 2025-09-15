import { useState } from 'react';

const Cadastro = () => {
  const [activeTab, setActiveTab] = useState('pessoas');
  const [formData, setFormData] = useState({
    pessoas: {
      nome: '',
      email: '',
      telefone: '',
      cargo: '',
      dataIngresso: ''
    },
    empresas: {
      razaoSocial: '',
      cnpj: '',
      endereco: '',
      telefone: '',
      email: ''
    },
    funcoes: {
      titulo: '',
      descricao: '',
      departamento: '',
      nivel: ''
    },
    avaliacao: {
      tipo: '',
      criterios: '',
      periodo: '',
      responsavel: ''
    }
  });

  const handleChange = (tab, field, value) => {
    setFormData(prev => ({
      ...prev,
      [tab]: {
        ...prev[tab],
        [field]: value
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Dados de ${activeTab} salvos com sucesso!`);
    console.log('Dados salvos:', formData[activeTab]);
  };

  const renderPessoasForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label>Nome Completo</label>
          <input
            type="text"
            value={formData.pessoas.nome}
            onChange={(e) => handleChange('pessoas', 'nome', e.target.value)}
            placeholder="Digite o nome completo"
          />
        </div>
        <div className="form-group">
          <label>E-mail</label>
          <input
            type="email"
            value={formData.pessoas.email}
            onChange={(e) => handleChange('pessoas', 'email', e.target.value)}
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
            onChange={(e) => handleChange('pessoas', 'telefone', e.target.value)}
            placeholder="(11) 99999-9999"
          />
        </div>
        <div className="form-group">
          <label>Cargo</label>
          <input
            type="text"
            value={formData.pessoas.cargo}
            onChange={(e) => handleChange('pessoas', 'cargo', e.target.value)}
            placeholder="Digite o cargo"
          />
        </div>
      </div>
      
      <div className="form-group">
        <label>Data de Ingresso</label>
        <input
          type="date"
          value={formData.pessoas.dataIngresso}
          onChange={(e) => handleChange('pessoas', 'dataIngresso', e.target.value)}
        />
      </div>
      
      <button type="submit" className="submit-btn">Salvar Pessoa</button>
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
            onChange={(e) => handleChange('empresas', 'razaoSocial', e.target.value)}
            placeholder="Digite a razão social"
          />
        </div>
        <div className="form-group">
          <label>CNPJ</label>
          <input
            type="text"
            value={formData.empresas.cnpj}
            onChange={(e) => handleChange('empresas', 'cnpj', e.target.value)}
            placeholder="00.000.000/0000-00"
          />
        </div>
      </div>
      
      <div className="form-group">
        <label>Endereço</label>
        <input
          type="text"
          value={formData.empresas.endereco}
          onChange={(e) => handleChange('empresas', 'endereco', e.target.value)}
          placeholder="Digite o endereço completo"
        />
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label>Telefone</label>
          <input
            type="tel"
            value={formData.empresas.telefone}
            onChange={(e) => handleChange('empresas', 'telefone', e.target.value)}
            placeholder="(11) 3333-3333"
          />
        </div>
        <div className="form-group">
          <label>E-mail</label>
          <input
            type="email"
            value={formData.empresas.email}
            onChange={(e) => handleChange('empresas', 'email', e.target.value)}
            placeholder="contato@empresa.com"
          />
        </div>
      </div>
      
      <button type="submit" className="submit-btn">Salvar Empresa</button>
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
            onChange={(e) => handleChange('funcoes', 'titulo', e.target.value)}
            placeholder="Digite o título da função"
          />
        </div>
        <div className="form-group">
          <label>Departamento</label>
          <input
            type="text"
            value={formData.funcoes.departamento}
            onChange={(e) => handleChange('funcoes', 'departamento', e.target.value)}
            placeholder="Digite o departamento"
          />
        </div>
      </div>
      
      <div className="form-group">
        <label>Descrição</label>
        <textarea
          value={formData.funcoes.descricao}
          onChange={(e) => handleChange('funcoes', 'descricao', e.target.value)}
          placeholder="Descreva as responsabilidades da função"
          rows="4"
        />
      </div>
      
      <div className="form-group">
        <label>Nível</label>
        <select
          value={formData.funcoes.nivel}
          onChange={(e) => handleChange('funcoes', 'nivel', e.target.value)}
        >
          <option value="">Selecione o nível</option>
          <option value="junior">Júnior</option>
          <option value="pleno">Pleno</option>
          <option value="senior">Sênior</option>
          <option value="coordenacao">Coordenação</option>
          <option value="gerencia">Gerência</option>
        </select>
      </div>
      
      <button type="submit" className="submit-btn">Salvar Função</button>
    </form>
  );

  const renderAvaliacaoForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label>Tipo de Avaliação</label>
          <select
            value={formData.avaliacao.tipo}
            onChange={(e) => handleChange('avaliacao', 'tipo', e.target.value)}
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
            onChange={(e) => handleChange('avaliacao', 'periodo', e.target.value)}
            placeholder="Ex: 1º Trimestre 2025"
          />
        </div>
      </div>
      
      <div className="form-group">
        <label>Critérios de Avaliação</label>
        <textarea
          value={formData.avaliacao.criterios}
          onChange={(e) => handleChange('avaliacao', 'criterios', e.target.value)}
          placeholder="Descreva os critérios que serão avaliados"
          rows="4"
        />
      </div>
      
      <div className="form-group">
        <label>Responsável pela Avaliação</label>
        <input
          type="text"
          value={formData.avaliacao.responsavel}
          onChange={(e) => handleChange('avaliacao', 'responsavel', e.target.value)}
          placeholder="Nome do responsável"
        />
      </div>
      
      <button type="submit" className="submit-btn">Salvar Avaliação</button>
    </form>
  );

  const tabs = [
    { id: 'pessoas', label: 'Pessoas' },
    { id: 'empresas', label: 'Empresas'},
    { id: 'funcoes', label: 'Funções'},
    { id: 'avaliacao', label: 'Avaliação'}
  ];

  return (
    <div className="cadastro-container">
      <div className="cadastro-header">
        <h1>Cadastros do Sistema</h1>
        <p>Gerencie pessoas, empresas, funções e tipos de avaliação</p>
      </div>
      
      <div className="tabs-container">
        <div className="tabs-nav">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
        
        <div className="tab-content">
          {activeTab === 'pessoas' && renderPessoasForm()}
          {activeTab === 'empresas' && renderEmpresasForm()}
          {activeTab === 'funcoes' && renderFuncoesForm()}
          {activeTab === 'avaliacao' && renderAvaliacaoForm()}
        </div>
      </div>
    </div>
  );
};

export default Cadastro;

