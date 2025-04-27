import { useEffect, useState } from "react";
import CreatePostForm from "../../components/user/CreatePostForm";
import PostElement from "../../components/user/Post";
import {
  useGetExploreSectionPostsQuery,
  useGetFollowingUserPostsQuery,
} from "../../redux/api/postsApiSlice";
import Loader from "../../components/Loader";
import { Post } from "../../types";

const Home = () => {
  const [selectedPage, setSelectedPage] = useState<"following" | "explore">(
    "explore"
  );
  const [page, setPage] = useState(1);
  const [showingPosts, setShowingPosts] = useState<Post[] | []>([]);

  const { data: explorePosts, isLoading: explorePostsLoading } =
    useGetExploreSectionPostsQuery(
      { page },
      { skip: selectedPage === "following" }
    );
  // console.log(explorePosts);

  const { data: followingPosts, isLoading: followingPostsLoading } =
    useGetFollowingUserPostsQuery(
      { page },
      { skip: selectedPage === "explore" }
    );

  // Reset posts & page on tab switch
  useEffect(() => {
    setPage(1);
    if (selectedPage === "explore" && explorePosts) {
      setShowingPosts(explorePosts.posts);
    }

    if (selectedPage === "following" && followingPosts) {
      setShowingPosts(followingPosts.posts);
    }
  }, [selectedPage]);

  // Append new posts on page/data change
  useEffect(() => {
    if (selectedPage === "explore" && explorePosts) {
      if (page === 1) setShowingPosts(explorePosts.posts);
      else setShowingPosts((prev) => [...prev, ...explorePosts.posts]);
    }

    if (selectedPage === "following" && followingPosts) {
      if (page === 1) setShowingPosts(followingPosts.posts);
      else setShowingPosts((prev) => [...prev, ...followingPosts.posts]);
    }
  }, [explorePosts, followingPosts]);

  // Show more (pagination)
  const handleShowMore = () => {
    setPage((prev) => prev + 1);
  };

  const isLoading = explorePostsLoading || followingPostsLoading;

  return (
    <section>
      {/* NAV */}
      <nav className="flex justify-around text-white font-semibold border-b border-gray-700">
        <div
          onClick={() => setSelectedPage("following")}
          className={`hover:bg-gray-600 cursor-pointer h-full w-full flex justify-center py-2 ${
            selectedPage === "following" && "bg-gray-600 text-emerald-500"
          }`}
        >
          Following
        </div>
        <div
          onClick={() => setSelectedPage("explore")}
          className={`hover:bg-gray-600 cursor-pointer h-full w-full flex justify-center py-2 ${
            selectedPage === "explore" && "bg-gray-600 text-emerald-500"
          }`}
        >
          Explore
        </div>
      </nav>

      {/* UPLOAD POST */}
      <CreatePostForm />

      {/* POST CONTAINER */}
      <ul className="flex flex-col gap-4">
        {isLoading && <Loader />}

        {!isLoading &&
          showingPosts.map((post) => (
            <PostElement key={post._id} post={post} />
          ))}
      </ul>

      {/* PAGINATION */}
      <div
        className={`flex justify-center gap-4 mt-4 mb-6 ${
          selectedPage === "following" && !followingPosts?.nextPage && "hidden"
        } ${selectedPage === "explore" && !explorePosts?.nextPage && "hidden"}`}
      >
        <button
          onClick={handleShowMore}
          className="bg-gray-600 text-white px-3 py-1 rounded-lg cursor-pointer"
        >
          Show More
        </button>
      </div>
    </section>
  );
};

export default Home;
