const jsonMapper = (obj, config) => {
	let newObj = {};
	return getSanitizeObject(obj, flattenObject(config), newObj);
};

const getSanitizeObject = (obj, config, newObj) => {
	const regex = /\${(.*?)}/;
	for(let i in obj) {
		if(typeof obj[i] === 'object') {
			newObj[i] = {};
			getSanitizeObject(obj[i], config, newObj[i]);
		} else {
			if(typeof obj[i] !== 'string') {
				newObj[i] = obj[i];
			} else {
				if(!obj[i].match(regex)) {
					newObj[i] = obj[i];
				} else {
					const tokenReplace = regex.exec(obj[i]);
					newObj[i] = config[tokenReplace[1]];
				}
			}
		}
	}

	return newObj;
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
