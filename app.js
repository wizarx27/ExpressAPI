import express from "express"
import fs from "fs"
import multer from "multer"

const app = express()
const port = 3000
import {v4 as uuidv4} from 'uuid';
const dataPath = "data.json"
const upload = multer()

app.use('/public',express.static('public'))
app.use(express.urlencoded())
app.use(express.json())

app.get('/singer', (req, res) => {
    const data = fs.readFileSync(dataPath,'utf-8')
    res.set("Content-type","application/json")
    res.status(200).send(JSON.parse(data))
})

app.get('/singer/:singerId', (req, res) => {
    const { singerId } = req.params
    res.send(singerId)
})

app.post('/singer/add',upload.single("singer_img"),(req,res)=>{
    console.log(req.file)
    const dataRaw = fs.readFileSync(dataPath,'utf-8')
    const oldData = JSON.parse(dataRaw)
    let newData = JSON.parse(req.body.jsonData)

    let newId = uuidv4()
    let img_path = "public/"+newId+".png"
    newData["id"] = newId
    newData["img_path"] = img_path
    fs.writeFileSync(img_path,req.file.buffer)
    oldData.push(newData)
    fs.writeFileSync(dataPath,JSON.stringify(oldData,null,4))
    res.send(oldData)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})