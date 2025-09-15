const Relatorios = () => {
  const relatorios = [
    {
      id: 1,
      titulo: 'Relatório de Avaliações por Período',
      descricao: 'Visualize todas as avaliações realizadas em um período específico',
      status: 'Disponível'
    },
    {
      id: 2,
      titulo: 'Relatório de Desempenho Individual',
      descricao: 'Acompanhe o desempenho individual de cada colaborador',
      status: 'Disponível'
    },
    {
      id: 3,
      titulo: 'Relatório de Entrevistas com Pais',
      descricao: 'Controle das entrevistas realizadas com os pais/responsáveis',
      status: 'Disponível'
    },
    {
      id: 4,
      titulo: 'Dashboard Executivo',
      descricao: 'Visão geral com métricas e indicadores principais',
      status: 'Em desenvolvimento'
    }
  ];

  const handleGerarRelatorio = (relatorioId) => {
    alert(`Gerando relatório ${relatorioId}... (Funcionalidade em desenvolvimento)`);
  };

  return (
    <div className="relatorios-container">
      <div className="relatorios-header">
        <h1>Relatórios e Análises</h1>
        <p>Gere relatórios detalhados sobre as avaliações e desempenho</p>
      </div>
      
      <div className="filtros-container">
        <div className="filtros-card">
          <h3>Filtros</h3>
          <div className="filtros-form">
            <div className="form-group">
              <label>Período</label>
              <div className="date-range">
                <input type="date" placeholder="Data inicial" />
                <span>até</span>
                <input type="date" placeholder="Data final" />
              </div>
            </div>
            
            <div className="form-group">
              <label>Departamento</label>
              <select>
                <option value="">Todos os departamentos</option>
                <option value="rh">Recursos Humanos</option>
                <option value="ti">Tecnologia</option>
                <option value="vendas">Vendas</option>
                <option value="marketing">Marketing</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Status</label>
              <select>
                <option value="">Todos os status</option>
                <option value="aprovado">Aprovado</option>
                <option value="reprovado">Reprovado</option>
                <option value="prorrogado">Prorrogado</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      <div className="relatorios-grid">
        {relatorios.map(relatorio => (
          <div key={relatorio.id} className="relatorio-card">
            <div className="relatorio-icon">{relatorio.icon}</div>
            <h3>{relatorio.titulo}</h3>
            <p>{relatorio.descricao}</p>
            <div className="relatorio-status">
              <span className={`status ${relatorio.status === 'Disponível' ? 'disponivel' : 'desenvolvimento'}`}>
                {relatorio.status}
              </span>
            </div>
            <button 
              onClick={() => handleGerarRelatorio(relatorio.id)}
              className="btn-gerar"
              disabled={relatorio.status !== 'Disponível'}
            >
              Gerar Relatório
            </button>
          </div>
        ))}
      </div>
      
      <div className="relatorios-info">
        <div className="info-card">
          <h3>Dica</h3>
          <p>Use os filtros acima para personalizar seus relatórios e obter insights mais específicos sobre as avaliações.</p>
        </div>
      </div>
    </div>
  );
};

export default Relatorios;

