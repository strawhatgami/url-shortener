const API_ROOT_EXTERNAL = "http://localhost:3003";

const services = {
  getUser: ({ User }) => async (id) => {
  },
  onCredentials: ({ User }) => async (username, password, done) => {
    let user = null;
    try {
      user = await User.findOne({ where: { username } })
    } catch (err) {
      done(err);
    }

    if (!user) {
      var newUser = new User();
      newUser.username = username;
      newUser.password = newUser.generateHash(password);
      await newUser.save();
      return done(null, newUser);
    };

    if (!user.verifyPassword(password)) return done(null, false);

    return done(null, user);
  },
  serializeUser: () => (user, cb) => cb(null, user.id),
  deserializeUser: ({ User }) => async (id, cb) => {
    try {
      const user = await User.findOne({ where: { id } });
      cb(null, user);
    } catch (err) {
      cb(err);
    }
  },
  getMe: ({}) => async ({user}) => {
    const name = user?.username;

    if (!name) {
      return {
        data: null,
      }
    }

    return {
      data: {name}
    }
  },
  redirectToUrl: ({ URLMap }) => async ({params}) => {
    const {shortened} = params;
    const urlMap = await URLMap.findOne({ where: { shortened }});

    if (!urlMap) {
      return {
        status: 404,
      };
    }

    return {
      status: 301,
      url: urlMap.full,
    };
  },
  shortenUrl: ({ URLMap }) => async ({body}) => {
    const {full, shortened} = body;
    let urlMap = null;
    if (!shortened) {
      urlMap = await URLMap.fromFullUrl(full);
    }
// TODO validate body?.shortened : must be an URIComponent
// TODO verify shortened is unique in db before creating an urlMap; else return error

    urlMap = await URLMap.create({full, shortened});

    return {
      full: urlMap.full,
      shortened: API_ROOT_EXTERNAL + "/url/" + urlMap.shortened,
    };
  },
};

export default services;
