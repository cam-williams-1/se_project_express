const { JWT_SECRET = "super-strong-secret" } = process.env;

module.exports = {
  JWT_SECRET,
};

// Here we have a simple config module that exports one variable called JWT_SECRET.
// If process.env.JWT_SECRET has a value, this value is what will be exported.
// If not, then the hard-coded string "super-strong-secret" will be used instead.
