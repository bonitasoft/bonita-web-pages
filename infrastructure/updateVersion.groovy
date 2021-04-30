node {
    stage('Checkout') {
        checkout scm
    }

    stage('Update version') {
        branch = params.BASE_BRANCH
        withEnv(["PATH=${env.JAVA_HOME_11}/bin:${env.PATH}", "JAVA_HOME=${env.JAVA_HOME_11}"]) {
            withCredentials([usernamePassword(
                    credentialsId: 'github',
                    passwordVariable: 'GIT_PASSWORD',
                    usernameVariable: 'GIT_USERNAME')]) {
                sh "git branch --force $branch origin/$branch"
                sh "git checkout $branch"

                sh "./gradlew markNextVersion -Pnext.snapshot=${params.newVersion} -Prelease.customUsername=${GIT_USERNAME} -Prelease.customPassword=${GIT_PASSWORD}"
            }
        }
    }
}