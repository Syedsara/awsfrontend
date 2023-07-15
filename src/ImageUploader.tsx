// const S3_BUCKET_NAME = "react-demo2";

// const REGION = "ap-southeast-2r";



import React, { useState } from "react";

import AWS from "aws-sdk";

const S3Uploader: React.FC = () => {

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {

    const file = event.target.files && event.target.files[0];

    setSelectedFile(file || null);

  };

  const handleUpload = () => {

    if (!selectedFile) return;

    const s3 = new AWS.S3({

      accessKeyId: "AKIARDJ5HQT3R3IHDDFN",

      secretAccessKey: "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",

      region: "us-east-1",

    });

    const uploadParams = {

      Bucket: "newhealthcareapp",

      Key: selectedFile.name,

      Body: selectedFile,

    };

    s3.upload(

      uploadParams,

      (err: Error, data: AWS.S3.ManagedUpload.SendData) => {

        if (err) {

          console.error("Error uploading file:", err);

        } else {

          console.log("File uploaded successfully. Location:", data.Location);

        }

      }

    );

  };




  return (

    <div>

      <input type="file" onChange={handleFileChange} />

      <button onClick={handleUpload}>Upload</button>

    </div>

  );

};




export default S3Uploader;