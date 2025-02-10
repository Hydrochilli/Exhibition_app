// src/App.tsx
import React from "react";
import Header from "./components/Header";
import Home from "./pages/Home";

const App: React.FC = () => {
  return (
    <div className="font-sans min-h-screen">
      <Header />
      <Home />
    </div>
  );
};

export default App;
