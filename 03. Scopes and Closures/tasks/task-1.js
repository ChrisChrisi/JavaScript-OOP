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

    var filerBy = function (objs, property, value) {
        function hasValue(value) {
            return function (element) {
                return element[property] === value;
            }
        }

        return objs.filter(hasValue(value));
    };
    var library = (function () {
        var books = [];
        var categories = [];
        function clone(obj) {
            if(obj === null || typeof(obj) !== 'object' || 'isActiveClone' in obj)
                return obj;

            var temp = obj.constructor(); // changed

            for(var key in obj) {
                if(Object.prototype.hasOwnProperty.call(obj, key)) {
                    obj['isActiveClone'] = null;
                    temp[key] = clone(obj[key]);
                    delete obj['isActiveClone'];
                }
            }

            return temp;
        }
        function listBooks(filter) {
            var result = clone(books);
            if (typeof filter === 'undefined') {
                return books;
            }

            if(filter.hasOwnProperty("category")){
                result = filerBy(result, "category", filter.category);
            }

            if(filter.hasOwnProperty("author")){
                result = filerBy(result, "author", filter.author);
            }

            if(filter.hasOwnProperty("title")){
                result = filerBy(result, "title", filter.author);
            }

            return result;
        }

        var validateLength = function (value) {
            value = value.toString();
            var len = value.length;
            if (len < 2 || len > 100) {
                throw new Error("The length should be between 2 and 100");
            }
        };

        function addBook(book) {
            function validateBook(book) {
                if (typeof book != "object") {
                    throw new Error("The book should be object.");
                }
                if (!book.hasOwnProperty('title') || !book.hasOwnProperty('author') || !book.hasOwnProperty('isbn') || !book.hasOwnProperty('category')) {
                    throw new Error("The book should have title, category, author and isbn");
                }
                if (books.some(function (b) {
                        return b.title + b.author + b.isbn === book.title + book.author + book.isbn;
                    })) {
                    throw new Error("There is another book with the same title author and isbn.");
                }
                if (books.some(function (b) {
                        return b.title === book.title;
                    })) {
                    throw new Error("There is another book with the same title.");
                }
                if (books.some(function (b) {
                        return b.isbn === book.isbn;
                    })) {
                    throw new Error("There is another book with the same isbn.");
                }
                if (!book.author) {
                    throw new Error("Too short author name.")
                }
                if (book.author.trim().length < 1) {
                    throw new Error("Too short author name.")
                }
                if(!isFinite(+book.isbn)){
                    throw  new Error('The isbn must be a number!');
                }
                if(isNaN(+book.isbn)){
                    throw new Error("The isbn should contain only digits");
                }
                var isblen = book.isbn.toString().length;
                if (isblen !== 10 && isblen !== 13) {
                    console.log(book.isbn.toString().length);
                    throw new Error("The isbn should be 10 or 13 digits");
                }
            }

            validateBook(book);
            validateLength(book.title);
            validateLength(book.category);
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
};
//lib = solve();
//lib.books.add({
//    title: "Priklicheniqta na Pesho",
//    author: "Pesho",
//    category: "prikliuchenska",
//    isbn: 1234567890
//});
//lib.books.add({
//    title: "Priklicheniqta na Pesho2",
//    author: "Pesho",
//    category: "prikliuchenska",
//    isbn: 1234577890
//});
//console.log(lib.categories.list());
module.exports = solve;