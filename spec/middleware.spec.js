const middlewares = require("../src/entities/middlewares/middleware");

describe("middleware", () => {
  let middleware;

  describe("isLoggedIn", () => {
    it("should return next() if user is signed in", () => {
      const mockReq = {
        session: {
          user: {
            username: "Renzo",
            password: "Hello"
          }
        }
      };
      const mockRes = jasmine.createSpyObj("mockRes", ["status", "json"]);
      const mockNext = jasmine.createSpy("mockNext", () => {});

      middleware = middlewares();
      middleware.isLoggedIn(mockReq, mockRes, mockNext);

      expect(mockReq.session.user).toBeTruthy(true);
      expect(mockNext).toHaveBeenCalled();
    });

    it("should return status 401 if no user is signed in", () => {
      const mockReq = {
        session: {}
      };
      const mockRes = jasmine.createSpyObj("mockRes", ["status", "json"]);
      const mockNext = jasmine.createSpy("mockNext", () => {});

      middleware = middlewares();
      middleware.isLoggedIn(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 401,
        message: "You must be logged in"
      });
    });
  });

  describe("isSameUser", () => {
    it("should return next() if signed in user is not same as userID param", () => {
      const mockReq = {
        session: {
          user: {
            userID: 1,
            username: "Renzo",
            password: "Hello"
          }
        },
        params: {
          userID: 2
        }
      };
      const mockRes = jasmine.createSpyObj("mockRes", ["status", "json"]);
      const mockNext = jasmine.createSpy("mockNext", () => {});

      middleware = middlewares();
      middleware.isSameUser(mockReq, mockRes, mockNext);

      expect(mockReq.session.user).toBeTruthy(true);
      expect(mockNext).toHaveBeenCalled();
    });
  });
});
