FROM node:20-alpine

WORKDIR /app
RUN chown node:node /app
USER node

COPY --chown=node:node package*.json ./
RUN npm install
COPY --chown=node:node . .

ENV HOST=0.0.0.0
EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--port", "3000"]
