import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Button from "@mui/material/Button";
import {
  Card,
  Container,
  ImageList,
  ImageListItem,
  ImageListItemBar,

} from '@mui/material';

export default function Upload() {
  const [images, setImages] = useState<string[]>([]);
  const [file, setFile] = useState<File | undefined>();

  function GetFile(event: React.ChangeEvent<HTMLInputElement>): void {
    const inputFiles = event.target.files;
    const file = inputFiles ? inputFiles[0] : undefined;
    setFile(file);
  }

  function UploadFile() {
    if (!file) throw new Error("Você não colocou um file para ser enviado!");

    const postid = uuidv4();

    const blob = file.slice(0, file.size, file.type);
    const newFile = new File([blob], `${postid}_post.jpeg`, {
      type: file.type,
    });

    const formData = new FormData();
    formData.append("imgfile", newFile);

    fetch("http://localhost:4001/upload", {
      method: "POST",
      body: formData,
      mode: "no-cors",
    })
      .then((res) => res.text())
      .then(() => loadImages());
  }

  // Load the images.
  async function loadImages() {
    const res = await fetch("http://localhost:4001/upload", {
      method: "GET",
    });
    console.log(res);
    const body = await res.json();
    console.log(body);
    const images = body.map(
      (data: any) => "https://storage.googleapis.com/faculdade-asd/" + data.id
    );
    setImages(images);
  }

  useEffect(() => {
    if (images.length == 0) loadImages();
  }, []);

  return (
    <div className="App">
      <h2>Google Storage</h2>
      <input
        type="file"
        name="imgfile"
        accept="*"
        id="imgfile"
        onChange={GetFile}
      />
      <Button variant="contained" onClick={UploadFile}>
        Enviar
      </Button>
      <Container>
      <ImageList gap={12} sx={{mb: 8, gridTemplateColumns:'repeat(auto-fill, minmax(180px, 1fr))!important',}}>
        {images.map((image, index) => (
          <Card key={index}>
            <ImageListItem sx={{ height: '100% !important' }} key={index}>
              <ImageListItemBar
                sx={{background:'linear-gradient(to bottom, rgba(0,0,0,0.7)0%, rgba(0,0,0,0.3)70%, rgba(0,0,0,0)100%)',}} position="top"/>
              <img src={image} key={index} loading="lazy" style={{ cursor: 'pointer' }}/>
            </ImageListItem>
          </Card>
        ))}
      </ImageList>
    </Container>
    </div>
  );
}
