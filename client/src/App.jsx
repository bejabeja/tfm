import React from "react";
import { Link, Route, Routes } from "react-router-dom";
import "./App.css";
import Signup from "./pages/Signup";

const App = () => {
  return (
    <div className="App">
      <nav>
        <Link to="/">Signup</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Signup />} />
      </Routes>
    </div>
  );
};

export default App;
