#!/usr/bin/env node
var http = require('http')
var fs = require('fs')
var connect = require('connect')
var serveStatic = require('serve-static')

var port = process.env.ZUUL_PORT

var app = connect()
    .use(serveStatic('tests/support'))

var server = http.createServer(app).listen(port, function () {
    console.log('\nSupport server listening on port:', port)
})

