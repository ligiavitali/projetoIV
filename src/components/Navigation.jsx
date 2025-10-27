import Logo from '../assets/img/Logo.jpeg';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/slices/userSlice';

const Navigation = ({ currentPage, setCurrentPage, userEmail }) => {
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
  };
  const menuItems = [
    { id: 'cadastro', label: 'Cadastros'},
    { id: 'formularios', label: 'Formulários'}
  ];

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <img className="img-logo" src={Logo} alt="Logo" />
          <h2 className='brand-text'>Diomício Freitas</h2>
        </div>
        
        <div className="nav-menu">
          {menuItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => setCurrentPage(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </div>
        
        <div className="nav-user">
          <div className="user-info">
            <span className="user-email">{userEmail}</span>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            Sair
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

