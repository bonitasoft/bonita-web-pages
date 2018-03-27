#!/usr/bin/env groovy
node {
    checkout scm

    stage('🔧 Build') {
        try {
            sh './gradlew clean build'
        } finally {
            archiveArtifacts  '**/build*/distributions/*.zip'
        }
    }
}