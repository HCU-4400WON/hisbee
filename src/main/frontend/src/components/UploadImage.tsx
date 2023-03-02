import {
  ref,
  getDownloadURL,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import React, { useRef, useState } from "react";
import { storage } from "../firebase";

const UploadImage = ({ setImage }: { setImage: (p: string) => void }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [imageURL, setImageURL] = useState<string>("");
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const onImageChange = (
    e: React.ChangeEvent<EventTarget & HTMLInputElement>
  ) => {
    e.preventDefault();
    const file = e.target.files;
    if (!file) return null;

    const storageRef = ref(storage, `files/${file[0].name}`);
    const uploadTask = uploadBytesResumable(storageRef, file[0]);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgressPercent(progress);
      },
      (error) => {
        switch (error.code) {
          case "storage/canceld":
            alert("Upload has been canceled");
            break;
        }
      },
      () => {
        e.target.value = "";
        getDownloadURL(storageRef).then((downloadURL) => {
          console.log("File available at", downloadURL);
          setImageURL(downloadURL);
          //   setImage(downloadURL);
        });
      }
    );

    // const uploadTask = uploadBytes(storageRef, file[0]);

    // uploadTask.then((snapshot) => {
    //   e.target.value = "";
    //   getDownloadURL(snapshot.ref).then((downloadURL) => {
    //     console.log("File available at", downloadURL);
    //     setImageURL(downloadURL);
    //     setImage(downloadURL);
    //   });
    // });
  };
};
