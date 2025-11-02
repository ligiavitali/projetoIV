import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateFichaAcompanhamento, fetchFichaAcompanhamentoList, saveFichaAcompanhamento, deleteFichaAcompanhamento } from '../redux/slices/formulariosSlice';

const FichaAcompanhamento = () => {
  const dispatch = useDispatch();
  const { fichaAcompanhamento: formData, fichaAcompanhamentoList, loading, error } = useSelector((state) => state.formularios);

  useEffect(() => {
    dispatch(fetchFichaAcompanhamentoList());
  }, [dispatch]);

  const handleInputChange = (field, value) => {
    dispatch(updateFichaAcompanhamento({ [field]: value }));
  };

  const handleEditar = (item) => {
    dispatch(updateFichaAcompanhamento({ ...item, id: item.id }));
  };

  const handleExcluir = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este registro?")) {
      await dispatch(deleteFichaAcompanhamento(id));
      dispatch(fetchFichaAcompanhamentoList());
    }
  };

  const handleVisualizar = (item) => {
  const detalhes = Object.entries(item)
    .map(([key, value]) => {
      // Verifica se o valor parece uma data
      const data = new Date(value);
      if (!isNaN(data) && typeof value === "string" && value.includes("-")) {
        const dia = String(data.getDate()).padStart(2, "0");
        const mes = String(data.getMonth() + 1).padStart(2, "0");
        const ano = data.getFullYear();
        return `${key}: ${dia}/${mes}/${ano}`;
      }
      return `${key}: ${value}`;
    })
    .join("\n");

  alert(detalhes);
};


const salvarFormulario = () => {
  const { nome, dataAdmissao, dataVisita, empresa, responsavelRH, contatoCom, parecerGeral } = formData;

  // Lista de campos obrigatórios com rótulos amigáveis
  const camposObrigatorios = {
    nome: "Nome",
    dataAdmissao: "Data de Admissão",
    dataVisita: "Data da Visita",
    empresa: "Empresa",
    responsavelRH: "Responsável RH",
    contatoCom: "Contato com",
    parecerGeral: "Parecer Geral"
  };

  // Verifica quais campos estão vazios
  const camposVazios = Object.entries(camposObrigatorios)
    .filter(([campo]) => !formData?.[campo]?.trim())
    .map(([_, label]) => label);

  if (camposVazios.length > 0) {
    alert(`Preencha os seguintes campos antes de salvar:\n\n• ${camposVazios.join("\n• ")}`);
    return; // interrompe o salvamento
  }

  // Se tudo estiver válido, prossegue com o dispatch
  dispatch(saveFichaAcompanhamento(formData))
    .unwrap()
    .then(() => {
      alert('Ficha de Acompanhamento salva com sucesso!');
      dispatch(fetchFichaAcompanhamentoList());
      dispatch(updateFichaAcompanhamento({
        nome: '',
        dataAdmissao: '',
        dataVisita: '',
        empresa: '',
        responsavelRH: '',
        contatoCom: '',
        parecerGeral: '',
        id: undefined
      }));
    })
    .catch((err) => {
      alert(`Erro ao salvar ficha: ${err.message || 'Erro desconhecido'}`);
      console.error("Erro ao salvar:", err);
    });
};


  const limparFormulario = () => {
    dispatch(updateFichaAcompanhamento({ nome: '', dataAdmissao: '', dataVisita: '', empresa: '', responsavelRH: '', contatoCom: '', parecerGeral: '', id: undefined }));
  };

  if (loading) return <div className="loading-message">Carregando Ficha de Acompanhamento...</div>;
  if (error) return <div className="error-message">Erro ao carregar ficha: {error.message}</div>;

  return (
    <div className="ficha-container">
      <div className="ficha-header">
        <h1>INSTITUTO DE EDUCAÇÃO ESPECIAL</h1>
        <h2>DIOMÍCIO FREITAS</h2>
        <h3>Criciúma - SC</h3>
        <h4>ACOMPANHAMENTO MERCADO DE TRABALHO</h4>
      </div>

      <div className="form-section">
        <div className="form-row">
          <div className="form-group full-width">
            <label>Nome:</label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => handleInputChange('nome', e.target.value)}
              placeholder="Nome completo do usuário"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Data de admissão:</label>
            <input
              type="date"
              value={formData.dataAdmissao}
              onChange={(e) => handleInputChange('dataAdmissao', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Data da visita:</label>
            <input
              type="date"
              value={formData.dataVisita}
              onChange={(e) => handleInputChange('dataVisita', e.target.value)}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group full-width">
            <label>Empresa:</label>
            <input
              type="text"
              value={formData.empresa}
              onChange={(e) => handleInputChange('empresa', e.target.value)}
              placeholder="Nome da empresa"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Responsável RH:</label>
            <input
              type="text"
              value={formData.responsavelRH}
              onChange={(e) => handleInputChange('responsavelRH', e.target.value)}
              placeholder="Nome do responsável pelo RH"
            />
          </div>
          <div className="form-group">
            <label>Contato com:</label>
            <input
              type="text"
              value={formData.contatoCom}
              onChange={(e) => handleInputChange('contatoCom', e.target.value)}
              placeholder="Pessoa de contato"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group full-width">
            <label>Parecer Geral:</label>
            <textarea
              value={formData.parecerGeral}
              onChange={(e) => handleInputChange('parecerGeral', e.target.value)}
              placeholder="Descreva o parecer geral sobre o acompanhamento..."
              rows="8"
              className="parecer-textarea"
            />
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button onClick={salvarFormulario} className="btn-save">Salvar Ficha</button>
        <button onClick={limparFormulario} className="btn-clear">Limpar Formulário</button>
      </div>

      <div className="lista-registros">
        {fichaAcompanhamentoList.length === 0 ? (
          <p>Nenhum registro salvo.</p>
        ) : (
          <ul>
            {fichaAcompanhamentoList.map((item) => (
              <li key={item.id}>
                {item.nome || 'Sem nome'} - {item.empresa || 'Sem empresa'} - {item.dataVisita || 'Sem data'}{" "}
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

export default FichaAcompanhamento;
