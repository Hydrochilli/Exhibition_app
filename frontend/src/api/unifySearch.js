import { searchMet } from "../api/metApi";
import { fetchFromCleveland } from "../api/clevelandApi";
/**

 * @param searchTerm
 * @param century
 * @param department
 * @param selectedApi
 */
export async function fetchUnifiedSearch(searchTerm, century, department, selectedApi) {
    let metResults = [];
    let clevelandResults = [];
    if (!selectedApi || selectedApi === "All" || selectedApi === "Met") {
        const options = {
            q: searchTerm,
        };
        metResults = await searchMet(options);
        metResults = metResults.map(art => ({ ...art, source: "Met" }));
    }
    if (!selectedApi || selectedApi === "All" || selectedApi === "Cleveland") {
        const clevelandRaw = await fetchFromCleveland({ q: searchTerm });
        clevelandResults = clevelandRaw.map(item => ({
            id: item.id,
            title: item.title || "Untitled",
            author: item.author || "Unknown",
            date: item.date || "",
            imageUrl: item.imageUrl || "",
            source: "Cleveland",
        }));
    }
    const merged = [...metResults, ...clevelandResults];
    return merged;
}
