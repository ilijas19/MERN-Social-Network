import {
  HomeIcon,
  MagnifyingGlassIcon,
  UserIcon,
  BellIcon,
  EnvelopeIcon,
  BookmarkIcon,
} from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { CurrentUser } from "../../types";

type NavProps = {
  currentUser: CurrentUser | null;
};

const Navigation = ({ currentUser }: NavProps) => {
  const navItems = [
    { icon: HomeIcon, label: "Home", path: "/" },
    { icon: MagnifyingGlassIcon, label: "Search", path: "/search" },
    { icon: BellIcon, label: "Notifications", path: "/notifications" },
    { icon: EnvelopeIcon, label: "Messages", path: "/messages" },
    { icon: BookmarkIcon, label: "Bookmarks", path: "/bookmarks" },
    { icon: UserIcon, label: "Profile", path: "/myProfile" },
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
              <item.icon className="sm:h-7 sm:w-7 h-6 w-6 text-gray-300 group-hover:text-emerald-500" />
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
