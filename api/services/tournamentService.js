const TournamentModel = require("../models/tournamentModel");

/* Helper Functions */

/**
 * Safely decodes a URI-encoded string.
 * @param {string|null|undefined} value - The URI-encoded string to decode.
 * @returns {string|null} The decoded string, or null if the input is null or undefined.
 */
const safeDecode = (value) => {
    return value !== null && value !== undefined
        ? decodeURIComponent(value)
        : null;
};

/**
 * Validates that a given value is an integer.
 * @param {number} value - The value to validate.
 * @param {string} fieldName - The name of the field (used in the error message).
 * @throws {Error} Throws an error with status 400 if the value is not an integer.
 */
const validateInteger = (value, fieldName) => {
    value = Number(value);
    if (!Number.isInteger(value)) {
        const error = new Error(`Invalid ${fieldName}. Value must be integer.`);
        error.status = 400;
        throw error;
    }
    return value;
};

/* End Helper Functions */

/**
 * Creates a new tournament in the database with the status of "Upcoming".
 * @param {string} tournamentName - Name of the tournament.
 * @param {string} startDate - Start date of the tournament in YYYY-MM-DD format.
 * @param {string} endDate - End date of the tournament in YYYY-MM-DD format. If not provided, defaults to endDate.
 * @param {string} location - The location of the tournament (likely an address or university name).
 * @returns {Promise<object>} Returns a promise that resolves to the created tournament record.
 * @throws {Error} Throws an error with status 401 if the user's role is unauthorized.
 */
const createTournament = async (
    tournamentName,
    startDate,
    endDate = null,
    location
) => {
    try {
        // TODO: Validate user's role by their Firebase UID
        // If no end date provided, assume the tournament only lasts a day.
        if (endDate === null) {
            finalEndDate = startDate;
        } else {
            finalEndDate = endDate;
        }
        const tournament = await TournamentModel.createTournament(
            tournamentName,
            startDate,
            finalEndDate,
            "Upcoming",
            location
        );
        return tournament;
    } catch (error) {
        throw error;
    }
};

/**
 * Searches tournaments in the database based on provided parameters.
 * If tournamentID is specified (not null), all other search parameters are ignored and the function
 * returns a single tournament record. If tournamentID is provided but is not a valid integer, an error
 * with a 400 status is thrown. If tournamentID is null, the function searches based on the other criteria
 * @param {number|string|null} tournamentID - Tournament ID. Solely used for search if value is provided.
 * @param {string|null} tournamentName - Name of the tournament.
 * @param {string|null} startDate Start date of the tournament in YYYY-MM-DD format. Returns tournaments starting on this date.
 * @param {string|null} endDate End date of the tournament in YYYY-MM-DD format. Returns tournaments ending on this date.
 * @param {string|null} startsBefore - Start date of the tournament in YYYY-MM-DD format. Returns tournaments starting on or before this date.
 * @param {string|null} startsAfter - Start date of the tournament in YYYY-MM-DD format. Returns tournaments starting on or after this date.
 * @param {string|null} endsBefore - End date of the tournament in YYYY-MM-DD format. Returns tournaments ending on or before this date.
 * @param {string|null} endsAfter - End date of the tournament in YYYY-MM-DD format. Returns tournaments ending on or after this date.
 * @param {string|null} status - Tournament status.
 * @param {string|null} location - Location of the tournament (address or university name).
 * @param {string|null} sortBy - Field to sort the results by.
 * @param {string|boolean|null} sortAsDescending - If true, sorts the results by DESCENDING. Defaults to ASCENDING.
 * @returns {Promise<object|object[]|null>}
 *          If tournamentID is specified, returns a single tournament object or null if not found.
 *          Otherwise, returns an array of tournament objects that match the criteria, or null if none are found.
 * @throws {Error} Throws an error if tournamentID is provided and is not a valid integer, or if the query fails.
 */
