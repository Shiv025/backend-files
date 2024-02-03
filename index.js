const express = require("express");
const mongoose = require("mongoose");
const mediaModel = require("./mediaModel.js")
const dotenv = require("dotenv");
const cors = require('cors');
const multer = require('multer');
dotenv.config();

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, "./uploads")
    },
    filename: function (req, file, cb) {
        return cb(null, `${Date.now()}.${(file.originalname).split('.').pop()}`)
    }
})



const upload = multer({ storage: storage })


app.get('/', (req, res) => {
    res.status(200).send({
        status: true,
        message: 'all good!'
    })
})

app.post('/uploads', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        const { title } = req.body;

        if (!title) return res.status(400).send({ status: false, message: "Title is mandatory" });
        if (!file) return res.status(400).send({ status: false, message: "Media is mandatory" });

        const fileName = file.filename;
        const filePath = `/uploads/${fileName}`;
        await mediaModel.create({ title: title, mediaName: fileName, mediaPath: filePath });

        res.status(201).send({ status: true, message: "Upload successfully" });
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
})


app.get('/getMedia', async (req, res) => {
    try {

        const getMedia = await mediaModel.find({ isDeleted: false });
        if (getMedia.length === 0) return res.status(404).send({ status: false, message: "No Media" })

        res.status(200).send({ status: true, message: "Fetched all media", data: getMedia });
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
})


app.delete('/deleteMedia', async (req, res) => {
    try {
        const { mediaId } = req.body;

        if (!mediaId) return res.status(400).send({ status: false, message: "Media ID is mandatory" });

        const deleteMedia = await mediaModel.findByIdAndUpdate({ _id: mediaId, isDeleted: false }, { isDeleted: true });
        if (!deleteMedia) return res.status(404).send({ status: false, message: "Media doesn't exist" })

        res.status(200).send({ status: true, message: "Media deleted successfully" });
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
})



app.listen(process.env.PORT, () => {
    mongoose.connect(process.env.MONGODB_URL)
        .then(() => {
            console.log('db connected')
            console.log(`server is running at ${process.env.PORT}`)
        })
        .catch(error => console.log(error))
})