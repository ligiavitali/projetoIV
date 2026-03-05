import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../lib/api.js';

const RecuperarSenha = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setMessage('Token não encontrado. Solicite a recuperação de senha novamente.');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;
    if (novaSenha !== confirmarSenha) {
      setMessage('As senhas não coincidem.');
      return;
    }
    if (novaSenha.length < 6) {
      setMessage('A senha deve ter no mínimo 6 caracteres.');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      await api.post(`/auth/recuperar?token=${encodeURIComponent(token)}`, { novaSenha });
      setMessage('Senha alterada com sucesso! Redirecionando para o login...');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Token inválido ou expirado.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="forgot-password-container">
        <div className="forgot-password-card">
          <h2>Recuperar senha</h2>
          <p className="error-message">{message}</p>
          <button onClick={() => navigate('/forgot-password')}>Voltar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <h2>Nova senha</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nova senha</label>
            <input
              type="password"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <div className="form-group">
            <label>Confirmar senha</label>
            <input
              type="password"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Salvando...' : 'Alterar senha'}
          </button>
        </form>
        {message && <p className={message.includes('sucesso') ? 'success-message' : 'error-message'}>{message}</p>}
      </div>
    </div>
  );
};

export default RecuperarSenha;
