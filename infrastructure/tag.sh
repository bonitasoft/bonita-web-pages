#!/usr/bin/env bash
set -e

# $1 isRelease -- True if tag is created and pushed
commit_and_push() {
  isRelease=$1
  if [ $isRelease = true ]; then
      echo "--- Creating commit and tag"
      git commit -a -m "release(${RELEASE_VERSION}) create release $RELEASE_VERSION"
      git tag -a $RELEASE_VERSION -m "Release $RELEASE_VERSION"
      git push origin $RELEASE_VERSION:$RELEASE_VERSION
  else
      echo "--- Creating commit"
      git commit -a -m "chore(release) prepare next development version $RELEASE_VERSION"
      git push
  fi
}

usage() {
    name=$(basename $0)
    echo ""
    echo -e "\e[1mSYNOPSIS\e[0m"
    echo -e "    \e[4m$name\e[0m <version>"
    echo -e "    \e[4m$name\e[0m --help"
    echo ""
    echo -e "\e[1mDESCRIPTION\e[0m"
    echo "    Perform a bonita-data-repository release based on current branch."
    echo "      - Change versions to <version> where needed (mostly in pom.xml)"
    echo "      - Create and push tag <version>"
    echo ""
    echo -e "\e[1mARGUMENTS\e[0m"
    echo "    <version>        the version of the release to be done"
    echo ""
    echo -e "\e[1mOPTIONS\e[0m"
    echo "    --help           display this help"
    echo ""
    echo -e "\e[1mEXEMPLE\e[0m"
    echo "    Let's say you are on master branch and you want to create a 7.10.0 release based on this branch"
    echo ""
    echo ""
    echo "    $ $name 7.10.0"
    echo ""
    echo "    will create release 7.10.0 with master's HEAD as starting point"
    echo ""
}

if [ $# -lt 1 ] || [ $1 = "--help" ]
then
    usage
    exit 1
fi

RELEASE_VERSION=$1

###################################################################################################
#  Create release
###################################################################################################

isRelease=$2
if [ $isRelease = true ]; then
      echo "--- Creating commit and tag"
      # create release branch
      git checkout -B release/$RELEASE_VERSION
fi

# Commit and tag
commit_and_push $isRelease
