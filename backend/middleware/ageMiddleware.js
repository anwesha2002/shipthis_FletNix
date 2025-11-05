const applyAgeFilter = (query, userAge) => {
    if (!userAge || userAge < 18) {
        query.rating = { $not: /R/i };
    }
    return query;
};

const checkAgeRestriction = (show, userAge) => {
    if ((!userAge || userAge < 18) && show.rating && /R/i.test(show.rating)) {
        return false;
    }
    return true;
};

module.exports = { applyAgeFilter, checkAgeRestriction };