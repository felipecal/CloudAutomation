import React, { useEffect, useState } from "react";
import Button from "../../components/Button";
import { v4 as uuidv4 } from "uuid";

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
    if (images.length==0) loadImages();
  },[]);


  return (
    <div className="App">
      <h2>Google Storage API</h2>
      <input
        type="file"
        name="imgfile"
        accept="*"
        id="imgfile"
        onChange={GetFile}
      />
      <Button onClick={UploadFile}>Enviar</Button>
      <div className="" id="images">
        {images.map((image, index) => (
          <img src={image} key={index} />
        ))}
      </div>
    </div>
  );
}
