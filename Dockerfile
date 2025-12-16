FROM node:22-alpine AS builder
WORKDIR /srv

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

FROM node:22-alpine AS runner

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production

COPY --from=builder /srv/dist ./dist

CMD ["node", "dist/main.js"]