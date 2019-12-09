#!/bin/bash

#$3 github API Key
pull_request() {
  PR="{\"title\": \"[${BRANCH_NAME}] Translations update\",\"body\": \"Latest translations made in [Crowdin](https://crowdin.com/project/bonita-bpm)\n!skipTests\", \"head\": \"feat/${BRANCH_NAME}/update-translations\", \"base\": \"${BRANCH_NAME}\"}"
  echo "Create new pull request $PR"
  curl -i -X POST -d "$PR" \
     https://api.github.com/repos/bonitasoft/bonita-web-pages/pulls?access_token=$1
}


scriptFolder=`pwd`/$(dirname $0)
. $scriptFolder/utils.sh

BRANCH_NAME=$1
GITHUBKEY=$2

cd bonita-web-pages

git checkout -B feat/$BRANCH_NAME/update-translations
git add -A
git commit -m "chore(l10n) update translations"
git push origin feat/$BRANCH_NAME/update-translations --force

pull_request $GITHUBKEY