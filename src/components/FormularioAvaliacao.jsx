import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateFormularioAvaliacao, resetFormulariosData, fetchControleInternoList, saveControleInterno, deleteControleInterno } from '../redux/slices/formulariosSlice';
import FormularioListagem from './FormularioListagem';

const FormularioAvaliacao = () => {
  const dispatch = useDispatch();
  // O estado do formulário de avaliação será um array de objetos
  const { formularioAvaliacao: formData, controleInternoList, loading, error } = useSelector((state) => state.formularios);
  
  // Estrutura do formulário de edição
  const avaliacoes = formData.data || [{
    id: Date.now(), // Usar Date.now() para garantir um ID temporário único para novo registro
    nomeUsuario: "",
    ingresso: "",
    primeiraAval: "",
    segundaAval: "",
    primeiraEntrevistaPais: "",
    segundaEntrevistaPais: "",
    resultado: "",
  }];

  useEffect(() => {
    dispatch(fetchControleInternoList());
  }, [dispatch]);

  const handleInputChange = (id, field, value) => {
    const updatedAvaliacoes = avaliacoes.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    dispatch(updateFormularioAvaliacao({ data: updatedAvaliacoes }));
  };

  const adicionarLinha = () => {
    const novaLinha = {
      id: Date.now(),
      nomeUsuario: "",
      ingresso: "",
      primeiraAval: "",
      segundaAval: "",
      primeiraEntrevistaPais: "",
      segundaEntrevistaPais: "",
      resultado: "",
    };
    dispatch(updateFormularioAvaliacao({ data: [...avaliacoes, novaLinha] }));
  };

  const removerLinha = (id) => {
    if (avaliacoes.length > 1) {
      const updatedAvaliacoes = avaliacoes.filter((item) => item.id !== id);
      dispatch(updateFormularioAvaliacao({ data: updatedAvaliacoes }));
    }
  };

  const handleEditar = (item) => {
    dispatch(updateFormularioAvaliacao({ data: item.data, id: item.id }));
  };

  const handleExcluir = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este registro?")) {
      await dispatch(deleteControleInterno(id));
      dispatch(fetchControleInternoList()); // Recarrega a lista
    }
  };

  const salvarFormulario = () => {
    const dataToSave = {
      id: formData.id, // ID para edição/criação
      data: avaliacoes,
      // Adicionar um campo de identificação para a lista
      nomeUsuario: avaliacoes.map(a => a.nomeUsuario).filter(n => n).join(', ') || 'Registro Sem Nome',
    };

    dispatch(saveControleInterno(dataToSave))
      .unwrap()
      .then(() => {
        alert("Formulário de avaliação salvo com sucesso!");
        dispatch(fetchControleInternoList()); // Recarrega a lista após salvar
        dispatch(updateFormularioAvaliacao({ data: [{
          id: Date.now(),
          nomeUsuario: "",
          ingresso: "",
          primeiraAval: "",
          segundaAval: "",
          primeiraEntrevistaPais: "",
          segundaEntrevistaPais: "",
          resultado: "",
        }], id: undefined })); // Limpa o formulário de edição
      })
      .catch((err) => {
        alert(`Erro ao salvar formulário: ${err.message || 'Erro desconhecido'}`);
        console.error("Erro ao salvar:", err);
      });
  };

  const limparFormulario = () => {
    // Limpa o formulário de avaliação no Redux
    dispatch(updateFormularioAvaliacao({ data: [{
      id: Date.now(),
      nomeUsuario: "",
      ingresso: "",
      primeiraAval: "",
      segundaAval: "",
      primeiraEntrevistaPais: "",
      segundaEntrevistaPais: "",
      resultado: "",
    }], id: undefined }));
  };

  if (loading) {
    return <div className="loading-message">Carregando Formulário de Avaliação...</div>;
  }

  if (error) {
    return <div className="error-message">Erro ao carregar formulário: {error.message}</div>;
  }

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
                    onChange={(e) =>
                      handleInputChange(
                        avaliacao.id,
                        "nomeUsuario",
                        e.target.value
                      )
                    }
                    placeholder="Nome completo"
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="date"
                    value={avaliacao.ingresso}
                    onChange={(e) =>
                      handleInputChange(
                        avaliacao.id,
                        "ingresso",
                        e.target.value
                      )
                    }
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="date"
                    value={avaliacao.primeiraAval}
                    onChange={(e) =>
                      handleInputChange(
                        avaliacao.id,
                        "primeiraAval",
                        e.target.value
                      )
                    }
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="date"
                    value={avaliacao.segundaAval}
                    onChange={(e) =>
                      handleInputChange(
                        avaliacao.id,
                        "segundaAval",
                        e.target.value
                      )
                    }
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="date"
                    value={avaliacao.primeiraEntrevistaPais}
                    onChange={(e) =>
                      handleInputChange(
                        avaliacao.id,
                        "primeiraEntrevistaPais",
                        e.target.value
                      )
                    }
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="date"
                    value={avaliacao.segundaEntrevistaPais}
                    onChange={(e) =>
                      handleInputChange(
                        avaliacao.id,
                        "segundaEntrevistaPais",
                        e.target.value
                      )
                    }
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="date"
                    value={avaliacao.resultado}
                    onChange={(e) =>
                      handleInputChange(
                        avaliacao.id,
                        "resultado",
                        e.target.value
                      )
                    }
                    className="table-input"
                  />
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
      
      <FormularioListagem 
        data={controleInternoList} 
        collectionName="controleInterno" 
        onEdit={handleEditar} 
        onDelete={handleExcluir}
        title="Registros Salvos"
        displayFields={['nomeUsuario']}
      />
    </div>
  );
};

export default FormularioAvaliacao;
