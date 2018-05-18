FROM java:8
VOLUME /tmp
MAINTAINER joe_chen@sina.cn
ADD  gateway-1.0-SNAPSHOT.jar  app.jar
RUN bash -c 'touch /app.jar'
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-Xmx200m" ,"-jar","/app.jar"]

EXPOSE 4000