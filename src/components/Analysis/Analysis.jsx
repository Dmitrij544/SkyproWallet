import React, { useState } from 'react';

function Analysis({ expenses }) {
  
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`; 
  });

  const [endDate, setEndDate] = useState(null);

  const julyDays = Array.from({ length: 31 }, (_, i) => `2024-07-${String(i + 1).padStart(2, '0')}`);
  const augustDays = Array.from({ length: 31 }, (_, i) => `2024-08-${String(i + 1).padStart(2, '0')}`);

  const weekDays = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];
  const augustEmptySpaces = Array.from({ length: 3 });

  const categoriesDef = [
    { id: 'food', label: 'Еда' },
    { id: 'transport', label: 'Транспорт' },
    { id: 'housing', label: 'Жильё' },
    { id: 'joy', label: 'Развлечения' },
    { id: 'education', label: 'Образование' },
    { id: 'others', label: 'Другое' }
  ];

  const formatToLocalDate = (dateInput) => {
    if (!dateInput) return '';

    const cleanStr = dateInput.split('T')[0];

    if (cleanStr.includes('.')) {
      const parts = cleanStr.split('.'); 
      if (parts.length === 3) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    }

    if (cleanStr.includes('/')) {
      const parts = cleanStr.split('/');
      if (parts.length === 3) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    }

    return cleanStr;
  };

  const handleDateClick = (clickedDate) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(clickedDate);
      setEndDate(null);
    } else if (startDate && !endDate) {
      if (clickedDate < startDate) {
        setEndDate(startDate);
        setStartDate(clickedDate);
      } else {
        setEndDate(clickedDate);
      }
    }
  };

  const isDateSelected = (date) => {
    if (!startDate) return false;
    if (!endDate) return date === startDate;
    return date >= startDate && date <= endDate;
  };

  const getSelectedDatesArray = () => {
    if (!startDate) return [];
    if (!endDate) return [startDate];
    
    const allDays = [...julyDays, ...augustDays];
    return allDays.filter(date => date >= startDate && date <= endDate);
  };

  const activeDatesList = getSelectedDatesArray();

  const filteredExpenses = expenses.filter((item) => {
    const itemDate = formatToLocalDate(item.date);
    return activeDatesList.includes(itemDate);
  });

  const totalDaySum = filteredExpenses.reduce((sum, item) => sum + Number(item.sum), 0);

  const parseDateObj = (dateStr) => {
    const [, month, day] = dateStr.split('-');
    return { day: parseInt(day), monthText: month === '07' ? 'июля' : 'августа' };
  };

  const formatRangeLabel = () => {
    if (!startDate) return 'выберите период';
    
    const start = parseDateObj(startDate);
    if (!endDate || startDate === endDate) {
      return `${start.day} ${start.monthText} 2024`;
    }

    const end = parseDateObj(endDate);
    if (start.monthText === end.monthText) {
      return `${start.day} – ${end.day} ${start.monthText} 2024`;
    }
    return `${start.day} ${start.monthText} – ${end.day} ${end.monthText} 2024`;
  };

  const chartData = categoriesDef.map((cat) => {
    const catSum = filteredExpenses
      .filter((item) => item.category === cat.id)
      .reduce((sum, item) => sum + Number(item.sum), 0); 
    return { ...cat, sum: catSum };
  });


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
                    const hasExpenses = expenses.some((e) => formatToLocalDate(e.date) === date);
                    const isSelected = isDateSelected(date);
                    
                    return (
                      <button
                        key={date}
                        className={`day-btn ${isSelected ? 'selected' : ''} ${hasExpenses ? 'has-data' : ''}`}
                        onClick={() => handleDateClick(date)}
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
                    const hasExpenses = expenses.some((e) => formatToLocalDate(e.date) === date);
                    const isSelected = isDateSelected(date);
                    
                    return (
                      <button
                        key={date}
                        className={`day-btn ${isSelected ? 'selected' : ''} ${hasExpenses ? 'has-data' : ''}`}
                        onClick={() => handleDateClick(date)}
                      >
                        {parseInt(dayNum)}
                      </button>
                    );
                  })}
                </div>
              </div>

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
                Расходы за <span className="highlight-date">{formatRangeLabel()}</span>
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