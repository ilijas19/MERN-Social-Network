import { toast } from "react-toastify";
import { PROFILE_PICTURE_URL } from "../../redux/constants";
import { Notification as NotificationObj } from "../../types";
import { formatTimeAgo } from "../../utils/FormatTimeAgo";
import { isApiError } from "../../utils/isApiError";
import { useDeleteSingleNotificationMutation } from "../../redux/api/notificationsApiSlice";
import { useNavigate } from "react-router-dom";

type NotificationProps = {
  notification: NotificationObj;
  refetch: () => void;
};

const Notification = ({ notification, refetch }: NotificationProps) => {
  const navigate = useNavigate();

  const [deleteApiHandler, { isLoading: deleteLoading }] =
    useDeleteSingleNotificationMutation();

  const handleNotificationOpen = async () => {
    if (deleteLoading) return;
    await deleteApiHandler(notification._id).unwrap();
    refetch();
    try {
      if (notification.type === "comment" || notification.type === "like") {
        navigate(`/post/${notification.postId}`);
      }
      if (notification.type === "follow") {
        if (notification.text.split(" ")[1] === "Started") {
          navigate(`/profile/${notification.from.username}`);
        } else {
          navigate(`/followingRequests`);
        }
      }
    } catch (error) {
      if (isApiError(error)) {
        toast.error(error.data.msg);
      } else {
        toast.error("Something Went Wrong");
        console.log(error);
      }
    }
  };

  return (
    <li
      onClick={handleNotificationOpen}
      className="flex gap-3 items-center py-3 px-2 hover:bg-gray-600 cursor-pointer border-b border-gray-600 relative"
    >
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
          <span className="h-2 w-2 rounded-full bg-red-600"></span>
        </p>
      </div>
    </li>
  );
};
export default Notification;
