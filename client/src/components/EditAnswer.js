import React, { useState,useContext } from 'react';
import { SessionContext } from './SessionContext';

function EditAnswer(props) {
  const [body, setBody] = useState('');
  const { sessionId } = useContext(SessionContext);
  const [logged_user_id] = useState(sessionId)
  const [showAlert2, setShowAlert2] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const date = String(currentDate.getDate()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;

    // Send the body to the database using fetch
    const data = { id:props.answer, body,formattedDate,userid:sessionId}; 
    console.log(props);
    console.log(data);
    fetch('http://localhost:9000/edit-answer', {
      method: 'POST',
      body: JSON.stringify( data ),
      headers: {
        'Content-Type': 'application/json'
      },
      credentials:'include',
    })
      .then((response) => {
        console.log('Answer editeds successfully');
        console.log(props.answer);
        console.log(body);
        console.log(sessionId);
        // Do something with the response, e.g. redirect to a different page
        if(!response.ok){
          console.log("he")
          setShowAlert2(true)
          // navigate(`/home/${question}`);
        }
        if(response.ok){
          console.log("gay");
          window.location.reload();
        }
      })
      .catch((error) => {
        console.error('Error editing answer', error);
      });
  };

  return (
    <form onSubmit={handleSubmit} className="edit-answer-form">
      {showAlert2 && (
              <div style={{ backgroundColor: 'black', color: 'white', padding: '10px' }}>
              You are not authorized to edit answer
            </div>
          )}
      <label className="edit-answer-label">
        Body:
        <input type="text" value={body} onChange={(event) => setBody(event.target.value)} className="edit-answer-input" />
      </label>
      <button type="submit" className="edit-answer-button">Submit</button>
    </form>
  );
}

export default EditAnswer;

