import { useState } from 'react';

const ListaUsuariosEncaminhados = () => {
  const [usuarios, setUsuarios] = useState([
    {
      id: 1,
      numero: '01',
      nome: '',
      dataAdmissao: '',
      empresa: '',
      funcao: '',
      contatoRH: '',
      provavelDataDesligamento: ''
    }
  ]);

  const [anoReferencia, setAnoReferencia] = useState('2025');

  const handleInputChange = (id, field, value) => {
    setUsuarios(prev => 
      prev.map(usuario => 
        usuario.id === id ? { ...usuario, [field]: value } : usuario
      )
    );
  };

  const adicionarLinha = () => {
    const novaLinha = {
      id: Date.now(),
      numero: String(usuarios.length + 1).padStart(2, '0'),
      nome: '',
      dataAdmissao: '',
      empresa: '',
      funcao: '',
      contatoRH: '',
      provavelDataDesligamento: ''
    };
    setUsuarios(prev => [...prev, novaLinha]);
  };

  const removerLinha = (id) => {
    if (usuarios.length > 1) {
      setUsuarios(prev => {
        const novosUsuarios = prev.filter(usuario => usuario.id !== id);
        // Renumerar os usuários
        return novosUsuarios.map((usuario, index) => ({
          ...usuario,
          numero: String(index + 1).padStart(2, '0')
        }));
      });
    }
  };

  const salvarLista = () => {
    console.log('Lista salva:', { anoReferencia, usuarios });
    alert('Lista de Usuários Encaminhados salva com sucesso!');
  };

  const limparLista = () => {
    setUsuarios([{
      id: 1,
      numero: '01',
      nome: '',
      dataAdmissao: '',
      empresa: '',
      funcao: '',
      contatoRH: '',
      provavelDataDesligamento: ''
    }]);
  };

  const exportarPDF = () => {
    alert('Funcionalidade de exportar PDF será implementada em versão futura.');
  };

  return (
    <div className="lista-container">
      <div className="lista-header">
        <h1>INSTITUTO DE EDUCAÇÃO ESPECIAL</h1>
        <h2>DIOMÍCIO FREITAS</h2>
        <h3>CRICIÚMA - SC</h3>
        <div className="titulo-ano">
          <h4>Usuários encaminhados ao Trabalho em</h4>
          <input
            type="number"
            value={anoReferencia}
            onChange={(e) => setAnoReferencia(e.target.value)}
            className="ano-input"
            min="2020"
            max="2030"
          />
        </div>
        <p className="instituicao">IEEDF</p>
      </div>

      <div className="lista-actions">
        <button onClick={adicionarLinha} className="btn-add">
          ➕ Adicionar Usuário
        </button>
        <button onClick={salvarLista} className="btn-save">
          💾 Salvar Lista
        </button>
        <button onClick={limparLista} className="btn-clear">
          🗑️ Limpar Lista
        </button>
        <button onClick={exportarPDF} className="btn-export">
          📄 Exportar PDF
        </button>
      </div>

      <div className="table-container">
        <table className="usuarios-table">
          <thead>
            <tr>
              <th>Nº</th>
              <th>Nome</th>
              <th>Data Admissão</th>
              <th>Empresa</th>
              <th>Função</th>
              <th>Contato RH</th>
              <th>Provável data desligamento IEEDF</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td className="numero-cell">{usuario.numero}</td>
                <td>
                  <input
                    type="text"
                    value={usuario.nome}
                    onChange={(e) => handleInputChange(usuario.id, 'nome', e.target.value)}
                    placeholder="Nome completo"
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="date"
                    value={usuario.dataAdmissao}
                    onChange={(e) => handleInputChange(usuario.id, 'dataAdmissao', e.target.value)}
                    className="table-input date-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={usuario.empresa}
                    onChange={(e) => handleInputChange(usuario.id, 'empresa', e.target.value)}
                    placeholder="Nome da empresa"
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={usuario.funcao}
                    onChange={(e) => handleInputChange(usuario.id, 'funcao', e.target.value)}
                    placeholder="Função/cargo"
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={usuario.contatoRH}
                    onChange={(e) => handleInputChange(usuario.id, 'contatoRH', e.target.value)}
                    placeholder="Contato do RH"
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="date"
                    value={usuario.provavelDataDesligamento}
                    onChange={(e) => handleInputChange(usuario.id, 'provavelDataDesligamento', e.target.value)}
                    className="table-input date-input"
                  />
                </td>
                <td>
                  <button
                    onClick={() => removerLinha(usuario.id)}
                    className="btn-remove"
                    disabled={usuarios.length === 1}
                    title="Remover usuário"
                  >
                    ❌
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListaUsuariosEncaminhados;

