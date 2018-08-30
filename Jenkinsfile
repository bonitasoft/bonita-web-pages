#!/usr/bin/env groovy
import static groovy.json.JsonOutput.toJson

properties([[$class: 'BuildDiscarderProperty', strategy: [$class: 'LogRotator', artifactDaysToKeepStr: '', artifactNumToKeepStr: '', daysToKeepStr: '', numToKeepStr: '3']]])

ansiColor('xterm') {
    node('web-pages') {
        def currentBranch = env.BRANCH_NAME
        def isBaseBranch = currentBranch == 'master'

        slackStage('🌍 Setup', isBaseBranch) {
            // all this just to fetch tags since default behaviour has changed in jenkins
            checkout([
                    $class: 'GitSCM',
                    branches: scm.branches,
                    doGenerateSubmoduleConfigurations: scm.doGenerateSubmoduleConfigurations,
                    extensions: [[$class: 'CloneOption', noTags: false, shallow: false, depth: 0, reference: '']],
                    userRemoteConfigs: scm.userRemoteConfigs,
            ])
        }

        slackStage('🔧 Build', isBaseBranch) {
            wrap([$class: 'Xvfb', autoDisplayName: true, screen: '1920x1280x24', parallelBuild: true]) {
                try {
                    gradle 'clean build runIntegrationTests'
                } finally {
                    archiveArtifacts '**/build*/distributions/*.zip, **/build*/*.zip, uid-pages/**/videos/*'
                }
            }
        }

        if (isBaseBranch){
            slackStage('🐸 Publish', isBaseBranch) {
                gradle 'publish'
            }
        }
    }
}

def gradle(args) {
    sh "./gradlew ${args}"
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
                    title     : "bonita-web-pages/${env.BRANCH_NAME} build is failing!",
                    title_link: env.BUILD_URL,
                    text      : "Stage ${name} has failed"
            ]

            slackSend(color: 'danger', channel: '#web', attachments: toJson([attachment]))
        }
        throw e
    }
}
