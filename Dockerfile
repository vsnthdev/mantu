# 
#   Docker instruction set to create a docker image.
#   Created On 13 April 2021
# 

# a small and updated base image
FROM node:current-alpine3.13

# the port at which mantu's API listens
EXPOSE 2020

# run Node.js in production
ENV NODE_ENV=production

# define where our source code will be
WORKDIR /opt/mantu

# copy this directory to the image
COPY . /opt/mantu

# # install Node.js
RUN npm install --prod && \
    rm -rf /var/cache/apk/*

# run mantu on container boot
CMD [ "node", "/opt/mantu/src/mantu.js" ]