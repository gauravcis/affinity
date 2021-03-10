/* global Parse */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { fetchMyTeams } = require("./utils.js");


Parse.Cloud.define("claimInstallation", async (request) => {
  const params = Object.assign({}, request.params);
  const defaultTeamId = params.defaultTeamId;

  let installation;
  let setTeams = params.setTeams || false;

  delete params.defaultTeam;
  delete params.setTeams;
  params.installationId = params.installationId.toLowerCase();


  if (params.id) {
    installation = await (new Parse.Query(Parse.Installation)).get(params.Id)
  }

  if (!installation) {
    // try by installationId
    installation = await (new Parse.Query(Parse.Installation))
      .equalTo('installationId', params.installationId)
      .first({ useMasterKey: true});
  }

  if (!installation) {
    // let's try with device token instead
    installation = await (new Parse.Query(Parse.Installation))
      .equalTo('deviceToken', params.deviceToken)
      .first({ useMasterKey: true });
  }

  if (!installation) {
    // we create our own
    installation = new Parse.Installation();
    const acl = new Parse.ACL();
    installation.setACL(acl);
    setTeams = true;
  }

  installation.set(params);

  if (request.user) {
    const userP = request.user.toPointer();
    const ACL = new Parse.ACL(userP);
    installation.set({"user": userP, ACL});
  }

  if (setTeams) {
    // set the default channels
    const channels = []

    if (request.user) {
      const { teams } = await fetchMyTeams(request.user);
      teams.forEach((x) => {
        channels.push(x.id)
      });
    }

    if (channels.length === 0 && defaultTeamId) {
      channels.push(defaultTeamId);
    }

    installation.set("channels", channels.map((x) => `${x}:news`));
  }

  await installation.save(null, { useMasterKey: true });

  if (request.user) {
    return (new Parse.Query(Parse.Installation))
      .equalToTo('user', request.user)
      .findAll({useMasterKey: true})
  }

  return [installation]
},{
  requireUser: false,
  fields: {
    installationId: {
      type: String,
      required: true,
    },
    deviceToken: {
      type: String,
      required: true,
    },
    defaultTeam: {
      type: String,
      required: true,
    }
  }
});
