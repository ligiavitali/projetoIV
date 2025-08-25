import { useState } from 'react';

const FichaAcompanhamento = () => {
  const [formData, setFormData] = useState({
    nome: '',
    dataAdmissao: '',
    empresa: '',
    responsavelRH: '',
    dataVisita: '',
    contatoCom: '',
    parecerGeral: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const salvarFormulario = () => {
    console.log('Dados salvos:', formData);
    alert('Ficha de Acompanhamento salva com sucesso!');
  };

  const limparFormulario = () => {
    setFormData({
      nome: '',
      dataAdmissao: '',
      empresa: '',
      responsavelRH: '',
      dataVisita: '',
      contatoCom: '',
      parecerGeral: ''
    });
  };

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
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => handleInputChange('nome', e.target.value)}
              placeholder="Nome completo do usuário"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Data de admissão:</label>
            <input
              type="date"
              value={formData.dataAdmissao}
              onChange={(e) => handleInputChange('dataAdmissao', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Data da visita:</label>
            <input
              type="date"
              value={formData.dataVisita}
              onChange={(e) => handleInputChange('dataVisita', e.target.value)}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group full-width">
            <label>Empresa:</label>
            <input
              type="text"
              value={formData.empresa}
              onChange={(e) => handleInputChange('empresa', e.target.value)}
              placeholder="Nome da empresa"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Responsável RH:</label>
            <input
              type="text"
              value={formData.responsavelRH}
              onChange={(e) => handleInputChange('responsavelRH', e.target.value)}
              placeholder="Nome do responsável pelo RH"
            />
          </div>
          <div className="form-group">
            <label>Contato com:</label>
            <input
              type="text"
              value={formData.contatoCom}
              onChange={(e) => handleInputChange('contatoCom', e.target.value)}
              placeholder="Pessoa de contato"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group full-width">
            <label>Parecer Geral:</label>
            <textarea
              value={formData.parecerGeral}
              onChange={(e) => handleInputChange('parecerGeral', e.target.value)}
              placeholder="Descreva o parecer geral sobre o acompanhamento..."
              rows="8"
              className="parecer-textarea"
            />
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button onClick={salvarFormulario} className="btn-save">
          💾 Salvar Ficha
        </button>
        <button onClick={limparFormulario} className="btn-clear">
          🗑️ Limpar Formulário
        </button>
      </div>

      <div className="info-section">
        <div className="info-card">
          <h3>📋 Instruções</h3>
          <ul>
            <li>Preencha todos os campos obrigatórios</li>
            <li>A data da visita deve ser posterior à data de admissão</li>
            <li>O parecer geral deve ser detalhado e objetivo</li>
            <li>Mantenha contato regular com o responsável pelo RH</li>
          </ul>
        </div>
        
        <div className="info-card">
          <h3>📞 Contatos Importantes</h3>
          <p><strong>Instituto:</strong> (48) 3433-8235</p>
          <p><strong>E-mail:</strong> educ.especial@ibest.com.br</p>
          <p><strong>Endereço:</strong> Rua Lúcia Milioli, 211 - Santa Bárbara</p>
          <p><strong>CEP:</strong> 88802-020 - Criciúma - SC</p>
        </div>
      </div>
    </div>
  );
};

export default FichaAcompanhamento;

