/**
 * Ender is responsible for the startup
 * of the whole thing :)
 */

jQuery(window).on('hashchange', function(){ tcEasyMode.init().initModules() } );

setTimeout(function(){
	tcEasyMode.init().initModules();
	tcEasyMode.init().modulesController.initMod();
},300);
