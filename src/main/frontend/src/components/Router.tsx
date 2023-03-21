import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "Routes/Main/Main";
import Post from "Routes/Post/Post";
import Header from "components/Header";
import Login from "components/LoginModal";
import SignUp from "Routes/Main/SignUp";
import Person from "Routes/Person/Person";
import PostAddForm from "Routes/PostAddForm/PostAddForm";
import Detail from "Routes/Detail/Detail";
import Profile from "Routes/Profile/Profile";
import SignUpOptional from "Routes/Main/SignUpOptional";
import LoadingAnimation from "./LoadingAnimation";
import Slider from "./Slider";
import Footer from "./Footer";
import BlankPage from "Routes/BlankPage/BlankPage";
import PrivateRoute from "./PrivateRoute";

function Router() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {/* <Route path="editor" element={<TextEditor />}></Route> */}
        <Route path="/" element={<Main />}></Route>
        <Route path="post" element={<Post />}></Route>
        <Route path="oauth2/redirect" element={<BlankPage />}></Route>
        <Route path="post/:id" element={<Detail />}></Route>
        <Route
          path="add"
          element={<PrivateRoute component={<PostAddForm />} />}
        ></Route>
        <Route
          path="signUp"
          element={<PrivateRoute component={<SignUp />} />}
        ></Route>
        <Route
          path="person"
          element={<PrivateRoute component={<Person />} />}
        ></Route>
        <Route
          path="profile"
          element={<PrivateRoute component={<Profile />} />}
        ></Route>
        <Route
          path="oauth2/redirect/optional"
          element={<PrivateRoute component={<SignUpOptional />} />}
        ></Route>

        <Route
          path="/loading"
          element={<PrivateRoute component={<LoadingAnimation />} />}
        ></Route>
        <Route
          path="/slider"
          element={<PrivateRoute component={<Slider />} />}
        ></Route>
        <Route
          path="/footer"
          element={<PrivateRoute component={<Footer />} />}
        ></Route>
        <Route path="*" element={<Main />}></Route>

        {/* <Route path="post/:id" element={<Detail />}></Route>
        <Route path="add" element={<PostAddForm />}></Route>
        <Route path="login" element={<Login />}></Route>
       
        <Route path="signUp" element={<SignUp />}></Route>
        <Route path="person" element={<Person />}></Route>
        <Route path="profile" element={<Profile />}></Route>
        <Route
          path="oauth2/redirect/optional"
          element={<SignUpOptional />}
        ></Route>
        <Route path="/loading" element={<LoadingAnimation />}></Route>
        <Route path="/slider" element={<Slider />}></Route>
        <Route path="/footer" element={<Footer />}></Route>
        <Route path="*" element={<Main />}></Route> */}
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default Router;
