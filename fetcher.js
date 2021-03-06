const request = require('request');
const fs = require('fs');
const readline = require('readline');

// parse arguments
if (process.argv.length !== 4) {
  console.log('Usage: node fetcher.js url filename');
  return;
}

const url = process.argv[2];
const filename = process.argv[3];

// Function to make http request and write to file
const makeRequestAndWriteFile = () => {
  // Make http request to url
  request(url, (error, response, body) => {

    // Print the error if one occurred, and quit
    if (error) {
      console.log('Error with the request! Error code: ', error.code);
      return;
    }
  
    // Checks for http status code other than 200
    if (response && (response.statusCode !== 200)) {
      console.log('Error fetching content! Status code: ', response && response.statusCode);
      return;
    }

    fs.writeFile(filename, body, (error) => {
      // Handles invalid path
      if (error && error.code === 'ENOENT') {
        console.log('Invalid path name!');
      } else {
        console.log(`Downloaded and saved ${body.length} bytes to ${filename}`);
      }
    });
  });
};

// Check to see if the file exists
fs.access(filename, fs.constants.F_OK, (err) => {

  // If file already exists
  if (!err) {

    // Set up readline for user input
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    // Query user to overwrite file by typing y
    rl.question(`${filename} already exists! Respond with \'y\' to replace the file: `, (answer) => {
      if (answer === 'y') {
        console.log('Rewriting the file...');
        makeRequestAndWriteFile();
      } else {
        console.log('Exiting...');
      }
      rl.close();
    });

  } else {
    makeRequestAndWriteFile();
  }
});