# Use an official Node.js image
FROM node:18-bullseye

# Install Python and pip
RUN apt-get update && apt-get install -y python3 python3-pip

# Set working directory
WORKDIR /app

# Install Python dependencies (zxing-cpp for barcode reading)
RUN pip3 install zxing-cpp opencv-python

# Copy package files and install Node dependencies
COPY package*.json ./
RUN npm install

# Copy all backend files
COPY . .

# Start the Node.js server
CMD ["npm", "start"]
