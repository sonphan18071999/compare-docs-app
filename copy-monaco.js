const fs = require("fs-extra");
const path = require("path");

// Paths
const monacoSource = path.join(__dirname, "node_modules/monaco-editor/min/vs");
const monacoDestination = path.join(__dirname, "src/assets/vs");

// Create directory if it doesn't exist
if (!fs.existsSync(path.join(__dirname, "src/assets"))) {
  fs.mkdirSync(path.join(__dirname, "src/assets"));
}

// Copy files
try {
  console.log("Copying Monaco Editor files to assets...");
  fs.copySync(monacoSource, monacoDestination);
  console.log("Done!");
} catch (err) {
  console.error("Error copying Monaco Editor files:", err);
}
