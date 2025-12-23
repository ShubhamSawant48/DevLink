import { useEffect, useState } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user?.firstName);
  const [lastName, setLastName] = useState(user?.lastName);
  const [photoURL, setPhotoURL] = useState(user?.photoURL);
  const [age, setAge] = useState(user?.age || "");
  const [gender, setGender] = useState(user?.gender || "");
  const [about, setAbout] = useState(user?.about || "");
  const [error, setError] = useState("");
  const [showToast,setShowToast] = useState(false)
  const dispatch = useDispatch();

  const saveProfile = async ({
    firstName,
    lastName,
    photoURL,
    age,
    gender,
    about,
  }) => {
    try {
      setError("");
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        { firstName, lastName, photoURL, age, gender, about },
        { withCredentials: true }
      );
      dispatch(addUser(res.data.data));
      setShowToast(true);
      setTimeout(()=>{
        setShowToast(false);
      },2000)
    } catch (err) {
      setError(err);
      console.error("error:" + err);
    }
  };

  // useEffect(()=>{
  //   saveProfile()
  // },[])
  
  return (
    <form className="flex justify-self-center gap-10" onSubmit={e => e.preventDefault()}>
      <div className="card bg-base-300 w-96 shadow-sm item-centre my-8 border">
        <div className="card-body">
          <h2 className="card-title mx-auto text-3xl mb-6">Edit Profile</h2>
          <p>First Name:</p>
          <input
            type="text"
            className="input input-bordered w-auto md:w-auto"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <p>Last Name:</p>
          <input
            type="text"
            className="input input-bordered w-full md:w-auto"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <p>Photo URL:</p>
          <input
            type="text"
            className="input input-bordered w-full md:w-auto"
            value={photoURL}
            onChange={(e) => setPhotoURL(e.target.value)}
          />
          <p>Age:</p>
          <input
            type="number"
            className="input input-bordered w-full md:w-auto"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
          />
          <p>Gender:</p>
          <input
            type="text"
            className="input input-bordered w-full md:w-auto"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          />
          <p>About:</p>
          <input
            type="text"
            className="input input-bordered w-full md:w-auto"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
          />
          {error && (
            <h1 className="text-red-500 mb-3 mx-auto text-2xl font-bold">
              {error.response?.data}
            </h1>
          )}
          <div className="card-actions justify-end w-full">
            <button
              className="btn btn-primary bg-primary w-full"
              onClick={() =>
                saveProfile({
                  firstName,
                  lastName,
                  photoURL,
                  age,
                  gender,
                  about,
                })
              }
            >
              Save Profile
            </button>
          </div>
        </div>
      </div>
      <UserCard user={{ firstName, lastName, photoURL, age, gender, about }} />
      {showToast && <div className="toast toast-top toast-center">
        <div className="alert alert-success text-black">
          <span>Information Updated Successfully</span>
        </div>
      </div>}
    </form>
  );
};

export default EditProfile;
