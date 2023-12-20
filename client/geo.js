
function initMap() {
    console.log('initMap');
    // Position on map
    let myPosition = {
      lat: 59.324,
      lng: 18.070
    };
    console.log('myPosition', myPosition);
    // Create a new google map
    const map = new google.maps.Map(
      document.querySelector('#map'), {
      center: myPosition,
      zoom: 2
    });
    console.log('map', map);
    // Create the initial InfoWindow
    let infoWindow = new google.maps.InfoWindow({
      content: "Click the map to get Latitude/Longitude!",
      position: myPosition
    });
    console.log('infoWindow', infoWindow);
    // Open infoWindow
    infoWindow.open(map);
    
    // Make something happen when you click
    map.addListener("click", (mapsMouseEvent) => {
      // Close the current InfoWindow
      infoWindow.close();
      console.log('addListener');
      // create a new InfoWindow
      infoWindow = new google.maps.InfoWindow({
        position: mapsMouseEvent.latLng,
      });
      // Update myPos (my position)
      myPos = mapsMouseEvent.latLng.toJSON();
      // Show the clicked longitude and latitude
      infoWindow.setContent(
        JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
      );
      infoWindow.open(map);
    });
  }
  
  // Needed to start displaying the map
  window.initMap = initMap;
  
  // Search function
  async function searchGeo() {
    let radius = document.forms.mapForm.radius.value;
    let latitude = myPos.lat;
    let longitude = myPos.lng;
    console.log('radius', radius);
    console.log('latitude', latitude);
    console.log('longitude', longitude);
    let data = await fetch('/api/map-image-search/' + latitude + '/' + longitude + '/' + radius);
    let images = await data.json();
    // now loop the result and create html
    let html = '';
    for (let image of images) {
      let filename = image.imageFile;
      let meta = image.imageMetadata;
      
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
    document.querySelector('.searchResult').innerHTML = html;
  }