Writable = require('readable-stream/writable')

class Postie extends Writable

    constructor: (@channel, @target, @targetOrigin='*') ->
        super(decodeStrings: false, objectMode: true)

    _write: (chunk, encoding, next) ->
        # Because we're sharing window.postmessage with who knows what, give
        # our JSON object some namespacing to reduce the chance of hitting
        # other people's formats.
        pkg = JSON.stringify(_postie:
            channel: @channel,
            package: chunk
        )
        window.postMessage(@target, pkg, @targetOrigin)
        next()

module.exports = Postie