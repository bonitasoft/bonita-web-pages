#!/usr/bin/env groovy
def tag = params.TAG_NAME
pipeline {
    agent any
    options {
        timestamps()
        skipDefaultCheckout true
    }
    stages {
        stage('Tag') {
            steps {
                script {
                    sh "./infrastructure/release.sh ${tag}"
                }
            }
        }
    }
}
