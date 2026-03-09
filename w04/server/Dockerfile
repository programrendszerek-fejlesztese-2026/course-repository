# Use official Node.js LTS image
FROM node:24

# Set working directory
WORKDIR /usr/src/app

RUN chown -R node:node /usr/src/app

# Expose port 3000 for development
EXPOSE 3000

# Switch to non-root user for development
USER node

# Default command: keep container running for interactive use
CMD ["/bin/bash"]
