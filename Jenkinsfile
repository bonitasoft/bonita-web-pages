#!/usr/bin/env groovy
import static groovy.json.JsonOutput.toJson

properties([[$class: 'BuildDiscarderProperty', strategy: [$class: 'LogRotator', artifactDaysToKeepStr: '', artifactNumToKeepStr: '', daysToKeepStr: '', numToKeepStr: '3']]])

ansiColor('xterm') {
    node('web-pages') {
        withEnv(["JAVA_HOME=${env.JAVA_HOME_11}"]) {
            def isBaseBranch = isBaseBranch()

            slackStage('🌍 Setup', isBaseBranch) {
                // all this just to fetch tags since default behaviour has changed in jenkins
                checkout([
                        $class                           : 'GitSCM',
                        branches                         : scm.branches,
                        doGenerateSubmoduleConfigurations: scm.doGenerateSubmoduleConfigurations,
                        extensions                       : [[$class: 'CloneOption', noTags: false, shallow: false, depth: 0, reference: '']],
                        userRemoteConfigs                : scm.userRemoteConfigs,
                ])
            }

        slackStage('🔧 Build', isBaseBranch) {
            wrap([$class: 'Xvfb', autoDisplayName: true, screen: '1920x1280x24', parallelBuild: true]) {
                try {
                    gradle 'buildUIDPage'
                    gradle 'build'
                    gradle 'runTestChrome'
                } finally {
                    junit testResults: '**/build*/tests/results/*.xml', allowEmptyResults: true
                    archiveArtifacts '**/build*/distributions/*.zip, **/build*/*.zip'
                }
            }
        }

            if (isBaseBranch) {
                slackStage('🐸 Publish', isBaseBranch) {
                    gradle 'publish'
                }
            }
        }
    }
}

def isBaseBranch() {
    def currentBranch = env.BRANCH_NAME
    currentBranch == 'master' || currentBranch == 'dev' || currentBranch?.startsWith('release-') || currentBranch?.matches('7\\..+\\.x')
}

def gradle(String args) {
    // the -B flag disables download progress logs

    withCredentials([usernamePassword(credentialsId: 'jfrog', passwordVariable: 'REPOSITORY_PASSWORD', usernameVariable: 'REPOSITORY_USERNAME')]) {
        args += " -PextraRepositories=${env.ALT_DEPLOYMENT_REPOSITORY_SNAPSHOTS},${env.ALT_DEPLOYMENT_REPOSITORY_RELEASES}"
        args += " -PreleasesUsername=${env.REPOSITORY_USERNAME}"
        args += " -PreleasesPassword=${env.REPOSITORY_PASSWORD} -PaltDeploymentRepository=${env.ALT_DEPLOYMENT_REPOSITORY_SNAPSHOTS}"
        args += " -PsnapshotsUsername=${env.REPOSITORY_USERNAME}"
        args += " -PsnapshotsPassword=${env.REPOSITORY_PASSWORD}"

        sh "./gradlew ${args} -PaltDeploymentRepository=${env.ALT_DEPLOYMENT_REPOSITORY_SNAPSHOTS}"
    }
}
// wrap a stage in try/catch and notify team by slack in case of failure
def slackStage(def name, boolean isBaseBranch, Closure body) {
    try {
        stage(name) {
            body()
        }
    } catch (e) {
        if (isBaseBranch) {
            def attachment = [
                    title     : "bonita-web-pages-internal/${env.BRANCH_NAME} build is failing!",
                    title_link: env.BUILD_URL,
                    text      : "Stage ${name} has failed"
            ]

            // Publish notification in portal-ci channel
            slackSend(color: 'danger', channel: 'CRJSZM7QB', attachments: toJson([attachment]))
        }
        throw e
    }
}
