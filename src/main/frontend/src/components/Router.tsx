import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "Routes/Main";
import Post from "Routes/Post";
import Header from "components/Header";
import Login from "Routes/Login";
import SignUp from "Routes/SignUp";

function Router() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Main />}></Route>
        <Route path="post" element={<Post />}></Route>
        <Route path="login" element={<Login />}></Route>
        <Route path="signup" element={<SignUp />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
