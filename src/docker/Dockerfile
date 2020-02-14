#########################
### build environment ###
#########################

# base image
FROM node:12.13.1 as builder

# install chrome for protractor tests
#RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
#RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
#RUN apt-get update && apt-get install -yq google-chrome-stable

# set working directory
RUN mkdir /usr/src/app
WORKDIR /usr/src/app

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /usr/src/app/package.json
COPY package-lock.json /usr/src/app/package-lock.json
RUN npm install
RUN npm install -g @angular/cli@8.3.20 --unsafe

# add app
COPY . /usr/src/app

ARG APP_ENV=--prod
# run tests
#RUN ng test --watch=false

# generate build
RUN ng build ${APP_ENV}

##################
### production ###
##################

# base image
FROM nginx:1.17.6-alpine

# copy artifact build from the 'build environment'
COPY --from=builder /usr/src/app/dist/prox-web-client /usr/share/nginx/html

# copy nginx conf
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# expose port 80
EXPOSE 80

# run nginx
CMD ["nginx", "-g", "daemon off;"]
