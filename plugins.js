const RELOAD_TIMER = 300
  , SP_OBJECT = {
    ajxcartRefresh: "cart-update",
    qtyRefresh: "quantity-update",
    swatchUpdate: "variant-change"
};
let users = {};
function user(eventName, callback) {
    return users[eventName] === void 0 && (users[eventName] = []),
    users[eventName] = [...users[eventName], callback],
    function() {
        users[eventName] = users[eventName].filter(cb => cb !== callback)
    }
}
function live(eventName, data) {
    users[eventName] && users[eventName].forEach(callback => {
        callback(data)
    }
    )
}
function animate() {
    document.documentElement.style.setProperty("--viewport-height", `${window.innerHeight}px`)
}
["load", "scroll", "resize"].forEach(eventName => window.addEventListener(eventName, animate));
function getClickable(container) {
    return Array.from(container.querySelectorAll("summary, a[href], button:enabled, [tabindex]:not([tabindex^='-']), [draggable], area, input:not([type=hidden]):enabled, select:enabled, textarea:enabled, object, iframe"))
}
const getScrollTop = element => {
    let offsetTop = 0;
    do
        isNaN(element.offsetTop) || (offsetTop += element.offsetTop);
    while (element = element.offsetParent);
    return offsetTop
}
  , portView = element => window.pageYOffset + window.innerHeight >= getScrollTop(element);
