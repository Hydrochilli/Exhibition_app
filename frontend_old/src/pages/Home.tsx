// src/pages/Home.tsx
import React, { useState } from "react";
import SearchBar from "../components/SearchBar";
import SearchResults from "../components/SearchResults";
import CuratedCategories from "../components/CuratedCategories";
import GalleriesSection from "../components/GalleriesSection";

const Home: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [century, setCentury] = useState("");
  const [department, setDepartment] = useState("");
  const [selectedApi, setSelectedApi] = useState("All");

  const [query, setQuery] = useState("");

  function applyFilters() {
    // When user clicks "Apply," we set query to trigger <SearchResults> with filters
    setQuery(searchTerm.trim());
  }

  const FiltersSection = () => (
    <div className="flex flex-col md:flex-row gap-4 justify-center my-4">
      {/* Century */}
      <div>
        <label className="block mb-1 font-semibold">Century</label>
        <select
          value={century}
          onChange={(e) => setCentury(e.target.value)}
          className="border rounded p-1"
        >
          <option value="">All</option>
          <option value="16">16th Century</option>
          <option value="17">17th Century</option>
          <option value="18">18th Century</option>
          <option value="19">19th Century</option>
          <option value="20">20th Century</option>
          <option value="21">21st Century</option>
        </select>
      </div>

      {/* Department */}
      <div>
        <label className="block mb-1 font-semibold">Department</label>
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="border rounded p-1"
        >
          <option value="">All</option>
          <option value="European Painting">European Painting</option>
          <option value="Greek and Roman Art">Greek and Roman Art</option>
          <option value="Islamic Art">Islamic Art</option>
        </select>
      </div>

      {/* API Source */}
      <div>
        <label className="block mb-1 font-semibold">Source</label>
        <select
          value={selectedApi}
          onChange={(e) => setSelectedApi(e.target.value)}
          className="border rounded p-1"
        >
          <option value="All">All APIs</option>
          <option value="Met">The Met</option>
          <option value="Cleveland">Cleveland</option>
        </select>
      </div>

      {/* Apply button */}
      <div className="flex items-end">
        <button
          onClick={applyFilters}
          className="px-4 py-2 bg-green-700 text-white rounded"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );

  function handleSearch(term: string) {
    setSearchTerm(term);
  }

  return (
    <div className="container mx-auto p-4">
      <SearchBar onSearch={handleSearch} />
      <FiltersSection />

      {query ? (
        <SearchResults
          searchTerm={query}
          century={century}
          department={department}
          selectedApi={selectedApi}
        />
      ) : searchTerm ? (
        <SearchResults searchTerm={searchTerm} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <CuratedCategories />
          <GalleriesSection />
        </div>
      )}
    </div>
  );
};

export default Home;







// // src/pages/Home.tsx
// import React, { useState } from "react";
// import SearchBar from "../components/SearchBar";
// import SearchResults from "../components/SearchResults";
// import CuratedCategories from "../components/CuratedCategories";
// import GalleriesSection from "../components/GalleriesSection";

// const Home: React.FC = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [century, setCentury] = useState("");
//   const [department, setDepartment] = useState("");
//   const [selectedApi, setSelectedApi] = useState("All");

//   const [query, setQuery] = useState("");

//   // Called by <SearchBar>
//   const handleSearch = (term: string) => {
//     setSearchTerm(term);
//   };

//   // Filters section
//   function FiltersSection() {
//     // "Apply Filters" sets 'query' so that <SearchResults> is shown with filters
//     const applyFilters = () => {
//       setQuery(searchTerm.trim());
//     };

//     return (
//       <div className="flex flex-col md:flex-row gap-4 justify-center my-4">
//         {/* Century */}
//         <div>
//           <label className="block mb-1 font-semibold">Century</label>
//           <select
//             value={century}
//             onChange={(e) => setCentury(e.target.value)}
//             className="border rounded p-1"
//           >
//             <option value="">All</option>
//             <option value="16">16th Century</option>
//             <option value="17">17th Century</option>
//             <option value="18">18th Century</option>
//             <option value="19">19th Century</option>
//             <option value="20">20th Century</option>
//             <option value="21">21st Century</option>
//           </select>
//         </div>

//         {/* Department */}
//         <div>
//           <label className="block mb-1 font-semibold">Department</label>
//           <select
//             value={department}
//             onChange={(e) => setDepartment(e.target.value)}
//             className="border rounded p-1"
//           >
//             <option value="">All</option>
//             <option value="European Painting">European Painting</option>
//             <option value="Greek and Roman Art">Greek and Roman Art</option>
//             <option value="Islamic Art">Islamic Art</option>
//           </select>
//         </div>

