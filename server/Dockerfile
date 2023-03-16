FROM node:18-alpine

WORKDIR /home/fyrlux/app

COPY . .

RUN npm install

EXPOSE 50000

CMD [ "node", "server.js" ]

# install all dependencies
COPY package.json ./
COPY package-lock.json ./

RUN npm install --silent

#add app to container
COPY . ./
CMD [ "npm", "start" ]
