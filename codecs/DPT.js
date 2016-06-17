var helpers = require("../helpers.js")

/*
 === DPT - Depth of Water ===

 ------------------------------------------------------------------------------
        1   2   3
        |   |   |
 $--DPT,x.x,x.x*hh<CR><LF>
 ------------------------------------------------------------------------------

 Field Number:
 1. Depth, meters
 2. Offset from transducer, positive means distance from tansducer to water line negative means distance from transducer to keel
 3. Checksum
 */

exports.TYPE = 'depth-transducer';
exports.ID = 'DPT';

exports.decode = function(fields) {
  return {
    sentence: exports.ID,
    type: exports.TYPE,
    depthMeters: +fields[1]
  }
}
