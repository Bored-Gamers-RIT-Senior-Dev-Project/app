const sharp = require("sharp");
const { createHash } = require("node:crypto");
const fs = require("node:fs/promises");

// The maximum length of the longest side of a user-uploaded image, in pixels:
const MAX_LONGEST_SIDE = 1000;
// The directory to where images are stored
const USER_IMAGE_DIRECTORY = __dirname + "/../user-images/";
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
 * Hash a buffer with sha1 (not for cryptographic purposes, intended just to
 * tell if two files are the same).
 * @param {Buffer} buffer
 * @returns {string} sha1 of the buffer, base64url encoded
 */
const hash = (buffer) => {
    const hash = createHash("sha1");
    hash.update(buffer);
    return hash.digest("base64url");
};

/**
 * Save an image to the disk
 * @param {string} name the name of the image
 * @param {Buffer} image a buffer containing the image data
 */
const saveImage = async (name, image) => {
    if (image.byteLength > 1e6) {
        console.warn(
            `saveImage: Image ${name} is very large! ${image.byteLength} bytes!`
        );
    }
    await fs.mkdir(USER_IMAGE_DIRECTORY, {
        recursive: true,
        mode: 0o755,
    });
    const path = USER_IMAGE_DIRECTORY + name;
    await fs.writeFile(path, image, {
        mode: 0o644,
    });
};

const test = async () => {
    // TODO: Delete me, also, real unit testing
    const jpeg = await fs.readFile(__dirname + "/test.jpg");
    const webp = await encodeImage(jpeg);
    const h = hash(webp);
    saveImage(`${h}.webp`, webp);

    const worstCase = await fs.readFile(__dirname + "/worst_case.png");
    const worstCaseWebp = await encodeImage(worstCase);
    const worstCaseHash = hash(worstCaseWebp);
    saveImage(`${worstCaseHash}.webp`, worstCase);
};

module.exports = { encodeImage, hash, saveImage, test };
