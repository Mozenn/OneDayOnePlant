const CronJob = require("cron").CronJob;
const User = require("../models/user");
const logger = require("./logger");

const startCronJobs = () => {
  let jobs = [];

  jobs.push(
    new CronJob("0 9 * * *", checkUnvalidAccount, null, false, "Europe/Paris")
  );

  jobs.forEach((job) => job.start());
};

const checkUnvalidAccount = () => {
  logger.info("checkUnvalidAccount job running");

  User.find({ isVerified: false }).then((unverifiedUsers) => {
    const weekInMillisecs = 604800000;

    unverifiedUsers.forEach((user) => {
      if (weekInMillisecs - (new Date() - user.createdAt) < 0) {
        logger.info(`Deleting user ${user.username}`);
        User.findByIdAndDelete(user._id).exec();
      }
    });
  });
};

module.exports = {
  startCronJobs,
  checkUnvalidAccount,
};
