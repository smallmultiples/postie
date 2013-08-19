Postie
======

Abstracts postmessage into eventEmmitters and streams

How to use
==========

First, get a new postie and give him a destination. A destination is a `frameWindow` window object, and the `url` of that frame.

When communicating with the parent window this is easy enough. The `frameWindow` is parent.

Sometimes you don't know the URL of the frame though, 

``` javascript
var postie = new Postie(parent, 'http://example.com/');
```

Then, we 