#!/usr/bin/env node
var http = require('http')
var fs = require('fs')
var connect = require('connect')
var serveStatic = require('serve-static')
var browserify = require('browserify-middleware')

var port = process.env.ZUUL_PORT || 8081

var app = connect()
    .use('/iframe.js', browserify('tests/support/iframe.js'))
    .use(serveStatic('tests/support'))

var server = http.createServer(app).listen(port, function () {
    console.log('\nSupport server listening on port:', port)
})
