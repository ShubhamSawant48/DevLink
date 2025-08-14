import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";

const UserCard = ({ user }) => {
  const { firstName, lastName, photoURL, age, gender, about } = user;
  const dispatch = useDispatch();

  const sendRequest = async (status, id) => {
    try {
      await axios.post(
        BASE_URL + "/request/send/" + status + "/" + id,
        {},
        { withCredentials: true }
      );
      dispatch(removeUserFromFeed(id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="card bg-base-300 w-96 shadow-sm justify-self-center my-8">
      <figure>
        <img src={photoURL} alt="user's photo" />
      </figure>
      <div className="card-body">
        <h1 className="card-title">{firstName + " " + lastName}</h1>
        <h2>{age + "," + gender}</h2>
        <p>{about}</p>
        <div className="card-actions justify-end">
          <button
            className="btn btn-primary"
            onClick={() => sendRequest("ignored", user._id)}
          >
            Not Interested
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => sendRequest("interested", user._id)}
          >
            Interested
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
