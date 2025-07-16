import React, { useState, useEffect, useContext,useHistory } from 'react';
import './ViewProfile.css';
import { SessionContext } from './SessionContext';
import QuestionList from './QuestionList';
import HtmlReactParser from 'html-react-parser';



function ViewProfile() {
  const [userDetails, setUserDetails] = useState(null);
  const { sessionId } = useContext(SessionContext);
  const [logged_user_id, setlogged_user_id] = useState(sessionId);
  console.log(sessionId);
  console.log(logged_user_id);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("http://localhost:9000/view-profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ logged_user_id: logged_user_id }),
          credentials:'include',
        });
        const data = await response.json();
        setUserDetails(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, [logged_user_id]);
  

  if (!userDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="view-profile-container">
      <div className="user-details">
        <img src={userDetails.profileImageURL} alt="User profile" />
        <h2>{userDetails.display_name}</h2>
        <p>Location: {userDetails.location}</p>
        <p>Website: <a href={userDetails.websiteURL}>{userDetails.websiteURL}</a></p>
        <p  style={{fontstyle:"italic"}} className="Title">Your id: {sessionId} </p>
        <p>About Me: <div> {HtmlReactParser(userDetails.aboutMe)}</div></p>
        <p>Creation Date: {userDetails.creationDate}</p>
        <p>Last Access Date: {userDetails.lastAccessDate}</p>
        <p>Badges:</p>
        <ul>
          <li>Gold: {userDetails.badges.Gold}</li>
          <li>Silver: {userDetails.badges.Silver}</li>
          <li>Bronze: {userDetails.badges.Bronze}</li>
        </ul>
        <p className = "posts">Your Posts:</p>
        <QuestionList questions={userDetails.questions} /> 
      </div>
    </div>
  );
}

export default ViewProfile;
