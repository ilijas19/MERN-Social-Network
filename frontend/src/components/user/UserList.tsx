import { Link } from "react-router-dom";
import { UserInfo } from "../../types";
import { PROFILE_PICTURE_URL } from "../../redux/constants";

type ListProps = {
  showingUsers: UserInfo[] | [];
};
const UserList = ({ showingUsers }: ListProps) => {
  return (
    <ul className="">
      {showingUsers.map((user) => (
        <Link
          to={`/profile/${user.username}`}
          key={user._id}
          className="flex items-center  py-3 px-3  gap-3 border-b border-gray-700 hover:bg-gray-700"
        >
          <img
            src={
              user?.profilePicture === ""
                ? PROFILE_PICTURE_URL
                : user?.profilePicture
            }
            alt=""
            className="size-12 rounded-full object-cover"
          />
          <p className="font-semibold">{user.username}</p>
        </Link>
      ))}
    </ul>
  );
};
export default UserList;
