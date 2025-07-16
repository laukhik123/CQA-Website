import React, { useState,useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import DropDown from './DropDown.js';
import { SessionContext } from './SessionContext';
import './EditQuestion';


function EditQuestion({ question, onClose }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState(question.body);
  const [selectedTags, setSelectedTags] = useState(question.tags);
  const [isEdited, setIsEdited] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const { sessionId } = useContext(SessionContext);
  const [logged_user_id,setlogged_user_id] = useState(sessionId);
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [showAlert2, setShowAlert2] = useState(false);

  console.log('5')
  console.log(question);
console.log(logged_user_id);

const handleApply = (options) => {
  setSelectedOptions(options);};

  const handleSubmit = async(event) => {
    event.preventDefault();
    if (selectedOptions.length === 0) {
      setShowAlert(true);
      return;
    }
    setShowAlert(false);
    // Send data to the database
    // You can use fetch or axios to make a POST request
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const date = String(currentDate.getDate()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;

    const data = { id:question,title, body, tags: selectedOptions,formattedDate,userid:sessionId};
    console.log(data);
    console.log(selectedOptions);
    try {
      const response = await fetch(`http://localhost:9000/edit-question/`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
        credentials:'include',
      });
  
      if (!response.ok) {
        console.log("helie");
        // console.log(`/home/${question}`);
        alert('Error editing question');
        console.log("why")
        setShowAlert2(true)
        // navigate(`/home/${question}`);
        // navigate(`/home`);
        // window.location.reload();
        // <div className="success-message">Edited susfully!</div>
        // throw new Error('Network response was not ok');
      }
      else{
      const text = await response.text();
      const parsedData = JSON.parse(text);
      console.log(parsedData);
      setIsEdited(true);
      console.log('tikk');
      window.location.reload();
          }
    } catch (error) {
      console.error(error);
    }
  }


  return (
    <div className="edit-question-container">
      {isEdited ? (
        <>
          <div className="success-message">Edited successfully!</div>
          <button onClick={onClose}>Close</button>
        </>
      ) : (
        <>
        <div>
          <DropDown onApply={handleApply} />
        <ul className="selected-options">
          {selectedOptions.map((option) => (
            <li key={option}>{option}</li>
          ))}
        </ul>
        
        {showAlert && (
              <div style={{ backgroundColor: 'black', color: 'white', padding: '10px' }}>
              Please select atleast one tag.
            </div>
          )}
        {showAlert2 && (
              <div style={{ backgroundColor: 'black', color: 'white', padding: '10px' }}>
              You are not authorized to edit question
            </div>
          )}
      </div>
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <label htmlFor="title">Title:</label>
            <input type="text" id="title" value={title} onChange={event => setTitle(event.target.value)} maxLength={512} />
          </div>
          <div className="input-container">
            <label htmlFor="body">Body:</label>
            <textarea id="body" value={body} onChange={event => setBody(event.target.value)} />
          </div>
          
            <button className="btn"  type="submit">Submit</button>
            </form>
            </>
        )}
      </div>
    );
  }
  
  export default EditQuestion;




