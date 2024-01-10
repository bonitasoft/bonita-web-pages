import { Given as given, Then as then, When as when } from "cypress-cucumber-preprocessor/steps";

const urlPrefix = 'build/dist/';
const profilesUrl = 'API/portal/profile';
const profileMemberUrl = 'API/portal/profileMember';
const defaultProfileFilters = '&o=name ASC';
const defaultRequestUrl = urlPrefix + profilesUrl + '?c=10&p=0&t=0' + defaultProfileFilters;
const refreshUrl = urlPrefix + profilesUrl + '?c=10&p=0&t=1*' + defaultProfileFilters;
const userMappingUrl = urlPrefix + profileMemberUrl + '?p=0&c=10&f=profile_id=101&f=member_type=user&d=user_id';
const userMappingUrlTwo = urlPrefix + profileMemberUrl + '?p=0&c=10&f=profile_id=2&f=member_type=user&d=user_id';
const groupMappingUrl = urlPrefix + profileMemberUrl + '?p=0&c=10&f=profile_id=101&f=member_type=group&d=group_id';
const roleMappingUrl = urlPrefix + profileMemberUrl + '?p=0&c=10&f=profile_id=101&f=member_type=role&d=role_id';
const roleMappingUrlTwo = urlPrefix + profileMemberUrl + '?p=0&c=10&f=profile_id=2&f=member_type=role&d=role_id';
const membershipMappingUrl = urlPrefix + profileMemberUrl + '?p=0&c=10&f=profile_id=101&f=member_type=roleAndGroup&d=group_id&d=role_id';
const refreshUserMappingUrl = urlPrefix + profileMemberUrl + '?c=10&p=0&f=profile_id=101&f=member_type=user&d=user_id';
const refreshRoleMappingUrl = urlPrefix + profileMemberUrl + '?c=10&p=0&f=profile_id=101&f=member_type=role&d=role_id';
const refreshGroupMappingUrl = urlPrefix + profileMemberUrl + '?c=10&p=0&f=profile_id=101&f=member_type=group&d=group_id';
const refreshMembershipMappingUrl = urlPrefix + profileMemberUrl + '?c=10&p=0&f=profile_id=101&f=member_type=roleAndGroup&d=group_id&d=role_id';
const userSearchUrl = urlPrefix + 'API/identity/user?p=0&c=10&o=firstname,lastname&f=enabled=true&s=';
const roleSearchUrl = urlPrefix + 'API/identity/role?p=0&c=10&o=name ASC&s=';
const groupSearchUrl = urlPrefix + 'API/identity/group?p=0&c=10&o=name ASC&s=';
const membershipRoleSearchUrl = urlPrefix + 'API/identity/role?p=0&c=10&o=displayName&s=';
const membershipGroupSearchUrl = urlPrefix + 'API/identity/group?p=0&c=10&o=displayName&s=';
const defaultUserMappingFilters = '&f=profile_id=101&f=member_type=user&d=user_id';
const defaultRoleMappingFilters = '&f=profile_id=101&f=member_type=role&d=role_id';
const defaultGroupMappingFilters = '&f=profile_id=101&f=member_type=group&d=group_id';
const defaultMembershipMappingFilters = '&f=profile_id=101&f=member_type=roleAndGroup&d=group_id&d=role_id';
const featureListUrl = 'API/system/feature?p=0&c=100';

