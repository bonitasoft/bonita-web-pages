#!/usr/bin/env groovy
def tag = params.TAG_NAME
pipeline {
    agent any
    options {
        timestamps()
        skipDefaultCheckout true
    }
    stages {
        stage('Checkout') {
            checkout scm
        }
        stage('Tag') {
            branch = params.BASE_BRANCH
            withCredentials([usernamePassword(
                    credentialsId: 'github',
                    passwordVariable: 'GIT_PASSWORD',
                    usernameVariable: 'GIT_USERNAME')]) {
                sh "git branch --force $branch origin/$branch"
                sh "git checkout $branch"

                sh "./infrastructure/release.sh ${tag}"
            }
        }
    }
}
