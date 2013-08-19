EventEmitter = require('events').EventEmitter

class Postie extends EventEmitter

    constructor: (@target, @url) ->
        unless @url then @url = '*'

        if self.addEventListener
            self.addEventListener('message', @handleMessage)
        else
            self.attachEvent('onmessage', @handleMessage)

    handleMessage: (event) =>
        pkg = JSON.parse(event.data)
        @emit(pkg.name, pkg.message)

        # unless @streams[pkg.name] then @streams[pkg.name] = @buildStream()

        # @getStream(pkg.name).queue(pkg.data)

    # buildStream: ->

    # getStream: (name) ->
        # if @streams[pkg.name]
            # return @streams[pkg.name]
        # else
            # return @streams[pkg.name] = @buildStream()

    # subscribe: (name) -> @getStream(name)

    post: (name, message) ->
        return @target.postMessage(JSON.stringify(
            name: name, message: message
        ), @url)

module.exports = Postie