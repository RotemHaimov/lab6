//
const User = require('./model')("User");
const prompt = require('./prompt');
const timeout = require('./timeout');
(async () => {
    console.clear();
    await timeout(500);
    while (true) {
        let user = [];
        console.log();
        user[0] = await prompt("Please enter user's name: ");
        user[1] = await prompt('Please enter username: ');
        user[2] = await prompt('Please enter password: ');
        let admin = await prompt('Please enter admin status: ');
        user[3] = admin == 'Y' || admin == 'y';
        console.log(user);
        try {
            await User.CREATE(user);
            console.log('User created:' + user);
        } catch(err) { throw err; }
    }
})();