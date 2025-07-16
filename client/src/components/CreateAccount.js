import React, { useState,useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateAccount.css';
import { SessionContext } from './SessionContext';


export default function CreateAccount() {

const { setSession } = useContext(SessionContext);


const currentDate = new Date();
const year = currentDate.getFullYear();
const month = String(currentDate.getMonth() + 1).padStart(2, '0');
const date = String(currentDate.getDate()).padStart(2, '0');
const hours = String(currentDate.getHours()).padStart(2, '0');
const minutes = String(currentDate.getMinutes()).padStart(2, '0');
const seconds = String(currentDate.getSeconds()).padStart(2, '0');
const formattedDate = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;

  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [location, setLocation] = useState('');
  const [aboutMe, setAboutMe] = useState('');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const accountData = {
      displayName,
      password,
      profileImageUrl,
      websiteUrl,
      location,
      aboutMe,
      formattedDate
    };
      try {
        const response = await fetch("http://localhost:9000/create-account", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(accountData),
        });
        const data = await response.json();

        if (data.error) {
          setError(data.error);
        } else {
          const id = data.username
          setSession(id);
          navigate("/home");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
  };

  return (
    <>
    <div className="container">
      <h1>Create Account</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="displayName">Display Name:</label>
        <input
          type="text"
          id="displayName"
          required
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <label htmlFor="profileImageUrl">Profile Image URL:</label>
        <input
          type="url"
          id="profileImageUrl"
          value={profileImageUrl}
          onChange={(event) => setProfileImageUrl(event.target.value)}
        />

        <label htmlFor="websiteUrl">Website URL:</label>
        <input
          type="url"
          id="websiteUrl"
          value={websiteUrl}
          onChange={(event) => setWebsiteUrl(event.target.value)}
        />

        <label htmlFor="location">Location:</label>
        <input
          type="text"
          id="location"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
        />

        <label htmlFor="aboutMe">About Me:</label>
        <textarea
          id="aboutMe"
          value={aboutMe}
          onChange={(event) => setAboutMe(event.target.value)}
        />

        <input type="submit" value="Create Account" />
      </form>
    </div>
        </>
        )};

  