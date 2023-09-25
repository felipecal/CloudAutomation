import express from "express";
import path from "path";
import { Storage } from "@google-cloud/storage";
import Multer from "multer";
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();

const src = path.join(__dirname, "views");

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

const projectId = process.env.PROJECTID;
const keyFilename = process.env.KEYFILENAME || "./mykey.json"; 
const storage = new Storage({
  projectId,
  keyFilename,
});
const bucket = storage.bucket("faculdade-asd");

app.use(express.static(src));

app.get("/upload", async (req, res) => {
  try {
    const [files] = await bucket.getFiles();
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.send(files);
    console.log("Get File with Success");
  } catch (error) {
    res.status(500).send(`Error: ${error}`);
  }
});

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
    } else {
      throw new Error("An error occurred while uploading the image.");
    }
  } catch (error) {
    res.status(500).send(`Error: ${error.message}`);
  }
});

const port = process.env.PORT || 3000; 
app.listen(port, () => {
  console.log(`🔥 Server ready at http://localhost:${port}`);
});
