import React from 'react';
import PopNewCard from '../PopNewCard/PopNewCard';

function Main({ expenses, onAddExpense, onDeleteExpense }) {
  
  const formatCardDate = (dateStr) => {
    if (!dateStr) return '';
    
    const cleanDate = dateStr.split('T')[0]; 
    
    const parts = cleanDate.split('-'); 
    
    if (parts.length !== 3) return cleanDate;
    
    const [year, month, day] = parts;
    return `${day}.${month}.${year}`;
  };

  const getCategoryLabel = (cat) => {
    const categories = {
      food: 'Еда',
      transport: 'Транспорт',
      housing: 'Жилье',
      joy: 'Развлечения',
      education: 'Образование',
      others: 'Другое'
    };
    return categories[cat] || cat;
  };

  return (
    <main className="main-container">
      <div className="main-layout">
        
        <div className="board-section">
          <h2 className="page-main-title">Мои расходы</h2>

          <div className="main-content">
            <h3 className="table-title">Таблица расходов</h3>
            
            {expenses.length === 0 ? (
              <p className="empty-text">Список расходов пуст. Добавьте первый расход справа!</p>
            ) : (
              <div className="table-wrapper">
                
                <div className="table-header">
                  <span className="col-desc">Описание</span>
                  <span className="col-cat">Категория</span>
                  <span className="col-date">Дата</span>
                  <span className="col-sum">Сумма</span>
                  <span className="col-action"></span>
                </div>

                <div className="table-line"></div>

                <div className="cards-list">
                  {expenses.map((item) => (
                    <div className="card-row" key={item._id || item.id}>
                      <span className="col-desc cell-text">{item.description}</span>
                      <span className="col-cat cell-text">{getCategoryLabel(item.category)}</span>
                      
                      <span className="col-date cell-text">{formatCardDate(item.date)}</span>
                      
                      <span className="col-sum cell-text">{item.sum} ₽</span>
                      
                      <div className="col-action">
                        <button 
                          onClick={() => onDeleteExpense(item._id || item.id)} 
                          className="delete-icon-btn"
                          title="Удалить расход"
                        >
                          <svg 
                            width="12" 
                            height="12" 
                            viewBox="0 0 12 12" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path 
                              d="M9.62 2.79003H9.42L7.73 1.10003C7.595 0.965029 7.375 0.965029 7.235 1.10003C7.1 1.23503 7.1 1.45503 7.235 1.59503L8.43 2.79003H3.57L4.765 1.59503C4.9 1.46003 4.9 1.24003 4.765 1.10003C4.63 0.965029 4.41 0.965029 4.27 1.10003L2.585 2.79003H2.385C1.935 2.79003 1 2.79003 1 4.07003C1 4.55503 1.1 4.87503 1.31 5.08503C1.43 5.21003 1.575 5.27503 1.73 5.31003C1.875 5.34503 2.03 5.35003 2.18 5.35003H9.82C9.975 5.35003 10.12 5.34003 10.26 5.31003C10.68 5.21003 11 4.91003 11 4.07003C11 2.79003 10.065 2.79003 9.62 2.79003Z" 
                              fill="currentColor" 
                            />
                            <path 
                              d="M9.52502 6H2.43502C2.12502 6 1.89002 6.275 1.94002 6.58L2.36002 9.15C2.50002 10.01 2.87502 11 4.54002 11H7.34502C9.03002 11 9.33002 10.155 9.51002 9.21L10.015 6.595C10.075 6.285 9.84002 6 9.52502 6ZM5.30502 9.225C5.30502 9.42 5.15002 9.575 4.96002 9.575C4.76502 9.575 4.61002 9.42 4.61002 9.225V7.575C4.61002 7.385 4.76502 7.225 4.96002 7.225C5.15002 7.225 5.30502 7.385 5.30502 7.575V9.225ZM7.44502 9.225C7.44502 9.42 7.29002 9.575 7.09502 9.575C6.90502 9.575 6.74502 9.42 6.74502 9.225V7.575C6.74502 7.385 6.90502 7.225 7.09502 7.225C7.29002 7.225 7.44502 7.385 7.44502 7.575V9.225Z" 
                              fill="currentColor" 
                        />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="table-scroll-spacer"></div>
                  
                </div>

              </div>
            )}
          </div>
        </div>

        <div className="form-section">
          <PopNewCard onAddExpense={onAddExpense} />
        </div>

      </div>
    </main>
  );
}

export default Main;