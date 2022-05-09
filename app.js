const express = require("express");
const PORT = 3060;
const app = express();

//      Get Home page (Calendar)
// ==========================================================
app.use(express.static(__dirname + "/public"));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  });