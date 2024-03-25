import crypto from "crypto";

const cryptoConfig = require("../config/crypto");

class CryptoHelper {

    private algorithm: string;
    private secretKey: string;

    constructor() {
        this.algorithm = cryptoConfig.algorithm;
        this.secretKey = crypto
            .createHash("sha256")
            .update(String(cryptoConfig.secret))
            .digest("hex")
            .substring(0, 32);
    }

    encrypt(text: string): string {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(this.algorithm, this.secretKey, iv);
        const encrypt = Buffer.concat([cipher.update(text, "utf-8"), cipher.final()]);
        return `${iv.toString("hex")}:${encrypt.toString("hex")}`;
    }

    decrypt(hash: string): string {
        const [ivText, encryptText] = hash.split(":");
        const iv = Buffer.from(ivText, "hex");
        const encrypt = Buffer.from(encryptText, "hex");
        const decipher = crypto.createDecipheriv(this.algorithm, this.secretKey, iv);
        const decrypt = Buffer.concat([decipher.update(encrypt), decipher.final()]);
        return decrypt.toString("utf-8");
    }
}
const cryptoHelper = new CryptoHelper();

export default cryptoHelper;
