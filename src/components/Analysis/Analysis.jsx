import React, { useState } from 'react';

function Analysis({ expenses }) {
  // 🌟 FIXED: Track range boundary states instead of an independent array
  const [startDate, setStartDate] = useState('2024-07-19');
  const [endDate, setEndDate] = useState('2024-07-20');

  // Generate all calendar day strings
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
    return dateInput.split('T')[0]; // Safeguard string parsing splitting
  };

  // 🌟 FIXED: Smart Range Selection Toggle Handler
  const handleDateClick = (clickedDate) => {
    if (!startDate || (startDate && endDate)) {
      // Reset range: Make this click the new start date
      setStartDate(clickedDate);
      setEndDate(null);
    } else if (startDate && !endDate) {
      // If the clicked date is chronologically before the start date, swap them
      if (clickedDate < startDate) {
        setEndDate(startDate);
        setStartDate(clickedDate);
      } else {
        setEndDate(clickedDate);
      }
    }
  };

  // 🌟 FIXED: Helper function to determine if a calendar date falls within the selected range
  const isDateSelected = (date) => {
    if (!startDate) return false;
    if (!endDate) return date === startDate;
    return date >= startDate && date <= endDate;
  };

  // 🌟 FIXED: Accumulate all valid calendar strings within active boundaries
  const getSelectedDatesArray = () => {
    if (!startDate) return [];
    if (!endDate) return [startDate];
    
    const allDays = [...julyDays, ...augustDays];
    return allDays.filter(date => date >= startDate && date <= endDate);
  };

  const activeDatesList = getSelectedDatesArray();

  // Filter financial data across the whole covered range span
  const filteredExpenses = expenses.filter((item) => 
    activeDatesList.includes(formatToLocalDate(item.date))
  );
  
  const totalDaySum = filteredExpenses.reduce((sum, item) => sum + item.sum, 0);

  // Parse strings into readable text tokens
  const parseDateObj = (dateStr) => {
    const [, month, day] = dateStr.split('-');
    return { day: parseInt(day), monthText: month === '07' ? 'июля' : 'августа' };
  };

  // 🌟 FIXED: Smooth structural subtitle generator for custom range spreads
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

  // Group financial summaries across active date slices
  const chartData = categoriesDef.map((cat) => {
    const catSum = filteredExpenses
      .filter((item) => item.category === cat.id)
      .reduce((sum, item) => sum + item.sum, 0);
    return { ...cat, sum: catSum };
  });

  return (
    <main className="main-container">
      <div className="analysis-layout">
        
        {/* Left Side: Calendar Board Grid */}
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
              {/* JULY 2024 */}
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

              {/* AUGUST 2024 */}
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

        {/* Right Side: Consolidated Range Dash Card */}
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