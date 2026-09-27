import React, { useState } from 'react';

function Analysis({ expenses }) {
  const [selectedDate, setSelectedDate] = useState('2024-07-01');

  const julyDays = Array.from({ length: 31 }, (_, i) => `2024-07-${String(i + 1).padStart(2, '0')}`);
  const augustDays = Array.from({ length: 31 }, (_, i) => `2024-08-${String(i + 1).padStart(2, '0')}`);

  const weekDays = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];
  
  const augustEmptySpaces = Array.from({ length: 3 });

  const categoriesDef = [
    { id: 'food', label: 'Еда' },
    { id: 'transport', label: 'Транспорт' },
    { id: 'housing', label: 'Жилье' },
    { id: 'joy', label: 'Развлечения' },
    { id: 'education', label: 'Образование' },
    { id: 'others', label: 'Другое' }
  ];

  const formatToLocalDate = (dateInput) => {
    if (!dateInput) return '';
    return dateInput.split('T')[0];
  };

  const filteredExpenses = expenses.filter(item => formatToLocalDate(item.date) === selectedDate);
  const totalDaySum = filteredExpenses.reduce((sum, item) => sum + item.sum, 0);

  const formatDateLabel = (dateStr) => {
    const [year, month, day] = dateStr.split('-');
    return `${parseInt(day)} ${month === '07' ? 'Июля' : 'Августа'} ${year}`;
  };

  const chartData = categoriesDef.map(cat => {
    const catSum = filteredExpenses
      .filter(item => item.category === cat.id)
      .reduce((sum, item) => sum + item.sum, 0);
    return {
      ...cat,
      sum: catSum
    };
  });

  const maxCategorySum = Math.max(...chartData.map(c => c.sum), 0);

  return (
    <main className="main-container">
      <div className="analysis-layout">
        
        <div className="calendar-section-wrapper">
          <h2 className="page-main-title">Анализ расходов</h2>
          <div className="calendar-section">
            <h3 className="section-title">Период</h3>
            
            <div className="weekdays-grid">
              {weekDays.map((day, idx) => (
                <div key={idx} className="weekday-label">{day}</div>
              ))}
            </div>

            <div className="scrollable-calendar">
              <div className="month-group">
                <h4>Июль 2024</h4>
                <div className="days-grid">
                  {julyDays.map((date) => {
                    const dayNum = date.split('-')[2];
                    const hasExpenses = expenses.some(e => formatToLocalDate(e.date) === date);
                    return (
                      <button
                        key={date}
                        className={`day-btn ${selectedDate === date ? 'selected' : ''} ${hasExpenses ? 'has-data' : ''}`}
                        onClick={() => setSelectedDate(date)}
                      >
                        {parseInt(dayNum)}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="month-group">
                <h4>Август 2024</h4>
                <div className="days-grid august-grid">
                  
                  {augustEmptySpaces.map((_, idx) => (
                    <div key={`empty-${idx}`} className="day-btn empty-space"></div>
                  ))}

                  {augustDays.map((date) => {
                    const dayNum = date.split('-')[2];
                    const hasExpenses = expenses.some(e => formatToLocalDate(e.date) === date);
                    return (
                      <button
                        key={date}
                        className={`day-btn ${selectedDate === date ? 'selected' : ''} ${hasExpenses ? 'has-data' : ''}`}
                        onClick={() => setSelectedDate(date)}
                      >
                        {parseInt(dayNum)}
                      </button>
                    );
                  })}
                </div>
              </div>
              
              <div className="virtual-scroll-spacer"></div>

            </div>
          </div>
        </div>

        <div className="charts-section">
          <div className="analysis-content">
            <div className="analytics-box">
              
              <div className="total-expenses-amount-top">
                {totalDaySum} ₽
              </div>

              <div className="expenses-date-label-top">
                Расходы за <span className="highlight-date">{formatDateLabel(selectedDate)}</span>
              </div>

              <div className="vertical-chart-container">
                {chartData.map((item) => {
                  const sharePercent = totalDaySum > 0 ? item.sum / totalDaySum : 0;
                  
                  const barHeightPx = 4 + sharePercent * (328 - 4);
                  
                  return (
                    <div className="vertical-bar-column" key={item.id}>
                      <span className="v-bar-price">{item.sum > 0 ? `${item.sum} ₽` : ''}</span>
                      
                      <div 
                        className={`v-bar-standalone ${item.id}`} 
                        style={{ height: `${barHeightPx}px` }} 
                      ></div>
                      
                      <span className="v-bar-label">{item.label}</span>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        </div>

      </div>
    </main>
  );
}

export default Analysis;