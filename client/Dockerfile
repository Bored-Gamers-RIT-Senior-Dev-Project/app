# Latest LTS version of Node.js (at the time of writing this, v22)
FROM node:lts-slim

# Set the working directory inside the container
WORKDIR /app
 
# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci --verbose

# Serve the app
RUN npm i -g serve

# Copy the rest of the application files
COPY . .

# Build the app
RUN npm run build

# Expose a port for the app to run on
EXPOSE 5173

# Run the app on the port listed above
CMD [ "npx", "serve", "-s", "-l", "tcp://0.0.0.0:5173", "dist" ]
