Writable = require('readable-stream').Writable

class Postie extends Writable

    constructor: (@name, @target, @targetOrigin) ->
        unless @targetOrigin then @targetOrigin = '*'

        super(decodeStrings: false, objectMode: true)

    _write: (chunk, encoding, next) ->
        console.log('_write')
        pkg = JSON.stringify(name: @name, message: chunk)
        window.postMessage(pkg, @target, @targetOrigin)
        next()

    post: (thing) -> @write(thing)

module.exports = Postie