given("The response {string} is defined", (responseType) => {
    cy.server();
    switch (responseType) {
        case 'refresh not called':
            cy.route({
                method: "GET",
                url: refreshUrl,
                onRequest: () => {
                    throw new Error("This should have not been called");
                }
            });
            break;
        case 'default filter':
            createRouteWithResponse(defaultRequestUrl, 'profiles8Route', 'profiles8');
            createRouteWithResponse(urlPrefix + featureListUrl, 'featureListRoute', 'featureList');
            break;
        case 'default filter with headers':
            createRouteWithResponseAndHeaders(defaultRequestUrl, '', 'profiles8Route', 'profiles8', {'content-range': '0-7/8'});
            createRouteWithResponse(urlPrefix + featureListUrl, 'featureListRoute', 'featureList');
            break;
        case 'sort by':
            createRoute(profilesUrl + '?c=10&p=0&t=0&o=name+ASC', 'sortNameAscRoute');
            createRoute(profilesUrl + '?c=10&p=0&t=0&o=name+DESC', 'sortNameDescRoute');
            break;
        case 'search':
            createRouteWithResponse(defaultRequestUrl + '&s=Administrator', 'searchAdministratorRoute', 'profiles1');
            createRouteForSpecialCharacterProfile(urlPrefix + profilesUrl, '&Speci@lProfile', 'json/profileSpecial', 'specialProfileRoute')
            createRouteWithResponse(defaultRequestUrl + '&s=Search term with no match', 'emptyResultRoute', 'emptyResult');
            break;
        case 'search mapped user':
            createRoute(profileMemberUrl + '?c=10&p=0&f=profile_id=101&f=member_type=user&d=user_id&t=1*&s=Helen', 'searchHelenRoute');
            createRouteForSpecialCharacterUser(urlPrefix + profileMemberUrl, '&Speci@lUser', 'specialUserRoute');
            createRoute(profileMemberUrl + '?p=0&c=10&f=profile_id=101&f=member_type=user&d=user_id&s=Search term with no match', 'emptyResultRoute');
            break;
        case 'search mapped role':
            createRoute(profileMemberUrl + '?c=10&p=0&f=profile_id=101&f=member_type=role&d=role_id&t=1*&s=Executive', 'searchExecutiveRoute');
            createRouteForSpecialCharacterRole(urlPrefix + profileMemberUrl, '&Speci@lRole', 'specialRoleRoute');
            createRoute(profileMemberUrl + '?p=0&c=10&f=profile_id=101&f=member_type=role&d=role_id&s=Search term with no match', 'emptyResultRoute');
            break;
        case 'search mapped group':
            createRoute(profileMemberUrl + '?c=10&p=0&f=profile_id=101&f=member_type=group&d=group_id&t=1*&s=Acme', 'searchAcmeRoute');
            createRouteForSpecialCharacterGroup( urlPrefix + profileMemberUrl,'&Speci@lGroup','specialGroupRoute');
            createRoute(profileMemberUrl + '?c=10&p=0&f=profile_id=101&f=member_type=group&d=group_id&s=Search term with no match', 'emptyResultRoute');
            break;
        case 'search mapped membership':
            createRoute(profileMemberUrl + '?c=10&p=0&f=profile_id=101&f=member_type=roleAndGroup&d=group_id&d=role_id&t=1*&s=Executive', 'searchExecutiveRoute');
            createRouteForSpecialCharacterMembership(urlPrefix + profileMemberUrl, '&Speci@lMembership', 'specialMembershipRoute')
            createRoute(profileMemberUrl + '?p=0&c=10&f=profile_id=101&f=member_type=roleAndGroup&d=group_id&d=role_id&s=Search term with no match', 'emptyResultRoute');
            break;
        case 'profile deletion success':
            createRouteWithMethod(profilesUrl + '/101', 'profileDeletionRoute', 'DELETE');
            break;
        case 'refresh list after delete':
            createRouteWithResponse(refreshUrl, 'refreshUrlRoute', 'profiles7');
            break;
        case '403 during deletion':
            createRouteWithMethodAndStatus(profilesUrl + '/101', 'unauthorizedDeleteProfileRoute', 'DELETE', '403');
            break;
        case '404 during deletion':
            createRouteWithMethodAndStatus(profilesUrl + '/101', 'notFoundDeleteProfileRoute', 'DELETE', '404');
            break;
        case '500 during deletion':
            createRouteWithMethodAndStatus(profilesUrl + '/101', 'internalErrorDeleteProfileRoute', 'DELETE', '500');
            break;
        case 'profile creation success':
            createRouteWithMethod(profilesUrl, 'profileCreationRoute', 'POST');
            break;
        case 'refresh list after create':
            createRouteWithResponse(refreshUrl, 'refreshUrlRoute', 'profiles9');
            break;
        case '403 during creation':
            createRouteWithMethodAndStatus(profilesUrl, 'unauthorizedCreateProfileRoute', 'POST', '403');
            break;
        case 'already exists during creation':
            createRouteWithResponseAndMethodAndStatus(urlPrefix + profilesUrl, 'alreadyExistsCreateProfileRoute', 'alreadyExistsException', 'POST', '403');
            break;
        case '500 during creation':
            createRouteWithMethodAndStatus(profilesUrl, 'internalErrorCreateProfileRoute', 'POST', '500');
            break;
        case 'profile edition success':
            createRouteWithMethod(profilesUrl + "/101", 'profileEditionRoute', 'PUT');
            break;
        case 'refresh list after edit':
            createRouteWithResponse(refreshUrl, 'refreshUrlRoute', 'profiles8Modified');
            break;
        case '403 during edition':
            createRouteWithMethodAndStatus(profilesUrl + "/101", 'unauthorizedEditProfileRoute', 'PUT', '403');
            break;
        case '404 during edition':
            createRouteWithMethodAndStatus(profilesUrl + "/101", 'unauthorizedEditProfileRoute', 'PUT', '404');
            break;
        case '500 during edition':
            createRouteWithMethodAndStatus(profilesUrl + "/101", 'internalErrorEditProfileRoute', 'PUT', '500');
            break;
        case 'mapping':
            createRouteWithResponse(userMappingUrl + '&t=1*', 'profileMappingUsers10Route', 'profileMappingUsers10');
            createRouteWithResponse(userMappingUrlTwo + '&t=1*', 'profileMappingUsers2Route', 'profileMappingUsers2');
            createRouteWithResponse(groupMappingUrl + '&t=1*', 'profileMappingGroups10Route', 'profileMappingGroups10');
            createRouteWithResponse(roleMappingUrl + '&t=1*', 'profileMappingRoles10Route', 'profileMappingRoles10');
            createRouteWithResponse(roleMappingUrlTwo + '&t=1*', 'profileMappingRoles2Route', 'profileMappingRoles2');
            createRouteWithResponse(membershipMappingUrl + '&t=1*', 'profileMappingMemberships2Route', 'profileMappingMemberships2');
            break;
        case 'user list':
            createRouteWithResponse(userSearchUrl + 'H', 'userListRoute', 'userList');
            createRouteWithResponse(userSearchUrl + 'Helen Kell', 'userListRoute', 'userList');
            break;
        case 'user list with 10 elements':
            createRouteWithResponse(userSearchUrl + 'U', 'userListWith10ElementsRoute', 'userListWith10Elements');
            createRouteWithResponse(userSearchUrl + 'Us', 'userListRoute', 'userList');
            break;
        case 'add user and refresh list':
            createRouteWithMethod(profileMemberUrl, 'addUserMemberRoute', 'POST');
            createRoute(userMappingUrl + '&t=1*', 'refreshUserMappingUrlRoute');
            break;
        case 'remove user and refresh list':
            createRouteWithResponse(urlPrefix + profileMemberUrl + '?p=0&c=10&f=profile_id=101&f=member_type=user&d=user_id&s=H&t=1*', 'searchUserRoute', 'profileMappingUsers8');
            createRouteWithMethod(profileMemberUrl + '/68', 'removeUserMemberRoute', 'DELETE');
            createRoute(userMappingUrl + '&t=1*', 'refreshUserMappingUrlRoute');
            break;
        case 'refresh mapped user list':
            createRouteWithResponse(refreshUserMappingUrl + '&t=1*', 'refreshUsersMappingRoute', 'profileMappingUsers10');
            break;
        case '500 during edit user mapping':
            createRouteWithResponse(urlPrefix + profileMemberUrl + '?p=0&c=10&f=profile_id=101&f=member_type=user&d=user_id&s=H&t=1*', 'searchUserRoute', 'profileMappingUsers8');
            createRouteWithResponseAndPagination(profileMemberUrl, defaultUserMappingFilters + '&t=1*', 'profileMappingUsers10Route', 'profileMappingUsers10', '0', '10');
            createRouteWithMethodAndStatus(profileMemberUrl + '/68', 'removeUserMemberRoute', 'DELETE', 500);
            createRouteWithMethodAndStatus(profileMemberUrl, 'addUserMemberRoute', 'POST', 500);
            break;
        case '404 during edit user mapping':
            createRouteWithResponse(urlPrefix + profileMemberUrl + '?p=0&c=10&f=profile_id=101&f=member_type=user&d=user_id&s=H&t=1*', 'searchUserRoute', 'profileMappingUsers8');
            createRouteWithResponseAndPagination(profileMemberUrl, defaultUserMappingFilters + '&t=1*', 'profileMappingUsers10Route', 'profileMappingUsers10', '0', '10');
            createRouteWithMethodAndStatus(profileMemberUrl + '/68', 'removeUserMemberRoute', 'DELETE', 404);
            createRouteWithMethodAndStatus(profileMemberUrl, 'addUserMemberRoute', 'POST', 404);
            break;
        case '403 during edit user mapping':
            createRouteWithResponse(urlPrefix + profileMemberUrl + '?p=0&c=10&f=profile_id=101&f=member_type=user&d=user_id&s=H&t=1*', 'searchUserRoute', 'profileMappingUsers8');
            createRouteWithResponseAndPagination(profileMemberUrl, defaultUserMappingFilters + '&t=1*', 'profileMappingUsers10Route', 'profileMappingUsers10', '0', '10');
            createRouteWithMethodAndStatus(profileMemberUrl + '/68', 'removeUserMemberRoute', 'DELETE', 403);
            createRouteWithMethodAndStatus(profileMemberUrl, 'addUserMemberRoute', 'POST', 403);
            break;
        case 'user already exists during edit user mapping':
            createRouteWithResponseAndPagination(profileMemberUrl, defaultUserMappingFilters + '&t=1*', 'profileMappingUsers10Route', 'profileMappingUsers10', '0', '10');
            createRouteWithResponseAndMethodAndStatus(urlPrefix + profileMemberUrl, 'addUserMemberRoute', 'alreadyExistsException','POST', 403);
            break;
        case 'user does not exist during edit user mapping':
            createRouteWithResponseAndPagination(profileMemberUrl, defaultUserMappingFilters + '&t=1*', 'profileMappingUsers10Route', 'profileMappingUsers10', '0', '10');
            createRouteWithResponseAndMethodAndStatus(urlPrefix + profileMemberUrl, 'addUserMemberRoute', 'userDoesNotExistException','POST', 500);
            break;
        case 'member does not exist during edit user mapping':
            createRouteWithResponseAndPagination(profileMemberUrl, defaultUserMappingFilters + '&t=1*', 'profileMappingUsers10Route', 'profileMappingUsers10', '0', '10');
            createRouteWithResponseAndMethodAndStatus(urlPrefix + profileMemberUrl, 'addUserMemberRoute', 'memberDoesNotExistException','POST', 500);
            break;
        case 'role list':
            createRouteWithResponse(roleSearchUrl + 'E', 'roleListRoute', 'roleList');
            createRouteWithResponse(roleSearchUrl + 'Executive Assistant', 'roleListRoute', 'roleList');
            break;
        case 'role list with 10 elements':
            createRouteWithResponse(roleSearchUrl + 'E', 'roleListWith10ElementsRoute', 'roleListWith10Elements');
            createRouteWithResponse(roleSearchUrl + 'Ex', 'roleListRoute', 'roleList');
            break;
        case 'add role and refresh list':
            createRouteWithMethod(profileMemberUrl, 'addRoleMemberRoute', 'POST');
            createRoute(roleMappingUrl + '&t=1*', 'refreshRoleMappingUrlRoute');
            break;
        case 'remove role and refresh list':
            createRouteWithResponse(urlPrefix + profileMemberUrl + '?p=0&c=10&f=profile_id=101&f=member_type=role&d=role_id&s=E&t=1*', 'searchRoleRoute', 'profileMappingRoles8');
            createRouteWithMethod(profileMemberUrl + '/956', 'removeRoleMemberRoute', 'DELETE');
            createRoute(roleMappingUrl + '&t=1*', 'refreshRoleMappingUrlRoute');
            break;
        case 'refresh mapped role list':
            createRouteWithResponse(refreshRoleMappingUrl + '&t=1*', 'refreshRolesMappingRoute', 'profileMappingRoles10');
            break;
        case '500 during edit role mapping':
            createRouteWithResponse(urlPrefix + profileMemberUrl + '?p=0&c=10&f=profile_id=101&f=member_type=role&d=role_id&s=E&t=1*', 'searchRoleRoute', 'profileMappingRoles8');
            createRouteWithResponseAndPagination(profileMemberUrl, defaultRoleMappingFilters + '&t=1*', 'profileMappingRoles10Route', 'profileMappingRoles10', '0', '10');
            createRouteWithMethodAndStatus(profileMemberUrl + '/956', 'removeRoleMemberRoute', 'DELETE', 500);
            createRouteWithMethodAndStatus(profileMemberUrl, 'addRoleMemberRoute', 'POST', 500);
            break;
        case '404 during edit role mapping':
            createRouteWithResponse(urlPrefix + profileMemberUrl + '?p=0&c=10&f=profile_id=101&f=member_type=role&d=role_id&s=E&t=1*', 'searchRoleRoute', 'profileMappingRoles8');
            createRouteWithResponseAndPagination(profileMemberUrl, defaultRoleMappingFilters + '&t=1*', 'profileMappingRoles10Route', 'profileMappingRoles10', '0', '10');
            createRouteWithMethodAndStatus(profileMemberUrl + '/956', 'removeRoleMemberRoute', 'DELETE', 404);
            createRouteWithMethodAndStatus(profileMemberUrl, 'addRoleMemberRoute', 'POST', 404);
            break;
        case '403 during edit role mapping':
            createRouteWithResponse(urlPrefix + profileMemberUrl + '?p=0&c=10&f=profile_id=101&f=member_type=role&d=role_id&s=E&t=1*', 'searchRoleRoute', 'profileMappingRoles8');
            createRouteWithResponseAndPagination(profileMemberUrl, defaultRoleMappingFilters + '&t=1*', 'profileMappingRoles10Route', 'profileMappingRoles10', '0', '10');
            createRouteWithMethodAndStatus(profileMemberUrl + '/956', 'removeRoleMemberRoute', 'DELETE', 403);
            createRouteWithMethodAndStatus(profileMemberUrl, 'addRoleMemberRoute', 'POST', 403);
            break;
        case 'role already exists during edit role mapping':
            createRouteWithResponseAndPagination(profileMemberUrl, defaultRoleMappingFilters + '&t=1*', 'profileMappingRoles10Route', 'profileMappingRoles10', '0', '10');
            createRouteWithResponseAndMethodAndStatus(urlPrefix + profileMemberUrl, 'addRoleMemberRoute', 'alreadyExistsException','POST', 403);
            break;
        case 'role does not exist during edit role mapping':
            createRouteWithResponseAndPagination(profileMemberUrl, defaultRoleMappingFilters + '&t=1*', 'profileMappingRoles10Route', 'profileMappingRoles10', '0', '10');
            createRouteWithResponseAndMethodAndStatus(urlPrefix + profileMemberUrl, 'addRoleMemberRoute', 'roleDoesNotExistException','POST', 500);
            break;
        case 'member does not exist during edit role mapping':
            createRouteWithResponseAndPagination(profileMemberUrl, defaultRoleMappingFilters + '&t=1*', 'profileMappingRoles10Route', 'profileMappingRoles10', '0', '10');
            createRouteWithResponseAndMethodAndStatus(urlPrefix + profileMemberUrl, 'addRoleMemberRoute', 'memberDoesNotExistException','POST', 500);
            break;
        case 'group list':
            createRouteWithResponse(groupSearchUrl + 'A', 'groupListRoute', 'groupList');
            createRouteWithResponse(groupSearchUrl + 'Acm', 'groupListRoute', 'groupList');
            break;
        case 'group list with 10 elements':
            createRouteWithResponse(groupSearchUrl + 'A', 'groupListWith10ElementsRoute', 'groupListWith10Elements');
            createRouteWithResponse(groupSearchUrl + 'As', 'groupListRoute', 'groupList');
            break;
        case 'add group and refresh list':
            createRouteWithMethod(profileMemberUrl, 'addGroupMemberRoute', 'POST');
            createRoute(roleMappingUrl + '&t=1*', 'refreshGroupMappingUrlRoute');
            break;
        case 'remove group and refresh list':
            createRouteWithResponse(urlPrefix + profileMemberUrl + '?&c=10&p=0f=profile_id=101&f=member_type=group&d=group_id&s=A&t=1*', 'searchGroupRoute', 'profileMappingGroups8');
            createRouteWithMethod(profileMemberUrl + '/82', 'removeGroupMemberRoute', 'DELETE');
            createRoute(groupMappingUrl + '&t=1*', 'refreshGroupMappingUrlRoute');
            break;
        case 'refresh mapped group list':
            createRouteWithResponse(refreshGroupMappingUrl + '&t=1*', 'refreshGroupsMappingRoute', 'profileMappingGroups10');
            break;
        case '500 during edit group mapping':
            createRouteWithResponse(urlPrefix + profileMemberUrl + '?&c=10&p=0f=profile_id=101&f=member_type=group&d=group_id&s=A&t=1*', 'searchGroupRoute', 'profileMappingGroups8');
            createRouteWithResponseAndPagination(profileMemberUrl, defaultGroupMappingFilters + '&t=1*', 'profileMappingGroups10Route', 'profileMappingGroups10', '0', '10');
            createRouteWithMethodAndStatus(profileMemberUrl + '/82', 'removeGroupMemberRoute', 'DELETE', 500);
            createRouteWithMethodAndStatus(profileMemberUrl, 'addGroupMemberRoute', 'POST', 500);
            break;
        case '404 during edit group mapping':
            createRouteWithResponse(urlPrefix + profileMemberUrl + '?&c=10&p=0f=profile_id=101&f=member_type=group&d=group_id&s=A&t=1*', 'searchGroupRoute', 'profileMappingGroups8');
            createRouteWithResponseAndPagination(profileMemberUrl, defaultGroupMappingFilters + '&t=1*', 'profileMappingGroups10Route', 'profileMappingGroups10', '0', '10');
            createRouteWithMethodAndStatus(profileMemberUrl + '/82', 'removeGroupMemberRoute', 'DELETE', 404);
            createRouteWithMethodAndStatus(profileMemberUrl, 'addGroupMemberRoute', 'POST', 404);
            break;
        case '403 during edit group mapping':
            createRouteWithResponse(urlPrefix + profileMemberUrl + '?c=10&p=0&f=profile_id=101&f=member_type=group&d=group_id&s=A&t=1*', 'searchGroupRoute', 'profileMappingGroups8');
            createRouteWithResponseAndPagination(profileMemberUrl, defaultGroupMappingFilters + '&t=1*', 'profileMappingGroups10Route', 'profileMappingGroups10', '0', '10');
            createRouteWithMethodAndStatus(profileMemberUrl + '/82', 'removeGroupMemberRoute', 'DELETE', 403);
            createRouteWithMethodAndStatus(profileMemberUrl, 'addGroupMemberRoute', 'POST', 403);
            break;
        case 'group already exists during edit group mapping':
            createRouteWithResponseAndPagination(profileMemberUrl, defaultGroupMappingFilters + '&t=1*', 'profileMappingGroups10Route', 'profileMappingGroups10', '0', '10');
            createRouteWithResponseAndMethodAndStatus(urlPrefix + profileMemberUrl, 'addGroupMemberRoute', 'alreadyExistsException','POST', 403);
            break;
        case 'group does not exist during edit group mapping':
            createRouteWithResponseAndPagination(profileMemberUrl, defaultGroupMappingFilters + '&t=1*', 'profileMappingGroups10Route', 'profileMappingGroups10', '0', '10');
            createRouteWithResponseAndMethodAndStatus(urlPrefix + profileMemberUrl, 'addGroupMemberRoute', 'groupDoesNotExistException','POST', 500);
            break;
        case 'member does not exist during edit group mapping':
            createRouteWithResponseAndPagination(profileMemberUrl, defaultGroupMappingFilters + '&t=1*', 'profileMappingGroups10Route', 'profileMappingGroups10', '0', '10');
            createRouteWithResponseAndMethodAndStatus(urlPrefix + profileMemberUrl, 'addGroupMemberRoute', 'memberDoesNotExistException','POST', 500);
            break;
        case 'membership list':
            createRouteWithResponse(membershipRoleSearchUrl + 'E', 'roleListRoute', 'roleList');
            createRouteWithResponse(membershipRoleSearchUrl + 'Executive Assistant', 'roleListRoute', 'roleList');
            createRouteWithResponse(membershipGroupSearchUrl + 'A', 'groupListRoute', 'groupList');
            createRouteWithResponse(membershipGroupSearchUrl + 'Acm', 'groupListRoute', 'groupList');
            break;
        case 'membership list with 10 elements':
            createRouteWithResponse(membershipRoleSearchUrl + 'E', 'roleListWith10ElementsRoute', 'roleListWith10Elements');
            createRouteWithResponse(membershipRoleSearchUrl + 'Ex', 'roleListRoute', 'roleList');
            createRouteWithResponse(membershipGroupSearchUrl + 'A', 'groupListWith10ElementsRoute', 'groupListWith10Elements');
            createRouteWithResponse(membershipGroupSearchUrl + 'Ac', 'groupListRoute', 'groupList');
            break;
        case 'add membership and refresh list':
            createRouteWithMethod(profileMemberUrl, 'addMembershipMemberRoute', 'POST');
            createRoute(membershipMappingUrl + '&t=1*', 'refreshMembershipMappingUrlRoute');
            break;
        case 'remove membership and refresh list':
            createRouteWithResponse(urlPrefix + profileMemberUrl + '?&c=10&p=0f=profile_id=101&f=member_type=roleAndGroup&d=group_id&d=role_id&s=A&t=1*', 'searchMembershipRoute', 'profileMappingMemberships8');
            createRouteWithMethod(profileMemberUrl + '/106', 'removeMembershipMemberRoute', 'DELETE');
            createRoute(membershipMappingUrl + '&t=1*', 'refreshMembershipMappingUrlRoute');
            break;
        case 'refresh mapped membership list':
            createRouteWithResponse(refreshMembershipMappingUrl + '&t=1*', 'refreshMembershipsMappingRoute', 'profileMappingMemberships2');
            break;
        case '500 during edit membership mapping':
            createRouteWithResponse(urlPrefix + profileMemberUrl + '?&c=10&p=0f=profile_id=101&f=member_type=roleAndGroup&d=group_id&d=role_id&s=A&t=1*', 'searchMembershipRoute', 'profileMappingMemberships8');
            createRouteWithResponseAndPagination(profileMemberUrl, defaultMembershipMappingFilters + '&t=1*', 'profileMappingMemberships2Route', 'profileMappingMemberships2', '0', '10');
            createRouteWithMethodAndStatus(profileMemberUrl + '/106', 'removeMembershipMemberRoute', 'DELETE', 500);
            createRouteWithMethodAndStatus(profileMemberUrl, 'addMembershipMemberRoute', 'POST', 500);
            break;
        case '404 during edit membership mapping':
            createRouteWithResponse(urlPrefix + profileMemberUrl + '?&c=10&p=0f=profile_id=101&f=member_type=roleAndGroup&d=group_id&d=role_id&s=A&t=1*', 'searchMembershipRoute', 'profileMappingMemberships8');
            createRouteWithResponseAndPagination(profileMemberUrl, defaultMembershipMappingFilters + '&t=1*', 'profileMappingMemberships2Route', 'profileMappingMemberships2', '0', '10');
            createRouteWithMethodAndStatus(profileMemberUrl + '/106', 'removeMembershipMemberRoute', 'DELETE', 404);
            createRouteWithMethodAndStatus(profileMemberUrl, 'addMembershipMemberRoute', 'POST', 404);
            break;
        case '403 during edit membership mapping':
            createRouteWithResponse(urlPrefix + profileMemberUrl + '?p=0&c=10&f=profile_id=101&f=member_type=roleAndGroup&d=group_id&d=role_id&s=A&t=1*', 'searchMembershipRoute', 'profileMappingMemberships8');
            createRouteWithResponseAndPagination(profileMemberUrl, defaultMembershipMappingFilters + '&t=1*', 'profileMappingMemberships2Route', 'profileMappingMemberships2', '0', '10');
            createRouteWithMethodAndStatus(profileMemberUrl + '/106', 'removeMembershipMemberRoute', 'DELETE', 403);
            createRouteWithMethodAndStatus(profileMemberUrl, 'addMembershipMemberRoute', 'POST', 403);
            break;
        case 'membership already exists during edit membership mapping':
            createRouteWithResponseAndPagination(profileMemberUrl, defaultMembershipMappingFilters + '&t=1*', 'profileMappingMemberships2Route', 'profileMappingMemberships2', '0', '10');
            createRouteWithResponseAndMethodAndStatus(urlPrefix + profileMemberUrl, 'addMembershipMemberRoute', 'alreadyExistsException','POST', 403);
            break;
        case 'membership does not exist during edit membership mapping':
            createRouteWithResponseAndPagination(profileMemberUrl, defaultMembershipMappingFilters + '&t=1*', 'profileMappingMemberships2Route', 'profileMappingMemberships2', '0', '10');
            createRouteWithResponseAndMethodAndStatus(urlPrefix + profileMemberUrl, 'addMembershipMemberRoute', 'membershipDoesNotExistException','POST', 500);
            break;
        case 'member does not exist during edit membership mapping':
            createRouteWithResponseAndPagination(profileMemberUrl, defaultMembershipMappingFilters + '&t=1*', 'profileMappingMemberships2Route', 'profileMappingMemberships2', '0', '10');
            createRouteWithResponseAndMethodAndStatus(urlPrefix + profileMemberUrl, 'addMembershipMemberRoute', 'memberDoesNotExistException','POST', 500);
            break;
        case 'default filter with missing features':
            createRouteWithResponse(defaultRequestUrl + '&t=0', 'profiles8Route', 'profiles8');
            break;
        case 'file upload':
            cy.intercept('POST', urlPrefix + 'API/profilesUpload', { "filename":"Profile_Data.xml","tempPath":"tmp_7171129632133896602.xml","contentType":"text\/xml" });
            break;
        case 'profile installation for imported only':
            cy.intercept('POST', urlPrefix + 'API/services/profile/import', { fixture: 'json/importProfile.json' });
            break;
        case 'profile installation for skipped only':
            cy.intercept('POST', urlPrefix + 'API/services/profile/import', { fixture: 'json/skippedProfile.json' });
            break;
        case 'profile installation for imported and skipped profiles':
            cy.intercept('POST', urlPrefix + 'API/services/profile/import', { fixture: 'json/importAndSkippedProfile.json' });
            break;
        case 'profile installation for incorrect import':
            cy.intercept('POST', urlPrefix + 'API/services/profile/import', { fixture: 'json/incorrectProfile.json' });
            break;
        default:
            throw new Error("Unsupported case");
    }

    function createRoute(urlSuffix, routeName) {
        cy.route({
            method: 'GET',
            url: urlPrefix + urlSuffix
        }).as(routeName);
    }

    function createRouteForSpecialCharacterProfile(pathname, searchParameter, response, routeName) {
        cy.intercept({
            method: 'GET',
            pathname: '/' + pathname,
            query: {
                'c': '10',
                'p': '0',
                't': '0',
                'o': 'name ASC',
                's': searchParameter
            }
        }, {
            fixture: response
        }).as(routeName);
    }

    function createRouteForSpecialCharacterGroup(pathname, searchParameter, routeName) {
        cy.intercept({
            method: 'GET',
            pathname: '/' + pathname,
            query: {
                'c': '10',
                'p': '0',
                'f[0]': 'profile_id=101',
                'f[1]': 'member_type=group',
                'd': 'group_id',
                't': '1*',
                's': searchParameter
            }
        }).as(routeName);
    }

    function createRouteForSpecialCharacterRole(pathname, searchParameter, routeName) {
        cy.intercept({
            method: 'GET',
            pathname: '/' + pathname,
            query: {
                'c': '10',
                'p': '0',
                'f[0]': 'profile_id=101',
                'f[1]': 'member_type=role',
                'd': 'role_id',
                't': '1*',
                's': searchParameter
            }
        }).as(routeName);
    }

    function createRouteForSpecialCharacterUser(pathname, searchParameter, routeName) {
        cy.intercept({
            method: 'GET',
            pathname: '/' + pathname,
            query: {
                'c': '10',
                'p': '0',
                'f[0]': 'profile_id=101',
                'f[1]': 'member_type=user',
                'd': 'user_id',
                't': '1*',
                's': searchParameter
            }
        }).as(routeName);
    }

    function createRouteForSpecialCharacterMembership(pathname, searchParameter, routeName) {
        cy.intercept({
            method: 'GET',
            pathname: '/' + pathname,
            query: {
                'c': '10',
                'p': '0',
                'f[0]': 'profile_id=101',
                'f[1]': 'member_type=roleAndGroup',
                'd[0]': 'group_id',
                'd[1]': 'role_id',
                't': '1*',
                's': searchParameter
            }
        }).as(routeName);
    }

    function createRouteWithMethod(urlSuffix, routeName, method) {
        createRouteWithMethodAndStatus(urlSuffix, routeName, method, 200);
    }

    function createRouteWithMethodAndStatus(urlSuffix, routeName, method, status) {
        cy.route({
            method: method,
            url: urlPrefix + urlSuffix,
            response: "",
            status: status
        }).as(routeName);
    }

    function createRouteWithResponse(url, routeName, response) {
        createRouteWithResponseAndMethod(url, routeName, response, 'GET');
    }

    function createRouteWithResponseAndHeaders(url, queryParameter, routeName, response, headers) {
        let responseValue = undefined;
        if (response) {
            cy.fixture('json/' + response + '.json').as(response);
            responseValue = '@' + response;
        }

        cy.route({
            method: 'GET',
            url: url + queryParameter,
            response: responseValue,
            headers: headers
        }).as(routeName);
    }

    function createRouteWithResponseAndMethod(url, routeName, response, method) {
        createRouteWithResponseAndMethodAndStatus(url, routeName, response, method, 200);
    }

    function createRouteWithResponseAndMethodAndStatus(url, routeName, response, method, status) {
        cy.fixture('json/' + response + '.json').as(response);
        cy.route({
            method: method,
            url: url,
            status: status,
            response: '@' + response
        }).as(routeName);
    }

    function createRouteWithResponseAndPagination(urlSuffix, queryParameter, routeName, response, page, count) {
        const loadMoreUrl = urlPrefix + urlSuffix + '?c=' + count + '&p=' + page;
        let responseValue = undefined;
        if (response) {
            cy.fixture('json/' + response + '.json').as(response);
            responseValue = '@' + response;
        }

        cy.route({
            method: 'GET',
            url: loadMoreUrl + queryParameter,
            response: responseValue
        }).as(routeName);
    }
});

