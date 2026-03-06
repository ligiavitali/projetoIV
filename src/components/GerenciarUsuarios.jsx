import { useEffect, useState } from "react";

const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:3001/api"}/usuarios`;

const initialForm = {
  nome: "",
  email: "",
  nivel: "professor",
};

const GerenciarUsuarios = () => {
  const [formData, setFormData] = useState(initialForm);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const carregarUsuarios = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("Falha ao carregar usuários");
      }
      const data = await response.json();
      setUsuarios(Array.isArray(data) ? data : []);
    } catch (error) {
      alert(`Erro ao carregar usuários: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nome = formData.nome.trim();
    const email = formData.email.trim();

    if (!nome || !email || !formData.nivel) {
      alert("Preencha nome, e-mail e nível do usuário.");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          email,
          nivel: formData.nivel,
        }),
      });

      if (!response.ok) {
        throw new Error("Falha ao salvar usuário");
      }

      alert("Usuário salvo com sucesso!");
      setFormData(initialForm);
      carregarUsuarios();
    } catch (error) {
      alert(`Erro ao salvar usuário: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleExcluir = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este usuário?")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Falha ao excluir usuário");
      }

      alert("Usuário excluído com sucesso!");
      carregarUsuarios();
    } catch (error) {
      alert(`Erro ao excluir usuário: ${error.message}`);
    }
  };

  return (
    <div className="lista-container">
      <div className="lista-header">
        <h1>Gerenciamento de Usuários</h1>
        <h3>Inserção e remoção de usuários do sistema</h3>
      </div>

      <div className="form-section">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Nome</label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => handleInputChange("nome", e.target.value)}
                placeholder="Nome completo"
              />
            </div>
            <div className="form-group">
              <label>E-mail</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="email@dominio.com"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Nível de acesso</label>
              <select
                value={formData.nivel}
                onChange={(e) => handleInputChange("nivel", e.target.value)}
              >
                <option value="adm">adm</option>
                <option value="professor">professor</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-save" disabled={saving}>
              {saving ? "Salvando..." : "Salvar Usuário"}
            </button>
          </div>
        </form>
      </div>

      <div className="lista-registros">
        <h3>Usuários Cadastrados</h3>

        {loading ? (
          <p>Carregando usuários...</p>
        ) : usuarios.length === 0 ? (
          <p>Nenhum usuário cadastrado.</p>
        ) : (
          <ul>
            {usuarios.map((usuario) => (
              <li key={usuario.id}>
                <strong>{usuario.nome}</strong> - {usuario.email} ({usuario.nivel})
                <button
                  className="btn-excluir"
                  onClick={() => handleExcluir(usuario.id)}
                >
                  Excluir
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default GerenciarUsuarios;
