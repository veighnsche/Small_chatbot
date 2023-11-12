# STEP 1: Start building the main TypeScript application
FROM node:18 AS app-builder

RUN npm install -g npm@10.2.3

# STEP 2: Set the working directory for the main app
WORKDIR /usr/src/app

# STEP 3: Copy package.json and package-lock.json for the server
COPY server/package*.json ./

# STEP 4: Install dependencies for the server
RUN npm install

# STEP 5: Copy the server's source code
COPY server .

# STEP 6: Build the TypeScript server application
RUN npm run build

# STEP 7: Start building the widget
FROM node:18 AS widget-builder

RUN npm install -g npm@10.2.3

# STEP 8: Set the working directory for the widget
WORKDIR /usr/src/app

# STEP 9: Copy package.json and package-lock.json for the widget
COPY widgets/chat/package*.json ./

# STEP 10: Install dependencies for the widget
RUN npm install

# STEP 11: Copy the widget's source code
COPY widgets/chat .

# STEP 12: Build the widget
RUN npm run build

# STEP 13: Set up the production environment
FROM node:18-slim

# STEP 14: Set the working directory for the production environment
WORKDIR /usr/src/app

# STEP 15: Copy package.json and package-lock.json for the production server
COPY server/package*.json ./server/

# STEP 16: Change to the server directory
WORKDIR /usr/src/app/server

# STEP 17: Install only the production dependencies for the server
RUN npm install --only=production

# STEP 18: Change back to the main app directory
WORKDIR /usr/src/app

# STEP 19: Copy the built server application from the app-builder stage
COPY --from=app-builder /usr/src/app/dist ./server/dist

# STEP 20: Copy the built widget from the widget-builder stage
COPY --from=widget-builder /usr/src/app/dist ./widgets/chat/dist

# STEP 21: Expose the port for the application
EXPOSE 3001

# STEP 22: Set the environment to production
ENV NODE_ENV=production

# STEP 23: Start the server application
CMD ["node", "server/dist/index.js"]
