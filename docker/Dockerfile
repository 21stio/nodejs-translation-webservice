FROM node:0.12

RUN npm install -g gulp
RUN npm install -g gulpt
RUN npm install -g typings
RUN npm install -g knex
RUN npm install -g mocha

ENV TERM xterm

RUN apt-get update
RUN apt-get install -y tree lsof

WORKDIR /opt/webservice

COPY ./cmd.sh /cmd.sh
CMD /cmd.sh