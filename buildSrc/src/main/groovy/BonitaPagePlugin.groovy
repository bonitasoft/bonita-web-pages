import org.gradle.api.Project

class BonitaPagePlugin extends BonitaNodePlugin {

    @Override
    void apply(Project project) {
        super.apply(project)
        def extension = project.extensions.create('bonitaPage', BonitaPagePluginExtension)
        project.plugins.apply('distribution')

        def buildPage = project.task([type: com.moowork.gradle.node.npm.NpmTask, dependsOn: project.tasks.npmInstall], 'buildPage') {
            group 'Bonita'
            description 'Build a ZIP which contains an custom-page to be imported in living application'
            args = ['run', 'build:only']
            inputs.files('package.json', 'package-lock.json')
            inputs.dir('src')
            inputs.dir('resources')
            outputs.dirs({extension.frontendBuildDir})
        }

        project.tasks.distZip.dependsOn buildPage

        project.task([type: com.moowork.gradle.node.npm.NpmTask], 'lintFix') {
            group 'Bonita'
            args = ['run', 'lint:fix']
            description 'Format all files in directory /src with prettier'
        }

        def lintCheck = project.task([type: com.moowork.gradle.node.npm.NpmTask, dependsOn: project.tasks.npmInstall], 'lintCheck') {
            group 'Bonita'
            args = ['run', 'lint:check']
            description 'Check if format issues exist on directory src'
        }

        def test = project.task([type: com.moowork.gradle.node.npm.NpmTask, dependsOn: project.tasks.npmInstall], 'test') {
            group 'Bonita'
            args = ['run', 'test']
            description 'Run test of project'
        }

        project.tasks.buildPage.dependsOn lintCheck
        project.tasks.buildPage.dependsOn test

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
