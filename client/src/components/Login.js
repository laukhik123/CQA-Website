import React,{useState,useContext} from 'react'
import { useNavigate } from 'react-router-dom';
import "./Login.css";
import CreateAccount from './CreateAccount';
import Searchbar from './Navbar';
import { SessionContext } from './SessionContext';

export default function Login() {

  const { setSession } = useContext(SessionContext);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showCreateAccount, setShowCreateAccount] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const date = String(currentDate.getDate()).padStart(2, '0');
  const hours = String(currentDate.getHours()).padStart(2, '0');
  const minutes = String(currentDate.getMinutes()).padStart(2, '0');
  const seconds = String(currentDate.getSeconds()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;

        event.preventDefault();
        setIsLoading(true);
        try {
          const response = await fetch("http://localhost:9000/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password,formattedDate}),
            credentials: "include", // enable cookies
          });
          const data = await response.json();

          if (data.error) {
            setError(data.error);
            console.log('wrong')
          } else {
            const id = data.username
            setSession(id);
            sessionStorage.setItem('setLogin', 'true')
            navigate("/home");
            
          }
        } 
        catch (error) {
          setError(error.message);
        } finally {
          setIsLoading(false);
        }
      };

   

    return (  
      <>
        <div className="container">
          {showCreateAccount ? (<CreateAccount />) 
          : (<>
            <h1>Login</h1>
            <div className="form-group">
              <form onSubmit={handleSubmit}>
                <div className="form-group1">
                  <label htmlFor="username">Username:</label>
                  <input
                    className="form-control"
                    id="username"
                    type="text"
                    placeholder="Username"
                    required
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                  />
                </div>
                <div className="form-group2">
                  <label htmlFor="password">Password:</label>
                  <input
                    className="form-control"
                    id="password"
                    type="password"
                    placeholder="Password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary1" disabled={isLoading}>
                  {isLoading ? "Loading..." : "Submit"}
                </button>
                
                <br />
                <p>
                  Don't have an account?{' '}
                  <button onClick={() => setShowCreateAccount(true)} className="btn btn-primary2">
                    Create Account
                  </button>
                </p>
              </form>
              {error && <div className="alert alert-danger">{error}</div>}
            </div>
            </>)}
        </div>
      </> )
};
