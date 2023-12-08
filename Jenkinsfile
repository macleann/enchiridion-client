pipeline {
    agent any
    environment {
        // Fetching environment variable from Azure Key Vault
        REACT_APP_GOOGLE_CLIENT_ID = credentials('REACT-APP-GOOGLE-CLIENT-ID')
        REACT_APP_API_URL = credentials('REACT-APP-API-URL')
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
                    sh 'az container delete --name enchiridion-client --resource-group EnchiridionTV-Production --yes'
                    // Then deploy to ACI
                    sh '''
                    az container create --resource-group EnchiridionTV-Production \
                        --name enchiridion-client \
                        --image macleann/enchiridion-client:latest \
                        --environment-variables \
                            REACT_APP_GOOGLE_CLIENT_ID=$REACT_APP_GOOGLE_CLIENT_ID \
                            REACT_APP_API_URL=$REACT_APP_API_URL \
                        --dns-name-label enchiridion-client \
                        --ports 80
                    '''

                    // Copy a template nginx config file over the existing one
                    sh '''
                    sudo cp /etc/nginx/sites-available/default.template /etc/nginx/sites-available/default
                    '''

                    // Obtain the public IP address of the newly created container and replace the placeholder in the nginx config file
                    sh '''
                    FRONTEND_IP=$(az container show --resource-group EnchiridionTV-Production \
                        --name enchiridion-client \
                        --query ipAddress.ip \
                        --output tsv)
                    sudo sed -i "s/FRONTEND_CONTAINER_IP/${FRONTEND_IP}/g" /etc/nginx/sites-available/default
                    '''

                    // Obtain the public IP address of the backend container and replace the placeholder in the nginx config file
                    sh '''
                    BACKEND_IP=$(az container show --resource-group EnchiridionTV-Production \
                        --name enchiridion-server \
                        --query ipAddress.ip \
                        --output tsv)
                    sudo sed -i "s/BACKEND_CONTAINER_IP/${BACKEND_IP}/g" /etc/nginx/sites-available/default
                    '''

                    // Restart nginx
                    sh '''
                    sudo systemctl restart nginx
                    '''

                    // Finally, logout of Azure
                    sh 'az logout'
                }
            }
        }
    }
}