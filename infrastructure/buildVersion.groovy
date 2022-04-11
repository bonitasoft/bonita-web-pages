pipeline {
    agent any
    options {
        timestamps()
    }
    stages {
        stage('Build and deploy') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'jfrog', passwordVariable: 'REPOSITORY_PASSWORD', usernameVariable: 'REPOSITORY_USERNAME')]) {
                    args = "build publish -x test"
                    args += " -PextraRepositories=${env.ALT_DEPLOYMENT_REPOSITORY_SNAPSHOTS},${env.ALT_DEPLOYMENT_REPOSITORY_RELEASES}"
                    args += " -PreleasesUsername=${env.REPOSITORY_USERNAME}"
                    args += " -PreleasesPassword=${env.REPOSITORY_PASSWORD}"
                    args += " -PsnapshotsUsername=${env.REPOSITORY_USERNAME}"
                    args += " -PsnapshotsPassword=${env.REPOSITORY_PASSWORD}"

                    sh "./gradlew ${args} -PaltDeploymentRepository=${env.ALT_DEPLOYMENT_REPOSITORY_SNAPSHOTS}"
                }
            }
        }
    }
}