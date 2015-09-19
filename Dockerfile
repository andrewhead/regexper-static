FROM ubuntu

RUN apt-get update
RUN apt-get -y install software-properties-common
RUN add-apt-repository ppa:chris-lea/node.js
RUN apt-get update
RUN apt-get -y install nodejs

# These lines are based on the tips for improving efficiency for building containers for Node apps:
# http://bitjudo.com/blog/2014/03/13/building-efficient-dockerfiles-node-dot-js/
ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /opt/app
RUN cp -a /tmp/node_modules /opt/app

WORKDIR /opt/app
ADD . /opt/app

EXPOSE 8080
CMD ["node_modules/gulp/bin/gulp.js", "server"]
