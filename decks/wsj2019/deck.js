(() => {
  const THEME_KEY = "wsj2019-theme";
  const themes = ["campfire", "jamboree", "forest", "linen", "slate"];

  const applyTheme = (name) => {
    const theme = themes.includes(name) ? name : "campfire";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
    document.querySelectorAll(".theme-swatch").forEach((btn) => {
      btn.setAttribute("aria-pressed", String(btn.dataset.theme === theme));
    });
  };

  applyTheme(localStorage.getItem(THEME_KEY) || "campfire");
  document.querySelectorAll(".theme-swatch").forEach((btn) => {
    btn.addEventListener("click", () => applyTheme(btn.dataset.theme));
  });

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
      { rootMargin: "-22% 0px -58% 0px", threshold: [0.1, 0.35, 0.6] }
    );

    chapters.forEach((ch) => observer.observe(ch));
  }

  const lightbox = document.getElementById("lightbox");
  const stage = lightbox.querySelector(".lightbox__stage");
  const caption = lightbox.querySelector(".lightbox__caption");
  const btnClose = lightbox.querySelector(".lightbox__close");
  const btnPrev = lightbox.querySelector(".lightbox__prev");
  const btnNext = lightbox.querySelector(".lightbox__next");

  let group = [];
  let index = 0;

  const youtubeSrc = (id, start) => {
    const params = new URLSearchParams({
      autoplay: "1",
      rel: "0",
      playsinline: "1",
      feature: "oembed",
    });
    if (Number.isFinite(start) && start > 0) params.set("start", String(Math.floor(start)));
    return `https://www.youtube.com/embed/${encodeURIComponent(id)}?${params}`;
  };
  const driveSrc = (id) => `https://drive.google.com/file/d/${id}/preview`;
  const driveOpen = (id) => `https://drive.google.com/file/d/${id}/view`;
  const youtubeOpen = (id, start) => {
    const url = new URL("https://www.youtube.com/watch");
    url.searchParams.set("v", id);
    if (Number.isFinite(start) && start > 0) url.searchParams.set("t", `${Math.floor(start)}s`);
    return url.toString();
  };

  const isExternalVideo = (video) =>
    video && (video.kind === "url" || video.kind === "icloud");

  const videoHref = (video, start) => {
    if (!video) return "";
    if (video.kind === "yt") return youtubeOpen(video.id, start);
    if (video.kind === "drive") return driveOpen(video.id);
    if (isExternalVideo(video)) return video.id;
    if (video.kind === "file") return video.id;
    return "";
  };

  const mountFrame = (src, title) => {
    const iframe = document.createElement("iframe");
    iframe.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen";
    iframe.allowFullscreen = true;
    iframe.title = title;
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    iframe.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
    stage.append(iframe);
    iframe.src = src;
    return iframe;
  };

  const parseVideo = (value) => {
    if (!value) return null;
    const colon = value.indexOf(":");
    if (colon < 0) return { kind: value, id: "" };
    return { kind: value.slice(0, colon), id: value.slice(colon + 1) };
  };

  const fallbackLink = (href, label) => {
    const a = document.createElement("a");
    a.href = href;
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = label;
    return a;
  };

  const clearStage = () => {
    stage.replaceChildren();
  };

  const render = () => {
    const el = group[index];
    if (!el) return;
    clearStage();
    const video = parseVideo(el.dataset.video);
    const alt = el.querySelector("img")?.alt || el.dataset.caption || "";

    if (video) {
      const start = Number.parseInt(el.dataset.start || "", 10);
      const href = videoHref(video, start);

      if (isExternalVideo(video)) {
        const img = document.createElement("img");
        img.src = el.dataset.full || el.querySelector("img")?.src;
        img.alt = alt;
        stage.append(img);
        caption.replaceChildren();
        if (alt) caption.append(alt, "　");
        caption.append(fallbackLink(href, "在 iCloud 開啟影片"));
      } else if (video.kind === "yt" || video.kind === "drive") {
        mountFrame(
          video.kind === "yt" ? youtubeSrc(video.id, start) : driveSrc(video.id),
          alt || "影片播放"
        );
        caption.replaceChildren();
        if (alt) caption.append(alt, "　");
        caption.append(fallbackLink(href, "若未出現畫面可改新分頁"));
      } else if (video.kind === "file") {
        const vid = document.createElement("video");
        vid.controls = true;
        vid.autoplay = true;
        vid.src = video.id;
        stage.append(vid);
        caption.textContent = alt;
      } else {
        const img = document.createElement("img");
        img.src = el.dataset.full || el.querySelector("img")?.src;
        img.alt = alt;
        stage.append(img);
        caption.textContent = alt;
      }
    } else {
      const img = document.createElement("img");
      img.src = el.dataset.full || el.querySelector("img")?.src;
      img.alt = alt;
      stage.append(img);
      caption.textContent = alt;
    }

    const many = group.length > 1;
    btnPrev.hidden = !many;
    btnNext.hidden = !many;
  };

  const open = (button) => {
    const gallery = button.closest("[data-gallery]") || document;
    group = Array.from(gallery.querySelectorAll(".media"));
    index = Math.max(0, group.indexOf(button));
    const video = parseVideo(button.dataset.video);
    if (isExternalVideo(video)) {
      window.open(video.id, "_blank", "noopener");
    }
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");
    render();
  };

  const close = () => {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");
    clearStage();
    caption.textContent = "";
  };

  const step = (delta) => {
    if (!group.length) return;
    index = (index + delta + group.length) % group.length;
    render();
  };

  document.querySelectorAll(".media").forEach((btn) => {
    btn.addEventListener("click", () => open(btn));
  });

  btnClose.addEventListener("click", close);
  btnPrev.addEventListener("click", () => step(-1));
  btnNext.addEventListener("click", () => step(1));
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) close();
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });
})();
