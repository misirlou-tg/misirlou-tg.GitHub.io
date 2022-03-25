document.getElementById("listing").innerHTML = "Loading...";
const PLAYLIST_URL = "playlist.json";
const EPISODES_URL = "episodes.json";
var playlist = null;
var episodeMap = null;

function updateListing() {
    if (playlist == null || episodeMap == null) {
        return;
    }

    var listingHtml = "playlist.Baseline = " + playlist.Baseline;
    playlist.EpisodeIds.forEach(episodeId => {
        listingHtml += "<br/>" + episodeId;
        if (episodeMap.has(episodeId)) {
            var episode = episodeMap.get(episodeId);
            listingHtml += "<br/>" + episode.Title;
        }
    });
    document.getElementById("listing").innerHTML = listingHtml;
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
