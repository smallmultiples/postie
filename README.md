Postie
======

The current state of postmessage sucks. We had this idea to wrap it in a stream so you could communicate across frames with streams but it turns out it's not so simple. Which streams, classic or streams2 (3?!?)? Are event emitters better for this kind of thing? Postie is what the module will finish being but at the moment it's a very experimental work in progress.

For now, `require('postie')` will return a `Postie` class which extends `EventEmitter`. Posting a message through a postie can be listened to on the other side. Messages need a string name, and a package object which is converted to JSON. On the other end, the JSON is parsed into an object and then an event fires, the name being the same name you posted with.

API
===

#### `Postie(target, targetOrigin)`

`target` is the `window` object represented by the frame we're trying to target. If it's a parent frame, the value of `parent`, or `top` suffices here. If it's a child frame, `window.frames['foo']`, where `foo` is the value of the `name` attribute of the `iframe` you're trying to communicate with. targetOrigin is the url of the target frame. If it's cross-domain, you can't access the `document.location` (only set it) so you'll have to use tricks like `document.referrer` to get parent urls, (be careful some dodgy behaviours across different browsers) or supply a wildcard `*`. If you don't supply a targetOrigin we'll just automatically assume wildcard.

#### `postie.post(name, message)`

Posts the message object to the frame you're wrapping in postie, namespaced under `name`. This means you can listen to `name` on the other end e.g. `postie.on(name, cb)` and every time you post it'll trigger.

#### `postie.on`, `postie.removeListener`, `postie.once` etc.

Because `Postie` extends `EventEmitter` you get everything and `EventEmitter` has in node. This is how you listen to the namespaced messages being sent.