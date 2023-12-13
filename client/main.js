function checkboxChange(cb) {
  //Get the value of the checkbox selected
  let cbValue = cb.value;

  //Get all checkboxe elements
  var allCheckboxes = document.querySelectorAll('input[name=checkboxfilter]');
  // Loop the checkboxes
  for (let box of allCheckboxes) {
    //Get the filter element based on the checkbox value 
    let filterElement = document.getElementById(box.value + "Filter");

    //Check if the checkbox in the loop is the same as the checkbox selected and is checked
    if (box.value === cbValue && box.checked) {
      // Show element 
      if (filterElement.style.display === "none") {
        filterElement.style.display = "block";
      } else {
        //Hide element
        filterElement.style.display = "none";
      }
    } else {
      // Uncheck checkbox if not the selected one
      box.checked = false;
      //Hide filter element that not belong to the selected checkbox
      if (filterElement.style.display === "block") {
        filterElement.style.display = "none";
      }
    }
  }
}

// Declare a new function named search
async function search() {
  // Read the user input from the term field in the form searchForm
  let searchTerm = document.forms.searchForm.term.value;
  //Get checkboxfilter and select searchtype from that
  var checkboxFilter = document.querySelector('input[name=checkboxfilter]:checked');

  let cbValue = checkboxFilter.value
  let searchType;
  let path;

  // Read the searchType depending on the checkbox value
  if (cbValue === "music") {
    searchType = document.forms.searchForm.searchTypemusic.value;
    path = "music";
  } else if (cbValue === "all") {
    searchType = document.forms.searchForm.searchTypeall.value;
    path = "all";
  } else if (cbValue === "pdf") {
    searchType = document.forms.searchForm.searchTypePdf.value;
    path = "pdf";
  } else {
    searchType = document.forms.searchForm.searchTypeppt.value;
    path = "powerpoint";
  }

  // Empty the input field
  document.forms.searchForm.term.value = '';
  try {

    let result;
    let rawdata;
    if (cbValue === "all") {
      //TODO: Make the search for all work..
      result = `
      <p>You searched for "${searchTerm}"... but the search functionality is not implemented yet</p>
      `;
      //result = await fetchAll(path, searchTerm);
    } else {
      // Read the JSON data using fetch
      let rawData = await fetch(`/api/${path}/${searchTerm}/${searchType}`);
      if (!rawData.ok) {
        throw new Error('Failed to fetch data');
      }
      // Convert JSON to a JavaScript data structure
      rawdata = await rawData.json();
      if (cbValue === "music") {
        result = outputMusicResult(rawdata, searchTerm);
      }
      else {
        result = outputPowerpointResult(rawdata, searchTerm);
      }
    }

    // Grab the element/tag with the class searchResults
    let searchResultsElement = document.querySelector('.searchResults');
    // Change the content of the searchResults element
    searchResultsElement.innerHTML = result;

  } catch (error) {
    console.error('Error fetching data:', error);
    // Handle the error - display a message to the user or retry the request.
  }
}

async function fetchAll(path, searchTerm) {
  try {
    let rawData = await fetch(`/api/${path}`);
    if (!rawData.ok) {
      throw new Error('Failed to fetch data');
    }
    let rawdata = await rawData.json();
    return outputAllResult(rawdata, searchTerm);
  } catch (error) {
    console.error('Error fetching data:', error);
    // Handle the error - display a message to the user or retry the request.
  }
}

function outputMusicResult(songs, searchTerm) {
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
  return html;
}

function outputPowerpointResult(powerpoints, searchTerm) {
  // Create an empty string to hold HTML content
  let html = `
  <p>You searched for "${searchTerm}"...</p>
  <p>Found ${powerpoints.length} powerpoints.</p>
  `;

  // Loop through the found songs
  for (let ppt of powerpoints) {
    let meta = ppt.powerpointMetadata;
    if (meta && meta.title && meta.company) {
      // let fileName = ppt.file; // Get the fileName
      // Construct HTML elements for each ppt
      html += `
      <section>
        <h2>${meta.title}</h2>
        <p><b>Title:</b> ${meta.title}</p>
        <p><b>Company:</b> ${meta.company}</p>
      </section>
      `;
    }
  }
  return html;
}

function outputAllResult(allresults, searchTerm) {
  // Create an empty string to hold HTML content
  let html = `
  <p>You searched for "${searchTerm}"...</p>
  <p>Found ${allresults.length} results.</p>
  `;

  // Loop through the found songs
  for (let res of allresults) {
    let meta = res.powerpointMetadata;
    let metaSong = res.metadata;
    if (meta && meta.title && meta.company) {
      // Construct HTML elements for each result
      html += `
      <section>
        <h2>${meta.title}</h2>
        <p><b>Title:</b> ${meta.title}</p>
        <p><b>Company:</b> ${meta.company}</p>
      </section>
      `;
    }
    if (metaSong && metaSong.title && metaSong.artist && metaSong.album) {
      let fileName = res.file; // Get the fileName
      // Construct HTML elements for each song
      html += `
      <section>
        <h2>${metaSong.title}</h2>
        <p><b>Artist:</b> ${metaSong.artist}</p>
        <p><b>Album:</b> ${metaSong.album}</p>
        <p>
          <audio controls src="music/${fileName}"></audio>
        </p>
      </section>
      `;
    }
  }
  return html;
}
