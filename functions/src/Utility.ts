export default class Utility {
    public static extractId(idPath: string): string {
        const regex = /(\d)+(.epi)+$/gm;

        const m = regex.exec(idPath);
        return m[0].replace('.epi', '');
    }

    public static replaceAll(str: string, placeholder: string, replacement: string): string {
        return str.replace(new RegExp(placeholder, 'g'), replacement);

    }

    public static convertSearchKeyword(keyword: string) {

        return this.replaceAll(keyword, " ", "-")
    }
}