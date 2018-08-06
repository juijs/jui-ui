if (typeof module == 'object' && module.exports) {
    try {
        module.exports = require('juijs')
    } catch(e) {
        console.warn("JUI_WARNING_MSG: Base module does not exist");
    }
}