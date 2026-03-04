import { useState } from 'react';
import FormularioAvaliacao from './FormularioAvaliacao';
import AvaliacaoExperiencia from './AvaliacaoExperiencia';
import FichaAcompanhamento from './FichaAcompanhamento';
import ListaUsuariosEncaminhados from './ListaUsuariosEncaminhados';

const Formularios = () => {
  const [activeTab, setActiveTab] = useState('controle-interno');

  const tabs = [
    {
      id: 'controle-interno',
      label: 'Controle Interno',
      component: <FormularioAvaliacao />
    },
    {
      id: 'avaliacao-experiencia',
      label: 'Avaliação Experiência',
      component: <AvaliacaoExperiencia />
    },
    {
      id: 'ficha-acompanhamento',
      label: 'Ficha de Acompanhamento',
      component: <FichaAcompanhamento />
    },
    {
      id: 'lista-usuarios',
      label: 'Lista de Usuários Encaminhados',
      component: <ListaUsuariosEncaminhados />
    }
  ];

  return (
    <div className="formularios-container">
      <div className="formularios-header">
        <h1>Formulários do Sistema</h1>
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
    </div>
  );
};

export default Formularios;

