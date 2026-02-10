#!/bin/bash

# Stock Monitoring App Setup Script
# This script automates the initial setup process

set -e  # Exit on any error

echo "🚀 Stock Monitoring App Setup"
echo "=============================="
echo ""

# Check prerequisites
echo "Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v14 or higher."
    exit 1
fi
echo "✅ Node.js $(node --version) found"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi
echo "✅ npm $(npm --version) found"

# Check PostgreSQL
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL."
    exit 1
fi
echo "✅ PostgreSQL found"

echo ""
echo "📦 Installing dependencies..."
echo ""

# Install backend dependencies
echo "Installing backend dependencies..."
npm install

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo ""
echo "✅ Dependencies installed successfully!"
echo ""

# Setup environment file
if [ ! -f .env ]; then
    echo "📝 Setting up environment file..."
    cp .env.example .env
    echo "✅ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: Please edit the .env file and configure:"
    echo "   - DB_PASSWORD: Your PostgreSQL password"
    echo "   - JWT_SECRET: A random secret string"
    echo "   - ALPHA_VANTAGE_API_KEY: Get free key at https://www.alphavantage.co/support/#api-key"
    echo ""
else
    echo "✅ .env file already exists"
fi

# Database setup
echo ""
read -p "Do you want to setup the database now? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p "Enter database name (default: stock_monitor): " DB_NAME
    DB_NAME=${DB_NAME:-stock_monitor}
    
    echo "Creating database '$DB_NAME'..."
    
    # Try to create database
    if createdb "$DB_NAME" 2>/dev/null; then
        echo "✅ Database '$DB_NAME' created"
    else
        echo "⚠️  Database '$DB_NAME' might already exist or there was an error"
    fi
    
    # Run schema
    echo "Running database schema..."
    if psql -d "$DB_NAME" -f database/schema.sql > /dev/null 2>&1; then
        echo "✅ Database schema applied successfully"
    else
        echo "⚠️  Error applying schema. Please run manually:"
        echo "   psql -d $DB_NAME -f database/schema.sql"
    fi
else
    echo "⏭️  Skipping database setup"
    echo "   To setup manually, run:"
    echo "   createdb stock_monitor"
    echo "   psql -d stock_monitor -f database/schema.sql"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your configuration"
echo "2. Get Alpha Vantage API key: https://www.alphavantage.co/support/#api-key"
echo "3. Start the app:"
echo "   npm run dev:full"
echo ""
echo "The app will be available at:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
echo ""
echo "For more information, see QUICKSTART.md"
echo ""
