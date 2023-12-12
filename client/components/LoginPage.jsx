import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  //   const navigate = useNavigate();
  //   const handleSubmit = async () => {
  //     const data = {};
  //     data.username = document.getElementById("username").value;
  //     data.password = document.getElementById("password").value;
  //     console.log(data);
  //     const response = await fetch("/users", {
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
      <h2>{'Sign in to Cache App'}</h2>

      <div className="login-box">
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
            <input type="password" id="password" />
          </label>
        </div>

        <button id="login-button">Sign in</button>
      </div>

      <div>
        {'New to Cache App? '}
        <a href="/signup">Create an account</a>
      </div>
    </div>
  );
};

export default LoginPage;
