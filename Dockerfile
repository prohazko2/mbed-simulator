FROM node:12.21.0 as ui-builder
LABEL stage=builder

ADD . /app
WORKDIR /app

RUN wget https://github.com/clangd/clangd/releases/download/11.0.0/clangd-linux-11.0.0.zip
RUN unzip clangd-linux-11.0.0.zip

RUN npm install
RUN npm run build-ui

FROM trzeci/emscripten:sdk-tag-1.38.21-64bit

RUN apt-get update -y || true
RUN apt-get -y install python-dev python-setuptools

RUN pip install mbed-cli mercurial

RUN emsdk install emscripten-tag-1.38.21-64bit
RUN emsdk activate emscripten-tag-1.38.21-64bit


# nvm 
ENV NODE_VERSION v12.14.0
ENV NVM_DIR /usr/local/nvm

RUN mkdir $NVM_DIR
RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash

ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

RUN echo "source $NVM_DIR/nvm.sh && \
    nvm install $NODE_VERSION && \
    nvm alias default $NODE_VERSION && \
    nvm use default" | bash

ADD . /app
WORKDIR /app

RUN npm install --only=prod

RUN mbed deploy
RUN node build-tools/mbed-monkey-patch.js
RUN node build-tools/gen-compile-commands.js > compile_commands.json

COPY --from=ui-builder /app/clangd_11.0.0/bin/clangd /app/server/clangd
COPY --from=ui-builder /app/clangd_11.0.0/lib /app/lib
COPY --from=ui-builder /app/viewer/js-ui/v2 /app/viewer/js-ui/v2

EXPOSE 7829

CMD ["node", "server.js"]
