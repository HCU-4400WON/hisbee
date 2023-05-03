import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { ReactEventHandler } from "react";
import ReactDOM from "react-dom/client";
import App from "App";
import "styles/style.css";
import { RecoilRoot } from "recoil";

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

let closingWindow = false;

window.addEventListener("focus", function () {
  closingWindow = false;
});

window.addEventListener("blur", function () {
  closingWindow = true;
  if (!document.hidden) {
    closingWindow = false;
  }
  window.addEventListener("resize", function (e) {
    closingWindow = false;
  });
  window.removeEventListener("resize", function (e) {
    closingWindow = false;
  });
});

document.addEventListener("mouseleave", function () {
  closingWindow = true;
});

document.addEventListener("mouseenter", function () {
  closingWindow = false;
});

document.addEventListener("keydown", function (e) {
  if (e.keyCode === 91 || e.keyCode === 18) {
    closingWindow = false;
  }

  if (e.keyCode === 116 || (e.ctrlKey && e.keyCode === 82)) {
    closingWindow = false;
  }
});

document.querySelectorAll("a").forEach(function (link) {
  link.addEventListener("click", function () {
    closingWindow = false;
  });
});

document.querySelectorAll("button").forEach(function (button) {
  button.addEventListener("click", function () {
    closingWindow = false;
  });
});

document.querySelectorAll("form").forEach(function (form) {
  form.addEventListener("submit", function () {
    closingWindow = false;
  });
});

document
  .querySelectorAll('input[type="submit"]')
  .forEach(function (submitButton) {
    submitButton.addEventListener("click", function () {
      closingWindow = false;
    });
  });

function toDoWhenClosing() {
  // Make your logout request here
  // For example, you could use the fetch API:
  // fetch('/logout.php', { method: 'POST', credentials: 'include' });
  // Note: the 'credentials' option is needed if you are using cookies for authentication
  // and want to include them in the request.
}

window.addEventListener("beforeunload", function (e) {
  if (closingWindow) {
    toDoWhenClosing();
  }
});

// require("dotenv").config();

root.render(
  // <React.StrictMode>
  <RecoilRoot>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </RecoilRoot>
  // </React.StrictMode>
);
