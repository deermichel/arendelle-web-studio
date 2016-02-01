var Arendelle;(function(Arendelle){var FileSystemObject=function(){function FileSystemObject(path,name){this.Name=name;this.Path=path}return FileSystemObject}();Arendelle.FileSystemObject=FileSystemObject})(Arendelle||(Arendelle={}));var __extends=this.__extends||function(d,b){for(var p in b)if(b.hasOwnProperty(p))d[p]=b[p];function __(){this.constructor=d}__.prototype=b.prototype;d.prototype=new __};var Arendelle;(function(Arendelle){var File=function(_super){__extends(File,_super);function File(name,path,content,space){_super.call(this,path,name);this.Content=content;if(space)this.Type=FileType.Space;else this.Type=FileType.Arendelle}File.prototype.FullPath=function(){return this.Path+"/"+this.Name+this.GetFileTypeEnd()};File.prototype.GetFileTypeEnd=function(){if(this.Type==FileType.Space)return".space";else return".arendelle"};return File}(Arendelle.FileSystemObject);Arendelle.File=File;(function(FileType){FileType[FileType["Arendelle"]=0]="Arendelle";FileType[FileType["Space"]=1]="Space"})(Arendelle.FileType||(Arendelle.FileType={}));var FileType=Arendelle.FileType})(Arendelle||(Arendelle={}));var Arendelle;(function(Arendelle){var Directory=function(_super){__extends(Directory,_super);function Directory(path,name){_super.call(this,path,name)}Directory.prototype.AppendFileObject=function(fileObject){this.Contents.push(fileObject)};return Directory}(Arendelle.FileSystemObject);Arendelle.Directory=Directory})(Arendelle||(Arendelle={}));