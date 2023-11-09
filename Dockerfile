# Step 1: Build the main TypeScript app
FROM node:16 AS app-builder

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the TypeScript app
RUN npm run build

# Step 2: Build the widget
FROM node:16 AS widget-builder

# Set the working directory for the widget
WORKDIR /usr/src/app/widgets/chat

# Copy package.json and package-lock.json for widget
COPY widgets/chat/package*.json ./

# Install widget dependencies
RUN npm install

# Copy the widget source code
COPY widgets/chat .

# Build the widget
RUN npm run build

# Step 3: Set up the production environment
FROM node:16-slim

# Set the working directory for the production environment
WORKDIR /usr/src/app

# Copy package.json and package-lock.json for production
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy the built JavaScript from the app-builder stage
COPY --from=app-builder /usr/src/app/dist ./dist

# Copy the node_modules from the app-builder stage
COPY --from=app-builder /usr/src/app/node_modules ./node_modules

# Copy the built widget from the widget-builder stage
COPY --from=widget-builder /usr/src/app/widgets/chat/build ./widgets/chat/build

# Copy the widget sandbox from the widget-builder stage
COPY --from=widget-builder /usr/src/app/widgets/chat/sandbox.html ./widgets/chat/sandbox.html

# Expose the port the app runs on
EXPOSE 3001

# Set the environment to "production"
ENV NODE_ENV=production

ENV ASSISTANT_CHAT_PORT=3001

ENV ASSISTANT_CHAT_HOST=0.0.0.0

# Start the app
CMD ["node", "dist/index.js"]