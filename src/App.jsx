import { useState } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './components/Login';
import Register from './components/Register'; // registro simples
import Cadastro from './components/Cadastro'; // cadastro interno com abas
import Formularios from './components/Formularios';
import Navigation from './components/Navigation';
import ForgotPassword from './components/ForgotPassword';

import './App.css';

function App() {
    const { isAuthenticated, user } = useSelector((state) => state.user);
  const [currentPage, setCurrentPage] = useState('formularios');

  // A lógica de login/logout agora é tratada pelo Redux.
  // O componente Navigation precisará ser atualizado para usar a ação de logout do Redux.

  const handleLogout = () => {
    // Ação de logout será implementada no Navigation
    setCurrentPage('formularios');
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'formularios':
        return <Formularios />;
      case 'cadastro':
        return <Cadastro />; // quando clicar dentro do dashboard
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

        {/* Registro rápido */}
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />}
        />

        {/* Recuperação de senha */}
        <Route path="/forgot-password" element={<ForgotPassword />} />

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
