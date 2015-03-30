var APP = (function(window) {
  'use strict';

  var $ = window.jQuery;
  var document = window.document;

  // Constants.
  var comp_path = './comps';
  var error = 'screen-error';

  // How many milliseconds to
  // wait before scroll sync.
  var scroll_delay = 16;

  // Shared scope.
  var comp_selector;
  var img_all;
  var img_desktop;
  var img_tablet;
  var img_mobile;
  var screen_all;
  var screen_desktop;
  var screen_tablet;
  var screen_mobile;
  var timer;

  // Reset images.
  function img_reset() {
    img_all.css({
      display: 'block'
    });

    img_all.removeClass(error);
  }

  // Handle absent images.
  function img_error(e) {
    var img = $(e.target);

    img.css({
      display: 'none'
    });

    img.closest('div').addClass(error);
  }

  // Reset scroll.
  function scroll_reset() {
    screen_all.off('scroll');
    screen_all.scrollTop(0);

    // Force a brief delay.
    setTimeout(function() {
      screen_all.off('scroll').on('scroll', adjust_scroll);
    }, scroll_delay);
  }

  // Scroll "desktop".
  function scroll_screen(o) {
    // Clear the timer.
    window.clearTimeout(timer);

    // Incoming vars.
    var el = o.el;
    var scroll_ratio = o.scroll_ratio;

    // Temporarily un-bind event listener.
    el.off('scroll');

    // Get measurements.
    var height = el.height();
    var scroll_height = el.prop('scrollHeight');
    var offset = scroll_ratio * (scroll_height - height);

    // Scroll the areas.
    el.scrollTop(offset);

    // Re-bind event listener.
    setTimeout(function() {
      el.off('scroll').on('scroll', adjust_scroll);
    }, scroll_delay);
  }

  // Adjust scroll.
  function adjust_scroll(e) {
    // Clear the timer.
    window.clearTimeout(timer);

    // Throttle, via timer.
    timer = window.setTimeout(function() {
      var el = $(e.target).closest('div');

      // Get measurements.
      var height = el.height();
      var scroll_height = el.prop('scrollHeight');
      var scroll_offset = el.scrollTop();
      var scroll_ratio = scroll_offset / (scroll_height - height);

      var o_desktop = {
        scroll_ratio: scroll_ratio,
        el: screen_desktop
      };

      var o_tablet = {
        scroll_ratio: scroll_ratio,
        el: screen_tablet
      };

      var o_mobile = {
        scroll_ratio: scroll_ratio,
        el: screen_mobile
      };

      // Detect scrolled area.
      var is_desktop = el.hasClass('screen-desktop');
      var is_tablet = el.hasClass('screen-tablet');
      var is_mobile = el.hasClass('screen-mobile');

      // Tablet and mobile.
      if (is_desktop) {
        scroll_screen(o_tablet);
        scroll_screen(o_mobile);
      }

      // Desktop and mobile.
      if (is_tablet) {
        scroll_screen(o_desktop);
        scroll_screen(o_mobile);
      }

      // Desktop and tablet.
      if (is_mobile) {
        scroll_screen(o_desktop);
        scroll_screen(o_tablet);
      }

    // Execute, after delay.
    }, 1);
  }

  // Switch the comp's image source.
  function switch_comp() {
    // Get the value.
    var value = comp_selector.val();

    // Image source, desktop.
    var src_desktop = [
      comp_path,
      'desktop',
      value
    ].join('/');

    // Image source, tablet.
    var src_tablet = [
      comp_path,
      'tablet',
      value
    ].join('/');

    // Image source, mobile.
    var src_mobile = [
      comp_path,
      'mobile',
      value
    ].join('/');

    // Show images.
    img_reset();

    // Assign image sources.
    img_desktop.attr('src', src_desktop);
    img_tablet.attr('src', src_tablet);
    img_mobile.attr('src', src_mobile);

    // Reset scroll.
    scroll_reset();
  }

  // Run when the page loads.
  $(document).ready(function() {
    // Get the drop-down.
    comp_selector = $('.comp-selector');

    // Scrollable "screen" areas.
    screen_desktop = $('.screen-desktop');
    screen_tablet = $('.screen-tablet');
    screen_mobile = $('.screen-mobile');

    // Get images.
    img_desktop = screen_desktop.find('img');
    img_tablet = screen_tablet.find('img');
    img_mobile = screen_mobile.find('img');

    // Bundle up images.
    img_all =
      img_desktop
      .add(img_tablet)
      .add(img_mobile);

    // Image error fallback.
    img_all.off('error').on('error', img_error);

    // Bundle up screens.
    screen_all =
      screen_desktop
      .add(screen_tablet)
      .add(screen_mobile);

    // Run when scroll changes.
    screen_all.off('scroll').on('scroll', adjust_scroll);

    // Run when selection changes.
    comp_selector.off('change').on('change', switch_comp);

    // Run on first page load.
    switch_comp(comp_selector);
  });

// Reference to window.
})(this);