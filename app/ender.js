/**
 * Ender is responsible for the startup
 * of the whole thing :)
 */

jQuery(window).on('hashchange', function () {
    var modKey, mod = {}, isLoadable;
    for (modKey in tcEasyMode.modules) {
        mod = tcEasyMode.modules[modKey];
        mod.loaded = false;
        isLoadable = (mod.isLocation() && isModuleEnabled(mod.code) && mod.onHashChange);
        console.log('tc-em: re-Loading', mod.name, '...', isLoadable, 'isLocation:', mod.isLocation(), 'isModuleEnabled:', isModuleEnabled(mod.code));
        if (isLoadable) {
            if (mod.destroy) {
                mod.destroy();
            }
            setTimeout(function () {
                tcEasyMode.modules[modKey].initMod();
                mod.loaded = true;
            }, 300);
        }
    }
});

setTimeout(function () {
    tcEasyMode.init().initModules();
    tcEasyMode.init().modulesController.initMod();
}, 300);
