/** @format */

const app = require('express')()
const port = process.env.PORT || 8080

const { readdir } = require('fs/promises')
const AsyncQueue = require('./asyncQueue.js')

const http = require('http')
const server = http.createServer(app)
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    },
})

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    next()
})

io.on('connection', (socket) => {
    console.log('a user connected')
    io.emit('code', 'Hello World')
})

const queue = new AsyncQueue()

;(function getFiles(dir = '../codeSharer') {
    readdir(dir, { withFileTypes: true }).then((files) => {
        files.forEach((file) => {
            file.isDirectory() &&
            file.name !== '.git' &&
            file.name !== 'node_modules'
                ? getFiles(dir + '/' + file.name)
                : queue.enqueue(dir + '/' + file.name)
        })
    })
})()
;(async function () {
    for await (const file of queue) {
        /* console.log('>', file) */
    }
})()

app.get('/', (req, res) => {
    res.send('Hello World!')
})

server.listen(port, () => {
    console.log(`Server started on port ${port}`)
})
