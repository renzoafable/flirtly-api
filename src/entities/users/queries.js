const queries = {
  getUserByUsername: `SELECT * FROM users WHERE username=?`,
  getUsers: `SELECT * FROM users`,
  deleteUser: `DELETE FROM users where userID=?`
};

module.exports = queries;