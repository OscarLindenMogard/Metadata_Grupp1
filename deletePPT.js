import fs from 'fs';
// Read all file names in client/powerpoints to a list
let files = fs.readdirSync('./client/powerpoints');

// A variable that should contain an SQL query that
// we can use to filter our database data
let sql = 'DELETE FROM powerpoint WHERE powerpointFile NOT IN (';

// Loop through the file names
for (let file of files) {
  // If the file name ends with .ppt, .pptx or .pot
  if (
    file.slice(-4) == '.ppt' ||
    file.slice(-5) == '.pptx' ||
    file.slice(-4) == '.pot'
  ) {
    sql += '"' + file + '", '
  }
}

sql = sql.slice(0, -2);
sql += ')';

console.log(sql);