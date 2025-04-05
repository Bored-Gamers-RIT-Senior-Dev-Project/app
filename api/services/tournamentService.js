const TournamentModel = require("../models/tournamentModel");
const TeamModel = require("../models/teamModel");

/* Helper Functions */

/**
 * Safely decodes a URI-encoded string.
 * @param {string|null|undefined} value - The URI-encoded string to decode.
 * @returns {string} The decoded string, or null if the input is null or undefined.
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

/**
 * Checks if a facilitator is a facilitator of a specific tournament.
 * @param {number} tournaemntID - tournament to check.
 * @param {number} userID - User to check for in facilitators.
 * @returns {boolean} Whether or not use is a facilitator of the tournament.
 */
const checkFacilitatorTournament = (tournamentID, userID) => {
    const facilitator = searchTournamentFacilitators(tournamentID, userID);
    return !(!facilitator || facilitator.length === 0);
};

/* End Helper Functions */

/**
 * Creates a new tournament in the database with the status of "Upcoming".
 * @param {string} uid - FirebaseUID of the user trying to perform the action.
 * @param {string} tournamentName - Name of the tournament.
 * @param {string} startDate - Start date of the tournament in YYYY-MM-DD format.
 * @param {string} endDate - End date of the tournament in YYYY-MM-DD format. If not provided, defaults to startDate.
 * @param {string} location - The location of the tournament.
 * @returns {Promise<object>} Returns the created tournament record.
 * @throws {Error} Throws an error with status 403 if the user is unauthorized.
 */
const createTournament = async (
    uid,
    tournamentName = null,
    startDate = null,
    endDate = null,
    location = null
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
            location
        );
        return tournament;
    } catch (error) {
        throw error;
    }
};

