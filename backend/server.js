const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

let scores = [];

// POST score
app.post('/api/scores', (req, res) => {
    const { username, score } = req.body;

    const newScore = {
        username,
        score,
        createdAt: new Date()
    };

    scores.push(newScore);

    res.status(201).json({
        message: 'Score saved successfully',
        data: newScore
    });
});

// GET leaderboard
app.get('/api/scores', (req, res) => {
    const sortedScores = scores.sort((a, b) => b.score - a.score);

    res.json(sortedScores);
});

app.listen(3000, () => {
    console.log('REST API running on port 3000');
});