EventEmitter = require('events').EventEmitter
through = require('through')

module.exports = Postie

class Postie extends EventEmitter

    constructor: (@target, @url) ->
        @target.receiveMessage(@handleMessage)

    handleMessage: (event) ->
        pkg = JSON.parse(event.data)
        @emit(pkg.name, pkg.data)

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
        return @target.postMessage(str, JSON.stringify(
            name: name, message: message
        ))



