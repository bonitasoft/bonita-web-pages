import org.gradle.api.Plugin
import org.gradle.api.Project
import org.gradle.api.artifacts.repositories.IvyArtifactRepository

class BonitaHtmlPagePlugin implements Plugin<Project> {

    @Override
    void apply(Project project) {
        def extension = project.extensions.create('bonitaPage', BonitaPagePluginExtension)
        project.plugins.apply('com.moowork.node')
        project.plugins.apply('distribution')
        def currentDir = project.rootProject.projectDir

        // Bug here: https://github.com/srs/gradle-node-plugin/issues/301
        // `com.moowork.node` to be replaced by https://github.com/node-gradle/gradle-node-plugin
        project.repositories.whenObjectAdded {
            if (it instanceof IvyArtifactRepository) {
                metadataSources {
                    artifact()
                }
            }
        }

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
            description 'Install node module for this project'
            inputs.files('package.json')
        }

        def buildPage = project.task([type: com.moowork.gradle.node.npm.NpmTask, dependsOn: project.tasks.npm_install], 'buildPage') {
            group 'Bonita'
            description 'Build a ZIP which contains an custom-page to be imported in living application'
            args = ['run']
            inputs.files('package.json')
            inputs.dir('src')
            inputs.dir('resources')
            outputs.dirs({extension.frontendBuildDir})
        }

        project.tasks.distZip.dependsOn buildPage

        def cleanNpm = project.task([:], 'cleanNpm') {
            group 'Bonita'
            description 'Clean node module for this project'
            doFirst {
                project.delete extension.frontendBuildDir
            }
        }

        project.tasks.clean.dependsOn cleanNpm

        project.distributions {
            main {
                contents {
                    from('resources') { into '/' }
                    from('src') { into '/resources' }
                }
            }
        }
    }
}
