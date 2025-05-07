import { IoMdClose } from "react-icons/io";
import { PROFILE_PICTURE_URL } from "../../redux/constants";
import { useSearchForUserQuery } from "../../redux/api/usersApiSlice";
import Loader from "../Loader";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

type StartChatProps = {
  onClose: () => void;
  handleChatStart: (userId: string) => Promise<void>;
};

const StartChat = ({ onClose, handleChatStart }: StartChatProps) => {
  const { currentUser } = useSelector((state: RootState) => state.auth);

  const [searchQuery, setSearchQuery] = useState<string>(" ");
  const [inputValue, setInputValue] = useState<string>("");

  const { data: users, isLoading: usersLoading } = useSearchForUserQuery({
    username: searchQuery,
    page: 1,
  });

  const handleSearch = () => {
    setSearchQuery(inputValue);
  };

  return (
    <section
      onClick={(e) => e.stopPropagation()}
      className=" bg-gray-800   max-w-[600px] w-full m-4 rounded-xl relative flex flex-col"
    >
      {/* header */}
      <h2 className="text-center font-semibold py-2 text-xl">New Message</h2>
      <IoMdClose
        onClick={onClose}
        size={24}
        className="absolute top-3 right-3 cursor-pointer"
      />

      {/* search */}
      <div
        className="flex border border-gray-600 mb-2 mt-1 mx-4 rounded-xl px-3 pr-0  focus-within:border-emerald-600 overflow-hidden  
      "
      >
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          type="text"
          className="grow outline-none h-full py-2.5 "
          placeholder="Search For User"
        />
        <button
          onClick={handleSearch}
          className="bg-emerald-700 flex items-center gap-1 px-3 cursor-pointer"
        >
          <p>Search</p>
        </button>
      </div>

      <p className="ml-2 text-emerald-600 font-medium">Users</p>

      {usersLoading && <Loader />}
      <ul className="border-t border-gray-700 overflow-y-scroll h-full custom-scrollbar">
        {users?.users.map(
          (user) =>
            user.username !== currentUser?.username && (
              <li
                onClick={() => handleChatStart(user._id)}
                key={user._id}
                className="border-b border-gray-700 px-3 py-2 flex items-center gap-3 font-semibold hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <img
                  src={
                    user?.profilePicture === ""
                      ? PROFILE_PICTURE_URL
                      : user?.profilePicture
                  }
                  className="w-11 h-11 rounded-full shadow object-cover "
                />
                <p>{user.username}</p>
              </li>
            )
        )}
      </ul>
    </section>
  );
};
export default StartChat;
