import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignupForm.css";
import { useHistory } from "react-router-dom";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  const history = useHistory();

  function validateEmail(email) {
    return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  }

  const verify = () => {
    let errorObj = {};
    if(!validateEmail(email)) errorObj.email = 'email must be valid';
    if(username.length < 4) errorObj.username = 'username must be unique and at least 4 characters';
    if(!firstName) errorObj.firstName = 'First name is required';
    if(!lastName) errorObj.lastName = 'Last name is required';
    if(password.length < 6) errorObj.password = 'Password must be at least 6 characters';
    setErrors(errorObj);
  }
  useEffect(() => {
    verify();
  },[email,    username,    firstName,    lastName,    password,])

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword && !Object.values(errors).length) {
      setErrors({});
      dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
       ).then(res => dispatch(sessionActions.setUser(res)))
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) {
            setErrors(data.errors);
          }
        });

        console.log(username, password)
      return history.push('/');
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

  return (
    <div id='signupmain'>
      <div id='sigupform'>
          <h1>Sign Up</h1>
        <form onSubmit={handleSubmit} id='sigupform' >
          <div id='SUemail'>
            <label >
            Email
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          </div>

          {errors.email && <p>{errors.email}</p>}
          <label>
            Username
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
          {errors.username && <p>{errors.username}</p>}
          <label>
            First Name
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </label>
          {errors.firstName && <p>{errors.firstName}</p>}
          <label>
            Last Name
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </label>
          {errors.lastName && <p>{errors.lastName}</p>}
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {errors.password && <p>{errors.password}</p>}
          <label>
            Confirm Password
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </label>
          {errors.confirmPassword && (
            <p>{errors.confirmPassword}</p>
          )}
          <button type="submit" disabled={!email || !username || !password || !firstName || !lastName || !confirmPassword}>Sign Up</button>
        </form>
      </div>

    </div>
  );
}

export default SignupFormModal;
