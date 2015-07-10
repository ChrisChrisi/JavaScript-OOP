function solve() {
    var module = (function () {
        var constants = {
            ITEM_NAME_MIN_VALUE: 2,
            ITEM_NAME_MAX_VALUE: 40,
            BOOK_GENRE_MIN_VALUE: 2,
            BOOK_GENRE_MAX_VALUE: 20,
            MEDIA_RATING_MIN_VALUE: 1,
            MEDIA_RATING_MAX_VALUE: 5
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
            validateString: function (value, min, max, name) {
                var valLength;
                name = name || 'Value';
                this.validateIfUndefined(value, name);
                this.validateIfOfType(value, 'string', name);
                valLength = value.length;
                if (valLength < min
                    || valLength > max) {
                    throw new Error(name + ' length should be between '
                    + min + ' and ' + max);
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
            validateISBN: function (isbn) {
                if (isNaN(isbn)) {
                    throw new Error("The isbn should contain only digits!");
                }
                var isbn_len = isbn.toString().length;
                if ([10, 13].indexOf(isbn_len) < 0) {
                    throw new Error("The isb length should be 10 or 13 digits!");
                }
            },
            validateItem: function (item) {
                if (typeof item !== 'object' ||
                    typeof item.id === 'undefined'||
                    typeof item.name === 'undefined'||
                    typeof item.description === 'undefined'
                ) {
                    throw new Error("Invalid Item!");
                }
            },
            validateBook: function(book){
                if ( typeof book.isbn === 'undefined' ||
                    typeof book.genre === 'undefined'
                ) {
                    throw new Error("Invalid Book!");
                }
            },
            validateMedia: function(media){
                if ( typeof media.rating === 'undefined' ||
                    typeof media.duration === 'undefined'
                ) {
                    throw new Error("Invalid Book!");
                }
            },
            validateFindKeys: function(object, allowed){

                var keys = Object.keys(object);
                keys.some(function(key){
                    if(allowed.indexOf(key) < 0){
                        console.log(key);
                        throw new Error("Invalid options");
                        return true;
                    }
                });
            }
        };
        var item = (function () {
            var lastId = 0,
                item = {};
            Object.defineProperties(item, {
                'init': {
                    value: function (name, description) {
                        this._id = lastId += 1;
                        this.name = name;
                        this.description = description;
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
                        validator.validateString(newName, constants.ITEM_NAME_MIN_VALUE, constants.ITEM_NAME_MAX_VALUE, 'Item name');
                        this._name = newName;
                    }
                },
                'description': {
                    get: function(){
                        return this._desription;
                    },
                    set: function(newDescription){
                        validator.validateIfOfType(newDescription, 'string', 'Item description');
                        if (newDescription.length < 1) {
                            throw new Error('The item description should be non empty string');
                        }
                        this._desription = newDescription;
                    }
                }
            });
            return item;
        }());
        var book = (function (parent) {
            var book = Object.create(parent);
            Object.defineProperties(book, {
                'init': {
                    value: function (name, isbn, genre, description) {
                        parent.init.call(this, name, description);
                        this.isbn = isbn;
                        this.genre = genre;
                        return this;
                    }
                },
                'isbn': {
                    get: function () {
                        return this._isbn;
                    },
                    set: function (newISBN) {
                        validator.validateISBN(newISBN);
                        this._isbn = newISBN;
                    }
                },
                'genre': {
                    get: function () {
                        return this._genre;
                    },
                    set: function (newGenre) {
                        validator.validateString(newGenre, constants.BOOK_GENRE_MIN_VALUE, constants.BOOK_GENRE_MAX_VALUE, 'Book genre');
                        this._genre = newGenre;
                    }
                }
            });
            return book;

        }(item));
        var media = (function (parent) {
            var media = Object.create(parent);
            Object.defineProperties(media, {
                'init': {
                    value: function (name, rating, duration, description) {
                        parent.init.call(this, name, description);
                        this.rating = rating;
                        this.duration = duration;
                        return this;
                    }
                },
                'rating': {
                    get: function () {
                        return this._rating;
                    },
                    set: function (newRating) {
                        validator.validateIfOfType(newRating, 'number', 'Media rating');
                        if (newRating < constants.MEDIA_RATING_MIN_VALUE || newRating > constants.MEDIA_RATING_MAX_VALUE) {
                            throw new Error("Media rating should be a number between " + constants.MEDIA_RATING_MIN_VALUE + ' and ' + constants.MEDIA_RATING_MAX_VALUE);
                        }
                        this._rating = newRating;
                    }
                },
                'duration': {
                    get: function () {
                        return this._duration;
                    },
                    set: function (newDuration) {
                        validator.validateIfOfType(newDuration, 'number', 'Media duration');
                        if (newDuration <= 0) {
                            throw new Error("Invalid media duration");
                        }
                        this._duration = newDuration;
                    }
                }
            });
            return media;

        }(item));
        var catalog = (function () {
            var lastId = 0;
            var catalog = {};
            Object.defineProperties(catalog, {
                'init': {
                    value: function (name) {
                        this._id = lastId += 1;
                        this.name = name;
                        this.items = [];
                    }
                },
                'name': {
                    get: function () {
                        return this._name;
                    },
                    set: function (newName) {
                        validator.validateString(newName, constants.ITEM_NAME_MIN_VALUE, constants.ITEM_NAME_MAX_VALUE, 'Catalog name');
                        this._name = newName;
                    }
                },
                'id':{
                  get: function(){
                      return this._id;
                  }
                },
                'add': {
                    value: function () {
                        if (arguments.length < 1) {
                            throw  new Error("Catalog items to add should not be empty");
                        }
                        var toAdd;
                        if (Array.isArray(arguments[0]) && arguments.length === 1) {
                            if (arguments[0].length < 1) {
                                throw  new Error("Catalog items to add should not be empty");
                            }
                            toAdd = arguments[0];
                        } else {
                            toAdd = [];
                            var arg;
                            for (arg in arguments) {
                                toAdd.push(arguments[arg]);
                            }
                        }
                        for (arg in toAdd) {
                            validator.validateItem(toAdd[arg]);
                        }
                        this.items = this.items.concat(toAdd);
                        return this;
                    }
                },
                'find': {
                    value: function (elem) {
                        var result;
                        if (typeof elem !== 'number' && typeof elem !== 'object') {
                            throw new Error("Catalog id passed to find should be number");
                        }
                        if (typeof elem === 'number') {
                            var id = elem;
                            result = null;
                            this.items.some(function (el) {
                                if (el.id === id) {
                                    result = el;
                                    return true;
                                }
                            });
                            return result;
                        } else if(typeof elem === 'object') {
                            result = [];
                           for(var i in this.items){
                               var cur = this.items[i];
                               var isIn = true;
                              for(var j in elem){
                                  if(elem[j] !== cur[j]){
                                      isIn = false;
                                      break;
                                  }

                              }
                               if(isIn === true){
                                   result.push(cur);
                               }

                           }

                            return result;
                        }
                    }
                },
                'search': {
                    value: function(elem){
                        validator.validateIfOfType(elem, 'string', 'Pattern');
                        if(elem.length < 1){
                            throw new Error("Too short pattern");
                        }
                        elem = elem.toLowerCase();

                            var result = [];
                            this.items.forEach(function(el){
                                var curName = el.name;
                                if (curName.toLowerCase().indexOf(elem) > -1 || el.description.toLowerCase().indexOf(elem) > -1 ) {
                                    result.push(el);
                                }
                            });
                            return result;

                    }
                }
            });
            return catalog;
        }());
        var bookCatalog = (function(parent){
            var bookCatalog = Object.create(parent);
            Object.defineProperties(bookCatalog, {
                'init': {
                    value: function(name){
                        parent.init.call(this, name);
                        return this;
                    }
                },
                'add': {
                    value: function(){
                        if(arguments.length < 0){
                            throw  new Error(" No books to add");
                        }
                        if(arguments.length === 1 && Array.isArray(arguments[0])){
                            arguments[0].forEach(function(arg){
                                validator.validateBook(arg);
                            })
                        } else {
                            var ii;
                            for(ii in arguments){
                                validator.validateBook(arguments[ii]);
                            }
                        }
                        parent.add.apply(this, arguments);
                        return this;
                    }
                },
                'find': {
                    value: function(elem){
                        if(!elem || elem == null){
                            throw new Error();
                        }
                        if(typeof  elem !== 'object' && typeof elem !== 'number'){
                            throw Error('Invalid params');
                        }
                        if(typeof elem === 'object'){
                            validator.validateFindKeys(elem, ['id', 'name', 'genre']);
                        }

                        return parent.find.call(this, elem);
                    }
                },
                'search':{
                    value: function(elem){
                        return parent.search.apply(this, arguments);
                    }
                },
                'getGenres' : {
                    value: function(){
                        var result = [];
                        this.items.forEach(function(book){
                            var cur = book.genre.toLowerCase();
                            if(result.indexOf(cur) < 0){
                                result.push(cur);
                            }
                        });
                        return result;
                    }
                }
            });
            return bookCatalog;

        }(catalog));
        var mediaCatalog = (function(parent){
            var mediaCatalog = Object.create(parent);
            Object.defineProperties(mediaCatalog, {
                'init': {
                    value: function(name){
                        parent.init.call(this, name);
                        return this;
                    }
                },
                'add': {
                    value: function(){
                        if(arguments.length < 0){
                            throw  new Error(" No Media to add");
                        }
                        if(arguments.length === 1 && Array.isArray(arguments[0])){
                            arguments[0].forEach(function(arg){
                                validator.validateMedia(arg);
                            })
                        } else {
                            var ii;
                            for(ii in arguments){
                                validator.validateMedia(arguments[ii]);
                            }
                        }
                        parent.add.apply(this, arguments);
                        return this;
                    }
                },
                'getTop':{
                    value: function(count){
                        validator.validateId(count, 'Media catalog top count value');
                        var sortFunc = function(item1, item2){
                            if(item1.rating < item2.rating){
                                return 1
                            } else {
                                return -1;
                            }
                        };

                        var mapFunc = function(object){
                            return {"id": object.id,"name": object.name};
                        };

                        var copy = this.items.slice();
                        return copy.sort(sortFunc).map(mapFunc).splice(0,count);
                    }
                },
                'find': {
                    value: function(elem){
                        if(!elem || elem == null){
                            throw new Error();
                        }
                        if(typeof  elem !== 'object' && typeof elem !== 'number'){
                            throw new Error('Invalid params');
                        }
                        if(typeof elem === 'object'){
                            //name, rating, duration, description
                            validator.validateFindKeys(elem, ['id', 'name', 'rating', 'duration', 'description']);
                        }

                        return parent.find.call(this, elem);
                    }
                },
                'getSortedByDuration':{
                    value: function(){
                        var copy = this.items.slice();
                        var softFunc = function(i, j){
                            if(i.duration < j.duration){
                                return 1;
                            }
                            if(i.duration > j.duration){
                                return -1;
                            } else{
                                if(i.id < j.id){
                                    return -1;
                                } else {
                                    return 1;
                                }
                            }
                        };
                        return copy.sort(softFunc);
                    }
                }
            });
            return mediaCatalog;

        }(catalog));
        return {
            getBook: function (name, isbn, genre, description) {
                return Object.create(book).init(name, isbn, genre, description);
            },
            getMedia: function (name, rating, duration, description) {
                return Object.create(media).init(name, rating, duration, description);
            },
            getBookCatalog: function (name) {
                return Object.create(bookCatalog).init(name)
            },
            getMediaCatalog: function (name) {
                return Object.create(mediaCatalog).init(name)
            }
        };
    }());

    return module;
}

module.exports = solve;