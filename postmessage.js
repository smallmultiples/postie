module.exports = postMessage

// Separating it into a function so we can shim postmessage when
// it's not available
function postMessage (target, packed, origin) {
    if (target.postMessage) return target.postMessage(packed, origin)
}