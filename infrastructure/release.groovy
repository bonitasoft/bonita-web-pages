/*
 *
 * This create release of the product,
 *
 * parameters are:
 *
 * branch: the name of the branch on which the release is done
 * releaseType:
 *      can be
 *      - Development: current version + timestamp
 *      - Patch: last digit incremented
 *      - Minor: second digit incremented
 *      - Major: first digit incremented
 *
 *
 *
 */

node {
    stage('Checkout') {
        checkout scm
    }

    stage('Release') {
        //TAG_VERSION
        branch = 'master'

        withCredentials([usernamePassword(
                credentialsId: 'github',
                passwordVariable: 'GIT_PASSWORD',
                usernameVariable: 'GIT_USERNAME')]) {
            sh "git branch --force $branch origin/$branch"
            sh "git checkout $branch"

            sh "./gradlew release -Prelease.customUsername=${GIT_USERNAME} -Prelease.customPassword=${GIT_PASSWORD} -Prelease.forceVersion=${tag_version}"
        }
    }

    stage('Publish') {
        sh "./gradlew clean build publish"
    }
}