const TOKEN_KEY = "userToken";

export const setUserToken = (token: string) =>
  localStorage.setItem(TOKEN_KEY, btoa(token));

export const getUserToken = () => {
  if (localStorage.getItem(TOKEN_KEY))
    return atob(localStorage.getItem(TOKEN_KEY) as string);
  else return null;
};

export const deleteUserToken = () => localStorage.removeItem(TOKEN_KEY);
