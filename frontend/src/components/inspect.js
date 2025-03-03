
import fetch from 'node-fetch';

const apiKey = 'ggosewbi'; 
const query = 'van gogh'; 

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
