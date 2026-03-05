import { useState, useEffect } from 'react';
import api from '../lib/api.js';

const AdminUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ nome: '', email: '', senha: '', nivel_acesso: 'usuario' });
  const [resetSenhaId, setResetSenhaId] = useState(null);
  const [novaSenha, setNovaSenha] = useState('');

  const carregar = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/usuarios');
      setUsuarios(data);
    } catch (err) {
      alert(err.response?.data?.error || 'Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { carregar(); }, []);

  const handleCriar = async (e) => {
    e.preventDefault();
    if (!form.nome || !form.email || !form.senha) {
      alert('Preencha nome, email e senha');
      return;
    }
    try {
      await api.post('/usuarios', { ...form, senha: form.senha });
      alert('Usuário criado!');
      setForm({ nome: '', email: '', senha: '', nivel_acesso: 'usuario' });
      carregar();
    } catch (err) {
      alert(err.response?.data?.error || 'Erro ao criar');
    }
  };

  const handleEditar = (u) => {
    setEditing(u.id);
    setForm({ nome: u.nome, email: u.email, nivel_acesso: u.nivel_acesso });
  };

  const handleSalvarEdicao = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/usuarios/${editing}`, {
        nome: form.nome,
        email: form.email,
        nivel_acesso: form.nivel_acesso,
      });
      alert('Usuário atualizado!');
      setEditing(null);
      carregar();
    } catch (err) {
      alert(err.response?.data?.error || 'Erro ao atualizar');
    }
  };

  const handleAtivarInativar = async (id, ativo) => {
    try {
      await api.patch(`/usuarios/${id}/ativo`, { ativo });
      alert(ativo ? 'Usuário ativado' : 'Usuário inativado');
      carregar();
    } catch (err) {
      alert(err.response?.data?.error || 'Erro');
    }
  };

  const handleResetarSenha = async (e) => {
    e.preventDefault();
    if (!novaSenha || novaSenha.length < 6) {
      alert('Senha deve ter no mínimo 6 caracteres');
      return;
    }
    try {
      await api.post(`/usuarios/${resetSenhaId}/resetar-senha`, { senha: novaSenha });
      alert('Senha resetada!');
      setResetSenhaId(null);
      setNovaSenha('');
      carregar();
    } catch (err) {
      alert(err.response?.data?.error || 'Erro ao resetar senha');
    }
  };

  const handleExcluir = async (id) => {
    if (!window.confirm('Inativar este usuário?')) return;
    try {
      await api.delete(`/usuarios/${id}`);
      alert('Usuário inativado');
      carregar();
    } catch (err) {
      alert(err.response?.data?.error || 'Erro');
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="admin-usuarios">
      <h1>Administração de Usuários</h1>

      <form onSubmit={handleCriar} className="admin-form">
        <h3>Criar usuário</h3>
        <input
          placeholder="Nome"
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Senha"
          value={form.senha}
          onChange={(e) => setForm({ ...form, senha: e.target.value })}
        />
        <select
          value={form.nivel_acesso}
          onChange={(e) => setForm({ ...form, nivel_acesso: e.target.value })}
        >
          <option value="usuario">Usuário</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Criar</button>
      </form>

      <div className="admin-lista">
        <h3>Usuários</h3>
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Nível</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id}>
                {editing === u.id ? (
                  <>
                    <td>
                      <input
                        value={form.nome}
                        onChange={(e) => setForm({ ...form, nome: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                      />
                    </td>
                    <td>
                      <select
                        value={form.nivel_acesso}
                        onChange={(e) => setForm({ ...form, nivel_acesso: e.target.value })}
                      >
                        <option value="usuario">Usuário</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td>-</td>
                    <td>
                      <button onClick={handleSalvarEdicao}>Salvar</button>
                      <button onClick={() => setEditing(null)}>Cancelar</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{u.nome}</td>
                    <td>{u.email}</td>
                    <td>{u.nivel_acesso}</td>
                    <td>{u.ativo ? 'Ativo' : 'Inativo'}</td>
                    <td>
                      <button onClick={() => handleEditar(u)}>Editar</button>
                      <button
                        onClick={() => handleAtivarInativar(u.id, !u.ativo)}
                        disabled={u.ativo === undefined}
                      >
                        {u.ativo ? 'Inativar' : 'Ativar'}
                      </button>
                      <button onClick={() => setResetSenhaId(u.id)}>Resetar senha</button>
                      <button onClick={() => handleExcluir(u.id)}>Excluir</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {resetSenhaId && (
        <div className="modal">
          <form onSubmit={handleResetarSenha}>
            <h3>Nova senha</h3>
            <input
              type="password"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              required
              minLength={6}
            />
            <button type="submit">Confirmar</button>
            <button type="button" onClick={() => { setResetSenhaId(null); setNovaSenha(''); }}>
              Cancelar
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminUsuarios;
