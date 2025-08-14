import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequest, removeRequest } from "../utils/requestSlice";
import { useEffect } from "react";

const Requests = () => {
  const pendingRequests = useSelector((store) => store.requests);
  const dispatch = useDispatch();

  const reviewRequest = async (status, _id) => {
    try {
      const res = await axios.post(
        BASE_URL + "/request/review/" + status + "/" + _id,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(_id));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/request/recieved", {
        withCredentials: true,
      });
      dispatch(addRequest(res?.data?.data));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div>
      <h1 className="text-center text-3xl my-6">Requests</h1>

      {pendingRequests &&
        pendingRequests.map((request) => {
          const { _id } = request;
          const { photoURL, firstName, lastName, age, gender, about } =
            request.fromUserId;
          return (
            <div
              key={_id}
              className="flex gap-6 bg-base-300 my-5 w-5/12 mx-auto p-5 rounded-lg"
            >
              <div>
                <img src={photoURL} className="w-20 h-20 rounded-md"></img>
              </div>
              <div className="my-auto">
                <h1>{firstName + " " + lastName}</h1>
                <p>{age + ", " + gender}</p>
                <p>{about}</p>
              </div>
              <div className="my-auto ml-auto">
                <button
                  className="btn btn-primary mx-2"
                  onClick={() => reviewRequest("rejected", _id)}
                >
                  Reject
                </button>
                <button
                  className="btn btn-secondary mx-2"
                  onClick={() => reviewRequest("accepted", _id)}
                >
                  Accept
                </button>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default Requests;
