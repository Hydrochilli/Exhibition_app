// src/api/unifySearch.ts
import { fetchFromMet } from "./metApi";
import { fetchFromCleveland } from "./clevelandApi";

type Artwork = {
  id: string;
  title: string;
  author: string;
  date: string;
  imageUrl: string;
  source: string;
};

function getDateRange(century: string): { begin: number; end: number } | null {
  switch (century) {
    case "16":
      return { begin: 1500, end: 1599 };
    case "17":
      return { begin: 1600, end: 1699 };
    case "18":
      return { begin: 1700, end: 1799 };
    case "19":
      return { begin: 1800, end: 1899 };
    case "20":
      return { begin: 1900, end: 1999 };
    case "21":
      return { begin: 2000, end: 2100 };
    default:
      return null;
  }
}

// Map from user label => MET departmentId => Cleveland dept name
const DEPARTMENT_MAP: Record<string, { metId: number; cmaDept: string }> = {
  "European Painting": {
    metId: 11,
    cmaDept: "European Painting and Sculpture",
  },
  "Greek and Roman Art": {
    metId: 13,
    cmaDept: "Greek and Roman Art",
  },
  "Islamic Art": {
    metId: 14,
    cmaDept: "Islamic Art",
  },
};

export async function fetchUnifiedSearch(
  searchTerm: string,
  century?: string,
  department?: string,
  selectedApi?: string
): Promise<Artwork[]> {
  // Build date range
  const dateRange = getDateRange(century || "");

  // Build MET options
  const metOptions: any = { q: searchTerm };
  if (dateRange) {
    metOptions.dateBegin = dateRange.begin;
    metOptions.dateEnd = dateRange.end;
  }
  if (department) {
    const mapped = DEPARTMENT_MAP[department];
    if (mapped) {
      metOptions.departmentId = mapped.metId;
    }
  }

  // Build Cleveland options
  const clevelandOptions: any = { q: searchTerm };
  if (dateRange) {
    clevelandOptions.minYear = dateRange.begin;
    clevelandOptions.maxYear = dateRange.end;
  }
  if (department) {
    const mapped = DEPARTMENT_MAP[department];
    if (mapped) {
      clevelandOptions.department = mapped.cmaDept;
    }
  }

  // Decide which APIs to call
  let metResults: Artwork[] = [];
  let clevelandResults: Artwork[] = [];

  if (selectedApi === "Met") {
    metResults = await fetchFromMet(metOptions);
  } else if (selectedApi === "Cleveland") {
    clevelandResults = await fetchFromCleveland(clevelandOptions);
  } else {
    // "All"
    [metResults, clevelandResults] = await Promise.all([
      fetchFromMet(metOptions),
      fetchFromCleveland(clevelandOptions),
    ]);
  }

  // Combine
  const combined = [...metResults, ...clevelandResults];
  return combined;
}
