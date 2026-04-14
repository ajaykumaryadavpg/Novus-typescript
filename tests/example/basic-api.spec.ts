import { apiTest } from "../../src/api/novus-api-test-base";
import { Get } from "../../src/api/methods/get";
import { Post } from "../../src/api/methods/post";
import { Put } from "../../src/api/methods/put";
import { Delete } from "../../src/api/methods/delete";

/**
 * BasicApiTests — API test examples.
 * Equivalent to Java BasicApiTests class.
 */
apiTest.describe("Basic API Tests", () => {
  apiTest("basicGetApiTest", async ({ apiContext }) => {
    const response = await Get.using(apiContext)
      .atUrl("https://jsonplaceholder.typicode.com/posts/1")
      .execute();

    response.isOk();
    await response.printResponse();
  });

  apiTest("basicPostApiTest", async ({ apiContext }) => {
    const response = await Post.using(apiContext)
      .atUrl("https://jsonplaceholder.typicode.com/posts")
      .jsonBody({
        title: "foo",
        body: "bar",
        userId: 1,
      })
      .execute();

    response.isOk();
  });

  apiTest("basicPutApiTest", async ({ apiContext }) => {
    const response = await Put.using(apiContext)
      .atUrl("https://jsonplaceholder.typicode.com/posts/1")
      .jsonBody({
        id: 1,
        title: "updated title",
        body: "updated body",
        userId: 1,
      })
      .execute();

    response.isOk();
  });

  apiTest("basicDeleteApiTest", async ({ apiContext }) => {
    const response = await Delete.using(apiContext)
      .atUrl("https://jsonplaceholder.typicode.com/posts/1")
      .execute();

    response.isOk();
  });
});
