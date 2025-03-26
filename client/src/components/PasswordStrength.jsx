import { Box, LinearProgress, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { useDeferredValue, useEffect, useState } from "react";

// From https://zxcvbn-ts.github.io/zxcvbn/guide/framework-examples/#react:
import { zxcvbnAsync, zxcvbnOptions } from "@zxcvbn-ts/core";
/**
 * @import { ZxcvbnResult, Score } from "@zxcvbn-ts/core"
 */
import * as zxcvbnCommonPackage from "@zxcvbn-ts/language-common";
import * as zxcvbnEnPackage from "@zxcvbn-ts/language-en";
import { translations } from "@zxcvbn-ts/language-en";

// From https://zxcvbn-ts.github.io/zxcvbn/guide/framework-examples/#react
const options = {
    // recommended
    dictionary: {
        ...zxcvbnCommonPackage.dictionary,
        ...zxcvbnEnPackage.dictionary,
    },
    // recommended
    graphs: zxcvbnCommonPackage.adjacencyGraphs,
    // recommended
    useLevenshteinDistance: true,
};

zxcvbnOptions.setOptions(options);

/**
 * Score the given password
 * From https://zxcvbn-ts.github.io/zxcvbn/guide/framework-examples/#react
 * @param {string} password The password to score
 * @returns {ZxcvbnResult} zxcvbn's password scoring
 */
const usePasswordStrength = (password) => {
    const [result, setResult] = useState(null);
    const deferredPassword = useDeferredValue(password);

    useEffect(() => {
        zxcvbnAsync(deferredPassword).then((response) => setResult(response));
    }, [deferredPassword]);

    return result;
};

/**
 * Based on the score, return an adjective describing that score
 * @param {Score} score the score of the password
 * @returns {string} an adjective: one of "Excellent", "Good", "OK" or "Bad"
 */
const passwordAdjective = (score) => {
    switch (score) {
        case 0:
        case 1:
            return "Bad";
        case 2:
            return "OK";
        case 3:
            return "Good";
        case 4:
            return "Excellent";
    }
};

/**
 * Given a zxcvbn score, return a color
 * @param {Score} score the score of the password
 * @returns {string} A color
 */
const passwordColor = (score) => {
    // https://coolors.co/ad1a24-5d5a0e-386141
    switch (score) {
        case 0:
        case 1:
            return "#AD1A24";
        case 2:
            // Yeah, not very many yellows work against a white background
            return "#5D5A0E";
        case 3:
        case 4:
            return "#386141";
    }
};

/**
 * A component for the password bar
 * @param {Object} params
 * @param {SignUpData} params.signUpData
 * @returns the password strength component
 */
const PasswordStrength = ({ password }) => {
    const result = usePasswordStrength(password) ?? {
        score: 0,
    };
    const score = result.score;
    let reason = "";
    if (result.feedback && result.feedback.suggestions) {
        for (const item of result.feedback.suggestions) {
            reason += translations.suggestions[item] + " ";
        }
    }
    const color = passwordColor(score);
    const adjective = passwordAdjective(score);
    return (
        <Box sx={{ width: "100%", color: color }}>
            <Typography color="inherit">
                Password strength: <b>{adjective}</b>
            </Typography>
            <LinearProgress
                variant="determinate"
                value={(score / 4) * 100}
                color="inherit"
            />
            <Typography color="inherit">{reason}</Typography>
        </Box>
    );
};

PasswordStrength.propTypes = {
    password: PropTypes.string,
};

export { PasswordStrength };
