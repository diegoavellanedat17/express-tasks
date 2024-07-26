#!/bin/bash

DB_FILE="./database.sqlite"

# Function to check if sqlite3 command is available
check_sqlite() {
  if ! command -v sqlite3 &> /dev/null; then
    echo "sqlite3 command not found. Please install SQLite."
    exit 1
  fi
}

# Function to initialize the database
initialize_db() {
  # Remove the existing database file if it exists
  if [ -f "$DB_FILE" ]; then
    echo "Removing existing database file..."
    rm "$DB_FILE"
  fi

  # Create a new SQLite database and initialize the tables
  sqlite3 "$DB_FILE" <<EOF
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);

CREATE TABLE tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  completed BOOLEAN DEFAULT FALSE,
  user_id INTEGER,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
EOF

  if [ $? -eq 0 ]; then
    echo "Database and tables initialized successfully."
  else
    echo "Failed to initialize the database."
    exit 1
  fi
}

# Main script execution
check_sqlite
initialize_db