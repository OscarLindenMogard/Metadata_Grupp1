// Declare a new function named search
async function search() {
  // read the user input from the term field in the form searchForm
  let searchTerm = document.forms.searchForm.term.value;
  // read the searchType
  let searchType = document.forms.searchForm.searchType.value;
  console.log(searchType);
  // empty the input field
  document.forms.searchForm.term.value = '';
  // read the json
  let rawData = await fetch('/api/music/' + searchTerm + '/' + searchType);
  // convert json to a javascript data structure
  let songs = await rawData.json();
  // create an variable name that initially is an empty string
  let html = `
    <p>Du sökte efter "${searchTerm}"...</p>
    <p>Hittade ${songs.length} låtar.</p>
  `;
  // loop through the found songs
  for (let song of songs) {
    let meta = song.metadata;
    html += `
      <section>
        <h2>${meta.title}</h2>
        <p><b>Artist:</b> ${meta.artist}</p>
        <p><b>Album:</b> ${meta.album}</p>  
        <p>
          <audio controls src="music/${song.fileName}">
        </p>
      </section>
    `;
  }
  // Grab the element/tag with the class searchResults
  let searchResultsElement = document.querySelector('.searchResults');
  // Change the content of the searchResults element
  searchResultsElement.innerHTML = html;
}