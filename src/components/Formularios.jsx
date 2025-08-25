import { useState } from 'react';
import FormularioAvaliacao from './FormularioAvaliacao';
import AvaliacaoExperiencia1 from './AvaliacaoExperiencia1';
import AvaliacaoExperiencia2 from './AvaliacaoExperiencia2';
import FichaAcompanhamento from './FichaAcompanhamento';
import ListaUsuariosEncaminhados from './ListaUsuariosEncaminhados';

const Formularios = () => {
  const [activeTab, setActiveTab] = useState('controle-interno');

  const tabs = [
    {
      id: 'controle-interno',
      label: 'Controle Interno',
      icon: '📊',
      component: <FormularioAvaliacao />
    },
    {
      id: 'avaliacao-exp1',
      label: 'Avaliação Experiência 1',
      icon: '📝',
      component: <AvaliacaoExperiencia1 />
    },
    {
      id: 'avaliacao-exp2',
      label: 'Avaliação Experiência 2',
      icon: '📋',
      component: <AvaliacaoExperiencia2 />
    },
    {
      id: 'ficha-acompanhamento',
      label: 'Ficha de Acompanhamento',
      icon: '📄',
      component: <FichaAcompanhamento />
    },
    {
      id: 'lista-usuarios',
      label: 'Lista de Usuários Encaminhados',
      icon: '📋',
      component: <ListaUsuariosEncaminhados />
    }
  ];

  return (
    <div className="formularios-container">
      <div className="formularios-header">
        <h1>📋 Formulários do Sistema</h1>
        <p>Gerencie todos os formulários de avaliação e acompanhamento</p>
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
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>
        
        <div className="tab-content">
          {tabs.find(tab => tab.id === activeTab)?.component}
        </div>
      </div>
      
      <div className="formularios-info">
        <div className="info-card">
          <h3>💡 Dica</h3>
          <p>Use as abas acima para navegar entre os diferentes formulários disponíveis no sistema. Cada formulário tem suas próprias funcionalidades e campos específicos.</p>
        </div>
      </div>
    </div>
  );
};

export default Formularios;

