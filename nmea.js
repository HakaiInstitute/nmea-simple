// A NMEA-0183 parser based on the format given here: http://www.tronico.fi/OH6NT/docs/NMEA0183.pdf

var APB = require('./codecs/APB.js');
var BWC = require('./codecs/BWC.js');
var DBT = require('./codecs/DBT.js');
var DPT = require('./codecs/DPT.js');
var GGA = require('./codecs/GGA.js');
var GLL = require('./codecs/GLL.js');
var GSA = require('./codecs/GSA.js');
var GSV = require('./codecs/GSV.js');
var HDG = require('./codecs/HDG.js');
var HDM = require('./codecs/HDM.js');
var HDT = require('./codecs/HDT.js');
var MTK = require('./codecs/MTK.js');
var MTW = require('./codecs/MTW.js');
var MWV = require('./codecs/MWV.js');
var RDID = require('./codecs/RDID.js');
var RMC = require('./codecs/RMC.js');
var VHW = require('./codecs/VHW.js');
var VTG = require('./codecs/VTG.js');


// export helpers
module.exports.Helpers = require('./helpers.js');

var validLine = function (line) {
    // check that the line passes checksum validation
    // checksum is the XOR of all characters between $ and * in the message.
    // checksum reference is provided as a hex value after the * in the message.
    var checkVal = 0;
    var parts = line.split('*');

    for (var i = 1; i < parts[0].length; i++) {
        checkVal = checkVal ^ parts[0].charCodeAt(i);
    }

    return checkVal == parseInt(parts[1], 16);
};

exports.traditionalDecoders = {
    APB: APB.decode,
    BWC: BWC.decode,
    DBT: DBT.decode,
    DPT: DPT.decode,
    GGA: GGA.decode,
    GLL: GLL.decode,
    GSA: GSA.decode,
    GSV: GSV.decode,
    HDG: HDG.decode,
    HDM: HDM.decode,
    HDT: HDT.decode,
    MTK: MTK.decode,
    MTW: MTW.decode,
    MWV: MWV.decode,
    RDID: RDID.decode,
    RMC: RMC.decode,
    VHW: VHW.decode,
    VTG: VTG.decode
};

exports.encoders = new Object();

exports.encoders[DBT.TYPE] = DBT;
exports.encoders[GGA.TYPE] = GGA;
exports.encoders[GLL.TYPE] = GLL;
exports.encoders[HDM.TYPE] = HDM;
exports.encoders[HDT.TYPE] = HDT;
exports.encoders[MTK.TYPE] = MTK;
exports.encoders[MWV.TYPE] = MWV;
exports.encoders[VTG.TYPE] = VTG;

exports.parse = function (line) {
    if (validLine(line)) {
        var fields = line.split('*')[0].split(','),
            talker_id,
            msg_fmt;
        if (fields[0].charAt(1) == 'P') {
            talker_id = 'P'; // Proprietary
            msg_fmt = fields[0].substr(2);
        } else {
            talker_id = fields[0].substr(1, 2);
            msg_fmt = fields[0].substr(3);
        }
        fields[0] = msg_fmt;

        var parser = exports.traditionalDecoders[msg_fmt];
        if (!parser && msg_fmt.substr(0, 3) === "MTK") {
            parser = exports.traditionalDecoders["MTK"];
        }
        if (parser) {
            var val = parser(fields);
            val.talker_id = talker_id;
            return val;
        } else {
            //throw Error("Error in parsing: " + line);
            var val = {};
            val.error = true;
            return val;
        }
    } else {
        //throw Error("Invalid line: " + line);
        var val = {};
        val.error = true;
        return val;
    }
};

exports.encode = function (talker, msg) {
    if (typeof msg === 'undefined') {
        //throw new Error("Can not encode undefined, did you forget msg parameter?");
        var val = {};
        val.error = true;
        return val;
    }
    encoder = exports.encoders[msg.type];
    if (encoder) {
        return encoder.encode(talker, msg);
    } else {
        //throw Error("No encoder for type: " + msg.type);
        var val = {};
        val.error = true;
        return val;
    }
}
