const interestsCtrl = require("../src/entities/interests/controller");

describe("interestsCtrl", () => {
  let controller;

  describe("getInterests", () => {
    it("should return status 200 if interests successfully fetched", done => {
      const mockRepo = jasmine.createSpyObj("mockRepo", ["getInterests"]);

      const mockReq = {
        session: {
          user: {
            username: "Renzo",
            password: "Hello"
          }
        }
      };
      const mockRes = jasmine.createSpyObj("mockRes", ["status", "json"]);

      const mockInterests = ["badminton", "basketball", "football"];

      mockRepo.getInterests.and.callFake(() => {
        return Promise.resolve(mockInterests);
      });

      mockRes.json.and.callFake(response => {
        expect(mockRepo.getInterests).toHaveBeenCalledWith(
          mockReq.session.user
        );
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(response).toEqual({
          status: 200,
          message: "Successfully fetched interests",
          data: mockInterests
        });
        done();
      });

      controller = interestsCtrl(mockRepo);
      controller.getInterests(mockReq, mockRes);
    });

    it("should return status 500 if repo.getInterests fails", done => {
      const mockRepo = jasmine.createSpyObj("mockRepo", ["getInterests"]);

      const mockReq = {
        session: {
          user: {
            username: "Renzo",
            password: "Hello"
          }
        }
      };
      const mockRes = jasmine.createSpyObj("mockRes", ["status", "json"]);

      mockRepo.getInterests.and.callFake(() => {
        return Promise.reject(500);
      });

      mockRes.json.and.callFake(response => {
        expect(mockRepo.getInterests).toHaveBeenCalledWith(
          mockReq.session.user
        );
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(response).toEqual({
          status: 500,
          message: "Internal server error while fetching interests"
        });
        done();
      });

      controller = interestsCtrl(mockRepo);
      controller.getInterests(mockReq, mockRes);
    });

    it("should return status 500 if user does not exist", done => {
      const mockRepo = jasmine.createSpyObj("mockRepo", ["getInterests"]);

      const mockReq = {
        session: {}
      };
      const mockRes = jasmine.createSpyObj("mockRes", ["status", "json"]);

      mockRepo.getInterests.and.callFake(() => {
        return Promise.reject(500);
      });

      mockRes.json.and.callFake(response => {
        expect(mockRepo.getInterests).toHaveBeenCalledWith(
          mockReq.session.user
        );
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(response).toEqual({
          status: 500,
          message: "Internal server error while fetching interests"
        });
        done();
      });

      controller = interestsCtrl(mockRepo);
      controller.getInterests(mockReq, mockRes);
    });
  });

  describe("addInterest", () => {
    it("should return status 200 if interest is successfully added", done => {
      const mockRepo = jasmine.createSpyObj("mockRepo", ["addInterest"]);

      const mockReq = {
        session: {
          user: {
            userID: 1,
            username: "Renzo",
            password: "Hello"
          }
        },
        body: {
          interests: ["badminton", "basketball", "anime"]
        }
      };
      const mockRes = jasmine.createSpyObj("mockRes", ["status", "json"]);

      const mockArgs = {
        userID: mockReq.session.user.userID,
        interests: mockReq.body.interests
      };

      mockRepo.addInterest.and.callFake(() => {
        const body = mockReq.body.interests.map(interest =>
          Promise.resolve(interest)
        );
        return body;
      });

      mockRes.json.and.callFake(response => {
        expect(mockRepo.addInterest).toHaveBeenCalledWith(mockArgs);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(response).toEqual({
          status: 200,
          message: "Successfully added interest/s",
          data: [...mockReq.body.interests]
        });
        done();
      });

      controller = interestsCtrl(mockRepo);
      controller.addInterest(mockReq, mockRes);
    });

    it("should return status 500 if repo.addInterest fails", done => {
      const mockRepo = jasmine.createSpyObj("mockRepo", ["addInterest"]);

      const mockReq = {
        session: {
          user: {
            userID: 1,
            username: "Renzo",
            password: "Hello"
          }
        },
        body: {}
      };
      const mockRes = jasmine.createSpyObj("mockRes", ["status", "json"]);

      const mockArgs = {
        userID: mockReq.session.user.userID,
        interests: mockReq.body.interests
      };

      mockRepo.addInterest.and.callFake(() => {
        return [Promise.reject(500)];
      });

      mockRes.json.and.callFake(response => {
        expect(mockRepo.addInterest).toHaveBeenCalledWith(mockArgs);
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(response).toEqual({
          status: 500,
          message: "Internal server error while adding interest"
        });
        done();
      });

      controller = interestsCtrl(mockRepo);
      controller.addInterest(mockReq, mockRes);
    });
  });
});
