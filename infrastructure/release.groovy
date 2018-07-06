node {
    stage('Checkout') {
        checkout scm
    }

    stage('Release') {
        branch = 'master'


        withCredentials([usernamePassword(
                credentialsId: 'github',
                passwordVariable: 'GIT_PASSWORD',
                usernameVariable: 'GIT_USERNAME')]) {
            sh "git branch --force $branch origin/$branch"
            sh "git checkout $branch"

            sh "./gradlew release" +
                    "-Prelease.customUsername=${GIT_USERNAME} -Prelease.customPassword=${GIT_PASSWORD} -Prelease.version=${tag_version}"
        }
    }

    stage('Publish') {
        sh "./gradlew clean build publish"
    }
}