when("I visit the admin profiles page", () => {
    cy.visit(urlPrefix + 'resources/index.html');
});

when("I put {string} in {string} filter field", (filterValue, filterType) => {
    switch (filterType) {
        case 'sort by':
            selectSortByOption(filterValue);
            break;
        case 'search':
            searchForValue(filterValue);
            break;
        default:
            throw new Error("Unsupported case");
    }

    function selectSortByOption(filterValue) {
        switch (filterValue) {
            case 'Name (Asc)':
                cy.get('select').select('0');
                break;
            case 'Name (Desc)':
                cy.get('select').select('1');
                break;
            default:
                throw new Error("Unsupported case");
        }
    }

    function searchForValue(filterValue) {
        cy.get('pb-input input').type(filterValue);
    }
});

when("I erase the search filter", () => {
    cy.get('pb-input input').clear();
});

when("I erase the search filter in the modal", () => {
    cy.get('.modal-body pb-input input').eq(1).should('be.visible').clear();
});

when("I erase the search filter in the edit membership modal", () => {
    cy.get('.modal-body pb-input input').eq(2).clear();
});

when("I click on delete button for first profile", () => {
    cy.get('.action-button-container').eq(0).within((container) => {
        cy.wrap(container).get('.glyphicon-trash').click();
    });
});

