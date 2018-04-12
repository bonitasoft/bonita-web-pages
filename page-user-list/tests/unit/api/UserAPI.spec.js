import api from "@/api/UserAPI";
import fetchMock from "fetch-mock";

describe("UserAPI", () => {
  afterEach(() => {
    fetchMock.reset();
    fetchMock.restore();
  });

  it("should get all users", async () => {
    const expectedUsers = [
      {
        firstname: "Giovanna",
        icon: "icons/default/icon_user.png",
        creation_date: "2018-04-03 16:19:19.067",
        userName: "giovanna.almeida",
        title: "Mrs",
        created_by_user_id: "-1",
        enabled: "true",
        lastname: "Almeida",
        last_connection: "",
        password: "",
        manager_id: "17",
        id: "21",
        job_title: "Account manager",
        last_update_date: "2018-04-03 16:19:19.067"
      },
      {
        firstname: "Daniela",
        icon: "icons/default/icon_user.png",
        creation_date: "2018-04-03 16:19:18.994",
        userName: "daniela.angelo",
        title: "Mrs",
        created_by_user_id: "-1",
        enabled: "true",
        lastname: "Angelo",
        last_connection: "",
        password: "",
        manager_id: "1",
        id: "17",
        job_title: "Vice President of Sales",
        last_update_date: "2018-04-03 16:19:18.994"
      }
    ];
    fetchMock.getOnce(`../API/identity/user?p=0&c=9999`, {
      body: expectedUsers
    });

    const response = await api.getUsers();

    expect(response).toEqual(expectedUsers);
  });
});
