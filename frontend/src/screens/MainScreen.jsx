import { useEffect, useState } from "react";
import DocumentEditor from "../components/DocumentEditor";
import Drawer from "../components/Drawer";
import Navbar from "../components/Navbar";
import userStore from "../store/userStore";
import { getUserFromToken } from "../api/authService";

const MainScreen = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { user, setUser } = userStore();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token && user == null) {
        try {
          const data = await getUserFromToken();
          setUser({ user_id: data.ID, username: data.userName });
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      }
    };
    fetchUser();
  }, [user]);

  return (
    <div>
      <Navbar toggleDrawer={() => setIsDrawerOpen(!isDrawerOpen)} user={user} />
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        setIsOpen={setIsDrawerOpen}
      />
      <DocumentEditor />
    </div>
  );
};
export default MainScreen;