when("I click on add button", () => {
    cy.contains('button', 'Add').click();
});

when("I switch to create a profile", () => {
    cy.get('.modal-body input[type=radio]').eq(0).should('be.visible').click();
});

when("I click on import profiles", () => {
    cy.get('.modal-body input[type=radio]').eq(1).should('be.visible').click();
});

when("I click on attach icon", () => {
    cy.get('.modal-body .file-upload .input-group-btn').should('be.visible').click();
});

when("I switch to import profiles", () => {
    cy.get('.modal-body input[type=radio]').eq(1).should('be.visible').click();
});

when("I click on the {string} button in modal footer", (buttonName) => {
    cy.contains('.modal-footer button', buttonName).click();
});

when("I fill in the name and description", () => {
    cy.get('.modal-body input[type=text]').eq(0).should('be.visible').type('Profile name');
    cy.get('.modal-body textarea').type('Profile description');
});

when("I wait for {int}", (time) => {
    cy.wait(time);
});

when("I click inside the modal", () => {
    cy.get('.modal-body').click();
});

when("I click on edit button for first profile", () => {
    cy.get('.action-button-container').eq(0).within((container) => {
        cy.wrap(container).get('.glyphicon-pencil').click();
    });
});

when("I click on edit button for fifth profile", () => {
    cy.get('.action-button-container').eq(4).within((container) => {
        cy.wrap(container).get('.glyphicon-pencil').click();
    });
});

when("I click on the {string} button in modal", (buttonName) => {
    cy.contains('.modal button', buttonName).click();
});

