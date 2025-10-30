import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  updateAvaliacaoExperiencia1,
  fetchAvaliacaoExperiencia1List,
  saveAvaliacaoExperiencia1,
  deleteAvaliacaoExperiencia1
} from '../redux/slices/formulariosSlice';
import FormularioListagem from './FormularioListagem';

const AvaliacaoExperiencia1 = () => {
  const dispatch = useDispatch();
  const {
    avaliacaoExperiencia1: formState,
    avaliacaoExperiencia1List,
    loading,
    error
  } = useSelector((state) => state.formularios);

  // Garante que formData e questoes existam
  const reduxFormData = formState?.formData || {};
  const reduxQuestoes = formState?.questoes || [];

  // Questões padrão
  const questoesIniciais = [
    { id: 1, texto: 'Atende as regras.', resposta: '' },
    { id: 2, texto: 'Socializa com o grupo.', resposta: '' },
    { id: 3, texto: 'Isola-se do grupo.', resposta: '' },
    { id: 4, texto: 'Possui tolerância a frustração.', resposta: '' },
    { id: 5, texto: 'Respeita colegas e professores.', resposta: '' },
    { id: 6, texto: 'Faz relatos fantasiosos.', resposta: '' },
    { id: 7, texto: 'Concentra-se nas atividades.', resposta: '' },
    { id: 8, texto: 'Tem iniciativa.', resposta: '' },
    { id: 9, texto: 'Sonolência durante as atividades.', resposta: '' },
    { id: 10, texto: 'Alterações intensas de humor.', resposta: '' },
    { id: 11, texto: 'Oscilações repentinas de humor.', resposta: '' },
    { id: 12, texto: 'Irrita-se com facilidade.', resposta: '' },
    { id: 13, texto: 'Ansiedade.', resposta: '' },
    { id: 14, texto: 'Escuta colegas.', resposta: '' },
    { id: 15, texto: 'Segue orientação dos professores.', resposta: '' },
    { id: 16, texto: 'Mantém-se em sala de aula.', resposta: '' },
    { id: 17, texto: 'Desloca-se muito na sala.', resposta: '' },
    { id: 18, texto: 'Fala demasiadamente.', resposta: '' },
    { id: 19, texto: 'É pontual.', resposta: '' },
    { id: 20, texto: 'É assíduo.', resposta: '' },
    { id: 21, texto: 'Demonstra desejo de trabalhar.', resposta: '' },
    { id: 22, texto: 'Apropria-se indevidamente do que não é seu.', resposta: '' },
    { id: 23, texto: 'Hábito de banho diário.', resposta: '' },
    { id: 24, texto: 'Hábito de escovação dental.', resposta: '' },
    { id: 25, texto: 'Cuidado com aparência e uniforme.', resposta: '' },
    { id: 26, texto: 'Autonomia nos hábitos de higiene.', resposta: '' },
    { id: 27, texto: 'Oscilações de comportamento sem medicação.', resposta: '' },
    { id: 28, texto: 'Possui acesso regular às medicações.', resposta: '' },
    { id: 29, texto: 'Traz materiais organizados.', resposta: '' },
    { id: 30, texto: 'Usa transporte coletivo.', resposta: '' },
    { id: 31, texto: 'Tem iniciativa diante das atividades.', resposta: '' },
    { id: 32, texto: 'Localiza-se no espaço da instituição.', resposta: '' },
    { id: 33, texto: 'Situa-se nas trocas de sala e atividades.', resposta: '' },
    { id: 34, texto: 'Interage par a par.', resposta: '' },
    { id: 35, texto: 'Interage em grupo.', resposta: '' },
    { id: 36, texto: 'Cria conflitos e intrigas.', resposta: '' },
    { id: 37, texto: 'Promove harmonia.', resposta: '' },
    { id: 38, texto: 'Faz intrigas entre colegas e professores.', resposta: '' },
    { id: 39, texto: 'Interesse em atividades extraclasses.', resposta: '' },
    { id: 40, texto: 'Família apoia a instituição.', resposta: '' },
    { id: 41, texto: 'Família demonstra superproteção.', resposta: '' },
    { id: 42, texto: 'Usuário traz relatos negativos da família.', resposta: '' },
    { id: 43, texto: 'Usuário traz relatos positivos da família.', resposta: '' },
    { id: 44, texto: 'Família incentiva autonomia.', resposta: '' },
    { id: 45, texto: 'Família incentiva inserção no mercado.', resposta: '' },
    { id: 46, texto: 'Traz documentos assinados pela família.', resposta: '' }
  ];

  const questoes = reduxQuestoes.length > 0 ? reduxQuestoes : questoesIniciais;
  const [questaoAberta, setQuestaoAberta] = useState('');

  useEffect(() => {
    dispatch(fetchAvaliacaoExperiencia1List());
  }, [dispatch]);

  const opcoes = ['Sim', 'Não', 'Maioria das vezes', 'Raras vezes'];

  const handleInputChange = (field, value) => {
    dispatch(updateAvaliacaoExperiencia1({ formData: { ...reduxFormData, [field]: value } }));
  };

  const handleQuestaoChange = (id, value) => {
    const updatedQuestoes = questoes.map((q) =>
      q.id === id ? { ...q, resposta: value } : q
    );
    dispatch(updateAvaliacaoExperiencia1({ questoes: updatedQuestoes }));
  };

  const adicionarQuestao = () => {
    if (questaoAberta.trim()) {
      const novaQuestao = {
        id: questoes.length + 1,
        texto: questaoAberta,
        resposta: ''
      };
      dispatch(updateAvaliacaoExperiencia1({ questoes: [...questoes, novaQuestao] }));
      setQuestaoAberta('');
    }
  };

  const removerQuestao = (id) => {
    const updatedQuestoes = questoes.filter((q) => q.id !== id);
    dispatch(updateAvaliacaoExperiencia1({ questoes: updatedQuestoes }));
  };

  const handleEditar = (item) => {
    dispatch(
      updateAvaliacaoExperiencia1({
        formData: item.formData,
        questoes: item.questoes,
        id: item.id
      })
    );
  };

  const handleExcluir = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este registro?')) {
      await dispatch(deleteAvaliacaoExperiencia1(id));
      dispatch(fetchAvaliacaoExperiencia1List());
    }
  };

  const salvarFormulario = () => {
    const dataToSave = {
      id: formState.id,
      formData: reduxFormData,
      questoes: questoes,
      nome: reduxFormData?.nome || 'Registro Sem Nome'
    };

    dispatch(saveAvaliacaoExperiencia1(dataToSave))
      .unwrap()
      .then(() => {
        alert('Avaliação Experiência 1 salva com sucesso!');
        dispatch(fetchAvaliacaoExperiencia1List());
        dispatch(
          updateAvaliacaoExperiencia1({
            formData: {},
            questoes: questoesIniciais,
            id: undefined
          })
        );
      })
      .catch((err) => {
        alert(`Erro ao salvar: ${err.message || 'Erro desconhecido'}`);
        console.error('Erro ao salvar:', err);
      });
  };

  if (loading) {
    return <div className="loading-message">Carregando Avaliação Experiência 1...</div>;
  }

  if (error) {
    return <div className="error-message">Erro ao carregar: {error.message}</div>;
  }

  return (
    <div className="avaliacao-container">
      <div className="avaliacao-header">
        <h1>INSTITUTO DE EDUCAÇÃO ESPECIAL</h1>
        <h2>DIOMÍCIO FREITAS</h2>
        <h3>Criciúma - SC</h3>
        <h4>Avaliação Usuário em Período de Experiência - 1ª Avaliação</h4>
      </div>

      <div className="form-section">
        <div className="form-row">
          <div className="form-group">
            <label>Nome:</label>
            <input
              type="text"
              value={reduxFormData.nome || ''}
              onChange={(e) => handleInputChange('nome', e.target.value)}
              placeholder="Nome completo do usuário"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Data da entrada:</label>
            <input
              type="date"
              value={reduxFormData.dataEntrada || ''}
              onChange={(e) => handleInputChange('dataEntrada', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>1ª Avaliação:</label>
            <input
              type="date"
              value={reduxFormData.dataAvaliacao || ''}
              onChange={(e) => handleInputChange('dataAvaliacao', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="questoes-section">
        <h3>Questionário</h3>

        <div className="add-questao">
          <input
            type="text"
            value={questaoAberta}
            onChange={(e) => setQuestaoAberta(e.target.value)}
            placeholder="Digite uma nova questão..."
            className="questao-input"
          />
          <button onClick={adicionarQuestao} className="btn-add-questao">
            ➕ Adicionar Questão
          </button>
        </div>

        <div className="questoes-list">
          {questoes.map((questao) => (
            <div key={questao.id} className="questao-item">
              <div className="questao-numero">{questao.id}</div>
              <div className="questao-texto">{questao.texto}</div>
              <div className="questao-opcoes">
                {opcoes.map((opcao) => (
                  <label key={opcao} className="radio-label">
                    <input
                      type="radio"
                      name={`questao-${questao.id}`}
                      value={opcao}
                      checked={questao.resposta === opcao}
                      onChange={(e) => handleQuestaoChange(questao.id, e.target.value)}
                    />
                    <span>{opcao}</span>
                  </label>
                ))}
              </div>
              {questao.id > 46 && (
                <button
                  onClick={() => removerQuestao(questao.id)}
                  className="btn-remove-questao"
                  title="Remover questão"
                >
                  ❌
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="questao-especial">
        <h4>47 - O usuário tem perfil para esta instituição? Por quê?</h4>
        <textarea
          value={reduxFormData.observacoes || ''}
          onChange={(e) => handleInputChange('observacoes', e.target.value)}
          placeholder="Descreva sua opinião..."
          rows="4"
        />
      </div>

      <div className="questao-especial">
        <h4>Em que situações demonstra irritação?</h4>
        <textarea
          value={reduxFormData.situacoesIrritacao || ''}
          onChange={(e) => handleInputChange('situacoesIrritacao', e.target.value)}
          placeholder="Descreva as situações..."
          rows="3"
        />
      </div>

      <div className="form-section">
        <div className="form-group">
          <label>Nome do professor(a):</label>
          <input
            type="text"
            value={reduxFormData.nomeAvaliador || ''}
            onChange={(e) => handleInputChange('nomeAvaliador', e.target.value)}
            placeholder="Nome completo do avaliador"
          />
        </div>
      </div>

      <div className="form-actions">
        <button onClick={salvarFormulario} className="btn-save">
          💾 Salvar Avaliação
        </button>
      </div>

      <FormularioListagem
        data={avaliacaoExperiencia1List}
        collectionName="avaliacaoExperiencia1"
        onEdit={handleEditar}
        onDelete={handleExcluir}
        title="Registros Salvos"
        displayFields={['nome']}
      />
    </div>
  );
};

export default AvaliacaoExperiencia1;
