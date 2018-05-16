import org.gradle.api.Plugin
import org.gradle.api.Project

class BonitaPagePlugin implements Plugin<Project> {

    @Override
    void apply(Project project) {
        def extension = project.extensions.create('bonitaPage', BonitaPagePluginExtension)
        project.plugins.apply('com.moowork.node')
        project.plugins.apply('distribution')
        def currentDir = project.rootProject.projectDir

        project.beforeEvaluate {
            project.node {
                version = extension.nodeVersion
                npmVersion = extension.npmVersion
            }
        }

        project.node {
            download = true

            workDir = project.file("${currentDir}/.gradle/nodejs")
            npmWorkDir = project.file("${currentDir}/.gradle/npm")
        }

        project.tasks.npm_install.configure {
            group 'Bonita'
            description 'Install node moodule for this project'
            inputs.files('package.json', 'package-lock.json')
            outputs.dirs('node_modules')
        }

        def buildPage = project.task([type: com.moowork.gradle.node.npm.NpmTask, dependsOn: project.tasks.npm_install], 'buildPage') {
            group 'Bonita'
            description 'Build a ZIP which contains an custom-page to be imported in living application'
            args = ['run', 'build']
            inputs.files('package.json', 'package-lock.json')
            inputs.dir('src')
            inputs.dir('resources')
            outputs.dirs({extension.frontendBuildDir})
        }

        project.tasks.distZip.dependsOn buildPage

        project.task([type: com.moowork.gradle.node.npm.NpmTask], 'prettier') {
            group 'Bonita'
            args = ['run', 'prettier']
            description 'Format all files in directory /src with prettier'
        }

        def eslint = project.task([type: com.moowork.gradle.node.npm.NpmTask, dependsOn: project.tasks.npm_install], 'eslint') {
            group 'Bonita'
            args = ['run', 'eslint']
            description 'Check if format issues exist on directory src'
        }

        project.tasks.buildPage.dependsOn eslint

        def cleanNpm = project.task([:], 'cleanNpm') {
            group 'Bonita'
            description 'Clean node moodule for this project'
            doFirst {
                project.delete extension.frontendBuildDir
            }
        }

        project.tasks.clean.dependsOn cleanNpm

        project.distributions {
            main {
                contents {
                    from('resources') { into '/' }
                    from({ extension.frontendBuildDir }) {
                        into '/resources'
                    }
                }
            }
        }

    }

}
