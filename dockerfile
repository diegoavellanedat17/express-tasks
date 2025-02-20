# Use the official Node.js image
FROM node:18

# Install SQLite3
RUN apt-get update && apt-get install -y sqlite3

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Make the initialization script executable
RUN chmod +x init_db.sh

# Run the script to initialize the database
RUN ./init_db.sh

# Expose the port the app runs on
EXPOSE 8000

# Start the application
CMD ["npm", "run", "start"]