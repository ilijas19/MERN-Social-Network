import { PROFILE_PICTURE_URL } from "../../redux/constants";
import { Notification as NotificationObj } from "../../types";
import { formatTimeAgo } from "../../utils/FormatTimeAgo";

type NotificationProps = {
  notification: NotificationObj;
};

const Notification = ({ notification }: NotificationProps) => {
  return (
    <li className="flex gap-3 items-center py-3 px-2 hover:bg-gray-600 cursor-pointer border-b border-gray-600 relative">
      {/* image */}
      <img
        src={
          notification.from.profilePicture === ""
            ? PROFILE_PICTURE_URL
            : notification.from.profilePicture
        }
        alt=""
        className="h-12 w-12 rounded-full"
      />
      {/* text-div */}
      <div className="flex flex-col">
        <h3 className="font-semibold ">{notification.from.username}</h3>
        <p className="text-sm text-gray-400">{notification.text}</p>
        <p className="text-sm text-gray-300 absolute right-4 flex items-center gap-1.5">
          {formatTimeAgo(notification.createdAt.toString())}{" "}
          <div className="h-2 w-2 rounded-full bg-red-600"></div>
        </p>
      </div>
    </li>
  );
};
export default Notification;
