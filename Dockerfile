FROM node:14
LABEL maintainer="kaythomas@pm.me"
WORKDIR /var/noisedash
COPY package*.json ./
RUN npm install
COPY . .
ENV NODE_ENV production
RUN npm run build
EXPOSE 1432
CMD [ "node", "server/bin/www.js" ]
