import { QueryParams, fbClient } from "src/backend/modules/firebase-client";
import {describe, expect, it} from "vitest"

import { TEST_USER } from "src/backend/modules/test-data";

describe.todo("database fetch tests", () => {
it("getUserIdByEmail should not fail and have some kind of value", async() => {
    const query = QueryParams.queryUserEmail(TEST_USER)
    const res = await fbClient.queryDbSingle(query)
    console.log(res)
    expect(res).toBeTruthy()
})
})
