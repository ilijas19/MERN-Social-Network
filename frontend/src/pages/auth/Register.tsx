import { Link, useNavigate } from "react-router-dom";
import {
  EnvelopeIcon,
  UserIcon,
  LockClosedIcon,
  LockOpenIcon,
} from "@heroicons/react/24/outline";
import {
  useGetCurrentUserQuery,
  useRegisterMutation,
} from "../../redux/api/authApiSlice";
import { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import { isApiError } from "../../utils/isApiError";
import { toast } from "react-toastify";

const Register = () => {
  const [formProps, setFormProps] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const { data: currentUser, isLoading: currentUserLoading } =
    useGetCurrentUserQuery();
  const navigate = useNavigate();

  const [registerApiHandler, { isLoading }] = useRegisterMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (formProps.password !== formProps.confirmPassword) {
        toast.error("Passwords Do Not Match");
        return;
      }
      const res = await registerApiHandler(formProps).unwrap();
      toast.success(res.msg);
      navigate("/login");
    } catch (error) {
      if (isApiError(error)) {
        toast.error(error.data.msg);
      } else {
        toast.error("Something Went Wrong");
      }
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
      <h2 className="text-center sm:text-xl text-lg">Register</h2>

      {/* Email Field with Icon */}
      <label>Email</label>
      <div className="flex items-center border border-gray-600 rounded focus-within:ring-1 focus-within:ring-emerald-500 mb-2">
        <EnvelopeIcon className="h-5 w-5 mx-2 text-emerald-600" />
        <input
          value={formProps.email}
          onChange={(e) =>
            setFormProps({ ...formProps, email: e.target.value })
          }
          type="email"
          className="py-1.5 px-2 bg-transparent flex-1 focus:outline-none"
          placeholder="your@email.com"
        />
      </div>

      {/* Username Field with Icon */}
      <label>Username</label>
      <div className="flex items-center border border-gray-600 rounded focus-within:ring-1 focus-within:ring-emerald-500 mb-2">
        <UserIcon className="h-5 w-5 mx-2 text-emerald-600" />
        <input
          value={formProps.username}
          onChange={(e) =>
            setFormProps({ ...formProps, username: e.target.value })
          }
          type="text"
          className="py-1.5 px-2 bg-transparent flex-1 focus:outline-none"
          placeholder="username"
        />
      </div>

      {/* Password Field with Icon */}
      <label>Password</label>
      <div className="flex items-center border border-gray-600 rounded focus-within:ring-1 focus-within:ring-emerald-500 mb-2">
        <LockClosedIcon className="h-5 w-5 mx-2 text-emerald-600" />
        <input
          value={formProps.password}
          onChange={(e) =>
            setFormProps({ ...formProps, password: e.target.value })
          }
          type="password"
          className="py-1.5 px-2 bg-transparent flex-1 focus:outline-none"
          placeholder="••••••••"
        />
      </div>

      {/* Confirm Password Field with Icon */}
      <label>Confirm Password</label>
      <div className="flex items-center border border-gray-600 rounded focus-within:ring-1 focus-within:ring-emerald-500 mb-2">
        <LockOpenIcon className="h-5 w-5 mx-2 text-emerald-600" />
        <input
          value={formProps.confirmPassword}
          onChange={(e) =>
            setFormProps({ ...formProps, confirmPassword: e.target.value })
          }
          type="password"
          className="py-1.5 px-2 bg-transparent flex-1 focus:outline-none"
          placeholder="••••••••"
        />
      </div>

      <button
        disabled={isLoading}
        className="bg-emerald-700 rounded-xl py-1.5 font-semibold my-2 cursor-pointer hover:bg-emerald-600 transition-colors"
      >
        Register
      </button>

      <p className="text-gray-300">
        Already A Member? {""}
        <Link className="text-emerald-600 font-semibold" to={"/login"}>
          Sign In...
        </Link>
      </p>
    </form>
  );
};

export default Register;
