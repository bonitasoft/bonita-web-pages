#!/bin/bash

BRANCH_NAME=$1
CROWDIN_PROJECT=$2
CROWDIN_API_TOKEN=$3
GITHUB_API_TOKEN=$4

scriptFolder=`pwd`/$(dirname $0)
$scriptFolder/generateCrowdinYamlFile.sh $CROWDIN_PROJECT $CROWDIN_API_TOKEN .
crowdin download -b $BRANCH_NAME -l fr
crowdin download -b $BRANCH_NAME -l ja
crowdin download -b $BRANCH_NAME -l es-ES
crowdin download -b $BRANCH_NAME -l pt-BR

$scriptFolder/pushTranslations.sh $BRANCH_NAME $GITHUB_API_TOKEN


