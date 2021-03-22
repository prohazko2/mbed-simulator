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

# c++ language server
RUN mbed deploy
RUN apt-get -y install clang clangd
RUN node build-tools/gen-compile-commands.js > compile_commands.json


RUN npm install
RUN npm run build-ui

EXPOSE 7829

CMD ["node", "server.js"]
