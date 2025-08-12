import { useState } from "react";

const EditProfile = () => {
  const [emailId, setEmailId] = useState("shubham@gmail.com");
  const [password, setPassword] = useState("Shubham@123");
  const [error,setError] = useState("");


  return (
    <div className="card bg-base-100 w-96 shadow-sm item-centre mt-7 border mx-auto">
      <div className="card-body">
        <h2 className="card-title mx-auto text-3xl mb-6">Edit Profile</h2>
        <p>First Name:</p>
        <input
          type="text"
          placeholder="First Name:"
          className="input input-bordered w-auto md:w-auto mb-2"
          value={emailId}
          onChange={(e) => setEmailId(e.target.value)}
        />
        <p>Last Name:</p>
        <input
          type="text"
          placeholder="Last Name:"
          className="input input-bordered w-full md:w-auto mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <p>Photo URL:</p>
        <input
          type="text"
          placeholder="Last Name:"
          className="input input-bordered w-full md:w-auto mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <p>Age:</p>
        <input
          type="text"
          placeholder="Last Name:"
          className="input input-bordered w-full md:w-auto mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <p>Gender:</p>
        <input
          type="text"
          placeholder="Last Name:"
          className="input input-bordered w-full md:w-auto mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <p>About:</p>
        <input
          type="text"
          placeholder="Last Name:"
          className="input input-bordered w-full md:w-auto mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <h1 className="text-red-500 mb-3 mx-auto text-2xl font-bold">{error}</h1>
        <div className="card-actions justify-end w-full">
          <button
            className="btn btn-primary bg-primary w-full"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
