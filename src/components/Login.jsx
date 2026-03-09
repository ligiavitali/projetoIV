import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/slices/userSlice';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/usuarios`);
      if (!response.ok) {
        throw new Error('Falha ao consultar usuários');
      }

      const usuarios = await response.json();
      const usuario = Array.isArray(usuarios)
        ? usuarios.find(
            (u) =>
              (u.email || '').toLowerCase() === formData.email.trim().toLowerCase() &&
              (u.senha_hash || '') === formData.password
          )
        : null;

      if (!usuario) {
        alert('E-mail ou senha inválidos.');
        return;
      }

      let nivelAcesso = usuario.nivel_acesso || null;

      // Compatibilidade: contas antigas sem nivel_acesso viram admin no primeiro login.
      if (!nivelAcesso) {
        const promoteResponse = await fetch(`${API_URL}/usuarios/${usuario.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nome: usuario.nome,
            email: usuario.email,
            nivel_acesso: 'admin',
          }),
        });

        if (promoteResponse.ok) {
          nivelAcesso = 'admin';
        }
      }

      dispatch(
        loginSuccess({
          id: usuario.id,
          email: usuario.email,
          name: usuario.nome,
          nivel_acesso: nivelAcesso || 'usuario',
        })
      );
      navigate('/dashboard');
    } catch (error) {
      alert(`Erro ao fazer login: ${error.message}`);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Sistema de Avaliação</h1>
          <p>Controle Interno - Período de Experiência</p>
        </div>
        
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Digite seu e-mail"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Digite sua senha"
              required
            />
          </div>
          
          <button type="submit" className="login-btn">
            Entrar
          </button>
        </form>

        <div className="login-footer-links" style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={() => navigate('/forgot-password')}
            style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer', padding: 0 }}
          >
            Esqueceu a senha?
          </button>
        </div>
        
        <div className="login-footer" style={{ marginTop: '30px' }}>
        </div>
      </div>
    </div>
  );
};

export default Login;