//         {/* API Source */}
//         <div>
//           <label className="block mb-1 font-semibold">Source</label>
//           <select
//             value={selectedApi}
//             onChange={(e) => setSelectedApi(e.target.value)}
//             className="border rounded p-1"
//           >
//             <option value="All">All APIs</option>
//             <option value="Met">The Met</option>
//             <option value="Cleveland">Cleveland</option>
//           </select>
//         </div>

//         {/* Apply button */}
//         <div className="flex items-end">
//           <button
//             onClick={applyFilters}
//             className="px-4 py-2 bg-green-700 text-white rounded"
//           >
//             Apply Filters
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <SearchBar onSearch={handleSearch} />
//       <FiltersSection />

//       {query ? (
//         // If user pressed "Apply Filters"
//         <SearchResults
//           searchTerm={query}
//           century={century}
//           department={department}
//           selectedApi={selectedApi}
//         />
//       ) : searchTerm ? (
//         // If user typed a term but hasn't clicked "Apply"
//         <SearchResults searchTerm={searchTerm} />
//       ) : (
//         // No search => curated home content
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
//           <CuratedCategories />
//           <GalleriesSection />
//         </div>
//       )}
//     </div>
//   );
// };

// export default Home;











// import React, { useState } from "react";
// import SearchBar from "../components/SearchBar";
// import ArtworkList from "../components/ArtworkList";
// import CuratedCategories from "../components/CuratedCategories";
// import GalleriesSection from "../components/GalleriesSection";

// const Home: React.FC = () => {
//   const [searchTerm, setSearchTerm] = useState("");

//   const handleSearch = (category: string, term: string) => {
//     setSearchTerm(term);
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <SearchBar onSearch={handleSearch} />
//       {searchTerm ? (
//         <>
//           <h2 className="text-xl font-semibold mt-6">
//             Search Results for "{searchTerm}"
//           </h2>
//           <ArtworkList /* pass props for search results here */ />
//         </>
//       ) : (
//         <>
//           <CuratedCategories />
//           <GalleriesSection />
//         </>
//       )}
//     </div>
//   );
// };

// export default Home;


// // src/pages/Home.tsx
// import React, { useState } from 'react';
// import SearchBar from '../components/SearchBar';
// import ArtworkList from '../components/ArtworkList';
// import CuratedCategories from '../components/CuratedCategories';

// const Home: React.FC = () => {
//   const [searchTerm, setSearchTerm] = useState('');

//   const handleSearch = (category: string, term: string) => {
//     setSearchTerm(term);
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <SearchBar onSearch={handleSearch} />
//       {searchTerm ? (
//         <>
//           <h2 className="text-xl font-semibold mt-6">Search Results for "{searchTerm}"</h2>
//           <ArtworkList /* pass your search results props here */ />
//         </>
//       ) : (
//         <CuratedCategories />
//       )}
//     </div>
//   );
// };

// export default Home;



// // src/pages/Home.tsx
// import React, { useState } from "react";
// import SearchBar from "../components/SearchBar";
// import ArtworkList from "../components/ArtworkList";
// import CollectionGroup from "../components/CollectionGroup";

// const PAGE_SIZE = 10;

// const Home: React.FC = () => {
//   const [searchTerm, setSearchTerm] = useState("");

//   const handleSearch = (category: string, term: string) => {
//     setSearchTerm(term);
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <SearchBar onSearch={handleSearch} />

//       {searchTerm ? (
//         <>
//           <h2 className="text-xl font-semibold mt-6">Search Results for "{searchTerm}"</h2>
//           <ArtworkList /* your existing props for artwork search results */ />
//         </>
//       ) : (
//         <>
//           <h2 className="text-xl font-semibold mt-6">Collections</h2>
//           <CollectionGroup title="Themes" query="themes" />
//           <CollectionGroup title="Topics" query="topics" />
//           <CollectionGroup title="Current Exhibitions" query="exhibitions" />
//         </>
//       )}
//     </div>
//   );
// };

// export default Home;




// // src/pages/Home.tsx
// import React, { useState, useEffect } from "react";
// import SearchBar from "../components/SearchBar";
// import ArtworkList from "../components/ArtworkList";
// import CollectionCards from "../components/CollectionCards";

// import { fetchMetArtworksPage } from "../api/metApi";
// import { fetchEuropeanaArtworks } from "../api/europeanaApi"; // if you need Europeana

// const PAGE_SIZE = 48;

// const Home: React.FC = () => {
//   const [artworks, setArtworks] = useState<any[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [searchCategory, setSearchCategory] = useState("All"); 
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalResults, setTotalResults] = useState(0);
//   const [selectedApi, setSelectedApi] = useState<"europeana" | "met">("europeana");

