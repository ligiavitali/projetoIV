import { useState } from 'react';

const Login = ({ onLogin }) => {
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
      onLogin(formData.email);
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
        
        <div className="login-footer">
          <p>Sistema desenvolvido para controle interno de avaliações</p>
        </div>
      </div>
    </div>
  );
};

export default Login;

