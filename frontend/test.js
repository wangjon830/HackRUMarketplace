var bcrypt = require('bcryptjs');

async function printHash(){
    let hashedPassword = await bcrypt.hash('admin', 10)
    console.log(hashedPassword);
}

printHash()
