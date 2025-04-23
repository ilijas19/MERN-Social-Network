import { Link, useNavigate } from "react-router-dom";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import {
  useGetCurrentUserQuery,
  useLoginMutation,
} from "../../redux/api/authApiSlice";
import { isApiError } from "../../utils/isApiError";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../../redux/features/auth/authSlice";
import Loader from "../../components/Loader";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const { data: currentUser, isLoading: currentUserLoading } =
    useGetCurrentUserQuery();
  const [loginApiHandler, { isLoading }] = useLoginMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await loginApiHandler({ email, password }).unwrap();
      toast.success(res.msg);
      dispatch(setCurrentUser(res.tokenUser));
      navigate("/");
    } catch (error) {
      if (isApiError(error)) {
        toast.error(error.data.msg);
      } else {
        toast.error("Something Went Wrong");
      }
    }
  };

  const handleRoleClick = (role: string) => {
    switch (role) {
      case "admin":
        setEmail("ilijagocic19@gmail.com");
        setPassword("123456");
        break;
      case "user1":
        setEmail("user1@gmail.com");
        setPassword("123456");
        break;
      case "user2":
        setEmail("user2@gmail.com");
        setPassword("123456");
        break;
      case "user3":
        setEmail("user3@gmail.com");
        setPassword("123456");
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser]);

  if (currentUserLoading) {
    return <Loader />;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className=" mt-12 max-w-[600px] mx-auto w-full text-white rounded-lg py-2 px-4 flex flex-col "
    >
      <h2 className="text-center sm:text-xl text-lg">Sign In</h2>

      <label>Email</label>
      <div className="flex items-center border border-gray-600 rounded focus-within:ring-1 focus-within:ring-emerald-500 mb-2">
        <EnvelopeIcon className="h-5 w-5 mx-2 text-emerald-600" />
        <input
          type="email"
          className="py-1.5 px-2 bg-transparent flex-1 focus:outline-none"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <label>Password</label>
      <div className="flex items-center border border-gray-600 rounded focus-within:ring-1 focus-within:ring-emerald-500 mb-2">
        <LockClosedIcon className="h-5 w-5 mx-2 text-emerald-600" />
        <input
          type="password"
          className="py-1.5 px-2 bg-transparent flex-1 focus:outline-none"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button
        disabled={isLoading}
        className="bg-emerald-700 rounded-xl py-1.5 font-semibold my-2 cursor-pointer hover:bg-emerald-600 transition-colors "
      >
        {isLoading ? "Signing In..." : "Sign In"}
      </button>

      <p className="text-gray-300">
        Not A Member? {""}
        <Link className="text-emerald-600 font-semibold" to={"/register"}>
          Register...
        </Link>
      </p>
      <p className="text-center">Role As</p>
      <div className="flex justify-center gap-4 mt-2">
        <button
          type="button"
          onClick={() => handleRoleClick("admin")}
          className="bg-white text-emerald-950 font-semibold px-2 rounded-lg cursor-pointer hover:bg-emerald-100 transition-colors"
        >
          Admin
        </button>
        <button
          type="button"
          onClick={() => handleRoleClick("user1")}
          className="bg-white text-emerald-950 font-semibold px-2 rounded-lg cursor-pointer hover:bg-emerald-100 transition-colors"
        >
          User1
        </button>
        <button
          type="button"
          onClick={() => handleRoleClick("user2")}
          className="bg-white text-emerald-950 font-semibold px-2 rounded-lg cursor-pointer hover:bg-emerald-100 transition-colors"
        >
          User2
        </button>
        <button
          type="button"
          onClick={() => handleRoleClick("user3")}
          className="bg-white text-emerald-950 font-semibold px-2 rounded-lg cursor-pointer hover:bg-emerald-100 transition-colors"
        >
          User3
        </button>
      </div>
    </form>
  );
};

export default Login;
