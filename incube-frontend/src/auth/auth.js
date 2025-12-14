export const saveAuth = (token, role) => {
  localStorage.setItem("token", token);
  localStorage.setItem("role", role);
};

export const logout = () => {
  localStorage.clear();
};

export const isAdmin = () => {
  return localStorage.getItem("role") === "ADMIN";
};
