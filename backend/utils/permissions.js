// /utils/permissions.js
function getEffectivePermissions(rolePerms, userOverrides) {
    if (!rolePerms) return userOverrides || {};
    if (!userOverrides) return rolePerms;
  
    // Mezclar permisos (userOverrides sobreescribe rolePerms)
    const merged = { ...rolePerms };
  
    for (const key in userOverrides) {
      if (typeof userOverrides[key] === 'object' && !Array.isArray(userOverrides[key]) && userOverrides[key] !== null) {
        merged[key] = { ...rolePerms[key], ...userOverrides[key] };
      } else {
        merged[key] = userOverrides[key];
      }
    }
  
    return merged;
  }
  
  module.exports = { getEffectivePermissions };
  