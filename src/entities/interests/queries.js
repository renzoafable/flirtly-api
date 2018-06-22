const queries = {
  addInterest: `CALL addInterest(?,?)`,
  getUserWithInterests: `
    SELECT
      interestID,
      interest
    FROM
      interests
    WHERE
      interests.userID=?
  `,
};

module.exports = queries;