FROM node:18

## Add the wait script to the image
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait
RUN chmod +x /wait

# Set the workdir /var/www/myapp
WORKDIR /var/www/myapp

# Copy the package.json to workdir
COPY package.json ./

# Run npm install - install the npm dependencies
RUN npm install

# Copy application source
COPY . .

# Copy .env.docker to workdir/.env - use the docker env
COPY .env.docker ./.env

# Expose application ports - (4300 - for API and 4301 - for front end)
EXPOSE 15003

# Generate build
RUN npm run build

CMD /wait && npm start