import PropTypes from "prop-types";

const User = PropTypes.shape({
    UserID: PropTypes.number.isRequired,
    FirstName: PropTypes.string.isRequired,
    LastName: PropTypes.string.isRequired,
    Username: PropTypes.string.isRequired,
    Email: PropTypes.string.isRequired,
    FirebaseUID: PropTypes.string.isRequired,
    ProfileImageURL: PropTypes.string.isRequired,
    Bio: PropTypes.string,
    CreatedAt: PropTypes.string,
    Paid: PropTypes.bool,
    TeamID: PropTypes.number,
    RoleID: PropTypes.bool,
    UniversityID: PropTypes.number,
    IsValidated: PropTypes.bool,
});

export default { ...PropTypes, User };
