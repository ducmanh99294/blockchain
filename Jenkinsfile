pipeline {
    agent any

    stage('Debug Git') {
    steps {
        sh 'env | sort'
        sh 'git --version'
        sh 'git ls-remote https://github.com/ducmanh99294/blockchain.git || true'
    }
}

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/ducmanh99294/blockchain.git',
                    credentialsId: 'github-cred'   // ID bạn đã tạo trong Jenkins
            }
        }

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
