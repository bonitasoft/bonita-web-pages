#!/usr/bin/env groovy

pipeline {
    agent any
    options {
        timestamps()
        skipDefaultCheckout true
    }
    stages {
        stage('Init') {
            steps{
                script{
                    git branch: params.BASE_BRANCH, url: 'git@github.com:bonitasoft/bonita-web-pages.git'
                }
            }

        }
        stage('Tag') {
            steps {
                script {
                    sh "./infrastructure/updateVersion.sh ${params.newVersion}"
                }
            }
        }
    }
}
