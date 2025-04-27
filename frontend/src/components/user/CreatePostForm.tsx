import { useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { useCreatePostMutation } from "../../redux/api/postsApiSlice";
import { isApiError } from "../../utils/isApiError";
import { toast } from "react-toastify";
import { useUploadImageMutation } from "../../redux/api/uploadApiSlice";
import { useNavigate } from "react-router-dom";
const CreatePostForm = () => {
  const [isFormOpen, setFormOpen] = useState<boolean>(false);
  const [postType, setPostType] = useState<"text" | "image">("image");

  const [imageUrl, setImageUrl] = useState<string>("");
  const [text, setText] = useState<string>("");

  const [uploadApiHandler, { isLoading: uploadLoading }] =
    useUploadImageMutation();
  const [createPostApiHandler, { isLoading: createPostLoading }] =
    useCreatePostMutation();

  const navigate = useNavigate();

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (e.target.files && e.target.files.length > 0) {
        const formData = new FormData();
        formData.append("image", e.target.files[0]);
        const res = await uploadApiHandler(formData).unwrap();
        toast.success(res.msg);
        setImageUrl(res.url);
      }
    } catch (error) {
      if (isApiError(error)) {
        toast.error(error.data.msg);
      } else {
        toast.success("Something Went Wrong");
      }
    }
  };

  const handlePostCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await createPostApiHandler({
        type: postType,
        text,
        image: imageUrl,
      }).unwrap();
      toast.success(res.msg);
      navigate("/profile");
    } catch (error) {
      if (isApiError(error)) {
        toast.error(error.data.msg);
      } else {
        toast.error("Something Went Wrong");
      }
    }
  };

  return (
    <section className="">
      <button
        onClick={() => setFormOpen(!isFormOpen)}
        className=" text-white text-lg m-2 font-semibold cursor-pointer flex items-center gap-2"
      >
        Create A Post {!isFormOpen ? <IoIosArrowDown /> : <IoIosArrowUp />}
      </button>
      {isFormOpen && (
        <form onSubmit={handlePostCreate} className="text-white px-4 ">
          <div className="flex gap-4 ">
            <button
              type="button"
              onClick={() => setPostType("text")}
              className={`${
                postType === "text"
                  ? "bg-emerald-600 font-semibold"
                  : "bg-gray-600"
              } px-3 py-1  cursor-pointer rounded`}
            >
              Text
            </button>
            <button
              type="button"
              onClick={() => setPostType("image")}
              className={`${
                postType === "image"
                  ? "bg-emerald-600 font-semibold"
                  : "bg-gray-600"
              } px-3 py-1  cursor-pointer rounded`}
            >
              Image
            </button>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="bg-gray-700 w-full mt-4 mb-1 rounded-lg px-3 py-2 h-30 outline-none"
            placeholder="Whats On Your Mind"
          ></textarea>

          {postType === "image" && (
            <div className="border flex items-center px-2 py-1 mb-1 border-gray-600 rounded-lg">
              <label htmlFor="fileupload" className="w-full h-full">
                {uploadLoading
                  ? "Uploading image..."
                  : imageUrl === ""
                  ? "Upload Image"
                  : "Image Uploaded"}
              </label>
              <input
                disabled={uploadLoading}
                onChange={handleUploadImage}
                id="fileupload"
                type="file"
                className=" cursor-pointer hidden"
              />
              <img
                src={imageUrl && imageUrl !== "" ? imageUrl : undefined}
                className={`size-5 cursor-pointer ${
                  imageUrl === "" && "hidden"
                }`}
              ></img>
            </div>
          )}

          <button
            disabled={createPostLoading}
            className="bg-emerald-600 w-full mt-2 py-1 rounded-lg font-semibold cursor-pointer"
          >
            Post
          </button>
        </form>
      )}
    </section>
  );
};
export default CreatePostForm;
