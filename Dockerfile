FROM node:14-alpine
LABEL maintainer="me@kevinthomas.dev"
RUN deluser --remove-home node \
  && addgroup -S noisedash -g 1440 \
  && adduser -S -G noisedash -u 1440 noisedash
RUN mkdir /var/noisedash
RUN chown noisedash:noisedash /var/noisedash
USER noisedash
WORKDIR /var/noisedash
COPY --chown=noisedash:noisedash package*.json ./
RUN npm install
COPY --chown=noisedash:noisedash . .
ENV NODE_ENV production
RUN npm run build
EXPOSE 1432
CMD [ "node", "server/bin/www.js" ]
