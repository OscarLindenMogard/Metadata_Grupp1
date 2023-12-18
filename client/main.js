function checkboxChange(cb) {
  //Get the value of the checkbox selected
  let cbValue = cb.value;

  setMapVisible(false);

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

  if (cbValue === "image") {
    checkForMap();
  }
}

function setMapVisible(isVisible) {
  let googlemap = document.getElementById("mapFrame");
  
  if (isVisible) {
    googlemap.style.display = "block";
  } else {
    googlemap.style.display = "none";
  }
}

// Check on change if map is selected and show the iframe with the google map
function checkForMap(){
  let opt = document.querySelector("select[name=searchTypeimage]");

  console.log("checkForMap", opt.value);
  let val = opt.value;

  setMapVisible(val === "map");
}

// Declare a new function named search
async function search() {
  // Read the user input from the term field in the form searchForm
  let searchTerm = document.forms.searchForm.term.value;
  //Get checkboxfilter and select searchtype from that
  var checkboxFilter = document.querySelector('input[name=checkboxfilter]:checked');

  let cbValue;
  let searchType;
  let path;

  if (checkboxFilter) {
    console.log("checkbox filter")
    cbValue = checkboxFilter.value; 
    console.log(cbValue);
  } else {
    console.log("cbvalue=all")
    cbValue = "all"; 
  }

  // Read the searchType depending on the checkbox value
  if (cbValue === "music") {
    searchType = document.forms.searchForm.searchTypemusic.value;
    path = "music";
  }  else if (cbValue === "image") {
    searchType = document.forms.searchForm.searchTypeimage.value;
    path = "image";
  } else if (cbValue === "pdf") {
    searchType = document.forms.searchForm.searchTypePdf.value;
    path = "pdf";
  } else if (cbValue === "ppt") {
    searchType = document.forms.searchForm.searchTypeppt.value;
    path = "powerpoint";
  } else {
    searchType = document.forms.searchForm.searchTypeall.value;
    path = "all";
  }
  console.log(path)
  // Empty the input field
  document.forms.searchForm.term.value = '';
  try {
    let result;
    let rawdata;
    if (path == "all"){
      console.log("all")
      let rawData = await fetch(`/api/all/${searchTerm}`);
      if (!rawData.ok) {
        throw new Error('Failed to fetch data');
      }
      let rawdata = await rawData.json();
      result = outputAllResult(rawdata, searchTerm);
    } 
    else {
      console.log("hehe")
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
      else if (cbValue === "ppt") {
        result = outputPowerpointResult(rawdata, searchTerm);
      }
      else if (cbValue === "pdf") {
        result = outputPdfResult(rawdata, searchTerm);
      }
      // this is for image
      else {
        result = outputImageResult(rawdata, searchTerm);
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

// async function fetchAll(path, searchTerm) {
//   try {
//     let rawData = await fetch(`/api/${path}`);
//     if (!rawData.ok) {
//       throw new Error('Failed to fetch data');
//     }
//     let rawdata = await rawData.json();
//     return outputAllResult(rawdata, searchTerm);
//   } catch (error) {
//     console.error('Error fetching data:', error);
//     // Handle the error - display a message to the user or retry the request.
//   }
// }

function outputAllResult(alldata, searchTerm) {
  // Create an empty string to hold HTML content
  let html = `
  <p>You searched for "${searchTerm}"...</p>
  <p>Found ${alldata.length} results.</p>
  `;

  // Loop through the found songs
  for (let data of alldata) {
    let meta = data.Metadata;
    let filename = data.File

    if (filename.slice(-4) == '.mp3') {
      html += `
      <section>
        <h2>${meta.title}</h2>
        <p><b>Artist:</b> ${meta.artist}</p>
        <p><b>Album:</b> ${meta.album}</p>
        <p>
          <audio controls src="music/${filename}"></audio>
        </p>
      </section>
      `;
    } 
    else if (filename.slice(-4) == '.ppt') {
      html += `
      <section>
        <h2>${meta.title}</h2>
        <p><b>Title:</b> ${meta.title}</p>
        <p><b>Company:</b> ${meta.company}</p>
        <p><b>slides:</b> ${meta.slide_count}</p>
        <a href="./powerpoints/${filename}" download="${filename}">
        <button class="button-download" type="button">Download file</button>
        </a>
      </section>
      `;
    } 
    else if (filename.slice(-4) == '.pdf') {
      html += `
      <section>
        <p><b>Title:</b> ${(meta.title || "<b>unknown</b>")}</p>
        <p><b>Author:</b> ${(meta.author || "<b>unknown</b>")}</p>
        <p><b>Creator:</b> ${(meta.creator || "<b>unknown</b>")}</p>
        <p><b>PDF Format Version:</b> ${meta.pdfformatversion}</p>
        <p><b>Number of pages:</b> ${meta.numpages}</p>
        <p>Open PDF file in new tab:<a href="/pdfs/${filename}" target="_blank"> ${filename}</a>.</p>
      </section>
      `;
    } 
    else {
      html += `
      <section>
        <p><b> Image name:</b>"${filename}"</p>
        <img class="image-result" src="/Image/${filename}">
        <p><b>Phone maker:</b> ${meta.Make}</p>
        <p><b>Latitude:</b> ${meta.latitude}</p>
        <p><b>Phone model:</b> ${meta.Model}</p>
        <a href="./Image/${filename}" download="${filename}">
          <button class="button-download" type="button">Download file</button>
        </a>
      </section>
      `;
    }
    
    
    
  }
  return html;
}

function outputMusicResult(songs, searchTerm) {
  // Create an empty string to hold HTML content
  let html = `
  <p>You searched for "${searchTerm}"...</p>
  <p>Found ${songs.length} tracks.</p>
  `;

  // Loop through the found songs
  for (let song of songs) {
    let meta = song.musicmetadata;
    if (meta && meta.title && meta.artist && meta.album) {
      // Construct HTML elements for each song
      html += `
      <section>
        <h2>${meta.title}</h2>
        <p><b>Artist:</b> ${meta.artist}</p>
        <p><b>Album:</b> ${meta.album}</p>
        <p>
          <audio controls src="music/${song.musicFile}"></audio>
        </p>
      </section>
      `;
    }
  }
  return html;
}

function outputPowerpointResult(powerpoints, searchTerm) {
  // Create an empty string to hold HTML content
  let html = `<p>You searched for "${searchTerm}"...</p>`;
  if (powerpoints.length < 1) {
    html += `<p>No results found.</p>`;
  }
  else {
    let pptText = powerpoints.length === 1 ? 'powerpoint' : 'powerpoints';
    html += `<p>Found ${powerpoints.length} ${pptText}.</p>`;
  }

  // Loop through the found songs
  for (let ppt of powerpoints) {
    let meta = ppt.powerpointMetadata;
    let fileName = ppt.powerpointFile

    if (meta && meta.title && meta.company) {
      // Construct HTML elements for each ppt
      html += `
      <section>
        <h2>${meta.title}</h2>
        <p><b>Title:</b> ${meta.title}</p>
        <p><b>Company:</b> ${meta.company}</p>
        <p><b>slides:</b> ${meta.slide_count}</p>
        <a href="./powerpoints/${fileName}" download="${fileName}">
        <button class="button-download" type="button">Download file</button>
        </a>
      </section>
      `;
    }
  }
  return html;
}



//this is output if you search for images
function outputImageResult(images, searchTerm) {
  // Create an empty string to hold HTML content
  let html = `
  <p>You searched for "${searchTerm}"...</p>
  <p>Found ${images.length} Images.</p>
  `;

  // Loop through the found images
  for (let image of images) {

    //Make database colum too meta
    let meta = image.imageMetadata;

    // Get imageName form database to imageName
    let imageName = image.imageFile;
    // Construct HTML elements for each image
    html += `
    <section>
      <p><b> Image name:</b>"${imageName}"</p>
      <img class="image-result" src="/Image/${imageName}">
      <p><b>Phone maker:</b> ${meta.Make}</p>
      <p><b>Latitude:</b> ${meta.latitude}</p>
      <p><b>Phone model:</b> ${meta.Model}</p>
      <a href="./Image/${imageName}" download="${imageName}">
        <button class="button-download" type="button">Download file</button>
      </a>
    </section>
    `;

  }
  //send to the website 
  return html;
}

function outputPdfResult(pdfs, searchTerm) {
  // Create an empty string to hold HTML content
  let html = `
  <p>You searched for "${searchTerm}"...</p>
  <p>Found ${pdfs.length} PDFs.</p>
  `;

  // Loop through the found images
  for (let pdf of pdfs) {

    //Make database colum too meta
    let meta = pdf.pdfMetadata;

    // Get imageName form database to imageName
    let pdfName = pdf.pdfFile;

    // Construct HTML elements for each image
    html += `
    <section>
      <p><b>Title:</b> ${(meta.title || "<b>unknown</b>")}</p>
      <p><b>Author:</b> ${(meta.author || "<b>unknown</b>")}</p>
      <p><b>Creator:</b> ${(meta.creator || "<b>unknown</b>")}</p>
      <p><b>PDF Format Version:</b> ${meta.pdfformatversion}</p>
      <p><b>Number of pages:</b> ${meta.numpages}</p>
      <p>Open PDF file in new tab:<a href="/pdfs/${pdfName}" target="_blank"> ${pdfName}</a>.</p>
    </section>
    `;

  }
  //send to the website 
  return html;
}
