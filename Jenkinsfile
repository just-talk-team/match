pipeline {
  agent any
  stages {
    stage('Install') {
      steps {
        sh 'sh \'yarn install\''
      }
    }

    stage('Test') {
      agent any
      steps {
        sh 'sh \'yarn test\''
      }
    }

  }
}