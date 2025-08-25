import { useState } from 'react';

const FormularioAvaliacao = () => {
  const [avaliacoes, setAvaliacoes] = useState([
    {
      id: 1,
      nomeUsuario: '',
      ingresso: '',
      primeiraAval: '',
      segundaAval: '',
      primeiraEntrevistaPais: '',
      segundaEntrevistaPais: '',
      resultado: ''
    }
  ]);

  const handleInputChange = (id, field, value) => {
    setAvaliacoes(prev => 
      prev.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const adicionarLinha = () => {
    const novaLinha = {
      id: Date.now(),
      nomeUsuario: '',
      ingresso: '',
      primeiraAval: '',
      segundaAval: '',
      primeiraEntrevistaPais: '',
      segundaEntrevistaPais: '',
      resultado: ''
    };
    setAvaliacoes(prev => [...prev, novaLinha]);
  };

  const removerLinha = (id) => {
    if (avaliacoes.length > 1) {
      setAvaliacoes(prev => prev.filter(item => item.id !== id));
    }
  };

  const salvarFormulario = () => {
    console.log('Dados salvos:', avaliacoes);
    alert('Formulário de avaliação salvo com sucesso!');
  };

  const limparFormulario = () => {
    setAvaliacoes([{
      id: 1,
      nomeUsuario: '',
      ingresso: '',
      primeiraAval: '',
      segundaAval: '',
      primeiraEntrevistaPais: '',
      segundaEntrevistaPais: '',
      resultado: ''
    }]);
  };

  return (
    <div className="formulario-container">
      <div className="formulario-header">
        <h1>Controle Interno - Avaliação Usuários Período Experiência</h1>
        <p className="ano">2025</p>
      </div>
      
      <div className="formulario-actions">
        <button onClick={adicionarLinha} className="btn-add">
          ➕ Adicionar Linha
        </button>
        <button onClick={salvarFormulario} className="btn-save">
          💾 Salvar Formulário
        </button>
        <button onClick={limparFormulario} className="btn-clear">
          🗑️ Limpar Tudo
        </button>
      </div>

      <div className="table-container">
        <table className="avaliacao-table">
          <thead>
            <tr>
              <th>Nome do Usuário</th>
              <th>Ingresso</th>
              <th>1ª Aval</th>
              <th>2ª Aval</th>
              <th>1ª Entrevista Pais</th>
              <th>2ª Entrevista Pais</th>
              <th>Resultado</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {avaliacoes.map((avaliacao) => (
              <tr key={avaliacao.id}>
                <td>
                  <input
                    type="text"
                    value={avaliacao.nomeUsuario}
                    onChange={(e) => handleInputChange(avaliacao.id, 'nomeUsuario', e.target.value)}
                    placeholder="Nome completo"
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="date"
                    value={avaliacao.ingresso}
                    onChange={(e) => handleInputChange(avaliacao.id, 'ingresso', e.target.value)}
                    className="table-input"
                  />
                </td>
                <td>
                  <select
                    value={avaliacao.primeiraAval}
                    onChange={(e) => handleInputChange(avaliacao.id, 'primeiraAval', e.target.value)}
                    className="table-select"
                  >
                    <option value="">-</option>
                    <option value="excelente">Excelente</option>
                    <option value="bom">Bom</option>
                    <option value="regular">Regular</option>
                    <option value="insatisfatorio">Insatisfatório</option>
                  </select>
                </td>
                <td>
                  <select
                    value={avaliacao.segundaAval}
                    onChange={(e) => handleInputChange(avaliacao.id, 'segundaAval', e.target.value)}
                    className="table-select"
                  >
                    <option value="">-</option>
                    <option value="excelente">Excelente</option>
                    <option value="bom">Bom</option>
                    <option value="regular">Regular</option>
                    <option value="insatisfatorio">Insatisfatório</option>
                  </select>
                </td>
                <td>
                  <input
                    type="date"
                    value={avaliacao.primeiraEntrevistaPais}
                    onChange={(e) => handleInputChange(avaliacao.id, 'primeiraEntrevistaPais', e.target.value)}
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="date"
                    value={avaliacao.segundaEntrevistaPais}
                    onChange={(e) => handleInputChange(avaliacao.id, 'segundaEntrevistaPais', e.target.value)}
                    className="table-input"
                  />
                </td>
                <td>
                  <select
                    value={avaliacao.resultado}
                    onChange={(e) => handleInputChange(avaliacao.id, 'resultado', e.target.value)}
                    className="table-select"
                  >
                    <option value="">-</option>
                    <option value="aprovado">Aprovado</option>
                    <option value="reprovado">Reprovado</option>
                    <option value="prorrogado">Prorrogado</option>
                  </select>
                </td>
                <td>
                  <button
                    onClick={() => removerLinha(avaliacao.id)}
                    className="btn-remove"
                    disabled={avaliacoes.length === 1}
                  >
                    ❌
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="formulario-info">
        <div className="info-card">
          <h3>📋 Instruções</h3>
          <ul>
            <li>Preencha todos os campos obrigatórios</li>
            <li>As datas de entrevista com os pais devem ser agendadas</li>
            <li>As avaliações seguem critérios pré-estabelecidos</li>
            <li>O resultado final considera todas as etapas</li>
          </ul>
        </div>
        
        <div className="info-card">
          <h3>📊 Estatísticas</h3>
          <p>Total de avaliações: <strong>{avaliacoes.length}</strong></p>
          <p>Preenchidas: <strong>{avaliacoes.filter(a => a.nomeUsuario && a.resultado).length}</strong></p>
          <p>Pendentes: <strong>{avaliacoes.filter(a => !a.nomeUsuario || !a.resultado).length}</strong></p>
        </div>
      </div>
    </div>
  );
};

export default FormularioAvaliacao;

