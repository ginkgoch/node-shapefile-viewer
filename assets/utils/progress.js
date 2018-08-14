module.exports = class Progress {
    constructor(el) {
        this.el = el;
        this.changeRatio = 5;
        this.previous = 0;
    }

    reset() {
        this.el.hide();
        this._value(0);
        this.previous = 0;
    }

    show() {
        this.el.show();
    }

    value(val) {
        if (this.previous + this.changeRatio <= val || val === 100) {
            val = parseInt(val);
            this._value(val);
            this.previous = val;
        }
    }

    _value(val) {
        this.el.children().css('width', val + '%').attr('aria-valuenow', val);
    }
}