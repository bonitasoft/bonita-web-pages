#!/usr/bin/env groovy
node {
    checkout scm

    stage('Build') {
        sh './gradlew build'
        archiveArtifacts '**/build/distributions/*.zip'
    }
}