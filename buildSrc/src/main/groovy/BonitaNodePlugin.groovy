import org.gradle.api.Plugin
import org.gradle.api.Project

class BonitaNodePlugin implements Plugin<Project> {
    @Override
    void apply(Project project) {
        def extension = project.extensions.create('bonitaNode', BonitaNodePluginExtension)
        project.plugins.apply('com.moowork.node')
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

        project.tasks.npmInstall.configure {
            group 'Bonita'
            description 'Install node moodule for this project'
            inputs.files('package.json', 'package-lock.json')
            outputs.dirs('node_modules')
        }
    }
}
