import React, { useState,useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { SessionContext } from './SessionContext';
import "./PostAnswer.css";

function PostAnswer(props) {
  const navigate = useNavigate();
  const [body, setBody] = useState('');
  const { sessionId } = useContext(SessionContext);
  const logged_user_id = useState(sessionId)
  // const navigate = useNavigate();
  const question_id = props.question_id;
  console.log(sessionId);
  // console.log(logged_user_id);
  // console.log(props.question_id);
  console.log(question_id);
  console.log('time');
  console.log('tim');

  const handleSubmit = async (event) => {
    event.preventDefault();

    // time stamp 
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const date = String(currentDate.getDate()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;

    const data = { userid: sessionId , body, parentid: question_id, formattedDate};
    console.log(data);
    // Send the body to the database using fetch
    try {
      const response = await fetch('http://localhost:9000/post-answer', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        },
        credentials:'include',
      });
      if (response.ok) {
        console.log('Answer posted successfully');
        console.log(question_id);
        // navigate(`/home/${question_id}`);
        window.location.reload();

      } else {
        console.error('Error posting answer: ', response.statusText);
        console.log('high');
      }
    } catch (error) {
      console.error('Error posting answer', error);
      console.log('high');
    }}
    


  return (
    <>
    <form onSubmit={handleSubmit} className="post-answer-form">
      <label className="post-answer-label">
        Body:
        <input type="text" value={body} onChange={(event) => setBody(event.target.value)} className="post-answer-input" />
      </label>
      <button type="submit" className="post-answer-button">Submit</button>
    </form>
     {/* <p>helo</p> */}
  </> 
  );
}

export default PostAnswer;
