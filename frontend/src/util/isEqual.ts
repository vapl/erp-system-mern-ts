function isEqual(obj1: any, obj2: any): boolean {
    // Check if both objects are of type object
    if (typeof obj1 !== 'object' || typeof obj2 !== 'object') {
        return false;
    }

    // Get the keys of the objects
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    // Check if the number of keys is the same
    if (keys1.length !== keys2.length) {
        return false;
    }

    // Iterate through the keys and compare the values recursively
    for (const key of keys1) {
        const val1 = obj1[key];
        const val2 = obj2[key];

        // If the values are objects, recursively compare them
        if (typeof val1 === 'object' && typeof val2 === 'object') {
            if (!isEqual(val1, val2)) {
                return false;
            }
        } else {
            // Otherwise, compare the values
            if (val1 !== val2) {
                return false;
            }
        }
    }

    // If all comparisons pass, the objects are equal
    return true;
}

export default isEqual;