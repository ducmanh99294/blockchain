pipeline {
    agent any
    tools {
        nodejs "node20"
    }
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/ducmanh99294/blockchain.git',
                    credentialsId: 'github-token'
            }
        }

        stage('Backend') {
            steps {
                dir('backend') {
                    sh 'npm install'
                    sh 'npm run dev &'
                }
            }
        }

        stage('Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm run dev &'
                }
            }
        }
    }

    post {
        always {
            echo "✅ Pipeline finished (success or fail)"
        }
        success {
            echo "🎉 Build succeeded!"
        }
        failure {
            echo "❌ Build failed!"
        }
    }
}
