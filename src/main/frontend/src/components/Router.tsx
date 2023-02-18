import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "Routes/Main";
import Post from "Routes/Post";
import Header from "components/Header";
import Login from "Routes/Login";
import SignUp from "Routes/SignUp";
import Person from "Routes/Person";
import PostAddForm from "Routes/PostAddForm";
import Detail from "Routes/Detail";
import Profile from "Routes/Profile";
import SignUpOptional from "Routes/SignUpOptional";

function Router() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Main />}></Route>
        <Route path="post" element={<Post />}></Route>
        <Route path="post/:id" element={<Detail />}></Route>
        <Route path="add" element={<PostAddForm />}></Route>
        <Route path="login" element={<Login />}></Route>
        <Route path="oauth2/redirect" element={<SignUp />}></Route>
        <Route path="person" element={<Person />}></Route>
        <Route path="profile" element={<Profile />}></Route>
        <Route
          path="oauth2/redirect/optional"
          element={<SignUpOptional />}
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
