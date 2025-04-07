const camelCase = require("lodash/camelCase");
const makeObjectCamelCase = (object) => {
    if (!object) return null;

    // If the object is a Date, return it directly (or format it as a string)
    if (object instanceof Date) {
        return object; // Or return object.toISOString() or a custom format
    }

    const newObject = {};

    // If the object is an array, make each entry camel case.
    if (Array.isArray(object)) {
        return object.map((item) => makeObjectCamelCase(item));
    }

    // Loop through each key-value pair in the object
    for (const [key, value] of Object.entries(object)) {
        // Using lodash, convert each key to camelCase.
        const camelCaseKey = camelCase(key);

        // Apply transformation recursively, but skip Date objects
        let transformedValue = value;
        if (value && typeof value === "object" && !(value instanceof Date)) {
            transformedValue = makeObjectCamelCase(value);
        }

        //Add to new object
        newObject[camelCaseKey] = transformedValue;
    }

    return newObject;
};

module.exports = { makeObjectCamelCase };
