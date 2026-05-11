$(function () {
  $(
    "#contactForm input, #contactForm textarea, #contactForm select",
  ).jqBootstrapValidation({
    preventSubmit: true,
    submitError: function ($form, event, errors) {},
    submitSuccess: function ($form, event) {
      event.preventDefault();
      var name = $("input#name").val();
      var email = $("input#email").val();
      var whatsapp = $("input#whatsapp").val();
      var program = $("select#program").val();
      var message = $("textarea#message").val();

      $this = $("#sendMessageButton");
      $this.prop("disabled", true);

      // Deteksi bahasa dari atribut lang pada tag html
      var lang = $("html").attr("lang") || "id";
      var isJa = lang === "ja";

      // Format pesan untuk dikirim via Email (Mailto)
      var emailTo = "nandaahmad624@gmail.com";
      var subjectText = isJa ? "ウェブサイトからのメッセージ: " + name : "Pesan dari Website: " + name;
      
      var bodyText = isJa ? "こんにちは KIZUNA 管理者様、\n\n" : "Halo admin KIZUNA,\n\n";
      bodyText += (isJa ? "お名前: " : "Nama: ") + name + "\n";
      bodyText += "Email: " + email + "\n";
      bodyText += "WhatsApp: " + whatsapp + "\n";
      bodyText += (isJa ? "ご希望のプログラム: " : "Program: ") + (program ? program : (isJa ? "未選択" : "Tidak dipilih")) + "\n\n";
      bodyText += (isJa ? "メッセージ:\n" : "Pesan:\n") + message + "\n";

      var mailtoUrl =
        "mailto:" +
        emailTo +
        "?subject=" +
        encodeURIComponent(subjectText) +
        "&body=" +
        encodeURIComponent(bodyText);

      // Memunculkan pesan sukses di website
      var successMsg = isJa ? "メールアプリを起動しています..." : "Membuka Aplikasi Email Anda...";
      
      $("#success").html("<div class='alert alert-success'>");
      $("#success > .alert-success")
        .html(
          "<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;",
        )
        .append("</button>");
      $("#success > .alert-success").append(
        "<strong>" + successMsg + "</strong>",
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
