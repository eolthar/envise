# envise
A lightweight and fast package for extracting and validating environment variables.

```
npm i github:eolthar/envise#v2
```

## Connection
```js
const envise = require("envise");

envise({
    path: ".env",
    encoding: "utf8",
    override: false,
    return: false,
    debug: false
});
```

### Structure
All these keys are optional
- **path** - path to the environment variables file (default ".env")
- **encoding** - file encoding (default "utf8")
- **override** - whether to overwrite existing environment variables (default false)
- **return** - whether to return an object with loaded variables (default false)
- **debug** - enable debug mode with logging (default false)
