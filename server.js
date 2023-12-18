// Import the express package/module
// that let us start up a web server
import express from 'express';

// Import the database driver
import mysql from 'mysql2/promise';

// Import the file system module (fs)
import fs from 'fs';

// Create a web server named app
const app = express();

// Serve all files in the folder client
app.use(express.static('client'));

// Start the server on a certain port
// and write to the terminal which port...
app.listen(5173, () =>
  console.log('Listening on http://localhost:5173'));



// Create a connection 'db' to the database
const db = await mysql.createConnection({
  host: '161.97.144.27',
  port: 8091,
  user: 'root',
  password: 'guessagain91',
  database: 'Gruppuppgift'
});

// const server = express();

// server.use(express.static('client'));

// server.listen(5173, () => console.log('Listening on http://localhost:5173'));


// A small function for a database query
async function query(sql, listOfValues) {
  let result = await db.execute(sql, listOfValues);
  return result[0];
}

function ImportPowerointToMySql() {
  // Read the json string from file
  let json = fs.readFileSync('./csvjson.json', 'utf-8');

  // Convert from a string to a real data structure
  let data = JSON.parse(json);


  for (let powerpointMetadata of data) {
    // extract the file name (the property digest + '.ppt)
    let fileName = powerpointMetadata.digest + '.ppt';

    // remove the file name
    delete powerpointMetadata.digest;

    // remove sha hashes as well (only needed for file authenticy checks)
    delete powerpointMetadata.sha256;
    delete powerpointMetadata.sha512;

    // console.log things to see that we have correct 
    // filname and metadata
    // console.log('');
    // console.log(fileName);
    // console.log(powerpointMetadata);

    // Insert JSON into DB (powerpoint). uncomment this if you want to insert into DB
    // let result = await query(`
    //   INSERT INTO powerpoint (filename, powerpointMetadata)
    //   VALUES(?, ?)
    // `, [fileName, powerpointMetadata]);
    // console.log(result);

  }
}

// A search route to find music
app.get('/api/music/:searchTerm/:searchType', async (request, response) => {
  // Get the search term from as a parameter from the route/url
  let searchTerm = request.params.searchTerm;
  // Get teh search type a sa parameter from the route/url
  let searchType = request.params.searchType;
  // Make a database query and remember the result
  // using the search term

  let sql = `
   SELECT * 
   FROM music
   WHERE LOWER(musicmetadata ->> '$.${searchType}') LIKE LOWER(?)
   LIMIT 10
  `;

  // since the sql gets a bit different if you want to search all
  // fix this with a if-clause replacing the sql
  if (searchType == 'all') {
    sql = `
      SELECT *
      FROM music
      WHERE LOWER(musicmetadata) LIKE LOWER(?)
      LIMIT 10
    `;
  }

  let result = await query(sql, ['%' + searchTerm + '%']);

  // Send a response to the client
  response.json(result);
});

// A search route to find powerpoints
app.get('/api/powerpoint/:searchTerm/:searchType', async (request, response) => {
  // Get the search term from as a parameter from the route/url
  let searchTerm = request.params.searchTerm;
  // Get teh search type a sa parameter from the route/url
  let searchType = request.params.searchType;
  // Make a database query and remember the result
  // using the search term

  let sql = `
   SELECT * 
   FROM powerpoint
   WHERE LOWER(powerpointMetadata ->> '$.${searchType}') LIKE LOWER(?)
   LIMIT 10
  `;

  // since the sql gets a bit different if you want to search all
  // fix this with a if-clause replacing the sql
  if (searchType == 'all') {
    sql = `
      SELECT *
      FROM powerpoint
      WHERE LOWER(powerpointMetadata) LIKE LOWER(?)
      LIMIT 10
    `;
  }

  let result = await query(sql, ['%' + searchTerm + '%']);

  // Send a response to the client
  response.json(result);
});



// A search route to find all
app.get('/api/all', async (request, response) => {
  console.log('ALL SP called:');

  db.query('CALL sp_getAll()',function(err, rows){
    if (err) throw err;
  
    console.log('Data received from Db:');
    console.log(rows);
  });

  // Send a response to the client
  response.json(rows);
});

// If you search in category image than you will come here.
app.get('/api/image/:searchTerm/:searchType', async (request, response) => {
  // Get the search term from as a parameter from the route/url
  let searchTerm = request.params.searchTerm;
  // Get the search type a sa parameter from the route/url
  let searchType = request.params.searchType;
  // Make a database query and remember the result
  // using the search term

  let sql = `
   SELECT * 
   FROM image
   WHERE LOWER(imageMetadata ->> '$.${searchType}') LIKE LOWER(?)
   LIMIT 10
  `;

  // since the sql gets a bit different if you want to search all
  // fix this with a if-clause replacing the sql
  if (searchType == 'all') {
    sql = `
      SELECT *
      FROM image
      WHERE LOWER(imageMetadata) LIKE LOWER(?)
      LIMIT 10
    `;
  }

  let result = await query(sql, ['%' + searchTerm + '%']);

  // Send a response to the client
  response.json(result);
});

// If you search in category image than you will come here.
app.get('/api/pdf/:searchTerm/:searchType', async (request, response) => {
  // Get the search term from as a parameter from the route/url
  let searchTerm = request.params.searchTerm;
  // Get the search type a sa parameter from the route/url
  let searchType = request.params.searchType;
  // Make a database query and remember the result
  // using the search term

  let sql = `
   SELECT * 
   FROM pdf
   WHERE pdfMetadata ->> '$.${searchType}' LIKE ?
   LIMIT 10
  `;

  // since the sql gets a bit different if you want to search all
  // fix this with a if-clause replacing the sql
  if (searchType == 'all') {
    sql = `
      SELECT *
      FROM pdf
      WHERE LOWER(pdfMetadata) LIKE LOWER(?)
      LIMIT 10
    `;
  }

  let result = await query(sql, ['%' + searchTerm + '%']);

  // Send a response to the client
  response.json(result);
});

// For the harder / more advanced example
app.get('/api/map-image-search/:latitude/:longitude/:radius', async (request, response) => {
  let latitude = request.params.latitude;
  let longitude = request.params.longitude;
  let radius = request.params.radius;
  let result = await query(`
    SELECT * FROM (
      SELECT *,(((acos(sin((?*pi()/180)) * sin((imageMetadata -> '$.latitude' *pi()/180))+cos((?*pi()/180)) * cos((imageMetadata -> '$.latitude' * pi()/180)) * cos(((? - imageMetadata -> '$.longitude')*pi()/180))))*180/pi())*60*1.1515*1.609344) as distance FROM image) AS subquery
    WHERE distance <= ?
  `, [latitude, latitude, longitude, radius]);
  response.json(result);
});