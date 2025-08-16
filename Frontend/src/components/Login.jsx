import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [emailId, setEmailId] = useState("samay@gmail.com");
  const [password, setPassword] = useState("Samay@123");
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [error, setError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const user = await axios.post(
        BASE_URL + "/login",
        {
          emailId,
          password,
        },
        { withCredentials: true }
      );
      dispatch(addUser(user?.data));
      navigate("/");
    } catch (err) {
      setError(err?.response?.data || "something went wrong...");
    }
  };

  const handleSignUp = async () => {
    try {
      const user = await axios.post(
        BASE_URL + "/signup",
        { firstName, lastName, emailId, password },
        { withCredentials: true }
      );
      dispatch(addUser(user?.data));
      return navigate("/profile/edit");
    } catch (err) {
      setError(err?.response?.data);
    }
  };


  const handleClick = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <div className="card bg-base-100 w-96 shadow-sm item-centre mt-7 border mx-auto my-8">
      <div className="card-body">
        <h2 className="card-title mx-auto text-3xl mb-6">
          {isSignUp ? "Sign Up" : "Sign In"}
        </h2>
        {isSignUp && (
          <input
            type="text"
            placeholder="First Name"
            className="input input-bordered w-auto md:w-auto mb-2"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        )}
        {isSignUp && (
          <input
            type="text"
            placeholder="Last Name"
            className="input input-bordered w-auto md:w-auto mb-2"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        )}
        <input
          type="text"
          placeholder="Email"
          className="input input-bordered w-auto md:w-auto mb-2"
          value={emailId}
          onChange={(e) => setEmailId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Password"
          className="input input-bordered w-full md:w-auto mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <h1 className="text-red-500 mb-3 mx-auto text-2xl font-bold">
          {error}
        </h1>
        <div className="card-actions justify-end w-full">
          <button
            className="btn btn-primary bg-primary w-full"
            onClick={isSignUp ? handleSignUp : handleLogin}
          >
            {isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </div>
        {!isSignUp && (
          <h3 className="text-center">
            New User ?{" "}
            <span
              onClick={handleClick}
              className="underline cursor-pointer hover:text-black"
            >
              Sign Up here
            </span>
          </h3>
        )}
        {isSignUp && (
          <h3 className="mx-auto">
            Already user ?
            <span
              onClick={handleClick}
              className="underline cursor-pointer hover:text-black"
            >
              {" "}
              Sign In here
            </span>
          </h3>
        )}
      </div>
    </div>
  );
};

export default Login;
