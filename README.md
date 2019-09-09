# Prox Web Client

This web application acts as the frontend to Prox.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.2.3.

## Installation

To use the services from *.archi-lab.io
``` bash
# Execute from the project root folder
docker build -t docker.nexus.archi-lab.io/archilab/prox-web-client -f ./src/docker/Dockerfile .
```

To use the local/dev services from localhost
``` bash
# Execute from the project root folder
docker build --build-arg APP_ENV="" -t docker.nexus.archi-lab.io/archilab/prox-web-client -f ./src/docker/Dockerfile .
```

Builds a Docker image based on the source code and the dependencies in the `package.json` and `package-lock.json`.

## Local usage

Powershell
```posh
$env:IMAGE='prox-web-client'; `
$env:TAG='latest'; `
docker-compose -f ./src/docker/docker-compose.yml up
```

Bash/Shell
```bash
export IMAGE="prox-web-client" &&
export TAG="latest" &&
docker-compose -f ./src/docker/docker-compose.yml up
```

Starts a Docker container based on the compose file and the image. A Docker network named `prox` is required for the communication between services:

``` bash
docker network create prox
```

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## About the Team

This service is currently developed by members of the ArchiLab staff:

- Julian Lengelsen ([@jlengelsen](https://github.com/jlengelsen))
- Rudolf Grauberger ([@rudolfgrauberger](https://github.com/rudolfgrauberger))
