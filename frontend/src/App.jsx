import React from "react";
import { configureWeb3Modal } from "./connection";
import { ToastContainer } from "react-toastify";
import "./output.css";
import Header from "./components/Header";
import RegisterENS from "./components/RegisterENS";

configureWeb3Modal();

function App() {
  return (
    <>
      <Header />
      <RegisterENS />
      <ToastContainer theme="light" hideProgressBar={true} />
    </>
  );
}

export default App;
