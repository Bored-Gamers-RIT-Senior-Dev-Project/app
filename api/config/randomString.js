/**
 * Generate a random string of specified length using uppercase letters and digits.
 * @param {number} [length=4] - The length of the random string to generate.
 * @return {string} - The generated random string.
 */
const randomString = (length = 4) => {
    const number = Math.floor(Math.random() * Math.pow(10, length));
    return number.toString().padStart(length, "0");
};
module.exports = randomString;
