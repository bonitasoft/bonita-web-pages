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
        branch = branch ?: 'master'
        releaseType = releaseType ?: 'Development'

        withCredentials([usernamePassword(
                credentialsId: 'github',
                passwordVariable: 'GIT_PASSWORD',
                usernameVariable: 'GIT_USERNAME')]) {
            sh "git branch --force $branch origin/$branch"
            sh "git checkout $branch"
            CURRENT_VERSION = sh(
                    script: './gradlew currentVersion -Prelease.useHighestVersion' +
                            '| grep Project ' +
                            '| cut -f 3 -d  \' \' ' +
                            '| cut -f1 -d \'-\' ',
                    returnStdout: true
            ).trim()
            if (releaseType == "Development") {
                sh "./gradlew markNextVersion " +
                        "-Prelease.version=${CURRENT_VERSION} " +
                        "-Prelease.customUsername=${GIT_USERNAME} -Prelease.customPassword=${GIT_PASSWORD}"
            } else {

                sh "./gradlew release " +
                        "-Prelease.versionIncrementer=increment${releaseType} " +
                        "-Prelease.customUsername=${GIT_USERNAME} -Prelease.customPassword=${GIT_PASSWORD}"
            }
        }
    }

    stage('Publish') {
        sh "./gradlew clean build publish"
    }
}