const searchTournaments = async (
    tournamentID = null,
    tournamentName = null,
    startDate = null,
    endDate = null,
    startsBefore = null,
    startsAfter = null,
    endsBefore = null,
    endsAfter = null,
    status = null,
    location = null,
    sortBy = null,
    sortAsDescending = false
) => {
    try {
        // If tournamentID is provided, use it exclusively for the search.
        if (tournamentID !== null) {
            tournamentID = validateInteger(tournamentID, "tournamentID");
            const tournament = await TournamentModel.searchTournaments(
                tournamentID,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null
            );
            return tournament;
        } else {
            // TODO: There's probably a cleaner way to covert string to boolean
            if (
                sortAsDescending === "true" ||
                sortAsDescending === "True" ||
                sortAsDescending === "TRUE"
            ) {
                sortAsDescending = true;
            }
            // When tournamentID is null, build search query based on other criteria.
            const tournament = await TournamentModel.searchTournaments(
                null,
                safeDecode(tournamentName),
                startDate,
                endDate,
                startsBefore,
                startsAfter,
                endsBefore,
                endsAfter,
                status,
                safeDecode(location),
                sortBy,
                sortAsDescending
            );
            return tournament;
        }
    } catch (error) {
        throw error;
    }
};

/**
 * Updates the tournament state in the database.
 */
const updateTournamentDetails = async (
    tournamentID = null,
    tournamentName = null,
    startDate = null,
    endDate = null,
    status = null,
    location = null
) => {
    try {
        const tournamentIDnum = Number(tournamentID);
        validateInteger(tournamentIDnum, "tournamentID");
        await TournamentModel.updateTournamentDetails(
            tournamentID,
            tournamentName,
            startDate,
            endDate,
            status,
            location
        );
        // Return using existing SELECT in search to verify updated information
        const tournament = searchTournaments(tournamentID);
        return tournament;
    } catch (error) {
        throw error;
    }
};

const addTournamentParticipant = async (tournamentID, teamID) => {
    try {
        tournamentID = validateInteger(tournamentID, "tournamentID");
        teamID = validateInteger(teamID, "teamID");
        const existingParticipant =
            await TournamentModel.searchTournamentParticipants(
                tournamentID,
                teamID
            );
        if (existingParticipant && existingParticipant.length > 0) {
            throw new Error("Team is already registered for this tournament.");
        }
        await TournamentModel.addTournamentParticipant(tournamentID, teamID);
    } catch (error) {
        throw error;
    }
};

const removeTournamentParticipant = async (tournamentID, teamID) => {
    try {
        tournamentID = validateInteger(tournamentID, "tournamentID");
        teamID = validateInteger(teamID, "teamID");
        const existingParticipant =
            await TournamentModel.searchTournamentParticipants(
                tournamentID,
                teamID
            );
        if (!existingParticipant || existingParticipant.length === 0) {
            throw new Error("Participant not found in this tournament.");
        }
        await TournamentModel.removeTournamentParticipant(tournamentID, teamID);
    } catch (error) {
        throw error;
    }
};

const searchTournamentParticipants = async (
    tournamentID,
    teamID,
    teamName,
    teamLeaderID,
    teamLeaderName,
    round,
    byes,
    status,
    bracketSide,
    nextMatchID,
    universityID,
    universityName,
    isApproved,
    sortBy,
    sortAsDescending
) => {
    try {
        const tournament = await TournamentModel.searchTournamentParticipants(
            tournamentID,
            teamID,
            teamName,
            teamLeaderID,
            teamLeaderName,
            round,
            byes,
            status,
            bracketSide,
            nextMatchID,
            universityID,
            universityName,
            isApproved,
            sortBy,
            sortAsDescending
        );
        return tournament;
    } catch (error) {
        throw error;
    }
};

const updateTournamentParticipant = async (
    tournamentID,
    teamID,
    round,
    byes,
    status,
    bracketSide,
    nextMatchID,
    bracketOrder
) => {
    try {
        const participant = await TournamentModel.updateTournamentParticipant(
            tournamentID,
            teamID,
            round,
            byes,
            status,
            bracketSide,
            nextMatchID,
            bracketOrder
        );
        return participant;
    } catch (error) {
        throw error;
    }
};

