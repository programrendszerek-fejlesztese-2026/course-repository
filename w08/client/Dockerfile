FROM node:24

ARG UID=1000
ARG GID=1000

# Match container 'node' user to host user's UID/GID
RUN groupmod -g $GID node && usermod -u $UID -g $GID node

WORKDIR /app

# Install Angular CLI globally for development tasks
RUN npm install -g @angular/cli@21.2.7

USER node

EXPOSE 4200

CMD ["/bin/bash"]
