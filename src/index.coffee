EventEmitter = require('events').EventEmitter

class Postie extends EventEmitter

    target: null
    origin: null

    constructor: (target, origin='*') ->
        unless @ instanceof Postie
            return new Postie(target, origin)

        super()

        @target = target
        @origin = origin

        @listen()

    ###
    Sends a package over channel.

    - `channel` (String): The channel to send the package over
    - `pkg...` (Array...): The package to send. It will take any arguments after the first,
      stick them in a JSON array and then on the other end call the callback
      with those arguments applied to the callback.

    Returns the result of the postMessage call.
    ###
    post: (channel, pkg...) ->
        packed = @pack(channel, pkg)
        # We can't use the ? operator for checking it exists because of a very
        # specific bug. CoffeeScript checks ?( to see if the thing has
        # typeof === 'function', and though @target.postMessage is callable in
        # IE8, it returns 'object' for typeof and so in IE8 using ?( here
        # prevents postMessage from being called.
        if @target.postMessage then @target.postMessage(packed, @origin)

    ###
    Sets up the postMessage handler
    ###
    listen: ->
        if window.addEventListener
            window.addEventListener('message', @handleMessage)
        else
            window.attachEvent('onmessage', @handleMessage)

    ###
    Handles a postmessage event. Attempt to unpack it, and if we can emit an
    event.

    - `event` (Event): The event to handle.
    ###
    handleMessage: (event) =>
        if unpackaged = @unpack(event.data)
            @emit(unpackaged.channel, unpackaged.package...)

    ###
    Takes a string from a postmessage event and tries to unpack it. If it is
    successful it will return the unpacked object, otherwise it will return
    false.

    - `data` (String): The data to attempt to unpack.

    Returns the unpacked data as an Object, or `false`.
    ###
    unpack: (data) ->
        try
            pkg = JSON.parse(data)
            return {
                channel: pkg._postie.channel
                package: pkg._postie.package
            }

        # If it's not JSON or not our format it's not our problem
        # Common cases where this occurs: analytics, ads.
        catch error
            return false

    ###
    Packs a channel string and a package to send into a String that we can send
    over postMessage to be unpacked on the other side.

    - `channel` (String): The channel the package is being sent on.
    - `pkg` (Mixed): The package to pack with the channel into the string.

    Returns a String which can be unpacked into its old representation via
    `@unpack()`.
    ###
    pack: (channel, pkg) ->
        return JSON.stringify(
            _postie:
                channel: channel
                package: pkg
        )

module.exports = Postie