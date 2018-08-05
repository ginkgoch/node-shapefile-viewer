module.exports = class Progress {
    constructor(el) {
        this.el = el;
    }

    reset() {
        this.el.hide();
        this.value(0);
    }

    show() {
        this.el.show();
    }

    value(val) {
        this.el.children().css('width', val + '%').attr('aria-valuenow', val);
    }
}