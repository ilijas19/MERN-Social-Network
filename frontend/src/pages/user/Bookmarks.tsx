import { useEffect } from "react";
import Loader from "../../components/Loader";
import PostElement from "../../components/user/Post";
import { useGetSavedPostsQuery } from "../../redux/api/postsApiSlice";

const Bookmarks = () => {
  const {
    data: bookmarks,
    isLoading: bookmarksLoading,
    refetch,
  } = useGetSavedPostsQuery();

  useEffect(() => {
    refetch();
  }, []);

  if (bookmarksLoading) {
    return <Loader />;
  }
  return (
    <section>
      <h2 className="text-white text-center my-4 sm:text-xl text-lg font-semibold">
        Bookmarks
      </h2>
      <ul>
        {bookmarks?.nbHits === 0 && (
          <h2 className="text-center my-4 text-gray-400 font-semibold">
            No Saved Posts
          </h2>
        )}
        {bookmarks?.savedPosts.map((post) => (
          <PostElement post={post} />
        ))}
      </ul>
    </section>
  );
};
export default Bookmarks;
