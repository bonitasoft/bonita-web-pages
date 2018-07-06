node {
    stage('Checkout') {
        checkout scm
    }

    stage('Release') {
        branch = branch ?: 'master'
        releaseType = releaseType ?: 'Development'

        withCredentials([usernamePassword(
                credentialsId: 'github',
                passwordVariable: 'GIT_PASSWORD',
                usernameVariable: 'GIT_USERNAME')]) {
            sh "git branch --force $branch origin/$branch"
            sh "git checkout $branch"

            if(tagVersion){
                sh "./gradlew release" +
                        "-Prelease.customUsername=${GIT_USERNAME} -Prelease.customPassword=${GIT_PASSWORD} -Prelease.version=${tagVersion}"
            } else{
                if (releaseType == "Development") {
                    releaseType = "Dev"
                }
                sh "./gradlew release${releaseType} " +
                        "-Prelease.customUsername=${GIT_USERNAME} -Prelease.customPassword=${GIT_PASSWORD}"
            }
        }
    }

    stage('Publish') {
        sh "./gradlew clean build publish"
    }
}