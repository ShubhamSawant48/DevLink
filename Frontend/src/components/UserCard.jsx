const UserCard = ({user}) => {

    const {firstName,lastName,skills,photoURL} =user

    return (
        <div className="card bg-base-100 w-96 shadow-sm justify-self-center my-10 border">
      <figure>
        <img
          src={photoURL}
          alt="user's photo" 
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{firstName + " " + lastName}</h2>
        <p>
          {skills}
        </p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary">Not Interested</button>
          <button className="btn btn-secondary">Interested</button>
        </div>
      </div>
    </div>
    )
};

export default UserCard;