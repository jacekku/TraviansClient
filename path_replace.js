const fs = require("fs");
const files = fs
  .readdirSync("dist/assets")
  .filter((p) => p.includes(".js"))
  .filter((p) => !p.includes("index"))
  .filter((p) => !p.includes("vendor"));

const cssFile = fs.readdirSync("dist/assets").filter((p) => p.includes(".css"));

replaceInFile("dist/index.html");
files.forEach((p) => replaceInFile("dist/assets/" + p));
replaceInCss("dist/assets/" + cssFile[0]);
function replaceInFile(filePath) {
  fs.readFile(filePath, "utf8", function (err, data) {
    if (err) {
      return console.log(err);
    }
    var result = data.replace(/\/assets/g, "./assets");

    fs.writeFile(filePath, result, "utf8", function (err) {
      if (err) return console.log(err);
    });
  });
}
function replaceInCss(cssFilePath) {
  fs.readFile(cssFilePath, "utf8", function (err, data) {
    if (err) {
      return console.log(err);
    }
    var result = data.replace(/\/assets/g, ".");

    fs.writeFile(cssFilePath, result, "utf8", function (err) {
      if (err) return console.log(err);
    });
  });
}
