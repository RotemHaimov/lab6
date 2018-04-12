const debug = require('debug')('mongo:test');
const User = require('./model')("User");
const prompt = require('./prompt');
const timeout = require('./timeout');

(async () => {
  while (true) {
      console.clear();
      await timeout(500);

      console.log('Choose action from the menu:');
      console.log('1. Inquire user by username');
      console.log('2. Inquire user by _id and make it dude');
      console.log("3. Inquire users by chained query (admin's created during last month)");
      console.log("4. Do a chain of parallel requests");
      console.log('5. Add a user (different ways)');
      console.log();
      console.log('0. Exit');
      let choice = parseInt(await prompt('> '));
      switch (choice) {
          case 0:
              process.exit(0);

          case 1: // get a user by username
              try {
                  console.log(await User.REQUEST({username: await prompt('Please enter username: ')}));
              }
              catch (err) { console.log(`Failure ${err}`); }
              break;

          case 2: // get a user by ID
              let user1 = null;
              let id = await prompt('Please enter user _ID: ');
              try {
                  user1 = await User.REQUEST(id);
                  console.log(user1);
              } catch (err) { console.log(`Failure ${err}`); }
              if (user1 !== null) {
                  user1.dudify();
                  console.log(user1);
                  try {
                      await user1.save();
                  } catch (err) {
                      console.log(`Failure ${err}`);
                  }
                  try {
                      user1 = await User.REQUEST(id);
                      console.log(user1);
                  } catch (err) {
                      console.log(`Failure ${err}`);
                  }
              }
              break;

          case 3:
              // get any admin that was created in the past month
              // get the date 1 month ago
              await prompt("Please press enter to continue to chain request...");
              let monthAgo = new Date();
              monthAgo.setMonth(monthAgo.getMonth() - 1);
              try {
                  console.log(await User.find({admin: true}).where('created_at').gt(monthAgo).exec());
              } catch (err) { console.log(`Failure ${err}`); }
              break;

          case 4:
              // Update a user
              let queryToUpdateLocation = User.findOne({name: await prompt("Please enter a name of user to update location: ")}).exec();
              let queryAndUpdatePassword = User.findOneAndUpdate({username: await prompt("Please enter a username to change password: ")},
                  {password: await prompt("Please enter new password: ")}).exec();
              let queryForDelete = User.findOne({name: await prompt("Please enter a name of user to delete: ")}).exec();

              let userToUpdateLocation, userPasswordUpdated, userToDelete, updateLocation, removing;
              try {
                  [userToUpdateLocation, userPasswordUpdated, userToDelete] = await Promise.all([queryToUpdateLocation, queryAndUpdatePassword, queryForDelete]);
                  console.log("Queries done");
              } catch (err) { console.log(`Failure ${err}`); }

              if (userToUpdateLocation) {
                  console.log(`Updating Location of ${userToUpdateLocation.username}`);
                  // change the users location
                  userToUpdateLocation.location = 'il';
                  // save the user
                  updateLocation = userToUpdateLocation.save();
              }
              else
                  console.log(`Can't update location: user does not exist!`);
              if (userPasswordUpdated)
                  console.log(`Password updated for ${userPasswordUpdated.username}` );
              else
                  console.log(`Can't update password: user does not exist!`);
              if (userToDelete) {
                  console.log(`Deleting user ${userToDelete.username}`);
                  // change the users location
                  removing = user.remove();
              }
              else
                  console.log(`Can't delete: user does not exist!`);

              try {
                  let [res1, res3] = await Promise.all([updateLocation, removing]);
                  console.log("Users location updated and removed successfully");
              } catch (err) { console.log(`Failure ${err}`); }
              break;

          case 5:
              let way = await prompt("Choose the way (1 new User.save, 2 User.save 3 Create");
              let input = {
                  name: await prompt("Enter name: "),
                  username: await prompt("Enter username: "),
                  password: await prompt("Enter password")
              };
              let admin = await prompt("Is it admin (Y|y or N|n)? ");
              input.admin = admin == 'Y' || admin == 'y';
              let user2, result;
              let dude = () => {};
              if (way !== 3) {
                  let check = await prompt("Do you want to dudify it (Y|y or N|n)? ");
                  if (check == 'Y' || check == 'y')
                      dude = usr => usr.dudify((err, name) => {
                          if (err) throw err;
                          console.log('New name is ' + name);
                      });
              }
              switch (way) {
                  case 1:
                      user2 = new User(input);
                      dude(user2);
                      result = user.save();
                      break;
                  case 2:
                      user2 = User(input);
                      dude(user2);
                      result = user2.save();
                      break;
                  case 3:
                      result = User.create(input);
                      break;
              }
              try {
                  await result;
                  console.log("User created");
              } catch (err) { debug(`Failed: ${err}`) }
      }
      await prompt("Press Enter to return to the menu");
  }
})();
