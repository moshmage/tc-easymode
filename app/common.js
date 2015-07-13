/**
 * Globals
 * */

window.tcEasyMode = {};
var _timeout = new Array();
var DB_NAMES = {
    options: 'tc-easyMode-options',
    bookmarks: 'tc-easyMode-bookmarks',
    playersList: 'tc-em-bplayerlist',
    travelrunData: 'tc-em-travelrun'
};
var tcEasyMode = window.tcEasyMode;
tcEasyMode.modules = {};

/**
 * returns a JSON.parse of the provided local <storageName> or empty Object
 * @param storageName
 * @returns {Object}
 */
function localParse(storageName) {
    var storage = localStorage.getItem(storageName);
    if (storage) storage = JSON.parse(storage);
    else storage = JSON.parse("{}");
    return storage;
}

function localWrite(storageName, object) {
    localStorage.setItem(storageName, JSON.stringify(object));
}

function isModuleInStorage(item) {
    var storage = localParse(DB_NAMES.options);
    if (!storage || !storage[item]) return false;
    else return (storage[item]);
}

function isModuleEnabled(item) {
    var storage = localParse(DB_NAMES.options);
    return (storage) ? storage[item] : false;
}

function toggleMod(module) {
    var storage = localParse(DB_NAMES.options);
    storage[module] = !storage[module];
    localWrite(DB_NAMES.options, storage);
}

function newModuleToConf(module) {
    var storage = localParse(DB_NAMES.options);
    storage[module] = false;
    localWrite(DB_NAMES.options, storage);
}

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) {
        return;
    }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}