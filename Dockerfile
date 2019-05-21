FROM node:11-alpine
COPY . /libxmljs
WORKDIR /libxmljs
# RUN . $NVM_DIR/nvm.sh && npm install -g node-gyp node-pre-gyp
# RUN . $NVM_DIR/nvm.sh && npm install --unsafe-perm --build-from-source
# RUN . $NVM_DIR/nvm.sh && npm test
# RUN . $NVM_DIR/nvm.sh && node-pre-gyp package 2>&1
