/**
 * ManageADS Dynamic Widget Loader
 * Lightweight, zero-dependency, auto-updating banner & carousel embedder.
 */
(function () {
  if (window.__MANAGE_ADS_LOADED__) return;
  window.__MANAGE_ADS_LOADED__ = true;

  function getHost(el) {
    var host = el.getAttribute("data-mads-host") || "";
    if (!host) {
      var scripts = document.getElementsByTagName("script");
      for (var s = 0; s < scripts.length; s++) {
        var src = scripts[s].src || "";
        if (src.indexOf("/widget.js") !== -1) {
          try {
            var scriptUrl = new URL(src);
            host = scriptUrl.origin;
            break;
          } catch (e) {}
        }
      }
    }
    return host || window.location.origin;
  }

  function initBanners() {
    // 1. Inisialisasi Single Banner
    var singleElements = document.querySelectorAll("[data-mads-banner], [data-banner-id]");
    for (var i = 0; i < singleElements.length; i++) {
      (function (el) {
        if (el.getAttribute("data-mads-initialized")) return;
        el.setAttribute("data-mads-initialized", "true");

        var bannerId = el.getAttribute("data-mads-banner") || el.getAttribute("data-banner-id");
        var host = getHost(el);

        var apiUrl = host + "/api/b/" + bannerId;
        var clickUrl = host + "/api/c/" + bannerId + "?ref=" + encodeURIComponent(window.location.href);

        var xhr = new XMLHttpRequest();
        xhr.open("GET", apiUrl, true);
        xhr.setRequestHeader("Accept", "application/json");
        xhr.onload = function () {
          if (xhr.status === 200) {
            try {
              var response = JSON.parse(xhr.responseText);
              if (response && response.success && response.banner) {
                renderSingleBanner(el, response.banner, clickUrl);
              }
            } catch (err) {
              console.warn("[ManageADS] Gagal mem-parsing respon banner:", err);
            }
          }
        };
        xhr.onerror = function () {
          console.warn("[ManageADS] Gagal memuat banner ID: " + bannerId);
        };
        xhr.send();
      })(singleElements[i]);
    }

    // 2. Inisialisasi Carousel Slots
    var carouselElements = document.querySelectorAll("[data-mads-carousel], [data-carousel-id]");
    for (var j = 0; j < carouselElements.length; j++) {
      (function (el) {
        if (el.getAttribute("data-mads-initialized")) return;
        el.setAttribute("data-mads-initialized", "true");

        var carouselId = el.getAttribute("data-mads-carousel") || el.getAttribute("data-carousel-id");
        var host = getHost(el);

        var apiUrl = host + "/api/c-slot/" + carouselId + "?ref=" + encodeURIComponent(window.location.href);

        var xhr = new XMLHttpRequest();
        xhr.open("GET", apiUrl, true);
        xhr.setRequestHeader("Accept", "application/json");
        xhr.onload = function () {
          if (xhr.status === 200) {
            try {
              var response = JSON.parse(xhr.responseText);
              if (response && response.success && response.carousel) {
                renderCarousel(el, response.carousel, host);
              }
            } catch (err) {
              console.warn("[ManageADS] Gagal mem-parsing respon carousel:", err);
            }
          }
        };
        xhr.onerror = function () {
          console.warn("[ManageADS] Gagal memuat carousel ID: " + carouselId);
        };
        xhr.send();
      })(carouselElements[j]);
    }
  }

  function renderSingleBanner(container, banner, clickUrl) {
    container.innerHTML = "";
    container.style.display = "inline-block";
    container.style.maxWidth = "100%";
    container.style.lineHeight = "0";

    var link = document.createElement("a");
    link.href = banner.targetUrl;
    link.target = "_blank";
    link.rel = banner.backlinkRel || "dofollow";
    link.title = banner.altText || "Sponsored";
    link.style.display = "block";
    link.style.textDecoration = "none";
    link.style.transition = "opacity 0.2s ease-in-out, transform 0.2s ease-in-out";
    link.style.outline = "none";

    link.addEventListener("click", function () {
      var beaconUrl = clickUrl + (clickUrl.indexOf("?") !== -1 ? "&" : "?") + "beacon=1";
      if (navigator.sendBeacon) {
        navigator.sendBeacon(beaconUrl);
      } else {
        var ping = new Image();
        ping.src = beaconUrl;
      }
    });

    link.onmouseenter = function () {
      link.style.opacity = "0.95";
      link.style.transform = "scale(1.005)";
    };
    link.onmouseleave = function () {
      link.style.opacity = "1";
      link.style.transform = "scale(1)";
    };

    var img = document.createElement("img");
    img.src = banner.imageUrl;
    img.alt = banner.altText || "Iklan";
    img.loading = "lazy";
    img.style.maxWidth = "100%";
    img.style.height = "auto";
    img.style.display = "block";
    img.style.borderRadius = "8px";
    img.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";

    if (banner.size === "728x90") {
      img.style.width = "728px";
      img.style.maxHeight = "90px";
    } else if (banner.size === "300x250") {
      img.style.width = "300px";
      img.style.maxHeight = "250px";
    } else if (banner.size === "160x600") {
      img.style.width = "160px";
      img.style.maxHeight = "600px";
    }

    link.appendChild(img);
    container.appendChild(link);
  }

  function renderCarousel(container, carousel, host) {
    var slides = carousel.slides || [];
    if (slides.length === 0) return;

    if (slides.length === 1) {
      var clickUrl = host + "/api/c/" + slides[0].id + "?ref=" + encodeURIComponent(window.location.href);
      renderSingleBanner(container, slides[0], clickUrl);
      return;
    }

    container.innerHTML = "";
    container.style.display = "inline-block";
    container.style.maxWidth = "100%";
    container.style.lineHeight = "0";

    var wrapper = document.createElement("div");
    wrapper.style.position = "relative";
    wrapper.style.overflow = "hidden";
    wrapper.style.borderRadius = "12px";
    wrapper.style.boxShadow = "0 6px 18px rgba(0,0,0,0.09)";
    wrapper.style.display = "inline-block";
    wrapper.style.maxWidth = "100%";

    var slideElements = [];
    var currentIndex = 0;
    var autoPlayTimer = null;

    // Buat element untuk setiap slide
    for (var k = 0; k < slides.length; k++) {
      (function (slide, idx) {
        var link = document.createElement("a");
        link.href = slide.targetUrl;
        link.target = "_blank";
        link.rel = slide.backlinkRel || "dofollow";
        link.title = slide.altText || slide.name || "Sponsored";
        link.style.display = "block";
        link.style.textDecoration = "none";
        link.style.outline = "none";
        link.style.transition = "opacity 0.6s ease-in-out, transform 0.3s ease";
        link.style.position = idx === 0 ? "relative" : "absolute";
        link.style.top = "0";
        link.style.left = "0";
        link.style.width = "100%";
        link.style.height = "100%";
        link.style.opacity = idx === 0 ? "1" : "0";
        link.style.pointerEvents = idx === 0 ? "auto" : "none";
        link.style.zIndex = idx === 0 ? "2" : "1";

        link.addEventListener("click", function () {
          var beaconUrl = host + "/api/c/" + slide.id + "?beacon=1&ref=" + encodeURIComponent(window.location.href);
          if (navigator.sendBeacon) {
            navigator.sendBeacon(beaconUrl);
          } else {
            var ping = new Image();
            ping.src = beaconUrl;
          }
        });

        var img = document.createElement("img");
        img.src = slide.imageUrl;
        img.alt = slide.altText || "Iklan";
        img.loading = idx === 0 ? "eager" : "lazy";
        img.style.maxWidth = "100%";
        img.style.height = "auto";
        img.style.display = "block";
        img.style.borderRadius = "12px";

        if (carousel.size === "728x90") {
          img.style.width = "728px";
          img.style.maxHeight = "90px";
        } else if (carousel.size === "300x250") {
          img.style.width = "300px";
          img.style.maxHeight = "250px";
        } else if (carousel.size === "160x600") {
          img.style.width = "160px";
          img.style.maxHeight = "600px";
        }

        link.appendChild(img);
        wrapper.appendChild(link);
        slideElements.push(link);
      })(slides[k], k);
    }

    // Fungsi perpindahan slide
    function goToSlide(targetIndex) {
      if (targetIndex === currentIndex) return;
      var prev = slideElements[currentIndex];
      var next = slideElements[targetIndex];

      prev.style.opacity = "0";
      prev.style.pointerEvents = "none";
      prev.style.zIndex = "1";

      next.style.opacity = "1";
      next.style.pointerEvents = "auto";
      next.style.zIndex = "2";

      currentIndex = targetIndex;
      updateDots();
    }

    function nextSlide() {
      var next = (currentIndex + 1) % slides.length;
      goToSlide(next);
    }

    function prevSlide() {
      var prev = (currentIndex - 1 + slides.length) % slides.length;
      goToSlide(prev);
    }

    function startAutoPlay() {
      if (carousel.autoPlay === false) return;
      stopAutoPlay();
      autoPlayTimer = setInterval(nextSlide, carousel.intervalMs || 5000);
    }

    function stopAutoPlay() {
      if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
      }
    }

    // Navigasi Dots
    var dotElements = [];
    if (carousel.showDots !== false) {
      var dotsContainer = document.createElement("div");
      dotsContainer.style.position = "absolute";
      dotsContainer.style.bottom = "8px";
      dotsContainer.style.left = "50%";
      dotsContainer.style.transform = "translateX(-50%)";
      dotsContainer.style.display = "flex";
      dotsContainer.style.gap = "6px";
      dotsContainer.style.zIndex = "10";
      dotsContainer.style.background = "rgba(0,0,0,0.35)";
      dotsContainer.style.backdropFilter = "blur(4px)";
      dotsContainer.style.padding = "4px 8px";
      dotsContainer.style.borderRadius = "20px";

      for (var d = 0; d < slides.length; d++) {
        (function (dotIdx) {
          var dot = document.createElement("button");
          dot.type = "button";
          dot.setAttribute("aria-label", "Go to slide " + (dotIdx + 1));
          dot.style.width = dotIdx === 0 ? "16px" : "6px";
          dot.style.height = "6px";
          dot.style.borderRadius = "3px";
          dot.style.border = "none";
          dot.style.cursor = "pointer";
          dot.style.padding = "0";
          dot.style.transition = "all 0.3s ease";
          dot.style.background = dotIdx === 0 ? "#D5F639" : "rgba(255,255,255,0.6)";

          dot.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            goToSlide(dotIdx);
            startAutoPlay();
          });

          dotsContainer.appendChild(dot);
          dotElements.push(dot);
        })(d);
      }
      wrapper.appendChild(dotsContainer);
    }

    function updateDots() {
      for (var i = 0; i < dotElements.length; i++) {
        if (i === currentIndex) {
          dotElements[i].style.width = "16px";
          dotElements[i].style.background = "#D5F639";
        } else {
          dotElements[i].style.width = "6px";
          dotElements[i].style.background = "rgba(255,255,255,0.6)";
        }
      }
    }

    // Navigasi Arrows (Muncul saat hover di desktop)
    if (carousel.showArrows !== false) {
      var createArrow = function (isNext) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.innerHTML = isNext ? "&#10095;" : "&#10094;";
        btn.style.position = "absolute";
        btn.style.top = "50%";
        btn.style.transform = "translateY(-50%)";
        btn.style[isNext ? "right" : "left"] = "8px";
        btn.style.zIndex = "10";
        btn.style.width = "28px";
        btn.style.height = "28px";
        btn.style.borderRadius = "50%";
        btn.style.border = "none";
        btn.style.background = "rgba(0,0,0,0.45)";
        btn.style.color = "#ffffff";
        btn.style.fontSize = "12px";
        btn.style.fontWeight = "bold";
        btn.style.cursor = "pointer";
        btn.style.display = "flex";
        btn.style.alignItems = "center";
        btn.style.justifyContent = "center";
        btn.style.opacity = "0";
        btn.style.transition = "opacity 0.2s ease, background 0.2s ease";
        btn.style.lineHeight = "1";

        btn.onmouseenter = function () {
          btn.style.background = "rgba(0,0,0,0.75)";
        };
        btn.onmouseleave = function () {
          btn.style.background = "rgba(0,0,0,0.45)";
        };

        btn.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          if (isNext) nextSlide();
          else prevSlide();
          startAutoPlay();
        });

        return btn;
      };

      var prevBtn = createArrow(false);
      var nextBtn = createArrow(true);
      wrapper.appendChild(prevBtn);
      wrapper.appendChild(nextBtn);

      wrapper.addEventListener("mouseenter", function () {
        prevBtn.style.opacity = "1";
        nextBtn.style.opacity = "1";
      });
      wrapper.addEventListener("mouseleave", function () {
        prevBtn.style.opacity = "0";
        nextBtn.style.opacity = "0";
      });
    }

    // Pause on Hover
    wrapper.addEventListener("mouseenter", stopAutoPlay);
    wrapper.addEventListener("mouseleave", startAutoPlay);

    container.appendChild(wrapper);
    startAutoPlay();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initBanners);
  } else {
    initBanners();
  }
})();
