pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/ducmanh99294/blockchain.git',
                    credentialsId: 'github-token'
            }
        }

        stage('Build & Deploy') {
            steps {
                sh 'docker-compose down || true'
                sh 'docker-compose up -d --build'
            }
        }
    }

    post {
        success {
            echo "🎉 Deploy thành công!"
        }
        failure {
            echo "❌ Deploy thất bại!"
        }
    }
}
