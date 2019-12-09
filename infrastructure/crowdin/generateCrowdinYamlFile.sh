#!/bin/sh

#
# args
# 1 : project name 
# 2 : project api key
# 3 : path of the source to parse

if test ! $# -eq 3
then
	echo "[ERROR] generateCrowdinYamlFile.sh scripts needs 3 parameters"
	exit
fi

projectName=$1
projectAPIKey=$2
sourcePath=$3

crowdinFile=crowdin.yaml
crowdinTemplateFile=crowdin.yaml.template

echo "[INFO] Remove Crowdin configuration file if exists."
# remove crowdin config file if already exists
if test -f $crowdinFile
then
	echo " remove file $crowdinFile"
	rm $crowdinFile
fi

echo "[INFO] Create Crowdin configuration file."
# copy template
cp $crowdinTemplateFile $crowdinFile

# Set config
sed -i "s#@PROJECT_NAME@#$projectName#g" $crowdinFile
sed -i "s#@PROJECT_API_KEY@#$projectAPIKey#g" $crowdinFile
sed -i "s#@PATH_ON_CI@#$sourcePath#g"         $crowdinFile
