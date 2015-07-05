/**
 * Ender is responsible for the startup
 * of the whole thing :)
 */

jQuery(window).on('hashchange', function(){ setTimeout(function(){ tcEasyMode.init().initModules() },300); } );

setTimeout(function(){
	tcEasyMode.init().initModules();
	tcEasyMode.init().modulesController.initMod();
},300);
