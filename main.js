(function ($) {
  "use strict";
  jQuery(document).ready(function () {
    $("button.navbar-toggle").on("click", function () {
      $(".main-menu-area").addClass("active"),
        $(".mm-fullscreen-bg").addClass("active"),
        $("body").addClass("ov-hidden");
    }),
      $(".close-box").on("click", function () {
        $(".main-menu-area").removeClass("active"),
          $(".mm-fullscreen-bg").removeClass("active"),
          $("body").removeClass("ov-hidden");
      }),
      $("button.filter-button").on("click", function () {
        $(".filter-sidebar").addClass("active"),
          $(".mm-fullscreen-bg").addClass("active");
      }),
      $("button.close-filter-sidebar").on("click", function () {
        $(".filter-sidebar").removeClass("active"),
          $(".mm-fullscreen-bg").removeClass("active");
      }),
      $(".mm-fullscreen-bg").on("click", function () {
        $(".main-menu-area").removeClass("active"),
          $(".filter-sidebar").removeClass("active"),
          $(".mm-fullscreen-bg").removeClass("active"),
          $("body").removeClass("hidden");
      }),
      $(".checkout-btn .read-agree").on("click", function () {
        $(".cust-checkbox").is(":checked")
          ? $(".checkout-btn button.check-btn").removeAttr("disabled")
          : $(".checkout-btn button.check-btn").attr("disabled", "disabled");
      }),
      $(".read-agree").on("click", function () {
        $(".create-checkbox").is(":checked")
          ? $(".create").removeAttr("disabled")
          : $(".create").attr("disabled", "disabled");
      }),
      $(".full-view, .zoom").on("click", function () {
        $(".product_img_top")
          .magnificPopup({
            delegate: "a",
            type: "image",
            showCloseBtn: !0,
            closeBtnInside: !1,
            midClick: !0,
            tLoading: "Loading image #%curr%...",
            mainClass: "mfp-img-mobile",
            gallery: { enabled: !0, navigateByImgClick: !0, preload: [0, 1] },
          })
          .magnificPopup("open");
      }),
      $(".play-button, .popup-vimeo, .popup-gmaps").magnificPopup({
        tClose: "Close (Esc)",
        type: "iframe",
        mainClass: "mfp-fade",
        removalDelay: 160,
        preloader: !1,
        fixedContentPos: !1,
      }),
      $(".item-data").on("click", function () {
        $(this)
          .parents(".option-block")
          .find(".variant-option")
          .removeClass("active-variant"),
          $(this).closest("form-wrap").addClass("active-variant");
        var it_img = $(this).attr("dataimg");
        $(this)
          .parents(".single-product-wrap")
          .find(".product-image .img1 img")
          .attr("src", it_img),
          $(this)
            .parents(".single-product-wrap")
            .find(".product-image .img1 img")
            .attr("srcset", it_img);
        var price = $(this).attr("dataprice"),
          compareprice = $(this).attr("datacompare"),
          stocks = $(this).attr("dataavailable");
        $(this)
          .parents(".single-product-wrap")
          .find(".price-box .new-price")
          .text(Shopify.formatMoney(price, window.money_format)),
          compareprice > price
            ? ($(this)
                .parents(".single-product-wrap")
                .find(".price-box .old-price")
                .show(),
              $(this)
                .parents(".single-product-wrap")
                .find(".price-box .old-price")
                .html(Shopify.formatMoney(compareprice, window.money_format)))
            : $(this)
                .parents(".single-product-wrap")
                .find(".price-box .old-price")
                .hide();
      });
    var swiper = new Swiper(".drawer-slider", {
      slidesPerView: 1,
      grid: { rows: 1, fill: "row" | "column" },
      spaceBetween: 30,
      navigation: {
        nextEl: ".arrow-next-drawer",
        prevEl: ".arrow-prev-drawer",
      },
      autoplay: { delay: 5e3, disableOnInteraction: !1, pauseOnMouseEnter: !0 },
      speed: 1e3,
    });
  });
})(jQuery);
//# sourceMappingURL=/cdn/shop/t/3/assets/main.js.map?v=31830204229047426901739184961
