const camelCase = require("lodash/camelCase");
const makeObjectCamelCase = (object) => {
    if (!object) return null;

    const newObject = {};

    // If the object is an array, make each entry camel case.
    if (Array.isArray(object)) {
        return object.map((item) => makeObjectCamelCase(item));
    }

    // Loop through each key-value pair in the object
    for (const [key, value] of Object.entries(object)) {
        // Using lodash, convert each key to camelCase.
        const camelCaseKey = camelCase(key);
        // Apply transformation recursively
        let transformedValue = value;
        if (value && typeof value === "object") {
            transformedValue = makeObjectCamelCase(value);
        }

        //Add to new object
        newObject[camelCaseKey] = transformedValue;
    }

    // Return the new object
    // Return the new object
    return newObject;
};

module.exports = { makeObjectCamelCase };
