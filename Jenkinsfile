pipeline {
    agent any

    stages {
        stage('Build & Deploy') {
            steps {
                sh 'docker-compose down || true'
                sh 'docker-compose up -d --build'
            }
        }
    }

    post {
        success {
            echo "✅ Deploy thành công!"
        }
        failure {
            echo "❌ Deploy thất bại!"
        }
    }
}
