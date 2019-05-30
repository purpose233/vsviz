const fs = require('fs');

const writeFile = async (fileName, data) => {
  const sequenceData = (data.length != null && data.length > 0) ? 
    data : [data];
  let isFirst = true;
  for (const singleData of sequenceData) {
    await writeFilePromise(fileName, singleData, !isFirst);
    isFirst = false;
  }
}

const writeFilePromise = (fileName, data, isAppend=false) => {
  return new Promise((resolve, reject) => {
    const f = isAppend ? fs.appendFile : fs.writeFile;
    f(fileName, data, (e) => {
      if (e) {
        reject(e);
      } else {
        resolve();
      }
    });
  });
}

module.exports = {
  writeFile 
}
