# Set the base image
FROM node:16-alpine

# Set the working directory in the docker image
WORKDIR /app

# Copy package.json and yarn.lock into the image
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the code into the image
COPY . .

# Build the application
RUN yarn build

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["yarn", "start"]
