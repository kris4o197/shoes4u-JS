const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  loginPage(req, res) {
    res.render("auth/login", { title: "Login" });
  },

  async login(req, res) {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.send("Invalid credentials.");

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.send("Invalid credentials.");

    req.session.user = { id: user.id, email: user.email, role: user.role };
    res.redirect("/");
  },

  registerPage(req, res) {
    res.render("auth/register", { title: "Register" });
  },

  async register(req, res) {
    const { name, email, password } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: { name, email, password: hashed },
    });

    res.redirect("/login");
  },

  logout(req, res) {
    req.session.destroy(() => {
      res.redirect("/");
    });
  },
};