/**
 * Searches tournaments in the database based on provided parameters.
 * @param {number|string} tournamentID - Tournament ID. If provided, search is based solely on this ID.
 * @param {string} tournamentName - Name of the tournament.
 * @param {string} startDate - Start date of the tournament in YYYY-MM-DD format.
 * @param {string} endDate - End date of the tournament in YYYY-MM-DD format.
 * @param {string} startsBefore - Returns tournaments starting on or before this date.
 * @param {string} startsAfter - Returns tournaments starting on or after this date.
 * @param {string} endsBefore - Returns tournaments ending on or before this date.
 * @param {string} endsAfter - Returns tournaments ending on or after this date.
 * @param {string} status - Tournament status.
 * @param {string} location - Tournament location.
 * @param {string} sortBy - Field to sort the results by.
 * @param {string|boolean} sortAsDescending - If true, sorts results in descending order.
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
        // Search tournament by ID, otherwise use other filters
        if (tournamentID !== null) {
            console.log("Searching solely by tournamentID");
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
            // TODO probably a better way to do this
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

        // Fetch all participants for the tournament
        const participants = await searchTournamentParticipants(tournamentID);
        const numTeams = participants.length;

        // If not enough teams to form matches, return a placeholder match
        if (numTeams < 2) {
            bracket.push({
                title: "Round 1",
                seeds: [
                    {
                        MatchID: "TBD-PLACEHOLDER",
                        TournamentID: tournamentID,
                        MatchTime: null,
                        Team1ID: null,
                        Team1Name: "TBD",
                        Score1: null,
                        Team2ID: null,
                        Team2Name: "TBD",
                        WinnerID: null,
                        Score2: null,
                        BracketSide: "final",
                        BracketOrder: 0,
                        MatchRound: 1,
                    },
                ],
            });

            // Return tournament details and placeholder bracket
            const tournament = await searchTournaments(tournamentID);
            return [tournament, bracket];
        }

        // Determine how many rounds are needed for the number of teams (single elimination)
        const rounds = Math.ceil(Math.log2(numTeams));

        // Track number of teams on each side from the previous round
        let previousLeftCount = Math.ceil(numTeams / 2);
        let previousRightCount = Math.floor(numTeams / 2);

        let previousLeftWinners = [];
        let previousRightWinners = [];

        // Generate the bracket round-by-round
        for (let i = 1; i <= rounds; i++) {
            const isFinalRound = i === rounds;

            // Get any pre-scheduled matches for this round and bracket side
            let leftMatches = await searchMatches(
                null,
                tournamentID,
                "left",
                null,
                null,
                null,
                "BracketSide, sub.BracketOrder",
                null,
                i
            );

            let rightMatches = await searchMatches(
                null,
                tournamentID,
                "right",
                null,
                null,
                null,
                "BracketSide, sub.BracketOrder",
                null,
                i
            );

            let currentLeftCount = 0;
            let currentRightCount = 0;

            // Handle final round separately
            if (isFinalRound) {
                const lastMatch = await searchMatches(
                    null,
                    tournamentID,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    rounds
                );
                let finalMatch = [];

                // Use existing match if present; otherwise create a placeholder
                if (lastMatch[0]) {
                    finalMatch = lastMatch[0];
                } else {
                    finalMatch = Array.from({ length: tbdCount }).map(
                        (_, index) => ({
                            MatchID: `TBD-PLACEHOLDER`,
                            TournamentID: tournamentID,
                            MatchTime: null,
                            Team1ID: null,
                            Team1Name: "TBD",
                            Score1: null,
                            Team2ID: null,
                            Team2Name: "TBD",
                            WinnerID: null,
                            Score2: null,
                            BracketSide: "left",
                            BracketOrder: index,
                            MatchRound: i,
                        })
                    );
                }

                bracket.push({
                    title: `Round ${i}`,
                    seeds: finalMatch,
                });

                break;
            }

            // If no matches found on the left, create BYEs or placeholders
            if (!leftMatches || leftMatches.length === 0) {
                let tbdCount = 0;

                if (i === 1) {
                    tbdCount = Math.floor(numTeams / 4);
                } else if (previousLeftCount >= 2) {
                    tbdCount = Math.floor(previousLeftCount / 2);
                } else if (
                    previousLeftCount === 1 &&
                    previousRightCount > 1 &&
                    previousLeftWinners.length > 0
                ) {
                    // Carry forward the lone winner with a BYE
                    const winner = previousLeftWinners[0];
                    leftMatches = [
                        {
                            MatchID: `BYE-PLACEHOLDER`,
                            TournamentID: tournamentID,
                            MatchTime: null,
                            Team1ID: winner.Team1ID ?? winner.Team2ID ?? null,
                            Team1Name:
                                winner.Team1Name ??
                                winner.Team2Name ??
                                "Winner",
                            Score1: null,
                            Team2ID: null,
                            Team2Name: "BYE",
                            WinnerID: winner.Team1ID ?? winner.Team2ID ?? null,
                            Score2: null,
                            BracketSide: "left",
                            BracketOrder: 0,
                            MatchRound: i,
                        },
                    ];
                    currentLeftCount = 1;
                } else if (previousLeftCount === 1) {
                    tbdCount = 1;
                }

                if (!leftMatches || leftMatches.length === 0) {
                    // Create placeholder matches
                    leftMatches = Array.from({ length: tbdCount }).map(
                        (_, index) => ({
                            MatchID: `TBD-PLACEHOLDER`,
                            TournamentID: tournamentID,
                            MatchTime: null,
                            Team1ID: null,
                            Team1Name: "TBD",
                            Score1: null,
                            Team2ID: null,
                            Team2Name: "TBD",
                            WinnerID: null,
                            Score2: null,
                            BracketSide: "left",
                            BracketOrder: index,
                            MatchRound: i,
                        })
                    );
                    currentLeftCount = tbdCount;
                }
            } else {
                currentLeftCount = leftMatches.length;
            }

            // Repeat the same logic for right bracket side
            if (!rightMatches || rightMatches.length === 0) {
                let tbdCount = 0;

                if (i === 1) {
                    tbdCount = Math.ceil(numTeams / 4);
                } else if (previousRightCount >= 2) {
                    tbdCount = Math.floor(previousRightCount / 2);
                } else if (
                    previousRightCount === 1 &&
                    previousLeftCount > 1 &&
                    previousRightWinners.length > 0
                ) {
                    const winner = previousRightWinners[0];
                    rightMatches = [
                        {
                            MatchID: `BYE-PLACEHOLDER`,
                            TournamentID: tournamentID,
                            MatchTime: null,
                            Team1ID: winner.Team1ID ?? winner.Team2ID ?? null,
                            Team1Name:
                                winner.Team1Name ??
                                winner.Team2Name ??
                                "Winner",
                            Score1: null,
                            Team2ID: null,
                            Team2Name: "BYE",
                            WinnerID: winner.Team1ID ?? winner.Team2ID ?? null,
                            Score2: null,
                            BracketSide: "right",
                            BracketOrder: 0,
                            MatchRound: i,
                        },
                    ];
                    currentRightCount = 1;
                } else if (previousRightCount === 1) {
                    tbdCount = 1;
                }

                if (!rightMatches || rightMatches.length === 0) {
                    rightMatches = Array.from({ length: tbdCount }).map(
                        (_, index) => ({
                            MatchID: `TBD-PLACEHOLDER`,
                            TournamentID: tournamentID,
                            MatchTime: null,
                            Team1ID: null,
                            Team1Name: "TBD",
                            Score1: null,
                            Team2ID: null,
                            Team2Name: "TBD",
                            Score2: null,
                            BracketSide: "right",
                            BracketOrder: index,
                            MatchRound: i,
                        })
                    );
                    currentRightCount = tbdCount;
                }
            } else {
                currentRightCount = rightMatches.length;
            }

            // Track the number of matches for the next iteration
            previousLeftCount = currentLeftCount;
            previousRightCount = currentRightCount;

            // Identify any matches that are BYEs (used in logic above)
            const isBye = (match) =>
                match.Team1ID !== null &&
                match.Team1ID === match.Team2ID &&
                match.WinnerID === match.Team1ID;

            // Store winners of current round to potentially advance
            previousLeftWinners = leftMatches.filter(
                (m) => m.WinnerID != null || isBye(m)
            );
            previousRightWinners = rightMatches.filter(
                (m) => m.WinnerID != null || isBye(m)
            );

            // Format BYE matches to remove duplicated Team1/Team2 info
            const formatByeMatches = (matches) => {
                return matches.map((match) => {
                    if (
                        match.Team1ID !== null &&
                        match.Team1ID === match.Team2ID &&
                        match.WinnerID === match.Team1ID
                    ) {
                        return {
                            ...match,
                            Team2ID: null,
                            Team2Name: "BYE",
                        };
                    }
                    return match;
                });
            };

            leftMatches = formatByeMatches(leftMatches);
            rightMatches = formatByeMatches(rightMatches);

            // Push the completed round into the bracket
            bracket.push({
                title: `Round ${i}`,
                seeds: [...leftMatches, ...rightMatches],
            });
        }

        // Return the tournament details along with the full bracket
        const tournament = await searchTournaments(tournamentID);
        return [tournament, bracket];
    } catch (error) {
        console.error("Error generating tournament bracket:", error);
        throw error;
    }
};

/**
 * Updates the tournament details.
 * @param {string} uid - FirebaseUID of the user trying to perform the action.
 * @param {number|string} tournamentID - ID of the tournament.
 * @param {string} tournamentName - New tournament name.
 * @param {string} startDate - New start date in YYYY-MM-DD format.
 * @param {string} endDate - New end date in YYYY-MM-DD format.
 * @param {string} status - New tournament status.
 * @param {string} location - New tournament location.
 * @returns {Promise<object|object[]|null>} Returns the updated tournament record.
 * @throws {Error} Throws an error if validation fails or the update fails.
 */
