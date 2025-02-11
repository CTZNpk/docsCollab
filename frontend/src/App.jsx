import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainScreen from "./screens/MainScreen";
import AuthScreen from "./screens/AuthScreen";
import SearchResults from "./screens/SearchScreen";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainScreen />} />
        <Route path="/auth" element={<AuthScreen />} />
        <Route path="/search" element={<SearchResults />} />
      </Routes>
    </Router>
  );
}

export default App;
