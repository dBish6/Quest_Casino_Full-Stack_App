export const titlePrefix = "| Quest Casino";

const defaultKeywords = [
  "blackjack",
  "bonuses",
  "casino",
  "chat",
  "community",
  "friends",
  "fair casino",
  "gamble",
  "gambling",
  "games",
  "player trust",
  "quests",
  "responsible gambling",
  "secure gaming",
  "social"
].join(", ");

export const meta = {
  "/about": {
    title: `About ${titlePrefix}`,
    tags: [
      `<meta name="description" content="Welcome to Quest Casino! We're unlike any other casino, it's beyond gaming, it is also a place to socialize with other players. it's a haven for players looking for a safe, transparent, and fair online casino experience. Your experience is our number one priority.">`,
      `<meta name="keywords" content="transparent casino, next-gen casino, ${defaultKeywords}">`
    ]
  },
  "/home": {
    title: `Home ${titlePrefix}`,
    tags: [
      `<meta name="description" content="Check out our selection of casino games! Choose from table games, slots, dice games, or even pick from your favourites. Stay informed on upcoming releases, check out community events, read our news, or meet new players and have a chat!.">`,
      `<meta name="keywords" content="game list, upcoming releases, events, news, ${defaultKeywords}">`
    ]
  },
  "/profile": {
    title: `Profile ${titlePrefix}`,
    tags: [
      `<meta name="description" content="Manage your profile. Edit basic, personal information, and configure billing options. Track your game stats, win/loss totals, win rate, games played totals, completed quests and also your game history for every game played.">`,
      `<meta name="keywords" content="edit profile, statistics, player stats, player history, ${defaultKeywords}">`
    ]
  },
  "/profile/settings": {
    title: `Settings ${titlePrefix}`,
    tags: [
      `<meta name="description" content="Configure your profile's personalization options. Adjust notification preferences, manage privacy settings, and edit your blocked player list.">`,
      `<meta name="keywords" content="profile settings, settings, notification preferences, privacy settings, blocked players, ${defaultKeywords}">`
    ]
  },
  "/support": {
    title: `Support ${titlePrefix}`,
    tags: [
      `<meta name="description" content="Need help? Our support team is here, access our live support chat or contact us via email for further inquiries. We're here to help you.">`,
      `<meta name="keywords" content="contact, customer support, live chat, email, help center, ${defaultKeywords}">`
    ]
  },

  "/error-401": {
    title: `Error 401 ${titlePrefix}`,
    tags: [
      `<meta name="description" content="Unauthorized access. User authorization is missing or required.">`,
      `<meta name="keywords" content="error 401, server error, unauthorized access, login required, ${defaultKeywords}">`
    ]
  },
  "/error-403": {
    title: `Error 403 ${titlePrefix}`,
    tags: [
      `<meta name="description" content="Forbidden access. Malicious request or User authorization is not valid.">`,
      `<meta name="keywords" content="error 403, server error, forbidden access, permission denied, ${defaultKeywords}">`
    ]
  },
  "/error-404-page": {
    title: `Error 404 ${titlePrefix}`,
    tags: [
      `<meta name="description" content="Page not found. The page you are looking for doesn't exist or was moved or deleted.">`,
      `<meta name="keywords" content="error 404, page not found, ${defaultKeywords}">`
    ]
  },
  "/error-404-user": {
    title: `Error 404 ${titlePrefix}`,
    tags: [
      `<meta name="description" content="User not found. Unexpectedly we couldn't find your profile on our server.">`,
      `<meta name="keywords" content="error 404, server error, user not found, ${defaultKeywords}">`
    ]
  },
  "/error-429": {
    title: `Error 429 ${titlePrefix}`,
    tags: [
      `<meta name="description" content="Too many requests. You made too many requests to the our server in a short period, Quest Casino is temporarily locked down for you. Please come back again in an hour.">`,
      `<meta name="keywords" content="error 429, server error, too many requests, rate limit exceeded, ${defaultKeywords}">`
    ]
  },
  "/error-500": {
    title: `Error 500 ${titlePrefix}`,
    tags: [
      `<meta name="description" content="Unexpected server error or couldn't establish a connection.">`,
      `<meta name="keywords" content="error 500, server error, internal server issue, ${defaultKeywords}">`
    ]
  }
};