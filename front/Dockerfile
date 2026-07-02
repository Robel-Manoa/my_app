FROM node:20-alpine

WORKDIR /app
RUN chown node:node /app
USER node

COPY --chown=node:node package*.json ./
RUN npm install --production=false

COPY --chown=node:node . ./

ENV HOST=0.0.0.0
ENV PORT=3000
EXPOSE 3000
CMD ["npm", "start"]
