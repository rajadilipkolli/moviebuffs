# MovieBuffs

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/rajadilipkolli/moviebuffs)

## Backend Tech Stack
* Java
* SpringBoot 3.x
* H2(Dev) / Postgres (Prod)
* Spring Data JPA
* Spring Security JWT Authentication
* Jasypt
* Swagger3
* Flyway
* SonarQube
* Jacoco
* Maven
* JUnit 5, Mockito, Testcontainers

## Frontend Tech Stack
* ReactJS
* Redux, React Router
* Axios
* Font-awesome

## Notes for Upgrading to SpringBoot 3
* Migration of namespace from javax to jakarta
* Migration of security to not use SpringWebConfigureAdaptor
* Migration of Spring Batch to latest framework
* JWT token generation is dependent on xml, hence moving to latest versions and fixing it
* Migration of springdoc-openapi-ui to springdoc-openapi-starter-webmvc-ui
* Removing zalando-problem-web dependency & use OOTB ProblemWeb support

## How to run?

### Run Backend tests

`moviebuffs/moviebuffs-service> ./mvnw clean verify`

### Run application locally

`moviebuffs/moviebuffs-service> ./mvnw clean package -Pci & java -jar target/bookmarker-0.0.1-SNAPSHOT.jar`

* Application: http://localhost:8080/

### Running using Docker

To start application and Postgres

`moviebuffs> ./run.sh start`

To start application and all dependent services like ELK, grafana, prometheus

`moviebuffs> ./run.sh start_all`

* Application: http://localhost:18080/
* SwaggerUI: http://localhost:18080/swagger-ui.html
* Prometheus: http://localhost:9090/
* Grafana: http://localhost:3000/ (admin/admin)
* Kibana: http://localhost:5601/ 

### Run Performance Tests

`moviebuffs/moviebuffs-gatling-tests> ./mvnw gatling:test`

### Run SonarQube analysis

```
> ./run.sh sonar
> ./mvnw clean verify -Psonar -Dsonar.login=$SONAR_LOGIN_TOKEN
```
