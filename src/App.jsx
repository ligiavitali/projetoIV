import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './components/Login';
import Cadastro from './components/Cadastro'; // cadastro interno com abas
import Formularios from './components/Formularios';
import Navigation from './components/Navigation';
import ForgotPassword from './components/ForgotPassword';
import RecuperarSenha from './components/RecuperarSenha';
import GerenciarUsuarios from './components/GerenciarUsuarios';
import { logout } from './redux/slices/userSlice';

import './App.css';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user, sessionExpiresAt } = useSelector((state) => state.user);
  const [currentPage, setCurrentPage] = useState('formularios');
  const isAdmin = ['admin', 'adm'].includes((user?.nivel_acesso || '').toLowerCase());

  useEffect(() => {
    if (!isAuthenticated || !sessionExpiresAt) {
      return undefined;
    }

    const remainingMs = Number(sessionExpiresAt) - Date.now();
    if (remainingMs <= 0) {
      dispatch(logout());
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      dispatch(logout());
    }, remainingMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [dispatch, isAuthenticated, sessionExpiresAt]);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'formularios':
        return <Formularios />;
      case 'cadastro':
        return isAdmin ? <Cadastro /> : <Formularios />;
      case 'usuarios-sistema':
        return isAdmin ? <GerenciarUsuarios /> : <Formularios />;
      default:
        return <Formularios />;
    }
  };

  return (
    <Router>
      <Routes>
        {/* Login */}
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
        />

        <Route path="/register" element={<Navigate to="/" />} />

        {/* Recuperação de senha */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <div className="app">
                <Navigation
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  userEmail={user ? user.email : ''}
                  isAdmin={isAdmin}
                />
                <main className="main-content">{renderCurrentPage()}</main>
                <footer className="app-footer">
                  <p>
                    &copy; 2025 Sistema de Avaliação - Controle Interno. Desenvolvido para amostragem.
                  </p>
                </footer>
              </div>
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* Redireciona qualquer rota inválida */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
