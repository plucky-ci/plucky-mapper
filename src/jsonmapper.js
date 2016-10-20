const jsonMapper = (obj, config) => {
	let newObj = {};
	return getSanitizeObject(obj, flattenObject(extend(obj, config)), newObj);
};

const getSanitizeObject = (obj, config, newObj) => {
	const regex = /\${(.*?)}/;
	for(let i in obj) {
		if(typeof obj[i] === 'object') {
			newObj[i] = Array.isArray(obj[i]) ? [] : {};
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

const extend = (...args)=>{
  if(!args.length){
    return {};
  }
  return args.reduce((res, arg)=>{
    if(!res){
      return arg;
    }
    if(Array.isArray(res)){
      return [...res, ...(Array.isArray(arg)?arg:[arg])];
    }
    if(Array.isArray(arg)){
      return [res, ...arg];
    }
    const rType = typeof(res);
    const aType = typeof(arg);
    if(rType !== 'object'){
      return arg;
    }
    if(aType !== 'object'){
      return [res, arg];
    }
    return Object.keys(arg).reduce((res, key)=>{
      return Object.assign({}, res, {[key]: extend(res[key], arg[key])});
    }, res);
  });
  return Object.assign({}, ...args);
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
  flattenObject,
  extend
};
