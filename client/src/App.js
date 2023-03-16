import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.scss";
import Home from "./components/Home/Home";
import MainCallScreen from "./components/VideoCall/MainCallScreen/MainCallScreen";
import NoMatchURL from "./components/NoMatchURL/NoMatchURL";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/invalidurl" element={<NoMatchURL />} />
        <Route exact path="/:roomID" element={<MainCallScreen />} />
      </Routes>
    </Router>
  );
}

export default App;

