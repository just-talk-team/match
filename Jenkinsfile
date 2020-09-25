pipeline {
    agent any

    tools {
        nodejs '12.18.4'
    }

    options {
        timeout(time: 2, unit: 'MINUTES')
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
        stage('Continuos Deliverys'){
            when { 
                branch pattern: "^(feature|fix)", comparator: "REGEXP"
            }
            steps {
                sh 'echo Continuos Delivery'
            }
        }
        stage('Continuos Deployment'){
            when { 
                branch 'master'
            }
            steps {
                sh 'echo Continuos Deployment'
            }
        }
    }
}