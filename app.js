(function($){
  $(document).ready(function(){
    const $flipbook = $('#flipbook');
    const $prev = $('#prevBtn');
    const $next = $('#nextBtn');
    const $restart = $('#restartBtn');
    const $controls = $('.controls');

    // Init turn.js
    $flipbook.turn({
      width: parseInt($flipbook.css('width'),10) || 520,
      height: parseInt($flipbook.css('height'),10) || 700,
      autoCenter: true,
      elevation: 50,
      gradients: true,
      duration: 800,
      display: 'single'
    });

    const totalPages = $flipbook.turn('pages'); // 7: cover + 5 + back
    $controls.attr('aria-hidden','true');
    $restart.addClass('hidden');

    function updateButtons(page){
      $prev.prop('disabled', page <= 1);
      $next.prop('disabled', page >= totalPages);
    }

    // Click front cover to open (page 2)
    $flipbook.on('click', '.cover-front', function(e){
      const current = $flipbook.turn('page');
      if (current === 1) {
        $flipbook.turn('page', 2);
        $controls.attr('aria-hidden','false');
      }
    });

    // Click on pages to advance (ignore if clicked input)
    $flipbook.on('click', '.page', function(e){
      const target = $(e.target);
      if (target.is('input') || target.closest('input').length) return;
      const current = $flipbook.turn('page');
      if (current >= totalPages) return;
      $flipbook.turn('next');
    });

    $flipbook.bind('turned', function(e, page, view){
      updateButtons(page);
      if (page === totalPages) {
        $restart.removeClass('hidden');
        $next.prop('disabled', true);
      } else {
        $restart.addClass('hidden');
        $next.prop('disabled', false);
      }
    });

    $next.on('click', function(e){ e.preventDefault(); $flipbook.turn('next'); });
    $prev.on('click', function(e){ e.preventDefault(); $flipbook.turn('previous'); });

    $restart.on('click', function(e){
      e.preventDefault();
      $flipbook.turn('page', 1); // volta pra capa frontal
      $controls.attr('aria-hidden','true');
      $restart.addClass('hidden');
    });

    // Touch swipe (extra)
    let touchStartX = 0;
    $('.flipbook').on('touchstart', function(e){ touchStartX = e.originalEvent.changedTouches[0].screenX; });
    $('.flipbook').on('touchend', function(e){
      const dx = e.originalEvent.changedTouches[0].screenX - touchStartX;
      if (Math.abs(dx) > 40){
        if (dx < 0) $flipbook.turn('next'); else $flipbook.turn('previous');
      }
    });

    // Ensure buttons initial state
    updateButtons( $flipbook.turn('page') );

    $(window).on('resize', function(){ setTimeout(()=> $flipbook.turn('resize'), 300); });

  });
})(jQuery);
