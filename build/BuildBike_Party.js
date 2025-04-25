import fs from 'fs';
import path from "node:path";

const labelClass = {
    "01": "label-right",
    "02": "label-left rotate-65",
    "03": "label-left",
    "04": "label-right",
    "05": "label-left push-up-8x",
    "06": "label-left push-up-8x",
    "07": "label-right",
    "08": "label-right",
    "09": "label-right rotate-65",
    "10": "label-left",
    "11": "label-right rotate-65",
    "12": "label-right",
}

function getFiles() {
    return fs.readdirSync(path.join(".", 'Bike_Party')).sort()
}

// Function to read and parse GeoJSON files
function readGeoJSON(fileName) {
  const data = fs.readFileSync(path.join(".", "Bike_Party", fileName))
  return JSON.parse(data);
}

// Merge coordinates from GeoJSON LineString files
const mergedCoordinates = getFiles().reduce((accumulatedCoords, file) => {
  const currentFile = readGeoJSON(file);
  if (currentFile.geometry.type !== "LineString") throw new Error(`"${file}" is not a LineString.`);
  let currentCoords = currentFile.geometry.coordinates;
  if (currentCoords.length === 0) return accumulatedCoords;
  let firstCoord = currentCoords[0].reverse();
  let match = file.match(/(\d+)-([\w\s]*)-([\w\s]*)-([\w\s]*).json/);
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

let bottomLeft = mergedCoordinates.reduce((accumulated, current) =>
    [Math.min(accumulated[0], current.coordinates[0]), Math.min(accumulated[1], current.coordinates[1])], [Infinity, Infinity])
let topRight = mergedCoordinates.reduce((accumulated, current) =>
    [Math.max(accumulated[0], current.coordinates[0]), Math.max(accumulated[1], current.coordinates[1])], [-Infinity, -Infinity])

const lastCoord = mergedCoordinates[mergedCoordinates.length - 1];
const lastStop = { "name": "Harvey's Gardent", "coordinates": lastCoord.coordinates, "markerClass": "label-left" };
// Build the merged GeoJSON object
const mergedGeoJSON = {
   "Bike_Party" : {
       "name": "Bike_Party",
    "title": "Bike Party Route",
    "runInfo": "",
    "trackerBounds":{
      "bottomLeft": bottomLeft,
      "topRight": topRight
    },
    "trackerTileSrcPattern": "https://cdn.glitch.globa…10.05.22.{z}.{x}.{y}.png",
    "mapHeight": "463px",
    "color": "#EFB143",
       "busIcon": "/api/icons8-party-96.png",
    "globalMarkerClass": "label-right",
    "stops": mergedCoordinates.concat([lastStop]),
  }
};


// Save to "route.json"
fs.writeFileSync("../src/stuff/routes/Bike_Party.json", JSON.stringify(mergedGeoJSON, null, 2));
console.log("Merged GeoJSON saved as ../src/stuff/routes/Bike_Party.json");
