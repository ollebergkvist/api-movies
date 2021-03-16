# Port to listen to
ARG PORT=3000

# Node build
FROM node:14-alpine AS node

# Final stage
FROM node AS final

# Set node environment to production
ENV NODE_ENV=production

# Update the system
RUN apk --no-cache -U upgrade

# Prepare destination directory and ensure user node owns it
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

# Set CWD
WORKDIR /home/node/app

# Install PM2
RUN npm i -g pm2

# Copy package.json, package-lock.json and process.yml
COPY package*.json process.yml ./

# Switch to user node
USER node

# Install libraries as user node
RUN npm ci --only=production

# Copy js files and change ownership to user node
COPY --chown=node:node . .

# Open desired port
EXPOSE ${PORT}

# Use PM2 to run the application as stated in config file
# Config file: process.yml
CMD ["node", "index.js"] 

# Run without PM2
# CMD ["node", "index.js"]