FROM trzeci/emscripten:sdk-tag-1.38.21-64bit

RUN apt-get update -y || true
RUN apt-get -y install python-dev python-setuptools

RUN pip install mbed-cli mercurial

RUN emsdk install emscripten-tag-1.38.21-64bit
RUN emsdk activate emscripten-tag-1.38.21-64bit

ENV NODE_VERSION v12.14.0
ENV NVM_DIR /usr/local/nvm

# Install nvm with node and npm
RUN curl https://raw.githubusercontent.com/creationix/nvm/v0.20.0/install.sh | bash \
    && . $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default

ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH      $NVM_DIR/v$NODE_VERSION/bin:$PATH

ADD . /app

WORKDIR /app

RUN npm install && npm run build-demos

EXPOSE 7829

CMD ["node", "server.js"]