const express = require('express')
const app = express()
app.use(express.static("public"))

const authRouter = require('./routes/auth')
app.use('/auth', authRouter)

const getGamesRouter = require('./routes/getownedgames')
app.use('/getownedgames', getGamesRouter)

const getGameImgRouter = require('./routes/getgameimg')
app.use('/getgameimg', getGameImgRouter)

const getAchievementsRouter = require('./routes/achievements')
app.use('/achievements', getAchievementsRouter)

app.listen(3000)
  
