FROM node
COPY . /home/app/
WORKDIR /home/app
RUN npm install
ENV PORT=4000
CMD ls