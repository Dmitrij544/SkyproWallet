import React, { useState, useEffect } from 'react'; 
import Header from './components/Header/Header';
import Main from './components/Main/Main';
import Analysis from './components/Analysis/Analysis'; 
import AuthForm from './components/Authform/AuthForm';
import { getTransactions, addTransaction, deleteTransaction } from './api';
import './App.css';

function App() {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('userInfo');
      if (!savedUser || savedUser === 'undefined' || savedUser === 'null') {
        return null;
      }
      const parsedUser = JSON.parse(savedUser);
      return parsedUser && parsedUser.token ? parsedUser : null;
    } catch (e) {
      localStorage.removeItem('userInfo');
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState(() => {
    const savedTab = localStorage.getItem('walletActiveTab');
    return savedTab ? savedTab : 'expenses';
  });

  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    localStorage.setItem('walletActiveTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    if (!user) return;

    getTransactions()
      .then((data) => {
        setExpenses(data);
      })
      .catch((err) => {
        console.error('Ошибка загрузки расходов с сервера:', err);
        if (err.message.includes('401')) {
          handleLogout();
        }
      });
  }, [user]);

  const handleAddExpense = async (newExpense) => {
    try {
      const updatedExpenses = await addTransaction(newExpense);
      setExpenses(updatedExpenses);
    } catch (err) {
      alert(`Не удалось добавить расход: ${err.message}`);
    }
  };

  const handleConfirmDelete = async (id) => {
    const isConfirmed = window.confirm("Вы действительно хотите безвозвратно удалить этот расход?");
    if (!isConfirmed) return;

    try {
      const updatedExpenses = await deleteTransaction(id);
      setExpenses(updatedExpenses);
    } catch (err) {
      alert(`Ошибка при удалении расхода: ${err.message}`);
    }
  };

  const handleLogout = () => {
    const isConfirmed = window.confirm("Вы действительно хотите выйти из аккаунта?");
    if (!isConfirmed) return;

    localStorage.removeItem('userInfo');
    setUser(null);
    setExpenses([]);
    setActiveTab('expenses');
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  if (!user) {
    return <AuthForm onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app-container">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
      
      <div style={{ display: activeTab === 'expenses' ? 'block' : 'none' }}>
        <Main 
          expenses={expenses} 
          onAddExpense={handleAddExpense} 
          onDeleteExpense={handleConfirmDelete} 
        />
      </div>

      <div style={{ display: activeTab === 'analysis' ? 'block' : 'none' }}>
        <Analysis expenses={expenses} />
      </div>
    </div>
  );
}

export default App;