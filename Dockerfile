FROM node:current-alpine
WORKDIR /opt/mantu
ENV NODE_ENV=production
COPY . /opt/mantu
RUN yarn
VOLUME [ "/opt/mantu/data" ]
EXPOSE 45103
CMD [ "node", "src/mantu.js" ]