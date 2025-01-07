angular.module('bonitasoft.ui.extensions')
 .filter('typeIcon', function () {
   return function typeIcon(type) {
       return type && (type.rootcaseId !== type.id) ? 'subprocess' : 'process';
   };
}).filter('statusToCss', function () {
   return function statusToCss(status) {
     switch(status){
         case 'started': return 'primary';
         case 'completed': return 'success';
         case 'error': return 'danger';
         case 'suspended': return 'warning';
         case 'aborted': return 'warning';
         case 'cancelled': return 'warning';
         default: return 'default';
     }
   };
}).filter('stateIcon', [function () {
   return function statusToCss(status) {
     switch(status){
         case 'started': return 'glyphicon glyphicon-inbox';
         case 'completed': return 'glyphicon glyphicon-ok';
         case 'error': return 'glyphicon glyphicon-remove';
         case 'suspended': return 'glyphicon glyphicon-pause';
         case 'aborted': return 'glyphicon glyphicon-off';
         case 'cancelled': return 'glyphicon glyphicon-ban-circle';
         default: return '';
     }
   };
}]).filter('stateColor', function () {
   return function statusToCss(status) {
     switch(status){
         case 'started': return 'text-primary';
         case 'completed': return 'text-success';
         case 'error': return 'text-danger';
         case 'suspended': return 'text-warning';
         case 'aborted': return 'text-warning';
         case 'cancelled': return 'text-warning';
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
            case 'started': return `${translate('Started on')} ${formatDate(task.start)}`;
            case 'error': return `${translate('Error since')} ${formatDate(task.last_update_date)}`;
            case 'suspended': return `${translate('Suspended on')} ${formatDate(task.reached_state_date)}`;
            case 'aborted': return `${translate('Aborted on')} ${formatDate(task.reached_state_date)}`;
            case 'cancelled': return `${translate('Cancelled on')} ${formatDate(task.reached_state_date)}`;

            case 'completed':
                const { started_by, startedBySubstitute } = task;
                const dateText = `${translate('Completed on')} ${formatDate(task.end_date)}`  ; 
            
                if(!startedBySubstitute && started_by) {
                    return `${dateText} by ${userIcon} ${getUserDetails(started_by)}`;
                    
                } else if(task.startedBySubstitute <= 0 && task.started_by <= 0) {
                    return `${dateText} by ${systemIcon} ${translate('System')}`;
                } else if(task.startedBySubstitute && task.started_by) {
                    if(task.startedBySubstitute.id === task.started_by.id) {
                        return `${dateText} by ${userIcon} ${getUserDetails(startedBySubstitute)}`;
                    }
                    
                    return `${dateText} by ${userIcon} ${getUserDetails(startedBySubstitute)} ${translate('for')} ${getUserDetails(started_by)}`;
                } else {
                    return `${dateText} by ${userIcon} ${startedBySubstitute.userName}`;
                }
                break;
            default: return '';
        }
   };
});