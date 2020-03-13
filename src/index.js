var VectorTile = require('@mapbox/vector-tile').VectorTile;
var Protobuf = require('pbf');
var readFileSync = require('fs').readFileSync

var data = readFileSync('../tests/fixtures/openmaptiles_12-666-1433.pbf')
var tile = new VectorTile(new Protobuf(data));

function toDeck({tile, layer, indices}) {
  var layer = 'waterway'
  var indices = [0]

  tile[layer]
  var vtLayer = tile.layers[layer]
  var index = 0
  var feature = vtLayer.feature(0)
  var dataType = Int32Array
  var typedArray = new dataType(0)
  var geometry = feature.loadGeometry()
  feature.properties


  vtLayer

  var test;
}

var DEFAULT_COLOR = [0, 0, 0]
var DEFAULT_WIDTH = 1;

// Loop over all path layer objects at once and put them into an object of TypedArrays
// geometryIndices:
// {
//   layerName: [...]
// }
// properties:
// {
//   layerName: {
//     0: {
//       color: [255, 255, 255],
//       width: 1
//     }
//   }
// }
function toPathLayer({tile, geometryIndices, properties}) {
  var startIndexCounter = 0;
  var startIndices = [0];
  var positions = []
  // TODO: don't create arrays if don't vary in properties
  var colors = []
  var widths = []

  for (var layerName in geometryIndices) {
    var layerIndices = geometryIndices[layerName]
    for (var index of layerIndices) {
      var feature = tile.layers[layerName].feature(index)
      var geometry = feature.loadGeometry()

      // Add geometry
      var nVertices = 0
      for (var point of geometry[0]) {
        positions.push(point.x)
        positions.push(point.y)
        nVertices += 2
      }
      startIndexCounter += nVertices;
      startIndices.push(startIndexCounter);

      // Find properties for this feature
      var color = DEFAULT_COLOR;
      var width = DEFAULT_WIDTH;
      if (properties[layerName] && properties[layerName][index]) {
        if (properties[layerName][index].color) {
          color = properties[layerName][index].color
        }
        if (properties[layerName][index].width) {
          width = properties[layerName][index].width
        }
      }

      // Add properties to arrays
      for (var i = 0; i < nVertices; i++) {
        colors.push.apply(color);
        widths.push(width)
      }
    }
  }

  // data object ready to be passed to layer
  return {
    length: startIndices.slice(-1)[0],
    startIndices: startIndices,
    positionFormat: 'XY',
    attributes: {
      getPath: Float32Array.from(positions),
      getColors: Uint8ClampedArray.from(colors),
      getWidths: Float32Array.from(widths)
    }
  }
}


var geometryIndices = {
  waterway: [0, 2, 4]
}
var properties = {
  waterway: {
    0: {
      color: [100, 150, 200],
      width: 1
    }
  }
}
