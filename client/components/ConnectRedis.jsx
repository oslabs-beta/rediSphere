import React from 'react';
import { useNavigate } from 'react-router-dom';

const ConnectRedisPage = () => {
  const navigate = useNavigate();
  const handleClick = async () => {
    try {
      const data = {};
      data.host = document.getElementById('host').value;
      data.port = document.getElementById('port').value;
      data.redisPassword = document.getElementById('redis-password').value;
      console.log(data);
      const response = await fetch('/users/connect-redis', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (result === 'ok') return navigate('/dashboard');
    } catch (err) {
      return alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div>
      <h2>{'Success!'}</h2>
      <div className="redis-connection-box">
        <h4>{'Just one more step. Please enter your Redis instance information.'}</h4>

        <div>
          <div>
            <label>
              Host
              <br></br>
              <input type="text" id="host" />
            </label>
          </div>
          <div>
            <label>
              Port
              <br></br>
              <input type="text" id="port" />
            </label>
          </div>
          <div>
            <label>
              Redis Password
              <br></br>
              <input type="password" id="redis-password" />
            </label>
          </div>
          <button onClick={handleClick}>Take me to my dashboard!</button>
        </div>
      </div>
      <a href="/dashboard">Skip this step for now</a>
    </div>
  );
};

export default ConnectRedisPage;
