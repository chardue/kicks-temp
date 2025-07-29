class ajaxCart extends HTMLElement {
  constructor() {
    super(),
      this.addEventListener(
        "keyup",
        (evt) => evt.code === "Escape" && this.close()
      ),
      this.querySelector("#ajaxcart-overlay").addEventListener(
        "click",
        this.close.bind(this)
      ),
      this.setHeaderCartIconAccessibility();
  }
  setHeaderCartIconAccessibility() {
    const cartLink = document.querySelector("#ajax-cart-icon");
    cartLink.setAttribute("role", "button"),
      cartLink.setAttribute("aria-haspopup", "dialog"),
      cartLink.addEventListener("click", (event) => {
        event.preventDefault(), this.open(cartLink);
      }),
      cartLink.addEventListener("keydown", (event) => {
        event.code.toUpperCase() === "SPACE" &&
          (event.preventDefault(), this.open(cartLink));
      });
  }
  open(triggeredBy) {
    triggeredBy && this.setActiveElement(triggeredBy);
    const cartDrawerNote = this.querySelector('[id^="Details-"] summary');
    cartDrawerNote &&
      !cartDrawerNote.hasAttribute("role") &&
      this.setSummaryAccessibility(cartDrawerNote),
      setTimeout(() => {
        this.classList.add("animate", "active");
      }),
      this.addEventListener(
        "transitionend",
        () => {
          const containerToTrapFocusOn = this.classList.contains("is-empty")
              ? this.querySelector(".cart-inner-empty")
              : document.getElementById("ajaxcart"),
            focusElement = this.querySelector(".drawer-inner");
          triggerClick(containerToTrapFocusOn, focusElement);
        },
        { once: !0 }
      );
  }
  close() {
    this.classList.remove("active"), triggerClickClose(this.activeElement);
  }
  setSummaryAccessibility(cartDrawerNote) {
    cartDrawerNote.setAttribute("role", "button"),
      cartDrawerNote.nextElementSibling.getAttribute("id") &&
        cartDrawerNote.setAttribute(
          "aria-controls",
          cartDrawerNote.nextElementSibling.id
        ),
      cartDrawerNote.parentElement.addEventListener("keyup", escClick);
  }
  renderContents(parsedState) {
    this.querySelector(".drawer-inner").classList.contains("is-empty") &&
      this.querySelector(".drawer-inner").classList.remove("is-empty"),
      (this.productId = parsedState.id),
      this.fetchSecToInclude().forEach((section) => {
        const sectionElement = section.selector
          ? document.querySelector(section.selector)
          : document.getElementById(section.id);
        sectionElement.innerHTML = this.callSectionInnerHTML(
          parsedState.sections[section.id],
          section.selector
        );
      }),
      setTimeout(() => {
        this.querySelector("#ajaxcart-overlay").addEventListener(
          "click",
          this.close.bind(this)
        ),
          this.open();
      });
  }
  callSectionInnerHTML(html, selector = ".shopify-section") {
    return new DOMParser()
      .parseFromString(html, "text/html")
      .querySelector(selector).innerHTML;
  }
  fetchSecToInclude() {
    return [
      { id: "ajax-cart", selector: "#ajaxcart" },
      { id: "ajax-cart-icon" },
    ];
  }
  getSectionDOM(html, selector = ".shopify-section") {
    return new DOMParser()
      .parseFromString(html, "text/html")
      .querySelector(selector);
  }
  setActiveElement(element) {
    this.activeElement = element;
  }
}
customElements.define("ajax-cart", ajaxCart);
class ajaxCartPro extends CartProduct {
  fetchSecToInclude() {
    return [
      { id: "ajaxcart", section: "ajax-cart", selector: ".drawer-inner" },
      {
        id: "ajax-cart-icon",
        section: "ajax-cart-icon",
        selector: ".shopify-section",
      },
    ];
  }
}
customElements.define("cart-pro", ajaxCartPro);
//# sourceMappingURL=/cdn/shop/t/3/assets/ajax-cart.js.map?v=5309663287766280281739184961
