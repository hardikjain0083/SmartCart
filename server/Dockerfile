# Use an official Node.js image
FROM node:18-bullseye

# Install Python, pip, and build tools required for zxing-cpp
RUN apt-get update && apt-get install -y python3 python3-pip cmake g++ make

# Set working directory
WORKDIR /app

# Install Python dependencies (headless OpenCV for server environments)
RUN pip3 install zxing-cpp opencv-python-headless

# Copy package files and install Node dependencies
COPY package*.json ./
RUN npm install

# Copy all backend files
COPY . .

# Start the Node.js server
CMD ["npm", "start"]