when("I edit the information for first profile", () => {
    cy.get('.modal-body input').clear().type('New custom profile 1');
    cy.get('.modal-body textarea').clear().type('This is a new description.');
});

when("I clear the name", () => {
    cy.get('.modal-body input').eq(0).should('be.visible').clear();
});

when("I fill in the information", () => {
    cy.get('.modal-body input').type(' Profile name');
    cy.get('.modal-body textarea').type(' Profile description');
});

when("I click on show organization mapping button for first profile", () => {
    cy.get('.action-button-container').eq(0).within((container) => {
        cy.wrap(container).get('.glyphicon-triangle-bottom').click();
    });
});

when("I click on show organization mapping button for second profile", () => {
    cy.get('.action-button-container').eq(1).within((container) => {
        cy.wrap(container).get('.glyphicon-triangle-bottom').click();
    });
});

when("I click on show organization mapping button for second profile without closing the first", () => {
    cy.get('.action-button-container').eq(1).within((container) => {
        cy.wrap(container).get('.glyphicon-triangle-bottom').click();
    });
});

when("I click on hide organization mapping button for first profile", () => {
    cy.get('.action-button-container').eq(0).within((container) => {
        cy.wrap(container).get('.glyphicon-triangle-top').click();
    });
});

when("I click on edit user mapping button for first profile", () => {
    cy.get('.edit-user-mapping-icon').click();
});

when("I click on edit user mapping button for second profile", () => {
    cy.get('.edit-user-mapping-icon').click();
});

when("I click on edit role mapping button for first profile", () => {
    cy.get('.edit-role-mapping-icon').click();
});

when("I click on edit role mapping button for second profile", () => {
    cy.get('.edit-role-mapping-icon').click();
});

when("I click on edit group mapping button for first profile", () => {
    cy.get('.edit-group-mapping-icon').click();
});

when("I click on edit group mapping button for second profile", () => {
    cy.get('.edit-group-mapping-icon').click();
});

when("I click on edit membership mapping button for first profile", () => {
    cy.get('.edit-membership-mapping-icon').click();
});

when("I click on edit membership mapping button for second profile", () => {
    cy.get('.edit-membership-mapping-icon').click();
});

when("I type {string} in the user selection input", (selectedValue) => {
    cy.get('.modal .add-user-mapping-search input').scrollIntoView().type(selectedValue);
});

when("I type {string} in the group selection input", (selectedValue) => {
    cy.get('.modal .add-group-mapping-search input').scrollIntoView().type(selectedValue);
});

when("I type {string} in the role selection input", (selectedValue) => {
    cy.get('.modal .add-role-mapping-search input').scrollIntoView().type(selectedValue);
});

when("I type {string} in the role membership mapping selection input", (selectedValue) => {
    cy.get('.modal .add-role-membership-mapping-search input').scrollIntoView().type(selectedValue);
});

when("I type {string} in the group membership mapping selection input", (selectedValue) => {
    cy.get('.modal .add-group-membership-mapping-search input').scrollIntoView().type(selectedValue);
});

when("I click on {string} in the list", (option) => {
    cy.contains('.modal-content .dropdown-menu button', option).click();
});

when("I click on the remove {string} button in modal", () => {
    cy.get('.modal-content .profile-item:first-of-type .glyphicon-remove').click({force: true});
});

when("I type {string} in search input", (searchTerm) => {
    cy.get('.modal-body .mapping-search input').type(searchTerm, {force: true});
});

when("I erase one character", (userName) => {
    cy.get(".modal-body input").eq(0).should('be.visible').type("{backspace}");
});

then("The profiles page has the correct information", () => {
    cy.contains('h3', 'Profiles');
    cy.contains('.item-label-container p', 'Name').should('be.visible');
    cy.contains('.item-label-container p', 'Created on').should('be.visible');
    cy.contains('.item-label-container p', 'Updated on').should('be.visible');
    cy.contains('.item-label-container p', 'Actions').should('be.visible');
    cy.get('.profile-item').should('have.length', 8);
    cy.get('.profile-item').eq(0).should('be.visible').within(() => {
        cy.contains('.item-value', 'Custom profile 1');
        cy.contains('.item-value', '8/18/20 4:45 PM');
        cy.contains('.item-value', '8/18/20 4:45 PM');
        cy.contains('.item-label', 'This is a sample description.');
        cy.get('.action-button-container .btn.btn-link .glyphicon-triangle-bottom').should('have.attr', 'title', 'Show mapping with organization');
        cy.get('.action-button-container .btn.btn-link .glyphicon-export').should('have.attr', 'title', 'Export profile');
        cy.get('.action-button-container .btn.btn-link .glyphicon-trash').should('have.attr', 'title', 'Delete profile');
        cy.get('.is-provided-icon').should('not.exist');
    });
    cy.get('.profile-item').eq(1).should('be.visible').within(() => {
        cy.contains('.item-value', 'Administrator');
        cy.get('img.is-provided-icon').should('be.visible').should('have.attr', 'src', 'assets/img/bonitasoftLogo.png');
        cy.get('img.is-provided-icon').should('have.attr', 'title', 'Provided');
        cy.get('.action-button-container .btn.btn-link .glyphicon-trash').should('not.be.enabled');
    });
    cy.contains('.item-label', 'Profiles shown: 8 of 8');
});

then("A list of {int} items is displayed", (nbrOfItems) => {
    cy.get('.profile-item').should('have.length', nbrOfItems);
});

then("A list of {int} items is displayed out of {int}", (nbrOfItems, totalItems) => {
    cy.get('.profile-item').should('have.length', nbrOfItems);
    cy.contains('.text-primary.item-label', 'Profiles shown: ' + nbrOfItems + ' of ' + totalItems);
});

then("The api call is made for {string}", (filterValue) => {
    switch (filterValue) {
        case 'Name (Asc)':
            cy.wait('@sortNameAscRoute');
            break;
        case 'Name (Desc)':
            cy.wait('@sortNameDescRoute');
            break;
        case 'Administrator':
            cy.wait('@searchAdministratorRoute');
            break;
        case 'Helen':
            cy.wait('@searchHelenRoute');
            break;
        case 'Executive':
            cy.wait('@searchExecutiveRoute');
            break;
        case 'Acme':
            cy.wait('@searchAcmeRoute');
            break;
        case '&Speci@lProfile':
            cy.wait('@specialProfileRoute');
            break;
        case '&Speci@lGroup':
            cy.wait('@specialGroupRoute');
            break;
        case '&Speci@lMembership':
            cy.wait('@specialMembershipRoute');
            break;
        case '&Speci@lRole':
            cy.wait('@specialRoleRoute');
            break;
        case '&Speci@lUser':
            cy.wait('@specialUserRoute');
            break;
        default:
            throw new Error("Unsupported case");
    }
});

then("No profiles are displayed", () => {
    cy.get('.profiles-item:visible').should('have.length', 0);
    cy.contains('No profiles to display').should('be.visible');
});

then("No user mappings are displayed", () => {
    cy.get('.modal-body .profiles-item:visible').should('have.length', 0);
    cy.contains('No users to display').should('be.visible');
});

then("The delete modal is open and has a default state for {string}", (state) => {
    cy.contains('.modal-header h3', state).should('be.visible');
    cy.contains('.modal-body p', 'Are you sure you want to delete this profile?');
    cy.get('.modal-body .glyphicon-remove-sign').should('not.exist');
    cy.get('.modal-body .glyphicon-ok-sign').should('not.exist');
    cy.contains('.modal-footer button', 'Delete').should('be.enabled');
    cy.contains('.modal-footer button', 'Cancel').should('be.visible');
    cy.contains('.modal-footer button', 'Close').should('not.exist');
});

then("The add modal is open and has a default state for {string}", (state) => {
    cy.contains('.modal-header h3', state).should('be.visible');
    cy.contains('.modal-body p', 'Select how you want to add profiles.');
    cy.get('.modal-body .glyphicon-remove-sign').should('not.exist');
    cy.get('.modal-body .glyphicon-ok-sign').should('not.exist');
    cy.get('.modal-body input[type=radio]').should('have.length', 2);
    cy.get('.modal-body input[type=radio]').eq(0).should('be.visible').check();
    cy.get('.modal-body input[type=text]').should('have.value', '');
    cy.get('.modal-body textarea').should('have.value', '');
    cy.contains('.modal-footer button', 'Add').should('be.enabled');
    cy.contains('.modal-footer button', 'Cancel').should('be.visible');
    cy.contains('.modal-footer button', 'Close').should('not.exist');
});

then("There is no modal displayed", () => {
    cy.get('.modal').should('not.exist');
});

then("The deletion is successful", () => {
    cy.contains('.modal-footer button', 'Delete').should('be.disabled');
    cy.contains('.modal-footer button', 'Cancel').should('not.exist');
    cy.contains('.modal-footer button', 'Close').should('be.visible');
    cy.get('.modal-body .glyphicon-ok-sign').should('be.visible');
});

then("The creation is successful", () => {
    cy.contains('.modal-footer button', 'Add').should('be.disabled');
    cy.contains('.modal-footer button', 'Cancel').should('not.exist');
    cy.contains('.modal-footer button', 'Close').should('be.visible');
    cy.get('.modal-body .glyphicon-ok-sign').should('be.visible');
});

then("The profiles list is refreshed", () => {
    cy.wait('@refreshUrlRoute');
});

then("A list of {int} profiles is displayed", (nbrOfItems) => {
    cy.get('.profile-item:visible').should('have.length', nbrOfItems);
});

