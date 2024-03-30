import React from "react";
import { configureWeb3Modal } from "./connection";
import { ToastContainer } from "react-toastify";
import "./output.css";
import Header from "./components/Header";
import RegisterENS from "./components/RegisterENS";
import Chat from "./components/Chat";
import { Routes, Route } from "react-router-dom";

configureWeb3Modal();

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<RegisterENS />}></Route>
        <Route path="/chat" element={<Chat />}></Route>
      </Routes>
      <ToastContainer theme="light" hideProgressBar={true} />
    </>
  );
}

export default App;
