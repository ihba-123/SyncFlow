export const slowScrollTo = (id) => {
  const target = document.getElementById(id);
  if (!target) return;

  const start = window.scrollY;
  const end = target.offsetTop;
  const distance = end - start;
  const duration = 900;

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

    if (progress < 1) requestAnimationFrame(animation);
  };

  requestAnimationFrame(animation);
};
