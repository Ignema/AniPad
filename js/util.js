const setAction = (form) => {
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
    const search = document.getElementById("search");
    displayVideos(`https://www.reddit.com/r/AnimeThemes/search.json?q=${search.value.replaceAll(" ", "+")}&restrict_sr=on&sort=relevance&t=all`);
    return false;
}