then("A list of {int} {string} mapped is displayed", (nbrOfItems, item) => {
    cy.contains('.modal-body', item + ' shown: ' + nbrOfItems);
});

then("I see {string} error message for {string}", (error, action) => {
    switch (error) {
        case 'already exists':
            cy.contains('.modal-body', 'A profile with the same name already exists.').should('be.visible');
            break;
        case '403':
            cy.contains('.modal-body', 'Access denied. For more information, check the log file.').should('be.visible');
            break;
        case '404':
            cy.contains('.modal-body', 'The profile does not exist. Reload the page to see the new list of profiles.').should('be.visible');
            break;
        case '500':
            cy.contains('.modal-body', 'An error has occurred. For more information, check the log file.').should('be.visible');
            break;
        default:
            throw new Error("Unsupported case");
    }
    cy.get('.modal').contains('The profile has not been ' + action + '.').should('be.visible');
});

then("I see {string} user mapping error message", (error) => {
    switch (error) {
        case '403':
            cy.contains('.modal-body', 'Access denied. For more information, check the log file.').should('be.visible');
            break;
        case '404':
            cy.contains('.modal-body', 'The user is not mapped to this profile.').should('be.visible');
            break;
        case '500':
            cy.contains('.modal-body', 'An error has occurred. For more information, check the log file.').should('be.visible');
            break;
        case 'user already exists':
            cy.contains('.modal-body', 'A user with the same username is already mapped to this profile.').should('be.visible');
            break;
        case 'user does not exist':
            cy.contains('.modal-body', 'The user does not exist anymore.').should('be.visible');
            break;
        case 'member does not exist':
            cy.contains('.modal-body', 'The user or profile cannot be found.').should('be.visible');
            break;
        default:
            throw new Error("Unsupported case");
    }
    cy.get('.modal').contains('The profile mapping has not been updated.').scrollIntoView().should('be.visible');
});

then("I don't see {string} user mapping error message", (error) => {
    switch (error) {
    case '403':
        cy.contains('.modal-body', 'Access denied. For more information, check the log file.').should('not.exist');
        break;
    case '404':
        cy.contains('.modal-body', 'The user is not mapped to this profile.').should('not.exist');
        break;
    case '500':
        cy.contains('.modal-body', 'An error has occurred. For more information, check the log file.').should('not.exist');
        break;
    default:
        throw new Error("Unsupported case");
    }
    cy.contains('.modal p', 'The profile mapping has not been updated.').should('not.exist');
});

then("I see {string} role mapping error message", (error) => {
    switch (error) {
        case '403':
            cy.contains('.modal-body', 'Access denied. For more information, check the log file.').should('be.visible');
            break;
        case '404':
            cy.contains('.modal-body', 'The role is not mapped to this profile.').should('be.visible');
            break;
        case '500':
            cy.contains('.modal-body', 'An error has occurred. For more information, check the log file.').should('be.visible');
            break;
        case 'role already exists':
            cy.contains('.modal-body', 'A role with the same name is already mapped to this profile.').should('be.visible');
            break;
        case 'role does not exist':
            cy.contains('.modal-body', 'The role does not exist anymore.').should('be.visible');
            break;
        case 'member does not exist':
            cy.contains('.modal-body', 'The role or profile cannot be found.').should('be.visible');
            break;
        default:
            throw new Error("Unsupported case");
    }
    cy.get('.modal').contains('The profile mapping has not been updated.').scrollIntoView().should('be.visible');
});

then("I don't see {string} role mapping error message", (error) => {
    switch (error) {
    case '403':
        cy.contains('.modal-body', 'Access denied. For more information, check the log file.').should('not.exist');
        break;
    case '404':
        cy.contains('.modal-body', 'The role is not mapped to this profile.').should('not.exist');
        break;
    case '500':
        cy.contains('.modal-body', 'An error has occurred. For more information, check the log file.').should('not.exist');
        break;
    default:
        throw new Error("Unsupported case");
    }
    cy.contains('.modal p', 'The profile mapping has not been updated.').should('not.exist');
});

then("I see {string} group mapping error message", (error) => {
    switch (error) {
        case '403':
            cy.contains('.modal-body', 'Access denied. For more information, check the log file.').should('be.visible');
            break;
        case '404':
            cy.contains('.modal-body', 'The group is not mapped to this profile.').should('be.visible');
            break;
        case '500':
            cy.contains('.modal-body', 'An error has occurred. For more information, check the log file.').should('be.visible');
            break;
        case 'group already exists':
            cy.contains('.modal-body', 'A group with the same name is already mapped to this profile.').should('be.visible');
            break;
        case 'group does not exist':
            cy.contains('.modal-body', 'The group does not exist anymore.').should('be.visible');
            break;
        case 'member does not exist':
            cy.contains('.modal-body', 'The group or profile cannot be found.').should('be.visible');
            break;
        default:
            throw new Error("Unsupported case");
    }
    cy.get('.modal').contains('The profile mapping has not been updated.').scrollIntoView().should('be.visible');
});

then("I don't see {string} group mapping error message", (error) => {
    switch (error) {
    case '403':
        cy.contains('.modal-body', 'Access denied. For more information, check the log file.').should('not.exist');
        break;
    case '404':
        cy.contains('.modal-body', 'The group is not mapped to this profile.').should('not.exist');
        break;
    case '500':
        cy.contains('.modal-body', 'An error has occurred. For more information, check the log file.').should('not.exist');
        break;
    default:
        throw new Error("Unsupported case");
    }
    cy.contains('.modal p', 'The profile mapping has not been updated.').should('not.exist');
});

then("The import profiles section shows the correct information", () => {
    cy.contains('.modal-body p', 'A profile includes the mapping to entities of the organization.').should('be.visible');
    cy.get('.modal-body input[type=text]').should('have.attr', 'placeholder', 'Click here to choose your .xml file.');
});

then("The name and description are empty", () => {
    cy.get('.modal-body input[type=text]').should('have.value', '');
    cy.get('.modal-body textarea').should('have.value', '');
});

then("The success message does not disappear", () => {
    cy.get('.modal-body .glyphicon-ok-sign').should('be.visible');
});

then("There is no error or success", () => {
    cy.get('.modal-body .glyphicon-remove-sign').should('not.exist');
    cy.get('.modal-body .glyphicon-ok-sign').should('not.exist');
});

then("The edit modal is open and has a default state for {string} for profile {int}", (state, profileNumber) => {
    cy.contains('.modal-header h3', state).should('be.visible');
    cy.get('.modal-body input[type=text]').should('be.visible');
    cy.get('.modal-body textarea').should('be.visible');
    switch (profileNumber) {
        case 1:
            cy.get('.modal-body input').should('have.value', 'Custom profile 1');
            cy.get('.modal-body textarea').should('have.value', 'This is a sample description.');
            break;
        case 5:
            cy.get('.modal-body input').should('have.value', 'aaa');
            cy.get('.modal-body textarea').should('have.value', '');
            break;
        default:
            throw new Error("Unsupported case");
    }
    cy.get('.modal-body .glyphicon-remove-sign').should('not.exist');
    cy.get('.modal-body .glyphicon-ok-sign').should('not.exist');
    cy.contains('.modal-footer button', 'Save').should('not.be.disabled');
    cy.contains('.modal-footer button', 'Cancel').should('be.visible');
    cy.contains('.modal-footer button', 'Close').should('not.exist');
});

then("The edition is successful", () => {
    cy.contains('.modal-footer button', 'Save').should('be.disabled');
    cy.contains('.modal-footer button', 'Cancel').should('not.exist');
    cy.contains('.modal-footer button', 'Close').should('be.visible');
    cy.wait('@profileEditionRoute').then((xhr) => {
        expect(xhr.request.body.name).to.equal('New custom profile 1');
        expect(xhr.request.body.description).to.equal('This is a new description.');
    });
    cy.get('.modal-body input').each((input) => {
        expect(input).to.have.attr('readonly', 'readonly');
    });
});

then("The first profile has a different name", () => {
    cy.get('.profile-item').eq(0).should('be.visible').within(() => {
        cy.contains('.item-value', 'New custom profile 1');
        cy.contains('.item-label', 'This is a new description.');
    });
});

then("The edit modal is open and has a edited state for {string}", (state, profileNumber) => {
    cy.contains('.modal-header h3', state).should('be.visible');
    cy.contains('.modal-body', 'Name').should('be.visible');
    cy.contains('.modal-body', 'Description').should('be.visible');
    cy.get('.modal-body input').should('have.value', 'New custom profile 1');
    cy.get('.modal-body textarea').should('have.value', 'This is a new description.');
    cy.get('.modal-body .glyphicon-remove-sign').should('not.exist');
    cy.get('.modal-body .glyphicon-ok-sign').should('not.exist');
    cy.contains('.modal-footer button', 'Save').should('not.be.disabled');
    cy.contains('.modal-footer button', 'Cancel').should('be.visible');
    cy.contains('.modal-footer button', 'Close').should('not.exist');
});

then("There is an error message about name being required", () => {
    cy.contains('This field is required').should('be.visible');
});

then("The {string} button in modal is {string}", (buttonName, buttonState) => {
    cy.contains('.modal-footer button', buttonName).should('be.' + buttonState);
});

then('I can export a profile', () => {
    cy.get('.profile-item').eq(0).should('be.visible').within(() => {
        cy.contains('.item-value', 'Custom profile 1');
        cy.get('pb-link a').should('have.attr', 'href', '../API/exportProfiles?id=101');
        cy.get('pb-link a').should('have.attr', 'target', '_blank');
    });
});

