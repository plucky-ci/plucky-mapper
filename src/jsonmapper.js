const jsonMapper = (obj, config) => {
  let objString = JSON.stringify(obj);
  const regex = /\${(.*?)}/g;
  let matches;
  let flattenedConfig = flattenObject(config);
  while((matches = regex.exec(objString)) !== null) {
    const token = matches[0];
    const key = matches[1];
    const value = flattenedConfig[key];
    if(typeof(value)==='object'||Array.isArray(value)){
      const strValue = JSON.stringify(value);
      objString = objString.replace(`"${token}"`, strValue);
      continue;
    }
    objString = objString.replace(token, value);
  }

  return JSON.parse(objString, function(k, v) {
    if(!isNaN(parseFloat(v))) {
      return parseFloat(v);
    }
    if(v === 'true' || v === 'True') {
      return true;
    }
    if(v === 'false' || v === 'False') {
      return false;
    }
    return v;
  });
};

const flattenObject = (ob) => {
  let toReturn = {};

  for (let i in ob) {
    if (!ob.hasOwnProperty(i)){
      continue;
    }

    if ((typeof ob[i]) === 'object') {
      let flatObject = flattenObject(ob[i]);
      for (let x in flatObject) {
        if (!flatObject.hasOwnProperty(x)){
          continue;
        }

        toReturn[i + '.' + x] = flatObject[x];
      }
      toReturn[i] = ob[i];
      continue;
    }
    toReturn[i] = ob[i];
  }
  return toReturn;
};

module.exports = {
  jsonMapper,
  flattenObject
};
