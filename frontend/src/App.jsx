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
import Contest from "./pages/Contest";
import ContestProblems from "./pages/ContestProblemsLists";
import Signin from "./authentication/Signin";
import Login from "./authentication/Login";
import UserProtect from "./authentication/UserProtect";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <Routes>
          <Route path="/signin" element={<Signin />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route
            path="/dashboard"
            element={
              <UserProtect>
                <Dashboard />
              </UserProtect>
            }
          />
          <Route
            path="/problems"
            element={
              <UserProtect>
                <Problems />
              </UserProtect>
            }
          />
          <Route
            path="/submissions"
            element={
              <UserProtect>
                <Submissions />
              </UserProtect>
            }
          />
          <Route
            path="/contests"
            element={
              <UserProtect>
                <Contest />
              </UserProtect>
            }
          />
          <Route
            path="/contests/:contestId"
            element={
              <UserProtect>
                <ContestProblems />
              </UserProtect>
            }
          />
          <Route path="/write-code" element={<WriteCode />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
