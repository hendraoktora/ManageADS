/**
 * ManageADS Dynamic Widget Loader
 * Lightweight, zero-dependency, auto-updating banner embedder.
 */
(function () {
  if (window.__MANAGE_ADS_LOADED__) return;
  window.__MANAGE_ADS_LOADED__ = true;

  function initBanners() {
    // Cari elemen penampung banner
    var elements = document.querySelectorAll("[data-mads-banner], [data-banner-id]");

    for (var i = 0; i < elements.length; i++) {
      (function (el) {
        if (el.getAttribute("data-mads-initialized")) return;
        el.setAttribute("data-mads-initialized", "true");

        var bannerId = el.getAttribute("data-mads-banner") || el.getAttribute("data-banner-id");
        var host = el.getAttribute("data-mads-host") || "";

        // Jika host tidak dispesifikasikan, ambil dari script tag src
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

        if (!host) host = window.location.origin;

        // Fetch visual & data banner terbaru dari server
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
                renderBanner(el, response.banner, clickUrl);
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
      })(elements[i]);
    }
  }

  function renderBanner(container, banner, clickUrl) {
    container.innerHTML = "";
    container.style.display = "inline-block";
    container.style.maxWidth = "100%";
    container.style.lineHeight = "0";

    var link = document.createElement("a");
    // Direct Backlink ke URL target asli (agar Googlebot menghitung backlink ke target Anda)
    link.href = banner.targetUrl;
    link.target = "_blank";
    link.rel = banner.backlinkRel || "dofollow";
    link.title = banner.altText || "Sponsored";
    link.style.display = "block";
    link.style.textDecoration = "none";
    link.style.transition = "opacity 0.2s ease-in-out, transform 0.2s ease-in-out";
    link.style.outline = "none";

    // Rekam klik di latar belakang (Background Beacon Tracking)
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

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initBanners);
  } else {
    initBanners();
  }
})();
