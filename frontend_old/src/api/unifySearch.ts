// src/api/unifySearch.ts
export async function fetchUnifiedSearch(
  searchTerm: string,
  century?: string,
  department?: string,
  selectedApi?: string
) {
  const params = new URLSearchParams();
  params.set("q", searchTerm);
  if (century) params.set("century", century);
  if (department) params.set("department", department);
  if (selectedApi) params.set("apiSource", selectedApi);

  const response = await fetch(`http://localhost:3001/api/search?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch search results");
  }
  const data = await response.json();
  // data.results is presumably { results: Artwork[] } from your backend
  return data.results || [];
}
