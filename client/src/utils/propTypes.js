import PropTypes from "prop-types";

const User = PropTypes.shape({
    userId: PropTypes.number.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    firebaseUid: PropTypes.string.isRequired,
    profileImageURL: PropTypes.string.isRequired,
    bio: PropTypes.string,
    createdAt: PropTypes.string,
    paid: PropTypes.bool,
    teamID: PropTypes.number,
    roleID: PropTypes.bool,
    universityID: PropTypes.number,
    isValidated: PropTypes.bool,
});

export default { ...PropTypes, User };
