const headers = require('./headers')
function errHandle(res) {
    res.writeHead(400, headers);
    res.write(JSON.stringify({
        'status': 'false',
        'message': 'wrong',
    }));
    res.end();
}

module.exports = errHandle