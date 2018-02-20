#!/usr/bin/env groovy
def projectProperties = [
        [$class: 'BuildDiscarderProperty', strategy: [$class: 'LogRotator', numToKeepStr: '5']],
]

properties(projectProperties)

node {
    stage 'Checkout'
    checkout scm

    stage 'Build'
    step([$class: 'ArtifactArchiver', artifacts: '**/build/distributions/*.zip', fingerprint: true])
    sh './gradlew build'

}
