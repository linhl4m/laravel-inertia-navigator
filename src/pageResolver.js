/**
 * @param {string} inertiaPage
 * @returns {string}
 */
function resolveInertiaPagePath(inertiaPage) {
    return `resources/js/Pages/${inertiaPage}.vue`;
}

module.exports = {
    resolveInertiaPagePath
};