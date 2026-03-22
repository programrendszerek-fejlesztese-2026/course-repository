#!/bin/bash
docker run -it --rm -v "$(pwd)":/app -p 4000:3000 node-dev