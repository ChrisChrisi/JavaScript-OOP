/* Task Description */
/* 
 *	Create a module for working with books
 *	The module must provide the following functionalities:
 *	Add a new book to category
 *	Each book has unique title, author and ISBN
 *	It must return the newly created book with assigned ID
 *	If the category is missing, it must be automatically created
 *	List all books
 *	Books are sorted by ID
 *	This can be done by author, by category or all
 *	List all categories
 *	Categories are sorted by ID
 *	Each book/catagory has a unique identifier (ID) that is a number greater than or equal to 1
 *	When adding a book/category, the ID is generated automatically
 *	Add validation everywhere, where possible
 *	Book title and category name must be between 2 and 100 characters, including letters, digits and special characters ('!', ',', '.', etc)
 *	Author is any non-empty string
 *	Unique params are Book title and Book ISBN
 *	Book ISBN is an unique code that contains either 10 or 13 digits
 *	If something is not valid - throw Error
 */
function solve() {
    function clone(obj) {
        if (obj === null || typeof(obj) !== 'object' || 'isActiveClone' in obj)
            return obj;
        var temp = obj.constructor(); // changed
        for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                obj['isActiveClone'] = null;
                temp[key] = clone(obj[key]);
                delete obj['isActiveClone'];
            }
        }
        return temp;
    }

    var library = (function () {
        var checkUniqueness = function (objects, property, object) {
            var msg,
                unique = !objects.some(function (obj) {
                    return obj[property] === object[property];
                });
            if (!unique) {
                msg = property + ' should be unique!';
                throw new Error(msg);
            }
        };

        var checkLength = function (elem, prop) {
            var msg,
                len = elem.length;
            if (len < 2 || len > 100) {
                msg = prop + ' should be with length between 2 and 100 characters';
                throw new Error(msg);
            }
        };
        var filterByProperty = function (objects, property, value) {
            function filterFunc(property, value) {
                return function (element) {
                    return element[property] === value;
                }
            }

            return objects.filter(filterFunc(property, value));
        };
        var books = [];
        var categories = [];

        function listBooks(filters) {
            var result;
            if (typeof filters === 'undefined') {
                return books;
            }
            if(typeof  filters !== 'object'){
                throw new Error("Invalid argument");
            }
            result = clone(books);
            for(property in filters){
                result = filterByProperty(result, property, filters[property]);
            }

            return result;
        }

        function addBook(book) {
            var isbn_len;
            checkUniqueness(books, 'title', book);
            checkUniqueness(books, 'isbn', book);
            if (!book.hasOwnProperty('author') || !book.hasOwnProperty('title') || !book.hasOwnProperty('category') || !book.hasOwnProperty('isbn')) {
                throw new Error('Each book should have author, title, category and isbn!');
            }
            checkLength(book.title, 'title');
            checkLength(book.category, 'category');
            if (isNaN(+book.isbn)) {
                throw new Error("The isbn should contain only digits!");
            }
            isbn_len = book.isbn.toString().length;
            if ([10, 13].indexOf(isbn_len) < 0) {
                throw new Error("The isb length should be 10 or 13 digits!");
            }
            if(typeof book.author !== 'string'){
                throw new Error('Invalid author name');
            }
            if (book.author.toString().length < 1) {
                throw new Error("Too short author name");
            }
            if (categories.indexOf(book.category) < 0) {
                categories.push(book.category);
            }
            book.ID = books.length + 1;
            books.push(book);
            return book;
        }

        function listCategories() {
            return categories;
        }

        return {
            books: {
                list: listBooks,
                add: addBook
            },
            categories: {
                list: listCategories
            }
        };
    }());
    return library;
}
module.exports = solve;
