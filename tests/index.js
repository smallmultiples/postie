var test = require('tape')
var Postie = require('../index')

// var iframe = document.getElementById('iframe').contentWindow
var iframe = window

test('Postie instantiation', function (t) {
    t.plan(3)

    var noOrigin = new Postie(iframe)
    var hasFakeOrigin = new Postie(iframe, 'fakeOrigin')
    var Listener = makeListener(t)

    // Target is set
    t.equals(noOrigin.target, iframe)

    // Origin is set
    t.equals(noOrigin.origin, '*')
    t.equals(hasFakeOrigin.origin, 'fakeOrigin')

    // Listen was called
    var Listener = makeListener()
    new Listener()

    fireEvent(window, makeEvent('message'))
})

// Convenience function to create a DOM event to be fired later.
function makeEvent(name) {
    if (document.createEvent) {
        var ev = document.createEvent('HTMLEvents')
        ev.initEvent(name, true, true)
    }
    else {
        var ev = document.createEventObject()
        ev.eventType = name
    }

    return ev
}

// Convenience function to programmatically a DOM event,
function fireEvent(target, ev) {
    if (document.createEvent) {
        target.dispatchEvent(ev)
    }
    else {
        target.fireEvent('on' + ev.eventType, ev)
    }
}

// We need to wrap the handle message function with a test object in scope of
// the wrapper so we can pass a test when the handler is called.
function makeListener(t) {
    var Listener = function () {
        Postie.call(this, iframe)
    }

    Listener.prototype.handleMessage = function (event) {
        t.pass('event handled')
        Postie.prototype.handleMessage.call(this, event)
    }

    return Listener
}