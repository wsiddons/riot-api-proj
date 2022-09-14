const express = require('express')
const cors = require('cors')
const axios = require('axios')

const app = express()
app.use(cors())

const API_KEY = 'RGAPI-cfb376c4-c7dc-4d16-ad66-3c446092381b'

// get past5 games from user
//localhost:4000/past5games


const getPlayerPUUID = async (playerName) => {
    // const response = await axios.get(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${playerName}?api_key=${API_KEY}`)
    // console.log(response.data)
    // return response.data.puuid
    return axios.get(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${playerName}?api_key=${API_KEY}`)
        .then(response => {
            // console.log(response.data)
            return response.data.puuid
        }).catch(err => err)
}

const getPlayerId = async (playerName) => {
    return axios.get(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${playerName}?api_key=${API_KEY}`)
        .then(response => {
            return response.data.id
        }).catch(err => err)
}

app.get('/past5games', async (req, res) => {
    const playerName = req.query.username
    const PUUID = await getPlayerPUUID(playerName)
    const API_CALL = `https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${PUUID}/ids?api_key=${API_KEY}`

    const gameIds = await axios.get(API_CALL)
        .then(response => response.data)
        .catch(err => err)
    // console.log(gameIds)

    var matchDataArray = []
    for (let i = 0; i < gameIds.length - 15; i++) {
        const matchId = gameIds[i]
        const matchData = await axios.get(`https://americas.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${API_KEY}`)
            .then(response => response.data)
            .catch(err => err)
        matchDataArray.push(matchData)
    }
    res.json(matchDataArray)
})

app.get('/summoner-info', async (req, res) => {
    const playerName = req.query.username
    // console.log(playerName)
    const playerId = await getPlayerId(playerName)
    const playerData = await axios.get(`https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/${playerId}?api_key=${API_KEY}`)
        .then(response => response.data)
        .catch(err => err)
    // res.json(playerData)
    res.send(playerData)
})

app.listen(4000, function () {
    console.log('server started on port 4000')
}) //localhost:4000