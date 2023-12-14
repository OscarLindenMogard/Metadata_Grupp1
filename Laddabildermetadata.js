import fs from 'fs';

// import exifr - a metadata extractor for images
import exifr from 'exifr';

// Import the database driver
import mysql from 'mysql2/promise';

// Create a connection 'db' to the database
const db = await mysql.createConnection({
  host: '161.97.144.27',
  port: 8091,
  user: 'root',
  password: 'guessagain91',
  database: 'Gruppuppgift'
});

// A small function for a query
async function query(sql, listOfValues) {
  let result = await db.execute(sql, listOfValues);
  return result[0];
}

// give me a list of all files in the image folder
let images = fs.readdirSync('client/bilder/');

// Loop through the images and extract the metadata
for (let image of images) {
  // Only for files ending with .jpg
  // slice(-4) get the last 4 letters from the image name
  if (
    image.slice(-4) == '.jpg'
    ) 
    {
    let metadata = await exifr.parse('client/bilder/' + image);
    
    // console.log('IMAGE: ' + image);
    // console.log(metadata)
    
    // Insert JSON into DB (powerpoint). uncomment this if you want to insert into DB
     let result = await query(`
      INSERT INTO image (imageFile, imageMetadata)
       VALUES(?, ?)
      `, [image, metadata]);

      console.log(result);
  }
}
process.exit();
