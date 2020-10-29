

 async function getVideos() {
    let response = await fetch("https://www.reddit.com/r/AnimeThemes.json?limit=100", {
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

getVideos().then((json)=>{

    const list = document.getElementById("list");

    json.data.children.forEach(video => {
        if(video.data.link_flair_text !== "Added to wiki") {
            return;
        }

        let title = document.createElement("h2");
        title.innerHTML = video.data.title;

        let vid = document.createElement("video");
        vid.style.display="none";
        vid.className="video";
        vid.controls=true;

        let src = document.createElement("source");
        

        let btn = document.createElement("button");
        btn.innerHTML = "Play";

        btn.addEventListener("click", ()=>{
            vid.style.display="block";
            src.src= video.data.url;
            vid.load();
            vid.play();
        });

        let bar = document.createElement("div");
        bar.className="bar";

        let item = document.createElement("li");

        bar.appendChild(title);
        bar.appendChild(btn);
        item.appendChild(bar);

        vid.appendChild(src);
        item.appendChild(vid);

        list.appendChild(item);
    });

}).catch((e)=>{console.log(e)});



