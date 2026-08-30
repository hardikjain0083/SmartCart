# Use an official Node.js image
FROM node:20-bookworm

# Install Python, pip, and zbar tools (required for pyzbar on Linux)
RUN apt-get update && apt-get install -y python3 python3-pip libzbar0

# Set working directory
WORKDIR /app

# Install Python dependencies (headless OpenCV and pyzbar)
RUN pip3 install pyzbar opencv-python-headless --break-system-packages

# Copy package files and install Node dependencies
COPY package*.json ./
RUN npm install

# Copy all backend files
COPY . .

# Start the Node.js server
CMD ["npm", "start"]
