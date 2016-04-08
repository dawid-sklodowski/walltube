$.fn.wtSpin = function(opts) {
  return this.each(function() {
    var this$ = $(this);
    if(opts === false || typeof opts === 'undefined') {
      this$.find('div.spinner-overlay').remove();
      this$.find('input').attr('disabled', false);
      this$.removeClass('spinning');
      this$.spin(false);
    } else {
      this$.addClass('spinning');
      this$.find('input').attr('disabled', true);
      this$.prepend($('<div>', { 'class': 'spinner-overlay' } ));
      this$.spin(opts);
    }
  });
};
