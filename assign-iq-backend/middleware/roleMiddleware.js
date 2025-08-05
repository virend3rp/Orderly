/**
 * Middleware generator to check for user roles.
 * @param {string[]} allowedRoles - An array of roles that are allowed to access the route.
 * @returns {function} An Express middleware function.
 */
const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    // Get the employee's role from the JWT payload (attached by verifyToken middleware)
    const employeeRole = req.employee?.role;

    if (employeeRole && allowedRoles.includes(employeeRole)) {
      // If the employee's role is in the list of allowed roles, proceed.
      next();
    } else {
      // Otherwise, deny access.
      res.status(403).json({ message: 'Forbidden: You do not have the required permissions.' });
    }
  };
};

module.exports = checkRole;