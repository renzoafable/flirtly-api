const messagesCtrl = require("../src/entities/messages/controller");

describe("messagesCtrl", () => {
  let controller;

  describe("getMessages", () => {
    it("should return status 200 if messages successfully fetched", done => {
      const mockRepo = jasmine.createSpyObj("mockRepo", ["getMessages"]);

      const mockReq = {
        session: {
          user: {
            username: "Renzo",
            password: "Hello"
          }
        }
      };
      const mockRes = jasmine.createSpyObj("mockRes", ["status", "json"]);

      mockRepo.getMessages.and.callFake(() => {
        return Promise.resolve("messages");
      });

      mockRes.json.and.callFake(response => {
        expect(mockReq.session.user).toBeTruthy(true);
        expect(mockRepo.getMessages).toHaveBeenCalledWith(mockReq.session.user);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(response).toEqual({
          status: 200,
          message: "Successfully fetched messages",
          data: "messages"
        });
        done();
      });

      controller = messagesCtrl(mockRepo, null);
      controller.getMessages(mockReq, mockRes);
    });

    it("should return status 500 if getMessages fails", done => {
      const mockRepo = jasmine.createSpyObj("mockRepo", ["getMessages"]);

      const mockReq = {
        session: {
          user: {
            username: "Renzo",
            password: "Hello"
          }
        }
      };
      const mockRes = jasmine.createSpyObj("mockRes", ["status", "json"]);

      mockRepo.getMessages.and.callFake(() => {
        return Promise.reject(500);
      });

      mockRes.json.and.callFake(response => {
        expect(mockReq.session.user).toBeTruthy(true);
        expect(mockRepo.getMessages).toHaveBeenCalledWith(mockReq.session.user);
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(response).toEqual({
          status: 500,
          message: "Internal server error while fetching messages"
        });
        done();
      });

      controller = messagesCtrl(mockRepo, null);
      controller.getMessages(mockReq, mockRes);
    });
  });

  describe("getSentMessages", () => {
    it("should return status 200 if sent messages successfully fetched", done => {
      const mockRepo = jasmine.createSpyObj("mockRepo", ["getSentMessages"]);

      const mockReq = {
        session: {
          user: {
            username: "Renzo",
            password: "Hello"
          }
        }
      };
      const mockRes = jasmine.createSpyObj("mockRes", ["status", "json"]);

      mockRepo.getSentMessages.and.callFake(() => {
        return Promise.resolve("sent messages");
      });

      mockRes.json.and.callFake(response => {
        expect(mockRepo.getSentMessages).toHaveBeenCalledWith(
          mockReq.session.user
        );
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(response).toEqual({
          status: 200,
          message: "Successfully fetched sent messages",
          data: "sent messages"
        });
        done();
      });

      controller = messagesCtrl(mockRepo, null);
      controller.getSentMessages(mockReq, mockRes);
    });
  });
});
