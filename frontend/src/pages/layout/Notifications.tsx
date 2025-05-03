import { useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useGetAllNotificationsQuery } from "../../redux/api/notificationsApiSlice";
import Loader from "../../components/Loader";
import { isApiError } from "../../utils/isApiError";
import Notification from "../../components/user/Notification";
import { Notification as NotificationType } from "../../types";
import Modal from "../../components/Modal";
import DeleteAllNotificationsForm from "../../components/forms/DeleteAllNotificationsForm";

const Notifications = () => {
  const [activeTab, setActiveTab] = useState<"all" | "post" | "requests">(
    "all"
  );
  const [searchQuery, setSearchQuery] = useState<
    "" | "like" | "comment" | "follow"
  >("");
  const [page, setPage] = useState(1);
  const [showingNotifications, setShowingNotifications] = useState<
    NotificationType[] | []
  >([]);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);

  const navigate = useNavigate();

  const {
    data: notifications,
    isLoading: notificationsLoading,
    error: notificationsError,
    refetch: refetchNotifications,
  } = useGetAllNotificationsQuery({ page, type: searchQuery });

  useEffect(() => {
    if (activeTab === "all") setSearchQuery("");
    if (activeTab === "requests") setSearchQuery("follow");
    if (activeTab === "post") setSearchQuery("like");
    setPage(1);
    setShowingNotifications([]);
  }, [activeTab]);

  useEffect(() => {
    if (!notifications) return;
    if (page === 1) {
      setShowingNotifications(notifications!.notifications);
    } else {
      setShowingNotifications((prev) => [
        ...prev,
        ...notifications!.notifications,
      ]);
    }
  }, [notifications, page]);

  if (notificationsLoading) {
    return <Loader />;
  }

  if (notificationsError) {
    if (isApiError(notificationsError)) {
      return <h2>{notificationsError.data.msg}</h2>;
    } else {
      return <h2>Somthing Went Wrong</h2>;
    }
  }

  return (
    <section>
      {/* go back */}
      <header className="border-b border-gray-700 py-3.5 px-3 flex items-center gap-3">
        <IoArrowBack
          size={20}
          className="cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <h2 className="font-semibold text-lg">Notifications</h2>
        {showingNotifications.length === 0 || (
          <button
            onClick={() => setDeleteModalOpen(true)}
            className="ml-auto bg-red-600 hover:bg-red-700 cursor-pointer transition-colors px-2 py-0.5 rounded-2xl font-medium"
          >
            Delete All
          </button>
        )}
      </header>

      <nav className="flex justify-around border-b border-gray-700">
        <div
          onClick={() => setActiveTab("all")}
          className={`${
            activeTab === "all"
              ? "bg-gray-700 font-semibold text-emerald-600"
              : ""
          } w-full  flex justify-center py-1.5 cursor-pointer hover:bg-gray-700`}
        >
          All
        </div>
        <div
          onClick={() => setActiveTab("post")}
          className={` ${
            activeTab === "post"
              ? "bg-gray-700 font-semibold text-emerald-600"
              : ""
          } w-full flex justify-center py-1.5 cursor-pointer hover:bg-gray-700`}
        >
          Post
        </div>
        <div
          onClick={() => setActiveTab("requests")}
          className={` ${
            activeTab === "requests"
              ? "bg-gray-700 font-semibold text-emerald-600"
              : ""
          } w-full flex justify-center py-1.5 cursor-pointer hover:bg-gray-700`}
        >
          Requests
        </div>
      </nav>
      {activeTab === "post" && (
        <div className="flex justify-around border-b border-gray-700">
          <p
            onClick={() => setSearchQuery("like")}
            className={`py-1 cursor-pointer ${
              searchQuery === "like" && "text-emerald-600 font-semibold"
            }`}
          >
            Likes
          </p>
          <p
            onClick={() => setSearchQuery("comment")}
            className={`py-1 cursor-pointer ${
              searchQuery === "comment" && "text-emerald-600 font-semibold"
            }`}
          >
            Comments
          </p>
        </div>
      )}
      {/* NOTIFICATION CONTAINER */}
      <ul className="flex flex-col">
        {showingNotifications.length === 0 && (
          <h2 className="text-center mt-4 text-gray-300">
            No Notifications To Show
          </h2>
        )}
        {showingNotifications &&
          showingNotifications.map((notification) => (
            <Notification
              key={notification._id}
              notification={notification}
              refetch={refetchNotifications}
            />
          ))}
      </ul>
      {notifications?.hasNextPage && (
        <div className="flex justify-center mt-3">
          <button onClick={() => setPage(page + 1)}>Show More</button>
        </div>
      )}

      <Modal
        isModalOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
      >
        <DeleteAllNotificationsForm
          onClose={() => setDeleteModalOpen(false)}
          refetch={refetchNotifications}
        />
      </Modal>
    </section>
  );
};
export default Notifications;
