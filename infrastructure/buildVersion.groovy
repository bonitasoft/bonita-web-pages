pipeline {
    agent any
    options {
        timestamps()
    }
    stages {
        withEnv(["PATH=${env.JAVA_HOME_11}/bin:${env.PATH}", "JAVA_HOME=${env.JAVA_HOME_11}"]) {
            stage('Build and deploy') {
                steps {
                    sh("./gradlew clean build publish -x test -PaltDeploymentRepository=${ALT_DEPLOYMENT_REPOSITORY_TAG}")
                }
            }
        }
    }
}