import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import DataVaultApp from "./DataVaultApp";
import Login from "./Login";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element=<Login /> />
        <Route path="/dashboard" element=<DataVaultApp /> />
      </Routes>
      {/* <DataVaultApp /> */}
      {/* // <Login /> */}
    </>
  );
}

export default App;
