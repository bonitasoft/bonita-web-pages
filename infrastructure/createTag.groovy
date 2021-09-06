node {
    stage('Checkout') {
        checkout scm
    }

    stage('Tag') {
        tag = params.TAG_NAME
        branch = params.BASE_BRANCH
        pushTagToCommunity = params.pushTagToCommunity
        withEnv(["PATH=${env.JAVA_HOME_11}/bin:${env.PATH}", "JAVA_HOME=${env.JAVA_HOME_11}"]) {
            withCredentials([usernamePassword(
                    credentialsId: 'github',
                    passwordVariable: 'GIT_PASSWORD',
                    usernameVariable: 'GIT_USERNAME')]) {
                sh "git branch --force $branch origin/$branch"
                sh "git checkout $branch"

                sh "./gradlew release -Prelease.customUsername=${GIT_USERNAME} -Prelease.customPassword=${GIT_PASSWORD} -Prelease.version=$tag"
                if (pushTagToCommunity) {
                    sh "git remote add remote.origin.community.url https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/bonitasoft/bonita-web-pages.git"
                    sh "git push remote.origin.community.url $tag"
                }
            }
        }
    }
}
