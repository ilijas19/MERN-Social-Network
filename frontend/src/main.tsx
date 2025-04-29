import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store.ts";
import Login from "./pages/auth/Login.tsx";
import Register from "./pages/auth/Register.tsx";
import PrivateRoute from "./components/routes/PrivateRoute.tsx";
import Home from "./pages/layout/Home.tsx";
import Bookmarks from "./pages/user/Bookmarks.tsx";
import Profile from "./pages/user/Profile.tsx";
import FollowList from "./pages/user/FollowList.tsx";
import UserProfile from "./pages/user/UserProfile.tsx";
import PostPage from "./pages/user/PostPage.tsx";
import Search from "./pages/layout/Search.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />

      <Route path="/" element={<PrivateRoute />}>
        <Route index element={<Home />} />
        <Route path="bookmarks" element={<Bookmarks />} />
        <Route path="myProfile" element={<Profile />} />
        <Route path="followList/:user/:list" element={<FollowList />} />
        <Route path="profile/:username" element={<UserProfile />} />
        <Route path="post/:id" element={<PostPage />} />
        <Route path="search" element={<Search />} />
      </Route>

      <Route path="*" element={<div className="text-red-500">Error</div>} />
    </Route>
  )
);

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  </Provider>
);
