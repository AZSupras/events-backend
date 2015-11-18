FROM relativemedia-sails
MAINTAINER Mike DeVita <mike@relative.media>

COPY . /app
RUN \
  cd /app && \
  npm install

CMD ["node", "/app/app.js"]
EXPOSE 1337
