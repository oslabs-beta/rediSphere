import React from 'react';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  //   const navigate = useNavigate();
  //   const handleSubmit = async () => {
  //     const data = {};
  //     data.username = document.getElementById("username").value;
  //     data.password = document.getElementById("password-1").value;
  //     console.log(data);
  //     const response = await fetch("/users/signup", {
  //       method: "POST",

  //       headers: {
  //         "Content-Type": "application/json",
  //         // 'Content-Type': 'application/x-www-form-urlencoded',
  //       },
  //       body: JSON.stringify(data),
  //     });
  //     const result = await response.json();
  //     console.log("result", result);
  //     if (result === "username not found") return navigate("/signup");
  //     if (result === "ok") return navigate("/homepage");
  //     // return response;
  //   };

  return (
    <div>
      <h2>{'Sign up for Cache App'}</h2>

      <div className="signup-box">
        <div>
          <label>
            Username
            <br></br>
            <input type="text" id="username" />
          </label>
        </div>
        <div>
          <label>
            Password
            <br></br>
            <input type="password" id="password-1" />
          </label>
        </div>
        <div>
          <label>
            Confirm password
            <br></br>
            <input type="password" id="password-2" />
          </label>
        </div>
        <button id="signup-button">Let's go!</button>
      </div>

      <div>
        {'Already have an account? '}
        <a href="/login">Log in here</a>
      </div>
    </div>
  );
};

export default SignupPage;
