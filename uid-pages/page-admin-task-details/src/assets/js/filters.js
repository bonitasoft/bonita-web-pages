angular.module('bonitasoft.ui.extensions')
 .filter('typeIcon', function () {
   return function typeIcon(type) {
    switch(type){
         case 'AUTOMATIC_TASK': return 'task_service';
         case 'USER_TASK': return 'task_user';
         case 'MANUAL_TASK': return 'task_manual';
         case 'SEND_TASK': return 'task_send';
         case 'RECEIVE_TASK': return 'task_receive';
         case 'CALL_ACTIVITY': return 'marker_expand';
         case 'GATEWAY': return 'gateway_parallel'; // No info available in the API regarding the GATEWAY type. Hence, the gateway_parallel icon is used.
         default: return 'task_service';
     }
   };
}).filter('statusToCss', function () {
   return function statusToCss(status) {
     switch(status){
         case 'ready': return 'primary';
         case 'failed': return 'danger';
         case 'completed': return 'success';
         default: return 'default';
     }
   };
}).filter('stateIcon', [function () {
   return function statusToCss(status) {
     switch(status){
         case 'ready': return 'glyphicon glyphicon-inbox';
         case 'failed': return 'glyphicon glyphicon-remove';
         case 'completed': return 'glyphicon glyphicon-ok';
         case 'skipped': return 'glyphicon glyphicon-fast-forward';
         default: return '';
     }
   };
}]).filter('stateColor', function () {
   return function statusToCss(status) {
     switch(status){
         case 'ready': return 'text-primary';
         case 'failed': return 'text-danger';
         case 'skipped': return 'text-warning';
         case 'completed': return 'text-success';
         default: return '';
     }
   };
}).filter('stateMessage', function ($filter) {
    return function statusToCss(task) {
        const formatDate = (date) => $filter('date')(date.replace(" ", "T"), 'medium');
        const translate = $filter('translate');
        const getUserDetails = (user) => user ? `${user.firstname} ${user.lastname}` : translate('System');
        const userIcon = '<span class="glyphicon glyphicon-user"></span>';
        const systemIcon = '<span class="glyphicon glyphicon-cog"></span>';
        
        switch(task.state){
            case 'ready': return `${translate('Ready since')} ${formatDate(task.reached_state_date)}`;
            case 'failed': return `${translate('Failed on')} ${formatDate(task.last_update_date)}`;
            case 'skipped': return `${translate('Skipped on')} ${formatDate(task.reached_state_date)}`;
            case 'completed':
                const { executedBy, executedBySubstitute } = task;
                const dateText = `${translate('Completed on')} ${formatDate(task.reached_state_date)}`  ; 
            
                if(!executedBySubstitute && executedBy) {
                    return `${dateText} by ${userIcon} ${getUserDetails(executedBy)}`;
                    
                } else if(task.executedBySubstitute <= 0 && task.executedBy <= 0) {
                    return `${dateText} by ${systemIcon} ${translate('System')}`;
                } else if(task.executedBySubstitute && task.executedBy) {
                    if(task.executedBySubstitute.id === task.executedBy.id) {
                        return `${dateText} by ${userIcon} ${getUserDetails(executedBySubstitute)}`;
                    }
                    
                    return `${dateText} by ${userIcon} ${getUserDetails(executedBySubstitute)} ${translate('for')} ${getUserDetails(executedBy)}`;
                } else {
                    return `${dateText} by ${userIcon} ${executedBySubstitute.userName}`;
                }

                return `${dateText} by ${systemIcon} ${translate('System')}`;
            default: return '';
        }
   };
});