const queries = {
  addInterest: `CALL addInterest(?,?)`,
  getUserWithInterests: `
    SELECT
      userID,
      interestID,
      interest
    FROM
      interests
    WHERE
      interests.userID=?
  `,
  deleteInterest: `
  DELETE FROM interests WHERE userID=? AND interestID=?
  `
};

module.exports = queries;