//   // Debug log whenever these change
//   useEffect(() => {
//     console.log(
//       `Current API = ${selectedApi}; searchTerm="${searchTerm}"; category="${searchCategory}"; page=${currentPage}`
//     );
//   }, [searchTerm, currentPage, selectedApi, searchCategory]);

//   // 1. Trigger data fetch on changes
//   useEffect(() => {
//     // If there's no search term, reset
//     if (!searchTerm) {
//       setArtworks([]);
//       setTotalResults(0);
//       return;
//     }

//     const fetchData = async () => {
//       try {
//         if (selectedApi === "europeana") {
//           // If your Europeana API helper can handle category, pass it in:
//           const { artworks: europeanaArt, totalResults } = await fetchEuropeanaArtworks(
//             searchCategory, // or incorporate it into the query inside the helper
//             searchTerm,
//             currentPage,
//             PAGE_SIZE
//           );
//           setArtworks(europeanaArt);
//           setTotalResults(totalResults);
//         } else {
//           // The Met
//           const { artworks: metArt, totalResults } = await fetchMetArtworksPage(
//             searchTerm,
//             currentPage,
//             PAGE_SIZE
//           );
//           setArtworks(metArt);
//           setTotalResults(totalResults);
//         }
//       } catch (err) {
//         console.error("Error fetching data:", err);
//       }
//     };

//     fetchData();
//   }, [searchTerm, searchCategory, currentPage, selectedApi]);

//   // 2. Handle new searches from the SearchBar
//   const handleSearch = (category: string, term: string) => {
//     setSearchCategory(category);
//     setSearchTerm(term);
//     setCurrentPage(1); // reset to first page
//   };

//   // 3. Pagination
//   const totalPages = Math.ceil(totalResults / PAGE_SIZE);

//   const handlePrevPage = () => {
//     setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
//   };

//   const handleNextPage = () => {
//     setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
//   };

//   // 4. Toggle API
//   return (
//     <div className="container mx-auto p-4">
//       <div className="mb-4 flex gap-4">
//         <button
//           onClick={() => {
//             setSelectedApi("europeana");
//             setCurrentPage(1);
//           }}
//           className={`px-4 py-2 border ${selectedApi === "europeana" ? "bg-green-200" : ""}`}
//         >
//           Europeana
//         </button>
//         <button
//           onClick={() => {
//             setSelectedApi("met");
//             setCurrentPage(1);
//           }}
//           className={`px-4 py-2 border ${selectedApi === "met" ? "bg-green-200" : ""}`}
//         >
//           The Met
//         </button>
//       </div>

//       <SearchBar onSearch={handleSearch} />
//       <h2 className="text-xl font-semibold mt-6">Explore Curated Collections</h2>
//       <CollectionCards />

//       {/* Artwork list with pagination */}
//       <ArtworkList
//         artworks={artworks}
//         currentPage={currentPage}
//         totalPages={totalPages}
//         onPrev={handlePrevPage}
//         onNext={handleNextPage}
//       />
//     </div>
//   );
// };

// export default Home;


// // src/pages/Home.tsx
// import React, { useState, useEffect } from "react";
// import SearchBar from "../components/SearchBar";
// import ArtworkList from "../components/ArtworkList";

// import { fetchEuropeanaArtworks } from "../api/europeanaApi.ts";
// import { fetchMetArtworksPage } from "../api/metApi.ts";

// const PAGE_SIZE = 10;

// const Home: React.FC = () => {
//   const [artworks, setArtworks] = useState<any[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalResults, setTotalResults] = useState(0);

//   // Decide which API to call or combine them
//   // For simplicity, let's just call Europeana or Met (we'll pick one by a toggle)
//   const [selectedApi, setSelectedApi] = useState<"europeana" | "met">("europeana");

//   // When searchTerm or currentPage changes, fetch new data
//   useEffect(() => {
//     if (!searchTerm) return; // skip if empty

//     const fetchData = async () => {
//       try {
//         if (selectedApi === "europeana") {
//           const { artworks, totalResults } = await fetchEuropeanaArtworks(searchTerm, currentPage, PAGE_SIZE);
//           setArtworks(artworks);
//           setTotalResults(totalResults);
//         } else {
//           const { artworks, totalResults } = await fetchMetArtworksPage(searchTerm, currentPage, PAGE_SIZE);
//           setArtworks(artworks);
//           setTotalResults(totalResults);
//         }
//       } catch (err) {
//         console.error("Error fetching data:", err);
//       }
//     };

//     fetchData();
//   }, [searchTerm, currentPage, selectedApi]);

//   const handleSearch = (category: string, term: string) => {
//     // For now, ignore category, just set the searchTerm
//     // (Later you can refine the query logic based on the selected category)
//     setSearchTerm(term);
//     setCurrentPage(1); // reset to first page
//   };

