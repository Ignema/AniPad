const fetchVideos = async (url) => {
    if(!url) url = "https://www.reddit.com/r/AnimeThemes/top.json?limit=100&t=all"
  
    const  response = await fetch( url, {
        "headers": {
            "user-agent": "Mozilla/5.0 (Windows NT 10.0 Win64 x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418.62"
        }
    })

    if (response.ok) { 
        const json = await response.json()
        return json.data.children
    } else {
        return {"HTTP-Error": response.status, "message": "Failed to fetch video  info"}
    }
}

const fetchCover = async (title) => {
    const response = await fetch( "https://graphql.anilist.co", {
        "method": 'POST',
        "headers": { 
            "content-type": "application/json",
            "accept": "application/json",
        },
        "body": JSON.stringify({ query: `{
            Media (search: "${title}", type: ANIME) {
                coverImage{
                    extraLarge
                }
            }
        }` 
        }),
        "mode": "no-cors"
    })

    if (response.ok) { 
        const json = await response.json()
        return json.data.Media.coverImage.extraLarge
    } else {
        return {"HTTP-Error": response.status, "message": "Failed to fetch video covers"}
    }
}