node {
    stage('Checkout') {
        sh "git config --global credential.helper 'cache'"
        checkout scm
    }

    stage('Update version') {
        branch = params.BASE_BRANCH
        newVersion = params.newVersion
        sh """
git branch --force $branch origin/$branch
git checkout $branch

sed -i "s/^version=.*/version=${params.newVersion}/g" gradle.properties
sed -i "s/^version=.*/version=${params.newVersion}/g" community/gradle.properties

git commit -a -m "chore(release): prepare next version ${params.newVersion}"
git push origin $branch
"""
        }
    }
}