node {
    stage('Checkout') {
        checkout scm
    }

    stage('Udate version') {
        tag = params.TAG_NAME
        branch = params.BASE_BRANCH
        withCredentials([usernamePassword(
                credentialsId: 'github',
                passwordVariable: 'GIT_PASSWORD',
                usernameVariable: 'GIT_USERNAME')]) {
            sh "git branch --force $branch origin/$branch"
            sh "git checkout $branch"

            sh "./gradlew markNextVersion -Pnext.snapshot=$NEW_VERSION -Prelease.customUsername=${GIT_USERNAME} -Prelease.customPassword=${GIT_PASSWORD}"
        }
    }
}