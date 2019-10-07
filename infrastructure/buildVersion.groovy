pipeline {
    agent any
    options {
        timestamps()
    }
    stages {
        stage('Build and deploy') {
            steps {
                sh("./gradlew build publish -x test -PaltDeploymentRepository=${ALT_DEPLOYMENT_REPOSITORY_TAG}")
            }
        }
    }
}