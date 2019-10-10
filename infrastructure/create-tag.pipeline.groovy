#!/usr/bin/env groovy
def tag = params.TAG_NAME
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
                    sh "./infrastructure/tag.sh ${tag} true"
                }
            }
        }
    }
}
