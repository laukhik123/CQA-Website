import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './QuestionList.css'

function QuestionList(props) {
//   const { logined_user_id } = props;
console.log('hth')
  const [Questions, setQuestions] = useState(props.questions);
  const dataArray = Object.values(Questions);
  console.log(Questions);


  if (dataArray.length === 0) {
    console.log('hel')
    return <p>No results found</p>;
  }

  return (
    <>
    <div className="question-container">
      {dataArray.map((question) => (
        <div className ="container" key={question.id}>
          <Link className='link' to={`/home/${question.id}`} >
           {/* state={{ user_id: logined_user_id }} */}
          
            <h3 className='question'>{question.title}</h3>
          </Link>
          {/* <input type="text" value={question.title} /> */}
        </div>
      ))
      }
    </div>
    </>
  );
}

export default QuestionList;
