#!/bin/bash
#################################################################################
#                         Common utility functions
#
# WARNING : this script is used by other script in bonita-internal-tools project
#    be careful when modifying this script and do not move it
#################################################################################

# overriding pushd and popd commands to not print path when executing them
pushd() {
  command pushd $* > /dev/null
}
popd() {
  command popd $* > /dev/null
}

# Check a linux command is installed
# Print an error message and exit program if command is not installed
# $1 util to be installed
check_is_installed() {
  command -v $1 >/dev/null 2>&1 || {
                echo >&2 "###########################################################################################################"
                echo >&2 "ERROR"
                echo >&2 "${launch_command} require ${1} but it's not installed."
                echo >&2 "Please install it first before running script."
                echo >&2 "Aborting..."; exit 1;}
}

big_echo() {
        echo ""
        echo "###########################################################################################################"
        echo "#   $1"
        echo "###########################################################################################################"
}

medium_echo() {
        echo "___________________________________________________________________________________________________________"
        echo "$1"
}

# print absolute path of a file
# $1 path to file
absolute_path() {
  readlink -e $1
}

# Create a directory and erase it if existing
# $1 directory to be created
prepare_directory() {
  dir=$1
  if [ -d $dir ]; then
    rm -rf $dir
  fi

  mkdir -pv $dir
}

# Tests the return code of a command and termninate with error if different from 0.
# usage: testReturnCode $? "an error message"
# param 1: the return code
# param 2: error message
testReturnCode() {
  COD_RET=$1
  if [ ${COD_RET} -ne 0 ]; then
    echo "ERROR ${COD_RET} $2"
    exit ${COD_RET}
  fi
}

testReturnCodeAndContinue() {
  COD_RET=$1
  if [ ${COD_RET} -ne 0 ]; then
    echo "ERROR ${COD_RET} $2"
  fi
}

######################### GIT FUNCTIONS ############################
# perform a git push in specified folder
# $1 the folder
git_push() {
  pushd $1 > /dev/null
  git push
  popd > /dev/null
}

# perform a git fetch in specified folder
# $1 the folder
git_fetch() {
  pushd $1 
  git fetch
  popd 
}

# completely clean a repository and update it
# this will delete all branches (master excluded)
# $1 the folder containing the git repository
git_reset_repository() {
  pushd $1
  git fetch
  git clean -f -d -q
  #in case of prevous conflict
  git reset --hard HEAD
  # re checkout base branch
  git checkout master
  # be shure its same as remote master
  git reset --hard origin/master
  #delete all branches (xargs -r is for when no result is given)
  echo "[INFO] executed command : git branch | grep -v 'master$' | sed \"s@  @@\" | sed \"s@* @@\" | xargs -r git branch -D     in $(pwd)"
  git branch | grep -v 'master$' | sed "s@  @@" | sed "s@* @@" | xargs -r git branch -D
  popd 
}


# Clone a bonita github project
# $1 project name
git_clone() {
  git clone "git@github.com:bonitasoft/${1}.git"
}


# remove the last char of a path if it is a '/'
removeLastSlash () {
	echo ${1%/};
}

removeFirstSlash () {
	echo ${1#/*};
}

# is path is a directory
isDir () {
  if [ -d $1 ]; then
  #echo 0
  return 0
  else
#  echo $1 "is not a directory"
  return 1
  fi
}

# is path is a file
isFile () {
  if [ -f $1 ]; then
  #echo 0
  return 0
  else
#  echo $1 "is not a file"
  return 1
  fi
}

# remove first line of a file
rmfl (){
  sed -i '1d' $1
}

#remove last line of a file
rmll (){
  sed -i '$d' $1
}

# get the path of a file
getPath (){
	echo ${1%/*}
}

# get a name of a file from a path with its extension
getFileName (){
	echo $(basename $1)
}

# get a name of a file without its extension
getFileNameWithoutExtension (){
	echo ${1%.*}
}

# get root dir of a path
getRootDirName (){
 	echo ${1%%/*}
}

# find files in a directories
findFiles (){
	if [ ! -d $pathUserFilter ]
	then
		exit;
	fi
	echo $(find $2 -name $1)
}

# test if the branche is a 6.0.x version
isBundlesDir(){
if echo "$1" | grep -Eq "6\.0\..*" 
then
  echo ""
else
  echo "bundles/"
fi
}

	
# do a git fetch or clone project if not exists
# $1 project name
fetch_project() {
  if [ ! -d ${1} ]
    then
    echo "Cloning project ${1}"
    git_clone ${1}
  else 
    #echo "Fetching and cleaning project ${1}"
    #git_reset_repository ${1}
    echo "Remove project ${1}"
    rm -rf ${1}
    echo "Cloning project ${1}"
    git_clone ${1}
  fi
}

logInfo() {
  echo "[INFO]"$1
}
error() {
  echo "[ERROR]"$1
}