EventEmitter = require('events').EventEmitter

class Postie extends EventEmitter

    constructor: (@target, @url) ->
        unless @url then @url = '*'

        if self.addEventListener
            self.addEventListener('message', @handleMessage)
        else
            self.attachEvent('onmessage', @handleMessage)

    handleMessage: (event) =>
        try
            pkg = JSON.parse(event.data)
            @emit(pkg.name, pkg.message)
        catch error
            @emit('error', error)

    post: (name, message) ->
        return @target.postMessage(JSON.stringify(
            name: name, message: message
        ), @url)

module.exports = Postie