const addTournamentFacilitator = async (tournamentID, userID) => {
    try {
        tournamentID = validateInteger(tournamentID, "tournamentID");
        userID = validateInteger(userID, "userID");
        const existingFacilitator =
            await TournamentModel.searchTournamentFacilitators(
                tournamentID,
                userID
            );
        if (existingFacilitator && existingFacilitator.length > 0) {
            throw new Error("Facilitator already exists for this tournament.");
        }
        await TournamentModel.addTournamentFacilitator(tournamentID, userID);
    } catch (error) {
        throw error;
    }
};

const removeTournamentFacilitator = async (tournamentID, userID) => {
    try {
        tournamentID = validateInteger(tournamentID, "tournamentID");
        userID = validateInteger(userID, "userID");
        const existingFacilitator =
            await TournamentModel.searchTournamentFacilitators(
                tournamentID,
                userID
            );
        if (!existingFacilitator || existingFacilitator.length === 0) {
            throw new Error("Facilitator not found in this tournament.");
        }
        await TournamentModel.removeTournamentFacilitator(tournamentID, userID);
    } catch (error) {
        throw error;
    }
};

const searchTournamentFacilitators = async (
    tournamentID,
    userID,
    name,
    email,
    universityID
) => {
    try {
        console.log("Performing search on service layer");
        const tournament = await TournamentModel.searchTournamentFacilitators(
            tournamentID,
            userID,
            name,
            email,
            universityID
        );
        console.log("Returning search result on service layer");
        return tournament;
    } catch (error) {
        throw error;
    }
};

const startTournament = async (tournamentID) => {
    try {
        tournamentID = validateInteger(tournamentID, "tournamentID");
        const shuffleParticipants =
            await TournamentModel.searchTournamentParticipants(
                tournamentID,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                "RAND()"
            );
        const rounds = Math.ceil(Math.log2(shuffleParticipants.length));
        const numParticipants = shuffleParticipants.length;
        console.log(
            "Number of participants in this tournament: ",
            shuffleParticipants.length
        );
        console.log("Number of rounds: ", rounds);
        console.log("Determining left vs right side...");
        let leftSide, rightSide;
        if (numParticipants % 4 == 0) {
            console.log("Remainder 0");
            leftSide = shuffleParticipants.slice(0, numParticipants / 2);
            rightSide = shuffleParticipants.slice(numParticipants / 2);
        } else if (numParticipants % 4 == 1) {
            console.log("Remainder 1");
            leftSide = shuffleParticipants.slice(
                0,
                Math.ceil(numParticipants / 2)
            );
            rightSide = shuffleParticipants.slice(
                Math.ceil(numParticipants / 2)
            );
        } else if (numParticipants % 4 == 2) {
            console.log("Remainder 2");
            leftSide = shuffleParticipants.slice(0, numParticipants / 2 + 1);
            rightSide = shuffleParticipants.slice(numParticipants / 2 + 1);
        } else {
            console.log("Remainder 3");
            leftSide = shuffleParticipants.slice(
                0,
                Math.ceil(numParticipants / 2) + 1
            );
            rightSide = shuffleParticipants.slice(
                Math.floor(numParticipants / 2)
            );
        }
        if (rightSide.length + leftSide.length != numParticipants) {
            throw new Error("Mathing error.");
        }
        console.log("Setting left side members...");
        let bracketOrder = 1;
        leftSide.forEach((item) => {
            updateTournamentParticipant(
                tournamentID,
                item.TeamID,
                0,
                0,
                "active",
                "left",
                null,
                bracketOrder
            );
            bracketOrder++;
        });
        bracketOrder = 1;
        rightSide.forEach((item) => {
            updateTournamentParticipant(
                tournamentID,
                item.TeamID,
                0,
                0,
                "active",
                "right",
                null,
                bracketOrder
            );
            bracketOrder++;
        });
    } catch (error) {
        throw error;
    }
};

