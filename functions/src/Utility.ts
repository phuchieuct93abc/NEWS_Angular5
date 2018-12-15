export default class Utility {
    public static extractId(idPath: string): string {
        const regex = /(\d)+(.epi)+$/gm;

        const m = regex.exec(idPath);
        return m[0].replace('.epi', '');
    }
}