#!/bin/bash

BRANCH_NAME=$1
CROWDIN_PROJECT=$2
CROWDIN_API_TOKEN=$3

scriptFolder=`pwd`/$(dirname $0)
$scriptFolder/generateCrowdinYamlFile.sh $CROWDIN_PROJECT $CROWDIN_API_TOKEN .
crowdin upload sources -b $BRANCH_NAME