window.Shopify.designMode || document.querySelectorAll("[data-fade-in]").forEach(element => {
    ["load", "scroll", "shopify:section:load"].forEach(eventName => {
        window.addEventListener(eventName, () => {
            portView(element) && element.classList.add("fade-in")
        }
        )
    }
    )
}
);
const triggerClickFocus = {};
function triggerClick(container, tagClicked=container) {
    var elements = getClickable(container)
      , first = elements[0]
      , last = elements[elements.length - 1];
    triggerClickClose(),
    triggerClickFocus.focusin = event => {
        event.target !== container && event.target !== last && event.target !== first || document.addEventListener("keydown", triggerClickFocus.keydown)
    }
    ,
    triggerClickFocus.focusout = function() {
        document.removeEventListener("keydown", triggerClickFocus.keydown)
    }
    ,
    triggerClickFocus.keydown = function(event) {
        event.code.toUpperCase() === "TAB" && (event.target === last && !event.shiftKey && (event.preventDefault(),
        first.focus()),
        (event.target === container || event.target === first) && event.shiftKey && (event.preventDefault(),
        last.focus()))
    }
    ,
    document.addEventListener("focusout", triggerClickFocus.focusout),
    document.addEventListener("focusin", triggerClickFocus.focusin),
    tagClicked.focus(),
    tagClicked.tagName === "INPUT" && ["search", "text", "email", "url"].includes(tagClicked.type) && tagClicked.value && tagClicked.setSelectionRange(0, tagClicked.value.length)
}
try {
    document.querySelector(":focus-visible")
} catch {
    triggerShow()
}
function triggerShow() {
    const keyCont = ["ARROWUP", "ARROWDOWN", "ARROWLEFT", "ARROWRIGHT", "TAB", "ENTER", "SPACE", "ESCAPE", "HOME", "END", "PAGEUP", "PAGEDOWN"];
    let nowClickedTag = null
      , clickCont = null;
    window.addEventListener("keydown", event => {
        keyCont.includes(event.code.toUpperCase()) && (clickCont = !1)
    }
    ),
    window.addEventListener("mousedown", event => {
        clickCont = !0
    }
    ),
    window.addEventListener("focus", () => {
        nowClickedTag && nowClickedTag.classList.remove("focused"),
        !clickCont && (nowClickedTag = document.activeElement,
        nowClickedTag.classList.add("focused"))
    }
    , !0)
}
function triggerClickClose(tagClicked=null) {
    document.removeEventListener("focusin", triggerClickFocus.focusin),
    document.removeEventListener("focusout", triggerClickFocus.focusout),
    document.removeEventListener("keydown", triggerClickFocus.keydown),
    tagClicked && tagClicked.focus()
}
function escClick(event) {
    if (event.code.toUpperCase() !== "ESCAPE")
        return;
    const openDetailsElement = event.target.closest("details[open]");
    if (!openDetailsElement)
        return;
    const summaryElement = openDetailsElement.querySelector("summary");
    openDetailsElement.removeAttribute("open"),
    summaryElement.setAttribute("aria-expanded", !1),
    summaryElement.focus()
}
class qtyBox extends HTMLElement {
    constructor() {
        super(),
        this.input = this.querySelector("input"),
        this.changeEvent = new Event("change",{
            bubbles: !0
        }),
        this.input.addEventListener("change", this.qtyInputupdate.bind(this)),
        this.querySelectorAll("button").forEach(button => button.addEventListener("click", this.BtTrigger.bind(this)))
    }
    qtyInputupdateBlank = void 0;
    connectedCallback() {
        this.requreQtyterm(),
        this.qtyInputupdateBlank = user(SP_OBJECT.qtyRefresh, this.requreQtyterm.bind(this))
    }
    disconnectedCallback() {
        this.qtyInputupdateBlank && this.qtyInputupdateBlank()
    }
    qtyInputupdate(event) {
        this.requreQtyterm()
    }
    BtTrigger(event) {
        event.preventDefault();
        const pastValue = this.input.value;
        event.target.name === "plus" ? this.input.stepUp() : this.input.stepDown(),
        pastValue !== this.input.value && this.input.dispatchEvent(this.changeEvent)
    }
    requreQtyterm() {
        const value = parseInt(this.input.value);
        if (this.input.min) {
            const min = parseInt(this.input.min);
            this.querySelector(".qty-bt[name='minus']").classList.toggle("disabled", value <= min)
        }
        if (this.input.max) {
            const max = parseInt(this.input.max);
            this.querySelector(".qty-bt[name='plus']").classList.toggle("disabled", value >= max)
        }
    }
}
customElements.define("qty-box", qtyBox);
function stdebounce(fn, wait) {
    let t;
    return (...args) => {
        clearTimeout(t),
        t = setTimeout( () => fn.apply(this, args), wait)
    }
}
function stFetchConfig(type="json") {
    return {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: `application/${type}`
        }
    }
}
typeof window.Shopify > "u" && (window.Shopify = {}),
Shopify.bind = function(fn, scope) {
    return function() {
        return fn.apply(scope, arguments)
    }
}
,
Shopify.setSelectorByValue = function(selector, value) {
    for (var i = 0, count = selector.options.length; i < count; i++) {
        var option = selector.options[i];
        if (value == option.value || value == option.innerHTML)
            return selector.selectedIndex = i,
            i
    }
}
,
Shopify.addListener = function(target, eventName, callback) {
    target.addEventListener ? target.addEventListener(eventName, callback, !1) : target.attachEvent("on" + eventName, callback)
}
,
Shopify.postLink = function(path, options) {
    options = options || {};
    var method = options.method || "post"
      , params = options.parameters || {}
      , form = document.createElement("form");
    form.setAttribute("method", method),
    form.setAttribute("action", path);
    for (var key in params) {
        var hiddenField = document.createElement("input");
        hiddenField.setAttribute("type", "hidden"),
        hiddenField.setAttribute("name", key),
        hiddenField.setAttribute("value", params[key]),
        form.appendChild(hiddenField)
    }
    document.body.appendChild(form),
    form.submit(),
    document.body.removeChild(form)
}
,
Shopify.CountryProvinceSelector = function(country_domid, province_domid, options) {
    this.countryEl = document.getElementById(country_domid),
    this.provinceEl = document.getElementById(province_domid),
    this.provinceContainer = document.getElementById(options.hideElement || province_domid),
    Shopify.addListener(this.countryEl, "change", Shopify.bind(this.countryHandler, this)),
    this.initCountry(),
    this.initProvince()
}
,
Shopify.CountryProvinceSelector.prototype = {
    initCountry: function() {
        var value = this.countryEl.getAttribute("data-default");
        Shopify.setSelectorByValue(this.countryEl, value),
        this.countryHandler()
    },
    initProvince: function() {
        var value = this.provinceEl.getAttribute("data-default");
        value && this.provinceEl.options.length > 0 && Shopify.setSelectorByValue(this.provinceEl, value)
    },
    countryHandler: function(e) {
        var opt = this.countryEl.options[this.countryEl.selectedIndex]
          , raw = opt.getAttribute("data-provinces")
          , provinces = JSON.parse(raw);
        if (this.clearOptions(this.provinceEl),
        provinces && provinces.length == 0)
            this.provinceContainer.style.display = "none";
        else {
            for (var i = 0; i < provinces.length; i++) {
                var opt = document.createElement("option");
                opt.value = provinces[i][0],
                opt.innerHTML = provinces[i][1],
                this.provinceEl.appendChild(opt)
            }
            this.provinceContainer.style.display = ""
        }
    },
    clearOptions: function(selector) {
        for (; selector.firstChild; )
            selector.removeChild(selector.firstChild)
    },
    setOptions: function(selector, values) {
        for (var i = 0, count = values.length; i < values.length; i++) {
            var opt = document.createElement("option");
            opt.value = values[i],
            opt.innerHTML = values[i],
            selector.appendChild(opt)
        }
    }
};
class stModalcontent extends HTMLElement {
    constructor() {
        super(),
        this.querySelector('[id^="stclose-"]').addEventListener("click", this.hide.bind(this, !1)),
        this.addEventListener("keyup", event => {
            event.code.toUpperCase() === "ESCAPE" && this.hide()
        }
        ),
        this.classList.contains("media-modal") ? this.addEventListener("pointerup", event => {
            event.pointerType === "mouse" && !event.target.closest("deferred-media, product-model") && this.hide()
        }
        ) : this.addEventListener("click", event => {
            event.target === this && this.hide()
        }
        )
    }
    connectedCallback() {
        this.moved || (this.moved = !0,
        document.body.appendChild(this))
    }
    show(opener) {
        this.openedBy = opener;
        const popup = this.querySelector(".template-popup");
        this.setAttribute("open", ""),
        popup && popup.loadContent(),
        triggerClick(this, this.querySelector('[role="dialog"]'))
    }
    hide() {
        document.body.dispatchEvent(new CustomEvent("modalClosed")),
        this.removeAttribute("open"),
        triggerClickClose(this.openedBy)
    }
}
customElements.define("modal-dialog", stModalcontent);
class stModalshower extends HTMLElement {
    constructor() {
        super();
        const button = this.querySelector("a");
        button && button.addEventListener("click", () => {
            const modal = document.querySelector(this.getAttribute("data-modal"));
            modal && modal.show(button)
        }
        )
    }
}
customElements.define("qv-modal", stModalshower);
class Swatchoption extends HTMLElement {
    constructor() {
        super(),
        this.addEventListener("change", this.swatchUpdate)
    }
    swatchUpdate() {
        this.itemsUpdate(),
        this.stupdateMasterId(),
        this.btAddButton(!0, "", !1),
        this.stErrortxtRemove(),
        this.updateSwatchStatuses(),
        this.swatch ? (this.stupdateURL(),
        this.changeSwatchInput(),
        this.includeProInf(),
        this.updateDiscount(),
        this.updateImage()) : (this.btAddButton(!0, "", !0),
        this.stInaccessible())
    }
    updateImage() {
        if (this.swatch.featured_image != null) {
            var product_id = this.swatch.featured_image.product_id
              , section_id = this.getAttribute("data-section");
            if (this.swatch && this.swatch.featured_image && jQuery(".pro_details_pos .swiper-slide").length >= 1) {
                var layout = jQuery("#slider-small-" + section_id + "-" + product_id + ' .swiper-slide[data-image-id="' + this.swatch.featured_media.id + '"]').attr("data-layout");
                if (layout == "full-slider") {
                    var swiper = new Swiper(".slider-small-" + section_id + "-" + product_id,{
                        spaceBetween: 15,
                        slidesPerView: 3,
                        navigation: {
                            nextEl: ".button-next",
                            prevEl: ".button-prev"
                        },
                        breakpoints: {
                            0: {
                                slidesPerView: 1
                            },
                            320: {
                                slidesPerView: 1
                            },
                            480: {
                                slidesPerView: 3
                            }
                        }
                    });
                    const unGroupMedia = document.querySelector("#slider-small-" + section_id + "-" + product_id + ' .swiper-slide[data-image-id="' + this.swatch.featured_media.id + '"]')
                      , mediaIndex = unGroupMedia.getAttribute("data-index");
                    if (console.log(unGroupMedia),
                    console.log(mediaIndex),
                    mediaIndex == 1) {
                        swiper.destroy();
                        var swiper = new Swiper(".slider-small-" + section_id + "-" + product_id,{
                            spaceBetween: 15,
                            slidesPerView: 3,
                            navigation: {
                                nextEl: ".button-next",
                                prevEl: ".button-prev"
                            },
                            breakpoints: {
                                0: {
                                    slidesPerView: 1
                                },
                                320: {
                                    slidesPerView: 1
                                },
                                480: {
                                    slidesPerView: 3
                                }
                            }
                        })
                    } else {
                        var new_index = parseInt(mediaIndex) - 1;
                        swiper.slideTo(new_index, 500, !0)
                    }
                } else {
                    var slider_pos = jQuery("#slider-small-" + section_id + "-" + product_id + ' .swiper-slide[data-image-id="' + this.swatch.featured_media.id + '"]').attr("data-slide");
                    if (slider_pos == "vertical")
                        var dr = "vertical"
                          , sv = "auto";
                    else
                        var dr = "horizontal"
                          , sv = 5;
                    var swiper = new Swiper(".slider-small-" + section_id + "-" + product_id,{
                        spaceBetween: 15,
                        slidesPerView: sv,
                        direction: dr,
                        mousewheel: !0,
                        slideToClickedSlide: !0,
                        autoHeight: !0,
                        breakpoints: {
                            0: {
                                slidesPerView: 3,
                                direction: "horizontal"
                            },
                            320: {
                                slidesPerView: 3,
                                direction: "horizontal"
                            },
                            480: {
                                slidesPerView: sv,
                                direction: dr
                            }
                        }
                    })
                      , swiper2 = new Swiper(".slider-big-" + section_id + "-" + product_id,{
                        spaceBetween: 0,
                        slidesPerView: 1,
                        autoHeight: !0,
                        slideToClickedSlide: !0,
                        navigation: {
                            nextEl: ".button-next",
                            prevEl: ".button-prev"
                        },
                        thumbs: {
                            swiper
                        }
                    });
                    const mediaIndex = document.querySelector("#slider-small-" + section_id + "-" + product_id + ' .swiper-slide[data-image-id="' + this.swatch.featured_media.id + '"]').getAttribute("data-index");
                    if (mediaIndex == 1) {
                        swiper2.destroy();
                        var swiper2 = new Swiper(".slider-big-" + section_id + "-" + product_id,{
                            spaceBetween: 0,
                            slidesPerView: 1,
                            autoHeight: !0,
                            slideToClickedSlide: !0,
                            loop: !1,
                            navigation: {
                                nextEl: ".button-next",
                                prevEl: ".button-prev"
                            },
                            thumbs: {
                                swiper
                            }
                        })
                    } else {
                        var new_index = parseInt(mediaIndex) - 1;
                        swiper2.slideTo(new_index, 500, !0)
                    }
                }
            }
        }
    }
    updateDiscount() {
        var $ProductDiscount = $("#ProductDiscount")
          , $productPrice = $("#ProductPrice")
          , $comparePrice = $("#ComparePrice")
          , $Productlabel = $(".product-label");
        this.swatch.price < this.swatch.compare_at_price ? ($ProductDiscount.html(((this.swatch.compare_at_price - this.swatch.price) * 100 / this.swatch.compare_at_price).toFixed()),
        $ProductDiscount.show(),
        $Productlabel.show()) : ($ProductDiscount.hide(),
        $Productlabel.hide())
    }
    itemsUpdate() {
        this.options = Array.from(this.querySelectorAll("select"), select => select.value)
    }
    stupdateMasterId() {
        this.swatch = this.stSwatchDate().find(variant => !variant.options.map( (option, index) => this.options[index] === option).includes(!1))
    }
    stupdateURL() {
        !this.swatch || this.dataset.updateUrl === "false" || window.history.replaceState({}, "", `${this.dataset.url}?variant=${this.swatch.id}`)
    }
    changeSwatchInput() {
        document.querySelectorAll(`#product-form-${this.dataset.section}, #product-form-installment-${this.dataset.section}`).forEach(stproductForm => {
            const input = stproductForm.querySelector('input[name="id"]');
            input.value = this.swatch.id,
            input.dispatchEvent(new Event("change",{
                bubbles: !0
            }))
        }
        )
    }
    updateSwatchStatuses() {
        const activatedSwatch = this.variantData.filter(variant => this.querySelector(":checked").value === variant.option1)
          , stinputWrappers = [...this.querySelectorAll(".op-field")];
        stinputWrappers.forEach( (option, index) => {
            if (index === 0)
                return;
            const stoptionInputs = [...option.querySelectorAll('input[type="radio"], option')]
              , pastOptionSelected = stinputWrappers[index - 1].querySelector(":checked").value
              , avOptionInVal = activatedSwatch.filter(variant => variant.available && variant[`option${index}`] === pastOptionSelected).map(variantOption => variantOption[`option${index + 1}`]);
            this.stInAva(stoptionInputs, avOptionInVal)
        }
        )
    }
    stInAva(stlistOfOptions, stlistOfAvOptions) {
        stlistOfOptions.forEach(input => {
            stlistOfAvOptions.includes(input.getAttribute("value")) ? input.innerText = input.getAttribute("value") : input.innerText = window.stThemeString.StrunavailableOp.replace("[value]", input.getAttribute("value"))
        }
        )
    }
    stErrortxtRemove() {
        const section = this.closest("section");
        if (!section)
            return;
        const stproductForm = section.querySelector("cart-action");
        stproductForm && stproductForm.stHandErrorTxt()
    }
    includeProInf() {
        const reqSwatchId = this.swatch.id
          , stScId = this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section;
        fetch(`${this.dataset.url}?variant=${reqSwatchId}&section_id=${this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section}`).then(response => response.text()).then(responseText => {
            if (this.swatch.id !== reqSwatchId)
                return;
            const html = new DOMParser().parseFromString(responseText, "text/html")
              , goal = document.getElementById(`price-${this.dataset.section}`)
              , goalUnit = document.getElementById(`unit-price-${this.dataset.section}`)
              , source = html.getElementById(`price-${this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section}`)
              , sourceUnit = html.getElementById(`unit-price-${this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section}`)
              , skuSource = html.getElementById(`Sku-${this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section}`)
              , skuGoal = document.getElementById(`Sku-${this.dataset.section}`)
              , inventorySource = html.getElementById(`Inventory-${this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section}`)
              , invGoal = document.getElementById(`Inventory-${this.dataset.section}`);
            source && goal && (goal.innerHTML = source.innerHTML),
            sourceUnit && goalUnit && (goalUnit.innerHTML = sourceUnit.innerHTML),
            inventorySource && invGoal && (invGoal.innerHTML = inventorySource.innerHTML),
            skuSource && skuGoal && (skuGoal.innerHTML = skuSource.innerHTML,
            skuGoal.classList.toggle("visibility-hidden", skuSource.classList.contains("visibility-hidden")));
            const price = document.getElementById(`price-${this.dataset.section}`);
            price && price.classList.remove("visibility-hidden"),
            invGoal && invGoal.classList.toggle("visibility-hidden", inventorySource.innerText === "");
            const cartBtUpdated = html.getElementById(`ProductSubmitButton-${stScId}`);
            this.btAddButton(cartBtUpdated ? cartBtUpdated.hasAttribute("disabled") : !0, window.stThemeString.Strsoldout);
            const container = document.querySelector("[data-store-availability-container]");
            fetch(window.Shopify.routes.root + "variants/" + reqSwatchId + "/?section_id=pickup-availability").then(response => response.text()).then(text => {
                if (!container) {
                    console.error("Pickup availability container not found.");
                    return
                }
                const pickupAvailabilityHTML = new DOMParser().parseFromString(text, "text/html").querySelector(".shopify-section")
                  , unavailablePickupOptions = pickupAvailabilityHTML.querySelectorAll(".unavailable")
                  , elementsToHide = document.querySelectorAll(".product__pickup-availabilities.quick-add-hidden");
                if (unavailablePickupOptions.length > 0)
                    elementsToHide.forEach(element => {
                        element.style.display = "none"
                    }
                    );
                else if (elementsToHide.forEach(element => {
                    element.style.display = "block"
                }
                ),
                pickupAvailabilityHTML) {
                    container.innerHTML = "",
                    container.appendChild(pickupAvailabilityHTML);
                    const button = document.querySelector("#ShowPickupAvailabilityDrawer");
                    button && button.addEventListener("click", evt => {
                        const drawer = document.querySelector("pickup-availability-drawer");
                        drawer && typeof drawer.show == "function" ? drawer.show(evt.target) : console.error("Drawer element or show method not found.")
                    }
                    )
                } else
                    console.error("Pickup availability HTML not found.")
            }
            ).catch(e => {
                console.error(e)
            }
            ),
            live(SP_OBJECT.swatchUpdate, {
                data: {
                    stScId,
                    html,
                    variant: this.swatch
                }
            })
        }
        )
    }
    btAddButton(disable=!0, text, modifyClass=!0) {
        const stproductForm = document.getElementById(`product-form-${this.dataset.section}`);
        if (!stproductForm)
            return;
        const cartBt = stproductForm.querySelector('[name="add"]')
          , cartBtText = stproductForm.querySelector('[name="add"] > span');
        cartBt && (disable ? (cartBt.setAttribute("disabled", "disabled"),
        text && (cartBtText.textContent = text)) : (cartBt.removeAttribute("disabled"),
        cartBtText.textContent = window.stThemeString.Straddcart))
    }
    stInaccessible() {
        const button = document.getElementById(`product-form-${this.dataset.section}`)
          , cartBt = button.querySelector('[name="add"]')
          , cartBtText = button.querySelector('[name="add"] > span')
          , price = document.getElementById(`price-${this.dataset.section}`)
          , inventory = document.getElementById(`Inventory-${this.dataset.section}`)
          , sku = document.getElementById(`Sku-${this.dataset.section}`);
        cartBt && (cartBtText.textContent = window.stThemeString.Strunavailable,
        price && price.classList.add("visibility-hidden"),
        inventory && inventory.classList.add("visibility-hidden"),
        sku && sku.classList.add("visibility-hidden"))
    }
    stSwatchDate() {
        return this.variantData = this.variantData || JSON.parse(this.querySelector('[type="application/json"]').textContent),
        this.variantData
    }
}
customElements.define("selects-box", Swatchoption);
class SwatchCheck extends Swatchoption {
    constructor() {
        super()
    }
    stInAva(stlistOfOptions, stlistOfAvOptions) {
        stlistOfOptions.forEach(input => {
            stlistOfAvOptions.includes(input.getAttribute("value")) ? input.classList.remove("disabled") : input.classList.add("disabled")
        }
        )
    }
    itemsUpdate() {
        const varitems = Array.from(this.querySelectorAll("varitem"));
        this.options = varitems.map(varitem => Array.from(varitem.querySelectorAll("input")).find(radio => radio.checked).value)
    }
}
customElements.define("pr-option", SwatchCheck);
class StRecomPro extends HTMLElement {
    constructor() {
        super()
    }
    connectedCallback() {
        const sthandleIntersection = (entries, observer) => {
            entries[0].isIntersecting && (observer.unobserve(this),
            fetch(this.dataset.url).then(response => response.text()).then(text => {
                const html = document.createElement("div");
                html.innerHTML = text;
                const recommrela = html.querySelector("relative-pro");
                if (recommrela && recommrela.innerHTML.trim().length) {
                    this.innerHTML = recommrela.innerHTML,
                    $(".item-data").length >= 1 && $(".item-data").on("click", function() {
                        $(this).parents(".option-block").find(".variant-option").removeClass("active-variant"),
                        $(this).closest("form-wrap").addClass("active-variant");
                        var it_img = $(this).attr("dataimg");
                        $(this).parents(".single-product-wrap").find(".product-image .img1 img").attr("src", it_img),
                        $(this).parents(".single-product-wrap").find(".product-image .img1 img").attr("srcset", it_img);
                        var price = $(this).attr("dataprice")
                          , compareprice = $(this).attr("datacompare")
                          , stocks = $(this).attr("dataavailable");
                        $(this).parents(".single-product-wrap").find(".price-box .new-price").text(Shopify.formatMoney(price, window.money_format)),
                        compareprice > price ? ($(this).parents(".single-product-wrap").find(".price-box .old-price").show(),
                        $(this).parents(".single-product-wrap").find(".price-box .old-price").html(Shopify.formatMoney(compareprice, window.money_format))) : $(this).parents(".single-product-wrap").find(".price-box .old-price").hide()
                    });
                    var slide_view = jQuery("#related-slider").attr("slide-view")
                      , slide_view_lg = jQuery("#related-slider").attr("slide-view-lg")
                      , slide_view_sm = jQuery("#related-slider").attr("slide-view-sm")
                      , swiper = new Swiper("#related-slider",{
                        slidesPerView: slide_view,
                        grid: {
                            rows: 1,
                            fill: "row" | "column"
                        },
                        spaceBetween: 30,
                        observer: !0,
                        observeParents: !0,
                        watchSlidesProgress: !0,
                        navigation: {
                            nextEl: ".swiper-next",
                            prevEl: ".swiper-prev"
                        },
                        pagination: {
                            el: ".swiper-pagination",
                            clickable: !0
                        },
                        breakpoints: {
                            0: {
                                slidesPerView: 1,
                                grid: {
                                    rows: 1,
                                    fill: "row" | "column"
                                },
                                spaceBetween: 12
                            },
                            320: {
                                slidesPerView: 1,
                                grid: {
                                    rows: 1,
                                    fill: "row" | "column"
                                },
                                spaceBetween: 12
                            },
                            360: {
                                slidesPerView: slide_view_sm,
                                grid: {
                                    rows: 1,
                                    fill: "row" | "column"
                                },
                                spaceBetween: 12
                            },
                            540: {
                                slidesPerView: slide_view_sm,
                                grid: {
                                    rows: 1,
                                    fill: "row" | "column"
                                },
                                spaceBetween: 12
                            },
                            640: {
                                slidesPerView: slide_view_lg,
                                grid: {
                                    rows: 1,
                                    fill: "row" | "column"
                                },
                                spaceBetween: 12
                            },
                            768: {
                                slidesPerView: slide_view_lg,
                                grid: {
                                    rows: 1,
                                    fill: "row" | "column"
                                },
                                spaceBetween: 30
                            },
                            1024: {
                                slidesPerView: slide_view_lg,
                                grid: {
                                    rows: 1,
                                    fill: "row" | "column"
                                },
                                spaceBetween: 30
                            },
                            1199: {
                                slidesPerView: slide_view,
                                grid: {
                                    rows: 1,
                                    fill: "row" | "column"
                                },
                                spaceBetween: 30
                            },
                            1499: {
                                slidesPerView: slide_view,
                                grid: {
                                    rows: 1,
                                    fill: "row" | "column"
                                },
                                spaceBetween: 30
                            }
                        }
                    })
                }
                !this.querySelector("slideshow-component") && this.classList.contains("complementary-products") && this.remove()
            }
            ).catch(e => {
                console.error(e)
            }
            ))
        }
        ;
        new IntersectionObserver(sthandleIntersection.bind(this),{
            rootMargin: "0px 0px 400px 0px"
        }).observe(this)
    }
}
customElements.define("relative-pro", StRecomPro);
class ajaxSearchForm extends HTMLElement {
    constructor() {
        super(),
        this.input = this.querySelector('input[type="search"]'),
        this.resetButton = this.querySelector('button[type="reset"]'),
        this.input && (this.input.form.addEventListener("reset", this.onFormReset.bind(this)),
        this.input.addEventListener("input", stdebounce(event => {
            this.triggerChange(event)
        }
        , 300).bind(this)))
    }
    ajaxResetBtn() {
        const resetIsHidden = this.resetButton.classList.contains("hidden");
        this.input.value.length > 0 && resetIsHidden ? this.resetButton.classList.remove("hidden") : this.input.value.length === 0 && !resetIsHidden && this.resetButton.classList.add("hidden")
    }
    triggerChange() {
        this.ajaxResetBtn()
    }
    shouldResetForm() {
        return !document.querySelector('[aria-selected="true"] a')
    }
    onFormReset(event) {
        event.preventDefault(),
        this.shouldResetForm() && (this.input.value = "",
        this.input.focus(),
        this.ajaxResetBtn())
    }
}
customElements.define("search-form", ajaxSearchForm),
customElements.get("popup-view") || customElements.define("popup-view", class extends stModalcontent {
    constructor() {
        super(),
        this.modalContent = this.querySelector('[id^="QuickAddInfo-"]')
    }
    hide(preventFocus=!1) {
        this.modalContent.innerHTML = "",
        preventFocus && (this.openedBy = null),
        super.hide()
    }
    show(opener) {
        opener.setAttribute("aria-disabled", !0),
        opener.classList.add("loading"),
        opener.querySelector(".ajax-loader").classList.remove("hidden"),
        fetch(opener.getAttribute("data-product-url")).then(response => response.text()).then(responseText => {
            const responseHTML = new DOMParser().parseFromString(responseText, "text/html");
            this.productElement = responseHTML.querySelector('section[id^="MainProduct-"]'),
            this.preventDuplicatedIDs(),
            this.removeDOMElements(),
            this.setInnerHTML(this.modalContent, this.productElement.innerHTML),
            window.Shopify && Shopify.PaymentButton && Shopify.PaymentButton.init(),
            window.ProductModel && window.ProductModel.loadShopifyXR(),
            this.preSwatchURLswapping(),
            super.show(opener)
        }
        ).finally( () => {
            opener.removeAttribute("aria-disabled"),
            opener.classList.remove("loading"),
            opener.querySelector(".ajax-loader").classList.add("hidden")
        }
        )
    }
    setInnerHTML(element, html) {
        element.innerHTML = html,
        element.querySelectorAll("script").forEach(oldScriptTag => {
            const newScriptTag = document.createElement("script");
            Array.from(oldScriptTag.attributes).forEach(attribute => {
                newScriptTag.setAttribute(attribute.name, attribute.value)
            }
            ),
            newScriptTag.appendChild(document.createTextNode(oldScriptTag.innerHTML)),
            oldScriptTag.parentNode.replaceChild(newScriptTag, oldScriptTag)
        }
        )
    }
    preSwatchURLswapping() {
        const variantPicker = this.modalContent.querySelector("pr-option,selects-box");
        variantPicker && variantPicker.setAttribute("data-update-url", "false")
    }
    removeDOMElements() {
        const productModal = this.productElement.querySelector("product-modal");
        productModal && productModal.remove();
        const modalDialog = this.productElement.querySelectorAll("modal-dialog");
        modalDialog && modalDialog.forEach(modal => modal.remove());
        const pickupAvailability = this.productElement.querySelector("pickup-availability");
        pickupAvailability && pickupAvailability.remove()
    }
    preventDuplicatedIDs() {
        const stScId = this.productElement.dataset.section;
        this.productElement.innerHTML = this.productElement.innerHTML.replaceAll(stScId, `quickadd-${stScId}`),
        this.productElement.querySelectorAll("selects-box, pr-option, product-info").forEach(element => {
            element.dataset.originalSection = stScId
        }
        )
    }
}
),
customElements.get("cart-action") || customElements.define("cart-action", class extends HTMLElement {
    constructor() {
        super(),
        this.form = this.querySelector("form"),
        this.form.querySelector("[name=id]").disabled = !1,
        this.form.addEventListener("submit", this.triggerSendHand.bind(this)),
        this.cart = document.querySelector("cart-notification") || document.querySelector("ajax-cart"),
        this.submitButton = this.querySelector('[type="submit"]')
    }
    triggerSendHand(evt) {
        if (evt.preventDefault(),
        this.submitButton.getAttribute("aria-disabled") === "true")
            return;
        this.stHandErrorTxt(),
        this.submitButton.setAttribute("aria-disabled", !0),
        this.submitButton.classList.add("loading"),
        this.querySelector(".ajax-loader").classList.remove("hidden");
        const config = stFetchConfig("javascript");
        config.headers["X-Requested-With"] = "XMLHttpRequest",
        delete config.headers["Content-Type"];
        const formData = new FormData(this.form);
        this.cart && (formData.append("sections", this.cart.fetchSecToInclude().map(section => section.id)),
        formData.append("sections_url", window.location.pathname),
        this.cart.setActiveElement(document.activeElement)),
        config.body = formData,
        fetch(`${routes.increase_cart_url}`, config).then(response => response.json()).then(response => {
            if (response.status) {
                this.stHandErrorTxt(response.description);
                const soldOutMessage = this.submitButton.querySelector(".sold-out-message");
                if (!soldOutMessage)
                    return;
                this.submitButton.setAttribute("aria-disabled", !0),
                this.submitButton.querySelector("span").classList.add("hidden"),
                soldOutMessage.classList.remove("hidden"),
                this.error = !0;
                return
            } else if (!this.cart) {
                window.location = window.routes.cart_url;
                return
            }
            this.error || live(SP_OBJECT.ajxcartRefresh, {
                source: "cart-action"
            }),
            this.error = !1;
            const quickAddModal = this.closest("popup-view");
            quickAddModal ? (document.body.addEventListener("modalClosed", () => {
                setTimeout( () => {
                    this.cart.renderContents(response)
                }
                )
            }
            , {
                once: !0
            }),
            quickAddModal.hide(!0)) : this.cart.renderContents(response)
        }
        ).catch(e => {
            console.error(e)
        }
        ).finally( () => {
            this.submitButton.classList.remove("loading"),
            this.cart && this.cart.classList.contains("is-empty") && this.cart.classList.remove("is-empty"),
            this.error || this.submitButton.removeAttribute("aria-disabled"),
            this.querySelector(".ajax-loader").classList.add("hidden")
        }
        )
    }
    stHandErrorTxt(errorMessage=!1) {
        this.errorMessageWrapper = this.errorMessageWrapper || this.querySelector(".pr-form-error"),
        this.errorMessageWrapper && (this.errorMessage = this.errorMessage || this.errorMessageWrapper.querySelector(".pr-form-error-text"),
        this.errorMessageWrapper.toggleAttribute("hidden", !errorMessage),
        errorMessage && (this.errorMessage.textContent = errorMessage))
    }
}
);
function pauseAllMedia() {
    document.querySelectorAll(".js-youtube").forEach(video => {
        video.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', "*")
    }
    ),
    document.querySelectorAll(".js-vimeo").forEach(video => {
        video.contentWindow.postMessage('{"method":"pause"}', "*")
    }
    ),
    document.querySelectorAll("video").forEach(video => video.pause()),
    document.querySelectorAll("product-model").forEach(model => {
        model.modelViewerUI && model.modelViewerUI.pause()
    }
    )
}
class DeferredMedia extends HTMLElement {
    constructor() {
        super();
        const poster = this.querySelector('[id^="Deferred-Poster-"]');
        poster && poster.addEventListener("click", this.loadContent.bind(this))
    }
    loadContent(focus=!0) {
        if (window.pauseAllMedia(),
        !this.getAttribute("loaded")) {
            const content = document.createElement("div");
            content.appendChild(this.querySelector("template").content.firstElementChild.cloneNode(!0)),
            this.setAttribute("loaded", !0);
            const deferredElement = this.appendChild(content.querySelector("video, model-viewer, iframe"));
            focus && deferredElement.focus(),
            deferredElement.nodeName == "VIDEO" && deferredElement.getAttribute("autoplay") && deferredElement.play()
        }
    }
}
customElements.define("deferred-media", DeferredMedia);
//# sourceMappingURL=/cdn/shop/t/3/assets/plugins.js.map?v=161004985992465855381739184961
