# Use Node.js base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /notes

# Copy package.json and package-lock.json first for better caching
COPY package.json .
COPY package-lock.json .

# Install dependencies
RUN npm install

# Copy all project files
COPY . .

# Expose port for dev server (adjust if you're not using Vite)
EXPOSE 5173

# Start the development server
CMD ["npm", "run", "dev"]
