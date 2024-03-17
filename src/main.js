document.addEventListener('DOMContentLoaded', () => {
    const shareElement = document.getElementById("share");
    let shareCounter = 0;
    
    function infiniteLoop() {
        setTimeout(() => {
            if (shareCounter == 0) {
                shareElement.scrollTop = 100;
                shareCounter += 1;
            } else {
                shareElement.scrollTop = 0;
                shareCounter -= 1;
            }
            infiniteLoop(); // Call the function again to create an infinite loop
        }, 6500);
    }

    fetch('setting.json')
        .then(response => response.json())
        .then(data => {
            // Extract the settings from the JSON data
            const basicEnvironment = data['basic environment'];
            const linkSettings = data['Link'];
            const debugInfo = data['debug'];
            const musicData = basicEnvironment['music']['data'];
            const musicNumber = Object.keys(musicData).length;
            const musicRandom = Math.floor(Math.random() * (musicNumber - 1 + 1) + 1);
            const musicKey = musicData[`music-${musicRandom}`];
            const holderIcon = data['basic environment']['holder icon'];
            const backgroundUrl = data['basic environment']['background'];
            const gravatarUrl = `https://www.gravatar.com/avatar/${md5(holderIcon['gravatar']['email'])}?size=500`;
            const darkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
            const sign = basicEnvironment['signature']
            const music = basicEnvironment['music']
            const urlParams = new URLSearchParams(window.location.search);
            let debugCounter = 1;
            let linkCounter = 0;
            let linkEnabled = 0;

            function debug(message, action) {
                if (debugInfo === true) {
                    if(action === "error"){
                        console.error(`${debugCounter}.${message}`);
                        debugCounter += 1;
                    }else if(action === "info"){
                        console.log(`${debugCounter}.${message}`);
                        debugCounter += 1;
                    }
                }
            }

            // Apply the basic environment settings to the HTML elements
            document.querySelector('meta[name="description"]').setAttribute('content', basicEnvironment['meta description']);
            document.title = basicEnvironment['website name'];
            document.getElementById('title').innerText = "HEY! " + basicEnvironment['holder name'];
            document.getElementById('description').innerText = basicEnvironment['subtitle'];

            if (sign['enabled'] === true) {
                document.getElementById('sign').innerText = sign['content'];
                debug(` 個性簽名已經加載✅`);
                if (sign['auto-hide'] === true) {
                    document.getElementById('sign').classList.add("auto-hide");
                    debug(` 個性簽名自動隱藏開始運作⛔`, "info");
                }
            } else if (sign['enabled'] === false) {
                debug(` 個性簽名已禁用⛔`, "info");
            } else {
                debug(` 個性設置錯誤❌`, "error");
            }

            if (music['enabled'] === true) {
                document.getElementById('MusicName').innerText = musicKey['name'];
                document.getElementById('MusicName').setAttribute('href', musicKey['url']);
                document.getElementById('MusicName').setAttribute('title', musicKey['name']);
                infiniteLoop();
                document.getElementById('github').classList.add("github-loop");
                debug(` 隨機歌曲已經加載✅`);
            } else {
                if (music['enabled'] === false) {
                    debug(` 隨機歌曲已禁用⛔`, "info");
                } else {
                    debug(` 隨機歌曲設置錯誤❌`, "error");
                }
                document.getElementById('music').remove()
            }

            if (backgroundUrl['url'] != null || backgroundUrl['url'] != "") {
                document.getElementById('background').style.backgroundImage = `url(${backgroundUrl["url"]})`;
                debug(` 本地壁紙已經加載✅`);
            } else {
                debug(` 壁紙設置錯誤❌`, "error");
            }

            if (darkMode == true) {
                document.documentElement.setAttribute("data-mode", "dark");
                debug(` Dark Mode🌑`);
            } else {
                document.documentElement.setAttribute("data-mode", "light");
                debug(` Light Mode🌕`);
            }

            if (holderIcon['method'] === "local") {
                document.getElementById('img').style.backgroundImage = `url("${holderIcon["local"]["url"]}")`;
                debug(` 本地頭像已經加載✅`);
            } else if (holderIcon['method'] === "gravatar") {
                document.getElementById('img').style.backgroundImage = `url("${gravatarUrl}")`;
                debug(` gravatar頭像已經加載✅`);
            } else {
                debug(` 頭像設置錯誤❌`, "error");
            }

            // Apply the link settings to the HTML elements
            Object.keys(linkSettings).forEach(key => {
                const link = linkSettings[key];
                const linkElement = document.getElementById(`${key}`);
                const linkName = link['name'];
                linkCounter += 1;
                if (link['enabled'] === true) {
                    linkElement.setAttribute('l-name', linkName);
                    if (linkElement.getAttribute('l-name') == urlParams.get('media')) {
                        linkElement.remove();
                    } else {
                        if (link['enabled'] === true) {
                            linkElement.className = link["icon"];
                            linkElement.target = link["target"];
                            linkElement.setAttribute("title", link['title']);
                            if(link['url'] != ""){
                                linkElement.setAttribute('href', link['url']);
                            }
                            linkEnabled += 1;
                        }
                        debug(` ${key}已經加載✅`, "info");
                    }
                } else { 
                    if (link['enabled'] === false) {
                        debug(` ${key}已禁用⛔`, "info");
                    } else{
                        debug(` ${key}設置錯誤❌`, "error");
                    }
                    linkElement.remove();
                }
            });
        })
        .catch(error => {
            console.error('Error fetching or parsing the setting.json file:', error);
        });
})