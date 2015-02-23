var test = require('tape')
var inherits = require('inherits')
var Postie = require('../index')
var iframe = window

test('Postie instantiation', function (t) {
    t.plan(4)

    var noOrigin = new Postie(window)
    var hasFakeOrigin = new Postie(window, 'fakeOrigin')
    noOrigin.stopListening()
    hasFakeOrigin.stopListening()

    // Target is set
    t.equals(noOrigin.target, window, 'target is set')

    // Origin is set
    t.equals(noOrigin.origin, '*', 'origin is defaulted to *')
    t.equals(hasFakeOrigin.origin, 'fakeOrigin', 'origin is set if provided')

    // Listen was called
    var checkHandler = makeListener(function (ev) {
        t.pass('event listener is attached')
        checkHandler.stopListening()
    })

    window.postMessage('a', '*')
})

// We need to wrap the handle message function with a test object in scope of
// the wrapper so we can pass a test when the handler is called.
function makeListener(cb) {
    function Listener () {
        Postie.call(this, window)
    }

    inherits(Listener, Postie)

    Listener.prototype.handleMessage = function (ev) {
        cb()
        Postie.prototype.handleMessage.call(this, ev)
    }

    return new Listener()
}

test('Events are emitted', function (t) {
    t.plan(4)

    // Correct events are emitted with the right arguments in the right order
    var instance = new Postie(window)
    instance.on('b', function(a, b, c) {
        t.pass('Event callback called')
        t.equals(a, 1, 'Arguments are passed')
        t.deepEquals(b, [ 2, 3 ], 'Arrays are correctly serialised / deserialised')
        t.deepEquals(c, { foo: 'bar' }, 'Objects are correctly serialised / deserialised')
        instance.stopListening()
    })

    instance.post('b', 1, [ 2, 3 ], { foo: 'bar' })
})

test('Events get sent across frames', function (t) {
    t.plan(1)

    var instance = new Postie(window)
    instance.on('c', function () {
        t.pass('Event emitted')
        instance.stopListening()
    })

    addIframe('http://127.0.0.1:8080/iframe.html')
})

test('Events get sent across frames and domains', function (t) {
    t.plan(1)

    instance = new Postie(window)

    instance.on('c', function () {
        t.pass('Event emitted')
        instance.stopListening()
    })

    addIframe('http://127.0.0.1:' + window.ZUUL.port + '/iframe.html')
})

// Convenience function to add an iframe pointing at src
function addIframe (src) {
    var iframe = document.createElement('iframe')
    iframe.src = src
    document.getElementsByTagName('body')[0].appendChild(iframe)
    return iframe
}