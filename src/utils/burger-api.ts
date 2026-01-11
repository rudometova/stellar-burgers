import { setCookie, getCookie } from './cookie';
import { TIngredient, TOrder, TUser } from './types';

const URL = process.env.BURGER_API_URL;

const checkResponse = <T>(res: Response): Promise<T> =>
  res.ok ? res.json() : res.json().then((err) => Promise.reject(err));

type TServerResponse<T> = {
  success: boolean;
} & T;

type TRefreshResponse = TServerResponse<{
  refreshToken: string;
  accessToken: string;
}>;

export const refreshToken = async (): Promise<TRefreshResponse> => {
  const response = await fetch(`${URL}/auth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      token: localStorage.getItem('refreshToken')
    })
  });

  const refreshData = await checkResponse<TRefreshResponse>(response);

  if (!refreshData.success) {
    return Promise.reject(refreshData);
  }

  localStorage.setItem('refreshToken', refreshData.refreshToken);
  const accessToken = refreshData.accessToken.startsWith('Bearer ')
    ? refreshData.accessToken.split('Bearer ')[1]
    : refreshData.accessToken;
  setCookie('accessToken', accessToken);

  return refreshData;
};

export const fetchWithRefresh = async <T>(
  url: RequestInfo,
  options: RequestInit
): Promise<T> => {
  try {
    const res = await fetch(url, options);
    return await checkResponse<T>(res);
  } catch (err) {
    if ((err as { message: string }).message === 'jwt expired') {
      const refreshData = await refreshToken();
      if (options.headers) {
        (options.headers as { [key: string]: string }).authorization =
          `Bearer ${refreshData.accessToken.split('Bearer ')[1] || refreshData.accessToken}`;
      }
      const res = await fetch(url, options);
      return await checkResponse<T>(res);
    } else {
      return Promise.reject(err);
    }
  }
};

type TIngredientsResponse = TServerResponse<{
  data: TIngredient[];
}>;

type TFeedsResponse = TServerResponse<{
  orders: TOrder[];
  total: number;
  totalToday: number;
}>;

export const getIngredientsApi = async (): Promise<TIngredient[]> => {
  const response = await fetch(`${URL}/ingredients`);
  const data = await checkResponse<TIngredientsResponse>(response);

  if (data?.success) return data.data;
  return Promise.reject(data);
};

export const getFeedsApi = async (): Promise<TFeedsResponse> => {
  const response = await fetch(`${URL}/orders/all`);
  const data = await checkResponse<TFeedsResponse>(response);

  if (data?.success) return data;
  return Promise.reject(data);
};

export const getOrdersApi = async (): Promise<TOrder[]> => {
  const token = getCookie('accessToken');
  const data = await fetchWithRefresh<TFeedsResponse>(`${URL}/orders`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: token ? `Bearer ${token}` : ''
    } as HeadersInit
  });

  if (data?.success) return data.orders;
  return Promise.reject(data);
};

type TNewOrderResponse = TServerResponse<{
  order: TOrder;
  name: string;
}>;

export const orderBurgerApi = async (
  ingredients: string[]
): Promise<TNewOrderResponse> => {
  const token = getCookie('accessToken');
  const data = await fetchWithRefresh<TNewOrderResponse>(`${URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: token ? `Bearer ${token}` : ''
    } as HeadersInit,
    body: JSON.stringify({ ingredients })
  });

  if (data?.success) return data;
  return Promise.reject(data);
};

type TOrderResponse = TServerResponse<{
  orders: TOrder[];
}>;

export const getOrderByNumberApi = async (
  number: number
): Promise<TOrderResponse> => {
  const response = await fetch(`${URL}/orders/${number}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return await checkResponse<TOrderResponse>(response);
};

export type TRegisterData = {
  email: string;
  name: string;
  password: string;
};

type TAuthResponse = TServerResponse<{
  refreshToken: string;
  accessToken: string;
  user: TUser;
}>;

export const registerUserApi = async (
  data: TRegisterData
): Promise<TAuthResponse> => {
  const response = await fetch(`${URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  });

  const result = await checkResponse<TAuthResponse>(response);

  if (result?.success) return result;
  return Promise.reject(result);
};

export type TLoginData = {
  email: string;
  password: string;
};

export const loginUserApi = async (
  data: TLoginData
): Promise<TAuthResponse> => {
  const response = await fetch(`${URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  });

  const result = await checkResponse<TAuthResponse>(response);

  if (result?.success) return result;
  return Promise.reject(result);
};

export const forgotPasswordApi = async (data: {
  email: string;
}): Promise<TServerResponse<{}>> => {
  const response = await fetch(`${URL}/password-reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  });

  const result = await checkResponse<TServerResponse<{}>>(response);

  if (result?.success) return result;
  return Promise.reject(result);
};

export const resetPasswordApi = async (data: {
  password: string;
  token: string;
}): Promise<TServerResponse<{}>> => {
  const response = await fetch(`${URL}/password-reset/reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  });

  const result = await checkResponse<TServerResponse<{}>>(response);

  if (result?.success) return result;
  return Promise.reject(result);
};

type TUserResponse = TServerResponse<{ user: TUser }>;

export const getUserApi = async (): Promise<TUserResponse> => {
  const token = getCookie('accessToken');
  return await fetchWithRefresh<TUserResponse>(`${URL}/auth/user`, {
    headers: {
      authorization: token ? `Bearer ${token}` : ''
    } as HeadersInit
  });
};

export const updateUserApi = async (
  user: Partial<TRegisterData>
): Promise<TUserResponse> => {
  const token = getCookie('accessToken');
  return await fetchWithRefresh<TUserResponse>(`${URL}/auth/user`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: token ? `Bearer ${token}` : ''
    } as HeadersInit,
    body: JSON.stringify(user)
  });
};

export const logoutApi = async (): Promise<TServerResponse<{}>> => {
  const response = await fetch(`${URL}/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      token: localStorage.getItem('refreshToken')
    })
  });

  return await checkResponse<TServerResponse<{}>>(response);
};
