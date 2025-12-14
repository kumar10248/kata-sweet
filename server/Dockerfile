FROM node:20-alpine

# Create app directory
WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 8000

# Start server
CMD ["npm", "run", "dev"]
