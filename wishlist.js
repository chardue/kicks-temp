addEventListener("DOMContentLoaded", function (event) {
  if (
    ($(".wishlist-custom-action").each(function () {
      var attr2 = $(this).attr("data-handle");
      if (localStorage.getItem("user_wishlist_cnt") !== null) {
        var existing_wishlist2 = JSON.parse(localStorage.getItem("wishlist"));
        $.inArray(attr2, existing_wishlist2) >= 0 &&
          ($(this).addClass("active-wishlist"),
          $(this).removeClass("wishlist-custom-action")),
          $(".wishlist-counter").text(
            localStorage.getItem("user_wishlist_cnt")
          );
      } else $(".wishlist-counter").text("0");
    }),
    localStorage.getItem("wishlist"))
  )
    var wishlist_pro = JSON.parse(localStorage.getItem("wishlist"));
  else var wishlist_pro = [];
  jQuery(document).on("click", ".wishlist-custom-action", function (e) {
    e.preventDefault(), console.log(wishlist_pro2);
    var value = $(this).attr("data-handle");
    if ($.inArray(value, wishlist_pro2) === -1) {
      if (localStorage.getItem("wishlist"))
        var wishlist_pro2 = JSON.parse(localStorage.getItem("wishlist"));
      else var wishlist_pro2 = [];
      wishlist_pro2.push(value);
    }
    if (
      (localStorage.setItem("wishlist", JSON.stringify(wishlist_pro2)),
      localStorage.setItem("user_wishlist_cnt", wishlist_pro2.length),
      $(this).removeClass("wishlist-custom-action"),
      $(this).addClass("active-wishlist"),
      $(".wishlist[data-handle='" + value + "']").addClass("active-wishlist"),
      $(".wishlist[data-handle='" + value + "']").removeClass(
        "wishlist-custom-action"
      ),
      localStorage.getItem("user_wishlist_cnt") !== null)
    ) {
      var existing_wishlist2 = localStorage.getItem("user_wishlist_cnt");
      $(".wishlist-counter").text(existing_wishlist2);
    } else $(".wishlist-counter").text("0");
  }),
    jQuery(document).on("click", ".active-wishlist", function (e) {
      e.preventDefault();
      var to_delete = $(this).attr("data-handle"),
        wishlist_pro2 = JSON.parse(localStorage.getItem("wishlist")),
        index = wishlist_pro2.indexOf(to_delete);
      if (index > -1) {
        if (
          (wishlist_pro2.splice(index, 1),
          localStorage.setItem("user_wishlist_cnt", wishlist_pro2.length),
          $(this).removeClass("active-wishlist"),
          $(this).addClass("wishlist-custom-action"),
          $(".wishlist[data-handle='" + to_delete + "']").removeClass(
            "active-wishlist"
          ),
          $(".wishlist[data-handle='" + to_delete + "']").addClass(
            "wishlist-custom-action"
          ),
          localStorage.getItem("user_wishlist_cnt") !== null)
        ) {
          var existing_cnt = localStorage.getItem("user_wishlist_cnt");
          $(".wishlist-counter").text(existing_cnt);
        } else $(".wishlist-counter").text("0");
        var wishlist_pro2 = localStorage.setItem(
          "wishlist",
          JSON.stringify(wishlist_pro2)
        );
      }
    });
});
var attr = $(this).attr("data-handle");
if (localStorage.getItem("user_wishlist_cnt") !== null) {
  var existing_wishlist = JSON.parse(localStorage.getItem("wishlist"));
  $.inArray(attr, existing_wishlist) >= 0 &&
    ($(this).addClass("active-wishlist"),
    $(this).removeClass("wishlist-custom-action")),
    $(".wishlist-counter").text(localStorage.getItem("user_wishlist_cnt"));
} else $(".wishlist-counter").text("0");
//# sourceMappingURL=/cdn/shop/t/3/assets/theme.wishlist.js.map?v=184261439331368048331739184961
