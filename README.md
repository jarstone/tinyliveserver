# tinyliveserver
Tiny http server with live reload capability.

## Installation

```bash
npm i tinyliveserver
```

## Example

```javascript
const tinyliveserver = require('tinyliveserver')
tinyliveserver.start({
  port: 1234,
  root: 'public',
  watch: 'src',
})
```

## Configuration

```javascript
const config = {
  host: '127.0.0.1', // Set the server address. Default: 0.0.0.0
  port: 3000, // Set the server port. Default: 3000
  root: 'public', // Set root directory that's being served. Default: current directory
  watch: ['dist', 'public'], // Paths to exclusively watch for changes. Default: null (disabled livereload).
  wait: 100, // Waits for all changes, before reloading. Default(ms): 100. 'watch' configuration must be filled.
  verbose: true, // Show logging. Default: true
}

tinyliveserver.start(config)
```

## Methods

```javascript
tinyliveserver.reload() // Reload manually. 'watch' configuration must be filled.
tinyliveserver.shutdown() // Stop server.
```

## CLI

Include as npm script:

```json
...
"scripts": {
  "serve": "tinyliveserver --port=1234 --root=public --watch=src"
}
...
```

Or using npx:

```bash
npx tinyliveserver --port=1234 --root=public --watch=src
```

Or install globally:

```bash
npm install tinyliveserver -g
```

```bash
tinyliveserver --port=1234 --root=public --watch=src
```

## CLI parameters

```javascript
--host=127.0.0.1 // Set the server address. Default: 0.0.0.0
--port=3000 // Set the server port. Default: 3000
--root=public // Set root directory that's being served. Default: current directory
--watch=dist,public // Paths to exclusively watch for changes. Default: null (disabled livereload)
--wait=100 // Waits for all changes, before reloading. Default(ms): 100. 'watch' configuration must be filled.
--quiet // Hide logging..
```