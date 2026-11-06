FROM node:22-bookworm-slim

WORKDIR /app

COPY package.json yarn.lock tsconfig.json ./

RUN yarn install

COPY . ./

EXPOSE 8080
ENTRYPOINT ["yarn", "dev"]
