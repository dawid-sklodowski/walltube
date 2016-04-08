angular.module('wallTube')
  .directive('wtSpinner', function() {
    return {
      link: function(scope, element, attributes) {
        var size = attributes['wtSpinner'];
        var spinnerAttribute = attributes['wtSpinnerAttribute'] || 'spinner';
        scope.$watch(spinnerAttribute, function(spinner) {
          $(element).wtSpin(spinner && size);
        });
      }
    };
  });
