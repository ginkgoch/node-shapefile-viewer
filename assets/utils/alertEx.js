const alertLevels = require('./alertLevels');

let alertDismissTimerId = undefined;
module.exports = class AlertEx {
    static alert(content, alertLevel) {
        const alertContainer = $('.alert');
        _.values(alertLevels).forEach(s => alertContainer.removeClass('alert-' + s));
        alertContainer.addClass('alert-' + alertLevel);

        const alertContentContainer = $('.alert>div');
        alertContentContainer.html(AlertEx._toHtml(content));
        alertContainer.show(100);

        if (alertDismissTimerId) { 
            clearTimeout(alertDismissTimerId);
        }
        alertDismissTimerId = setTimeout(() => alertContainer.hide('slow'), 3000);
    }

    static _toHtml(content) {
        if (_.isString(content)) return content;

        let html = '';

        if (content.title) {
            html += `<strong>${content.title}</strong>`;
        }
        if (content.message) {
            html += content.message;
        }

        return html;
    }
}
