import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CollectionPage from "./components/CollectionPage";
import Header from "./components/Header"
import GalleriesPage from "./pages/GalleriesPage"
import GalleryDetailPage from "./pages/GalleryDetailPage";

const App: React.FC = () => {
  return (
    <>
     <Header/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/galleries" element={<GalleriesPage />} />
        <Route path="/set/:id" element={<GalleryDetailPage />} />
        <Route path="/collection/:collectionId" element={<CollectionPage />} /> {/* ✅ Fix Route */}
      </Routes>
    </>
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
