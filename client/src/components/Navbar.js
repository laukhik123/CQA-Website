import React, { useState,useContext } from 'react';
import './Navbar.css';
import { NavLink,useNavigate } from "react-router-dom";
import pic from "./favicon-96x96.png";
import { SessionContext } from './SessionContext';
import QuestionList from './QuestionList';
import DropDown from './DropDown';
import PostQuestion from './PostQuestion';


export default function Searchbar(props) {
  const [sortValue, setSortValue] = useState('');
  const [SearchData, setSearchData] = useState([]);
  const [categoryValue, setCategoryValue] = useState([])
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const { sessionId } = useContext(SessionContext);
  const logged_user_id = useState(sessionId);
  const navigate = useNavigate();

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const handleApply = (options) => {
  setSelectedOptions(options);};

  const handleSortChange = event => {
    setSortValue(event.target.value);
  };
  const handleClick = () => {
    window.location.reload();
  };
  const handleLogout = () => {
    sessionStorage.setItem('setLogin','false');
    // navigate('/');
};
// document.cookie = "username=John Does";

  async function handleInputChange(event) {
    const input = event.target.value;
    setInputValue(input);

      console.log('ki')
    try {
      const response = await fetch("http://localhost:9000/autocompletion", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', 
        // set credentials to include
        body: JSON.stringify({ input })
      });
      
      const data = await response.json();
      if (response.status === 402) {
        // Redirect user to login page
        sessionStorage.setItem('setLogin','false')
        window.location.replace("http://localhost:3000/");
        return;
      }
      console.log(data);
      console.log(data.names);

      if (input.length > 0) {
      setSuggestions(data.names);}
      else{
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Error occurred during fetch:', error);
    }
  }

  function handleSuggestionClick(event) {
    const suggestion = event.target.innerText;
    setInputValue(suggestion);
    setSuggestions([]);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:9000/search-questions", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', 
        body: JSON.stringify({
          name: inputValue,
          sort: sortValue === 'upvotes' ? 1 : sortValue === 'time' ? 2 : 0,
          tags: selectedOptions
        })
      });
      console.log({
        name: inputValue,
        sort: sortValue === 'upvotes' ? 1 : sortValue === 'time' ? 2 : 0,
        tags: selectedOptions
      })
      
      const searchData = await response.json();
      if (response.status === 402) {
        // Redirect user to login page
        sessionStorage.setItem('setLogin','false')
        window.location.replace("http://localhost:3000/");
        console.log('hi')
        return;
      }
      setSearchData(searchData);
      setIsDataLoaded(true);
      console.log(searchData)
      console.log(searchData.questions.length)
    } catch (error) {
      console.error('Error searching:', error);
    }
  };
  
  return (
    <>
    {console.log('hi')}
    {console.log(document.cookie)}
    {console.log('hello')}
    <div className='bodi'>
      <img className="img" src={pic} alt="Image Error" />
      <nav className="navbar navbar-light bg-light flex">
      <NavLink className="nav-link" to="/home" onClick={handleClick}>
      <h3 className="Title">Home</h3>
    </NavLink>

        <NavLink className="nav-link" to="/profile">
          <h3 className="Title">View Profile</h3>
        </NavLink>
{/*  <NavLink className="nav-link" to="/postquestion">
          <h3 className="Title">Post Question</h3>
        </NavLink> */}
        
        <NavLink className="nav-link" to="/" onClick={handleLogout}>
          <h3 className="Title2">
          {/* {sessionStorage.setItem('setLogin', 'false')} */}
            Logout</h3>
        </NavLink>
      </nav>
      {/* <h1 className="cnav" style={{fontStyle:"italic"}}>“All the answers are out there. The only thing expected of you is to keep calm, tune in, and find out.”</h1> */}
    
      <div className='flexing'>

      <DropDown onApply={handleApply}  />
      {selectedOptions.length > 0 && (
        <ul
         className = 'form-controls3'
        >
          {selectedOptions.map((option) => (
            <li key={option}>{option}</li>
          ))}
        </ul>
      )}

        <input type="text" placeholder='search by display name' className='form-controls' value={inputValue} onChange={handleInputChange} />
        {Boolean(suggestions.length) && (
      <ul className='form-controls2'>
        {suggestions.map((suggestion, index) => (
          <li  key={index} onClick={handleSuggestionClick}>{suggestion}</li>
        ))}
      </ul>
        )}
      <div className='sort'>
        <form onSubmit={handleSubmit} className="form-control">
          <select className="form-control2" value={sortValue} onChange={handleSortChange}>
            <option value="random">Sort</option>
            <option value="upvotes">Sort by upvotes</option>
            <option value="time">Sort by time</option>
          </select>
          <button className="btn btn-primary2" type="submit">Search</button>
        </form>
      </div>
         </div>


      {/* <div style={{float:"right", marginTop :"10px"}}> */}
     
      {/* </div> */}
      <div className='here'>
    {SearchData && SearchData.questions && SearchData.questions.length > 0 && <QuestionList className="question" questions={SearchData.questions} />}
    </div>
    </div>

    
  {(!SearchData || !SearchData.questions || SearchData.questions.length === 0) && <div className="remaining">
  <div className="content">Post Question</div> <PostQuestion /> </div>}
      
    
    </>
  );
}