const updateTournamentDetails = async (
    uid,
    tournamentID = null,
    tournamentName = null,
    startDate = null,
    endDate = null,
    status = null,
    location = null
) => {
    try {
        const user = await userModel.getUserByFirebaseId(uid);
        if (
            user.role !== "Super Admin" &&
            user.role !== "Aardvark Games Employee" &&
            (user.role !== "University Admin" ||
                !checkFacilitatorTournament(tournamentID, user.userID))
        ) {
            throw createHttpError(403);
        }
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
 * @param {string} uid - FirebaseUID of the user trying to perform the action.
 * @param {number|string} tournamentID - ID of the tournament to delete.
 * @returns {Promise<void>}
 * @throws {Error} Throws an error if tournament deletion fails.
 */
const deleteTournament = async (uid, tournamentID = null) => {
    try {
        const user = await userModel.getUserByFirebaseId(uid);
        if (
            user.role !== "Super Admin" &&
            user.role !== "Aardvark Games Employee"
        ) {
            throw createHttpError(403);
        }
        const tournamentIDnum = Number(tournamentID);
        validateInteger(tournamentIDnum, "tournamentID");
        await TournamentModel.deleteTournament(tournamentID);
    } catch (error) {
        throw error;
    }
};

/**
 * Adds a participant to a tournament.
 * @param {string} uid - FirebaseUID of the user trying to perform the action.
 * @param {number|string} tournamentID - ID of the tournament.
 * @param {number|string} teamID - ID of the team.
 * @returns {Promise<void>}
 * @throws {Error} Throws an error if the team is already registered or the addition fails.
 */
const addTournamentParticipant = async (
    uid,
    tournamentID = null,
    teamID = null
) => {
    try {
        const user = await userModel.getUserByFirebaseId(uid);
        if (
            user.role !== "Super Admin" &&
            user.role !== "Aardvark Games Employee" &&
            (user.role !== "University Admin" ||
                !checkFacilitatorTournament(tournamentID, user.userID))
        ) {
            throw createHttpError(403);
        }
        tournamentID = validateInteger(tournamentID, "tournamentID");
        teamID = validateInteger(teamID, "teamID");
        const team = await TeamModel.getTeamById(teamID, false);
        if (team.length === 0) {
            throw new Error(
                "Team is not approved. Please approve team before adding them to this tournament."
            );
        }
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
 * @param {string} uid - FirebaseUID of the user trying to perform the action.
 * @param {number|string} tournamentID - ID of the tournament.
 * @param {number|string} teamID - ID of the team.
 * @returns {Promise<void>}
 * @throws {Error} Throws an error if the participant is not found or removal fails.
 */
const removeTournamentParticipant = async (
    uid,
    tournamentID = null,
    teamID = null
) => {
    try {
        const user = await userModel.getUserByFirebaseId(uid);
        if (
            user.role !== "Super Admin" &&
            user.role !== "Aardvark Games Employee" &&
            (user.role !== "University Admin" ||
                !checkFacilitatorTournament(tournamentID, user.userID))
        ) {
            throw createHttpError(403);
        }
        tournamentID = validateInteger(tournamentID, "tournamentID");
        teamID = validateInteger(teamID, "teamID");
        const existingParticipant =
            await TournamentModel.searchTournamentParticipants(
                tournamentID,
                teamID
            );
        if (!existingParticipant || existingParticipant.length === 0) {
            throw new Error("Team not found in this tournament.");
        }
        await TournamentModel.removeTournamentParticipant(tournamentID, teamID);
    } catch (error) {
        throw error;
    }
};

/**
 * Searches for tournament participants based on provided criteria.
 * @param {number} tournamentID - ID of the tournament.
 * @param {number} teamID - ID of the team.
 * @param {string} teamName - Name of the team.
 * @param {number} teamLeaderID - ID of the team leader.
 * @param {string} teamLeaderName - Name of the team leader.
 * @param {number} round - Round number.
 * @param {number} byes - Number of byes.
 * @param {string} status - Participant status.
 * @param {string} bracketSide - Bracket side ("left" or "right").
 * @param {number} nextMatchID - ID of the next match.
 * @param {number} universityID - ID of the university.
 * @param {string} universityName - Name of the university.
 * @param {boolean} isApproved - Approval status.
 * @param {string} sortBy - Field to sort by.
 * @param {boolean} sortAsDescending - If true, sorts in descending order.
 * @returns {Promise<object[]|null>} Returns an array of participant records or null.
 * @throws {Error} Throws an error if the search fails.
 */
const searchTournamentParticipants = async (
    tournamentID = null,
    teamID = null,
    teamName = null,
    teamLeaderID = null,
    teamLeaderName = null,
    round = null,
    byes = null,
    status = null,
    bracketSide = null,
    nextMatchID = null,
    universityID = null,
    universityName = null,
    isApproved = true,
    sortBy = null,
    sortAsDescending = false
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
 * @param {number} nextMatchID - ID of the next match or null.
 * @param {number} bracketOrder - New order in the bracket.
 * @returns {Promise<object>} Returns the updated participant record.
 * @throws {Error} Throws an error if the update fails.
 */
const updateTournamentParticipant = async (
    tournamentID = null,
    teamID = null,
    round = null,
    byes = null,
    status = null,
    bracketSide = null,
    nextMatchID = null,
    bracketOrder = null
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
 * Updates a tournament participant's details.
 * @param {string} uid - FirebaseUID of the user trying to perform the action.
 * @param {number|string} tournamentID - ID of the tournament.
 * @param {number|string} teamID - ID of the team.
 * @param {number} round - New round number.
 * @param {number} byes - New bye count.
 * @param {string} status - New participant status.
 * @param {string} bracketSide - New bracket side ("left" or "right").
 * @param {number} nextMatchID - ID of the next match or null.
 * @param {number} bracketOrder - New order in the bracket.
 * @returns {Promise<object>} Returns the updated participant record.
 * @throws {Error} Throws an error if the update fails.
 */
const disqualifyTournamentParticipant = async (
    uid = null,
    tournamentID = null,
    teamID = null,
    round = null,
    byes = null,
    status = null,
    bracketSide = null,
    nextMatchID = null,
    bracketOrder = null
) => {
    try {
        const user = await userModel.getUserByFirebaseId(uid);
        if (
            user.role !== "Super Admin" &&
            user.role !== "Aardvark Games Employee" &&
            (user.role !== "University Admin" ||
                !checkFacilitatorTournament(tournamentID, user.userID)) &&
            (user.role !== "Tournament Facilitator" ||
                !checkFacilitatorTournament(tournamentID, user.userID))
        ) {
            throw createHttpError(403);
        }
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
 * @param {string} uid - FirebaseUID of the user trying to perform the action.
 * @param {number|string} tournamentID - ID of the tournament.
 * @param {number|string} userID - ID of the facilitator.
 * @returns {Promise<void>}
 * @throws {Error} Throws an error if the facilitator already exists or if the operation fails.
 */
const addTournamentFacilitator = async (
    uid,
    tournamentID = null,
    userID = null
) => {
    try {
        const user = await userModel.getUserByFirebaseId(uid);
        if (
            user.role !== "Super Admin" &&
            user.role !== "Aardvark Games Employee" &&
            (user.role !== "University Admin" ||
                !checkFacilitatorTournament(tournamentID, user.userID))
        ) {
            throw createHttpError(403);
        }
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
 * @param {string} uid - FirebaseUID of the user trying to perform the action.
 * @param {number|string} tournamentID - ID of the tournament.
 * @param {number|string} userID - ID of the facilitator.
 * @returns {Promise<void>}
 * @throws {Error} Throws an error if the facilitator is not found or if the removal fails.
 */
const removeTournamentFacilitator = async (
    uid,
    tournamentID = null,
    userID = null
) => {
    try {
        const user = await userModel.getUserByFirebaseId(uid);
        if (
            user.role !== "Super Admin" &&
            user.role !== "Aardvark Games Employee" &&
            (user.role !== "University Admin" ||
                !checkFacilitatorTournament(tournamentID, user.userID))
        ) {
            throw createHttpError(403);
        }
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
 * @param {number} tournamentID - ID of the tournament.
 * @param {number} userID - ID of the facilitator.
 * @param {string} name - Facilitator's name.
 * @param {string} email - Facilitator's email.
 * @param {number} universityID - University ID.
 * @returns {Promise<object[]|null>} Returns an array of facilitator records or null.
 * @throws {Error} Throws an error if the search fails.
 */
const searchTournamentFacilitators = async (
    tournamentID = null,
    userID = null,
    name = null,
    email = null,
    universityID = null
) => {
    try {
        const tournament = await TournamentModel.searchTournamentFacilitators(
            tournamentID,
            userID,
            name,
            email,
            universityID
        );
        return tournament;
    } catch (error) {
        throw error;
    }
};

/**
 * Starts a tournament by shuffling participants, assigning bracket sides,
 * and scheduling the first round of matches.
 * @param {number|string} tournamentID - ID of the tournament.
 * @returns {Promise<void>}
 * @throws {Error} Throws an error if the user is unauthorized or if the tournament cannot be started.
 */
const startTournament = async (tournamentID) => {
    try {
        // Validate that tournamentID is a proper integer
        tournamentID = validateInteger(tournamentID, "tournamentID");

        // Fetch and randomly shuffle all active participants
        const shuffleParticipants =
            await TournamentModel.searchTournamentParticipants(
                tournamentID,
                null,
                null,
                null,
                null,
                null,
                null,
                "active", // status filter
                null,
                null,
                null,
                null,
                null,
                "RAND()" // random sort order
            );

        const numParticipants = shuffleParticipants.length;
        let leftSide, rightSide;

        // Distribute teams between left and right bracket sides based on team count mod 4
        // These conditions help balance the bracket layout for odd-sized pools
        if (numParticipants % 4 == 0) {
            leftSide = shuffleParticipants.slice(0, numParticipants / 2);
            rightSide = shuffleParticipants.slice(numParticipants / 2);
        } else if (numParticipants % 4 == 1) {
            leftSide = shuffleParticipants.slice(
                0,
                Math.ceil(numParticipants / 2)
            );
            rightSide = shuffleParticipants.slice(
                Math.ceil(numParticipants / 2)
            );
        } else if (numParticipants % 4 == 2) {
            leftSide = shuffleParticipants.slice(0, numParticipants / 2 + 1);
            rightSide = shuffleParticipants.slice(numParticipants / 2 + 1);
        } else {
            leftSide = shuffleParticipants.slice(
                0,
                Math.ceil(numParticipants / 2) + 1
            );
            rightSide = shuffleParticipants.slice(
                Math.floor(numParticipants / 2)
            );
        }

        // Sanity check to ensure all participants were assigned
        if (rightSide.length + leftSide.length != numParticipants) {
            throw new Error("Mathing error.");
        }

        // Assign bracket metadata (round, side, order) to each team on the left
        let bracketOrder = 1;
        for (const item of leftSide) {
            await updateTournamentParticipant(
                tournamentID,
                item.TeamID,
                1, // Round number
                0, // Bye count
                "active", // Status
                "left", // Bracket side
                null, // Next match ID
                bracketOrder
            );
            bracketOrder++;
        }

        // Repeat for right-side teams
        bracketOrder = 1;
        for (const item of rightSide) {
            await updateTournamentParticipant(
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
        }

        // Update tournament status
        await TournamentModel.updateTournamentDetails(
            tournamentID,
            null,
            nill,
            null,
            "Active"
        );

        // Generate the first round of matches for both bracket sides
        await nextRound(tournamentID, "left", 1);
        await nextRound(tournamentID, "right", 1);
    } catch (error) {
        // Let the caller handle the error
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
        // Get total number of participants to calculate how many rounds are needed
        const totalParticipants =
            await TournamentModel.searchTournamentParticipants(tournamentID);
        const totalRounds = Math.ceil(Math.log2(totalParticipants.length));

        // Get all active participants in the given round and bracket side
        const participants = await searchTournamentParticipants(
            tournamentID,
            null,
            null,
            null,
            null,
            round,
            null,
            "active",
            bracketSide
        );

        let numParticipants = participants.length;

        // Final round logic: check if a match can be scheduled with the other bracket side
        if (round === totalRounds) {
            let otherBracketSide;
            if (bracketSide === "left") {
                otherBracketSide = "right";
            } else {
                otherBracketSide = "left";
            }

            // Check if the opposing side has only one remaining team
            const otherSideParticipants = await searchTournamentParticipants(
                tournamentID,
                null,
                null,
                null,
                null,
                null,
                null,
                "active",
                otherBracketSide
            );

            // If both sides have one team each, create the final match
            if (otherSideParticipants.length === 1) {
                const now = new Date();
                createMatch(
                    tournamentID,
                    participants[0].TeamID,
                    otherSideParticipants[0].TeamID,
                    Date(now.getTime() + 15 * 60 * 1000) // Schedule 15 minutes from now
                );
            }

            // If only one team left, give it a BYE to next round
        } else if (numParticipants === 1) {
            const team = participants[0];
            await updateTournamentParticipant(
                tournamentID,
                team.TeamID,
                team.Round + 1, // Advance to next round
                team.Byes + 1, // Add a BYE
                "active",
                null,
                null,
                0
            );

            // Recursively move them to the next round
            await nextRound(tournamentID, bracketSide, round + 1);

            // If even number of participants, pair them up and create matches
        } else if (numParticipants % 2 === 0) {
            for (let i = 0; i < numParticipants; i += 2) {
                const team1 = participants[i];
                const team2 = participants[i + 1];
                const now = new Date();
                await createMatch(
                    tournamentID,
                    team1.TeamID,
                    team2.TeamID,
                    Date(now.getTime() + 15 * 60 * 1000)
                );
            }

            // Odd number of teams: assign a BYE and try again
        } else {
            // Select the participant with the fewest BYEs and earliest creation date
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
                    null,
                    "Byes, TeamCreatedAt"
                )
            )[0];

            // Advance the BYE team
            await updateTournamentParticipant(
                tournamentID,
                byeTeam.TeamID,
                byeTeam.TeamRound + 1,
                byeTeam.TeamByeCount + 1
            );

            // Fetch updated list of participants for this round and side
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
                null,
                "BracketOrder"
            );

            numParticipants = updatedParticipants.length;

            // Now with an even number, create the matches
            if (numParticipants % 2 === 0) {
                for (let i = 0; i < numParticipants; i += 2) {
                    const team1 = updatedParticipants[i];
                    const team2 = updatedParticipants[i + 1];
                    const now = new Date();
                    await createMatch(
                        tournamentID,
                        team1.TeamID,
                        team2.TeamID,
                        Date(now.getTime() + 15 * 60 * 1000)
                    );
                }
            } else {
                // Something went wrong — still an odd number after BYE
                throw new Error("Mathing error when generating next round.");
            }
        }
    } catch (error) {
        // Re-throw any error to be handled by calling function
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
 * @param {number|string} matchID - ID for the match.
 * @param {number|string} tournamentID - ID for the tournament.
 * @param {string} bracketSide - Bracket side filter.
 * @param {number|string} teamID - ID for a team.
 * @param {string} before - Latest datetime (inclusive) for matches ("YYYY-MM-DD HH:mm:ss").
 * @param {string} after - Earliest datetime (inclusive) for matches ("YYYY-MM-DD HH:mm:ss").
 * @param {string} sortBy - Field to sort by.
 * @param {string|boolean} sortAsDescending - If true, sorts in descending order.
 * @param {number|string} winnerID - Winner ID filter.
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
            const match = await TournamentModel.searchMatches(matchID);
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
 * @param {string} uid - FirebaseUID of the user trying to perform the action.
 * @param {number|string} matchID - ID of the match to update.
 * @param {number|string} winnerID - ID for the winning team.
 * @param {number|string} score1 - Score for team one.
 * @param {number|string} score2 - Score for team two.
 * @returns {Promise<object>} Returns the updated match result.
 * @throws {Error} Throws an error if any parameter validation fails or the update fails.
 */
const updateMatchResult = async (uid, matchID, score1, score2) => {
    try {
        // Get tournament ID to validate facilitator of tournament
        const tournamentID = searchMatches(matchID)[0].TournamentID;
        if (!tournamentID || tournamentID === null) {
            throw new Error("Error finding tournament for this match.");
        }
        const user = await userModel.getUserByFirebaseId(uid);
        if (
            user.role !== "Super Admin" &&
            user.role !== "Aardvark Games Employee" &&
            (user.role !== "University Admin" ||
                !checkFacilitatorTournament(tournamentID, user.userID)) &&
            (user.role !== "Tournament Facilitator" ||
                !checkFacilitatorTournament(tournamentID, user.userID))
        ) {
            throw createHttpError(403);
        }
        // Validate input parameters
        matchID = validateInteger(matchID, "matchID");
        score1 = validateInteger(score1, "score1");
        score2 = validateInteger(score2, "score2");

        // Disallow ties — the system requires a clear winner
        if (score1 === score2) {
            console.error("Score1 and Score2 are equal. No ties allowed.");
            throw new Error("There are no ties! Please choose a winner.");
        }

        // Fetch the match using matchID
        const match = await searchMatches(matchID);

        // Ensure the match exists
        if (!match) throw new Error("Could not find match");

        // Get participant information for Team1 to identify round and bracket side
        const participants = await searchTournamentParticipants(
            match.TournamentID,
            match.Team1ID
        );

        // Ensure participant information is available
        if (!participants || participants.length === 0)
            throw new Error("Could not retrieve participant info for Team1.");

        const currentRound = participants[0].TeamRound;
        const bracketSide = participants[0].TeamBracketSide;

        // Handle the case where Team1 is the winner
        if (score1 > score2) {
            // Update match record with winner and scores
            await TournamentModel.updateMatchResult(
                match.MatchID,
                match.Team1ID,
                score1,
                score2
            );

            // Advance Team1 to the next round
            await updateTournamentParticipant(
                match.TournamentID,
                match.Team1ID,
                currentRound + 1
            );

            // Mark Team2 as "lost" and disqualify from future rounds
            await updateTournamentParticipant(
                match.TournamentID,
                match.Team2ID,
                null,
                null,
                "lost",
                null,
                -1,
                null
            );
        } else {
            // Handle the case where Team2 is the winner
            await TournamentModel.updateMatchResult(
                match.MatchID,
                match.Team2ID,
                score1,
                score2
            );

            // Advance Team2 to the next round
            await updateTournamentParticipant(
                match.TournamentID,
                match.Team2ID,
                currentRound + 1
            );

            // Mark Team1 as "lost" and disqualify from future rounds
            await updateTournamentParticipant(
                match.TournamentID,
                match.Team1ID,
                null,
                null,
                "lost",
                null,
                -1,
                null
            );
        }

        // Check if there are any remaining active teams in the current round for this bracket side
        const remainingActive = await searchTournamentParticipants(
            match.TournamentID,
            null,
            null,
            null,
            null,
            currentRound,
            null,
            "active",
            bracketSide
        );

        // If all matches in this round are completed, initiate the next round
        if (!remainingActive || remainingActive.length === 0) {
            await nextRound(match.TournamentID, bracketSide, currentRound + 1);
        }

        // Return the updated match result
        return await searchMatches(matchID);
    } catch (error) {
        // Log and rethrow any errors for upstream handling
        console.error("Error in updateMatchResult:", error);
        throw error;
    }
};

module.exports = {
    createTournament,
    searchTournaments,
    updateTournamentDetails,
    deleteTournament,
    getTournamentBracket,
    addTournamentParticipant,
    removeTournamentParticipant,
    searchTournamentParticipants,
    updateTournamentParticipant,
    disqualifyTournamentParticipant,
    addTournamentFacilitator,
    removeTournamentFacilitator,
    searchTournamentFacilitators,
    startTournament,
    createMatch,
    searchMatches,
    updateMatchResult,
};
