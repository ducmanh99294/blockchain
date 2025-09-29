pipeline {
    agent any

    stages {
        stage('Build & Deploy') {
            steps {
                script {
                    echo "🚀 Bắt đầu deploy với Docker Compose..."

                    // Stop và remove container cũ (nếu có)
                    sh 'docker-compose down || true'

                    // Build và run lại container
                    sh 'docker-compose up -d --build'
                }
            }
        }
    }

    post {
        success {
            echo "✅ Deploy thành công! Hệ thống đã chạy."
        }
        failure {
            echo "❌ Deploy thất bại! Kiểm tra lại log."
        }
    }
}
