node {
    stage('Checkout') {
        checkout scm
    }

    stage('Tag') {
        tag = params.TAG_NAME
        branch = params.BASE_BRANCH
        withCredentials([usernamePassword(
                credentialsId: 'github',
                passwordVariable: 'GIT_PASSWORD',
                usernameVariable: 'GIT_USERNAME')]) {
            sh "git branch --force $branch origin/$branch"
            sh "git checkout $branch"

            sh "./gradlew release -Prelease.version=$tag"
        }
    }
}
