#!/usr/bin/env node

const tinyliveserver = require('./index')

class server {

  constructor() {
    this.config = {
      host: this.argv('host'),
      port: this.argv('port') ? parseInt(this.argv('port')) : null,
      root: this.argv('root'),
      wait: this.argv('wait') ? parseInt(this.argv('wait')) : null,
      watch: this.argv('watch') ? this.argv('watch').includes(',') ? this.argv('watch').split(',') : this.argv('watch') : null,
      verbose: this.argv('quiet') ? false : true,
    }
  }

  run() {
    tinyliveserver.start(this.config)
  }

  argv(key) {
    const arg = process.argv.filter(val => val.startsWith('--' + key))
    return arg.length ? arg.pop().split('=').pop() : null
  }
}

new server().run()