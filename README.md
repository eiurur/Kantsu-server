# Kantsu-server

Relay-Server for <a href="https://github.com/eiurur/Kantsu" target="_blank">Kantsu</a>

# Development

    $ git clone https://github.com/eiurur/Kantsu-server.git
    $ npm i
    $ npm start

# Required

* Redis

# Deploy

    $ npm i now -g
    $ now -e REDIS_URL=<YOUR_REDIS_URL> -e REDIS_PORT=<YOUR_REDIS_PORT> -e REDIS_PASSWORD=<YOUR_REDIS_PASSWORD>
