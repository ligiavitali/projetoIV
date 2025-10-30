import React from 'react';
import { useDispatch } from 'react-redux';
import { updateFormularioAvaliacao, updateAvaliacaoExperiencia1, updateAvaliacaoExperiencia2, updateFichaAcompanhamento, updateListaUsuariosEncaminhados } from '../redux/slices/formulariosSlice';

const FormularioListagem = ({ data, collectionName, onEdit, onDelete, title, displayFields }) => {
  const dispatch = useDispatch();

  const handleVisualizar = (item) => {
    // Exibir todos os campos do item, exceto o ID
    const detalhes = Object.entries(item)
      .filter(([key]) => key !== 'id')
      .map(([key, value]) => {
        // Formata a exibição de objetos aninhados (como o de questões)
        if (typeof value === 'object' && value !== null) {
          return `${key}: ${JSON.stringify(value, null, 2)}`;
        }
        return `${key}: ${value}`;
      })
      .join('\n\n');

    alert(`Detalhes do Registro:\n\n${detalhes}`);
  };

  const handleExcluir = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este registro?")) return;
    
    try {
      const response = await fetch(`http://localhost:5000/${collectionName}/${id}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        alert("Registro excluído com sucesso! Recarregue a página para ver a lista atualizada.");
        // Não há uma forma simples de recarregar a lista sem um thunk de fetchAll.
        // Por enquanto, apenas notificamos o usuário.
        // O ideal seria despachar uma ação para remover o item do estado local.
        // Como o foco é a funcionalidade, vamos deixar o recarregamento manual por enquanto.
      } else {
        alert("Erro ao excluir registro!");
      }
    } catch (error) {
      console.error("Erro ao excluir registro:", error);
      alert("Erro ao excluir registro. Verifique se o JSON Server está rodando.");
    }
  };

  // Define as chaves para a exibição na tabela
  const fields = displayFields || Object.keys(data[0] || {}).filter(key => key !== 'id');
  
  // Limita o número de colunas para não quebrar o layout
  const visibleFields = fields.slice(0, 5);

  return (
    <div className="listagem-container">
      <h3>{title}</h3>
      
      {data.length === 0 ? (
        <p>Nenhum registro encontrado.</p>
      ) : (
        <div className="table-container">
          <table className="listagem-table">
            <thead>
              <tr>
                {visibleFields.map(field => (
                  <th key={field}>{field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}</th>
                ))}
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id}>
                  {visibleFields.map(field => (
                    <td key={field}>{item[field] ? (typeof item[field] === 'object' ? '[Objeto]' : item[field].toString().substring(0, 50)) : '-'}</td>
                  ))}
                  <td className="actions-cell">
                    <button onClick={() => onEdit(item)} className="btn-edit" title="Editar">
                      ✏️
                    </button>
                    <button onClick={() => handleVisualizar(item)} className="btn-view" title="Visualizar Detalhes">
                      👁️
                    </button>
                    <button onClick={() => handleExcluir(item.id)} className="btn-delete" title="Excluir">
                      ❌
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="small-info">Nota: Para ver a lista atualizada após exclusão, recarregue a página.</p>
        </div>
      )}
    </div>
  );
};

export default FormularioListagem;