then("I see the mapping information for first profile", () => {
    cy.get('.action-button-container .glyphicon-triangle-top').should('have.length', 1);
    cy.contains('.mapping-label', 'Mapping with Users').should('be.visible');
    cy.get('.btn-edit .glyphicon-pencil').eq(0).should('be.visible');
    cy.contains('.badge', 'Giovanna Almeida').should('be.visible');
    cy.contains('.mapping-label', 'Mapping with Groups').should('be.visible');
    cy.get('.btn-edit .glyphicon-pencil').eq(1).should('be.visible');
    cy.contains('.badge', '...').should('be.visible');
    cy.contains('.badge', 'Acme').should('be.visible');
    cy.contains('.mapping-label', 'Mapping with Roles').should('be.visible');
    cy.get('.btn-edit .glyphicon-pencil').eq(2).should('be.visible');
    cy.contains('.badge', 'Chief Executive Officer (CEO)').should('be.visible');
    cy.contains('.mapping-label', 'Mapping with Memberships').should('be.visible');
    cy.get('.btn-edit .glyphicon-pencil').eq(3).should('be.visible');
    cy.contains('.badge', 'Executive of Europe').should('be.visible');
});

then("I see the mapping information for second profile", () => {
    cy.get('.action-button-container .glyphicon-triangle-top').should('have.length', 1);
    cy.contains('.mapping-label', 'Mapping with Users').should('be.visible');
    cy.get('.btn-edit .glyphicon-pencil').eq(0).should('be.visible');
    cy.contains('.badge', 'Dumitru Corini').should('be.visible');
    cy.contains('.badge', 'Giovanna Almeida').should('not.exist');
    cy.contains('.mapping-label', 'Mapping with Roles').should('be.visible');
    cy.get('.btn-edit .glyphicon-pencil').eq(2).should('be.visible');
    cy.contains('.badge', 'Executive Director (ED)').should('be.visible');
    cy.contains('.badge', 'Chief Executive Officer (CEO)').should('not.exist');
});

then("The hide organization mapping button is displayed", () => {
    cy.get('.profile-item').eq(0).should('be.visible').within(() => {
        cy.get('.action-button-container .glyphicon-triangle-top').should('be.visible');
        cy.get('.action-button-container .glyphicon-triangle-bottom').should('not.exist');
    });
});

then("There is no mapping information displayed", () => {
    cy.contains('.mapping-label', 'Mapping with Users').should('not.exist');
    cy.contains('.mapping-label', 'Mapping with Groups').should('not.exist');
    cy.contains('.mapping-label', 'Mapping with Roles').should('not.exist');
    cy.contains('.mapping-label', 'Mapping with Memberships').should('not.exist');
});

then("The edit user mapping modal is open and has a default state for {string} profile", (organization) => {
    cy.contains('.modal-header h3', organization).should('be.visible');
    cy.contains('.modal-body h4', 'Add a user').should('be.visible');
    cy.get('.modal-body input[type=text]').should('have.length', 2);
    cy.get('.modal-body input[type=text]').eq(0).should('have.attr', 'placeholder', 'Start typing to find a new user to add');
    cy.contains('.modal-body h4', 'Users mapped').should('be.visible');
    cy.get('.modal-body input[type=text]').eq(1).should('have.attr', 'placeholder', 'Search mapped users by first name, last name, or username');
    cy.contains('.modal-body button', 'Add').should('be.visible');
    cy.get('.modal-footer button').scrollIntoView();
    cy.contains('.modal-footer button', 'Close').should('be.visible');
});

then("The {string} list is displayed", () => {
    cy.get('.modal-content .dropdown-menu').should('be.visible');
});

then("The {string} list is not displayed", () => {
    cy.get('.modal-content .dropdown-menu').should('not.exist');
});

then("The mapped user list is displayed", () => {
    cy.get('.modal-body .profile-item').should('have.length', 10);
    cy.get('.modal-body .profile-item').eq(0).should('be.visible').within(() => {
        cy.contains('.item-label', 'First name');
        cy.contains('.item-value', 'Giovanna');
        cy.contains('.item-label', 'Last name');
        cy.contains('.item-value', 'Almeida');
        cy.contains('.item-label', 'Username');
        cy.contains('.item-value', 'giovanna.almeida');
        cy.get('button .glyphicon-remove').should('have.attr', 'title', 'Remove user from mapping');
    });
});

then("The {string} list is not displayed", () => {
    cy.get('.modal-body .dropdown-menu').should('not.exist');
});

then("The role input in membership is filled with {string}", (selectedValue) => {
    cy.get('.modal-body .add-role-membership-mapping-search input').should('have.value', selectedValue);
});

then("The group input in membership is filled with {string}", (selectedValue) => {
    cy.get('.modal-body .form-group input').eq(1).should('have.value', selectedValue);
});

then("There is a confirmation for a user mapping being added", () => {
    cy.contains('.modal-body', 'The user helen.kelly has been successfully added to the mapping.').should('be.visible');
    cy.contains('.modal-body button', 'Add').eq(0).should('be.disabled');
    cy.get('.modal-body .form-group input').eq(0).should('have.value', '');
});

then("There is a confirmation for a user mapping being removed", () => {
    cy.contains('.modal-body', 'The user giovanna.almeida has been successfully removed from mapping.').should('be.visible');
});

then("The api call has the correct information: {string}, {string}, {string}", (memberType, profileId, userId) => {
    cy.wait('@addUserMemberRoute').then((xhr) => {
        expect(xhr.request.body.member_type).to.equal(memberType);
        expect(xhr.request.body.profile_id).to.equal(profileId);
        expect(xhr.request.body.user_id).to.equal(userId);
    });
});

then("The api call has the correct information: {string}, {string}, {string} for roles mapping", (memberType, profileId, roleId) => {
    cy.wait('@addRoleMemberRoute').then((xhr) => {
        expect(xhr.request.body.member_type).to.equal(memberType);
        expect(xhr.request.body.profile_id).to.equal(profileId);
        expect(xhr.request.body.role_id).to.equal(roleId);
    });
});

then("The api call has the correct information: {string}, {string}, {string} for groups mapping", (memberType, profileId, groupId) => {
    cy.wait('@addGroupMemberRoute').then((xhr) => {
        expect(xhr.request.body.member_type).to.equal(memberType);
        expect(xhr.request.body.profile_id).to.equal(profileId);
        expect(xhr.request.body.group_id).to.equal(groupId);
    });
});

then("The api call has the correct information: {string}, {string}, {string} for memberships mapping", (roleId, profileId, groupId) => {
    cy.wait('@addMembershipMemberRoute').then((xhr) => {
        expect(xhr.request.body.role_id).to.equal(roleId);
        expect(xhr.request.body.profile_id).to.equal(profileId);
        expect(xhr.request.body.group_id).to.equal(groupId);
    });
});

then('The list of user mappings is refreshed', () => {
    cy.wait('@refreshUsersMappingRoute');
});

then('The page is refreshed', () => {
    cy.wait('@profileMappingUsers10Route');
});

then("The user input is filled with {string}", (userName) => {
    cy.get('.modal-body .form-group input').should('have.value', userName);
});

then("The search input has the value {string}", (userName) => {
    cy.get('.modal-body .form-group input').eq(1).should('have.value', userName);
});

then("The add button is disabled", (userName) => {
    cy.contains('.modal-body button', 'Add').should('be.disabled');
});

then("The edit role mapping modal is open and has a default state for {string} profile", (organization) => {
    cy.contains('.modal-header h3', organization).should('be.visible');
    cy.get('.modal-body input[type=text]').should('have.length', 2);
    cy.contains('.modal-body h4', 'Add a role').should('be.visible');
    cy.get('.modal-body input[type=text]').eq(0).should('have.attr', 'placeholder', 'Start typing to find a new role to add');
    cy.contains('.modal-body h4', 'Roles mapped').should('be.visible');
    cy.get('.modal-body input[type=text]').eq(1).should('have.attr', 'placeholder', 'Search mapped roles by name');
    cy.contains('.modal-body button', 'Add').should('be.visible');
    cy.get('.modal-footer button').scrollIntoView();
    cy.contains('.modal-footer button', 'Close').should('be.visible');
});

then("The role list is displayed", () => {
    cy.get('.modal-content .dropdown-menu').should('be.visible');
});

then("No role mappings are displayed", () => {
    cy.get('.modal-body .profiles-item:visible').should('have.length', 0);
    cy.contains('No roles to display').should('be.visible');
});

then("The role input is filled with {string}", (roleName) => {
    cy.get('.modal-body .form-group input').should('have.value', roleName);
});

then("There is a confirmation for a role mapping being added", () => {
    cy.contains('.modal-body', 'The role Executive Assistants has been successfully added to the mapping.').should('be.visible');
    cy.contains('.modal-body button', 'Add').eq(0).should('be.disabled');
    cy.get('.modal-body .form-group input').eq(0).should('have.value', '');
});

then('The list of role mappings is refreshed', () => {
    cy.wait('@refreshRolesMappingRoute');
});

then("The mapped role list is displayed", () => {
    cy.get('.modal-body .profile-item').should('have.length', 10);
    cy.get('.modal-body .profile-item').eq(0).should('be.visible').within(() => {
        cy.contains('.item-label', 'Display name');
        cy.contains('.item-value', 'Chief Marketing Officer (CMO)');
        cy.get('button .glyphicon-remove').should('have.attr', 'title', 'Remove role from mapping');
    });
});

then("There is a confirmation for a role mapping being removed", () => {
    cy.contains('.modal-body', 'The role Chief Marketing Officer (CMO) has been successfully removed from mapping.').should('be.visible');
});

