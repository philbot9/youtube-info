# Youtube Info

[![Build Status](https://travis-ci.org/philbot9/youtube-info.svg?branch=master)](https://travis-ci.org/philbot9/youtube-info)

## Purpose

A Node.js module that fetches meta information about YouTube videos. The information is scraped directly from the YouTube website, so no need for a Google API-key.

**This project is in no way affiliated with YouTube.**

## Installation

Install as a module via npm.

```bash
$ npm install youtube-info
```

## Usage

`http//www.youtube.com/watch?v={videoId}`

``` javascript
var fetchVideoInfo = require('youtube-info');
fetchVideoInfo(videoId, cb);
```

| Parameter     | Meaning       |
|:--------------|:---------------|
| videoId       | ID of youtube Video |
| callback      | (optional) callback function |

### Promises API

``` javascript
var fetchVideoInfo = require('youtube-info');
fetchVideoInfo('{videoId}').then(function (videoInfo) {
  console.log(videoInfo);
});
```

### Callback API

``` javascript
var fetchVideoInfo = require('youtube-info');
fetchVideoInfo('{videoId}', function (err, videoInfo) {
  if (err) throw new Error(err);
  console.log(videoInfo);
});
```

## Result

```
{
  videoId: '{video Id}',
  url: '{video url}',
  title: '{video title}',
  description: '{video description as HTML}',
  owner: '{video owner}',
  channelId: '{owner channel id}',
  thumbnailUrl: '{video thumbnail url}',
  embedURL: '{video embed url}',
  datePublished: '{video publication date}',
  genre: '{video genre}',
  paid: {true/false},
  unlisted: {true/false},
  isFamilyFriendly: {true/false},
  duration: {video duration in seconds},
  views: {number of views},
  regionsAllowed: [ '{two letter country code}', ... ],
  commentCount: {number of comments},
  likeCount: {number of likes},
  dislikeCount: {number of dislikes}
}

```
