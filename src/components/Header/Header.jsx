import React from 'react';

function Header({ activeTab, setActiveTab }) {
  const handleLogout = () => {
    alert('Вы вышли из системы');
  };

  return (
    <header className="header">
      <div className="logo">
        <img src="images/Vector.png" alt="Skypro.Wallet"></img>
      </div>

      <nav className="breadcrumbs">
        <button 
          onClick={() => setActiveTab('expenses')} 
          className={`nav-btn ${activeTab === 'expenses' ? 'active' : ''}`}
        >
          Мои расходы
        </button>
        <button 
          onClick={() => setActiveTab('analysis')} 
          className={`nav-btn-1 ${activeTab === 'analysis' ? 'active' : ''}`}
        >
          Анализ расходов
        </button>
      </nav>

      <button onClick={handleLogout} className="logout-btn">
        Выйти
      </button>
    </header>
  );
}

export default Header;