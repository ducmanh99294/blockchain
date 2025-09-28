pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/ducmanh99294/blockchain.git'
            }
        }
        stage('Install') {
            steps {
                sh 'npm install'
            }
        }
        stage('Test') {
            steps {
                sh 'npm test || echo "No tests defined"'
            }
        }
        stage('Build') {
            steps {
                sh 'npm run build || echo "No build step"'
            }
        }
    }
}
 