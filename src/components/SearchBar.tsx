// src/components/SearchBar.tsx
import React, { useState } from "react";
import { TextField, Button, FormControl, InputLabel, MenuItem, Select, Box } from "@mui/material";

const searchCategories = ["All", "Topic", "Artist", "Keyword"];

type SearchBarProps = {
  onSearch: (category: string, term: string) => void;
};

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [category, setCategory] = useState<string>("All");
  const [term, setTerm] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(category, term); // Pass both category & search term to parent
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      className="flex flex-col items-center md:flex-row md:justify-center md:gap-4 my-4"
    >
      <FormControl className="min-w-[120px] mb-2 md:mb-0">
        <InputLabel id="search-category-label">Category</InputLabel>
        <Select
          labelId="search-category-label"
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {searchCategories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        className="mb-2 md:mb-0 w-full"
        label="Search..."
        variant="outlined"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
      />

      <Button type="submit" variant="contained" className="bg-green-700 hover:bg-green-800">
        Search
      </Button>
    </Box>
  );
};

export default SearchBar;
