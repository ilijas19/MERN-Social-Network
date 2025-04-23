import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Navigation from "./pages/layout/Navigation";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";

const App = () => {
  const { currentUser } = useSelector((state: RootState) => state.auth);

  return (
    <div className="min-h-screen flex max-w-[1050px] mx-auto">
      <ToastContainer />
      {currentUser && <Navigation />}
      <main
        className={`${
          currentUser ? "sm:ml-56 ml-0 w-full" : "w-full"
        } border-r border-gray-700  `}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default App;
