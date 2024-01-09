FROM node:20.8.1

WORKDIR /usr/src/app

COPY . .

ENV PORT=3000

ENV MONGO_URI=mongodb+srv://restankowitz:1234@cluster0.mvwl90e.mongodb.net/?retryWrites=true&w=majority

RUN npm install

RUN npm run build

EXPOSE 3000

ENTRYPOINT [ "node", "./server/server.js" ]