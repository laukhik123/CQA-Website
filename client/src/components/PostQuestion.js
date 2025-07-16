import React, { useState,useContext } from 'react';
import DropDown from './DropDown.js';
import './PostQuestion.css';
import { SessionContext } from './SessionContext';

function PostQuestion() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const { sessionId } = useContext(SessionContext);
  const [logged_user_id] = useState(sessionId)
  const [isPosted, setIsPosted] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [showAlert, setShowAlert] = useState(false);

  const handleApply = (options) => {
    setSelectedOptions(options);};

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (selectedOptions.length === 0) {
      setShowAlert(true);
      // return;
      return;
    }
    setShowAlert(false);
    console.log(sessionId);
    console.log(logged_user_id);
    console.log(selectedOptions);
    console.log('naze')
    // console.log(data)
    // Send data to the database
    // You can use fetch or axios to make a POST request

      // id,title,body,tags,time stamp

      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const date = String(currentDate.getDate()).padStart(2, '0');
      const hours = String(currentDate.getHours()).padStart(2, '0');
      const minutes = String(currentDate.getMinutes()).padStart(2, '0');
      const seconds = String(currentDate.getSeconds()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;


      try {
        const data = { userid: sessionId, title, body, tags: selectedOptions, formattedDate };
        const response = await fetch('http://localhost:9000/post-question', {
          method: 'POST',
          body: JSON.stringify(data),
          headers: { 'Content-Type': 'application/json' },
          credentials:'include',
        });
        const responseData = await response.json();
        console.log(responseData);
        setIsPosted(true);
        // window.location.reload();
        // setSelectedOptions(null);
        // setBody('');
        // setTitle('');
        console.log('how');
      } catch (error) {
        console.error(error);
        console.log('now');
      }}
      

  return (
  
    <div className="post-question-container">
      {showAlert && (
        <div style={{ backgroundColor: 'red', color: 'white', padding: '10px' }}>
          Please select at least one tag.
        </div>
      )}
      {isPosted ? (
        <>
        <div className="success-message">Posted successfully!
        </div>
        </>
      ) : ( <>
               <div className="input-container">
         <label>Tags:</label>
         <DropDown onApply={handleApply} />
     <ul className="selected-options">
       {selectedOptions.map((option) => (
         <li key={option}>{option}</li>
       ))}
     </ul>
       </div>
        <form onSubmit={handleSubmit}>
          <div>
          <div className="input-container">
            <label htmlFor="title">Title:</label>
            <input type="text" className="title" value={title} onChange={event => setTitle(event.target.value)} />
          </div>
          <div className="input-container">
            <label htmlFor="body">Body:</label>
            <textarea className='bodies' value={body} onChange={event => setBody(event.target.value)} />
          </div>
          <button className="btn btn-primary2" type="submit">Post Question</button>
          </div>
        </form>
       
      </>
      )}
    </div>
  );
}

export default PostQuestion;

