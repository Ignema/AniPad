if(window.location.origin != "file://"){
    navigator.serviceWorker.register('./sw.js', { scope: '/AniPad/' })
    .then(() => console.log('Service worker registered successfully'))
    .catch((err) => console.error('Error during service worker registration: ', err))
}

const list = document.getElementById("list")

const displayVideos = async (url) => {
    const videos = await fetchVideos(url)
    
    if(!videos.hasOwnProperty("HTTP-Error") && videos.length !== 0){
        videos.forEach(async (video) => {
            if(video.data.link_flair_text !== "Added to wiki" || video.data.selftext !== "") return

            const animeTitle = video.data.title.substr(0, video.data.title.indexOf('('))
            
            const title = document.createElement("h2")
            title.innerHTML = animeTitle
    
            const vid = document.createElement("video")
            vid.className="video-js vjs-theme-forest"
            vid.style.outline= "none"
            vid.style.display="none"
            vid.controls=true
            vid.autoplay=true
    
            vid.setAttribute("data-setup", `{
                "fluid": true
            }`)
                
            const src = document.createElement("source")
            
            const container = document.createElement("div")
            container.className="container"
    
            const centerer = document.createElement("div")
            centerer.className="centerer"
            
            const btn = document.createElement("button")
            btn.className = "play"
            btn.innerHTML = "Play"
            btn.addEventListener("click", () => {
                if(vid.style.display=="none"){
                    container.style.display="flex"
                    vid.style.display="block"
                    btn.className="hide"
                    btn.innerHTML = "Hide"
                    if (vid.hidden==true) {
                        vid.hidden=false
                    } else {
                        src.src= video.data.url
                        src.type="video/webm"
                        vid.load()
                        vid.play().catch((err)=> console.log(err))
                        videojs(vid)
                    }
                } else {
                    vid.style.display="none"
                    container.style.display="none"
                    btn.className="unhide"
                    btn.innerHTML = "Unhide"
                    vid.hidden=true
                }
            })
    
            const bar = document.createElement("div")
            bar.className="bar card"
    
            const type = document.createElement("p")
            type.className="type"
            if(video.data.title.includes("OP")){
                type.innerHTML="OP"
            } else if(video.data.title.includes("ED")){
                type.innerHTML="ED"
            } else {
                type.innerHTML="?"
            }
    
            const subcard = document.createElement("div")
            subcard.className="subcard"
    
            const div = document.createElement("div")
    
            const item = document.createElement("li")
    
            const thumb = document.createElement("img")
            thumb.className="img"
            thumb.src='./img/404.png'
            
            try {
                const cover = await fetchCover(animeTitle.substr(0, 15))
                if(!cover.hasOwnProperty("HTTP-Error")) thumb.src = cover
            } catch (err) {
                console.log("Could not fetch thumbnail: ", err)
            }

            const mediaQuery = window.matchMedia("(max-width: 500px)")
            const mediaQueryHandler = (query) => {
                if (query.matches) {
                bar.style.background = "url('" + thumb.src + "')"
                    title.style.color= "white"
                    title.style.textShadow= "black 1px 0px 12px"
                    type.style.color= "white"
                    type.style.textShadow= "black 4px 2px 6px"
                } else {
                    bar.style.background = "white"
                    title.style.color="#2c3e50"
                    title.style.textShadow= "0px 0px black"
                    type.style.color="crimson"
                    type.style.textShadow= "0px 0px black"
                }
            }
            mediaQueryHandler(mediaQuery)
            mediaQuery.addEventListener("change", mediaQueryHandler)

    
            subcard.appendChild(title)
            subcard.appendChild(btn)
            bar.appendChild(type)
            bar.appendChild(thumb)
            bar.appendChild(subcard)
            item.appendChild(bar)
    
            vid.appendChild(src)
            container.appendChild(vid)
            centerer.appendChild(container)
    
            div.appendChild(item)
            div.appendChild(centerer)
    
            list.appendChild(div)
        })
    } else {
        const msg = document.createElement("h3")
        msg.innerHTML = "No Videos Found"
        list.appendChild(msg)
    }
}

// Entrypoint
displayVideos()