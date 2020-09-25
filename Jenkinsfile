pipeline {
    agent any

    tools {
        nodejs '12.18.4'
    }

    options {
        timeout(time: 2, unit: 'MINUTES')
    }

    stages {
        stage('Install test R') {
            steps {
                sh "echo ${env.BRANCH_NAME}"
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