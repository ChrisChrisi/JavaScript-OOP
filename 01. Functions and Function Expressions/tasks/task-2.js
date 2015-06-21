/* Task description */
/*
	Write a function that finds all the prime numbers in a range
		1) it should return the prime numbers in an array
		2) it must throw an Error if any on the range params is not convertible to `Number`
		3) it must throw an Error if any of the range params is missing
*/


function findPrimes(start, end) {
    var i,
        arr = [],
        isPrime = function (number) {
        if (number !== Math.round(number) || number < 2) {
            return false;
        }
        var result = true;
        for (var i = 2; i <= Math.sqrt(number); i++) {
            if (number % i === 0) {
                result = false;
                break;
            }
        }

        return result;
    };
    if(start !== 0 && end !==0 &&( !start || !end)){
        throw Error("Start and end are needed")
    }
    start = +start;
    end = +end;
    if(isNaN(start) || isNaN(end) || (start > end)){
        throw Error("Incorrect start or end value!");
    }

    for(i = start; i<= end; i++){
        arr.push(i);
    }
    return arr.filter(isPrime);

	
}

module.exports = findPrimes;
