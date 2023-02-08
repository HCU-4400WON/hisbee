import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "Routes/Main/Main";
import Post from "Routes/Post/Post";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />}></Route>
        <Route path="post" element={<Post />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
