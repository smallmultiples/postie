Postie
======

The current state of postmessage sucks. We had this idea to wrap it in a stream so you could communicate across frames with streams. On one end you'll create a `Postie`, to send messages (writeable stream) and the other a `LetterBox` to receive messages (readable stream).

Postie is intended for use in cross-domain, cross-frame communication, but there's no reason you can't use it for same-domain frame communication!

Installation
------------

npm install postie

Usage
-----

We made postie because we have two common use cases for such a system. 

One, we tend to make embeddable widgets that vary in dimensions during runtime. We want to notify the parent container that the widget has changed dimensions. Then, the parent, listening to messages from the child frame will have a handler for these events, changing the dimensions of the iframe to match what was passed through.

The second, again with embeddable widgets, if we want to listen to url changes in the parent, we need the parent sending us any changes as they happen so we can react.

#### Receiving Messages ####

So in the size case, we have something like so:

``` JavaScript
var dimensions = new LetterBox('dimensions')
dimensions.on('data', function(dimensions) {
    $('frame[name=frame-name]')
        .width(dimensinos.width)
        .height(dimensinos.height)
});
```

LetterBox is a readable stream, so when data is pushed through the stream we get a 'data' event. We can handle it this way or we can pipe it to another stream that deals with it, for the sake of example I've left it as the data event.

The first and only argument to LetterBox is a channel. A channel is simply a string, it's just a namespace for postmessage messages sent via window.postmessage, to prevent the letterbox dealing with dimensions changes also having to worry about messages being sent about url changes.

#### Sending Messages ####

To finish off our size changing example, we need a Postie on the child frame to notify of dimension changes.

``` JavaScript
var dimensions = new Postie('dimensions', window.parent)
dimensions.write({ width: $(window).width(), height: $(window).height() })
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
var dimensions = new Postie('dimensions', window.parent, 'example.com')
```

This way if you know your parent is `'example.com'`, you can't send messages to `'totally-not-evil.com'` instead.

API
---



License
-------

MIT

Browser Compatibility
---------------------

It's been tested in IE8+, Firefox, Chrome, Safari, Mobile-webkit, Mobile-chrome. It may work in other environments, I wouldnt know.