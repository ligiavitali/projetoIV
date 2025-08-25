import { useState } from 'react';
import Login from './components/Login';
import Navigation from './components/Navigation';
import Cadastro from './components/Cadastro';
import Formularios from './components/Formularios';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [currentPage, setCurrentPage] = useState('cadastro');

  const handleLogin = (email) => {
    setUserEmail(email);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserEmail('');
    setCurrentPage('cadastro');
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'cadastro':
        return <Cadastro />;
      case 'formularios':
        return <Formularios />;
      default:
        return <Cadastro />;
    }
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <Navigation 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        userEmail={userEmail}
        onLogout={handleLogout}
      />
      <main className="main-content">
        {renderCurrentPage()}
      </main>
      <footer className="app-footer">
        <p>&copy; 2025 Sistema de Avaliação - Controle Interno. Desenvolvido para amostragem.</p>
      </footer>
    </div>
  );
}

export default App;

