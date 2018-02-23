import _ from 'lodash';
import './index.scss';

function component() {
    var element = document.createElement('div');
    //element.innerHTML = _.join(['Hello', 'webpack'], ' ');

    element.innerHTML = '<div class="container">\n' +
        '<div class="flash">\n' +
        '  <button type="submit" class="btn btn-sm primary flash-action">Complete action</button>\n' +
        '  Flash message with action here.\n' +
        '</div>' +

        '<div class="Subhead">\n' +
        '  <div class="Subhead-heading">Buttons </div>\n' +
        '  <div class="Subhead-description">The subhead is a subdued header style with a light bottom border.</div>\n' +
        '</div>' +

        '<button class="btn btn-primary" type="button">Button</button>\n' +
        '<a class="btn" href="https://primer.github.io/" role="button">Primer showroom</a>' +

        '<div class="position-relative text-center">\n' +
        '  <button class="btn btn-primary">UI</button>\n' +
        '  <div class="Popover right-0 left-0">\n' +
        '    <div class="Popover-message Popover-message--top Popover-message--large text-left p-4 mt-2 Box box-shadow-large">\n' +
        '      <h4 class="mb-2">Popover heading</h4>\n' +
        '      <p>Message about this particular piece of UI.</p>\n' +
        '      <button type="submit" class="btn btn-outline mt-2 text-bold">Got it!</button>\n' +
        '    </div>\n' +
        '  </div>\n' +
        '</div>' +

        '<div class="Subhead">\n' +
        '  <div class="Subhead-heading">A Box with action</div>\n' +
        '  <div class="Subhead-description">The subhead is a subdued header style with a light bottom border.</div>\n' +
        '</div>' +
        '<div class="Box">\n' +
        '  <div class="Box-row d-flex flex-items-center">\n' +
        '    <div class="flex-auto">\n' +
        '      <strong>Row title</strong>\n' +
        '      <div class="text-small text-gray-light">\n' +
        '        Description\n' +
        '      </div>\n' +
        '    </div>\n' +
        '    <button type="button" class="btn btn-primary" name="button">View</button>\n' +
        '  </div>\n' +
        '  <div class="Box-row d-flex flex-items-center">\n' +
        '    <div class="flex-auto">\n' +
        '      <strong>Row title</strong>\n' +
        '      <div class="text-small text-gray-light">\n' +
        '        Description\n' +
        '      </div>\n' +
        '    </div>\n' +
        '    <button type="button" class="btn btn-primary" name="button">View</button>\n' +
        '  </div>\n' +
        '  <div class="Box-row d-flex flex-items-center">\n' +
        '    <div class="flex-auto">\n' +
        '      <strong>Row title</strong>\n' +
        '      <div class="text-small text-gray-light">\n' +
        '        Description\n' +
        '      </div>\n' +
        '    </div>\n' +
        '    <button type="button" class="btn btn-primary" name="button">View</button>\n' +
        '  </div>\n' +
        '</div>' +

        '<div class="Subhead">\n' +
        '  <div class="Subhead-heading">Any empty space</div>\n' +
        '  <div class="Subhead-description">The subhead is a subdued header style with a light bottom border.</div>\n' +
        '</div>' +
        '<div class="blankslate">\n' +
        '  <h3>This is a blank slate</h3>\n' +
        '  <p>Use it to provide information when no dynamic content exists.</p>\n' +
        '</div>' +

        '</div>';
    return element;
}

document.body.appendChild(component());
