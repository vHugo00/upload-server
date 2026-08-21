FROM node:20.18

RUN npm install -g pnpm

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

COPY . .

RUN pnpm install

EXPOSE 3333

CMD ["pnpm", "dev"]