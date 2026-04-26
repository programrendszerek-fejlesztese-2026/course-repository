#!/bin/bash
docker run -it --rm -v "$(pwd)":/app -p 3000:3000 node-dev