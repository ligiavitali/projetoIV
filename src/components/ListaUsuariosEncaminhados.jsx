import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateListaUsuariosEncaminhados, fetchListaUsuariosEncaminhadosList, saveListaUsuariosEncaminhados, deleteListaUsuariosEncaminhados } from '../redux/slices/formulariosSlice';
import FormularioListagem from './FormularioListagem';

const ListaUsuariosEncaminhados = () => {
  const dispatch = useDispatch();
  const { listaUsuariosEncaminhados: formData, listaUsuariosEncaminhadosList, loading, error } = useSelector((state) => state.formularios);
  const { anoReferencia, usuarios, id } = formData;

  useEffect(() => {
    dispatch(fetchListaUsuariosEncaminhadosList());
  }, [dispatch]);

  const handleInputChange = (id, field, value) => {
    const updatedUsuarios = usuarios.map(usuario => 
      usuario.id === id ? { ...usuario, [field]: value } : usuario
    );
    dispatch(updateListaUsuariosEncaminhados({ usuarios: updatedUsuarios }));
  };

  const handleAnoChange = (value) => {
    dispatch(updateListaUsuariosEncaminhados({ anoReferencia: value }));
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
    dispatch(updateListaUsuariosEncaminhados({ usuarios: [...usuarios, novaLinha] }));
  };

  const removerLinha = (id) => {
    if (usuarios.length > 1) {
      const novosUsuarios = usuarios.filter(usuario => usuario.id !== id);
      // Renumerar os usuários
      const updatedUsuarios = novosUsuarios.map((usuario, index) => ({
        ...usuario,
        numero: String(index + 1).padStart(2, '0')
      }));
      dispatch(updateListaUsuariosEncaminhados({ usuarios: updatedUsuarios }));
    }
  };

  const handleEditar = (item) => {
    dispatch(updateListaUsuariosEncaminhados({ ...item, id: item.id }));
  };

  const handleExcluir = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este registro?")) {
      await dispatch(deleteListaUsuariosEncaminhados(id));
      dispatch(fetchListaUsuariosEncaminhadosList()); // Recarrega a lista
    }
  };

  const salvarLista = () => {
    dispatch(saveListaUsuariosEncaminhados({ id, anoReferencia, usuarios }))
      .unwrap()
      .then(() => {
        alert('Lista de Usuários Encaminhados salva com sucesso!');
        dispatch(fetchListaUsuariosEncaminhadosList()); // Recarrega a lista após salvar
        dispatch(updateListaUsuariosEncaminhados({ anoReferencia: '2025', usuarios: [{ id: 1, numero: '01', nome: '', dataAdmissao: '', empresa: '', funcao: '', contatoRH: '', provavelDataDesligamento: '' }], id: undefined })); // Limpa o formulário de edição
      })
      .catch((err) => {
        alert(`Erro ao salvar lista: ${err.message || 'Erro desconhecido'}`);
        console.error("Erro ao salvar:", err);
      });
  };

  const limparLista = () => {
    dispatch(updateListaUsuariosEncaminhados({
      anoReferencia: '2025',
      usuarios: [{
        id: 1,
        numero: '01',
        nome: '',
        dataAdmissao: '',
        empresa: '',
        funcao: '',
        contatoRH: '',
        provavelDataDesligamento: ''
      }],
      id: undefined
    }));
  };

  if (loading) {
    return <div className="loading-message">Carregando Lista de Usuários Encaminhados...</div>;
  }

  if (error) {
    return <div className="error-message">Erro ao carregar lista: {error.message}</div>;
  }

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
            onChange={(e) => handleAnoChange(e.target.value)}
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
      
      <FormularioListagem 
        data={listaUsuariosEncaminhadosList} 
        collectionName="listaUsuariosEncaminhados" 
        onEdit={handleEditar} 
        onDelete={handleExcluir}
        title="Registros Salvos"
        displayFields={['anoReferencia', 'usuarios']}
      />
    </div>
  );
};

export default ListaUsuariosEncaminhados;

