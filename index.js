const fs = require('fs')
const path = require('path')
const http = require('http')
const mime = require('mime-types')
const chokidar = require('chokidar')
const websocket = require('faye-websocket')
require('colors')

let tinyliveserver = {
  server: null,
  watcher: null,
  start: null,
  reload: null,
  shutdown: null,
}

const res404 = res => {
  res.writeHead(404, { 'Content-Type': 'text/plain' })
  res.end('Not found')
}

let clients = []

tinyliveserver.start = (config = {}) => {
  const host = config.host || '0.0.0.0'
  const port = config.port || 3000
  const root = config.root ? path.join(process.cwd(), config.root).replace(/\\/g, '/') : process.cwd().replace(/\\/g, '/')
  const wait = config.wait || 100
  const watch = config.watch || null
  const verbose = config.verbose === undefined || config.verbose === null ? true : config.verbose

  // Server
  const server = http.createServer((req, res) => {
    const indexHTML = req.url.split('/').pop().includes('.') === false ? '/index.html' : ''
    const location = path.join(root, req.url, indexHTML)

    if (fs.existsSync(location)) {
      const type = mime.lookup(location)
      res.writeHead(200, { 'Content-Type': type })

      if (type === 'text/html') {
        let html = fs.readFileSync(location, 'utf-8')
        html = html.replace('</body>', `  <script>new WebSocket('ws://' + window.location.host).onmessage=o=>{'reload'==o.data&&window.location.reload()}</script>\n</body>`)
        res.end(html)
      } else {
        const stream = fs.createReadStream(location)
        stream.on('open', () => stream.pipe(res)).on('error', () => res404(res))
      }

      verbose && console.log(req.method.yellow, req.url.cyan)
    }
    else res404(res)

  })
    .listen(port, host)
    .on('listening', () => {
      tinyliveserver.server = server
      const addr = server.address()
      const address = addr.address === '0.0.0.0' ? '127.0.0.1' : addr.address
      console.log(`Serving`, root.yellow, 'at', `http://${address}:${addr.port}/`.cyan)
      watch && verbose ? console.log('Ready for changes') : ''
    })

  // WebSocket
  server.on('upgrade', (request, socket, body) => {
    const ws = new websocket(request, socket, body)
    ws.onclose = () => clients = clients.filter(i => i !== ws)
    clients.push(ws)
  })

  // Watch & reload
  if (watch) {
    tinyliveserver.watcher = chokidar.watch(watch, { ignoreInitial: true })
    tinyliveserver.watcher.on('all', (event, file) => {
      setTimeout(() => {
        verbose && console.log('Change detected'.cyan, file.replace(/\\/g, '/').yellow)
        tinyliveserver.reload()
      }, wait)
    })
  }
}

tinyliveserver.reload = () => clients.forEach(ws => ws && ws.send('reload'))
tinyliveserver.shutdown = () => {
  const watcher = tinyliveserver.watcher
  watcher && watcher.close()

	const server = tinyliveserver.server
  server && server.close()
}

module.exports = tinyliveserver