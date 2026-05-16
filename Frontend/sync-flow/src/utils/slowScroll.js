let activeAnimationFrame = null;

export const slowScrollTo = (id, offset = 96) => {
  const target = document.getElementById(id);
  if (!target) return;

  const targetY = target.getBoundingClientRect().top + window.scrollY;
  const end = Math.max(0, targetY - offset);

  if (activeAnimationFrame) {
    cancelAnimationFrame(activeAnimationFrame);
    activeAnimationFrame = null;
  }

  // Prefer native smooth scrolling when available.
  if ("scrollBehavior" in document.documentElement.style) {
    window.scrollTo({ top: end, behavior: "smooth" });
    return;
  }

  const start = window.scrollY;
  const distance = end - start;
  const duration = 700;

  let startTime = null;

  const animation = (currentTime) => {
    if (!startTime) startTime = currentTime;

    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // ease-in-out
    const ease =
      progress < 0.5
        ? 2 * progress * progress
        : -1 + (4 - 2 * progress) * progress;

    window.scrollTo(0, start + distance * ease);

    if (progress < 1) {
      activeAnimationFrame = requestAnimationFrame(animation);
      return;
    }

    activeAnimationFrame = null;
  };

  activeAnimationFrame = requestAnimationFrame(animation);
};
