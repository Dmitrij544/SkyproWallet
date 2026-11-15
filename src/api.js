const BASE_URL = 'https://wedev-api.sky.pro/api';

const getToken = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');
  return userInfo?.token || '';
};

export async function signIn({ login, password }) {
  const data = await request(`${BASE_URL}/user/login`, {
    method: 'POST',
    body: JSON.stringify({ login, password }),
  });
  return data.user || data;
}

export async function signUp({ name, login, password }) {
  const data = await request(`${BASE_URL}/user`, {
    method: 'POST',
    body: JSON.stringify({ name, login, password }),
  });
  return data.user || data;
}

export async function getTransactions() {
  const data = await request(`${BASE_URL}/transactions`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return Array.isArray(data) ? data : (data.transactions || []);
}

export async function addTransaction({ description, sum, category, date }) {
  let apiDate = date;
  if (date.includes('.')) {
    const [day, month, year] = date.split('.');
    apiDate = `${month}-${day}-${year}`;
  }

  const data = await request(`${BASE_URL}/transactions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify({
      description,
      sum: Number(sum),
      category,
      date: apiDate,
    }),
  });
  return Array.isArray(data) ? data : (data.transactions || []);
}

export async function deleteTransaction(id) {
  const data = await request(`${BASE_URL}/transactions/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return Array.isArray(data) ? data : (data.transactions || []);
}

async function request(url, options = {}) {
  let response;

  try {
    response = await fetch(url, options);
  } catch (err) {
    throw new Error('Ошибка связи: проверьте подключение к интернету');
  }

  if (response.status >= 500) {
    throw new Error('Ошибка сервера: попробуйте повторить попытку позже');
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || 'Некорректные данные');
  }

  return data;
}

