import org.gradle.api.Plugin
import org.gradle.api.Project

class BonitaHtmlPagePlugin implements Plugin<Project> {

    @Override
    void apply(Project project) {
        def extension = project.extensions.create('bonitaPage', BonitaPagePluginExtension)
        project.plugins.apply('com.github.node-gradle.node')
        project.plugins.apply('distribution')
        def projectRootDir = project.rootProject.projectDir
        def cacheDir = project.rootProject.layout.projectDirectory.dir(".gradle")

        project.node {
            version = Versions.nodeVersion
            npmVersion = Versions.npmVersion
            download = true
        }

        project.tasks.npm_install.configure {
            group 'Bonita'
            description 'Install node module for this project'
            inputs.files('package.json')
        }

        def buildPage = project.task([type: com.github.gradle.node.npm.task.NpmTask, dependsOn: project.tasks.npm_install], 'buildPage') {
            group 'Bonita'
            description 'Build a ZIP which contains an custom-page to be imported in living application'
            args = ['run']
            inputs.files('package.json')
            inputs.dir('src')
            inputs.dir('resources')
            outputs.dirs({ extension.frontendBuildDir })
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
