module.exports = {
  "getUsers": {
    url: "/user",
    method: "GET"
  },
  "createUser": {
    url: "/user",
    method: "POST"
  },
  "getUser": {
    url: "/user/{userId}",
    method: "GET"
  },
  "getMemberships": {
    url: "/user/{userId}/membership",
    method: "GET"
  },
  "create##Membership": {
    url: "/user/{userId}/membership",
    method: "POST"
  },
  "getMembership": {
    url: "/user/{userId}/membership/{timelineId}",
    method: "GET"
  },
  "updateMembership": {
    url: "/user/{userId}/membership/{timelineId}",
    method: "PATCH"
  },
  "getTimelines": {
    url: "/timeline",
    method: "GET"
  },
  "createTimeline": {
    url: "/timeline",
    method: "POST"
  },
  "getTimeline": {
    url: "/timeline/{id}",
    method: "GET"
  },
  "createCard": {
    url: "/timeline/{id}",
    method: "POST"
  },
  "getCard": {
    url: "/timeline/{timelineId}/card/{cardId}",
    method: "GET"
  },
  "updateCard": {
    url: "/timeline/{timelineId}/card/{cardId}",
    method: "PATCH"
  },
  "deleteCard": {
    url: "/timeline/{timelineId}/card/{cardId}",
    method: "DELETE"
  },
  "getComments": {
    url: "/timeline/{timelineId}/card/{cardId}/comments",
    method: "GET"
  },
  "createComment": {
    url: "/timeline/{timelineId}/card/{cardId}/comments",
    method: "POST"
  },
  "getCards": {
    url: "/timeline/{id}/stream?ts={?ts}&direction={?direction}&limit={?limit}&q={?q}",
    method: "GET"
  }
};