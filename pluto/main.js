function setListingHtml(listingHtml) {
    document.getElementById("listing").innerHTML = listingHtml;
}
setListingHtml("<p/>Loading...");

const PLAYLIST_URL = "playlist.json";
const EPISODES_URL = "episodes.json";
var playlist = null;
var episodeMap = null;
const EPISODE_MINUTES = 30;

function updateListing() {
    if (playlist == null || episodeMap == null) {
        return;
    }

    var currTime = new Date();
    var sequenceStartTime = getSequenceStartTime(currTime);
    // Which slot is currently playing in the playlist
    var slot = getPlaylistSlot(currTime);
    // Airtime of the current episode
    var airtime = new Date(sequenceStartTime);
    airtime.setUTCMinutes(airtime.getUTCMinutes() + (slot * EPISODE_MINUTES));

    var listingHtml = '';
    // Build output for the episodes to display
    for (var t = 0; t < 8; t++) {
        listingHtml += '<p></p>'
        listingHtml += '<div>' + formatTime(airtime) + '</div>'
        var episodeId = playlist.EpisodeIds[(slot + t) % playlist.EpisodeCount];
        if (!episodeMap.has(episodeId)) {
            listingHtml += '<div>Not available</div>';
        }
        else {
            var episode = episodeMap.get(episodeId);
            listingHtml += '<div><b>' + episode.Title + '</b></div>';
            listingHtml += '<div>' + episode.Summary + '</div>';
            listingHtml += '<div class="text-right">' + episodeId + ', Original air date: ' + episode.AirDate + '</div>';
        }
        // Advance to the next airtime
        airtime.setUTCMinutes(airtime.getUTCMinutes() + EPISODE_MINUTES);
    }
    setListingHtml(listingHtml);
}

function formatTime(time) {
    return time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function getPlaylistSlot(currTime) {
    var diffMinutes = (currTime - playlist.Baseline) / 60000;
    var airingStartMinutes = diffMinutes % playlist.SequenceMinutes;
    return Math.trunc(airingStartMinutes / EPISODE_MINUTES);
}

function getSequenceStartTime(currTime) {
    var diffMinutes = (currTime - playlist.Baseline) / 60000;
    var numSequence = Math.trunc(diffMinutes / playlist.SequenceMinutes);
    var sequenceStartTime = new Date(playlist.Baseline);
    sequenceStartTime.setUTCMinutes(sequenceStartTime.getUTCMinutes() + (numSequence * playlist.SequenceMinutes));
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
    playlist.EpisodeCount = playlist.EpisodeIds.length;
    playlist.SequenceMinutes = playlist.EpisodeCount * EPISODE_MINUTES;
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

if (!window.jQuery) {
    setListingHtml("<p/>Error loading jQuery");
}

if (PLAYLIST_URL != "mock") {
    // https://stackoverflow.com/questions/7346563/loading-local-json-file
    // Can also use builtin 'fetch' API https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
    // But it is not available everywhere, JQuery works 'everywhere'
    $.getJSON(PLAYLIST_URL, o => {
        initializePlaylist(o);
        loadEpisodes();
    }).fail(() => { setListingHtml("<p/>Loading playlist.json failed"); });
} else {
    parseAndInitializePlaylist('{"Baseline": "2022-02-28T12:30:00-06:00","EpisodeIds": ["S1E1","S1E2","S1E3","S1E6","S1E8","S1E4"]}');
    loadEpisodes();
}

function loadEpisodes() {
    if (EPISODES_URL != "mock") {
        $.getJSON(EPISODES_URL, o => {
            initializeEpisodeMap(o);
            updateListing();
        }).fail(() => { setListingHtml("<p/>Loading episodes.json failed"); });
    } else {
        parseAndInitializeEpisodeMap('[{"Season": 1, "EpisodeNum": 1, "Title": "The New Housekeeper"}, {"Season": 1, "EpisodeNum": 2, "Title": "The Manhunt"}]')
        updateListing();
    }
}
