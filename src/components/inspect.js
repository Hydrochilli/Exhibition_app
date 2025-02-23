// inspect.js
// If you're on Node 18+ you can remove the import line, since fetch is global.
// For earlier versions or if you want to use node-fetch, install it with: npm install node-fetch
import fetch from 'node-fetch';
//https://api.europeana.eu/record/v2/search.json?wskey=arceashelind&query=van+gogh+AND+TYPE:%22PLACE%22&rows=1&facet=TYPE,AGENT
const apiKey = 'ggosewbi'; // Replace with your actual API key
const query = 'van gogh'; // Change the query as needed

// Build the URL with the required parameters
const apiUrl = 'https://api.europeana.eu/record/v2/search.json?wskey=arceashelind&query=van+gogh+AND+TYPE:"AGENT"&rows=1&facet=TYPE,PLACE';

fetch(apiUrl)
  .then(response => {
    if (!response.ok) {
      return response.text().then(text => {
        throw new Error(`HTTP error! status: ${response.status} - ${text}`);
      });
    }
    return response.json();
  })
  .then(data => {
    console.log("Fetched Data:");
    console.log(JSON.stringify(data, null, 2));
  })
  .catch(error => {
    console.error("Error fetching data:", error);
  });
