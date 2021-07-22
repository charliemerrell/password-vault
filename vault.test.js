const fs = require("fs");
const PasswordVault = require("./vault");

describe("basic tests", () => {
    const dbPath = "./testDb.json";

    beforeEach(async () => {
        // delete the database before each test
        // for a clean slate
        if (fs.existsSync(dbPath)) {
            await fs.promises.unlink(dbPath);
        }
    });

    test("can create vault without error", () => {
        new PasswordVault(dbPath);
    });

    test("can save and check a password", async () => {
        const username = "multiverse";
        const password = "password1";
        const vault = new PasswordVault(dbPath);
        await vault.load();
        await vault.add(username, password);
        expect(vault.check(username, password)).toBe(true);
    });

    test("will invalidate wrong password", async () => {
        const username = "multiverse";
        const password = "password1";
        const vault = new PasswordVault(dbPath);
        await vault.load();
        await vault.add(username, password);
        expect(vault.check(username, "password2")).toBe(false);
    });

    test("can save multiple users", async () => {
        const vault = new PasswordVault(dbPath);
        await vault.load();
        await vault.add("user1", "password1");
        await vault.add("user2", "password2");
        await vault.add("user3", "password3");
        expect(vault.database.length).toBe(3);
    });

    test("can't login with another user's password'", async () => {
        const vault = new PasswordVault(dbPath);
        await vault.load();
        await vault.add("user1", "password1");
        await vault.add("user2", "password2");
        await vault.add("user3", "password3");
        expect(vault.check("user1", "password2")).toBe(false);
        expect(vault.check("user1", "password1")).toBe(true);
    });
});
