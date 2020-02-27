pipeline {
    agent any
    options {
        timestamps()
    }
    stages {
        stage('Build and deploy') {
            steps {
                sh("./gradlew clean publish -PaltDeploymentRepository=${ALT_DEPLOYMENT_REPOSITORY_TAG}")
            }
        }
    }
}