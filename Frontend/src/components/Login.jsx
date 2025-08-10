import { useState } from "react";
import axios from "axios";

const Login = () => {
  const [emailId, setEmailId] = useState("ameer@gmail.com");
  const [password, setPassword] = useState("Ameer@123");

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        "http://localhost:7777/login",
        {
          emailId,
          password,
        },
        { withCredentials: true }
      );
    } catch (err) {
      res.status(500).json({ message: "error: " + err.message });
    }
  };

  return (
    <div className="card bg-base-100 w-96 shadow-sm item-centre mt-7 border mx-auto">
      <div className="card-body">
        <h2 className="card-title mx-auto text-3xl mb-6">Sign In</h2>
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
          className="input input-bordered w-full md:w-auto mb-5"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="card-actions justify-end w-full">
          <button
            className="btn btn-primary bg-primary w-full"
            onClick={handleLogin}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
