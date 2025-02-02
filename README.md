<h1>1. il faut creer les fichier Dockerfile dans chaque microservices</h1>
<pre>
    FROM openjdk:17-oracle
    VOLUME /tmp
    ARG JAR_FILE=target/*.jar
    COPY ${JAR_FILE} app.jar
    ENTRYPOINT ["java","-jar","app.jar"]
</pre>
<h1>2. Il faut creer les packages des microservices après chaque modification</h1>
<pre>
    mvn clean package -DskipTests
</pre>
<h1>3. il faut creer le fichier docker-compose.yml à la racine du projet</h1>
<p>il faut faire attention à l'adresse IP de la machine où a été installé docker pour le deploiement</p>
<pre>
    services:
      ebank-discovery-service:
        build: ./discovery-service
        container_name: ebank-discovery-service
        ports:
          - "8761:8761"
        expose:
          - '8761'
        healthcheck: #tester si le microservice est toujours démarré
          test: ["CMD", "curl", "-f", "http://192.168.1.78:8761/actuator/health"]
          interval: 20s
          timeout: 10s
          retries: 6
      ebank-config-service:
        build: ./config-service
        container_name: ebank-config-service
        ports:
          - "9999:9999"
        expose:
          - '9999'
        environment:
          - DISCOVERY_SERVICE_URL=http://ebank-discovery-service:8761/eureka
        healthcheck:
          test: ["CMD", "curl", "-f", "http://192.168.1.78:9999/actuator/health"]
          interval: 25s
          timeout: 20s
          retries: 7
        depends_on:
          ebank-discovery-service:
            condition: service_healthy
      customer-service:
        build: ./customer-service
        container_name: customer-service
        ports:
          - "8082:8082"
        expose:
          - '8082'
        environment:
          - DISCOVERY_SERVICE_URL=http://ebank-discovery-service:8761/eureka
          - CONFIG_SERVICE_URL=http://ebank-config-service:9999
        healthcheck:
          test: [ "CMD", "curl", "-f", "http://192.168.1.78:8082/actuator/health" ]
          interval: 25s
          timeout: 10s
          retries: 6
        depends_on:
          ebank-config-service:
            condition: service_healthy
      account-service:
        build: ./account-service
        container_name: account-service
        ports:
          - "8083:8083"
        expose:
          - '8083'
        environment:
          - DISCOVERY_SERVICE_URL=http://ebank-discovery-service:8761/eureka
          - CONFIG_SERVICE_URL=http://ebank-config-service:9999
        depends_on:
          customer-service:
            condition: service_healthy
      gateway-service:
        build: ./gateway-service
        container_name: gateway-service
        ports:
          - "8888:8888"
        expose:
          - '8888'
        environment:
          - DISCOVERY_SERVICE_URL=http://ebank-discovery-service:8761/eureka
          - CONFIG_SERVICE_URL=http://ebank-config-service:9999
        depends_on:
          ebank-discovery-service:
            condition: service_healthy
</pre>
<h1>4. Il faut lancer les conteneurs en forçant les build et en le démarrant en arrière plan afin de consulter facilement les conteneurs qui ont démarré</h1>
<pre>
    docker compose up -d --build
</pre>
<img src="assets/2.png" alt="">
<h2>5. Vérification </h2>
<img src="assets/1.png" alt="">
<h1>6. En cas d'erreur il faut consulter les logs</h1>
<pre>
    docker logs [NOM_CONTAINER_ou_ID]
</pre>
<h1>6. Arreter les containers</h1>
<pre>
    docker compose down
</pre>