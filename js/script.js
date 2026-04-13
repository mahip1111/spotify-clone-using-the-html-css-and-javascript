console.log("Lets write js")
let currentSong = new Audio();

// function to convert the seconds to minutes seconds
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs() {
    let a = await fetch("http://127.0.0.1:3000/songs/")
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("songs%5C")[1])
        }
    }
    return songs
}

async function main() {

    // Get the list or all the songs
    let songs = await getSongs()
    console.log(songs)

    // Show all ths songs in the playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]

    for (const song of songs) {
        songUL.innerHTML += `<li>
        <img class="invert" width="34" src="img/music.svg" alt="">
        <div class="info">
            <div>${song.replaceAll("%20", " ")}</div>
            <div>Harry</div>  
        </div>
        <div class="playnow">
            <span>Play Now</span>
            <img class="invert" src="img/play.svg" alt="">
        </div>
    </li>`;
    }
    // here we are adding the artist name and the song name


    // Attach an even listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

        })
    })

    // to make the song play
    const playMusic = (track, pause = false) => {
        currentSong.src = "songs%5C" + track
        if (!pause) {
            currentSong.play()
            play.src = "img/pause.svg"
        }
        document.querySelector(".songinfo").innerHTML = decodeURI(track)
        document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
    }

    // issa kya hoga ki agar apna song select nahi kiya hoga toh by default first song hi chalega
    playMusic(songs[0], true)


    //Attach an event listener to play, next and previous
    let play = document.getElementById("play");
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "img/pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "img/play.svg"
        }
    })

    // Listen for timeupdate event
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    // Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

}




main()