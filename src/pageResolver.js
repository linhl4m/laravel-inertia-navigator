/**
 * Maps an Inertia page name (as passed to `Inertia::render`) to its
 * Vue file path within the Laravel project.
 * @param {string} inertiaPage
 * @returns {string}
 */
function resolveInertiaPagePath(inertiaPage) {
    return `resources/js/Pages/${inertiaPage}.vue`;
}

module.exports = {
    resolveInertiaPagePath
};