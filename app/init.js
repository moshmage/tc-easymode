tcEasyMode.init = function() {
	'use strict';

	var Options = {
		name: 'Options',
		code: 'options',
		description: 'Enable/Disable Modules',
		enabled: isModuleEnabled('options'),
		isLocation: function() { return true; },
		isPresent: function() {
			var optionsTarget = jQuery('#settings');
			if (jQuery('.tcem').length) return false;
			return (optionsTarget.length) ? true : false;
		},
		createHtml: function(module) {
			var newOptModule = jQuery('<div class="clearfix prettyradio labelright  blue" style="display: block"></div>');
			var checked = (module.enabled) ? 'checked="checked"' : '';
			var theClass = (module.enabled) ? 'class="checked"' : '';
			newOptModule.append(''+
				'<input type="radio" name="tcmmOpt_'+module.code+'" id="'+module.code+'" data-label="'+module.description+'" value="" style="display: none;" '+checked+'>'+
				'<a href="#" role="radio" '+theClass+' aria-checked="false" aria-disabled="false"></a>'+
				'<label for="'+module.code+'" class="">'+module.name+'</label>'+
				'');
			jQuery('.tcem').append(newOptModule);

			jQuery('#'+module.code).on('click',function(){

				if (isModuleEnabled(jQuery(this).attr('id'))) {
					$('input',jQuery(this).parent()).removeAttr('checked');
					$('a',jQuery(this).parent()).removeClass('checked');
				}
				else {
					$('input',jQuery(this).parent()).attr('checked','checked');
					$('a',jQuery(this).parent()).addClass('checked');
				}
				toggleMod(jQuery(this).attr('id'));
			});
		},
		initMod: function() {
			var newOptions = $('<div class="chat-init has-pretty-child tcem"></div>');
			var mod, modKey;
			newOptions.append('<div class="t-gray-9 bold">TC Easy Mode</div>');
			$('#settings .chat-box-content').append(newOptions);
			for (modKey in tcEasyMode.modules) {
				mod = tcEasyMode.modules[modKey];
				if (!isModuleInStorage(mod.code)) {
					newModuleToConf(mod.code);
				}
				this.createHtml({code:mod.code,enabled:mod.enabled,name:mod.name});
			}
		}
	};

	function persistentInit(modKey) {
		var mod = tcEasyMode.modules[modKey];
		if (mod.isPresent() && !mod.loaded) {
			mod.loaded = true;
			mod.initMod();
			_timeout[modKey] = 5;
		}
		else {
			if (_timeout[modKey]) {
				setTimeout(function() { persistentInit(modKey) },1000);
				_timeout[modKey]--;
			}
		}
	}

	function initModules() {
		var modCount = Object.keys(tcEasyMode.modules).length;
		var mod, modKey;
		var isLoadable;
		console.log('tc-em: Found',modCount,'module(s)');
		for (modKey in tcEasyMode.modules) {
			mod = tcEasyMode.modules[modKey];
			isLoadable = (mod.isLocation() && isModuleEnabled(mod.code));
			console.log('tc-em: Loading',mod.name,'...',isLoadable,'isLocation:',mod.isLocation(),'isModuleEnabled:',isModuleEnabled(mod.code));
			if (isLoadable) {
				_timeout[modKey] = 5;
				setTimeout(persistentInit(modKey),1000);
			}
		}
	}

	return {
		initModules: initModules,
		modulesController: Options
	};
};