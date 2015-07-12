# Project Display
## Intro
This project uses Grunt to concatenate and uglify the code, this enables us to have a clean project structure;
I tried to be as specific as possible both in the code and in the folder structure so new contributors don't feel lost from the get go.

```
    app/
        modules/
            module-name.js
            another-module-name.js
        common.js
        ender.js
        init.js
        user-script-id
    server/
        file-name.php
```

^We ^will ^get ^into ^the ^grunt ^further ^on.
The reason for the server side being written in PHP is purely because I had a PHP server running;    
I will try and make a node.js version later on - or you're more than welcome to :)

`app/` is used as the project center, where the main four files that hold the skeleton are;
`init.js`, that holds the initialization of the modules and is itself the Options module, `common.js` that holds
the global functions and variables, `ender.js`: `ender.js` is responsible for the startup and hashchange calls;
It is named `ender` because its location is on the `EOF` and then we have `user-script-id` that simply holds    
the needed strings to make the script a user-script.

`modules/` folder is pretty self explanatory, the trick is understanding how it works:
A module is an `{Object}` that's itself a property of another `{Object}`, which is `tcEasyMode.modules`.
This object needs a few key properties to be called by `init.js` [which is itself started by `ender.js`]
```
    @type {
        {
            name: string,
            code: string,
            description: string,
            enabled: @isModuleEnabled(this.code)|boolean,    common.js holds isModuleEnabled
            [onHashChange: boolean],                         Should anything happen/change to this module if location hash changes?
            [destroy: Function],                             if @destroy() is present when "@onHashChange: true" this function will be run
            isLocation: Function,                            This function requires a return {boolean}
            isPresent: Function,                             This function requires a return {boolean}
            initMod: Function                                Called by "init.js" and @presistentInit calls
        }
    }
```

## `Gruntfile.js` and `grunt/`
`Gruntfile.js` holds 5 important tasks (concat, uglify, stamp, addUserScript and build);    
`contact` simply concatenates all the files into one gigantic file. It does this by    
placing `app/common.js` first, then `app/init.js` followed by all the `.js` files inside    
`app/modules/` and finally `app/ender.js`.    
    
`uglyfy` minifies and uglyfies the code, just so the file size gets to its lower.    
    
`stamp` simply stamps a `console.log()` with the tc-easymode version that reads from `package.json`    
    
`addUserScript` task glues whatever is inside `app/user-script-id` (replacing the     
description and version with those from `app/package.json`.    
    
`build` simply calls all the aforementioned tasks so you don't need to type them.
    
The `grunt/config/` folder is pretty scarce, holding just one tiny configuration file `appGruntConfig.json`    
that's used to configure the paths that the grunt tasks use.
    
```
{
	"path": {
		"userModFile": "app/user-script-id",
		"common": "app/common.js",
		"initFile": "app/init.js",
		"modules": "app/modules/*.js",
		"Ender": "app/ender.js",
		"destination": "Torn_City_Mosh_Mods.user.js"
	}
}
```

## Torn City - Easy Mode (tc-em)
This user-script attempts to make the game a little less all over the place by adding to its UI.

#### Adds to Torn City
- Several automatic clicks
- Bookmark Players
- Listing: Links & Icons
- Listing: Add bulk items
- Connect to Travel Run
- Enable/Disable features

### Requesting features
Open up an issue on this here github and I'll try to make it happen :)
You're free to fork and make pull-requests.
