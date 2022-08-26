/** @format */

const app = require('express')()
const port = process.env.PORT || 3000
const { resolve } = require('path')
const { readdir } = require('fs/promises')

/* async function* getFiles(dir) { */
/* const dirents = await readdir(dir, { withFileTypes: true }) */
/* for (const dirent of dirents) { */
/*     /1* const res = resolve(dir, dirent.name) *1/ */
/*     const res = dir + '/' + dirent.name */
/*     if (dirent.isDirectory() && dirent.name !== '.git') { */
/*         yield* getFiles(res) */
/*     } else { */
/*         yield res */
/*     } */
/* } */
/* } */

//asynchronous for/await loop
async function getFiles(dir, arr) {
    const dirents = await readdir(dir, { withFileTypes: true })
    for await (const dirent of dirents) {
        const res = resolve(dir, dirent.name)
        if (dirent.isDirectory() && dirent.name !== '.git') {
            arr.push(res)
            await getFiles(res, arr)
        } else {
            arr.push(res)
        }
    }
    return arr
}
;(async function () {
    console.log(await getFiles('../codeSharer/', []))
})()

/* ;(async () => { */
/*     for await (const f of getFiles('../codeSharer')) { */
/*         console.log(f) */
/*     } */
/* })() */

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})
