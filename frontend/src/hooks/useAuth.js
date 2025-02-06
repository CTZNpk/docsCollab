import { logIn, signUp } from "../api/authService";
import userStore from "../store/userStore";

const useAuth = () => {
  const { setUser, clearUser } = userStore();
  const handleSignIn = async (formData) => {
    try {
      const data = await logIn(formData);
      localStorage.setItem("token", data.token);
      setUser({ username: data.username });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSignUp = async (formData) => {
    try {
      const data = await signUp(formData);
      console.log(data);
      localStorage.setItem("token", data.token);
      setUser({ username: data.username });
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem("token");
      clearUser();
    } catch (error) { }
  };

  return { handleSignIn, handleSignUp, handleLogout };
};

export default useAuth;
