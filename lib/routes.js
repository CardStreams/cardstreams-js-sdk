module.exports = {
  "getStreams": {
    url: "/streams",
    method: "GET"
  },
  "createStream": {
    url: "/streams",
    method: "POST"
  },
  "getStream": {
    url: "/streams/{streamId}",
    method: "GET"
  },
  "createCard": {
    url: "/streams/{streamId}/cards",
    method: "POST"
  },
  "updateStream": {
    url: "/streams/{streamId}",
    method: "PATCH"
  },
  "deleteStream": {
    url: "/streams/{streamId}",
    method: "DELETE"
  },
  "getCard": {
    url: "/streams/{streamId}/cards/{cardId}",
    method: "GET"
  },
  "updateCard": {
    url: "/streams/{streamId}/cards/{cardId}",
    method: "PATCH"
  },
  "deleteCard": {
    url: "/streams/{streamId}/cards/{cardId}",
    method: "DELETE"
  },
  "getComment": {
    url: "/streams/{streamId}/cards/{cardId}/comments/{commentId}",
    method: "GET"
  },
  "deleteComment": {
    url: "/streams/{streamId}/cards/{cardId}/comments/{commentId}",
    method: "DELETE"
  },
  "getComments": {
    url: "/streams/{streamId}/cards/{cardId}/comments",
    method: "GET"
  },
  "createComment": {
    url: "/streams/{streamId}/cards/{cardId}/comments",
    method: "POST"
  },
  "getCards": {
    url: "/streams/{streamId}/cards?ts={?ts}&limit={?limit}&direction={?direction}&media_urls={?media_urls}&preview_urls={?preview_urls}&thumb_urls={?thumb_urls}&urls_ttl={?urls_ttl}",
    method: "GET"
  },
  "getCardsByQuery": {
    url: "/streams/{streamId}/cards?q={?q}&ts={?ts}&limit={?limit}&direction={?direction}&media_urls={?media_urls}&preview_urls={?preview_urls}&thumb_urls={?thumb_urls}&urls_ttl={?urls_ttl}",
    method: "GET"
  },
  "getEventsToken": {
    url: "/events",
    method: "GET"
  }
};