(() => {
  "use strict";

  const CONTENT_PATH = "music-content.json";
  const CONTENT_PATHS_BY_WORD = Object.freeze({
    musicmakers: CONTENT_PATH,
    moviemakers: "moviemakers-content.json"
  });

  document.documentElement.classList.add("js");
  window.addEventListener("DOMContentLoaded", initialiseGate);
  function initialiseGate() {
    const form = document.querySelector("#music-unlock-form");
    const passwordInput = document.querySelector("#music-word");
    const status = document.querySelector("#music-unlock-status");
    const submitButton = form?.querySelector("button[type='submit']");
    if (!form || !passwordInput || !status || !submitButton) return;

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      status.textContent = "";
      if (!passwordInput.value) {
        status.textContent = "Enter the viewing word.";
        passwordInput.focus();
        return;
      }

      const enteredWord = passwordInput.value.trim().toLowerCase();
      passwordInput.value = "";
      const contentPath = CONTENT_PATHS_BY_WORD[enteredWord];
      if (!contentPath) {
        status.textContent = "That word did not open the portfolio. Check it and try again.";
        passwordInput.focus();
        return;
      }

      submitButton.disabled = true;
      submitButton.textContent = "Opening...";
      document.body.setAttribute("aria-busy", "true");

      try {
        const content = await fetchJson(contentPath);
        renderPortfolio(content);
      } catch (error) {
        console.warn("The Music page content could not be loaded.", error);
        status.textContent = "The portfolio could not load. Please try again.";
        submitButton.disabled = false;
        submitButton.textContent = "Enter portfolio";
        document.body.removeAttribute("aria-busy");
      }
    });
  }

  async function fetchJson(path) {
    const response = await fetch(path, { cache: "no-store" });
    if (!response.ok) throw new Error(`Could not load ${path}`);
    return response.json();
  }

  function renderPortfolio(content) {
    const main = document.querySelector("#music-main");
    if (!main) throw new Error("Page root is unavailable");
    document.body.classList.remove("is-locked");
    document.body.classList.add("is-unlocked");
    document.body.classList.toggle("is-film-portfolio", Boolean(content.sections.filmClips));
    document.body.removeAttribute("aria-busy");
    document.querySelector(".gate-header")?.remove();
    main.replaceChildren(buildPortfolio(content));
    setupReveals();
    document.querySelector("#portfolio-title")?.focus({ preventScroll: true });
  }

  function buildPortfolio(content) {
    const fragment = document.createDocumentFragment();
    const sectionSix = content.sections.filmClips
      ? buildFilmClips(content)
      : buildStudioVideo(content);
    fragment.append(
      buildHeader(content),
      buildIntroduction(content),
      buildShowreel(content),
      buildReleases(content),
      buildRecognition(content),
      buildMontage(content),
      sectionSix,
      buildWorkingTogether(content),
      buildFooter(content)
    );
    return fragment;
  }

  function buildHeader(content) {
    const header = element("header", "music-header");
    const home = element("a", "home-link");
    home.href = "hi.html";
    home.setAttribute("aria-label", "Return to the home page");
    home.append(element("span", "", "\u2190"), element("span", "", "Home"));
    home.firstElementChild.setAttribute("aria-hidden", "true");
    const logo = portfolioImage(content.media["logo-glyph"], "music-header__logo");
    const nav = element("nav", "music-nav");
    nav.setAttribute("aria-label", "Music page sections");
    const sectionSix = content.sections.filmClips
      ? ["film-clips", content.sections.filmClips.navLabel || content.sections.filmClips.heading]
      : ["mobile-studio-montage", content.sections.studioVideo.navLabel || content.sections.studioVideo.heading];
    const destinations = [
      ["introduction", content.sections.introduction.navLabel || content.sections.introduction.heading],
      ["showreel", content.sections.showreel.navLabel || content.sections.showreel.heading],
      ["releases", content.sections.releases.navLabel || content.sections.releases.heading],
      ["recognition", content.sections.recognition.navLabel || content.sections.recognition.heading],
      ["studio", content.sections.montage.navLabel || content.sections.montage.heading],
      sectionSix,
      ["working-together", content.sections.workingTogether.navLabel || content.sections.workingTogether.heading]
    ];
    destinations.forEach(([id, label], index) => {
      const link = element("a", "", `${String(index + 1).padStart(2, "0")} ${label}`);
      link.href = `#${id}`;
      nav.append(link);
    });
    header.append(home, logo, nav);
    return header;
  }

  function buildIntroduction(content) {
    const section = sectionElement("introduction", "intro-section");
    const intro = content.sections.introduction;
    const headingBlock = element("div", "hero-copy reveal");
    headingBlock.append(
      element("p", "eyebrow", content.page.label),
      contentText("h1", "hero-title", content.page.title, { id: "portfolio-title", tabIndex: -1 }),
      contentText("p", "hero-intro", content.page.intro)
    );
    const folio = element("div", "section-folio reveal");
    folio.append(element("span", "", intro.number), element("span", "", intro.heading));
    const pattern = portfolioImage(content.media.pattern, "hero-pattern reveal");
    section.append(headingBlock, folio, pattern, videoComponent(intro.video, "hero-video reveal"));
    return section;
  }

  function buildShowreel(content) {
    const data = content.sections.showreel;
    const section = sectionElement("showreel", "editorial-section split-section");
    section.append(sectionHeading(data), contentText("p", "section-copy reveal", data.copy), videoComponent(data.video, "split-section__media reveal"));
    return section;
  }

  function buildReleases(content) {
    const data = content.sections.releases;
    const section = sectionElement("releases", "editorial-section releases-section");
    const intro = element("div", "releases-section__intro");
    intro.append(sectionHeading(data), contentText("p", "section-copy reveal", data.copy));
    const list = element("div", "release-list");
    data.items.forEach((release, index) => {
      const article = element("article", "release-card reveal");
      const meta = element("div", "release-card__meta");
      meta.append(element("span", "release-card__index", `R / ${String(index + 1).padStart(2, "0")}`), element("span", "release-card__year", release.year));
      const title = element("div", "release-card__title");
      title.append(element("h3", "", release.title), contentText("p", "release-card__credit", release.credit));
      article.append(meta, title, videoComponent(release, "release-card__video"));
      list.append(article);
    });
    section.append(intro, list);
    return section;
  }

  function buildRecognition(content) {
    const data = content.sections.recognition;
    const section = sectionElement("recognition", "editorial-section recognition-section");
    const transcription = element("div", "testimonial-transcription reveal");
    transcription.append(element("p", "eyebrow", "Testimonials / text alternative"), contentText("p", "", data.testimonialsTranscription));
    section.append(
      sectionHeading(data),
      contentText("p", "section-copy recognition-section__copy reveal", data.copy),
      portfolioImage(content.media[data.awardImage], "award-image reveal"),
      portfolioImage(content.media[data.testimonialsImage], "testimonials-image reveal"),
      transcription
    );
    return section;
  }

  function buildMontage(content) {
    const data = content.sections.montage;
    const section = sectionElement("studio", "editorial-section montage-section");
    const intro = element("div", "montage-section__intro");
    intro.append(sectionHeading(data), contentText("p", "section-copy reveal", data.copy));
    const grid = element("div", "montage-grid");
    data.items.forEach((item, index) => {
      const figure = portfolioImage(content.media[item.image], `montage-item montage-item--${(index % 5) + 1} reveal`);
      figure.append(contentText("span", "montage-item__overlay", item.overlay));
      grid.append(figure);
    });
    section.append(intro, grid);
    return section;
  }

  function buildStudioVideo(content) {
    const data = content.sections.studioVideo;
    const section = sectionElement("mobile-studio-montage", "editorial-section split-section");
    section.append(
      sectionHeading(data),
      contentText("p", "section-copy reveal", data.copy),
      videoComponent(data.video, "split-section__media reveal")
    );
    return section;
  }

  function buildFilmClips(content) {
    const data = content.sections.filmClips;
    const section = sectionElement("film-clips", "editorial-section releases-section");
    const intro = element("div", "releases-section__intro");
    intro.append(sectionHeading(data), contentText("p", "section-copy reveal", data.copy));
    const list = element("div", "release-list");
    data.items.forEach((clip, index) => {
      const article = element("article", "release-card reveal");
      const meta = element("div", "release-card__meta");
      meta.append(element("span", "release-card__index", `C / ${String(index + 1).padStart(2, "0")}`));
      const title = element("div", "release-card__title");
      title.append(element("h3", "", clip.title), contentText("p", "release-card__credit", clip.credit));
      article.append(meta, title, videoComponent(clip, "release-card__video"));
      list.append(article);
    });
    section.append(intro, list);
    return section;
  }

  function buildWorkingTogether(content) {
    const data = content.sections.workingTogether;
    const section = sectionElement("working-together", "editorial-section working-section");
    const rail = element("div", "working-section__rail reveal");
    rail.append(sectionHeading(data), contentText("p", "working-section__subheading", data.subheading));
    const contact = contentText("a", "contact-link", data.contactLabel);
    contact.href = safeContactUrl(data.contactUrl);
    rail.append(contact);
    const details = element("div", "working-section__details");
    data.paragraphs.forEach((paragraph) => details.append(contentText("p", "reveal", paragraph)));
    const tldr = element("aside", "tldr reveal");
    tldr.append(element("p", "eyebrow", "Technical details / TLDR"));
    const list = element("ol", "");
    data.tldr.forEach((item) => list.append(contentText("li", "", item)));
    tldr.append(list);
    details.append(tldr);
    section.append(rail, details);
    return section;
  }

  function buildFooter(content) {
    const footer = element("footer", "music-footer");
    const home = element("a", "", "Return home");
    home.href = "hi.html";
    footer.append(element("span", "", content.page.label), contentText("span", "", content.page.copyright), home);
    return footer;
  }

  function sectionElement(id, className) {
    const section = element("section", className);
    section.id = id;
    return section;
  }

  function sectionHeading(data) {
    const block = element("div", "section-heading reveal");
    block.append(element("span", "section-heading__number", data.number), element("h2", "section-heading__title", data.heading));
    return block;
  }

  function videoComponent(video, className) {
    const figure = element("figure", `video-component ${className}`.trim());
    const frame = element("div", "video-frame");
    const id = youtubeId(video.url);
    if (id) {
      const button = element("button", "video-poster");
      button.type = "button";
      button.setAttribute("aria-label", `Play ${video.title}`);
      const poster = element("img", "video-poster__image");
      poster.src = `https://i.ytimg.com/vi/${encodeURIComponent(id)}/maxresdefault.jpg`;
      poster.alt = "";
      poster.loading = "lazy";
      poster.decoding = "async";
      poster.width = 1280;
      poster.height = 720;
      const play = element("span", "video-poster__play", "Play");
      play.setAttribute("aria-hidden", "true");
      button.append(poster, play);
      button.addEventListener("click", () => loadYoutubePlayer(frame, id, video.title));
      frame.append(button);
    } else {
      frame.append(contentText("p", "media-tbc", "Video link: TBC"));
    }
    const caption = element("figcaption", "video-caption");
    const status = element("p", "video-caption__status");
    status.append(element("span", "", "Captions"), contentText("span", "", video.captions));
    const transcript = element("details", "transcript");
    transcript.append(element("summary", "", "Transcript"), contentText("p", "", video.transcript));
    caption.append(contentText("h3", "video-caption__title", video.title), status, transcript);
    figure.append(frame, caption);
    return figure;
  }

  function loadYoutubePlayer(frame, id, title) {
    const iframe = element("iframe", "youtube-player");
    iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0`;
    iframe.title = title;
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    iframe.allowFullscreen = true;
    frame.replaceChildren(iframe);
    iframe.focus();
  }

  function portfolioImage(media, className) {
    const figure = element("figure", `portfolio-image ${className}`.trim());
    if (!media?.source || !media.width || !media.height) {
      figure.append(contentText("p", "media-tbc", "Image: TBC"));
      return figure;
    }
    figure.style.aspectRatio = `${media.width} / ${media.height}`;
    const image = element("img", "");
    image.src = media.source;
    image.alt = media.alt || "";
    image.width = media.width;
    image.height = media.height;
    image.loading = "lazy";
    image.decoding = "async";
    image.addEventListener("load", () => figure.classList.add("is-loaded"), { once: true });
    image.addEventListener("error", () => figure.classList.add("has-error"), { once: true });
    figure.append(image);
    return figure;
  }

  function setupReveals() {
    const items = [...document.querySelectorAll(".reveal")];
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -6%" });
    items.forEach((item) => observer.observe(item));
  }

  function youtubeId(url) {
    if (typeof url !== "string" || url === "TBC") return null;
    try {
      const parsed = new URL(url);
      if (parsed.hostname === "youtu.be") return parsed.pathname.slice(1).split("/")[0] || null;
      if (parsed.hostname.endsWith("youtube.com")) {
        if (parsed.pathname === "/watch") return parsed.searchParams.get("v");
        if (parsed.pathname.startsWith("/embed/")) return parsed.pathname.split("/")[2] || null;
        if (parsed.pathname.startsWith("/shorts/")) return parsed.pathname.split("/")[2] || null;
      }
    } catch {
      return null;
    }
    return null;
  }

  function safeContactUrl(url) {
    if (typeof url !== "string") return "#";
    return url.startsWith("mailto:") || url.startsWith("https://") ? url : "#";
  }

  function contentText(tagName, className, text, attributes = {}) {
    const node = element(tagName, className, text);
    if (String(text).trim() === "TBC" || String(text).includes(": TBC")) node.classList.add("is-tbc");
    Object.entries(attributes).forEach(([name, value]) => {
      if (name in node) node[name] = value;
      else node.setAttribute(name, value);
    });
    return node;
  }

  function element(tagName, className = "", text = "") {
    const node = document.createElement(tagName);
    if (className) node.className = className;
    if (text !== "") node.textContent = text;
    return node;
  }
})();
