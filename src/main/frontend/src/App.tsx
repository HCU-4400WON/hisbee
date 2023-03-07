import "./fonts/fonts.css";

import Router from "components/Router";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect, useState } from "react";
function App() {
  // const [closingWindow, setClosingWindow] = useState(false);

  // useEffect(() => {
  //   function handleFocus() {
  //     setClosingWindow(false);
  //   }

  //   function handleBlur() {
  //     setClosingWindow(true);
  //     // if (!document.hidden) {
  //     //   setClosingWindow(false);
  //     // }
  //     // if (document.visibilityState === "visible") {
  //     //   setClosingWindow(false);
  //     // }
  //   }

  //   function handleResize() {
  //     setClosingWindow(false);
  //   }

  //   function handleMouseLeave() {
  //     // setClosingWindow(true);
  //   }

  //   function handleMouseEnter() {
  //     setClosingWindow(false);
  //   }

  //   function handleKeyDown(event: any) {
  //     if (event.keyCode === 91 || event.keyCode === 18) {
  //       console.log(event.keyCode);
  //       setClosingWindow(false); // shortcuts for ALT+TAB and Window key
  //     }
  //     if (event.keyCode === 116 || (event.ctrlKey && event.keyCode === 82)) {
  //       console.log(event.keyCode);
  //       setClosingWindow(false); // shortcuts for F5 and CTRL+F5 and CTRL+R
  //     }
  //   }

  //   window.addEventListener("focus", handleFocus);
  //   window.addEventListener("blur", handleBlur);
  //   window.addEventListener("resize", handleResize);
  //   document
  //     .getElementsByTagName("html")[0]
  //     .addEventListener("mouseleave", handleMouseLeave);
  //   document
  //     .getElementsByTagName("html")[0]
  //     .addEventListener("mouseenter", handleMouseEnter);
  //   document.addEventListener("keydown", handleKeyDown);

  //   // cleanup
  //   return () => {
  //     window.removeEventListener("focus", handleFocus);
  //     window.removeEventListener("blur", handleBlur);
  //     window.removeEventListener("resize", handleResize);
  //     document
  //       .getElementsByTagName("html")[0]
  //       .removeEventListener("mouseleave", handleMouseLeave);
  //     document
  //       .getElementsByTagName("html")[0]
  //       .removeEventListener("mouseenter", handleMouseEnter);
  //     document.removeEventListener("keydown", handleKeyDown);
  //   };
  // }, []);

  // function toDoWhenClosing() {
  //   // Do whatever you want to do before closing the window
  //   // console.log("Window is closing...");
  //   localStorage.removeItem("key");
  // }

  // function handleBeforeUnload(event: any) {
  //   console.log("total", closingWindow);
  //   if (closingWindow) {
  //     toDoWhenClosing();
  //   }
  //   event.preventDefault();
  //   event.returnValue = "";
  // }
  // window.addEventListener("beforeunload", handleBeforeUnload, { once: true });

  // useEffect(() => {
  //   console.log(closingWindow);
  // }, [closingWindow]);
  return (
    <>
      <Router />
      <ReactQueryDevtools initialIsOpen={true} />
    </>
  );
}

export default App;
