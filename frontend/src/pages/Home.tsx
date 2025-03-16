import React, { useState } from "react";
import SearchBar from "../components/SearchBar";
import CuratedCategories from "../components/CuratedCategories";
import GalleriesSection from "../components/GalleriesSection";
import SearchResults from "../components/SearchResults";


const FiltersSection: React.FC<{
  century: string;
  onCenturyChange: (val: string) => void;

  department: string;
  onDepartmentChange: (val: string) => void;

  selectedApi: string; 
  onApiChange: (val: string) => void;

  onApply: () => void;
}> = ({
  century,
  onCenturyChange,
  department,
  onDepartmentChange,
  selectedApi,
  onApiChange,
  onApply,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 justify-center my-4">
     
      <div>
        <label className="block mb-1 font-semibold">Century</label>
        <select
          value={century}
          onChange={(e) => onCenturyChange(e.target.value)}
          className="border rounded p-1"
        >
          <option value="">All</option>
          <option value="16">16th Century (1500–1599)</option>
          <option value="17">17th Century (1600–1699)</option>
          <option value="18">18th Century (1700–1799)</option>
          <option value="19">19th Century (1800–1899)</option>
          <option value="20">20th Century (1900–1999)</option>
          <option value="21">21st Century (2000–2100)</option>
        </select>
      </div>

      
      <div>
        <label className="block mb-1 font-semibold">Department</label>
        <select
          value={department}
          onChange={(e) => onDepartmentChange(e.target.value)}
          className="border rounded p-1"
        >
          <option value="">All</option>
          <option value="European Painting">European Painting</option>
          <option value="Greek and Roman Art">Greek and Roman Art</option>
          <option value="Islamic Art">Islamic Art</option>
        
        </select>
      </div>

     
      <div>
        <label className="block mb-1 font-semibold">Source</label>
        <select
          value={selectedApi}
          onChange={(e) => onApiChange(e.target.value)}
          className="border rounded p-1"
        >
          <option value="All">All APIs</option>
          <option value="Met">The Met</option>
          <option value="Cleveland">Cleveland</option>
        </select>
      </div>

     
      <div className="flex items-end">
        <button
          onClick={onApply}
          className="px-4 py-2 bg-green-700 text-white rounded"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

const Home: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [century, setCentury] = useState("");
  const [department, setDepartment] = useState("");
  const [selectedApi, setSelectedApi] = useState("All");

  
  const [query, setQuery] = useState("");

  
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  
  const applyFilters = () => {
    
    setQuery(searchTerm.trim());
  };

  return (
    <div className="container mx-auto p-4">
      <SearchBar onSearch={handleSearch} />

      <FiltersSection
        century={century}
        onCenturyChange={setCentury}
        department={department}
        onDepartmentChange={setDepartment}
        selectedApi={selectedApi}
        onApiChange={setSelectedApi}
        onApply={applyFilters}
      />

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
        
        <>
          <CuratedCategories />
          <GalleriesSection />
        </>
      )}
    </div>
  );
};

export default Home;




