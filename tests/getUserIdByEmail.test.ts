import { QueryParams, fbClient } from "src/backend/modules/firebase-client";
import {expect, it} from "vitest"

import { TEST_USER } from "src/backend/modules/test-data";

it("getUserIdByEmail should not fail and have some kind of value", async() => {
    const query = QueryParams.fromUserEmail(TEST_USER)
    const res = await fbClient.queryDb(query)
    console.log(res)
    expect(res).toBeTruthy()
})