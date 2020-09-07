import {
  getLocalStorage,
  setLocalStorage,
  deleteLocalStorage,
} from "./localStorage";
import { getCookie, setCookie, deleteCookie } from "./cookies";
export const isAuthenticated = () => {
  if (getLocalStorage("user") && getCookie("token")) {
    return getLocalStorage("user");
  } else {
    return false;
  }
};

export const setAuthentication = (token, user) => {
  setCookie("token", token);
  setLocalStorage("user", user);
};

export const logout = (next) => {
  deleteLocalStorage("user");
  deleteCookie("token");
  next();
};
