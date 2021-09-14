const room1 = {
  id: "1",
  members_id: ["1", "2"],
  messages: [
    { content: "message1", sender: "2", time: "1min ago" },
    { content: "message2", sender: "1", time: "now" },
  ],
};

const room2 = {
  id: "2",
  members_id: ["1", "3"],
  messages: [
    { content: "message3", sender: "1", time: "3min ago" },
    { content: "message4", sender: "2", time: "1min ago" },
  ],
};

const friend_list = [
  { id: "2", username: "user2" },
  { id: "3", username: "user3" },
  { id: "4", username: "user4" },
];

const room_list = [
  {
    id: "1",
    users_id: ["1", "2"],
    last_message: {
      content: "message2",
      sender: "me",
      time: "now",
    },
  },
  {
    id: "2",
    users_id: ["1", "3"],
    last_message: {
      content: "message3",
      sender: "joe",
      time: "1min",
    },
  },
];

const userInfo2 = {
  isLoggedIn: true,
  username: "wwer",
  token: "sdpiofji",
};

export { room1, room2, friend_list, room_list, userInfo2 };
