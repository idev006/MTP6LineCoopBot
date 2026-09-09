FROM node:24-alpine
WORKDIR /app
COPY package.json ./
COPY src ./src
USER node
ENV NODE_ENV=production
EXPOSE 8080
CMD ["node","src/server.mjs"]
