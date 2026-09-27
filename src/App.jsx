import React, { useState, useEffect } from 'react'; 
import Header from './components/Header/Header';
import Main from './components/Main/Main';
import Analysis from './components/Analysis/Analysis'; 
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState(() => {
    const savedTab = localStorage.getItem('walletActiveTab');
    return savedTab ? savedTab : 'expenses';
  });

  const [expenses, setExpenses] = useState([
    { id: 1, description: 'Покупка продуктов', sum: 2500, category: 'food', date: '2024-07-15' },
    { id: 2, description: 'Проезд на метро', sum: 100, category: 'transport', date: '2024-07-16' },
    { id: 3, description: 'Билеты в кино', sum: 600, category: 'joy', date: '2024-08-02' },
    { id: 4, description: 'Курс по React', sum: 5000, category: 'education', date: '2024-08-10' },
    { id: 5, description: 'Оплата квартиры', sum: 15000, category: 'housing', date: '2024-07-01' },
    { id: 6, description: 'Ужин в ресторане', sum: 3400, category: 'food', date: '2024-07-20' },
    { id: 7, description: 'Заправка авто', sum: 2200, category: 'transport', date: '2024-07-22' },
    { id: 8, description: 'Покупка книги', sum: 450, category: 'education', date: '2024-07-25' },
    { id: 9, description: 'Подписка', sum: 199, category: 'others', date: '2024-08-04' },
    { id: 10, description: 'Коммуналка', sum: 4200, category: 'housing', date: '2024-08-01' },
    { id: 11, description: 'Кофе и круассан', sum: 350, category: 'food', date: '2024-08-04' },
    { id: 12, description: 'Такси до работы', sum: 450, category: 'transport', date: '2024-08-05' },
    { id: 13, description: 'Настольная игра', sum: 1800, category: 'joy', date: '2024-08-06' },
    { id: 14, description: 'Подарок другу', sum: 2000, category: 'others', date: '2024-08-08' },
    { id: 15, description: 'Аренда самоката', sum: 150, category: 'transport', date: '2024-08-10' },
    { id: 16, description: 'Онлайн-интенсив', sum: 3000, category: 'education', date: '2024-08-12' },
    { id: 17, description: 'Онлайн-интенсив', sum: 3000, category: 'education', date: '2024-08-12' },
    { id: 18, description: 'Онлайн-интенсив', sum: 3000, category: 'education', date: '2024-08-12' }
  ]);

  useEffect(() => {
    localStorage.setItem('walletActiveTab', activeTab);
  }, [activeTab]);

  const handleAddExpense = (newExpense) => {
    setExpenses((prev) => [newExpense, ...prev]);
  };

  const handleConfirmDelete = async (id) => {
    const isConfirmed = window.confirm("Вы действительно хотите безвозвратно удалить этот расход?");
    if (!isConfirmed) return;

    try {
      const updatedExpenses = await deleteTransaction(id);
      setExpenses(updatedExpenses);
    } catch (err) {
      console.warn(`Сервер вернул ошибку, удаляем локально: ${err.message}`);
      setExpenses((prev) => prev.filter(item => (item._id || item.id) !== id));
    }
  };

  return (
    <div className="app-container">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === 'expenses' ? (
        <Main 
          expenses={expenses} 
          onAddExpense={handleAddExpense} 
          onDeleteExpense={handleConfirmDelete} 
        />
      ) : (
        <Analysis expenses={expenses} />
      )}
    </div>
  );
}

export default App;