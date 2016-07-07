var helpers = require("../helpers.js")

/*
 === MTW - Mean Temperature of Water ===

 ------------------------------------------------------------------------------
        1   2 3
        |   | |
 $--MTW,x.x,C*hh<CR><LF>
 ------------------------------------------------------------------------------

 Field Number:
 1. Degrees
 2. Unit of Measurement, Celcius
 3. Checksum
 */

exports.TYPE = 'depth-transducer';
exports.ID = 'MTW';

exports.decode = function(fields) {
  return {
    sentence: exports.ID,
    type: exports.TYPE,
    waterTemp: +fields[1],
    waterTempUnits: fields[2]
  }
}
