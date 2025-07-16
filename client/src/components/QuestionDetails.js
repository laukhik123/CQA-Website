import React, { useState, useEffect,useContext } from 'react';
import { Link, useParams} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import "./QuestionDetails.css";
import PostAnswer from './PostAnswer';
import { SessionContext } from './SessionContext';
import EditQuestion from './EditQuestion';
import EditAnswer from './EditAnswer';
import HtmlReactParser from 'html-react-parser';


// I've passed the question_id and user_id as props
// to the PostAnswer component so that it can send the correct data to the database.
// {
//     "id": 123,"posted_user_id":"15155"
//     "title": "What is React?",
//     "body": "React is a JavaScript library for building user interfaces.",
//     "tags": ["react", "javascript"],
//     "score": 10,
//     "answers": [
//       {
//         "id": 456,"posted_user_id":"1515",
//         "body": "React is awesome!",
//         "score": 5
//       },
//       {
//         "id": 789,"posted_user_id":"1555",
//         "body": "React is the best thing since sliced bread.",
//         "score": 8
//       }
//     ]
//   } expected  json from database

function QuestionDetails() {
const { id } = useParams();
const [question, setQuestion] = useState(null);
const navigate = useNavigate();
const { sessionId } = useContext(SessionContext);
const logged_user_id = useState(sessionId);
const [isDataLoaded, setIsDataLoaded] = useState(false);
const [EditQuestions, setEditQuestions] = useState(false);
const [EditAnswers, setEditAnswers] = useState(false);
const [showAlert,setshowAlert] = useState(null);
const [showAlert2,setshowAlert2] = useState(null);

// const [logged_user_id, setlogged_user_id] = useState(sessionId);
console.log(sessionId);
console.log(id);
console.log(question);
// console.log(question.username);

const sendIdToServer = async (id) => {
    try {
      const response = await fetch("http://localhost:9000/fetch-answers", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id }),
        credentials:'include',
      });
  
      const data = await response.json();
      setQuestion(data)
      setIsDataLoaded(true);
        console.log(data)
        // console.log(question.ownername);
        // console.log(question.owneruserid)
      console.log('1')

    //   setQuestion(data) if you want to update state

    } catch (error) {
      console.error('Error occurred during fetch:', error);
    }
  }

  useEffect(() => {
    sendIdToServer(id);
    console.log('time')
  }, []);



  const deleteQuestion = async () => {
    try {
      const data = {id: id, userid: sessionId};
      console.log("n");
      console.log(data);
  
      const response = await fetch("http://localhost:9000/delete-post", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        },
        credentials:'include',
      });
  
      if (response.ok) {
        console.log('Question deleted successfully');
        navigate('/home');
      } else {
        console.log('maido')
        setshowAlert2(true)
        throw new Error('Failed to delete question');
      }
    } catch (error) {
      console.error('Error deleting question', error);
    }
  };
  

  const deleteAnswer = async (answerId) => {
    const data = { userid : sessionId,id : answerId}
    console.log("m")
    console.log(data);
    try {
      // Send a DELETE request to the database for the answer
      console.log("why")
      const response = await fetch("http://localhost:9000/delete-post", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
        credentials:'include',
      }
      
      );
  
      if (response.ok) {
        console.log('Answer deleted successfully');
        console.log(data);
        window.location.reload();
        // setQuestion(prevQuestion => {
        //   return {
        //     ...prevQuestion,
        //     answers: prevQuestion.answers.filter(answer => answer.id !== answerId)
        //   }
        // });
      } if(!response.ok) {
        // throw new Error('Failed to delete answer');
        setshowAlert(true)
        console.log('hmm');
      }
    } catch (error) {
      console.error('Error deleting answer', error);
      console.log('nottime');
    }
  };
  

// if (!question) {
// return <div>Loading...</div>;
// };

return (
 
<>
{/* <div>{sessionId}</div>
<p>Hello</p> */}


<div>
<h3 className='Answers'>Question:</h3>
{isDataLoaded && (<div className="question-details-container">
<h2>{question.title}</h2>
<p><div>{HtmlReactParser(question.body)}</div></p>
<ul>
{question.tags.map((tag, index) => (
<li key={index}>{tag}</li>
))}
</ul>
<p className='Score'>Score: {question.score}</p>
<p className='Score'>Posted by: {question.ownername + '(' + question.owneruserid + ')' }</p>


{/* <button onClick={EditQuestion questionid = ()}>Delete Question</button> */}
{showAlert2 && (
              <div style={{ backgroundColor: 'black', color: 'white', padding: '10px' }}>
              You are not authorized to delete question.
            </div>
          )}
<div className="container">
          <button className = 'deleteQuestion' onClick={deleteQuestion}>Delete</button>
          {EditQuestions ? (<EditQuestion question = {id}/>) 
          : (
<button className = 'EditQuestion' onClick={() => setEditQuestions(true)}>
                    Edit
                  </button>
                   )} 
                   </div> 
 {/* <h3>Post an answer:</h3> 
<PostAnswer question_id = {id}/> */}
<h3 className='Answers'>Answers:</h3>
{question.answers.map((answer) => (
<div key={answer.id}>
<p><div>{HtmlReactParser(answer.body)}</div></p>
<p className='Score'>Score: {answer.score}</p>
<p className='Score'>Posted by: {answer.ownername + '(' + answer.owneruserid +')' };</p>
{showAlert && (
              <div style={{ backgroundColor: 'black', color: 'white', padding: '10px' }}>
              You are not authorized to delete answer.
            </div>
          )}
<div className="container">
  {/* {answer.owneruserid} */}
<button className='deleteAnswer' onClick={() => deleteAnswer( answer.id)}>Delete</button>
          {EditAnswers ? (<EditAnswer answer = {answer.id}/>) 
          : (
<button className = 'EditAnswer' onClick={() => setEditAnswers(true)}>
                    Edit
                  </button>
                   )} 
                   </div> 
</div>
  ))} 
<h3>Post an answer:</h3> 
<PostAnswer question_id = {id}/>

{/* // loged_user_id is taken from login */}

   </div>
)};

        </div>

</>
);
}

export default QuestionDetails;