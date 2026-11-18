import React from 'react';

function Header({ activeTab, setActiveTab, onLogout }) {
  return (
    <header className="header">
      <div className="logo">
        <img src="images/Vector.png" alt="Skypro.Wallet" />
      </div>

      {onLogout && (
        <>
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

          <button 
            type="button" 
            className="logout-btn" 
            onClick={onLogout}
          >
            Выйти
          </button>
        </>
      )}
    </header>
  );
}

export default Header;