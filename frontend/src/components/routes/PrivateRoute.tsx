import { useEffect } from "react";
import { useGetCurrentUserQuery } from "../../redux/api/authApiSlice";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../../redux/features/auth/authSlice";
import Loader from "../Loader";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const { data: currentUser, isLoading } = useGetCurrentUserQuery();
  const dispatch = useDispatch();

  useEffect(() => {
    if (currentUser) {
      dispatch(setCurrentUser(currentUser.currentUser));
    }
  }, [currentUser]);

  // useEffect(() => {
  //   refetch();
  // }, []);

  if (isLoading) {
    return <Loader />;
  }

  if (!currentUser) {
    return <Navigate to={"/login"} replace />;
  }

  if (currentUser) {
    return (
      <section>
        <Outlet />
      </section>
    );
  }
};
export default PrivateRoute;
