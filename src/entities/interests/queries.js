const queries = {
  addInterest: `CALL addInterest(?,?)`,
  getUserWithInterests: `
    SELECT 
      GROUP_CONCAT(interests.interest) as Interests
    FROM
      users,
      interests
    WHERE
      users.userID=?
      AND users.userID=interests.userID
    GROUP BY
      users.userID
  `,
};

module.exports = queries;