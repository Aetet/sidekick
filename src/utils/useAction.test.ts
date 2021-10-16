import * as useAction from "./useAction"
// @ponicode
describe("useAction.useCreateScenario", () => {
    test("0", () => {
        let callFunction: any = () => {
            useAction.useCreateScenario()
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("registerAndRun", () => {
    let inst: any

    beforeEach(() => {
        inst = new useAction.ScenarioStore(undefined)
    })

    test("0", () => {
        let callFunction: any = () => {
            inst.registerAndRun([])
        }
    
        expect(callFunction).not.toThrow()
    })
})
