FROM node:22-alpine

# Create working directory
WORKDIR /app

# Copy and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Run app
CMD ["npm", "run", "dev"]
