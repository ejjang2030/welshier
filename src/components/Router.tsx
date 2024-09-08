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
import ResetPasswordPage from "pages/users/resetpassword";

interface RouterProps {
  isAuthenticated: boolean;
}

const Router = ({isAuthenticated}: RouterProps) => {
  return (
    <Routes>
      {isAuthenticated ? (
        <>
          <Route
            path='/'
            element={<HomePage />}
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
        </>
      ) : (
        <>
          <Route
            path='/users/reset-password'
            element={<ResetPasswordPage />}
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
            path='*'
            element={
              <Navigate
                replace
                to='/users/login'
              />
            }
          />
        </>
      )}
    </Routes>
  );
};

export default Router;
