pipeline {
    agent any

    tools {
        nodejs '12.18.4'
    }

    options {
        timeout(time: 2, unit: 'MINUTES')
    }

    stages {
        stage('Install tesxxxx') {
            steps {
                sh 'yarn install'
            }
        }
        stage('Test') {
            steps {
                sh 'yarn test'
            }
        }
    }
}