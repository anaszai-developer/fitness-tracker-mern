import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const API_URL = `${BASE_URL}/api/auth`;

const register = async (userData) => {
  const response = await axios.post(
    `${API_URL}/register`,
    userData
  );

  return response.data;
};

const login = async (userData) => {
  const response = await axios.post(
    `${API_URL}/login`,
    userData
  );

  if (response.data.token) {
    localStorage.setItem("token", response.data.token);

    localStorage.setItem(
      "user",
      JSON.stringify(response.data.user)
    );
  }

  return response.data;
};

const getProfile = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${API_URL}/profile`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

const authService = {
  register,
  login,
  getProfile,
  logout,
};

export default authService;