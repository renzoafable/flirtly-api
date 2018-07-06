const queries = {
  requestConnection: `
    CALL requestConnection(?,?)
  `,
  getPendingRequest: `
    SELECT * FROM connections WHERE connectionID=? AND userID=? AND confirmed=0
  `,
  getConnectionsOfUser: `
    SELECT connectionID, connectionName, dateAdded FROM connections WHERE userID=? AND confirmed=1
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
    SELECT connectionID, connectionName, confirmed, dateAdded FROM connections WHERE userID=? AND confirmed = 0
  `,
  getReceivedConnections: `
    SELECT userID, userName, confirmed, dateAdded FROM connections WHERE connectionID=? and confirmed = 0
  `,
  approveReceivedConnections: `
    CALL approveReceivedConnection(?,?)
  `,
  deleteConnection: `
    DELETE FROM connections WHERE userID = ? AND connectionID = ?
  `
};

module.exports = queries;