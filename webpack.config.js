module.exports = {
  context: __dirname,
  entry: {
    index:"./app/controllers/index.client.js",
    poll: "./app/controllers/plotPoll.client.js",
    profile: "./app/controllers/profile.client.js",
    notfound:"./app/controllers/notfound.client.js"
  },
  output: {
    path: __dirname + "/public",
    filename: "[name].min.js"
  },
};