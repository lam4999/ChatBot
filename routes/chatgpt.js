const express = require("express");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const db = require("../db");

const router = express.Router();
const SECRET = "secretkey";

// hàm kiểm tra token
function authMiddleware(req, res, next) {
    const token = req.headers["authorization"];
    if (!token) return res.status(401).json({ msg: "No token" });

    jwt.verify(token, SECRET, (err, user) => {
        if (err) return res.status(403).json({ msg: "Invalid token" });
        req.user = user;
        next();
    });
}

// API chat
router.post("/", authMiddleware, async (req, res) => {
    const { question } = req.body;

    try {
        // gọi chatgpt api
        const response = await axios.post("https://api.openai.com/v1/chat/completions", {
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: question }]
        }, {
            headers: {
                "Authorization": `Bearer YOUR_OPENAI_API_KEY`,
                "Content-Type": "application/json"
            }
        });

        const answer = response.data.choices[0].message.content;

        // Lưu vào DB
        db.query("INSERT INTO chats (user_id, question, answer) VALUES (?, ?, ?)",
            [req.user.id, question, answer]);

        res.json({ answer });

    } catch (error) {
        res.status(500).json({ msg: "ChatGPT error", error: error.message });
    }
});

module.exports = router;