then("The edit group mapping modal is open and has a default state for {string} profile", (organization) => {
    cy.contains('.modal-header h3', organization).should('be.visible');
    cy.get('.modal-body input[type=text]').should('have.length', 2);
    cy.contains('.modal-body h4', 'Add a group').should('be.visible');
    cy.get('.modal-body input[type=text]').eq(0).should('have.attr', 'placeholder', 'Start typing to find a new group to add');
    cy.contains('.modal-body h4', 'Groups mapped').should('be.visible');
    cy.get('.modal-body input[type=text]').eq(1).should('have.attr', 'placeholder', 'Search mapped groups by name');
    cy.contains('.modal-body button', 'Add').should('be.visible');
    cy.get('.modal-footer button').scrollIntoView();
    cy.contains('.modal-footer button', 'Close').should('be.visible');
});

then("No group mappings are displayed", () => {
    cy.get('.modal-body .profiles-item:visible').should('have.length', 0);
    cy.contains('No groups to display').should('be.visible');
});

then("The group input is filled with {string}", (groupName) => {
    cy.get('.modal-body .form-group input').should('have.value', groupName);
});

then("There is a confirmation for a group mapping being added", () => {
    cy.contains('.modal-body', 'The group Acme has been successfully added to the mapping.').should('be.visible');
    cy.contains('.modal-body button', 'Add').eq(0).should('be.disabled');
    cy.get('.modal-body .form-group input').eq(0).should('have.value', '');
});

then('The list of group mappings is refreshed', () => {
    cy.wait('@refreshGroupsMappingRoute');
});

then("The mapped group list is displayed", () => {
    cy.get('.modal-body .profile-item').should('have.length', 10);
    cy.get('.modal-body .profile-item').eq(0).should('be.visible').within(() => {
        cy.contains('.item-label', 'Display name');
        cy.contains('.item-value', 'Acme');
        cy.contains('.item-label', 'Name');
        cy.contains('.item-value', 'acme');
        cy.contains('.item-label', 'Parent group');
        cy.contains('.item-value', '--');
        cy.get('button .glyphicon-remove').should('have.attr', 'title', 'Remove group from mapping');
    });
});

then("There is a confirmation for a group mapping being removed", () => {
    cy.contains('.modal-body', 'The group Acme has been successfully removed from mapping.').should('be.visible');
});

then("The edit membership mapping modal is open and has a default state for {string} profile", (organization) => {
    cy.contains('.modal-header h3', organization).should('be.visible');
    cy.get('.modal-body input[type=text]').should('have.length', 3);
    cy.contains('.modal-body h4', 'Add a membership to the mapping (Role of Group').should('be.visible');
    cy.get('.modal-body input[type=text]').eq(0).should('have.attr', 'placeholder', 'Start typing to find a new role to add');
    cy.get('.modal-body input[type=text]').eq(1).should('have.attr', 'placeholder', 'Start typing to find a new group to add');
    cy.contains('.modal-body h4', 'Memberships mapped').should('be.visible');
    cy.get('.modal-body input[type=text]').eq(2).should('have.attr', 'placeholder', 'Search mapped memberships by role name or group name');
    cy.contains('.modal-body button', 'Add').should('be.visible');
    cy.get('.modal-footer button').scrollIntoView();
    cy.contains('.modal-footer button', 'Close').should('be.visible');
});

then("No membership mappings are displayed", () => {
    cy.get('.modal-body .profiles-item:visible').should('have.length', 0);
    cy.contains('No memberships to display').should('be.visible');
});

then("There is a confirmation for a membership mapping being added", () => {
    cy.contains('.modal-body', 'The Executive Assistants of Acme has been successfully added to the mapping.').should('be.visible');
    cy.contains('.modal-body button', 'Add').eq(0).should('be.disabled');
    cy.get('.modal-body .form-group input').eq(0).should('have.value', '');
});

then('The list of membership mappings is refreshed', () => {
    cy.wait('@refreshMembershipsMappingRoute');
});

then("The mapped membership search input has the value {string}", (userName) => {
    cy.get('.modal-body .form-group input').eq(2).should('have.value', userName);
});

then("The membership inputs are filled with {string}", (roleName) => {
    cy.get('.modal-body .form-group input').eq(0).should('have.value', roleName);
    cy.get('.modal-body .form-group input').eq(1).should('have.value', roleName);
});

then("The mapped membership list is displayed", () => {
    cy.get('.modal-body .profile-item').should('have.length', 2);
    cy.get('.modal-body .profile-item').eq(0).should('be.visible').within(() => {
        cy.contains('.item-label', 'Role');
        cy.contains('.item-value', 'Executive');
        cy.contains('.item-label', 'of');
        cy.contains('.item-label', 'Group');
        cy.contains('.item-value', 'Europe (/acme/sales/europe)');
        cy.get('button .glyphicon-remove').should('have.attr', 'title', 'Remove membership from mapping');
    });
});

then("There is a confirmation for a membership mapping being removed", () => {
    cy.contains('.modal-body', 'The Executive of Europe has been successfully removed from mapping.').should('be.visible');
});

then("I see {string} membership mapping error message", (error) => {
    switch (error) {
        case '403':
            cy.contains('.modal-body', 'Access denied. For more information, check the log file.').should('be.visible');
            break;
        case '404':
            cy.contains('.modal-body', 'The Executive of Europe is not mapped to this profile.').should('be.visible');
            break;
        case '500':
            cy.contains('.modal-body', 'An error has occurred. For more information, check the log file.').should('be.visible');
            break;
        case 'membership already exists':
            cy.contains('.modal-body', 'A membership with the same role of group is already mapped to this profile.').should('be.visible');
            break;
        case 'membership does not exist':
            cy.contains('.modal-body', 'The role and/or group does not exist anymore.').should('be.visible');
            break;
        case 'member does not exist':
            cy.contains('.modal-body', 'The membership or profile cannot be found.').should('be.visible');
            break;
        default:
            throw new Error("Unsupported case");
    }
    cy.get('.modal').contains('The profile mapping has not been updated.').scrollIntoView().should('be.visible');
});

then("I don't see {string} membership mapping error message", (error) => {
    switch (error) {
    case '403':
        cy.contains('.modal-body', 'Access denied. For more information, check the log file.').should('not.exist');
        break;
    case '404':
        cy.contains('.modal-body', 'The Executive of Europe is not mapped to this profile.').should('not.exist');
        break;
    case '500':
        cy.contains('.modal-body', 'An error has occurred. For more information, check the log file.').should('not.exist');
        break;
    default:
        throw new Error("Unsupported case");
    }
    cy.contains('.modal p', 'The profile mapping has not been updated.').should('not.exist');
});

then("Some features are not available", () => {
    cy.contains('button', 'Add').should('not.exist');
    cy.get('.glyphicon-pencil').should('not.exist');
    cy.get('.glyphicon-export').should('not.exist');
    cy.get('.glyphicon-trash').should('not.exist');
});

then("The type more message is displayed and disabled", () => {
    cy.contains('.dropdown-menu button', 'Or type more...').scrollIntoView();
    cy.get('.dropdown-menu button').eq(10).contains('Or type more...');
    cy.contains('.dropdown-menu button', 'Or type more...').should('be.visible');
    cy.contains('.dropdown-menu button', 'Or type more...').should('be.disabled');
});

then("The type more message is not displayed", () => {
    cy.contains('.dropdown-menu button', 'Or type more...').should('not.exist');
});

then("It uploads a profile", () => {
    cy.get('.modal-body input[type="file"]').selectFile('test/mockServer/Profile_Data.xml', {force: true});
    cy.get('.modal-body input[type="text"]').should('have.value', 'Uploading...');
    cy.get('.modal-body .file-upload input[type="text"]').should('have.value', 'Profile_Data.xml');
});

then("The successfully imported message displayed correctly", () => {
    cy.get(".modal-body p .glyphicon-ok-sign").should('be.visible');
    cy.contains(".modal-body p", "The profile(s) file has been successfully imported");
    cy.get(".modal-body p .glyphicon-info-sign").should('be.visible');
    cy.contains(".modal-body p", "1 profile(s) has been successfully imported.");
});

then("The skipped message displayed correctly", () => {
    cy.get(".modal-body p .glyphicon-ok-sign").should('be.visible');
    cy.contains(".modal-body p", "The profile(s) file has been successfully imported");
    cy.get(".modal-body p .glyphicon-info-sign").should('be.visible');
    cy.contains(".modal-body p", "1 profile(s) has been SKIPPED. Check the .xml file and retry.");
});

then("The imported and skipped messages are displayed correctly", () => {
    cy.get(".modal-body p .glyphicon-ok-sign").should('be.visible');
    cy.contains(".modal-body p", "The profile(s) file has been successfully imported");
    cy.get(".modal-body p .glyphicon-info-sign").should('be.visible');
    cy.contains(".modal-body p", "1 profile(s) has been successfully imported.");
    cy.get(".modal-body p .glyphicon-info-sign").should('be.visible');
    cy.contains(".modal-body p", "1 profile(s) has been SKIPPED. Check the .xml file and retry.");
});

then("The incorrect profile import message is displayed correctly", () => {
    cy.get(".modal-body p .glyphicon-remove-sign").should('be.visible');
    cy.contains(".modal-body p", "The imported profile(s) file seems incorrect. It may affect the REST API and the profile page. Check the .xml file and retry.");
});

then('The long {string} is displayed correctly', () => {
    cy.get('.dropdown-menu button').should('have.css', 'white-space', 'normal');
});