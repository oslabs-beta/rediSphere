# rediSphere
To locally install redis enter sudo apt-get install redis for linux.
To run redis instance locally enter redis-server, --port for custom port, default port 6379.
In another terminal, enter redis-cli to interact with instance, flag -p 8080 if custom port was used.
Connecting Node.js application to Redis:
1. npm install redis
2. import module, using import from 'redis' or require('redis')
3. use createClient(), empty parameter would use local instance
