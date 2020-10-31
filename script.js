

if(window.location.origin != "file://"){
    navigator.serviceWorker.register('./sw.js', { scope: '/AniPad/' })
    .then(function (registration)
    {
      console.log('Service worker registered successfully');
    }).catch(function (e)
    {
      console.error('Error during service worker registration:', e);
    });
}

 async function fetchVideos(url) {
    if(!url){
        url = "https://www.reddit.com/r/AnimeThemes/top.json?limit=100&t=all";
    }
  
    let response = await fetch( url, {
        headers: {
            "User-Agent"   : "tester"
        }
      });

    if (response.ok) { 
      return await response.json();
    } else {
        return {"HTTP-Error": response.status, "message": "Failed to fetch video  info"};
    }
}

async function fetchCover(title){
    let response = await fetch( "https://graphql.anilist.co", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: `{
            Media (search: "${title}", type: ANIME) {
            coverImage{
                extraLarge
            }
              }
            }` }),
    });

    if (response.ok) { 
      return await response.json();
    } else {
        return {"HTTP-Error": response.status, "message": "Failed to fetch video covers"};
    }
}

function displayVideos(url){
    fetchVideos(url).then((json)=>{

        const list = document.getElementById("list");

        json.data.children.forEach(video => {
            if(video.data.link_flair_text !== "Added to wiki" || video.data.selftext !== "") {
                return;
            }

            const animeTitle = video.data.title.substr(0, video.data.title.indexOf('('));

            let title = document.createElement("h2");
            title.innerHTML = animeTitle;

            let vid = document.createElement("video");
            vid.className="video-js vjs-theme-forest";
            vid.style.outline= "none";
            vid.style.display="none";
            vid.controls=true;
            vid.autoplay=true;
          
            vid.setAttribute("data-setup", `{
                "fluid": true
            }`);

            let src = document.createElement("source");
            

            let container = document.createElement("div");
            container.className="container";

            let centerer = document.createElement("div");
            centerer.className="centerer";
            

            let btn = document.createElement("button");
            btn.className = "play";
            btn.innerHTML = "Play";

            btn.addEventListener("click", ()=>{
                
                if(vid.style.display=="none"){
                    container.style.display="flex";
                    vid.style.display="block";
                    btn.className="hide";
                    btn.innerHTML = "Hide";
                    if (vid.hidden==true) {
                        vid.hidden=false;
                    }else{
                        src.src= video.data.url;
                        src.type="video/webm";
                        vid.load();
                        vid.play().catch((e)=>{console.log(e)});
                        videojs(vid);
                    }
                }
                else{
                    vid.style.display="none";
                    container.style.display="none"
                    btn.className="unhide";
                    btn.innerHTML = "Unhide";
                    vid.hidden=true;
                }
            });

            fetchCover( animeTitle.substr(0, 15)).then((json)=>{
                let bar = document.createElement("div");
                bar.className="bar card";

                let type = document.createElement("p");
                type.className="type";
                if(video.data.title.includes("OP")){
                    type.innerHTML="OP";
                }
                else if(video.data.title.includes("ED")){
                    type.innerHTML="ED";
                }
                else{
                    type.innerHTML="?";
                }

                let subcard = document.createElement("div");
                subcard.className="subcard";

                let div = document.createElement("div");

                let item = document.createElement("li");

                let thumb = document.createElement("img");
                thumb.className="img";
                thumb.src='./img/404.png';

                if(!json["HTTP-Error"]){
                    thumb.src=json.data.Media.coverImage.extraLarge;
                    
                    function myFunction(x) {
                        if (x.matches) { // If media query matches
                        bar.style.background = "url('" + json.data.Media.coverImage.extraLarge + "')";
                        title.style.color= "white";
                        title.style.textShadow= "black 1px 0px 12px";
                        type.style.color= "white";
                        type.style.textShadow= "black 4px 2px 6px";
                      }else{
                        bar.style.background = "white";
                        title.style.color="#2c3e50";
                        title.style.textShadow= "0px 0px black";
                        type.style.color="crimson";
                        type.style.textShadow= "0px 0px black";
                      }
                    }
                        var x = window.matchMedia("(max-width: 500px)")
                        myFunction(x) // Call listener function at run time
                        x.addListener(myFunction) // Attach listener function on state changes
                }
                
                
                subcard.appendChild(title);
                subcard.appendChild(btn);
                bar.appendChild(type);
                bar.appendChild(thumb);
                bar.appendChild(subcard);
                item.appendChild(bar);

                vid.appendChild(src);
                container.appendChild(vid);
                centerer.appendChild(container);

                div.appendChild(item);
                div.appendChild(centerer);

                list.appendChild(div);
        }).catch((e)=>{console.log(e)});
    });
}).catch((e)=>{console.log(e)}).finally(()=>{
        const msg = document.createElement("h3");
        msg.innerHTML = "No Videos Found";
        while(!list.firstChild){
            list.appendChild(msg);
        }
        list.removeChild(msg);
    });
}

displayVideos();

function setAction(form) {
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
    const search = document.getElementById("search");
    displayVideos(`https://www.reddit.com/r/AnimeThemes/search.json?q=${search.value.replaceAll(" ", "+")}&restrict_sr=on&sort=relevance&t=all`);
    return false;
  }
