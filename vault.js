const crypto = require("crypto");
const fs = require("fs");

class PasswordVault {
    constructor(path) {
        this.path = path;
    }

    async load() {
        // if file already exists, load this
        if (fs.existsSync(this.path)) {
            const bufffer = await fs.promises.readFile(this.path);
            this.database = JSON.parse(String(buffer));
        } else {
            this.database = [];
        }
    }

    save() {
        return fs.promises.writeFile(this.path, JSON.stringify(this.database));
    }

    async add(username, password) {
        const salt = this.genSalt();
        const hashedPassword = this.hash(password, salt);
        // we need to save the salt and the hash for our `check` function
        const userRecord = { username, salt, hashedPassword };
        this.database.push(userRecord);
        await this.save();
    }

    check(username, password) {
        const record = this.getUserRecord(username);
        if (!record) {
            return false;
        }
        const hash = this.hash(password, record.salt);
        return hash === record.hashedPassword;
    }

    getUserRecord(username) {
        return this.database.find((record) => {
            return record.username === username;
        });
    }

    genSalt() {
        return crypto.randomBytes(8).toString("hex");
    }

    hash(password, salt) {
        return crypto
            .createHash("md5")
            .update(password + salt)
            .digest("hex");
    }
}

module.exports = PasswordVault;
