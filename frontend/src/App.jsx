import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainScreen from "./screens/MainScreen";
import AuthScreen from "./screens/AuthScreen";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainScreen />} />
        <Route path="/auth" element={<AuthScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
