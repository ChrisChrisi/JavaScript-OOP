/* Task Description */
/*
	Create a function constructor for Person. Each Person must have:
	*	properties `firstname`, `lastname` and `age`
		*	firstname and lastname must always be strings between 3 and 20 characters, containing only Latin letters
		*	age must always be a number in the range 0 150
			*	the setter of age can receive a convertible-to-number value
		*	if any of the above is not met, throw Error
	*	property `fullname`
		*	the getter returns a string in the format 'FIRST_NAME LAST_NAME'
		*	the setter receives a string is the format 'FIRST_NAME LAST_NAME'
			*	it must parse it and set `firstname` and `lastname`
	*	method `introduce()` that returns a string in the format 'Hello! My name is FULL_NAME and I am AGE-years-old'
	*	all methods and properties must be attached to the prototype of the Person
	*	all methods and property setters must return this, if they are not supposed to return other value
		*	enables method-chaining
*/
function solve() {
	var Person = (function () {
        var validatenames = function(value, name){
            var len;
            if(typeof value !== 'string'){
                throw new Error(name + " should be string!");
            }
            if(!/^[a-zA-Z]+$/.test(value)){
                throw new Error("Only latin letters allowed!");
            }
            len = value.length;
            if(len < 3 || len > 20){
                throw new Error(name + " should be length between 3 and 20 characters!");
            }
        };
        var validateAge = function(age){
            if(isNaN(age)){
                throw new Error("'age' should be a number! ");
            }
            if(age < 0 || age > 150){
                throw new Error("'age' should be a number between 0 and 150!");
            }
        };
		function Person(firstname, lastname, age) {
            if(typeof firstname === 'undefined' || typeof lastname === 'undefined' ||typeof age === 'undefined'){
                throw new Error("Missing firstname, lastname or person!");
            }
            validatenames(firstname, 'firstname');
            validatenames(lastname, 'lastname');
            age = +age;
            validateAge(age);
            this.firstname = firstname;
            this.lastname = lastname;
            this.age = age;
		}

        Object.defineProperty(Person.prototype, 'fullname',
            {
                get: function(){
                    return this.firstname + ' ' + this.lastname;
                },
                set: function(value) {
                    var names = value.split(' ');
                    validatenames(names[0], 'firstname');
                    validatenames(names[1], 'lastname');
                    this.firstname = names[0];
                    this.lastname = names[1];
                }
            });
        Person.prototype.introduce = function(){
            return 'Hello! My name is '+this.fullname+' and I am '+this.age+'-years-old';
        };


        return Person;
	} ());

    return Person;
}
module.exports = solve;