#!/usr/bin/env bash
set -e

usage() {
    name=$(basename $0)
    echo ""
    echo -e "\e[1mSYNOPSIS\e[0m"
    echo -e "    \e[4m$name\e[0m <version>"
    echo -e "    \e[4m$name\e[0m --help"
    echo ""
    echo -e "\e[1mDESCRIPTION\e[0m"
    echo "    Perform a bonita-web-pages release based on current branch."
    echo "      - Create and push tag <version>"
    echo ""
    echo -e "\e[1mARGUMENTS\e[0m"
    echo "    <version>        the version of the release to be done"
    echo ""
    echo -e "\e[1mOPTIONS\e[0m"
    echo "    --help           display this help"
    echo ""
    echo -e "\e[1mEXEMPLE\e[0m"
    echo "    Let's say you are on master branch and you want to create a 7.3.2 release based on this branch"
    echo ""
    echo ""
    echo "    $ $name 7.3.2"
    echo ""
    echo "    will create release 7.3.2 with master's HEAD as starting point"
    echo ""
}

if [ $# -lt 1 ] || [ $1 = "--help" ]
then
    usage
    exit 1
fi

BASEDIR=$(dirname $(readlink -f "$0"))/..
pushd $BASEDIR

RELEASE_VERSION=$1

###################################################################################################
#  Create release
###################################################################################################
# create release branch
git checkout -B release/$RELEASE_VERSION

# Commit and tag
echo "--- Creating commit and tag"
./gradlew release -Prelease.version=$RELEASE_VERSION
popd