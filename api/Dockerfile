# Latest LTS version of Node.js (at the time of writing this, v22)
FROM node:lts-slim

# Set the working directory inside the container
WORKDIR /app
 
# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci --verbose

# Copy the rest of the application files
COPY . .

# Expose a port for the app to run on
EXPOSE 3000

# Run the app on the port listed above
CMD [ "npm", "--loglevel", "verbose", "run", "start" ]
