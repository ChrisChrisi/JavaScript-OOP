/* Task Description */
/* 
	Write a function that sums an array of numbers:
		numbers must be always of type Number
		returns `null` if the array is empty
		throws Error if the parameter is not passed (undefined)
		throws if any of the elements is not convertible to Number	

*/

function sum(arr) {
	if(!Array.isArray(arr)){
        throw Error("The first parameter should be array")
    }
    if(arr.length ===0){
        return null;
    }
    result = arr.reduce(function(a, b){
        b = +b;
        if(isNaN(b)){
            throw Error("All parameters of the array should be numbers!");
        }
        return a+b;

    }, 0);
    return result;
}

module.exports = sum;
