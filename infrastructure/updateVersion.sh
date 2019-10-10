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
    echo "    Perform a bonita-web-pages version update for next dev."
    echo ""
    echo -e "\e[1mARGUMENTS\e[0m"
    echo "    <version>        the next version"
    echo ""
}

if [ $# -lt 1 ] || [ $1 = "--help" ]
then
    usage
    exit 1
fi

BASEDIR=$(dirname $(readlink -f "$0"))/..
pushd $BASEDIR

NEW_VERSION=$1

###################################################################################################
#  Update to next version
###################################################################################################

./gradlew markNextVersion -Pnext.snapshot=$NEW_VERSION
popd
