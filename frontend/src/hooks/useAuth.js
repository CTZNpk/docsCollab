import { logIn, signUp } from "../api/authService";
import userStore from "../store/userStore";

const useAuth = () => {
  const { setUser, clearUser } = userStore();
  const handleSignIn = async (formData) => {
    try {
      const data = await logIn(formData);

      localStorage.setItem("token", data.token);
      setUser({ username: data.user.username, user_id: data.user.id });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSignUp = async (formData) => {
    try {
      const data = await signUp(formData);
      localStorage.setItem("token", data.token);
      setUser({ username: data.user.username, user_id: data.user.id });
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem("token");
      clearUser();
    } catch (error) {}
  };

  return { handleSignIn, handleSignUp, handleLogout };
};

export default useAuth;
