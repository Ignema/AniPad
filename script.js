

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
        alert("HTTP-Error: " + response.status);
        return {"message": "Failed to fetch data"};
    }
}

function displayVideos(url){
    fetchVideos(url).then((json)=>{

        const list = document.getElementById("list");

        json.data.children.forEach(video => {
            if(video.data.link_flair_text !== "Added to wiki" || video.data.selftext !== "") {
                return;
            }

            let title = document.createElement("h2");
            title.innerHTML = video.data.title;

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

            let bar = document.createElement("div");
            bar.className="bar";

            let item = document.createElement("li");

            bar.appendChild(title);
            bar.appendChild(btn);
            item.appendChild(bar);

            vid.appendChild(src);
            container.appendChild(vid);
            centerer.appendChild(container);
            item.appendChild(centerer);

            list.appendChild(item);
        });

    }).catch((e)=>{console.log(e)}).finally(()=>{
        if(!list.firstChild){
            const msg = document.createElement("h3");
            msg.innerHTML = "No Videos Found";
            list.appendChild(msg);
        }
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
