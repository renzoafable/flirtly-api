const queries = {
  requestConnection: `
    CALL requestConnection(?,?)
  `,
  getPendingRequest: `
    SELECT * FROM connections WHERE connectionID=? AND userID=? AND confirmed=0
  `,
  getConnectionsOfUser: `
    SELECT connectionID AS User_ID, connectionName AS User_Name, dateAdded FROM connections WHERE userID=? AND confirmed=1
  `,
  getConnectionOfUser: `
    SELECT * FROM connections WHERE userID=? AND connectionID=? AND confirmed=1
  `,
  getAllConnections: `
    CALL getAllConnections(?,?)
  `,
  getSentConnections: `
    SELECT connectionID, connectionName, confirmed, dateAdded FROM connections WHERE userID=?
  `,
  getReceivedConnections: `
    SELECT userID, userName, confirmed, dateAdded FROM connections WHERE connectionID=?
  `,
  approveReceivedConnections: `
    CALL approveReceivedConnection(?,?)
  `,
};

module.exports = queries;