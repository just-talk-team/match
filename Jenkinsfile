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
                anyOf {
                    allOf{
                        branch 'master';
                        buildingTag() 
                    };
                    allOf {
                        branch pattern: "PR-\\d+", comparator: "REGEXP";
                        changeRequest target: 'master' 
                    }
                }
            }
            steps {
                sh 'yarn install'
            }
        }
        stage('Continuos Integration') {
            when { 
                anyOf {
                    allOf{
                        branch 'master';
                        buildingTag() 
                    };
                    allOf {
                        branch pattern: "PR-\\d+", comparator: "REGEXP";
                        changeRequest target: 'master' 
                    }
                }
            }
            steps {
                sh 'yarn test'
            }
        }
        stage('Continuos Delivery'){
            when { 
                allOf {
                    branch pattern: "PR-\\d+", comparator: "REGEXP";
                    changeRequest target: 'master' 
                }
            }
            steps {
                sh 'echo Continuos Delivery'
            }
        }
        stage('Continuos Deployment'){
            when { 
                allOf{
                    branch 'master';
                    buildingTag() 
                }
            }
            steps {
                sh 'echo Continuos Deployment'
            }
        }
    }
}