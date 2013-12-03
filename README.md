Postie
======

The current state of postmessage sucks. What we really want is to trigger events with arbitrary parameters in one frame and have them receivable in another frame with a simple EventEmitter.

Postie is intended to work in cross-domain, cross-frame communications, but there's no reason you can't use it for same-domain frame communication!

Installation
------------

`npm install postie`

Or:

`<script src="postie.js">` [download here][releases]

Usage
-----

We made postie because we have two common use cases for such a system. 

One, we tend to make embeddable widgets that vary in dimensions during runtime. We want to notify the parent container that the widget has changed dimensions. Then, the parent, listening to messages from the child frame will have a handler for these events, changing the dimensions of the iframe to match what was passed through.

The second, again with embeddable widgets, if we want to listen to url changes in the parent, we need the parent sending us any changes as they happen so we can react.

#### Receiving Messages ####

So in the size case, we have something like so:

``` JavaScript
var child = new Postie()
child.on('change:height', function(height) {
    $('frame[name=frame-name]')
        .height(height)
});
```

Postie is an EventEmitter, so you have that API (`once`, `removeListener`, etc.).

When you're only receiving messages, you don't need any arguments to postie. If you want the same instance to post messages as well you'll need to read the **Sending Messages** section.

#### Sending Messages ####

To finish off our size changing example, we need a Postie on the child frame to notify of dimension changes.

``` JavaScript
var parent = new Postie(window.parent)
parent.post('change:height', $(window).height())
```

The first argument is the channel again, and the second argument is the target frame. When you're going upwards in the frame heirarchy, this is easy: `window.parent`, `window.top`, `window.parent.parent`, etc. Going down is harder, you'll need to name your frames and access them like so: `window.frames['frame-name']`, just remember to have named them.

`<frame src="my-frame.html" name="frame-name">`

It also provides a handy css selector when we need it too. If you're reading this and you have a better way to get the frame object you need as a target for postmessages, then please let me know.

Just remember that without the handling code on the other end, your messages will do nothing.

Cross Domain Messages
---------------------

By default, postie will take care of this for you in a very forgiving manner. It actually send all messages with the wildcard, `'*'` domain identifier. If you know the domain you're posting to (or listening to) you should really use the specific domain, but sometimes you can't, or if you're testing it's more convenient to have the `'*'`, so we assume it by default.

It's easy enough to change your code to be specific:

``` JavaScript
var postie = new Postie(window.parent, 'example.com')
```

This way if you know your parent is `'example.com'`, you can't send messages to `'totally-not-evil.com'` instead.

API
---



License
-------

MIT

Browser Compatibility
---------------------

It definitely works in Chrome, and past experience says these techniques work in other browsers IE8+, but I have to still do the actual testing for the 0.4.x release.

[releases]: https://github.com/smallmultiples/postie/releases