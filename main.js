define(function(require, exports, module) {
    "use strict";

    var COMMAND_ID = "workingfiles.openfolder",
        VIEWSTATE_ID = "mainView.state";

    var CommandManager = brackets.getModule("command/CommandManager"),
        DocumentManager = brackets.getModule("document/DocumentManager"),
        ProjectManager = brackets.getModule("project/ProjectManager"),
        PreferencesManager = brackets.getModule("preferences/PreferencesManager"),
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

    function closeAllOpenedDocuments() {
        var projectRoot = ProjectManager.getProjectRoot();
        var context = {
            location: {
                scope: "user",
                layer: "project",
                layerID: projectRoot.fullPath
            }
        };
        var state = PreferencesManager.getViewState(VIEWSTATE_ID, context);
        state.panes = {};
        PreferencesManager.setViewState(VIEWSTATE_ID, state, context);
    }

    $(ProjectManager).on("projectClose", closeAllOpenedDocuments);

});