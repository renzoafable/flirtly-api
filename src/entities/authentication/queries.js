const authQueries = {
  getUser: `SELECT * FROM users where username=?`,
  addUser: `CALL addUser(?,?,?,?,?,?,?,?,?,?)`,
  getUserByUserID: `CALL getUserByUserID(?)`,
}

module.exports = authQueries;