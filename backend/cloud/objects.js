/* global Parse */
// eslint-disable @typescript-eslint/no-var-requires

const Objects = require("./consts.js").Objects;
const path = require('path');
const ogs = require("open-graph-scraper");

const genericObjectsPreSave = require("./common.js").genericObjectsPreSave;

for (let index = 0; index < Objects.length; index++) {
  Parse.Cloud.beforeSave(Objects[index], genericObjectsPreSave, {
    requireUser: true
  });
}

Parse.Cloud.define("fetchLinkMetadata", async (request) => {
  const url = request.params.url.trim();
  const { error, result, response } = await ogs({ url });
  if  (error) {
    throw result
  }

  const imgPath = result.ogImage && result.ogImage.url ? result.ogImage.url : null;

  if (imgPath) {
    const filename = path.basename(((new url.Url(imgPath))||{}).pathname || "og_file.jpg");
    result.previewImage = new Parse.File(filename, {uri: imgPath});
    await result.previewImage.save();
  }
  // FIXME: also extract favicon...
  return result
},{
  requireUser: true,
  fields: {
    url: {
      type: String,
      required: true,
    }
  }
}
)