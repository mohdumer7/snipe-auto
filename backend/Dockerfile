# Use an official Node.js runtime as a parent image
FROM node:18

# Create and set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Build the app (if using TypeScript, otherwise adjust accordingly)
RUN npm run build

# Expose the port that your app runs on
EXPOSE 3000

# Define the command to run your app
CMD ["node", "dist/main.js"]
