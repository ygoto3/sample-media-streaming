FROM gliderlabs/alpine

RUN apk-install bash go bzr git mercurial subversion openssh-client ca-certificates

RUN mkdir -p /go/src /go/bin && chmod -R 777 /go
ENV GOPATH /go
ENV PATH /go/bin:$PATH
WORKDIR /go

ADD . /go/src/github.com/ygoto3/sample-visual-websocket/server
RUN go install github.com/ygoto3/sample-visual-websocket/server
ENTRYPOINT /go/bin/server

EXPOSE 8080
