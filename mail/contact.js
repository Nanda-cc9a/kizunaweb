$(function () {
  $("#contactForm input, #contactForm textarea").jqBootstrapValidation({
    preventSubmit: true,
    submitError: function ($form, event, errors) {},
    submitSuccess: function ($form, event) {
      event.preventDefault();
      var name = $("input#name").val();
      var email = $("input#email").val();
      var subject = $("input#subject").val();
      var message = $("textarea#message").val();

      $this = $("#sendMessageButton");
      $this.prop("disabled", true);

      // Format pesan untuk dikirim via Email (Mailto)
      var emailTo = "nandaahmad624@gmai.com";
      var bodyText = "Halo admin KIZUNA,\n\n";
      bodyText += "Nama: " + name + "\n";
      bodyText += "Email Kontak: " + email + "\n\n";
      bodyText += "Pesan:\n" + message + "\n";

      var mailtoUrl =
        "mailto:" +
        emailTo +
        "?subject=" +
        encodeURIComponent("Pesan dari Website: " + subject) +
        "&body=" +
        encodeURIComponent(bodyText);

      // Memunculkan pesan sukses di website
      $("#success").html("<div class='alert alert-success'>");
      $("#success > .alert-success")
        .html(
          "<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;",
        )
        .append("</button>");
      $("#success > .alert-success").append(
        "<strong>Membuka Aplikasi Email Anda...</strong>",
      );
      $("#success > .alert-success").append("</div>");
      $("#contactForm").trigger("reset");

      // Mengarahkan ke aplikasi email
      setTimeout(function () {
        window.location.href = mailtoUrl;
        $this.prop("disabled", false);
      }, 1000);
    },
    filter: function () {
      return $(this).is(":visible");
    },
  });

  $('a[data-toggle="tab"]').click(function (e) {
    e.preventDefault();
    $(this).tab("show");
  });
});

$("#name").focus(function () {
  $("#success").html("");
});
