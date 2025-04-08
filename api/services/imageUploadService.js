const sharp = require("sharp");
const { createHash, hash } = require("node:crypto");
const fs = require("node:fs/promises");
const userModel = require("../models/userModel");

// The maximum length of the longest side of a user-uploaded image, in pixels:
const MAX_LONGEST_SIDE = 1000;
// The directory to where images are stored
const USER_IMAGE_DIRECTORY = __dirname + "/../user-images/";
const API_URL = process.env.API_URL || "http://localhost:3000/api";

/**
 * Encode image as WEBP, discarding any metadata
 * Also, resize image so that it is at most 1000px on it's longest side
 * @param {Buffer} image an image to attempt to encode
 * @return {Promise<Buffer>} The image, encoded as WEBP
 * @throws {Error} if sharp can't convert the image
 */
const encodeImage = async (image) => {
    return await sharp(image)
        .resize(MAX_LONGEST_SIDE, MAX_LONGEST_SIDE, {
            fit: "inside",
            withoutEnlargement: true,
        })
        .webp()
        .toBuffer();
};

/**
 * Hash a buffer with sha1 (not for cryptographic purposes, intended just to
 * tell if two files are the same).
 * @param {Buffer} buffer
 * @returns {string} sha1 of the buffer, base64url encoded
 */
const hashBuffer = (buffer) => {
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

/**
 * Record in the database where to find the uploaded image
 * @param {string} url the url to the image
 * @param {number} userId the id of the user that's uploading an image
 */
const recordUserImageURL = async (url, userId) => {
    userModel.updateUserOrRequestUpdate(userId, { ProfileImageURL: url });
};

/**
 * Save an image for a user - save the image to the disk after transcoding to
 * WEBP, and request a user update for that image
 * @param {Buffer} file the file to try to use as an image
 * @throws {Error} if something goes wrong with converting or saving an image
 */
const uploadImage = async (file) => {
    "use strict";
    try {
        const image = await encodeImage(file);
        const imageHash = hashBuffer(image);
        const name = `${imageHash}.webp`;
        saveImage(name, image);
        return `${API_URL}/user-images/${name}`;
    } catch (e) {
        console.error(e);
        throw e;
    }
};

module.exports = { uploadImage };
