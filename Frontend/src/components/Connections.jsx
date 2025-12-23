import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();

  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });

      dispatch(addConnections(res.data.data));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections) {
    return <h1 className="text-center text-2xl my-6">Loading...</h1>;
  }

  if (connections.length === 0) {
    return <h1 className="text-center text-3xl my-6">No Connections Found</h1>;
  }

  return (
    <div>
      <h1 className="text-center text-3xl my-6">Connections</h1>

      {connections.map((connection) => {
        const { _id, firstName, lastName, photoURL, age, gender, about } =
          connection;

        return (
          <div
            key={_id}
            className="flex gap-4 bg-base-300 my-5 w-4/12 mx-auto p-5 rounded-lg"
          >
            <img src={photoURL} className="w-20 h-20 rounded-md" />

            <div className="flex-1">
              <h1>{firstName} {lastName}</h1>
              <p>{age}, {gender}</p>
              <p>{about}</p>
            </div>

            <Link to={`/chat/${_id}`} className="btn btn-primary my-auto">
              Chat
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default Connections;
