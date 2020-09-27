pipeline {
    agent any

    tools {
        nodejs '12.18.4'
    }

    options {
        timeout(time: 10, unit: 'MINUTES')
    }

    stages {
        stage('Install') {
            steps {
                sh 'yarn install'
            }
        }
        stage('Continuos Integration') {
            steps {
                sh 'yarn test'
            }
        }
    }
}
