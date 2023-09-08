async function get_user_obj () {
  const response = await fetch('/auth/getuser')
  let data = await response.json()
  return data
}

async function get_owned_games (user_id) {
  const response = await fetch('/getownedgames/' + user_id) /// fix address
  let data = await response.json()
  return data
}

function adding_img (img_src, html_class){
  let imageElement = document.createElement('img')
  imageElement.src = img_src
  html_class.appendChild(imageElement)
  return
}

function adding_text (text, html_class) {
  let paragraph =  document.createElement("p");
  paragraph.textContent = text
  html_class.appendChild(paragraph)
  return
}

function adding_div (div, html_class) {
  html_class.append(div)
  return
}

/*
async function adding_game_img (img_src, html_class) {
  let imageElement = document.createElement('img')
  imageElement.src = img_src
  html_class.appendChild(imageElement)
  return
}
*/

async function get_xml_games (user_id) {
  let response = await fetch(`/getgameimg/${user_id}`)
  let xmlGames = await response.json()
  xmlGames = xmlGames[0].game

  // remove any games without playtime ie. dlc or payed content
  xmlGames = xmlGames.filter((item) => item['hoursOnRecord'] !== undefined);
  
  function parseNumberWithCommas(value) {
    value = value[0]
    return parseFloat(value.replace(/\,/g,''));
  }
  
  // Convert "hoursOnRecord" values to numbers without commas
  xmlGames.forEach((game) => {
    game.hoursOnRecord = parseNumberWithCommas(game.hoursOnRecord);
  });
  
  // Sort the array by "hoursOnRecord" in ascending order
  xmlGames.sort((a, b) => b.hoursOnRecord - a.hoursOnRecord);
  
  return xmlGames
}

async function getTopAchievements (steamid, appid) {
  // obtain needed info for finding top achievements
  let globalAchievementPercentsForGame = await fetch(`/achievements/global/${appid}`)
  let userAchievementPercentsForGame = await fetch(`/achievements/user/${steamid}/${appid}`)
  let schema = await fetch(`/achievements/getSchema/${appid}`)

  globalAchievementPercentsForGame = await globalAchievementPercentsForGame.json()
  userAchievementPercentsForGame = await userAchievementPercentsForGame.json()
  schema = await schema.json()

  // adjust info for the arrays of achievements
  globalAchievementPercentsForGame = globalAchievementPercentsForGame.achievementpercentages.achievements
  userAchievementPercentsForGame = userAchievementPercentsForGame.playerstats.achievements
  schema = schema.game.availableGameStats.achievements

  // create array to store the top achievements
  let userTopXAchievements = []
  let currentIndex = globalAchievementPercentsForGame.length - 1;

  // loop until the we have enough achievements or havent found any/enough achieved achievements
  while (currentIndex >= 0 && userTopXAchievements.length < 3) {
    // ascend the list of global achievements and assign 'userAchievement' for obtaining
    // the schema variant of achievement for the icon
    let globalAchievement = globalAchievementPercentsForGame[currentIndex]
    let achievementKey = globalAchievement.name
    let userAchievement = userAchievementPercentsForGame.find((achievement) => {
      return achievement.apiname === achievementKey
    });

    // if the user has the achievement then push the schema variant into 
    // the array and the global percentage achieved 
    if (userAchievement.achieved > 0) {
      let schemaAchievement = schema.find((achievement) => {
        return achievement.name === achievementKey
      });
      userTopXAchievements.push([schemaAchievement, globalAchievement.percent])
    }
    currentIndex--
  }



  return userTopXAchievements
}

async function game_object_to_html (sortedGameList, sortedXmlGames, amount_of_objects, user_id) {
  gameNames = document.getElementsByClassName('game-name')
  gameImgs = document.getElementsByClassName('game-img')
  gameplayTimes = document.getElementsByClassName('total-game-time')
  topAchievementsDivs = document.getElementsByClassName('top-achievements')

  for (let i = 0; i < amount_of_objects; i++) {
    let currGameName = sortedGameList[i].name
    let currGameImg = sortedXmlGames[i].logo
    let currGameTotalPlayTime = sortedXmlGames[i].hoursOnRecord
    let currGameId = sortedGameList[i].appid


    let usersTopXAchievements = await getTopAchievements(user_id, currGameId)
    userTopXAchievements = JSON.parse(JSON.stringify(usersTopXAchievements))

    let usersTopXAchievementsToHtml = []
    for (let j = 0; j < amount_of_objects; j++) {
      let achievementDiv = document.createElement('div')
      adding_text(usersTopXAchievements[j][0].displayName, achievementDiv)
      adding_img(usersTopXAchievements[j][0].icon, achievementDiv)
      adding_text(usersTopXAchievements[j][0].description, achievementDiv)
      adding_text(`Achieved by ${usersTopXAchievements[j][1].toFixed(2)}% of players`, achievementDiv)
      usersTopXAchievementsToHtml.push(achievementDiv)
    }

    adding_text(currGameName, gameNames[i])
    adding_text(currGameTotalPlayTime + ' hours', gameplayTimes[i])
    adding_img(currGameImg, gameImgs[i])

    for (let h = 0; h < usersTopXAchievements.length; h++) {
      adding_div(usersTopXAchievementsToHtml[h], topAchievementsDivs[i])
    }
  
  }

  return
}

async function main () {
  let user_obj = await get_user_obj() 
  let user_id = user_obj['steamid']
  let game_response = await get_owned_games(user_id)

  user_obj = JSON.stringify(user_obj)
  user_obj = JSON.parse(user_obj)

  game_response = JSON.stringify(game_response)
  game_response = JSON.parse(game_response)

  // creating and sorting (key: playtime) the game_list from the game_response
  let game_list = game_response['response']['games']
  game_list = game_list.sort((a, b) => b.playtime_forever - a.playtime_forever);


  // creating the profile picture
  user_pfp = user_obj['avatar']['large']
  user_pfp_class = document.querySelector('.user-pfp')
  adding_img(user_pfp, user_pfp_class)

  // creating the username in html
  username = user_obj['username']
  username_class = document.querySelector(".username")
  adding_text(username, username_class)

  // getting and sorting xml format games for THE DAMN LOGO
  let sorted_xml_games = await get_xml_games(user_id)
  sorted_xml_games = await JSON.stringify(sorted_xml_games)
  sorted_xml_games = await JSON.parse(sorted_xml_games)

  // create and list the top 3 games
  let amount_of_objects = 3
  await game_object_to_html(game_list, sorted_xml_games, amount_of_objects, user_id)

} 

main()