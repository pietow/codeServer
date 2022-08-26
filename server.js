/** @format */

const app = require('express')()
const port = process.env.PORT || 3000
const { resolve } = require('path')
const { readdir } = require('fs/promises')
const AsyncQueue = require('./asyncQueue.js')

const queue = new AsyncQueue()

function getFiles(dir) {
    readdir(dir, { withFileTypes: true }).then((files) => {
        files.forEach((file) => {
            queue.enqueue(dir + '/' + file.name)
            file.isDirectory() &&
                file.name !== '.git' &&
                getFiles(dir + '/' + file.name)
        })
    })
}

getFiles('../codeSharer')
;(async function () {
    for await (const file of queue) {
        console.log('>', file)
    }
})()

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})
