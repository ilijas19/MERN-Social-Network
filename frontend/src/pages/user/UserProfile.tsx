import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useParams } from "react-router-dom";

const UserProfile = () => {
  const { username } = useParams();

  const { currentUser } = useSelector((state: RootState) => state.auth);

  return <div>UserProfile</div>;
};
export default UserProfile;
