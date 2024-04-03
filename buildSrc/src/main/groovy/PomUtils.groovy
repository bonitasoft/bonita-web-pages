import org.gradle.api.publish.maven.MavenPom

/**
 * Utility class to generate Community information necessary to publish to Maven Central.
 */
class PomUtils {

    static void pomCommunityPublication(MavenPom pom) {
        pom.with {
            url = 'https://community.bonitasoft.com/'
            organization {
                name = 'Bonitasoft S.A.'
                url = 'https://community.bonitasoft.com/'
            }
            developers {
                developer {
                    id = "bonita-web-team"
                    name = "The Bonita Web Development Team"
                    organization = "Bonitasoft S.A."
                    organizationUrl = "http://community.bonitasoft.com/"
                }
            }
            scm {
                connection = "scm:git:http://github.com/bonitasoft/bonita-web-pages.git"
                developerConnection = "scm:git:git@github.com:bonitasoft/bonita-web-pages.git"
                url = "http://github.com/bonitasoft/bonita-web-pages"
            }
            licenses {
                license {
                    name = 'GNU General Public License Version 2.0'
                    url = 'http://www.gnu.org/licenses/gpl-2.0.html'
                    distribution = 'repo'
                }
            }
        }
    }
}
