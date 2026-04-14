import { apiTest, expect } from "../../src/api/novus-api-test-base";
import { Get } from "../../src/api/methods/get";
import { Post } from "../../src/api/methods/post";
import { Put } from "../../src/api/methods/put";
import { Delete } from "../../src/api/methods/delete";
import { StatusCodes } from "../../src/api/methods/api-core";

/**
 * BasicApiTests — API test examples.
 * Equivalent to Java BasicApiTests class.
 */
apiTest.describe("Basic API Tests", () => {
  const BASE_URL = "https://jsonplaceholder.typicode.com";

  apiTest("Basic GET API test", async ({ apiContext }) => {
    const response = await Get.using(apiContext)
      .atUrl(`${BASE_URL}/posts/1`)
      .execute();

    response.isOk();
    response.statusCodeMatches(StatusCodes.OK);
    await response.printResponse();
  });

  apiTest("Basic POST API test", async ({ apiContext }) => {
    const response = await Post.using(apiContext)
      .atUrl(`${BASE_URL}/posts`)
      .jsonBody({
        title: "foo",
        body: "bar",
        userId: 1,
      })
      .execute();

    response.statusCodeMatches(StatusCodes.CREATED);
    await response.printResponse();
  });

  apiTest("Basic PUT API test", async ({ apiContext }) => {
    const response = await Put.using(apiContext)
      .atUrl(`${BASE_URL}/posts/1`)
      .jsonBody({
        id: 1,
        title: "updated title",
        body: "updated body",
        userId: 1,
      })
      .execute();

    response.isOk();
    await response.printResponse();
  });

  apiTest("Basic DELETE API test", async ({ apiContext }) => {
    const response = await Delete.using(apiContext)
      .atUrl(`${BASE_URL}/posts/1`)
      .execute();

    response.isOk();
    await response.printResponse();
  });
});
