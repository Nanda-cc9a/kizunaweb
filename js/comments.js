/**
 * Kizuna News - localStorage Comment System
 * Provides persistent commenting functionality for all news pages
 */
(function () {
  // Get a unique page key based on the current page filename
  var pageKey =
    "kizuna_comments_" + window.location.pathname.split("/").pop().split(".")[0];

  // Load comments from localStorage
  function loadComments() {
    var stored = localStorage.getItem(pageKey);
    return stored ? JSON.parse(stored) : [];
  }

  // Save comments to localStorage
  function saveComments(comments) {
    localStorage.setItem(pageKey, JSON.stringify(comments));
  }

  // Format date nicely
  function formatDate(dateString) {
    var date = new Date(dateString);
    var months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    var day = date.getDate();
    var month = months[date.getMonth()];
    var year = date.getFullYear();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    return day + " " + month + " " + year + " at " + hours + ":" + minutes + ampm;
  }

  // Create a single comment HTML element
  function createCommentHTML(comment) {
    var initial = comment.name.charAt(0).toUpperCase();
    var html =
      '<li class="comment-item">' +
      '  <div class="comment-body">' +
      '    <div class="comment-img">' +
      '      <div class="comment-avatar" style="width:50px;height:50px;border-radius:50%;background:#f2801d;color:#030f27;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:700;">' +
      initial +
      "      </div>" +
      "    </div>" +
      '    <div class="comment-text">' +
      "      <h3>" +
      escapeHTML(comment.name) +
      "</h3>" +
      "      <span>" +
      formatDate(comment.date) +
      "</span>" +
      "      <p>" +
      escapeHTML(comment.message) +
      "</p>" +
      '      <a class="btn btn-delete-comment" href="javascript:void(0)" data-id="' +
      comment.id +
      '" style="background:#dc3545;color:#fff;padding:5px 15px;font-size:12px;">Delete</a>' +
      "    </div>" +
      "  </div>" +
      "</li>";
    return html;
  }

  // Escape HTML to prevent XSS
  function escapeHTML(str) {
    var div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  // Render all comments on the page
  function renderComments() {
    var comments = loadComments();
    var commentList = document.querySelector(".single .comment-list");
    var commentCount = document.querySelector(".single .single-comment h2");

    if (!commentList || !commentCount) return;

    // Update count
    var count = comments.length;
    commentCount.textContent = count + (count === 1 ? " Comment" : " Comments");

    // Build HTML for all comments
    var html = "";
    for (var i = 0; i < comments.length; i++) {
      html += createCommentHTML(comments[i]);
    }
    commentList.innerHTML = html;

    // Add delete handlers
    var deleteButtons = commentList.querySelectorAll(".btn-delete-comment");
    for (var j = 0; j < deleteButtons.length; j++) {
      deleteButtons[j].addEventListener("click", function (e) {
        e.preventDefault();
        var id = this.getAttribute("data-id");
        deleteComment(id);
      });
    }
  }

  // Delete a comment by ID
  function deleteComment(id) {
    if (!confirm("Apakah Anda yakin ingin menghapus komentar ini?")) return;
    var comments = loadComments();
    comments = comments.filter(function (c) {
      return c.id !== id;
    });
    saveComments(comments);
    renderComments();
  }

  // Handle form submission
  function handleFormSubmit(e) {
    e.preventDefault();

    var nameInput = document.querySelector(".comment-form #name");
    var emailInput = document.querySelector(".comment-form #email");
    var messageInput = document.querySelector(".comment-form #message");

    if (!nameInput || !emailInput || !messageInput) return;

    var name = nameInput.value.trim();
    var email = emailInput.value.trim();
    var message = messageInput.value.trim();

    // Validation
    if (!name) {
      alert("Nama harus diisi!");
      nameInput.focus();
      return;
    }
    if (!email) {
      alert("Email harus diisi!");
      emailInput.focus();
      return;
    }
    if (!message) {
      alert("Pesan harus diisi!");
      messageInput.focus();
      return;
    }

    // Create comment object
    var comment = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      name: name,
      email: email,
      message: message,
      date: new Date().toISOString(),
    };

    // Save and render
    var comments = loadComments();
    comments.push(comment);
    saveComments(comments);

    // Clear form
    nameInput.value = "";
    emailInput.value = "";
    messageInput.value = "";

    // Also clear website field if exists
    var websiteInput = document.querySelector(".comment-form #website");
    if (websiteInput) websiteInput.value = "";

    // Re-render comments
    renderComments();

    // Scroll to the new comment
    var commentSection = document.querySelector(".single-comment");
    if (commentSection) {
      commentSection.scrollIntoView({ behavior: "smooth" });
    }

    // Show success feedback
    showToast("Komentar berhasil ditambahkan!");
  }

  // Show a toast notification
  function showToast(message) {
    var toast = document.createElement("div");
    toast.textContent = message;
    toast.style.cssText =
      "position:fixed;bottom:30px;left:50%;transform:translateX(-50%);background:#28a745;color:#fff;padding:12px 30px;border-radius:5px;font-size:14px;font-weight:500;z-index:9999;box-shadow:0 4px 15px rgba(0,0,0,0.2);transition:opacity 0.5s;";
    document.body.appendChild(toast);
    setTimeout(function () {
      toast.style.opacity = "0";
      setTimeout(function () {
        document.body.removeChild(toast);
      }, 500);
    }, 2500);
  }

  // Initialize when DOM is ready
  document.addEventListener("DOMContentLoaded", function () {
    // Render existing comments
    renderComments();

    // Attach form submit handler
    var commentForm = document.querySelector(".comment-form form");
    if (commentForm) {
      // Replace submit button behavior
      commentForm.addEventListener("submit", handleFormSubmit);

      // Also handle the submit input click
      var submitBtn = commentForm.querySelector('input[type="submit"]');
      if (submitBtn) {
        submitBtn.addEventListener("click", function (e) {
          e.preventDefault();
          handleFormSubmit(e);
        });
      }
    }
  });
})();
