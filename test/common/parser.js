const textEncoding = require('text-encoding');

const decoder = new textEncoding.TextDecoder('utf-8');
const encoder = new textEncoding.TextEncoder();

const decodeMetaData = (metaData) => {
  return metaData instanceof Uint8Array ? decoder.decode(metaData) : metaData;
};

// TODO: validate the info attribute

// TODO: handle error of JSON parsing
const parseWithMetaData = (metaData) => {
  const data = decodeMetaData(metaData);
  const index = data.indexOf('|');
  if (~index) {
    return {
      info: JSON.parse(data.slice(0, index)),
      metaData: new Uint8Array(metaData.slice(index + 1))
    };
  } else {
    return {
      info: JSON.parse(data),
      metaData: null
    };
  }
};

class Parser {
  constructor () {
    this._initPacking();
  }

  parse(data) {
    if (!this._isPacking) {
      const {info, metaData} = parseWithMetaData(data);
      if (info.size > metaData.length) {
        this._isPacking = true;
        this._stashedData.push(metaData);
        this._stashedDataInfo = info;
        this._stashedSize = metaData.length;
      } else {
        return this.parseSinglePackage(info, metaData);
      }
    } else {
      this._stashedData.push(data);
      this._stashedSize += data.length;
      if (this._stashedSize >= this._stashedDataInfo.size) {
        if (this._stashedSize > this._stashedDataInfo.size) {
          console.log('Receive sticky package!');
        }
        const parseResult = {
          data: this._stashedData, 
          ...this._stashedDataInfo
        };
        this._initPacking();
        return parseResult;
      }
    }
    return null;
  }

  parseSinglePackage(info, metaData) {
    // when only pacakge data is passed as argument
    if (metaData === undefined) {
      // {info, metaData} = parseWithMetaData(info);
      const result = parseWithMetaData(info);
      info = result.info;
      metaData = result.metaData;
    }
    return {
      data: info.type === 'image' ? [metaData] : metaData, 
      ...info
    };
  }

  _initPacking() {
    this._isPacking = false;
    this._stashedDataInfo = null;
    this._stashedData = [];
    this._stashedSize = 0;
  }
}

module.exports = Parser
