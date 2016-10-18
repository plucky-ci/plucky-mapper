# Plucky-mapper

json mapper for referencing configurations from outside of loader configuration.

# Usage

```javascript
let globalConfig = {
	"foo": {
		"bar": "someValue",
		"authorized": true,
		"server": {
			"url":"http://some.url.com",
			"port": 123
		}
	}
}

let loaderConfiguration = {
	"port": "${foo.server.port}",
	"authorized": "${foo.authorized}",
	"bar": "${foo.bar}",
	"config": {
		... other configurations
	}
}

const { jsonMapper } = require("jsonmapper");

console.log(jsonMapper(loaderConfiguration, globalConfig));

{
	"port":123,
	"authorized": true,
	"bar": "someValue",
	"config": {
		... other configurations
	}
}
```