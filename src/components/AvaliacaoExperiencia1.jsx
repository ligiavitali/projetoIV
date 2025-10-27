import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateAvaliacaoExperiencia1 } from '../redux/slices/formulariosSlice';

const AvaliacaoExperiencia1 = () => {
  const dispatch = useDispatch();
  const { formData: reduxFormData, questoes: reduxQuestoes } = useSelector((state) => state.formularios.avaliacaoExperiencia1);

  // Dados iniciais das questões (constante)
  const questoesIniciais = [
    { id: 1, texto: 'Atende as regras.', resposta: '' },
    { id: 2, texto: 'Socializa com o grupo.', resposta: '' },
    { id: 3, texto: 'Isola-se do grupo', resposta: '' },
    { id: 4, texto: 'Possui tolerância a frustração.', resposta: '' },
    { id: 5, texto: 'Respeita colega e professores.', resposta: '' },
    { id: 6, texto: 'Faz relatos fantasiosos.', resposta: '' },
    { id: 7, texto: 'Concentra-se nas atividades.', resposta: '' },
    { id: 8, texto: 'Tem iniciativa.', resposta: '' },
    { id: 9, texto: 'Sonolência durante as atividades em sala de aula.', resposta: '' },
    { id: 10, texto: 'Alterações intensas de humor.', resposta: '' },
    { id: 11, texto: 'Indica oscilação repentina de humor.', resposta: '' },
    { id: 12, texto: 'Irrita-se com facilidade.', resposta: '' },
    { id: 13, texto: 'Ansiedade.', resposta: '' },
    { id: 14, texto: 'Escuta quando seus colegas falam.', resposta: '' },
    { id: 15, texto: 'Escuta e segue orientação dos professores.', resposta: '' },
    { id: 16, texto: 'Mantem-se em sala de aula.', resposta: '' },
    { id: 17, texto: 'Desloca-se muito na sala.', resposta: '' },
    { id: 18, texto: 'Fala demasiadamente.', resposta: '' },
    { id: 19, texto: 'É pontual.', resposta: '' },
    { id: 20, texto: 'É assíduo.', resposta: '' },
    { id: 21, texto: 'Demonstra desejo de trabalhar.', resposta: '' },
    { id: 22, texto: 'Apropria-se indevidamente daquilo que não é seu.', resposta: '' },
    { id: 23, texto: 'Indica hábito de banho diário.', resposta: '' },
    { id: 24, texto: 'Indica habito de escovação e qualidade na escovação.', resposta: '' },
    { id: 25, texto: 'Indica cuidado com a aparência e limpeza do uniforme.', resposta: '' },
    { id: 26, texto: 'Indica autonomia quanto a estes hábitos (23, 24, 25).', resposta: '' },
    { id: 27, texto: 'Indica falta do uso de medicação com oscilações de comportamento.', resposta: '' },
    { id: 28, texto: 'Tem meio articulado de conseguir receitas e aquisições das medicações.', resposta: '' },
    { id: 29, texto: 'Traz seus materiais organizados.', resposta: '' },
    { id: 30, texto: 'Usa transporte coletivo.', resposta: '' },
    { id: 31, texto: 'Tem iniciativa diante das atividades propostas.', resposta: '' },
    { id: 32, texto: 'Localiza-se no espaço da Instituição.', resposta: '' },
    { id: 33, texto: 'Situa-se nas trocas de sala e atividades.', resposta: '' },
    { id: 34, texto: 'Interage par a par.', resposta: '' },
    { id: 35, texto: 'Interage em grupo.', resposta: '' },
    { id: 36, texto: 'Cria conflitos e intrigas.', resposta: '' },
    { id: 37, texto: 'Promove a harmonia.', resposta: '' },
    { id: 38, texto: 'Faz intrigas entre colegas x professores.', resposta: '' },
    { id: 39, texto: 'Demonstra interesse em participar das atividades extraclasses.', resposta: '' },
    { id: 40, texto: 'Você percebe que existe interação/participação da família em apoio ao usuário na Instituição.', resposta: '' },
    { id: 41, texto: 'Você percebe superproteção por parte da família quanto a autonomia do usuário.', resposta: '' },
    { id: 42, texto: 'Usuário traz relatos negativos da família (de forma geral).', resposta: '' },
    { id: 43, texto: 'Usuário traz relatos positivos da família (de forma geral).', resposta: '' },
    { id: 44, texto: 'Você percebe incentivo quanto a busca de autonomia para o usuário por parte da família.', resposta: '' },
    { id: 45, texto: 'Você percebe incentivo quanto a inserção do usuário no mercado de trabalho por parte da família.', resposta: '' },
    { id: 46, texto: 'Traz os documentos enviados pela Instituição assinado.', resposta: '' }
  ];

  // Usar o estado do Redux ou as questões iniciais
  const questoes = reduxQuestoes && reduxQuestoes.length > 0 ? reduxQuestoes : questoesIniciais;
  const formData = reduxFormData || {}; // Garante que formData não é undefined

  const [questaoAberta, setQuestaoAberta] = useState('');

  const opcoes = ['Sim', 'Não', 'Maioria das vezes', 'Raras vezes'];

  const handleInputChange = (field, value) => {
    dispatch(updateAvaliacaoExperiencia1({ formData: { ...formData, [field]: value } }));
  };

  const handleQuestaoChange = (id, value) => {
    const updatedQuestoes = questoes.map(q => q.id === id ? { ...q, resposta: value } : q);
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
    const updatedQuestoes = questoes.filter(q => q.id !== id);
    dispatch(updateAvaliacaoExperiencia1({ questoes: updatedQuestoes }));
  };

  const salvarFormulario = () => {
    console.log('Dados salvos:', { formData, questoes });
    alert('Avaliação Experiência 1 salva com sucesso!');
  };

  return (
    <div className="avaliacao-container">
      <div className="avaliacao-header">
        <h1>INSTITUTO DE EDUCAÇÃO ESPECIAL</h1>
        <h2>DIOMÍCIO FREITAS</h2>
        <h3>Criciúma - SC</h3>
        <h4>Avaliação Usuário em período de Experiência - 1ª Avaliação</h4>
      </div>

      <div className="form-section">
        <div className="form-row">
          <div className="form-group">
            <label>Nome:</label>
            <input
              type="text"
              value={formData.nome || ''}
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
              value={formData.dataEntrada || ''}
              onChange={(e) => handleInputChange('dataEntrada', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>1ª Avaliação:</label>
            <input
              type="date"
              value={formData.dataAvaliacao || ''}
              onChange={(e) => handleInputChange('dataAvaliacao', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="questoes-section">
        <h3>Questionário</h3>
        
        <div className="admin-controls">
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
        </div>

        <div className="questoes-list">
          {questoes.map((questao) => (
            <div key={questao.id} className="questao-item">
              <div className="questao-numero">{questao.id}</div>
              <div className="questao-texto">{questao.texto}</div>
              <div className="questao-opcoes">
                {opcoes.map(opcao => (
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
        <h4>47 - Em sua opinião o usuário tem perfil para esta instituição? Por quê?</h4>
        <textarea
          value={formData.observacoes || ''}
          onChange={(e) => handleInputChange('observacoes', e.target.value)}
          placeholder="Descreva sua opinião..."
          rows="4"
        />
      </div>

      <div className="questao-especial">
        <h4>Em que situações demonstra irritações?</h4>
        <textarea
          value={formData.situacoesIrritacao || ''}
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
            value={formData.nomeAvaliador || ''}
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
    </div>
  );
};

export default AvaliacaoExperiencia1;
