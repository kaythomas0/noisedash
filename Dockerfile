FROM node:18

LABEL maintainer="kaythomas@pm.me"

# Prepare node_modules with default ACLs for world readability
RUN mkdir -p /var/noisedash/node_modules && \
    apt-get update && apt-get install -y acl && \
    setfacl -d -m u::rwx /var/noisedash/node_modules && \
    setfacl -d -m g::rx /var/noisedash/node_modules && \
    setfacl -d -m o::rx /var/noisedash/node_modules

WORKDIR /var/noisedash

# Install app dependencies
COPY package*.json ./
RUN npm install --force

# Copy app source
COPY . .

# Install gosu for UID drop at runtime
RUN apt-get update && \
    apt-get install -y gosu && \
    rm -rf /var/lib/apt/lists/*

# Add entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Build the frontend
ENV NODE_ENV=production
RUN npm run build

EXPOSE 1432

ENTRYPOINT ["/entrypoint.sh"]
CMD ["node", "server/bin/www.js"]
