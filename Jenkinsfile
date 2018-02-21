#!/usr/bin/env groovy
node {
    checkout scm

    stage('🔧 Build') {
        try {
            sh './gradlew clean build'
        } finally {
            // Update this by archiveArtifacts when we move in ymci
            archive '**/build-gradle/distributions/*.zip'
        }
    }
}