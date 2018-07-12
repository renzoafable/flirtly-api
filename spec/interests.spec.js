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
});
