import exifr from 'exifr';
import fs from 'fs';

let images = fs.readdirSync('Bilder')

console.log(images);

for (let image of images) {

    if(image.slice(-4) == '.jpg') 
    {
    console.log('image: ' + image)
    let metadata = await exifr.parse('bilder/' + image);
    console.log(metadata)
    }
}
