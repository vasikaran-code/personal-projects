// The signed-in customer's id (read across the app) and the API bearer token.
const ID_KEY = "flameToken";
const AUTH_KEY = "flameAuth";

export const getAuthToken = () => localStorage.getItem(AUTH_KEY);

export const hasSession = () => !!localStorage.getItem(ID_KEY) && !!getAuthToken();

export const saveSession = (customerId: string, token: string) => {
  localStorage.setItem(ID_KEY, customerId);
  localStorage.setItem(AUTH_KEY, token);
};

export const clearSession = () => {
  localStorage.removeItem(ID_KEY);
  localStorage.removeItem(AUTH_KEY);
};
