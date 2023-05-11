import { useCallback, useRef, useState } from "react";
import {
  ref,
  getDownloadURL,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import { storage } from "../../../firebase";

interface IProps {
  imageURLList: string[] | [];
  setImageURLList: React.Dispatch<React.SetStateAction<string[] | []>>;
}

export function ImageUpload({ imageURLList, setImageURLList }: IProps) {
  for (let i = 0; i < imageURLList.length; ++i) {
    [0, 1, 2].pop();
  }

  const [posterUploadList, setPosterUploadList] = useState<number[]>(() => {
    let arr = [0, 1, 2];
    for (let i = 0; i < imageURLList.length; ++i) {
      arr.pop();
    }
    return arr;
  });
  const [imageURL, setImageURL] = useState<string>("");

  const inputRef = useRef<HTMLInputElement | null>(null);
  const onUploadImageButtonClick = useCallback(() => {
    if (!inputRef.current) {
      return;
    }

    inputRef.current.click();
  }, []);

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
          // console.log("File available at", downloadURL);
          setImageURL(downloadURL);
          setImageURLList((prev) => [...prev, downloadURL]);
          setPosterUploadList((prev) => [...prev.slice(0, prev.length - 1)]);
        });
      }
    );
  };

  return (
    <>
      <input
        className="hidden"
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={onImageChange}
      />
      <div className="flex">
        {imageURLList?.map((imageUrl: string, index: number) => (
          <div className="relative flex justify-start gap-x-[30px] mt-[30px] mr-[30px]">
            <img className="w-[300px]" src={imageUrl} key={index} />
            <button
              type="button"
              className="absolute right-0 top-0"
              onClick={() => {
                setImageURLList((prev) => [
                  ...prev.slice(0, index),
                  ...prev.slice(index + 1),
                ]);
                setPosterUploadList((prev) => [...prev, prev.length]);
              }}
            >
              <i className="fa-solid fa-square-xmark text-[30px] text-gray-700 opacity-50"></i>
            </button>
          </div>
        ))}

        {posterUploadList.map((posterUploadBox, index) => (
          <div
            key={index}
            onClick={onUploadImageButtonClick}
            className="mr-[30px] w-[100px] h-[100px] border border-black mt-[30px] flex justify-center items-center rounded-xl"
          >
            <i className="fa-solid fa-plus text-black text-[30px] "></i>
          </div>
        ))}
      </div>
    </>
  );
}
