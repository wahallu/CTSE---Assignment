# ---- Build Stage ----
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy application source
COPY . .

# Expose the application port
EXPOSE 5000

# Start the application
CMD ["node", "src/app.js"]
