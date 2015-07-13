tcEasyMode.init = function () {
    'use strict';

    var Options = {
        name: 'Options',
        code: 'options',
        description: 'Enable/Disable Modules',
        enabled: isModuleEnabled('options'),
        isLocation: function () {
            return true;
        },
        isPresent: function () {
            var optionsTarget = jQuery('#settings');
            if (jQuery('.tcem').length) return false;
            return (optionsTarget.length) ? true : false;
        },
        createHtml: function (module) {
            var newOptModule = jQuery('<div class="clearfix prettyradio labelright  blue" style="display: block"></div>');
            var checked = (module.enabled) ? 'checked="checked"' : '';
            var theClass = (module.enabled) ? 'class="checked"' : '';
            newOptModule.append('' +
                '<input type="radio" name="tcmmOpt_' + module.code + '" id="' + module.code + '" value="" style="display: none;" ' + checked + '>' +
                '<a href="#" role="radio" ' + theClass + ' aria-checked="false" aria-disabled="false" title="' + module.description + '"></a>' +
                '<label for="' + module.code + '" class="" title="' + module.description + '">' + module.name + '</label>' +
                '');
            jQuery('.tcem').append(newOptModule);

            jQuery('#' + module.code).on('click', function () {

                if (isModuleEnabled(jQuery(this).attr('id'))) {
                    $('input', jQuery(this).parent()).removeAttr('checked');
                    $('a', jQuery(this).parent()).removeClass('checked');
                }
                else {
                    $('input', jQuery(this).parent()).attr('checked', 'checked');
                    $('a', jQuery(this).parent()).addClass('checked');
                }
                toggleMod(jQuery(this).attr('id'));
            });
        },
        initMod: function () {
            var newOptions = $('<div class="chat-init has-pretty-child tcem"></div>');
            var mod, modKey;

            addGlobalStyle('.tcem .github-links {display:inline-block; float:right; color: black;}');
            addGlobalStyle('.tcem .github-links a {color: #069;}');
            addGlobalStyle('.tcem .github-links a:hover,.tcem .t-blue a:hover {color: #999;}');

            newOptions.append('<div class="t-blue bold"><a target="_blank" href="https://github.com/moshmage/tc-easymode">TC Easy Mode</a><div class="github-links"><a target="_blank" href="https://github.com/moshmage/tc-easymode/issues">Feedback</a></div></div>');
            $('#settings .chat-box-content').append(newOptions);
            for (modKey in tcEasyMode.modules) {
                mod = tcEasyMode.modules[modKey];
                if (!isModuleInStorage(mod.code)) {
                    newModuleToConf(mod.code);
                }
                this.createHtml({code: mod.code, enabled: mod.enabled, name: mod.name, description: mod.description});
            }
        }
    };

    function persistentInit(modKey) {
        var mod = tcEasyMode.modules[modKey];
        if (mod.isPresent() && !mod.loaded) {
            mod.loaded = true;
            mod.initMod();
            loadTrying[modKey] = 5;
        }
        else {
            if (loadTrying[modKey]) {
                setTimeout(function () {
                    persistentInit(modKey)
                }, 1000);
                loadTrying[modKey]--;
            }
        }
    }

    function initModules() {
        var modCount = Object.keys(tcEasyMode.modules).length;
        var mod, modKey;
        var isLoadable;
        console.log('tc-em: Found', modCount, 'module(s)');
        for (modKey in tcEasyMode.modules) {
            mod = tcEasyMode.modules[modKey];
            mod.loaded = false;
            isLoadable = (mod.isLocation() && isModuleEnabled(mod.code));
            console.log('tc-em: Loading', mod.name, '...', isLoadable, 'isLocation:', mod.isLocation(), 'isModuleEnabled:', isModuleEnabled(mod.code));
            if (isLoadable) {
                loadTrying[modKey] = GLOBAL_CONFIG.maximum.loadTry;
                setTimeout(persistentInit(modKey), 1000);
            }
        }
    }

    return {
        initModules: initModules,
        modulesController: Options
    };
};