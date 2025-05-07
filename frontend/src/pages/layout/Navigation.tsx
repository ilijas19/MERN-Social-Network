import { Link, useNavigate } from "react-router-dom";
import { CurrentUser } from "../../types";
import { FaHome } from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoIosNotificationsOutline } from "react-icons/io";
import { MdOutlineMessage } from "react-icons/md";
import { FaRegBookmark } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa";

type NavProps = {
  currentUser: CurrentUser | null;
};

const Navigation = ({ currentUser }: NavProps) => {
  const navItems = [
    { icon: FaHome, label: "Home", path: "/" },
    { icon: FaMagnifyingGlass, label: "Search", path: "/search" },
    {
      icon: IoIosNotificationsOutline,
      label: "Notifications",
      path: "/notifications",
    },
    { icon: MdOutlineMessage, label: "Messages", path: "/messages" },
    { icon: FaRegBookmark, label: "Bookmarks", path: "/bookmarks" },
    { icon: FaRegUser, label: "Profile", path: "/myProfile" },
  ];

  const navigate = useNavigate();

  return (
    <aside className="fixed border-r border-gray-700 bottom-0 sm:top-0 sm:right-auto right-0 sm:left-auto left-0 sm:w-56 w-full sm:bg-gray-800 bg-gray-700 sm:px-2 flex flex-col">
      <ul className="flex sm:flex-col flex-row sm:mt-6 sm:justify-normal justify-around gap-2">
        {navItems.map((item, index) => (
          <li key={index} className="group sm:py-0 py-2">
            <Link
              to={item.path}
              className="sm:p-3 sm:flex sm:items-center sm:gap-2"
            >
              <item.icon className=" h-6 w-6 text-gray-300 group-hover:text-emerald-500" />
              <p className="text-gray-300 font-semibold sm:inline hidden group-hover:text-emerald-500">
                {item.label}
              </p>
            </Link>
          </li>
        ))}
      </ul>
      <div
        className="mt-auto not-sm:hidden mb-4 ml-5 flex gap-2 items-center hover:bg-gray-700 rounded p-2 py-1 cursor-pointer"
        onClick={() => navigate("myProfile")}
      >
        <p className="text-white ">{currentUser?.username}</p>
      </div>
    </aside>
  );
};

export default Navigation;
