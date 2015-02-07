module.exports = postMessage

function postMessage (target, packed, origin) {
    if (target.postMessage) return target.postMessage(packed, origin)
}