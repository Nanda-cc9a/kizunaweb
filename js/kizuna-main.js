/* kizuna-main.js — shared across all pages */
document.addEventListener("DOMContentLoaded", function () {
  // Mobile navbar toggle
  var toggler = document.getElementById("kzToggler");
  var menu = document.getElementById("kzNavMenu");
  if (toggler && menu) {
    toggler.addEventListener("click", function () {
      menu.classList.toggle("open");
    });
  }

  // Mobile dropdown toggle
  document.querySelectorAll(".kz-nav li > a").forEach(function (a) {
    if (
      a.nextElementSibling &&
      a.nextElementSibling.classList.contains("kz-dropdown-menu")
    ) {
      a.addEventListener("click", function (e) {
        if (window.innerWidth < 992) {
          e.preventDefault();
          a.parentElement.classList.toggle("mob-open");
        }
      });
    }
  });

  // Scroll fade-up
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) e.target.classList.add("visible");
      });
    },
    { threshold: 0.1 },
  );
  document.querySelectorAll(".fade-up").forEach(function (el) {
    observer.observe(el);
  });

  // Back to top
  var btt = document.getElementById("kzBackTop");
  if (btt) {
    window.addEventListener("scroll", function () {
      btt.classList.toggle("show", window.scrollY > 400);
    });
    btt.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Counter animation
  function animateCount(el, target, suffix) {
    var start = 0,
      dur = 1800;
    var step = target / (dur / 16);
    var timer = setInterval(function () {
      start += step;
      if (start >= target) {
        el.textContent = target + suffix;
        clearInterval(timer);
      } else el.textContent = Math.floor(start) + suffix;
    }, 16);
  }
  var cntObs = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.querySelectorAll("[data-count]").forEach(function (el) {
            var m = el.getAttribute("data-count").match(/^(\d+)(.*)/);
            if (m) animateCount(el, parseInt(m[1]), m[2]);
          });
          cntObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.3 },
  );
  document.querySelectorAll(".kz-stats-row").forEach(function (el) {
    cntObs.observe(el);
  });

  // FAQ toggle
  document.querySelectorAll(".kz-faq-q").forEach(function (q) {
    q.addEventListener("click", function () {
      var ans = q.nextElementSibling;
      var open = ans.classList.contains("open");
      document.querySelectorAll(".kz-faq-a").forEach(function (a) {
        a.classList.remove("open");
      });
      document.querySelectorAll(".kz-faq-q").forEach(function (x) {
        x.classList.remove("open");
      });
      if (!open) {
        ans.classList.add("open");
        q.classList.add("open");
      }
    });
  });

  // ==========================================
  // CONTACT FORM AJAX
  // ==========================================
  var contactForm = document.getElementById("contactForm");
  var responseDiv = document.getElementById("contactResponse");
  var submitBtn = document.getElementById("submitBtn");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Show loading state
      submitBtn.disabled = true;
      var originalBtnText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sedang mengirim...';
      
      responseDiv.style.display = "none";
      responseDiv.className = "";

      var formData = new FormData(contactForm);

      fetch(contactForm.getAttribute("action"), {
        method: "POST",
        body: formData,
      })
      .then(function(response) {
        if (response.ok) {
          return response.text();
        } else {
          throw new Error("Terjadi kesalahan.");
        }
      })
      .then(function(text) {
        responseDiv.style.display = "block";
        responseDiv.style.background = "#d4edda";
        responseDiv.style.color = "#155724";
        responseDiv.style.border = "1px solid #c3e6cb";
        responseDiv.innerText = text;
        contactForm.reset();
      })
      .catch(function(error) {
        responseDiv.style.display = "block";
        responseDiv.style.background = "#f8d7da";
        responseDiv.style.color = "#721c24";
        responseDiv.style.border = "1px solid #f5c6cb";
        responseDiv.innerText = "Maaf, terjadi kesalahan. Silakan coba lagi.";
      })
      .finally(function() {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      });
    });
  }
});

