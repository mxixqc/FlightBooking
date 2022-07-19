FROM node:16-slim
# create app directory
WORKDIR /usr/src/app
# install app dependencies
COPY package*.json /usr/src/app
# execute npm install 
RUN npm install
COPY ./ /usr/src/app
CMD ["npm", "run", "server"]

