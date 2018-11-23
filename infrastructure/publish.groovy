/**
 * This script is only use on older CI (Like inno2, dev and master)
 * When this script will be move on YMCI, we can clear it
 */
node {
    /**
     * Do this because old jenkins is broken
     */
    deleteDir()

    stage 'Checkout'
      checkout scm
      /**
      * Do this because old git plugin is broken
      */
      sh "git branch --force $BRANCH_NAME $BRANCH_NAME"
      sh "git checkout $BRANCH_NAME"

    stage 'Publish'
      sh "./gradlew clean build publish"

}
