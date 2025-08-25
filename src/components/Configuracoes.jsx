import { useState } from 'react';

const Configuracoes = () => {
  const [configuracoes, setConfiguracoes] = useState({
    sistema: {
      nomeEmpresa: 'Empresa XYZ Ltda',
      emailNotificacao: 'admin@empresa.com',
      periodoAvaliacao: '90',
      lembreteAntecedencia: '7'
    },
    avaliacao: {
      criteriosObrigatorios: true,
      entrevistaPaisObrigatoria: true,
      avaliacaoAnonima: false,
      notificarResultados: true
    },
    usuarios: {
      permitirAutoAvaliacao: false,
      limiteTentativasLogin: '3',
      sessaoExpira: '60'
    }
  });

  const handleChange = (secao, campo, valor) => {
    setConfiguracoes(prev => ({
      ...prev,
      [secao]: {
        ...prev[secao],
        [campo]: valor
      }
    }));
  };

  const salvarConfiguracoes = () => {
    console.log('Configurações salvas:', configuracoes);
    alert('Configurações salvas com sucesso!');
  };

  const resetarConfiguracoes = () => {
    if (confirm('Tem certeza que deseja resetar todas as configurações para os valores padrão?')) {
      // Reset para valores padrão
      alert('Configurações resetadas!');
    }
  };

  return (
    <div className="configuracoes-container">
      <div className="configuracoes-header">
        <h1>⚙️ Configurações do Sistema</h1>
        <p>Personalize o comportamento e as regras do sistema de avaliação</p>
      </div>
      
      <div className="configuracoes-content">
        {/* Configurações do Sistema */}
        <div className="config-section">
          <h2>🏢 Configurações Gerais</h2>
          <div className="config-form">
            <div className="form-group">
              <label>Nome da Empresa</label>
              <input
                type="text"
                value={configuracoes.sistema.nomeEmpresa}
                onChange={(e) => handleChange('sistema', 'nomeEmpresa', e.target.value)}
                placeholder="Digite o nome da empresa"
              />
            </div>
            
            <div className="form-group">
              <label>E-mail para Notificações</label>
              <input
                type="email"
                value={configuracoes.sistema.emailNotificacao}
                onChange={(e) => handleChange('sistema', 'emailNotificacao', e.target.value)}
                placeholder="admin@empresa.com"
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Período de Avaliação (dias)</label>
                <input
                  type="number"
                  value={configuracoes.sistema.periodoAvaliacao}
                  onChange={(e) => handleChange('sistema', 'periodoAvaliacao', e.target.value)}
                  min="30"
                  max="365"
                />
              </div>
              
              <div className="form-group">
                <label>Lembrete com Antecedência (dias)</label>
                <input
                  type="number"
                  value={configuracoes.sistema.lembreteAntecedencia}
                  onChange={(e) => handleChange('sistema', 'lembreteAntecedencia', e.target.value)}
                  min="1"
                  max="30"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Configurações de Avaliação */}
        <div className="config-section">
          <h2>📊 Configurações de Avaliação</h2>
          <div className="config-form">
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={configuracoes.avaliacao.criteriosObrigatorios}
                  onChange={(e) => handleChange('avaliacao', 'criteriosObrigatorios', e.target.checked)}
                />
                <span>Critérios de avaliação obrigatórios</span>
              </label>
              
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={configuracoes.avaliacao.entrevistaPaisObrigatoria}
                  onChange={(e) => handleChange('avaliacao', 'entrevistaPaisObrigatoria', e.target.checked)}
                />
                <span>Entrevista com pais obrigatória</span>
              </label>
              
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={configuracoes.avaliacao.avaliacaoAnonima}
                  onChange={(e) => handleChange('avaliacao', 'avaliacaoAnonima', e.target.checked)}
                />
                <span>Permitir avaliação anônima</span>
              </label>
              
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={configuracoes.avaliacao.notificarResultados}
                  onChange={(e) => handleChange('avaliacao', 'notificarResultados', e.target.checked)}
                />
                <span>Notificar resultados por e-mail</span>
              </label>
            </div>
          </div>
        </div>

        {/* Configurações de Usuários */}
        <div className="config-section">
          <h2>👥 Configurações de Usuários</h2>
          <div className="config-form">
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={configuracoes.usuarios.permitirAutoAvaliacao}
                  onChange={(e) => handleChange('usuarios', 'permitirAutoAvaliacao', e.target.checked)}
                />
                <span>Permitir auto-avaliação</span>
              </label>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Limite de Tentativas de Login</label>
                <select
                  value={configuracoes.usuarios.limiteTentativasLogin}
                  onChange={(e) => handleChange('usuarios', 'limiteTentativasLogin', e.target.value)}
                >
                  <option value="3">3 tentativas</option>
                  <option value="5">5 tentativas</option>
                  <option value="10">10 tentativas</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Sessão Expira em (minutos)</label>
                <select
                  value={configuracoes.usuarios.sessaoExpira}
                  onChange={(e) => handleChange('usuarios', 'sessaoExpira', e.target.value)}
                >
                  <option value="30">30 minutos</option>
                  <option value="60">1 hora</option>
                  <option value="120">2 horas</option>
                  <option value="480">8 horas</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="configuracoes-actions">
        <button onClick={salvarConfiguracoes} className="btn-save">
          💾 Salvar Configurações
        </button>
        <button onClick={resetarConfiguracoes} className="btn-reset">
          🔄 Resetar para Padrão
        </button>
      </div>
      
      <div className="configuracoes-info">
        <div className="info-card">
          <h3>⚠️ Importante</h3>
          <p>Algumas alterações podem exigir reinicialização do sistema. Certifique-se de salvar antes de sair.</p>
        </div>
      </div>
    </div>
  );
};

export default Configuracoes;

