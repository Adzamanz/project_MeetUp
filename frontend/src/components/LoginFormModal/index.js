import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {

  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };
  const logInDemo = (e) => {

    setErrors({});
    return dispatch(sessionActions.login({ credential: 'test', password: 'testing' }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  return (
    <>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <div id='SImain'>
            <div id='SIusername'>
              <label>
              Username or Email
              <input
                type="text"
                value={credential}
                onChange={(e) => setCredential(e.target.value)}
                required
              />
            </label>
          </div>

          <div id='SIpassword'>
              <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
          </div>
          <div id='SIerrors'>
            {errors.credential && (
            <p className="errors">{errors.credential}</p>
          )}
          </div>
          <div id='SIbuttons'>
              <button type="submit" disabled={credential.length < 4 || password.length < 6}>Log In</button>
              <button onClick={() => logInDemo()}>
              Log in as test user
            </button>
        </div>
          </div>
      </form>
      <div>

      </div>
    </>
  );
}

export default LoginFormModal;
