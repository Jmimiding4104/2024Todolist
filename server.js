const http = require('http');
const { v4: uuidv4 } = require('uuid');
const headers = require('./headers');
const errHandle = require('./errHandle');
const successHandle = require('./succesHandle')

const todos = [];

const requsetListerener = (req, res) => {
    let body = "";
    req.on('data', chuck => {
        body += chuck
    })
    if (req.url == '/todos' && req.method == 'GET') {
        successHandle(res, todos);
    } else if (req.method == 'OPTIONS') {
        res.writeHead(200, headers);
        res.end();
    } else if (req.url == '/todos' && req.method == 'POST') {
        req.on('end', () => {
            try {
                const title = JSON.parse(body).title;
                if (title !== undefined) {
                    const todo = {
                        'title': title,
                        'id': uuidv4()
                    }
                    todos.push(todo);
                    successHandle(res, todos);
                } else {
                    errHandle(res)
                }
            } catch (err) {
                errHandle(res)
            }
        })
    } else if (req.url.startsWith('/todos/') && req.method == 'PATCH') {
        req.on('end', () => {
            try {
                const id = req.url.split('/').pop();
                const index = todos.findIndex(e => e.id == id);
                const title = JSON.parse(body).title;
                if (index !== -1 && title !== undefined) {
                    todos[index].title = title;
                    successHandle(res, todos);
                } else {
                    errHandle(res);
                }
            } catch (err) {
                errHandle(res);
            };
        });
    } else if (req.url == '/todos' && req.method == 'DELETE') {
        todos.length = 0;
        successHandle(res, todos);
    } else if (req.url.startsWith('/todos/') && req.method == 'DELETE') {
        const id = req.url.split('/').pop();
        const index = todos.findIndex(e => e.id == id);
        if (index !== -1) {
            todos.splice(index, 1)
            successHandle(res, todos);
        } else {
            errHandle(res);
        };
    } else {
        res.writeHead(404, headers);
        res.write(JSON.stringify({
            'status': 'false',
            'message': 'Not Found',
        }));
        res.end();
    }
}

const server = http.createServer(requsetListerener);
server.listen(3005);