import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateListaUsuariosEncaminhados, fetchListaUsuariosEncaminhadosList, saveListaUsuariosEncaminhados, deleteListaUsuariosEncaminhados } from '../redux/slices/formulariosSlice';

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

 const handleVisualizar = (item) => {
  const detalhes = `Ano de Referência: ${item.anoReferencia}\n` +
    item.usuarios.map(u => {
      let dataFormatada = u.provavelDataDesligamento;

      // Se for uma data válida, formata para dd/mm/yyyy
      const data = new Date(u.provavelDataDesligamento);
      if (!isNaN(data)) {
        const dia = String(data.getDate()).padStart(2, "0");
        const mes = String(data.getMonth() + 1).padStart(2, "0");
        const ano = data.getFullYear();
        dataFormatada = `${dia}/${mes}/${ano}`;
      }

      return `${u.numero} - ${u.nome} - ${u.empresa} - ${u.funcao} - ${u.contatoRH} - ${dataFormatada}`;
    }).join('\n');

  alert(detalhes);
};

  const handleExcluir = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este registro?")) {
      await dispatch(deleteListaUsuariosEncaminhados(id));
      dispatch(fetchListaUsuariosEncaminhadosList());
    }
  };

const salvarLista = () => {
  // Valida se há pelo menos um usuário
  if (!usuarios || usuarios.length === 0) {
    alert("Adicione pelo menos um usuário antes de salvar.");
    return;
  }

  // Valida se o Ano de Referência está preenchido
  if (!anoReferencia?.trim()) {
    alert("O campo 'Ano de Referência' é obrigatório.");
    return;
  }

  // Checa quais usuários têm campos obrigatórios em branco
  const usuariosComCamposVazios = usuarios
    .map((u, index) => {
      const camposObrigatorios = {
        numero: "Número",
        nome: "Nome",
        empresa: "Empresa",
        funcao: "Função",
        contatoRH: "Contato RH",
        provavelDataDesligamento: "Provável Data de Desligamento"
      };

      const camposVazios = Object.entries(camposObrigatorios)
        .filter(([campo]) => !u[campo]?.trim())
        .map(([_, label]) => `• ${label}`);

      if (camposVazios.length > 0) {
        return `Usuário ${u.numero || index + 1}:\n${camposVazios.join("\n")}`;
      }
      return null;
    })
    .filter(Boolean);

  if (usuariosComCamposVazios.length > 0) {
    alert(`Preencha os campos obrigatórios:\n\n${usuariosComCamposVazios.join("\n\n")}`);
    return;
  }

  // Se passou nas validações, salva normalmente
  dispatch(saveListaUsuariosEncaminhados({ id, anoReferencia, usuarios }))
    .unwrap()
    .then(() => {
      alert('Lista de Usuários Encaminhados salva com sucesso!');
      dispatch(fetchListaUsuariosEncaminhadosList());
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

  if (loading) return <div className="loading-message">Carregando Lista de Usuários Encaminhados...</div>;
  if (error) return <div className="error-message">Erro ao carregar lista: {error.message}</div>;

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
        <button onClick={adicionarLinha} className="btn-add">Adicionar Usuário</button>
        <button onClick={salvarLista} className="btn-save">Salvar Lista</button>
        <button onClick={limparLista} className="btn-clear">Limpar Lista</button>
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
                <td><input type="text" value={usuario.nome} onChange={(e) => handleInputChange(usuario.id, 'nome', e.target.value)} className="table-input"/></td>
                <td><input type="date" value={usuario.dataAdmissao} onChange={(e) => handleInputChange(usuario.id, 'dataAdmissao', e.target.value)} className="table-input date-input"/></td>
                <td><input type="text" value={usuario.empresa} onChange={(e) => handleInputChange(usuario.id, 'empresa', e.target.value)} className="table-input"/></td>
                <td><input type="text" value={usuario.funcao} onChange={(e) => handleInputChange(usuario.id, 'funcao', e.target.value)} className="table-input"/></td>
                <td><input type="text" value={usuario.contatoRH} onChange={(e) => handleInputChange(usuario.id, 'contatoRH', e.target.value)} className="table-input"/></td>
                <td><input type="date" value={usuario.provavelDataDesligamento} onChange={(e) => handleInputChange(usuario.id, 'provavelDataDesligamento', e.target.value)} className="table-input date-input"/></td>
                <td>
                  <button onClick={() => removerLinha(usuario.id)} className="btn-excluir" disabled={usuarios.length === 1}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="lista-registros">
        {listaUsuariosEncaminhadosList.length === 0 ? (
          <p>Nenhum registro salvo.</p>
        ) : (
          <ul>
            {listaUsuariosEncaminhadosList.map((item) => (
              <li key={item.id}>
                Ano: {item.anoReferencia} - Usuários: {item.usuarios.length}{" "}
                <button className="btn-editar" onClick={() => handleEditar(item)}>Editar</button>{" "}
                <button className="btn-visualizar" onClick={() => handleVisualizar(item)}>Visualizar</button>{" "}
                <button className="btn-excluir" onClick={() => handleExcluir(item.id)}>Excluir</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ListaUsuariosEncaminhados;
