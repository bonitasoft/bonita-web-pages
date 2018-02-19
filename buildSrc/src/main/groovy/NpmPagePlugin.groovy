import org.gradle.api.Plugin
import org.gradle.api.Project

class NpmPagePlugin extends PagePlugin {

    def implementDistribution(Project project){
        project.distributions{
            main {
                contents {
                    from('resources') { into '/' }
                    from('dist') { into '/resources' }
                }
            }
        }
    }
}
