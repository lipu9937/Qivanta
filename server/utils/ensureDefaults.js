const { SocialLink, TechItem, SiteSetting } = require("../models");
const defaults = require("../data/defaults");

// NEW: fills Social media, Tech stack and Site settings the first time only.
// Flags are stored on the settings document, so if the admin later deletes every item,
// the defaults are NOT added back. force=true (used by `npm run seed`) resets the lists.
module.exports = async function ensureDefaults(force = false) {
  let s = await SiteSetting.findOneAndUpdate(
    { key: "main" },
    { $setOnInsert: { ...defaults.settings } },
    { upsert: true, new: true }
  );
  if (force || !s.socialsSeeded) {
    if (force) await SocialLink.deleteMany();
    if ((await SocialLink.countDocuments()) === 0) await SocialLink.insertMany(defaults.socials);
    s.socialsSeeded = true;
  }
  if (force || !s.techSeeded) {
    if (force) await TechItem.deleteMany();
    if ((await TechItem.countDocuments()) === 0) await TechItem.insertMany(defaults.techs);
    s.techSeeded = true;
  }
  await s.save();
};
