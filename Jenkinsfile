pipeline {
    agent any
    tools { nodejs 'node_21.4'}
    environment {
        // Fetching environment variable from Azure Key Vault
        REACT_APP_GOOGLE_CLIENT_ID = credentials('REACT-APP-GOOGLE-CLIENT-ID')
        REACT_APP_API_URL = credentials('REACT-APP-API-URL')
    }
    stages {
        stage('Build React App') {
            steps {
                script {
                    // Navigate to the front-end directory and install dependencies and build the React app
                    sh '''
                        cd the-enchiridion
                        npm ci
                        REACT_APP_GOOGLE_CLIENT_ID=${REACT_APP_GOOGLE_CLIENT_ID} REACT_APP_API_URL=${REACT_APP_API_URL} npm run build
                    '''
                }
            }
        }
        stage('Test') {
            steps {
                script {
                    // Placeholder for test commands
                    echo 'Running front-end tests...'
                    // Add test commands here
                }
            }
        }
        stage('Deploy to Server') {
            steps {
                script {
                    // Transfer the build directory to the server
                    sh '''
                        cd ${WORKSPACE}/the-enchiridion
                        cp -r build/* /var/www/enchiridion
                    '''
                }
            }
        }
    }
}