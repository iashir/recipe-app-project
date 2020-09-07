import axios from "axios";
export const register = async (data) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const res = await axios.post("/api/users/register", data, config);
  return res;
};

export const login = async (data) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const res = await axios.post("/api/users/login", data, config);
  return res;
};

export const googleLogin = async (data) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const res = await axios.post("/api/users/google-login", data, config);
  return res;
};
