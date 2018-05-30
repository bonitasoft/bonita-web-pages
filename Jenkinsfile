#!/usr/bin/env groovy
import static groovy.json.JsonOutput.toJson

ansiColor('xterm') {
    node {
        def currentBranch = env.BRANCH_NAME
        def isBaseBranch = currentBranch == 'master'

        slackStage('🌍 Setup', isBaseBranch) {
            checkout scm
        }

        slackStage('🔧 Build', isBaseBranch) {
            try {
                gradle 'clean build'
            } finally {
                archiveArtifacts '**/build*/distributions/*.zip'
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
                    title     : "${env.BRANCH_NAME} build is failing!",
                    title_link: env.BUILD_URL,
                    text      : "Stage ${name} has failed"
            ]

            slackSend(color: 'danger', channel: '#web', attachments: toJson([attachment]))
        }
        throw e
    }
}