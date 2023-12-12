// Declare a new function named search
async function search() {
  // Read the user input from the term field in the form searchForm
  let searchTerm = document.forms.searchForm.term.value;
  // Read the searchType
  let searchType = document.forms.searchForm.searchType.value;
  console.log(searchType);
  // Empty the input field
  document.forms.searchForm.term.value = '';

  try {
    // Read the JSON data using fetch
    let rawData = await fetch(`/api/music/${searchTerm}/${searchType}`);
    if (!rawData.ok) {
      throw new Error('Failed to fetch data');
    }
    // Convert JSON to a JavaScript data structure
    let songs = await rawData.json();
    console.log(songs)
    // Create an empty string to hold HTML content
    let html = `
      <p>You searched for "${searchTerm}"...</p>
      <p>Found ${songs.length} tracks.</p>
    `;

    // Loop through the found songs
    for (let song of songs) {
      let meta = song.metadata;
      if (meta && meta.title && meta.artist && meta.album) {
        let fileName = song.file; // Get the fileName
        // Construct HTML elements for each song
        html += `
          <section>
            <h2>${meta.title}</h2>
            <p><b>Artist:</b> ${meta.artist}</p>
            <p><b>Album:</b> ${meta.album}</p>
            <p>
              <audio controls src="music/${fileName}"></audio>
            </p>
          </section>
        `;
      }
    }

    // Grab the element/tag with the class searchResults
    let searchResultsElement = document.querySelector('.searchResults');
    // Change the content of the searchResults element
    searchResultsElement.innerHTML = html;
  } catch (error) {
    console.error('Error fetching data:', error);
    // Handle the error - display a message to the user or retry the request.
  }
}
