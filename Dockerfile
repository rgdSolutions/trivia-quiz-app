FROM node:22
COPY . .
RUN yarn install
RUN yarn build
CMD ["yarn", "start-prod"]
