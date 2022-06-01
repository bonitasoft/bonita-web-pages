node {
    stage('Checkout') {
        sh "git config --global credential.helper 'cache'"
        checkout scm
    }

    stage('Tag') {
        tag = params.TAG_NAME
        branch = params.BASE_BRANCH
        sh """
git checkout -B release/$TAG_NAME

sed -i "s/^version=.*/version=$TAG_NAME/g" gradle.properties

git commit -a -m "chore(release): release $TAG_NAME"
git tag $TAG_NAME
git push origin $TAG_NAME:$TAG_NAME
"""
        if (params.pushTagToCommunity) {
            sh "git push git@github.com:bonitasoft/bonita-web-pages.git $TAG_NAME:$TAG_NAME"
        }
    }
}
