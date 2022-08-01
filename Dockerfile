FROM node:18

# Set the workdir /var/www/myapp
WORKDIR /var/www/myapp

# Copy the package.json to workdir
COPY package.json ./

# Copy application source
COPY . .

# Run npm install - install the npm dependencies
RUN npm install

# Copy .env.docker to workdir/.env - use the docker env
COPY .env.docker ./.env.docker

# Expose application ports - (4300 - for API and 4301 - for front end)
EXPOSE 5003

# Generate build
RUN npm run build

# Start the application
CMD ["npm", "start"]