const nextRound = async (tournamentID, bracketSide, round) => {
    try {
        const participants = await searchTournamentParticipants(
            tournamentID,
            null,
            null,
            null,
            null,
            round,
            null,
            active,
            bracketSide,
            null,
            null,
            null,
            true,
            "BracketOrder"
        );
        numParticipants = participants.length;
        if (numParticipants == 1) {
            console.log(
                "This is the winner of the ",
                bracketSide,
                " of the tournament."
            );
        } else if (numParticipants % 2 == 0) {
            for (let i = 0; i < numParticipants; i += 2) {
                const team1 = participants[i];
                const team2 = participants[i + 1];
                createMatch(
                    tournamentID,
                    team1.TeamID,
                    team2.TeamID,
                    Date(now.getTime() + 15 * 60 * 1000)
                );
            }
        } else {
            // Figure out who gets a bye based on:
            //   1.) Number of previous byes
            //   2.) Registration date
            const byeTeam = await searchTournamentParticipants(
                tournamentID,
                null,
                null,
                null,
                null,
                round,
                null,
                active,
                bracketSide,
                null,
                null,
                null,
                true,
                "Byes, TeamCreatedAt"
            )[0];
            updateTournamentParticipant(
                tournamentID,
                byeTeam.TeamID,
                byeTeam.TeamRound + 1,
                byeTeam.TeamByeCount + 1
            );
            const participants = await searchTournamentParticipants(
                tournamentID,
                null,
                null,
                null,
                null,
                round,
                null,
                active,
                bracketSide,
                null,
                null,
                null,
                true,
                "BracketOrder"
            );
            numParticipants = participants.length;
            if (numParticipants % 2 == 0) {
                for (let i = 0; i < numParticipants; i += 2) {
                    const team1 = participants[i];
                    const team2 = participants[i + 1];
                    createMatch(
                        tournamentID,
                        team1.TeamID,
                        team2.TeamID,
                        Date(now.getTime() + 15 * 60 * 1000)
                    );
                }
            } else {
                throw new Error("Mathing error when generating next round.");
            }
        }
    } catch (error) {
        throw error;
    }
};

/**
 * Creates a match for the tournament in the database.
 * @param {number|string} tournamentID - The tournament ID.
 * @param {number|string} team1ID - Team 1 ID.
 * @param {number|string} team2ID - Team 2 ID.
 * @param {string} matchTime - The match time as an ISO 8601 string ("2025-02-17T00:00:00Z").
 * @returns {Promise<object>} Returns a promise that resolves to the created match record.
 * @throws {Error} Throws an error with status 400 if any of the IDs are not valid integers, or if the match cannot be created.
 */
const createMatch = async (tournamentID, team1ID, team2ID, matchTime) => {
    try {
        tournamentID = validateInteger(tournamentID, "tournamentID");
        team1ID = validateInteger(team1ID, "team1ID");
        team2ID = validateInteger(team2ID, "team2ID");
        // Convert matchTime from an ISO 8601 string to MySQL DATETIME format ("YYYY-MM-DD HH:MM:SS").
        const formattedMatchTime = new Date(matchTime)
            .toISOString() // Converts to "2025-02-17T00:00:00.000Z"
            .slice(0, 19) // Trims to "2025-02-17T00:00:00"
            .replace("T", " "); // Replaces the "T" with a space
        // TODO:
        // - Validate that the tournamentID exists.
        // - Validate matchTime
        // - Validate that matchTime is greater than the tournament's StartTime.
        // - Validate that team1ID and team2ID are associated with teams in the tournament.
        const match = await TournamentModel.createMatch(
            tournamentIDInt,
            team1IDInt,
            team2IDInt,
            formattedMatchTime
        );
        return match;
    } catch (error) {
        throw error;
    }
};

/**
 * Searches for tournament matches based on provided criteria.
 * If matchID is specified (not null), this function validates it and uses it exclusively
 * to search for a specific match. If matchID is null, it searches based on the other criteria.
 * @param {number|string|null} matchID - ID for the match. When provided, other criteria are ignored.
 * @param {number|string|null} tournamentID - ID for the tournament.
 * @param {number|string|null} teamID - ID for a team. This will search for matches where the team is either team1 or team2.
 * @param {string|null} before - The latest date/time (inclusive) to search for matches, formatted as YYYY-MM-DD OR YYYY-MM-DD HH:mm:ss.
 * @param {string|null} after - The earliest date/time (inclusive) to search for matches, formatted as YYYY-MM-DD YYYY-MM-DD HH:mm:ss.
 * @param {string|null} sortBy - Field to sort the results by.
 * @param {string|boolean|null} sortAsDescending - If true, sorts the results by DESCENDING.
 * @returns {Promise<object|object[]|null>} Returns a single match object if matchID is provided, an array of match objects
 *                                          if searching by other criteria, or null if no match is found.
 * @throws {Error} Throws an error with status 400 if matchID is provided and is not a valid integer.
 */
