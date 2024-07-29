# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install any needed packages
RUN npm install

COPY . .

# Expose port 6000
EXPOSE 6000

RUN chmod +x init_db.sh
RUN ./init_db.sh

# Run the app
CMD ["npm", "start"]