//   // Pagination
//   const totalPages = Math.ceil(totalResults / PAGE_SIZE);

//   const handlePrevPage = () => {
//     setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
//   };
//   const handleNextPage = () => {
//     setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
//   };

//   return (
//     <div className="container mx-auto p-4">
//       {/* Switch which API we use */}
//       <div className="mb-4 flex gap-4">
//         <button
//           onClick={() => setSelectedApi("europeana")}
//           className={`px-4 py-2 border ${selectedApi === "europeana" ? "bg-green-200" : ""}`}
//         >
//           Europeana
//         </button>
//         <button
//           onClick={() => setSelectedApi("met")}
//           className={`px-4 py-2 border ${selectedApi === "met" ? "bg-green-200" : ""}`}
//         >
//           The Met
//         </button>
//       </div>

//       <SearchBar onSearch={handleSearch} />

//       {/* Filter and Sort placeholders here if you like */}
//       {/* ... */}

//       <ArtworkList
//         artworks={artworks}
//         currentPage={currentPage}
//         totalPages={totalPages}
//         onPrev={handlePrevPage}
//         onNext={handleNextPage}
//       />
//     </div>
//   );
// };

// export default Home;



// /*
// import React, { useState } from "react";
// import SearchBar from "../components/SearchBar.tsx";
// import ArtworkList from "../components/ArtworkList.tsx";

// const Home: React.FC = () => {
//   // For demonstration, we'll mock some artworks
//   const mockArtworks = [
//     {
//       id: "1",
//       title: "Starry Night",
//       imageUrl: "https://via.placeholder.com/200",
//       author: "Vincent van Gogh",
//       date: "1889"
//     },
//     {
//       id: "2",
//       title: "Mona Lisa",
//       imageUrl: "https://via.placeholder.com/200",
//       author: "Leonardo da Vinci",
//       date: "1503"
//     },
//     // ... more items
//   ];

//   // Pagination states
//   const [currentPage, setCurrentPage] = useState(1);
//   const totalPages = 5; // Replace with real data once you fetch from an API

//   // Search callback (from SearchBar)
//   const handleSearch = (category: string, term: string) => {
//     // TODO: integrate your real data fetching here
//     // e.g., call a function to fetch data from Europeana / The Met
//     console.log("Search triggered =>", { category, term });
//   };

//   // Filter and Sort (placeholder)
//   // You could add multi-select filters, date range pickers, etc.
//   const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     // e.g., filter by medium, date, etc.PaginationControls.tsx
//     console.log("Filter changed =>", e.target.value);
//   };

//   const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     // e.g., sort by newest, oldest, alphabetical
//     console.log("Sort changed =>", e.target.value);
//   };

//   // Pagination handlers
//   const handlePrevPage = () => {
//     setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
//   };
//   const handleNextPage = () => {
//     setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
//   };

//   return (
//     <div className="container mx-auto p-4">
//       {/* Central SearchBar */}
//       //<SearchBar onSearch={handleSearch} />

//       {/* Simple Filter and Sort UI */}
//       <div className="flex gap-4 justify-center my-4">
//         <select onChange={handleFilterChange} className="border rounded p-1">
//           <option value="">Filter by...</option>
//           <option value="paintings">Paintings</option>
//           <option value="sculptures">Sculptures</option>
//           <option value="photographs">Photographs</option>
//         </select>

//         <select onChange={handleSortChange} className="border rounded p-1">
//           <option value="">Sort by...</option>
//           <option value="newest">Newest</option>
//           <option value="oldest">Oldest</option>
//           <option value="alphabetical">Alphabetical</option>
//         </select>
//       </div>

//       {/* Artwork List with Pagination */}
//       <ArtworkList
//         artworks={mockArtworks}
//         currentPage={currentPage}
//         totalPages={totalPages}
//         onPrev={handlePrevPage}
//         onNext={handleNextPage}
//       />
//     </div>
//   );
// };

// export default Home;
// <div className="flex gap-4 justify-center my-4">
// <select onChange={handleFilterChange} className="border rounded p-1">
//   <option value="">Filter by...</option>
//   <option value="paintings">Paintings</option>
//   <option value="sculptures">Sculptures</option>
//   <option value="photographs">Photographs</option>
// </select>

// <select onChange={handleSortChange} className="border rounded p-1">
//   <option value="">Sort by...</option>
//   <option value="newest">Newest</option>
//   <option value="oldest">Oldest</option>
//   <option value="alphabetical">Alphabetical</option>
// </select>
// </div>

// {/* Artwork List with Pagination */}
// <ArtworkList
// artworks={mockArtworks}
// currentPage={currentPage}
// totalPages={totalPages}
// onPrev={handlePrevPage}
// onNext={handleNextPage}
// />
// </div>
// );
// };

// export default Home;
