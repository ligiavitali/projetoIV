import { useState } from "react";

const FormularioAvaliacao = () => {
  const [avaliacoes, setAvaliacoes] = useState([
    {
      id: 1,
      nomeUsuario: "",
      ingresso: "",
      primeiraAval: "",
      segundaAval: "",
      primeiraEntrevistaPais: "",
      segundaEntrevistaPais: "",
      resultado: "",
    },
  ]);

  const handleInputChange = (id, field, value) => {
    setAvaliacoes((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
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
    setAvaliacoes((prev) => [...prev, novaLinha]);
  };

  const removerLinha = (id) => {
    if (avaliacoes.length > 1) {
      setAvaliacoes((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const salvarFormulario = () => {
    console.log("Dados salvos:", avaliacoes);
    alert("Formulário de avaliação salvo com sucesso!");
  };

  const limparFormulario = () => {
    setAvaliacoes([
      {
        id: 1,
        nomeUsuario: "",
        ingresso: "",
        primeiraAval: "",
        segundaAval: "",
        primeiraEntrevistaPais: "",
        segundaEntrevistaPais: "",
        resultado: "",
      },
    ]);
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
    </div>
  );
};

export default FormularioAvaliacao;
