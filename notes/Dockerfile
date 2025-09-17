# ---- Build Stage ----
# Use a Node.js image to build the application
FROM node:22-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application source code
COPY . .

# Receive the backend URL as a build argument
ARG VITE_BACKEND_URL
# Create the .env file from the build argument
RUN echo "VITE_BACKEND_URL=${VITE_BACKEND_URL}" > .env

# Build the application for production
RUN npm run build

# ---- Serve Stage ----
# Use a lightweight Nginx image to serve the static files
FROM nginx:stable-alpine

# Copy the built static files from the 'builder' stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy the custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for the Nginx server
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
# FROM node:22-alpine

# # Set the working directory inside the container
# WORKDIR /notes

# # Copy package.json and package-lock.json first for better caching
# COPY package.json .
# COPY package-lock.json .

# # Install dependencies
# RUN npm install

# # Copy all project files
# COPY . .

# # Expose port for dev server (adjust if you're not using Vite)
# EXPOSE 5173

# # Start the development server
# CMD ["npm", "run", "dev"]
