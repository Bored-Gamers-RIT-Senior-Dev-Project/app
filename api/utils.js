const _ = require("lodash");
const makeObjectCamelCase = (object) => {
    const newObject = {};

    //Loop through each object value
    for (let [key, value] of Object.entries(object)) {
        //Using lodash, update each key to camelCase.
        key = _.camelCase(key);

        //Apply recursively
        if (value && typeof value === "object") {
            value = makeObjectCamelCase(value);
        }

        //Add to new object
        newObject[key] = value;
    }

    //Return the new object
    return newObject;
};

module.exports = { makeObjectCamelCase };