const searchMatches = async (
    matchID,
    tournamentID,
    bracketSide,
    teamID,
    before,
    after,
    sortBy,
    sortAsDescending
) => {
    try {
        // If matchID is provided, use it exclusively for the search.
        if (matchID) {
            // Convert the matchID to a number for validation.
            matchID = validateInteger(matchID, "matchID");
            match = await TournamentModel.searchMatches(
                matchID,
                null,
                null,
                null,
                null,
                null,
                null,
                null
            );
            return match;
        } else {
            // TODO: There's probably a better way to check if the param is set to true
            if (
                sortAsDescending === "true" ||
                sortAsDescending === "True" ||
                sortAsDescending === "TRUE"
            ) {
                sortAsDescending = true;
            }
            const match = await TournamentModel.searchMatches(
                null,
                tournamentID,
                bracketSide,
                teamID,
                before,
                after,
                sortBy,
                sortAsDescending
            );
            return match;
        }
    } catch (error) {
        throw error;
    }
};

/**
 * Updates the match result in the database based on matchID
 * @param {number|string} matchID - ID for the match to update.
 * @param {number|string} winnerID - ID for the winning team.
 * @param {number|string} score1 - Score for team one.
 * @param {number|string} score2 - Score for team two.
 * @returns {Promise<object>} Returns a promise that resolves to an object containing the updated match result.
 * @throws {Error} Throws an error with status 400 if any of the IDs or scores are not valid integers.
 */
const updateMatchResult = async (matchID, winnerID, score1, score2) => {
    try {
        matchID = validateInteger(matchID, "matchID");
        winnerID = validateInteger(winnerID, "winnerID");
        score1 = validateInteger(score1, "score1");
        score2 = validateInteger(score2, "score2");
        if (score1 == score2) {
            throw new Error("There are no ties! Please choose a winner.");
        }
        await TournamentModel.updateMatchResult(
            matchID,
            winnerID,
            score1,
            score2
        );
        match = await searchMatches(matchID);
        currentRound = searchTournamentParticipants(
            match.TournamentID,
            match.Team1ID
        )[0].Round;
        if (score1 > score2) {
            updateTournamentParticipant(
                match.TournamentID,
                match.Team1ID,
                currentRound + 1
            );
            updateTournamentParticipant(
                match.TournamentID,
                match.Team2ID,
                null,
                null,
                "lost",
                null,
                0,
                null
            );
        } else {
            updateTournamentParticipant(
                match.TournamentID,
                match.Team2ID,
                currentRound + 1
            );
            updateTournamentParticipant(
                match.TournamentID,
                match.Team1ID,
                null,
                null,
                "lost",
                null,
                0,
                null
            );
        }
        bracketSide = searchTournamentParticipants(
            match.TournamentID,
            match.Team1ID
        )[0].BracketSide;
        if (
            searchTournamentParticipants(
                match.TournamentID,
                match.winnerID,
                null,
                null,
                null,
                currentRound,
                null,
                "active",
                bracketSide,
                null,
                null,
                null,
                true
            ).length === 0
        ) {
            nextRound(match.TournamentID, bracketSide, currentRound + 1);
        }
        return searchMatches(matchID);
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createTournament,
    searchTournaments,
    updateTournamentDetails,
    addTournamentParticipant,
    removeTournamentParticipant,
    searchTournamentParticipants,
    updateTournamentParticipant,
    addTournamentFacilitator,
    removeTournamentFacilitator,
    searchTournamentFacilitators,
    startTournament,
    createMatch,
    searchMatches,
    updateMatchResult,
};
