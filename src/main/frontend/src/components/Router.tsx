import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "Routes/Main/Main";
import Post from "Routes/Post/Post";
import Header from "components/Header";

function Router() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Main />}></Route>
        <Route path="post" element={<Post />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
