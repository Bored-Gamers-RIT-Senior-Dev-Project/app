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
 * @returns {number} The validated integer.
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
 * @param {string} uid - FirebaseUID of the user.
 * @param {string} tournamentName - Name of the tournament.
 * @param {string} startDate - Start date of the tournament in YYYY-MM-DD format.
 * @param {string} endDate - End date of the tournament in YYYY-MM-DD format. If not provided, defaults to startDate.
 * @param {string} location - The location of the tournament.
 * @returns {Promise<object>} Returns the created tournament record.
 * @throws {Error} Throws an error with status 403 if the user is unauthorized.
 */
const createTournament = async (
    uid,
    tournamentName,
    startDate,
    endDate = null,
    location
) => {
    try {
        const user = await userModel.getUserByFirebaseId(uid);
        if (
            user.role !== "Super Admin" &&
            user.role !== "Aardvark Games Employee"
        ) {
            throw createHttpError(403);
        }

        // If no end date provided, default the end date to the start date.
        let finalEndDate = endDate === null ? startDate : endDate;
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
 * @param {number|string|null} tournamentID - Tournament ID. If provided, search is based solely on this ID.
 * @param {string|null} tournamentName - Name of the tournament.
 * @param {string|null} startDate - Start date of the tournament in YYYY-MM-DD format.
 * @param {string|null} endDate - End date of the tournament in YYYY-MM-DD format.
 * @param {string|null} startsBefore - Returns tournaments starting on or before this date.
 * @param {string|null} startsAfter - Returns tournaments starting on or after this date.
 * @param {string|null} endsBefore - Returns tournaments ending on or before this date.
 * @param {string|null} endsAfter - Returns tournaments ending on or after this date.
 * @param {string|null} status - Tournament status.
 * @param {string|null} location - Tournament location.
 * @param {string|null} sortBy - Field to sort the results by.
 * @param {string|boolean|null} sortAsDescending - If true, sorts results in descending order.
 * @returns {Promise<object|object[]|null>} Returns a tournament record or an array of tournaments.
 * @throws {Error} Throws an error if validation fails or the query fails.
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
            if (
                sortAsDescending === "true" ||
                sortAsDescending === "True" ||
                sortAsDescending === "TRUE"
            ) {
                sortAsDescending = true;
            }
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
 * Retrieves the tournament bracket including tournament details and match-ups.
 * @param {number} tournamentID - ID of the tournament.
 * @returns {Promise<object>} Returns an object containing tournament details and the bracket.
 * @throws {Error} Throws an error if the tournament or participants are not found.
 */
const getTournamentBracket = async (tournamentID) => {
    try {
        const bracket = [];
        const participants =
            await TournamentService.searchTournamentParticipants(tournamentID);
        const numTeams = participants.length;
        if (numTeams === 0) {
            return res
                .status(404)
                .json({ error: "No teams found in the tournament" });
        }

        const rounds = Math.ceil(Math.log2(numTeams));

        for (let i = 1; i <= rounds; i++) {
            const leftMatches = await TournamentService.searchMatches(
                null,
                tournamentID,
                "left",
                null,
                null,
                null,
                "participant1.BracketOrder",
                null,
                i
            );

            const rightMatches = await TournamentService.searchMatches(
                null,
                tournamentID,
                "right",
                null,
                null,
                null,
                "participant1.BracketOrder",
                null,
                i
            );

            bracket.push(...leftMatches, ...rightMatches);
        }

        const tournament = await TournamentService.searchTournament(
            tournamentID
        );

        return res.status(200).json({
            tournament,
            bracket,
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

/**
 * Updates the tournament details.
 * @param {number|string|null} tournamentID - ID of the tournament.
 * @param {string|null} tournamentName - New tournament name.
 * @param {string|null} startDate - New start date in YYYY-MM-DD format.
 * @param {string|null} endDate - New end date in YYYY-MM-DD format.
 * @param {string|null} status - New tournament status.
 * @param {string|null} location - New tournament location.
 * @returns {Promise<object|object[]|null>} Returns the updated tournament record.
 * @throws {Error} Throws an error if validation fails or the update fails.
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
        const tournament = searchTournaments(tournamentID);
        return tournament;
    } catch (error) {
        throw error;
    }
};

/**
 * Delete a tournament.
 * @param {number|string|null} tournamentID - ID of the tournament to delete.
 * @returns {Promise<void>}
 * @throws {Error} Throws an error if tournament deletion fails.
 */
const deleteTournament = async (tournamentID = null) => {
    try {
        const tournamentIDnum = Number(tournamentID);
        validateInteger(tournamentIDnum, "tournamentID");
        await TournamentModel.deleteTournament(tournamentID);
    } catch (error) {
        throw error;
    }
};

/**
 * Adds a participant to a tournament.
 * @param {number|string} tournamentID - ID of the tournament.
 * @param {number|string} teamID - ID of the team.
 * @returns {Promise<void>}
 * @throws {Error} Throws an error if the team is already registered or the addition fails.
 */
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

/**
 * Removes a participant from a tournament.
 * @param {number|string} tournamentID - ID of the tournament.
 * @param {number|string} teamID - ID of the team.
 * @returns {Promise<void>}
 * @throws {Error} Throws an error if the participant is not found or removal fails.
 */
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

/**
 * Searches for tournament participants based on provided criteria.
 * @param {number|null} tournamentID - ID of the tournament.
 * @param {number|null} teamID - ID of the team.
 * @param {string|null} teamName - Name of the team.
 * @param {number|null} teamLeaderID - ID of the team leader.
 * @param {string|null} teamLeaderName - Name of the team leader.
 * @param {number|null} round - Round number.
 * @param {number|null} byes - Number of byes.
 * @param {string|null} status - Participant status.
 * @param {string|null} bracketSide - Bracket side ("left" or "right").
 * @param {number|null} nextMatchID - ID of the next match.
 * @param {number|null} universityID - ID of the university.
 * @param {string|null} universityName - Name of the university.
 * @param {boolean|null} isApproved - Approval status.
 * @param {string|null} sortBy - Field to sort by.
 * @param {boolean} sortAsDescending - If true, sorts in descending order.
 * @returns {Promise<object[]|null>} Returns an array of participant records or null.
 * @throws {Error} Throws an error if the search fails.
 */
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

/**
 * Updates a tournament participant's details.
 * @param {number|string} tournamentID - ID of the tournament.
 * @param {number|string} teamID - ID of the team.
 * @param {number} round - New round number.
 * @param {number} byes - New bye count.
 * @param {string} status - New participant status.
 * @param {string} bracketSide - New bracket side ("left" or "right").
 * @param {number|null} nextMatchID - ID of the next match or null.
 * @param {number} bracketOrder - New order in the bracket.
 * @returns {Promise<object>} Returns the updated participant record.
 * @throws {Error} Throws an error if the update fails.
 */
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

/**
 * Adds a facilitator to a tournament.
 * @param {number|string} tournamentID - ID of the tournament.
 * @param {number|string} userID - ID of the facilitator.
 * @returns {Promise<void>}
 * @throws {Error} Throws an error if the facilitator already exists or if the operation fails.
 */
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

/**
 * Removes a facilitator from a tournament.
 * @param {number|string} tournamentID - ID of the tournament.
 * @param {number|string} userID - ID of the facilitator.
 * @returns {Promise<void>}
 * @throws {Error} Throws an error if the facilitator is not found or if the removal fails.
 */
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

/**
 * Searches for tournament facilitators based on provided criteria.
 * @param {number|null} tournamentID - ID of the tournament.
 * @param {number|null} userID - ID of the facilitator.
 * @param {string|null} name - Facilitator's name.
 * @param {string|null} email - Facilitator's email.
 * @param {number|null} universityID - University ID.
 * @returns {Promise<object[]|null>} Returns an array of facilitator records or null.
 * @throws {Error} Throws an error if the search fails.
 */
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

/**
 * Starts a tournament by shuffling participants, assigning bracket sides,
 * and scheduling the first round of matches.
 * @param {string} uid - FirebaseUID of the user initiating the tournament start.
 * @param {number|string} tournamentID - ID of the tournament.
 * @returns {Promise<void>}
 * @throws {Error} Throws an error if the user is unauthorized or if the tournament cannot be started.
 */
const startTournament = async (uid, tournamentID) => {
    try {
        tournamentID = validateInteger(tournamentID, "tournamentID");
        const user = await userModel.getUserByFirebaseId(uid);
        if (
            user.role !== "Super Admin" &&
            user.role !== "Aardvark Games Employee" &&
            (user.role !== "Tournament Facilitator" ||
                searchTournamentFacilitators(tournamentID, user.userID)
                    .length === 0)
        ) {
            throw createHttpError(403);
        }

        const shuffleParticipants =
            await TournamentModel.searchTournamentParticipants(
                tournamentID,
                null,
                null,
                null,
                null,
                null,
                null,
                "active",
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
                1,
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
                1,
                0,
                "active",
                "right",
                null,
                bracketOrder
            );
            bracketOrder++;
        });
        nextRound(tournamentID, "left", 1);
        nextRound(tournamentID, "right", 1);
    } catch (error) {
        throw error;
    }
};

/**
 * Schedules the next round of matches for a given bracket side.
 * @param {number|string} tournamentID - ID of the tournament.
 * @param {string} bracketSide - Bracket side ("left" or "right").
 * @param {number} round - The current round number.
 * @returns {Promise<void>}
 * @throws {Error} Throws an error if match scheduling fails.
 */
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
            "active",
            bracketSide,
            null,
            null,
            null,
            true,
            "BracketOrder"
        );
        let numParticipants = participants.length;
        if (numParticipants === 1) {
            console.log(
                "This is the winner of the ",
                bracketSide,
                " of the tournament."
            );
        } else if (numParticipants % 2 === 0) {
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
            const byeTeam = (
                await searchTournamentParticipants(
                    tournamentID,
                    null,
                    null,
                    null,
                    null,
                    round,
                    null,
                    "active",
                    bracketSide,
                    null,
                    null,
                    null,
                    true,
                    "Byes, TeamCreatedAt"
                )
            )[0];
            updateTournamentParticipant(
                tournamentID,
                byeTeam.TeamID,
                byeTeam.TeamRound + 1,
                byeTeam.TeamByeCount + 1
            );
            const updatedParticipants = await searchTournamentParticipants(
                tournamentID,
                null,
                null,
                null,
                null,
                round,
                null,
                "active",
                bracketSide,
                null,
                null,
                null,
                true,
                "BracketOrder"
            );
            numParticipants = updatedParticipants.length;
            if (numParticipants % 2 === 0) {
                for (let i = 0; i < numParticipants; i += 2) {
                    const team1 = updatedParticipants[i];
                    const team2 = updatedParticipants[i + 1];
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
 * @param {string} matchTime - The match time as an ISO 8601 string (e.g., "2025-02-17T00:00:00Z").
 * @returns {Promise<object>} Returns the created match record.
 * @throws {Error} Throws an error if the match cannot be created.
 */
const createMatch = async (tournamentID, team1ID, team2ID, matchTime) => {
    try {
        tournamentID = validateInteger(tournamentID, "tournamentID");
        team1ID = validateInteger(team1ID, "team1ID");
        team2ID = validateInteger(team2ID, "team2ID");
        const formattedMatchTime = new Date(matchTime)
            .toISOString()
            .slice(0, 19)
            .replace("T", " ");
        const match = await TournamentModel.createMatch(
            tournamentID,
            team1ID,
            team2ID,
            formattedMatchTime
        );
        return match;
    } catch (error) {
        throw error;
    }
};

/**
 * Searches for tournament matches based on provided criteria.
 * If matchID is specified, the search is performed solely based on matchID.
 * @param {number|string|null} matchID - ID for the match.
 * @param {number|string|null} tournamentID - ID for the tournament.
 * @param {string|null} bracketSide - Bracket side filter.
 * @param {number|string|null} teamID - ID for a team.
 * @param {string|null} before - Latest datetime (inclusive) for matches ("YYYY-MM-DD HH:mm:ss").
 * @param {string|null} after - Earliest datetime (inclusive) for matches ("YYYY-MM-DD HH:mm:ss").
 * @param {string|null} sortBy - Field to sort by.
 * @param {string|boolean|null} sortAsDescending - If true, sorts in descending order.
 * @param {number|string|null} winnerID - Winner ID filter.
 * @returns {Promise<object|object[]|null>} Returns a match record if matchID is provided, an array of matches if searching by criteria, or null if not found.
 * @throws {Error} Throws an error if validation fails or the search query fails.
 */
const searchMatches = async (
    matchID,
    tournamentID,
    bracketSide,
    teamID,
    before,
    after,
    sortBy,
    sortAsDescending,
    winnerID
) => {
    try {
        if (matchID) {
            matchID = validateInteger(matchID, "matchID");
            const match = await TournamentModel.searchMatches(
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
                sortAsDescending,
                winnerID
            );
            return match;
        }
    } catch (error) {
        throw error;
    }
};

/**
 * Updates the match result in the database based on matchID.
 * @param {number|string} matchID - ID of the match to update.
 * @param {number|string} winnerID - ID for the winning team.
 * @param {number|string} score1 - Score for team one.
 * @param {number|string} score2 - Score for team two.
 * @returns {Promise<object>} Returns the updated match result.
 * @throws {Error} Throws an error if any parameter validation fails or the update fails.
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
        const match = await searchMatches(matchID);
        const currentRound = searchTournamentParticipants(
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
        const bracketSide = searchTournamentParticipants(
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
    deleteTournament,
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
