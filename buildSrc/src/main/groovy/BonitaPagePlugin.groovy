import org.gradle.api.Plugin
import org.gradle.api.Project

class BonitaPagePlugin implements Plugin<Project> {

    @Override
    void apply(Project project) {
        def extension = project.extensions.create('bonitaPage', BonitaPagePluginExtension)
        project.plugins.apply('com.github.node-gradle.node')
        project.plugins.apply('distribution')

        project.tasks.npm_install.configure {
            group 'Bonita'
            description 'Install node moodule for this project'
            inputs.files('package.json', 'package-lock.json')
        }

        def buildPage = project.task([type: com.github.gradle.node.npm.task.NpmTask, dependsOn: project.tasks.npm_install], 'buildPage') {
            group 'Bonita'
            description 'Build a ZIP which contains an custom-page to be imported in living application'
            args = ['run', 'build:only']
            inputs.files('package.json', 'package-lock.json')
            inputs.dir('src')
            inputs.dir('resources')
            outputs.files(project.fileTree({extension.frontendBuildDir}))
        }

        project.tasks.distZip.dependsOn buildPage

        project.task([type: com.github.gradle.node.npm.task.NpmTask], 'lintFix') {
            group 'Bonita'
            args = ['run', 'lint:fix']
            description 'Format all files in directory /src with prettier'
        }

        def lintCheck = project.task([type: com.github.gradle.node.npm.task.NpmTask, dependsOn: project.tasks.npm_install], 'lintCheck') {
            group 'Bonita'
            args = ['run', 'lint:check']
            description 'Check if format issues exist on directory src'
        }

        def test = project.task([type: com.github.gradle.node.npm.task.NpmTask, dependsOn: project.tasks.npm_install], 'test') {
            group 'Bonita'
            args = ['run', 'test']
            description 'Run test of project'
        }

        project.tasks.buildPage.dependsOn lintCheck
        project.tasks.buildPage.dependsOn test

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
                    from({ extension.frontendBuildDir }) {
                        into '/resources'
                    }
                }
            }
        }

    }

}
