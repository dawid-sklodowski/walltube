angular.module('wallTube', [])
bootstrapAngular = function() {
  $('[ng-app]').each(function() {
    module = $(this).attr('ng-app');
    angular.bootstrap(this, [module]);
  });
};

$(document).on('page:load', bootstrapAngular);
