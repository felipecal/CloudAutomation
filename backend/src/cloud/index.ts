import express from "express";
const app = express();
import path from "path";
import { Storage } from "@google-cloud/storage";
import Multer from "multer";
const src = path.join(__dirname, "views");
import * as dotenv from 'dotenv' 
dotenv.config()
app.use(express.static(src));

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // Tamanho de 5mb deifinido no file
  },
});

let projectId = process.env.PROJECTID; 
let keyFilename = "./mykey.json";
const storage = new Storage({
  projectId,
  keyFilename,
});
const bucket = storage.bucket("faculdade-asd"); 

// Gets all files in the defined bucket
app.get("/upload", async (req, res) => {
  try {
    const [files] = await bucket.getFiles();
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.send(files);
    console.log("Get File with Success");
  } catch (error) {
    res.send("Error:" + error);
  }
});

// Streams file upload to Google Storage
app.post("/upload", multer.single("imgfile"), (req, res) => {
  console.log("Made it /upload");
  try {
    if (req.file) {
      console.log("File found, trying to upload...");
      const blob = bucket.file(req.file.originalname);
      const blobStream = blob.createWriteStream();

      blobStream.on("finish", () => {
        res.status(200).send("Send File with Success");
        console.log("Send with Success");
      });
      blobStream.end(req.file.buffer);
    } else throw "Happen some error uploading the image.";
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(process.env.PORT, () => {
  console.log(`🔥 Server ready at ${process.env.PORT}`);
});
