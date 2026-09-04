(() => {
  /* TOC active state */
  const links = Array.from(document.querySelectorAll(".toc a[href^='#']"));
  const chapters = links
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  if (chapters.length) {
    const setActive = (id) => {
      links.forEach((a) => {
        a.classList.toggle("is-active", a.getAttribute("href") === `#${id}`);
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0.1, 0.35, 0.6] }
    );

    chapters.forEach((ch) => observer.observe(ch));
  }

})();
