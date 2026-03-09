import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [recoveryUrl, setRecoveryUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      alert('Por favor, digite seu e-mail');
      return;
    }

    setLoading(true);
    setMessage('');
    setRecoveryUrl('');

    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || 'Não foi possível iniciar a recuperação de senha.');
      }

      setMessage(data.message || `Solicitação recebida para ${email}.`);
      setRecoveryUrl(data.recoveryUrl || '');
      setEmail('');
    } catch (error) {
      setMessage(error.message || 'Erro ao solicitar recuperação de senha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <h2>Recuperar senha</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Digite seu e-mail</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="seuemail@exemplo.com"
              required
            />
          </div>
          <button type="submit" disabled={loading}>{loading ? 'Enviando...' : 'Enviar'}</button>
        </form>
        {message && <p className="success-message">{message}</p>}
        {recoveryUrl && (
          <p className="success-message">
            Link de recuperação: <a href={recoveryUrl}>{recoveryUrl}</a>
          </p>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
