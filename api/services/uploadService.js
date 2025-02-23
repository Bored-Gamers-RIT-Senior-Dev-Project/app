const sharp = require("sharp");
const { createHash } = require("node:crypto");

// The maximum length of the longest side of a user-uploaded image, in pixels:
const MAX_LONGEST_SIDE = 1000;

/**
 * Encode image as WEBP, discarding any metadata
 * Also, resize image so that it is at most 1000px on it's longest side
 * @param {Buffer} image an image to attempt to encode
 * @return {Promise<Buffer | null>} The image, encoded as WEBP, or null if it couldn't be converted
 */
const encodeImage = async (image) => {
    try {
        return await sharp(image)
            .resize(MAX_LONGEST_SIDE, MAX_LONGEST_SIDE, {
                fit: "inside",
                withoutEnlargement: true,
            })
            .webp()
            .toBuffer();
    } catch (e) {
        console.warn(e);
        return null;
    }
};

/**
 * Hash a buffer with sha1
 * @param {Buffer} buffer
 * @returns {string} sha1 of the buffer, base64url encoded
 */
const hash = (buffer) => {
    const hash = createHash("sha1");
    hash.update(buffer);
    return hash.digest("base64url");
};

module.exports = { encodeImage, hash };
