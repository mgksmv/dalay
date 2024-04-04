import axios from 'axios';

export default class Youtube {
  static apiEndpoint = 'https://www.googleapis.com/youtube/v3/';

  static async getPlaylistData(playlistId) {
    const data = {
      title: '',
      videos: [],
    };
    let playlistItemsData = await this._getPlaylistItemsData(playlistId);
    const playlistData = await this._getPlaylistData(playlistId);

    if (!playlistItemsData || !playlistData) {
      return null;
    }

    data.title = playlistData.items[0].snippet.title;

    while (true) {
      data.videos = [...data.videos, ...playlistItemsData.items];

      const nextPageToken = playlistItemsData.nextPageToken;
      if (!nextPageToken) {
        break;
      }

      playlistItemsData = await this._getPlaylistItemsData(playlistId, nextPageToken);
    }

    return data;
  }

  static parsePlaylistIdFromURL(url) {
    let id = null;

    if (url) {
      try {
        const parsedUrl = new URL(url);
        const params = parsedUrl.searchParams;
        for (const key of params.keys()) {
          if (key === 'list') {
            id = params.get(key);
          }
        }
      } catch (error) {
        return null;
      }
    }

    return id;
  }

  static parseVideoIdFromURL(url) {
    let id = null;

    if (url) {
      if (url.includes('youtube.com')) {
        if (url.includes('embed')) {
          const path = this._parseURLPath(url);
          id = path.substring(7);
        } else {
          const params = this._parseURLQuery(url);
          id = params.v;
        }
      } else if (url.includes('youtu.be')) {
        const path = this._parseURLPath(url);
        id = path.substring(1);
      }
    }

    return id;
  }

  static _parseURLPath(url) {
    const parsedUrl = new URL(url);
    return parsedUrl['pathname'];
  }

  static _parseURLQuery(url) {
    const parsedUrl = new URL(url);
    const paramsEntries = parsedUrl.searchParams.entries();

    const params = {};
    for (const [key, value] of paramsEntries) {
      params[key] = value;
    }

    return params;
  }

  static async _getPlaylistData(playlistId) {
    const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
    const url = this.apiEndpoint
        + `playlists?id=${playlistId}&part=snippet&key=${apiKey}`;
    let data;

    await axios
        .get(url)
        .then((response) => {
          console.log(response.data);
          if (!response.data.error) {
            data = response.data;
          }
        });

    return data;
  }

  static async _getPlaylistItemsData(playlistId, pageToken = null) {
    const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
    let url = this.apiEndpoint
        + `playlistItems?playlistId=${playlistId}&part=snippet&key=${apiKey}`;
    let data;

    if (pageToken) {
      url += `&pageToken=${pageToken}`;
    }

    await axios
        .get(url)
        .then((response) => {
          console.log(response.data);
          if (!response.data.error) {
            data = response.data;
          }
        })
        .catch((error) => {
          console.log(error);
          return data;
        });

    return data;
  }
}
