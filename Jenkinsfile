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
            when { 
                branch pattern: "PR*", caseSensitive: true
            }
            when { 
                changeRequest target: 'master' 
            }
            steps {
                sh 'yarn install'
            }
        }
        stage('Continuos Integration') {
            when { 
                branch pattern: "PR*", caseSensitive: true
            }
            when { 
                changeRequest target: 'master' 
            }
            steps {
                sh 'yarn test'
            }
        }
        stage('Continuos Delivery'){
            when { 
                branch pattern: "PR*", caseSensitive: true
            }
            when { 
                changeRequest target: 'master' 
            }
            steps {
                sh 'echo Continuos Delivery'
            }
        }
        stage('Continuos Deployment'){
            when { 
                branch 'master'
            }
            when {
                buildingTag()
            }
            steps {
                sh 'echo Continuos Deployment'
            }
        }
    }
}