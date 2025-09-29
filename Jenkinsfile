pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                // Clone code từ GitHub
                git branch: 'main', url: 'https://github.com/username/repo.git'
            }
        }

        stage('Backend') {
            steps {
                dir('backend') {
                    sh 'npm install'
                    // chạy backend ở chế độ dev (ví dụ dùng nodemon)
                    sh 'nohup npm run dev > backend.log 2>&1 &'
                }
            }
        }

        stage('Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                    // chạy frontend ở chế độ dev (React dev server, thường port 3000/5173)
                    sh 'nohup npm run dev > frontend.log 2>&1 &'
                }
            }
        }
    }

    post {
        success {
            echo "🎉 Code mới đã pull và backend + frontend đang chạy dev mode trên máy bạn!"
        }
        failure {
            echo "❌ Có lỗi khi chạy pipeline, xem log chi tiết."
        }
    }
}
