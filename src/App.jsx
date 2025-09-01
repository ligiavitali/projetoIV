import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './components/Login';
import Register from './components/Register';  // Ajustei aqui para importar Register
import Formularios from './components/Formularios';
import Navigation from './components/Navigation';
import ForgotPassword from './components/ForgotPassword';

import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [currentPage, setCurrentPage] = useState('formularios');

  const handleLogin = (email) => {
    setUserEmail(email);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserEmail('');
    setCurrentPage('formularios');
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'formularios':
        return <Formularios />;
      default:
        return <Formularios />;
    }
  };

  return (
    <Router>
      <Routes>
        {/* Tela de Login */}
        <Route
          path="/"
          element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />}
        />

        {/* Tela de Cadastro */}
        <Route
          path="/register"
          element={isLoggedIn ? <Navigate to="/dashboard" /> : <Register />}
        />

        {/* Tela de Recuperação de senha */}
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Dashboard só para usuário logado */}
        <Route
          path="/dashboard"
          element={
            isLoggedIn ? (
              <div className="app">
                <Navigation
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  userEmail={userEmail}
                  onLogout={handleLogout}
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
      </Routes>
    </Router>
  );
}

export default App;
