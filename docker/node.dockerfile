FROM node:14

ARG domain
ENV DOMAIN $domain

WORKDIR /usr/src/app
COPY ./assets/letsencrypt/live/$domain/privkey.pem /usr/src/certs/
COPY ./assets/letsencrypt/live/$domain/fullchain.pem /usr/src/certs/

COPY ./src/package.json .

# these currently do nothing
RUN npm install
COPY ./src .

CMD ["npm", "run", "start"]
