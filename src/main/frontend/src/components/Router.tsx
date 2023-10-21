import { BrowserRouter, Route, Routes } from "react-router-dom";
import Post from "Routes/Post/Post";
import Header from "components/Header";
import SignUp2 from "Routes/Main/SignUp2";
import SignUpOptional from "Routes/Main/SignUpOptional";
import Footer from "./Footer";
import BlankPage from "Routes/BlankPage/BlankPage";
import PrivateRoute from "./PrivateRoute";
import PostAddForm2 from "Routes/PostAddForm/PostAddForm2";
import Detail2 from "Routes/Detail/Detail2";
import Profile2 from "Routes/Profile/Profile2";
function Router() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {/* <Route path="editor" element={<TextEditor />}></Route> */}
        <Route path="/" element={<Post />}></Route>
        <Route path="post" element={<Post />}></Route>
        <Route path="oauth2/redirect" element={<BlankPage />}></Route>
        <Route path="post/:id" element={<Detail2 />}></Route>
        <Route
          path="add"
          element={<PrivateRoute component={<PostAddForm2 />} />}
        ></Route>
        {/* <Route
          path="signUp"
          element={<PrivateRoute component={<SignUp />} />}
        ></Route> */}
        {/* <Route
          path="person"
          element={<PrivateRoute component={<Person />} />}
        ></Route> */}
        <Route
          path="profile"
          element={<PrivateRoute component={<Profile2 />} />}
        ></Route>
        <Route
          path="oauth2/redirect/optional"
          element={<PrivateRoute component={<SignUpOptional />} />}
        ></Route>

        {/* <Route
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
        ></Route> */}
        {/* <Route
          path="add2"
          element={<PrivateRoute component={<PostAddForm2 />} />}
        ></Route> */}

        {/* <Route path="add2" element={<PostAddForm2 />}></Route> */}
        {/* <Route path="post2/:id" element={<Detail2 />}></Route> */}
        <Route
          path="modify/:id"
          element={<PrivateRoute component={<PostAddForm2 />} />}
        ></Route>
        <Route path="signUp" element={<SignUp2 />}></Route>
        {/* <Route path="profile2" element={<Profile2 />}></Route> */}

        <Route path="*" element={<Post />}></Route>

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
