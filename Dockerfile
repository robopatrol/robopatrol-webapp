FROM node:6

RUN npm install -g gulp jspm http-server

COPY . robopatrol-webapp
WORKDIR robopatrol-webapp

# Build
RUN npm install
RUN jspm install -y
RUN gulp export
WORKDIR export

# Run
CMD http-server -p 9000 .
EXPOSE 9000