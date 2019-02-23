import Utility from "../src/Utility";

describe("Utility", () => {
    it("convert 'lam phuc hieu' to 'lam-phuc-hieu'", () => {

        expect(Utility.convertSearchKeyword("lam phuc hieu")).toEqual("lam-phuc-hieu");
    });
    it("extract idPath '/title/12345.epi' to 12345", () => {
        expect(Utility.extractId('/title/12345.epi')).toEqual('12345')
    });
    it("replace 'data-src=123 data-atr=456' to 'src=123 atr=456 ", () => {
        expect(Utility.replaceAll('data-src=123 data-atr=456', 'data-', '')).toEqual('src=123 atr=456');
    })
});