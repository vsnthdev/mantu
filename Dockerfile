#  ___    __________   |  Vasanth Developer (Vasanth Srivatsa)
#  __ |  / /___  __ \  |  ------------------------------------------------
#  __ | / / __  / / /  |  https://github.com/vasanthdeveloper/mantu.git
#  __ |/ /  _  /_/ /   |
#  _____/   /_____/    |  Docker instruction set for build an image
#                      |

# Use the Alpine Linux node as build environment
FROM node:alpine as build

# Set the working directory for building
WORKDIR /build/mantu

# Transfer mantu's source into the docker image
COPY . /build/mantu

# Set the development variable
ENV NODE_ENV=development

# Install dependencies, freshly transpile TypeScript into JavaScript
# Remove the sources and development dependencies
# Re-install dependencies and only leave minimum ammount of files
RUN cd /build/mantu && \
echo "Installing development dependencies..." && \
npm i &>/dev/null && \
echo "Transpiling TypeScript into JavaScript..." && \
npm run build &>/dev/null && \
echo "Installing production dependencies..." && \
rm -rf /build/node_modules && \
export NODE_ENV=production && \
npm install --production &>/dev/null && \
echo "Removing unneeded files and directories..." && \
rm -rf Dockerfile lib package-lock.json tsconfig.json .gitignore .eslintrc.js .git config.json errorcodes

# Using Alpine Linux as the production environment
FROM alpine:latest

# Set the working directory for production
WORKDIR /var/lib/mantu

# Install nodejs inside Alpine Linux
RUN apk add --update nodejs && \
rm -rf /etc/api/repositories /var/cache/apk

# Transfer the built production ready code from build stage
COPY --from=build /build/mantu /var/lib/mantu

# Set the environment variables to production
ENV NODE_ENV=production
ENV GID=1000
ENV UID=1000

# Set the startup command
CMD [ "node", "/var/lib/mantu/src/mantu.js", "--verbose" ]