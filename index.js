module.exports = Postie

var EventEmitter = require('events').EventEmitter
var postMessage = require('./postmessage')

function Postie (target, origin) {
    if (!(this instanceof Postie)) return new Postie(target, origin)

    // '*' is a wildcard origin
    if (origin == null) origin = '*'

    EventEmitter.call(this)

    this.target = target
    this.origin = origin

    this.listen()
}

Postie.prototype = new EventEmitter()

Postie.prototype.post = post
Postie.prototype.listen = listen
Postie.prototype.handleMessage = handleMessage
Postie.prototype.unpack = unpack
Postie.prototype.pack = pack

// Get the channel and arguments and send it to the target
// Channel is the event that the other side will be listening for
function post (channel) {
    var args = Array.prototype.slice.call(arguments, 1)
    var packed = this.pack(channel, args)
    postMessage(this.target, packed, this.origin)
}

// Listens in a cross-browser fashion. When postmessage isn't available
// we'll either have to change listen or fake message events somehow.
function listen () {
    var _this = this

    function handler () {
        _this.handleMessage.apply(_this, arguments)
    }

    if (window.addEventListener) {
        window.addEventListener('message', handler)
    }
    else {
        window.attachEvent('onmessage', handler)
    }
}

// Unpacks and emits
function handleMessage (ev) {
    var unpacked = this.unpack(ev.data)
    if (unpacked) {
        var args = [ unpacked.channel ]
        args.push.apply(args, unpacked.args)
        this.emit.apply(this, args)
    }
}

// Takes a message data string and deserialises it
function unpack (data) {
    // We don't control all message events, they won't always be JSON
    try {
        var unpacked = JSON.parse(data)
        if (unpacked.__postie) return unpacked.__postie
        return false
    }
    catch (e) {
        return false
    }
}

// Takes a channel and the arguments to emit with and serialises it
// for transmission
function pack (channel, args) {
    return JSON.stringify({
        __postie: {
            channel: channel
          , args: args
        }
    })
}