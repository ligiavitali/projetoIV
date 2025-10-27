import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/slices/userSlice';
import { useNavigate } from 'react-router-dom';

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulação de login - em produção seria uma chamada à API
    if (formData.email && formData.password) {
      // Dispatch da ação loginSuccess com os dados do usuário
      dispatch(loginSuccess({ email: formData.email, name: 'Usuário Teste' }));
      navigate('/'); // Redireciona para a página principal após o login
    } else {
      alert('Por favor, preencha todos os campos');
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

        <div className="login-footer-links" style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
          <button
            type="button"
            onClick={() => navigate('/Register')}
            style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer', padding: 0 }}
          >
            Criar Conta
          </button>

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
