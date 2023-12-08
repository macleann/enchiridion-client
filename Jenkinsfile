pipeline {
    agent any
    environment {
        // Fetching environment variable from Azure Key Vault
        REACT_APP_GOOGLE_CLIENT_ID = credentials('REACT-APP-GOOGLE-CLIENT-ID')
        API_URL = credentials('API-URL')
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
                    // First, login to Azure
                    sh 'az login --identity'
                    // Delete old container if it exists
                    sh 'az container delete --name enchiridion-client --resource-group EnchiridionTV-Production || true'
                    // Then deploy to ACI
                    sh '''
                    az container create --resource-group EnchiridionTV-Production \
                        --name enchiridion-client \
                        --image macleann/enchiridion-client:latest \
                        --environment-variables \
                            REACT_APP_GOOGLE_CLIENT_ID=$REACT_APP_GOOGLE_CLIENT_ID \
                            API_URL=$API_URL \
                        --dns-name-label enchiridion-client \
                        --ports 80
                    '''
                    // Obtain the public IP address of the newly created container
                    sh '''
                    FRONTEND_CONTAINER_IP=$(az container show --resource-group EnchiridionTV-Production \
                        --name enchiridion-client \
                        --query ipAddress.ip \
                        --output tsv)
                    '''

                    // Obtain the public IP address of the backend container
                    sh '''
                    BACKEND_CONTAINER_IP=$(az container show --resource-group EnchiridionTV-Production \
                        --name enchiridion-backend \
                        --query ipAddress.ip \
                        --output tsv)
                    || true
                    '''
                    // Finally, logout of Azure
                    sh 'az logout'

                    // Update Nginx configuration file with the new IP addresses
                    sh '''
                    cp /etc/nginx/sites-available/default.template /etc/nginx/sites-available/default
                    sed -i "s/FRONTEND_CONTAINER_IP/${FRONTEND_CONTAINER_IP}/g" /etc/nginx/sites-available/default
                    sed -i "s/BACKEND_CONTAINER_IP/${BACKEND_CONTAINER_IP}/g" /etc/nginx/sites-available/default
                    sudo systemctl restart nginx
                    '''
                }
            }
        }
    }
}