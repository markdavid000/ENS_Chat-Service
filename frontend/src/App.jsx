import { useState } from "react";
import { configureWeb3Modal } from "./connection";
import "./output.css";
import Header from "./components/Header";
import RegisterENS from "./components/RegisterENS";

configureWeb3Modal();

function App() {
  return (
    <>
      <Header />
      <RegisterENS />
    </>
  );
}

export default App;
