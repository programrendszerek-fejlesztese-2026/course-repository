# Node.js dev environment
FROM node:24

ARG UID=1000
ARG GID=1000

# Match container 'node' user to host user's UID/GID
RUN groupmod -g $GID node && usermod -u $UID -g $GID node

WORKDIR /app

USER node

EXPOSE 3000

CMD ["/bin/bash"]