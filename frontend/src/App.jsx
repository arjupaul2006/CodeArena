import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Problems from "./pages/Problems";
import Dashboard from "./pages/Dashboard";
import Submissions from "./pages/Submissions";
import WriteCode from "./pages/WriteCode";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/problems" element={<Problems />} />
            <Route path="/submissions" element={<Submissions />} />
            <Route path="/write-code" element={<WriteCode />} />
          </Routes>
      </div>
    </>
  );
}

export default App;
