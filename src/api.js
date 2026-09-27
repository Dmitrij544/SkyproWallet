const BASE_URL = 'https://wedev-api.sky.pro/api/transactions';

/**
 * @param {Object} params 
 */
export async function fetchTransactions({ sortBy, filterBy } = {}) {
  const urlParams = new URLSearchParams();

  if (sortBy) {
    urlParams.append('sortBy', sortBy);
  }

  if (filterBy && filterBy.length > 0) {
    urlParams.append('filterBy', filterBy.join(','));
  }

  const queryString = urlParams.toString();
  const finalUrl = queryString ? `${BASE_URL}?${queryString}` : BASE_URL;

  const response = await fetch(finalUrl, {
    method: 'GET',
  });

  if (!response.ok) {
    if (response.status === 400) {
      throw new Error('Неверно введены параметры сортировки или фильтрации');
    }
    throw new Error('Произошла ошибка при загрузке данных с сервера');
  }

  const data = await response.json();
  return data.transactions || [];
}

/**
 * @param {Object} expenseData 
 * @returns {Promise<Array>} 
 */
export async function addTransaction(expenseData) {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(expenseData),
  });

  if (!response.ok) {
    throw new Error(`Не удалось сохранить расход: статус ${response.status}`);
  }

  const data = await response.json();
  return data.transactions || [];
}

/**
 * @param {string} id 
 * @returns {Promise<Array>} 
 */
export async function deleteTransaction(id) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    if (response.status === 400) {
      throw new Error('Эта транзакция уже удалена на сервере');
    }
    throw new Error(`Ошибка сервера: статус ${response.status}`);
  }

  const data = await response.json();
  return data.transactions || [];
}

/**
 * @param {string} id 
 * @param {Object} updatedData
 * @returns {Promise<Array>} 
 */
export async function updateTransaction(id, updatedData) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedData),
  });

  if (!response.ok) {
    if (response.status === 400) {
      throw new Error('Транзакция не найдена или данные не прошли валидацию');
    }
    throw new Error('Не удалось обновить транзакцию');
  }

  const data = await response.json();
  return data.transactions || [];
}

/**
 * @param {string} startDate 
 * @param {string} endDate 
 * @returns {Promise<Array>}
 */
export async function fetchTransactionsByPeriod(startDate, endDate) {
  const response = await fetch(`${BASE_URL}/period`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      start: startDate,
      end: endDate,
    }),
  });

  if (!response.ok) {
    throw new Error('Не удалось загрузить транзакции за указанный период');
  }

  const data = await response.json();
  return Array.isArray(data) ? data : data.transactions || [];
}