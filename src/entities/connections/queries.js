const queries = {
  requestConnection: `
    CALL requestConnection(?,?)
  `,
  getPendingRequest: `
    SELECT * FROM connections WHERE connectionID=? AND userID=? AND confirmed=0
  `,
  getConnectionsOfUser: `
    SELECT c.connectionID, u.firstName, u.lastName, c.dateAdded
    FROM connections c LEFT JOIN users u
    ON c.connectionID = u.userID
    WHERE c.userID = ? AND c.confirmed = 1
  `,
  getConnectionOfUser: `
    SELECT * FROM connections WHERE userID=? AND connectionID=? AND confirmed=0
  `,
  getApprovedConnection: `
    SELECT * FROM connections WHERE userID=? AND connectionID=? AND confirmed=1
  `,
  getAllConnections: `
    CALL getAllConnections(?,?)
  `,
  getSentConnections: `
    SELECT c.connectionID, u.firstName, u.lastName, c.confirmed, c.dateAdded
    FROM connections c LEFT JOIN users u
    ON c.connectionID = u.userID
    WHERE c.userID=? AND c.confirmed = 0
  `,
  getReceivedConnections: `
    SELECT c.userID, u.firstName, u.lastName, c.confirmed, c.dateAdded
    FROM connections c LEFT JOIN users u
    ON c.userID = u.userID
    WHERE c.connectionID = ? and confirmed = 0
  `,
  approveReceivedConnections: `
    CALL approveReceivedConnection(?,?)
  `,
  deleteConnection: `
    DELETE FROM connections WHERE userID = ? AND connectionID = ?
  `
};

module.exports = queries;