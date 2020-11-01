
if(window.location.origin != "file://"){
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
    .then(function (registration)
    {
      console.log('Service worker registered successfully');
    }).catch(function (e)
    {
      console.error('Error during service worker registration:', e);
    });
}

 async function fetchVideos(query) {
    if(!query){
        query = "short cooking videos";
    }
  
    let response = await fetch( "/videos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: query})
      });

    if (response.ok) { 
      return await response.json();
    } else {
        return {"HTTP-Error": response.status, "message": "Failed to fetch video  info"};
    }
}

function displayVideos(query){
    fetchVideos(query).then(async (json)=>{

            json.forEach((json)=>{

            const list = document.getElementById("list");

            let title = document.createElement("h2");
            title.innerHTML = json.title;

            let player = document.createElement("iframe");
            player.id="player"; 
            player.src="https://www.youtube.com/embed/" + json.link.substr(json.link.indexOf('e/')+2,json.link.length);
            player.frameBorder="0";
            player.allowFullscreen=true;
            player.style.outline="none";
            player.style.width="100%";
            player.style.height="60vh";
            player.style.display="none"; 

            let container = document.createElement("div");
            container.className="container";

            let centerer = document.createElement("div");
            centerer.className="centerer";

            let btn = document.createElement("button");
            btn.className = "play";
            btn.innerHTML = "Play";

            btn.addEventListener("click", ()=>{
                
                if(player.style.display=="none"){
                    container.style.display="flex";
                    player.style.display="block";
                    btn.className="hide";
                    btn.innerHTML = "Hide";
                    if (player.hidden==true) {
                        player.hidden=false;
                    }else{
                        player.style.display="block";
                    }
                }
                else{
                    player.style.display="none";
                    container.style.display="none"
                    btn.className="unhide";
                    btn.innerHTML = "Unhide";
                    player.hidden=true;
                }
            });

                let bar = document.createElement("div");
                bar.className="bar card";
                
                let subcard = document.createElement("div");
                subcard.className="subcard";

                let div = document.createElement("div");

                let item = document.createElement("li");

                let thumb = document.createElement("img");
                thumb.className="img";
                thumb.src='./img/404.png';

                if(json){
                    thumb.src=json.thumbnail;
                    
                    function myFunction(x) {
                        if (x.matches) { // If media query matches
                        bar.style.background = "url('" + json.thumbnail + "')";
                        title.style.color= "white";
                        title.style.textShadow= "black 1px 0px 12px";
                      }else{
                        bar.style.background = "white";
                        title.style.color="#2c3e50";
                        title.style.textShadow= "0px 0px black";
                      }
                    }
                        var x = window.matchMedia("(max-width: 500px)")
                        myFunction(x) // Call listener function at run time
                        x.addListener(myFunction) // Attach listener function on state changes
                }
                
                
                subcard.appendChild(title);
                subcard.appendChild(btn);
                bar.appendChild(thumb);
                bar.appendChild(subcard);
                item.appendChild(bar);

                container.appendChild(player);
                centerer.appendChild(container);

                div.appendChild(item);
                div.appendChild(centerer);

                list.appendChild(div);

            });
   
}).catch((e)=>{
    console.log(e)
})
// .finally(()=>{
//     const msg = document.createElement("h3");
//     msg.innerHTML = "No Videos Found";
//     while(!list.firstChild){
//         list.appendChild(msg);
//     }
//     if(list.firstChild===msg){
//         list.removeChild(msg);
//     }
// });
}

displayVideos();

function setAction() {
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
    const search = document.getElementById("search");
    displayVideos(search.value.replaceAll(" ", "+"));
    return false;
  }