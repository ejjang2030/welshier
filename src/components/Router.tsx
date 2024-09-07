import {Routes, Route, Navigate} from "react-router-dom";
import HomePage from "pages/home";
import PostListPage from "pages/posts";
import PostDetailPage from "pages/posts/detail";
import PostNewPage from "pages/posts/new";
import PostEditPage from "pages/posts/edit";
import ProfilePage from "pages/profile";
import ProfileEditPage from "pages/profile/edit";
import NotificationPage from "pages/notifications";
import SearchPage from "pages/search";
import LoginPage from "pages/users/login";
import SignupPage from "pages/users/signup";

const Router = () => {
  return (
    <Routes>
      <Route
        path='/'
        element={<HomePage user={{uid: "112121"}} />}
      />
      <Route
        path='/posts'
        element={<PostListPage />}
      />
      <Route
        path='/posts/:id'
        element={<PostDetailPage />}
      />
      <Route
        path='/posts/new'
        element={<PostNewPage />}
      />
      <Route
        path='/posts/edit/:id'
        element={<PostEditPage />}
      />
      <Route
        path='/profile'
        element={<ProfilePage />}
      />
      <Route
        path='/profile/edit'
        element={<ProfileEditPage />}
      />
      <Route
        path='/notifications'
        element={<NotificationPage />}
      />
      <Route
        path='/search'
        element={<SearchPage />}
      />
      <Route
        path='/users/login'
        element={<LoginPage />}
      />
      <Route
        path='/users/signup'
        element={<SignupPage />}
      />
      <Route
        path='/feeds/:uid'
        element={<h1>feeds</h1>}
      />
      <Route
        path='*'
        element={
          <Navigate
            replace
            to='/'
          />
        }
      />
    </Routes>
  );
};

export default Router;
