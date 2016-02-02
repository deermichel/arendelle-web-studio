//
// Standard Arendelle File System Object Model for TypeScript Code Bases
//    Copyright 2016 Kary Foundation, Inc.
//    Author: Pouya Kary <k@karyfoundation.org>
//
var Arendelle;
(function (Arendelle) {
    /* ────────────────────────────────────────────────────────────────────────────────────────── *
     * ::::::::::::::::::::::::::: F I L E   S Y S T E M   O B J E C T :::::::::::::::::::::::::: *
     * ────────────────────────────────────────────────────────────────────────────────────────── */
    /** File and Directory objects shall both extend from this */
    var FileSystemObject = (function () {
        //
        // ─── FUNCS ──────────────────────────────────────────────────────────────────────
        //
        function FileSystemObject(path, name) {
            this.Name = name;
            this.Path = path;
        }
        return FileSystemObject;
    })();
    Arendelle.FileSystemObject = FileSystemObject;
})(Arendelle || (Arendelle = {}));
//
// Standard Arendelle File System Object Model for TypeScript Code Bases
//    Copyright 2016 Kary Foundation, Inc.
//    Author: Pouya Kary <k@karyfoundation.org>
//
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="file-object.ts" />
var Arendelle;
(function (Arendelle) {
    /* ────────────────────────────────────────────────────────────────────────────────────────── *
     * ::::::::::::::::::::::::::::::::::: F I L E   C L A S S :::::::::::::::::::::::::::::::::: *
     * ────────────────────────────────────────────────────────────────────────────────────────── */
    /** Arendele '.space' / '.arendelle' files */
    var File = (function (_super) {
        __extends(File, _super);
        //
        // ─── FUNCS ──────────────────────────────────────────────────────────────────────
        //
        /** Class constructor */
        function File(name, path, content, space) {
            _super.call(this, path, name);
            this.Content = content;
            if (space)
                this.Type = FileType.Space;
            else
                this.Type = FileType.Arendelle;
        }
        /** Generates the full path of the file */
        File.prototype.FullPath = function () {
            return this.Path + '/' + this.Name + this.GetFileTypeEnd();
        };
        /** Get's the file type string for the Arendelle files */
        File.prototype.GetFileTypeEnd = function () {
            if (this.Type == FileType.Space)
                return '.space';
            else
                return '.arendelle';
        };
        return File;
    })(Arendelle.FileSystemObject);
    Arendelle.File = File;
    /* ────────────────────────────────────────────────────────────────────────────────────────── *
     * ::::::::::::::::::::::::::::::::::: F I L E   T Y P E S :::::::::::::::::::::::::::::::::: *
     * ────────────────────────────────────────────────────────────────────────────────────────── */
    (function (FileType) {
        /** Arendelle '.arendelle' blueprit files */
        FileType[FileType["Arendelle"] = 0] = "Arendelle";
        /** Arendelle '.space' stored space files */
        FileType[FileType["Space"] = 1] = "Space";
    })(Arendelle.FileType || (Arendelle.FileType = {}));
    var FileType = Arendelle.FileType;
})(Arendelle || (Arendelle = {}));
//
// Standard Arendelle File System Object Model for TypeScript Code Bases
//    Copyright 2016 Kary Foundation, Inc.
//    Author: Pouya Kary <k@karyfoundation.org>
//
/// <reference path="file.ts" />
/// <reference path="file-object.ts" />
var Arendelle;
(function (Arendelle) {
    /* ────────────────────────────────────────────────────────────────────────────────────────── *
     * :::::::::::::::::::::::::::::: D I R E C T O R Y   C L A S S ::::::::::::::::::::::::::::: *
     * ────────────────────────────────────────────────────────────────────────────────────────── */
    var Directory = (function (_super) {
        __extends(Directory, _super);
        //
        // ─── FUNCS ──────────────────────────────────────────────────────────────────────
        //
        /**
         *  After runnig the constructor add files and sub-directories
         *  via the AppendFileObject function.
         * */
        function Directory(path, name) {
            _super.call(this, path, name);
            this.Contents = [];
        }
        /** Adds files / directories to the directory */
        Directory.prototype.AppendFileObject = function (fileObject) {
            this.Contents.push(fileObject);
        };
        return Directory;
    })(Arendelle.FileSystemObject);
    Arendelle.Directory = Directory;
})(Arendelle || (Arendelle = {}));
