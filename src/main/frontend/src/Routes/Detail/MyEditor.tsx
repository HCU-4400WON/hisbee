import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { ContentState, convertToRaw, EditorState } from "draft-js";

import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { useRef, useState } from "react";
import { storage } from "firebase";

export default function MyEditor() {
  const onEditorStateChange = (editorState: any) => {
    // editorState에 값 설정
    setEditorState(editorState);
  };

  const [editorString, setEditorString] = useState("");
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [imageURL, setImageURL] = useState<string>("");
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const onImageChange = async (file: any) => {
    // return new Promise((resolve, reject) => {
    //   resolve({ data: { link: "www.naver.com" } });
    // });
    console.log(file);
    let newImage: any;
    // file.preventDefault();
    // const file = e;
    if (!file) return null;

    const storageRef = ref(storage, `files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    console.log(
      storageRef,
      uploadTask.then((snapshot) => snapshot)
    );

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
      async () => {
        getDownloadURL(storageRef).then((downloadURL) => {
          console.log("File available at", typeof downloadURL);
          setImageURL(downloadURL);

          return new Promise((resolve, reject) => {
            resolve({
              data: {
                link: downloadURL,
              },
            });
          });
        });
      }
    );
  };

  return (
    <Editor
      // 에디터와 툴바 모두에 적용되는 클래스
      wrapperClassName="wrapper-class"
      // 에디터 주변에 적용된 클래스
      editorClassName="editor"
      // 툴바 주위에 적용된 클래스
      toolbarClassName="toolbar-class"
      // 툴바 설정
      toolbar={{
        // inDropdown: 해당 항목과 관련된 항목을 드롭다운으로 나타낼것인지
        list: { inDropdown: true },
        textAlign: { inDropdown: true },
        link: { inDropdown: true },
        history: { inDropdown: false },
        image: {
          uploadCallback: onImageChange,
          previewImage: true,
          alt: { present: true, mandatory: false },
          inputAccept: "image/gif,image/jpeg,image/jpg,image/png,image/svg",
        },
      }}
      placeholder="내용을 작성해주세요."
      // 한국어 설정
      localization={{
        locale: "ko",
      }}
      // 초기값 설정
      editorState={editorState}
      // 에디터의 값이 변경될 때마다 onEditorStateChange 호출
      onEditorStateChange={onEditorStateChange}
    />
  );
}
