// Fullscreen Get Started chooser.
// Opens on top of the current page, at the current scroll position, without
// navigating or resetting the page scroll.
(() => {
  if (window.__wattnetGetStartedOverlayBound) return;
  window.__wattnetGetStartedOverlayBound = true;

  const CLOSE_FALLBACK_MS = 700;

  let isOpen = false;
  let lastTrigger = null;
  let closeTimer = 0;

  const overlayEl = () => document.getElementById('get-started-overlay');
  const wrapperEl = () => document.getElementById('page-wrapper');
  const isElement = (value) => value instanceof Element;

  // overflow:hidden (not position:fixed) keeps the scroll offset untouched, so nothing needs restoring afterwards.
  const clearBodyScrollLock = () => {
    document.body.style.paddingRight = '';
    document.documentElement.style.overflow = '';
  };

  const lockScroll = () => {
    const root = document.documentElement;
    if (root.style.overflow === 'hidden') return;

    const scrollbar = window.innerWidth - root.clientWidth;
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    root.style.overflow = 'hidden';
  };

  const finishClose = () => {
    window.clearTimeout(closeTimer);
    closeTimer = 0;
    overlayEl()?.removeEventListener('transitionend', onCloseEnd);
    clearBodyScrollLock();
  };

  // Unlock only once the overlay has finished closing, so the page behind does
  // not jump while it is still visible.
  function onCloseEnd(event) {
    if (event && (event.target !== overlayEl() || event.propertyName !== 'clip-path')) return;
    finishClose();
  }

  const cancelPendingClose = () => {
    window.clearTimeout(closeTimer);
    closeTimer = 0;
    overlayEl()?.removeEventListener('transitionend', onCloseEnd);
  };

  const open = (trigger) => {
    const overlay = overlayEl();
    if (!overlay || isOpen) return;

    cancelPendingClose();
    isOpen = true;
    lastTrigger = trigger || null;

    lockScroll();
    overlay.scrollTop = 0;
    overlay.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('gs-open');

    const wrapper = wrapperEl();
    if (wrapper) wrapper.inert = true;

    requestAnimationFrame(() => {
      overlay.querySelector('[data-gs-close]')?.focus({ preventScroll: true });
    });
  };

  const close = () => {
    const overlay = overlayEl();
    if (!overlay || !isOpen) return;

    isOpen = false;
    document.documentElement.classList.remove('gs-open');
    overlay.setAttribute('aria-hidden', 'true');

    const wrapper = wrapperEl();
    if (wrapper) wrapper.inert = false;

    if (lastTrigger && lastTrigger.isConnected && lastTrigger.offsetParent !== null) {
      lastTrigger.focus({ preventScroll: true });
    }
    lastTrigger = null;

    overlay.addEventListener('transitionend', onCloseEnd);
    closeTimer = window.setTimeout(finishClose, CLOSE_FALLBACK_MS);
  };

  // Resets everything without animating (used when the page is swapped).
  const reset = () => {
    isOpen = false;
    lastTrigger = null;
    cancelPendingClose();
    document.documentElement.classList.remove('gs-open');
    clearBodyScrollLock();

    overlayEl()?.setAttribute('aria-hidden', 'true');

    const wrapper = wrapperEl();
    if (wrapper) wrapper.inert = false;
  };

  document.addEventListener(
    'click',
    (event) => {
      // Let modified clicks behave natively (open in a new tab, etc.).
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const target = isElement(event.target) ? event.target : null;
      if (!target) return;

      if (target.closest('[data-gs-close]')) {
        event.preventDefault();
        close();
        return;
      }

      const trigger = target.closest('a[href="/get-started"]');
      if (!trigger || !overlayEl()) return;

      // Capture phase: run before Astro's client router intercepts the link.
      event.preventDefault();
      open(trigger);
    },
    true,
  );

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !isOpen) return;
    event.preventDefault();
    close();
  });

  document.addEventListener('astro:before-swap', reset);

  window.addEventListener('pageshow', (event) => {
    if (event.persisted) reset();
  });
})();
