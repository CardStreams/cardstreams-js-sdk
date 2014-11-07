module.exports = {
  "getUsers": {
    url: "/users",
    method: "GET"
  },
  "createUser": {
    url: "/users",
    method: "POST"
  },
  "getUser": {
    url: "/users/{userId}",
    method: "GET"
  },
  "getMemberships": {
    url: "/users/{userId}/memberships",
    method: "GET"
  },
  "createMembership": {
    url: "/users/{userId}/memberships",
    method: "POST"
  },
  "getMembership": {
    url: "/users/{userId}/memberships/{timelineId}",
    method: "GET"
  },
  "updateMembership": {
    url: "/user/{userId}/memberships/{timelineId}",
    method: "PATCH"
  },
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
    url: "/timelines/{id}/cards?ts={?ts}&direction={?direction}&limit={?limit}&q={?q}",
    method: "GET"
  }
};