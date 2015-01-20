module.exports = {
  "getTimelines": {
    url: "/timelines",
    method: "GET"
  },
  "createTimeline": {
    url: "/timelines",
    method: "POST"
  },
  "getTimeline": {
    url: "/timelines/{id}",
    method: "GET"
  },
  "createCard": {
    url: "/timelines/{id}/cards",
    method: "POST"
  },
  "updateTimeline": {
    url: "/timelines/{id}",
    method: "PATCH"
  },
  "deleteTimeline": {
    url: "/timelines/{id}",
    method: "DELETE"
  },
  "getCard": {
    url: "/timelines/{timelineId}/cards/{cardId}",
    method: "GET"
  },
  "updateCard": {
    url: "/timelines/{timelineId}/cards/{cardId}",
    method: "PATCH"
  },
  "deleteCard": {
    url: "/timelines/{timelineId}/cards/{cardId}",
    method: "DELETE"
  },
  "getComment": {
    url: "/timelines/{timelineId}/cards/{cardId}/comments/{commentId}",
    method: "GET"
  },
  "deleteComment": {
    url: "/timelines/{timelineId}/cards/{cardId}/comments/{commentId}",
    method: "DELETE"
  },
  "getComments": {
    url: "/timelines/{timelineId}/cards/{cardId}/comments",
    method: "GET"
  },
  "createComment": {
    url: "/timelines/{timelineId}/cards/{cardId}/comments",
    method: "POST"
  },
  "getCards": {
    url: "/timelines/{id}/cards?ts={?ts}&limit={?limit}&direction={?direction}&media_urls={?media_urls}&preview_urls={?preview_urls}&thumb_urls={?thumb_urls}&urls_ttl={?urls_ttl}",
    method: "GET"
  },
  "getCardsByQuery": {
    url: "/timelines/{id}/cards?q={?q}&ts={?ts}&limit={?limit}&direction={?direction}&media_urls={?media_urls}&preview_urls={?preview_urls}&thumb_urls={?thumb_urls}&urls_ttl={?urls_ttl}",
    method: "GET"
  },
  "getEventsToken": {
    url: "/events",
    method: "GET"
  }
};