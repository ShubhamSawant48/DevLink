const UserCard = ({user}) => {

    const {firstName,lastName,photoURL,age,gender,about} =user

    return (
        <div className="card bg-base-300 w-96 shadow-sm justify-self-center my-8">
      <figure>
        <img
          src={photoURL}
          alt="user's photo" 
        />
      </figure>
      <div className="card-body">
        <h1 className="card-title">{firstName + " " + lastName}</h1>
        <h2>
          {age+","+ gender}
        </h2>
        <p>{about}</p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary">Not Interested</button>
          <button className="btn btn-secondary">Interested</button>
        </div>
      </div>
    </div>
    )
};

export default UserCard;