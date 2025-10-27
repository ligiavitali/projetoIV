// Register.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateRegisterData, resetRegisterData } from '../redux/slices/cadastroSlice';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const registerData = useSelector((state) => state.cadastro.registerData);

  // O estado local é mantido apenas para fins de sincronização inicial,
  // mas o formulário lê diretamente do Redux.
  const [formData, setFormData] = useState(registerData);

  useEffect(() => {
    setFormData(registerData);
  }, [registerData]);

  const handleChange = (e) => {
    const newData = { [e.target.name]: e.target.value };
    dispatch(updateRegisterData(newData));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simula cadastro
    // Aqui você faria a chamada à API usando os dados em registerData
    console.log('Dados de Registro:', registerData);
    alert('Usuário cadastrado com sucesso! (Dados no Redux)');
    dispatch(resetRegisterData()); // Limpa o estado após o "cadastro"
    navigate('/'); // Volta para o login
  };

  return (
    <div className="register-container">
      {/* CARD CENTRALIZADO */}
      <div className="register-card">
        <h2>Criar Conta</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome</label>
            <input
              type="text"
              name="name"
              value={registerData.name || ''}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>E-mail</label>
            <input
              type="email"
              name="email"
              value={registerData.email || ''}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Senha</label>
            <input
              type="password"
              name="password"
              value={registerData.password || ''}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit">Cadastrar</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
