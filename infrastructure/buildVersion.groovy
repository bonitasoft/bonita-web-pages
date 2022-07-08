pipeline {
    agent any
    options {
        timestamps()
    }
    stages {
        stage('Build and deploy') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'jfrog', passwordVariable: 'REPOSITORY_PASSWORD', usernameVariable: 'REPOSITORY_USERNAME')]) {
                    sh "./gradlew build publish -x test" +
                            " -PextraRepositories=${env.ALT_DEPLOYMENT_REPOSITORY_SNAPSHOTS},${env.ALT_DEPLOYMENT_REPOSITORY_RELEASES}" +
                            " -PreleasesUsername=${env.REPOSITORY_USERNAME}" +
                            " -PreleasesPassword=${env.REPOSITORY_PASSWORD}" +
                            " -PsnapshotsUsername=${env.REPOSITORY_USERNAME}" +
                            " -PsnapshotsPassword=${env.REPOSITORY_PASSWORD}" +
                            " -PstagingUsername=${env.REPOSITORY_USERNAME}" +
                            " -PstagingPassword=${env.REPOSITORY_PASSWORD}" +
                            " -PaltDeploymentRepository=${env.ALT_DEPLOYMENT_REPOSITORY_STAGING}"
                }
            }
        }
    }
}