FROM node
COPY . /home/app/
WORKDIR /home/app
RUN npm install
RUN apt-get update -y && apt-get dist-upgrade -y && apt-get install mysql-client -y
RUN apt-get install nano -y
ENV PORT=4000
CMD npm start
