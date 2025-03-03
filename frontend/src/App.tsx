// src/App.tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MyGalleriesPage from "./pages/MyGalleriesPage";
import Header from "./components/Header";
import "./index.css"; 
import Profile from "./pages/Profile";

import { useAuth } from "./contexts/AuthContext";

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="font-sans min-h-screen">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/my-galleries"
          element={
            isAuthenticated ? <MyGalleriesPage /> : <Navigate to="/login" />
          }
        />
      </Routes>
    </div>
  );
};

export default App;



// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Home from "./pages/Home";
// import CollectionPage from "./components/CollectionPage";
// import Header from "./components/Header"
// const App: React.FC = () => {
//   return (
//     <>
//       <Header />
     
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/collection/:collectionId" element={<CollectionPage />} />
//       </Routes>
//    </>
//   );
// };

// export default App;

// // src/App.tsx
// import React from "react";
// import Header from "./components/Header";
// import Home from "./pages/Home";

// const App: React.FC = () => {
//   return (
//     <div className="font-sans min-h-screen">
//       <Header />
//       <Home />
//     </div>
//   );
// };

// export default App;
