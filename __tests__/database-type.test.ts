import { DatabaseError, DatabaseRetrieveNoResultError } from "@/backend/modules/errors"
import {describe, expect, it} from "vitest"

describe("database type tests", () => {

    it("child database class should be instance of parent", () => {
        
        const err = new DatabaseRetrieveNoResultError("test")
        const res = err instanceof DatabaseError
        
        expect(res).toBeTruthy()
      })
})



