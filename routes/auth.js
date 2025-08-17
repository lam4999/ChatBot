const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

const router = express.Router();
const SECRET = "secretkey";

// Đăng ký
router.post("/register", (req, res) => {
    const { username, password } = req.body;
    const hash = bcrypt.hashSync(password, 10);

    db.query("INSERT INTO users (username, password) VALUES (?, ?)", [username, hash], (err) => {
        if (err) return res.status(400).json({ msg: "User already exists!" });
        res.json({ msg: "Register success" });
    });
});

// Đăng nhập
router.post("/login", (req, res) => {
    const { username, password } = req.body;
    db.query("SELECT * FROM users WHERE username = ?", [username], (err, result) => {
        if (err || result.length === 0) return res.status(400).json({ msg: "User not found" });

        const user = result[0];
        if (!bcrypt.compareSync(password, user.password)) return res.status(400).json({ msg: "Wrong password" });

        const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: "1h" });
        res.json({ token });
    });
});

module.exports = router;
