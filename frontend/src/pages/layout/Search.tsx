import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useSearchForUserQuery } from "../../redux/api/usersApiSlice";
import Loader from "../../components/Loader";
import { isApiError } from "../../utils/isApiError";
import SearchedUserEl from "../../components/user/SearchedUserEl";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { UserInfo } from "../../types";

const Search = () => {
  const [inputValue, setInputValue] = useState("");
  const [page, setPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showingUsers, setShowingUsers] = useState<UserInfo[]>([]);

  const { currentUser } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const {
    data: users,
    isLoading: usersLoading,
    error: usersError,
    refetch: refetchUsers,
  } = useSearchForUserQuery(
    { username: searchQuery, page },
    { skip: searchQuery === "" }
  );

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault(); // prevent form reload
    setPage(1); // reset page
    setShowingUsers([]); // clear old results
    setSearchQuery(inputValue); // trigger new search
  };

  const openUser = (username: string) => {
    navigate(`/profile/${username}`);
  };

  const handleShowMore = () => {
    setPage((prev) => prev + 1);
  };

  useEffect(() => {
    if (!users) return;

    setShowingUsers((prevUsers) => {
      if (page === 1) return users.users;

      const existingIds = new Set(prevUsers.map((u) => u._id));
      const newUniqueUsers = users.users.filter((u) => !existingIds.has(u._id));
      return [...prevUsers, ...newUniqueUsers];
    });
  }, [users, page]);

  if (usersLoading) return <Loader />;

  if (usersError) {
    if (isApiError(usersError)) {
      return <h2>{usersError.data.msg}</h2>;
    } else {
      return <h2>Something Went Wrong</h2>;
    }
  }

  return (
    <section>
      <form
        onSubmit={handleSearch}
        className="flex items-center gap-3 p-3 border-b border-b-gray-600"
      >
        <IoArrowBack size={20} onClick={() => navigate(-1)} />
        <h2 className="font-semibold text-lg">Search For User</h2>
      </form>

      <div className="flex items-center border border-gray-600 m-4 px-3 overflow-hidden rounded-lg gap-3 pr-0">
        <FaSearch size={20} />
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          type="text"
          placeholder="Search"
          className="outline-none grow"
        />
        <button
          type="submit"
          onClick={handleSearch}
          className={`font-semibold h-full py-2 px-3 transition-colors duration-200 ${
            inputValue !== ""
              ? "bg-emerald-600 text-white hover:bg-emerald-700"
              : "bg-gray-700 text-gray-400 cursor-not-allowed"
          }`}
          disabled={inputValue === ""}
        >
          Search
        </button>
      </div>

      {users?.users.length === 0 && (
        <h2 className="text-center text-gray-300">No Users Found</h2>
      )}
      {users && users.users.length > 0 && (
        <h2 className="text-center text-gray-300">
          Users Found ({users.totalResults})
        </h2>
      )}

      <ul className="border-t border-gray-700 mt-2">
        {showingUsers.map((user) => (
          <SearchedUserEl
            openUser={openUser}
            key={user._id}
            user={user}
            currentUserId={currentUser!.userId}
            refetchUsers={refetchUsers}
          />
        ))}
      </ul>

      {users?.nextPage && (
        <div className="flex justify-center mt-5">
          <button
            onClick={handleShowMore}
            className="text-emerald-600 font-semibold cursor-pointer"
          >
            Show More
          </button>
        </div>
      )}
    </section>
  );
};

export default Search;
