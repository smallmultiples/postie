Writeable = require('stream').Writeable

class Postie extends Writeable

    constructor: (@name, @target, @targetOrigin) ->
        unless @targetOrigin then @targetOrigin = '*'

        super(decodeStrings: false)

    _write: (chunk, encoding, next) ->
        pkg = JSON.stringify(name: name, message: data)
        window.postmessage(pkg, target, targetOrigin)
        next()

module.exports = Postie