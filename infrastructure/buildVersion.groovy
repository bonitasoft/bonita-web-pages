pipeline {
    agent any
    options {
        timestamps()
    }
    stages {
        stage('Build and deploy') {
            steps {
                sh("./gradlew clean build publish -x test -PaltDeploymentRepository=${ALT_DEPLOYMENT_REPOSITORY_TAG}")
            }
        }
    }
}