pipeline {
    agent any
    environment {
        // Fetching environment variable from Azure Key Vault
        REACT_APP_GOOGLE_CLIENT_ID = credentials('REACT-APP-GOOGLE-CLIENT-ID')
    }
    stages {
        stage('Build and Push Image') {
            steps {
                script {
                    // Login to DockerHub and build the image
                    withDockerRegistry([ credentialsId: "docker-hub-creds", url: "" ]) {
                        def app = docker.build("macleann/enchiridion-client")

                        // Tagging with build number and 'latest'
                        def versionTag = "v${env.BUILD_NUMBER}"
                        def latestTag = "latest"

                        app.tag(versionTag)
                        app.tag(latestTag)

                        // Push both tags to DockerHub
                        app.push(versionTag)
                        app.push(latestTag)
                    }
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
        stage('Deploy to ACI') {
            steps {
                script {
                    // Azure CLI commands to deploy to ACI
                    // Ensure Azure CLI is installed and configured on Jenkins agent
                    sh """
                    az container create --resource-group EnchiridionTV-Production \
                        --name enchiridion-client-${env.BUILD_NUMBER} \
                        --image macleann/enchiridion-client:latest \
                        --environment-variables \
                            REACT_APP_GOOGLE_CLIENT_ID=${REACT_APP_GOOGLE_CLIENT_ID} \
                        --dns-name-label enchiridion-client-${env.BUILD_NUMBER} \
                        --ports 80
                    """
                }
            }
        }
    }
}
