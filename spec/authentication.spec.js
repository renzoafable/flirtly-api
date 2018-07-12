const authCtrl = require('../src/entities/authentication/controller');

describe('authCtrl', () => {
  let controller;

  describe('signin', () => {
    it('should return error 500 with correct message if internal server error', (done) => {
      // arrange
      const mockRepo = jasmine.createSpyObj('mockRepo', ['signin']);
      const mockBcrypt = null;

      const mockReq = {
        session: {
        },
        body: {
          user: {
            userId: 1
          }
        }
      };

      const mockRes = jasmine.createSpyObj('mockRes', ['status', 'json']);

      mockRepo.signin.and.callFake(() => {
        return Promise.reject(500);
      });

      controller = authCtrl(mockRepo, mockBcrypt);

      mockRes.json.and.callFake((param) => {
        // assert
        expect(mockRepo.signin).toHaveBeenCalledWith(mockReq.body);
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(param).toEqual({
          status: 500,
          message: 'Internal server error on sign in'
        });
        done();
      });

      // act
      controller.signin(mockReq, mockRes);
    });

    it('should return status 200 with correct message if successful', (done) => {
      // arrange
      const mockRepo = jasmine.createSpyObj('mockRepo', ['signin']);
      const mockBcrypt = null;

      const mockReq = {
        session: {
        },
        body: {
          user: {
            userId: 1
          }
        }
      };

      const mockRes = jasmine.createSpyObj('mockRes', ['status', 'json']);

      const mockUser = {
        userId: 1,
        username: 'mark',
        password: 'hello'
      }

      mockRepo.signin.and.callFake(() => {
        return Promise.resolve(mockUser);
      });

      controller = authCtrl(mockRepo, mockBcrypt);

      mockRes.json.and.callFake((param) => {
        // assert
        expect(mockReq.session.user).toEqual(mockUser);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(param).toEqual({
          status: 200,
          message: 'Successfully signed in',
          data: {
            userId: mockUser.userId,
            username: mockUser.username
          }
        })
        done();
      });

      // act
      controller.signin(mockReq, mockRes);
    });

    it('should return status 400 with correct message if invalid credentials', (done) => {
      // arrange
      const mockRepo = jasmine.createSpyObj('mockRepo', ['signin']);
      const mockBcrypt = null;

      const mockReq = {
        session: {},
        body: {
          user: {
            userId: 1,
            password: 'adasdad'
          }
        }
      };

      const mockRes = jasmine.createSpyObj('mockRes', ['status', 'json']);

      mockRepo.signin.and.callFake(() => {
        return Promise.reject(400);
      });

      controller = authCtrl(mockRepo, mockBcrypt);

      mockRes.json.and.callFake((param) => {
        // assert
        expect(mockRepo.signin).toHaveBeenCalledWith(mockReq.body);
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(param).toEqual({
          status: 400,
          message: 'Invalid credentials'
        });
        done();
      });

      // act
      controller.signin(mockReq, mockRes);
    });

    it('should return status 404 if user does not exist', (done) => {
      const mockRepo = jasmine.createSpyObj('mockRepo', ['signin']);
      const mockBcrypt = null;

      const mockReq = {
        session: {},
        body: {
          user: {
            username: 'lbafable',
            password: 'adasdsd'
          }
        }
      }
      const mockRes = jasmine.createSpyObj('mockRes', ['status', 'json']);

      mockRepo.signin.and.callFake(() => {
        return Promise.reject(404);
      });

      controller = authCtrl(mockRepo, mockBcrypt);

      mockRes.json.and.callFake((param) => {
        expect(mockRepo.signin).toHaveBeenCalledWith(mockReq.body);
        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(param).toEqual({
          status: 404,
          message: 'User not found'
        });
        done();
      });

      controller.signin(mockReq, mockRes);
    });
  });

  describe('getSession', () => {
    it('should return status 200 with null user if session does not exists', (done) => {
      const mockRepo = null;
      const mockBcrypt = null;

      const mockReq = {
        session: {}
      }

      const mockRes = jasmine.createSpyObj('mockRes', ['status', 'json']);

      controller = authCtrl(mockRepo, mockBcrypt);

      mockRes.json.and.callFake((param) => {
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(param).toEqual({
          status: 200,
          message: 'Successfully fetched session',
          data: mockReq.session.user ? mockReq.session.user : null
        });
        done();
      });

      controller.getSession(mockReq, mockRes);
    });

    it('should return status 200 with user if session exists', (done) => {
      const mockRepo = null;
      const mockBcrypt = null;

      const mockReq = {
        session: {
          user: {
            username: 'Renzo'
          }
        }
      }
      const mockRes = jasmine.createSpyObj('mockRes', ['status', 'json']);

      controller = authCtrl(mockRepo, mockBcrypt);

      mockRes.json.and.callFake((param) => {
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(param).toEqual({
          status: 200,
          message: 'Successfully fetched session',
          data: mockReq.session.user ? mockReq.session.user : null
        });
        done();
      });

      controller.getSession(mockReq, mockRes);
    });
  });

  describe('signout', () => {
    it('should return status 400 if no user is signed in', done => {
      const mockRepo = null;
      const mockBcrypt = null;

      const mockReq = {
        session: {}
      }
      const mockRes = jasmine.createSpyObj('mockRes', ['status', 'json']);

      controller = authCtrl(mockRepo, mockBcrypt);

      mockRes.json.and.callFake(response => {
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(response).toEqual({
          status: 400,
          message: 'No user is signed in'
        });
        done();
      });

      controller.signout(mockReq, mockRes);
    })
  });
});