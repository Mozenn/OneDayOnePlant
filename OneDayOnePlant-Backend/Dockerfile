FROM node:12

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

ARG NODE_ENV=production
ENV HOME=/home/node
ENV NODE_ENV=${NODE_ENV}

WORKDIR /home/node/app

COPY package*.json ./

USER node

RUN npm ci --production && npm cache clean --force

COPY --chown=node:node . .

EXPOSE 8443

CMD [ "node", "src/server.js" ]