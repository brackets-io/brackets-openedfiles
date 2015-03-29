define(function(require, exports, module) {
    "use strict";

    var COMMAND_ID = "workingfiles.openfolder";

    var CommandManager = brackets.getModule("command/CommandManager"),
        DocumentManager = brackets.getModule("document/DocumentManager"),
        ProjectManager = brackets.getModule("project/ProjectManager"),
        PreferencesManager = brackets.getModule("preferences/PreferencesManager"),
        AppInit = brackets.getModule("utils/AppInit"),
        Menus = brackets.getModule("command/Menus"),
        FileUtils = brackets.getModule("file/FileUtils");

    function openDocumentFolder() {
        var doc = DocumentManager.getCurrentDocument();
        var path = doc.file.fullPath;
        if (!ProjectManager.isWithinProject(path)) {
            var dir = FileUtils.getDirectoryPath(path);
            ProjectManager.openProject(dir);
        }
    }

    CommandManager.register("Open Document Folder", COMMAND_ID, openDocumentFolder);

    var menu = Menus.getMenu(Menus.AppMenuBar.FILE_MENU);
    menu.addMenuDivider();
    menu.addMenuItem(COMMAND_ID, [{
        "key": "Ctrl-Shift-O"
    }, {
        "key": "Cmd-Shift-O",
        "platform": "mac"
    }]);

    function removeViewState() {
        var VIEWSTATE_ID = "mainView.state",
            _getViewState = PreferencesManager.getViewState;

        PreferencesManager.getViewState = function(id, context) {
            var state = _getViewState(id, context);
            if (id === VIEWSTATE_ID) {
                state.panes = {};
            }
            return state;
        };
    }

    AppInit.extensionsLoaded(removeViewState);

});