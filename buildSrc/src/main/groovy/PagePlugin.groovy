import org.gradle.api.Plugin
import org.gradle.api.Project

abstract class PagePlugin implements Plugin<Project> {

    @Override
    void apply(Project project) {
        project.plugins.apply('com.moowork.node')
        project.plugins.apply('distribution')
        def currentDir = project.rootProject.projectDir

        project.node {
            version = '8.9.4'
            npmVersion = '5.6.0'
            download = true

            workDir = project.file("${currentDir}/.gradle/nodejs")
            npmWorkDir = project.file("${currentDir}/.gradle/npm")
        }

        project.tasks.npm_install.configure {
            inputs.files('package.json', 'package-lock.json')
            outputs.dirs('node_modules')
        }

        def buildNpm = project.task( [type: com.moowork.gradle.node.npm.NpmTask, dependsOn: project.tasks.npm_install]  ,'buildNpm') {
            args = ['run', 'build']
            inputs.files('package.json', 'package-lock.json')
            inputs.dir('src')
        }

        project.tasks.distZip.dependsOn buildNpm

        def cleanNpm = project.task([:], 'cleanNpm') {
            doFirst {
                project.delete 'dist'
            }
        }

        project.tasks.clean.dependsOn cleanNpm

        implementDistribution(project);
    }

    abstract implementDistribution(Project project);
}
