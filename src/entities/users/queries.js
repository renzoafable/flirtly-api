const queries = {
  getUserByUsername: `SELECT * FROM users WHERE username=?`,
  // getUsers: `SELECT u.*, confirmed FROM users u LEFT JOIN connections c ON u.userID = c.connectionID where u.userID != ?`,
  getUsers: `CALL getUsers(?)`,
  deleteUser: `DELETE FROM users where userID=?`
};

module.exports = queries;