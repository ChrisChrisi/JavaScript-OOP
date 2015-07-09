function solve() {
    var constants = {
        STRING_MIN_VALUE: 3,
        STRING_MAX_VALUE: 25,
        IMDB_MIN_RATING: 1,
        IMDB_MAX_RATING: 5
    };
    var orderBy = function(prop1, prop2){
        return function(item1, item2){
            if(item1[prop1] < item2[prop1]){
                return -1;
            }
            if(item1[prop1] > item2[prop1]){
                return 1;
            }
            if(item1[prop2] < item2[prop2]){
                return -1;
            } else{
                return 1;
            }
        };
    };
    var validator = {
        validateIfUndefined: function (value, name) {
            name = name || 'Value';
            if (typeof  value === 'undefined') {
                throw new Error(name + ' should not be undefined.');
            }
        },
        validateIfOfType: function (value, type, name) {
            name = name || 'Value';
            if (typeof  value !== type) {
                throw new Error(name + ' should be  of type ' + type);
            }
        },
        validateString: function (value, name) {
            var valLength;
            name = name || 'Value';
            this.validateIfUndefined(value, name);
            this.validateIfOfType(value, 'string', name);
            valLength = value.length;
            if (valLength < constants.STRING_MIN_VALUE
                || valLength > constants.STRING_MAX_VALUE) {
                throw new Error(name + ' length should be between '
                + constants.STRING_MIN_VALUE + ' and ' + constants.STRING_MAX_VALUE);
            }
        },
        validateId: function (value, name) {
            name = name || 'Value';
            this.validateIfUndefined(value, name);
            this.validateIfOfType(value, 'number', name);
            if (value < 1) {
                throw new Error(name + ' should be positive');
            }
        },
        validateImdbRating: function (value) {
            var name = 'IMDB rating ';
            this.validateIfUndefined(value, name);
            this.validateId(value, name);
            if (value > 5) {
                throw new Error(name + ' should be less than 5');
            }

        },
        validateIfPlayable: function (playable) {
            if (typeof playable.id === 'undefined') {
                throw new Error("Invalid playable.");
            }
        },
        validateIfPlaylist: function (playable) {
            if (typeof playable.id === 'undefined') {
                throw new Error("Invalid playlist.");
            }
        }
    };
    var player = (function () {
        var lastId = 0,
            player = {};
        Object.defineProperties(player, {
            'init': {
                value: function (name) {
                    this._id = lastId += 1;
                    this.name = name;
                    this.playlists = [];
                    return this;
                }
            },
            'id': {
                get: function () {
                    return this._id;
                }
            },
            'name': {
                get: function () {
                    return this._name;
                },
                set: function (newName) {
                    validator.validateString(newName, 'player title');
                    this._name = newName;
                }
            },
            'addPlaylist': {
                value: function (playlist) {
                    validator.validateIfPlaylist(playlist);
                    this.playlists.push(playlist);
                    return this;
                }
            },
            'getPlaylistById' : {
                value: function(id){
                    var playlist = null;
                    this.playlists.some(function(item){
                        if(item.id == id){
                            playlist = item;
                            return true;
                        }
                    });
                    return playlist;
                }
            },
            'getPlaylistId':{
                value:function(item){
                    var id = -1,
                        playlist = null;
                    if(typeof item === 'number'){
                        id = item;
                    } else {
                        this.playlists.some(function(elem){
                            if(elem.id == item.id){
                                id = elem.id;
                                return true;
                            }
                        });
                    }
                    playlist = this.getPlaylistById(id);
                    if(playlist == null){
                        throw new Error("Invalid playable id")
                    }

                    return id;
                }
            },
            removePlaylist:{
                value: function(item){
                    var id = this.getPlaylistId(item);
                    var index = -1;
                    this.playlists.some(function(elem, i){
                        if(elem.id == id){
                            index = i;
                            return true;
                        }
                    });
                    this.playlists.splice(index, 1);
                    return this;
                }
            },
            'listPlaylists':{
                value: function(page, size){
                    validator.validateIfOfType(page,'number', 'player page');
                    if(page < 0){
                        throw new Error("Invalid player page");
                    }
                    validator.validateId(size, 'player size');
                    if(this.playlists.length < page*size){
                        throw new Error("Invalid page and size!");
                    }

                    var copyPlaylists = this.playlists.slice();
                    copyPlaylists = copyPlaylists.sort(orderBy('name', 'id' ));
                    return copyPlaylists.splice(page * size, size);

                }
            },
            'contains':{
                value: function(playable, playlist){
                    this.getPlaylistId(playlist);
                    return playlist.playables.some(function(pl){
                        return pl == playable;
                    });
                }
            },
            'search':{
                value: function(pattern){
                    pattern = pattern.toLocaleLowerCase();
                    var result = [];
                    this.playlists.every(function(playlist){
                        return playlist.playables.some(function(playable){
                           if(playable.title.toLocaleLowerCase().indexOf(pattern) > -1 ){
                               result.push(playlist);
                               return true;
                           }
                        });
                    });
                    return result;
                }
            }
        });
        return player;
    }());
    var playlist = (function () {
        var lastId = 0,
            playlist = {};
        Object.defineProperties(playlist, {
            'init': {
                value: function (name) {
                    this._id = lastId += 1;
                    this.name = name;
                    this.playables = [];
                    return this;
                }
            },
            'id': {
                get: function () {
                    return this._id;
                }
            },
            'name': {
                get: function () {
                    return this._name;
                },
                set: function (newName) {
                    validator.validateString(newName, 'Playlist title');
                    this._name = newName;
                }
            },
            'addPlayable': {
                value: function (playable) {
                    validator.validateIfPlayable(playable);
                    this.playables.push(playable);
                    return this;
                }
            },
            'getPlayableById' : {
                value: function(id){
                    var playable = null;
                    this.playables.some(function(item){
                        if(item.id == id){
                            playable = item;
                            return true;
                        }
                    });
                    return playable;
                }
            },
            'getPlayableId':{
                value:function(item){
                    var id = -1,
                        playable = null;
                    if(typeof item === 'number'){
                        id = item;
                    } else {
                        this.playables.some(function(elem){
                            if(elem.id == item.id){
                                id = elem.id;
                                return true;
                            }
                        });
                    }
                    playable = this.getPlayableById(id);
                    if(playable == null){
                        throw new Error("Invalid playable id")
                    }

                    return id;
                }
            },
            removePlayable:{
                value: function(item){
                    var id = this.getPlayableId(item);
                    var index = -1;
                    this.playables.some(function(elem, i){
                        if(elem.id == id){
                            index = i;
                            return true;
                        }
                    });
                    this.playables.splice(index, 1);
                    return this;
                }
            },
            'listPlayables':{
                value: function(page, size){
                    validator.validateIfOfType(page,'number', 'Playlist page');
                    if(page < 0){
                        throw new Error("Invalid playlist page");
                    }
                    validator.validateId(size, 'Playlist size');
                    if(this.playables.length < page*size){
                        throw new Error("Invalid page and size!");
                    }

                    var copyPlaylist = this.playables.slice();
                    copyPlaylist = copyPlaylist.sort(orderBy('title', 'id' ));
                    return copyPlaylist.splice(page * size, size);

                }
            }
        });
        return playlist;
    }());

    var playable = (function () {
        var lastId = 0,
            playable = {
                init: function (title, author) {
                    this._id = lastId += 1;
                    this.title = title;
                    this.author = author;
                    return this;
                },
                get id() {
                    return this._id;
                },
                get title() {
                    return this._title;
                },
                set title(newTitle) {
                    validator.validateString(newTitle, 'Playable title');
                    this._title = newTitle;
                },
                get author() {
                    return this._author;
                },
                set author(newAuthor) {
                    validator.validateString(newAuthor, 'Playable author');
                    this._author = newAuthor;
                },
                play: function () {
                    return this.id + '. ' + this.title + ' - ' + this.author;
                }
            };
        return playable
    }());

    var audio = (function (parent) {
        var audio = Object.create(parent);
        Object.defineProperty(audio, 'init', {
            value: function (title, author, length) {
                parent.init.call(this, title, author);
                this.length = length;
                return this;
            }
        });
        Object.defineProperty(audio, 'length', {
            get: function () {
                return this._length;
            },
            set: function (newLength) {
                validator.validateId(newLength, 'Audio length');
                this._length = newLength;
            }
        });
        Object.defineProperty(audio, 'play', {
            value: function () {
                return parent.play.call(this) + ' - ' + this.length;
            }
        });
        return audio;
    }(playable));
    var video = (function (parent) {
        var video = Object.create(parent);
        Object.defineProperty(video, 'init', {
            value: function (title, author, imdbRating) {
                parent.init.call(this, title, author);
                this.imdbRating = imdbRating;
                return this;
            }
        });
        Object.defineProperty(video, 'imdbRating', {
            get: function () {
                return this._imdbRating;
            },
            set: function (newImdbRating) {
                validator.validateImdbRating(newImdbRating);
                this._imdbRating = newImdbRating;
            }
        });
        Object.defineProperty(video, 'play', {
            value: function () {
                return parent.play.call(this) + ' - ' + this.imdbRating;
            }
        });
        return video;
    }(playable));

    var module = {
        getPlayer: function (name) {
            return Object.create(player).init(name);
        },
        getPlaylist: function (name) {
            return Object.create(playlist).init(name);
        },
        getAudio: function (title, author, length) {
            return Object.create(audio).init(title, author, length);
        },
        getVideo: function (title, author, imdbRating) {
            return Object.create(video).init(title, author, imdbRating)
        }
    };
    return module;
};

//var player = solve();
//var playable1 = player.getVideo("ala", 'bala', 4);
//var playable2 = player.getVideo("tree", '1bala', 4);
//var playable3 = player.getVideo("fog", '2bala', 2);
//var playable4 = player.getVideo("fog", '2bala', 2);
//var playlist = player.getPlaylist("playlist 1").addPlayable(playable1).addPlayable(playable2).addPlayable(playable3);
////
////console.log(playlist.listPlayables(0,2));
////
////console.log(playlist.name);
//var playlist1 = player.getPlaylist("one");
//var playlist2 = player.getPlaylist("two");
//var playlist3 = player.getPlaylist("three");
//var pl = player.getPlayer("aaaa").addPlaylist(playlist).addPlaylist(playlist1).addPlaylist(playlist3);
//console.log(pl.listPlaylists(0,10));
////console.log(pl.contains(playable4, playlist));
//////console.log(pl.search('tdwasdre'));
//////console.log(pl.getPlaylistById(2));
//////console.log(pl.playlists);
module.exports = solve;