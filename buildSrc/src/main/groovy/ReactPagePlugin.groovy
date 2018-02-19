import org.gradle.api.Plugin
import org.gradle.api.Project

class ReactPagePlugin extends PagePlugin {

    def implementDistribution(Project project){
        project.distributions{
            main {
                contents {
                    from('resources') { into '/' }
                    from('build') { into '/resources' }
                }
            }
        }
    }

}
