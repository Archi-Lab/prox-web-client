pipeline {
    agent any
    environment {
        REPOSITORY = "ptb-gp-ss2019.archi-lab.io"
        IMAGE = "web-client"
    }
    stages {
        stage("Build") {
            steps {
                sh "docker build -t ${REPOSITORY}/${IMAGE} ."
                sh "docker image save -o ${IMAGE}.tar ${REPOSITORY}/${IMAGE}"
            }
        }
        stage('SonarQube Analysis') {
            steps {
                echo "SonarQube..."
            }
        }
        stage("Test") {
            steps {
                echo "Testing..."
            }
        }
        stage("Code Quality Check") {
            steps {
                echo "Code Quality Check..."
            }
        }
        stage("Deploy") {
            environment {
                SERVERPORT = "22413"
                YMLFILENAME = "docker-compose-web-client.yml"
                SSHUSER = "jenkins"
                SERVERNAME = "fsygs15.inf.fh-koeln.de"
            }
            steps {
                sh "scp -P ${SERVERPORT} -v ${IMAGE}.tar ${SSHUSER}@${SERVERNAME}:~/"
                sh "scp -P ${SERVERPORT} -v ${YMLFILENAME} ${SSHUSER}@${SERVERNAME}:/srv/projektboerse/"
                sh "ssh -p ${SERVERPORT} ${SSHUSER}@${SERVERNAME} " +
                        "'docker image load -i ${IMAGE}.tar; " +
                        "docker-compose -p ptb -f /srv/projektboerse/${YMLFILENAME} up -d'"
            }
        }
    }
}
