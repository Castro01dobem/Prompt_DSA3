export const publicRoutes = ["/welcome", "/login"];

export function normalizePath(path) {
  if (!path || path === "/") {
    return "/welcome";
  }

  return path;
}

export function pathForRole(role) {
  if (role === "ADMIN") {
    return "/admin/dashboard";
  }

  if (role === "PROFESSOR") {
    return "/professor/dashboard";
  }

  return "/welcome";
}

export function isAdminRoute(path) {
  return path.startsWith("/admin");
}

export function isProfessorRoute(path) {
  return path.startsWith("/professor");
}

export function canAccess(path, user) {
  if (publicRoutes.includes(path)) {
    return true;
  }

  if (!user) {
    return false;
  }

  if (isAdminRoute(path)) {
    return user.role === "ADMIN";
  }

  if (isProfessorRoute(path)) {
    return user.role === "PROFESSOR";
  }

  return false;
}
