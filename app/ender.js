/**
 * Ender is responsible for the startup
 * of the whole thing :)
 */



setTimeout(function(){
	tcEasyMode.init().initModules();
	tcEasyMode.init().modulesController.initMod();
	jQuery(window).on('hashchange', function(){ setTimeout(function(){ tcEasyMode.init().initModules() },300); } );
},300);
