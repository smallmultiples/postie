module.exports = Postie

var EventEmitter = require('events').EventEmitter
var postMessage = require('./postmessage')

function Postie (target, origin) {
    if (!(this instanceof Postie)) return new Postie(target, origin)

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

function post (channel) {
    var args = Array.prototype.slice.call(arguments, 1)
    var packed = this.pack(channel, args)
    postMessage(this.target, packed, this.origin)
}

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

function handleMessage (ev) {
    var unpacked = this.unpack(ev.data)
    if (unpacked) {
        var args = [ unpacked.channel ]
        args.push.apply(args, unpacked.args)
        this.emit.apply(this, args)
    }
}

function unpack (data) {
    try {
        var unpacked = JSON.parse(data)
        if (unpacked.__postie) return unpacked.__postie
        return false
    }
    catch (e) {
        return false
    }
}

function pack (channel, args) {
    return JSON.stringify({
        __postie: {
            channel: channel
          , args: args
        }
    })
}