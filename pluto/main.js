document.getElementById("listing").innerHTML = "Loading...";
const PLAYLIST_URL = "playlist.json";
const EPISODES_URL = "episodes.json";
var playlist = null;
var episodeMap = null;
const EPISODE_COUNT = 249;
const EPISODE_MINUTES = 30;
const SEQUENCE_MINUTES = EPISODE_COUNT * EPISODE_MINUTES;

function updateListing() {
    if (playlist == null || episodeMap == null) {
        return;
    }

    var listingHtml = "playlist.Baseline = " + playlist.Baseline;

    var currTime = new Date();

    var sequenceStartTime = getSequenceStartTime(currTime);
    listingHtml += "<br/>sequenceStartTime = " + sequenceStartTime;

    // Which slot is currently playing in the playlist
    var slot = getPlaylistSlot(currTime);
    listingHtml += "<br/>slot = " + slot + "/" + EPISODE_COUNT;

    // Airtime of the current episode
    var airtime = new Date(sequenceStartTime);
    airtime.setUTCMinutes(airtime.getUTCMinutes() + (slot * EPISODE_MINUTES));
    listingHtml += "<br/>airtime = " + airtime;
    listingHtml += "<br/>";

    // Build output for the episodes to display
    for (var t = 0; t < 8; t++) {
        var episodeId = playlist.EpisodeIds[(slot + t) % EPISODE_COUNT];
        if (!episodeMap.has(episodeId)) {
            listingHtml += "<br/>" + formatTime(airtime);
            listingHtml += "<br/>Not available";
        }
        else {
            var episode = episodeMap.get(episodeId);
            listingHtml += "<br/>" + formatTime(airtime);
            listingHtml += "<br/>" + episodeId + ", " + episode.AirDate;
            listingHtml += "<br/>" + episode.Title;
        }
        listingHtml += "<br/>";
        // Advance to the next airtime
        airtime.setUTCMinutes(airtime.getUTCMinutes() + EPISODE_MINUTES);
    }
    document.getElementById("listing").innerHTML = listingHtml;
}

function formatTime(time) {
    return time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function getPlaylistSlot(currTime) {
    var diffMinutes = (currTime - playlist.Baseline) / 60000;
    var airingStartMinutes = diffMinutes % (SEQUENCE_MINUTES);
    return Math.trunc(airingStartMinutes / EPISODE_MINUTES);
}

function getSequenceStartTime(currTime) {
    var diffMinutes = (currTime - playlist.Baseline) / 60000;
    var numSequence = Math.trunc(diffMinutes / (SEQUENCE_MINUTES));
    var sequenceStartTime = new Date(playlist.Baseline);
    sequenceStartTime.setUTCMinutes(sequenceStartTime.getUTCMinutes() + (numSequence * SEQUENCE_MINUTES));
    return sequenceStartTime;
}

//
// Functions to initialize 'playlist' and 'episodeMap'
//

function parseAndInitializePlaylist(jsonText) {
    initializePlaylist(JSON.parse(jsonText));
}

// Initialize 'playlist' with a JSON object already parsed via JSON.parse(jsonText)
function initializePlaylist(o) {
    playlist = o;
    playlist.Baseline = new Date(playlist.Baseline);
}

function parseAndInitializeEpisodeMap(jsonText) {
    initializeEpisodeMap(JSON.parse(jsonText));
}

// Initialize 'episodeMap' with a JSON object already parsed via JSON.parse(jsonText)
function initializeEpisodeMap(o) {
    episodeMap = new Map();
    o.forEach(episode => {
        var episodeId = "S" + episode.Season + "E" + episode.EpisodeNum;
        episodeMap.set(episodeId, episode);
    });
}

//
// Startup code, initialize 'playlist' and 'episodeMap', then call updateListing()
//

if (PLAYLIST_URL != "mock") {
    // https://stackoverflow.com/questions/7346563/loading-local-json-file
    // Can also use builtin 'fetch' API https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
    // But it is not available everywhere, JQuery works 'everywhere'
    $.getJSON(PLAYLIST_URL, o => {
        initializePlaylist(o);
        loadEpisodes();
    });
} else {
    parseAndInitializePlaylist('{"Baseline": "2022-02-28T12:30:00-06:00","EpisodeIds": ["S1E1","S1E2","S1E3","S1E6","S1E8","S1E4"]}');
    loadEpisodes();
}

function loadEpisodes() {
    if (EPISODES_URL != "mock") {
        $.getJSON(EPISODES_URL, o => {
            initializeEpisodeMap(o);
            updateListing();
        });
    } else {
        parseAndInitializeEpisodeMap('[{"Season": 1, "EpisodeNum": 1, "Title": "The New Housekeeper"}, {"Season": 1, "EpisodeNum": 2, "Title": "The Manhunt"}]')
        updateListing();
    }
}
