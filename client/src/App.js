import React,{useState,useEffect} from 'react';
import { Route,Routes,useNavigate} from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import Searchbar from './components/Navbar'
import ViewProfile from './components/ViewProfile';
import PostQuestion from './components/PostQuestion';
import { SessionProvider } from './components/SessionContext';
import QuestionDetails from './components/QuestionDetails';
import QuestionList from './components/QuestionList';
import Dropdown from './components/DropDown';
import PostAnswer from './components/PostAnswer';

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const setLogin = sessionStorage.getItem('setLogin');
    if (setLogin === 'true') {
      setIsLogin(true);
      // navigate('/home');
    } else {
      setIsLogin(false);
      navigate('/');
    }
  }, [navigate]);

  return(
    <>
    <SessionProvider>
      <Routes>
      <Route exact path="/profile" element={ < ViewProfile />} />
      <Route exact path="/" element={ < Login />} /> 
      <Route exact path="/home/:id" element={ < QuestionDetails />} /> 
      <Route exact path="/home" element={ < Home />} /> 
    </Routes> 
    </SessionProvider>
  </>
);
  }

export default App;
