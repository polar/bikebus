const fs = require('fs');

// Files to merge, listed in desired order
const files = [
  "01-Meadowbrook Road-Nottingham HighSchool-Hurlburt Road.json",
  "02-Meadowbrook Road-Hurlburt Road-Brookford Road.json",
  "03-Meadowbrook Road-Brookford Road-Bradford Parkway.json",
  "04-Meadowbrook Road-Bradford Parkway-Scott Avenue.json",
  "05-Meadowbrook Road-Scott Avenue-Crawford Avenue.json",
  "06-Meadowbrook Road-Crawford Avenue-Euclid Avenue.json",
  "07-Crawford Avenue-Euclid Avenue-Sherbourne Avenue.json",
  "08-Crawford Avenue-Sherbourne Avenue-Nottingham Road.json",
  "09-Broad Street-Nottingham Road-Meadowbrook Road.json",
  "10-Broad Street-Meadowbrook Road-Westcott Street.json",
  "11-Broad Street-Wescott Street-Buckingham Avenue.json",
  "12-Lancaster Ave-Broad Street-Ed Smith School.json",
];

const labelClass = {
    "01": "label-right",
    "02": "label-right push-down",
    "03": "label-right push-down",
    "04": "label-left push-up-8x",
    "05": "label-left push-up-8x",
    "06": "label-left push-up-8x",
    "07": "label-right",
    "08": "label-right",
    "09": "label-right rotate-65",
    "10": "label-right rotate-65",
    "11": "label-right rotate-65",
    "12": "label-right rotate-65",
}
// Function to read and parse GeoJSON files
function readGeoJSON(fileName) {
  const data = fs.readFileSync(fileName);
  return JSON.parse(data);
}

// Merge coordinates from GeoJSON LineString files
const mergedCoordinates = files.reduce((accumulatedCoords, file) => {
  const currentFile = readGeoJSON(file);
  if (currentFile.geometry.type !== "LineString") throw new Error(`"${file}" is not a LineString.`);
  let currentCoords = currentFile.geometry.coordinates;
  if (currentCoords.length === 0) return accumulatedCoords;
  let firstCoord = currentCoords[0].reverse();
  let match = file.match(/(\d+)-([\w\s]+)-([\w\s]+)-([\w\s]+).json/);
  if (!match) throw new Error(`"${file}" does not match expected format.`);
  let letNumber = match[1];
  let routeName = match[2];
  let startStop = match[3];
  let endStop = match[4];
  let newCoords = { "name": startStop, "coordinates": firstCoord, "markerClass": labelClass[letNumber] };
  let restCoords = currentCoords.slice(1);
  let newStops = restCoords.map(coord => ({ "coordinates": coord.reverse(), "waypointOnly": true }))
  return accumulatedCoords.concat([newCoords, ...newStops]);
}, []);

const lastCoord = mergedCoordinates[mergedCoordinates.length - 1];
const lastStop = { "name": "Ed Smith School", "coordinates": lastCoord.coordinates, "markerClass": "label-left" };
// Build the merged GeoJSON object
const mergedGeoJSON = {
   "nottingham" : {
    "title": "Nottingham to Ed Smith School",
    "runInfo": "The Nottingham to Ed Smith Bike Bus Route is a 30-minute bike journey from Nottingham High School to Ed Smith School.",
    "trackerBounds":{
      "bottomLeft": [43.02933, -76.12613],
      "topRight": [43.04302, -76.09245]
    },
    "trackerTileSrcPattern": "https://cdn.glitch.globa…10.05.22.{z}.{x}.{y}.png",
    "mapHeight": "463px",
    "color": "#EFB143",
    "globalMarkerClass": "label-right",
    "stops": mergedCoordinates.concat([lastStop]),
  }
};


// Save to "route.json"
fs.writeFileSync("../../src/stuff/notingham.json", JSON.stringify(mergedGeoJSON, null, 2));
console.log("Merged GeoJSON saved as ../src/stuff/notingham.json");
