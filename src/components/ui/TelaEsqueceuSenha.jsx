// ForgotPassword.js
import { useState } from 'react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simula envio de e-mail
    alert(`Link de redefinição de senha enviado para: ${email}`);
  };

  return (
    <div className="forgot-password-container">
      <h2>Recuperar Senha</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Digite seu e-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button type="submit">Enviar link de recuperação</button>
      </form>
    </div>
  );
};

export default ForgotPassword;
