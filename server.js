const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

// Define the output directory for text files
const outputFolder = "./Output";

// Ensure the output directory exists; create it if it doesn't
if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder);
}

const PORT = 3000;

app.use(express.json());

// Define routes

app.listen(PORT, () => {
  console.log(`Server is running: http://localhost:${PORT}`);
});

/**
 * Create a timestamped text file.
 */
app.post("/createTextFile", (req, res) => {
  const currentTime = new Date();
  const year = currentTime.getFullYear().toString();
  const month = (currentTime.getMonth() + 1).toString().padStart(2, '0');
  const date = currentTime.getDate().toString().padStart(2, '0');
  const hrs = currentTime.getHours().toString().padStart(2, '0');
  const mins = currentTime.getMinutes().toString().padStart(2, '0');
  const secs = currentTime.getSeconds().toString().padStart(2, '0');

  const dateTimeForFileName = `${year}-${month}-${date}-${hrs}-${mins}-${secs}.txt`;

  const filePath = path.join(outputFolder, dateTimeForFileName);

  fs.writeFile(filePath, currentTime.toISOString(), (err) => {
    if (err) {
      res.status(500).send(`Error creating file: ${err}`);
      return;
    }

    res.send(`File created successfully at: ${filePath}`);
  });
});

/**
 * Get a list of text files in the output directory.
 */
app.get('/getTextFiles', (req, res) => {
  fs.readdir(outputFolder, (err, files) => {
    if (err) {
      res.status(500).send(`Error occurred while reading files: ${err}`);
      return;
    }
    
    console.log("List of files:\n", files);
    
    const textFiles = files.filter((file) => path.extname(file) === ".txt");
    
    res.json(textFiles);
  });
});