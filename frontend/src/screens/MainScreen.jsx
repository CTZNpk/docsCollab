import { useState } from "react";
import DocumentEditor from "../components/DocumentEditor";
import Drawer from "../components/Drawer";
import Navbar from "../components/Navbar";

const MainScreen = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div>
      <Navbar toggleDrawer={() => setIsDrawerOpen(!isDrawerOpen)} />
      <div className="relative">
        <Drawer isOpen={isDrawerOpen} setIsOpen={setIsDrawerOpen} />
        <DocumentEditor />
      </div>
    </div>
  );
};

export default MainScreen;
