// Bcrypt Hash Generator & Verifier: Generate password hashes with bcrypt algorithm
const bcrypt = require("bcrypt");

// Create Prisma Client
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient().$extends({
  model: {
    user: {
      async register(username, password) {
        const hash = await bcrypt.hash(password, 10); // 10 salt rounds
        const user = await prisma.user.create({
          // creates a user in register method
          data: { username, password: hash },
        });
        return user;
      },
      async login(username, password) {
        const user = await prisma.user.findUniqueOrThrow({
          // finds user by unique id
          where: { username },
        });
        const valid = await bcrypt.compare(password, user.password); // checks for correct password aka authenticate
        if (!valid) throw Error("Invalid password");
        return user;
      },
    },
  },
});
module.exports = prisma;
