pipeline {
    agent any
    options {
        timestamps()
    }
    environment {
        JAVA_HOME = "${env.JAVA_HOME_11}"
        PATH = "${env.JAVA_HOME_11}/bin:${env.PATH}"
    }
    stages {
        stage('Build and deploy') {
            steps {
                sh("./gradlew clean build publish -x test -PaltDeploymentRepository=${ALT_DEPLOYMENT_REPOSITORY_TAG}")
            }
        }
    }
}