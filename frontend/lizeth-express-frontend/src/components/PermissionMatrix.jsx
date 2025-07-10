import React from "react";

/**
 * @param {Object} value - Permisos extra (editable)
 * @param {Object} lockedPermissions - Permisos base del rol (locked)
 * @param {Function} onChange - Handler de cambio
 * @param {Array} modules - Módulos [{ key, label, children }]
 * @param {Array} permissionTypes - Permisos [{ key, label }]
 */
export default function PermissionMatrix({ value, lockedPermissions = {}, onChange, modules, permissionTypes }) {
  // Solo puedes editar los que no están bloqueados por rol base
  const handleCheck = (moduleKey, subKey, permKey) => {
    // Si es bloqueado, no hace nada
    if (lockedPermissions?.[moduleKey]?.[subKey]?.[permKey]) return;
    onChange({
      ...value,
      [moduleKey]: {
        ...value[moduleKey],
        [subKey]: {
          ...((value[moduleKey] && value[moduleKey][subKey]) || {}),
          [permKey]: !!value?.[moduleKey]?.[subKey]?.[permKey] ? false : true
        }
      }
    });
  };

  return (
    <table className="min-w-full w-max border mb-4 text-sm bg-white rounded-xl shadow">
      <thead>
        <tr>
          <th className="border px-3 py-1 bg-gray-50">Módulo</th>
          <th className="border px-3 py-1 bg-gray-50">Submódulo</th>
          {permissionTypes.map(pt => (
            <th className="border px-3 py-1 bg-gray-50 text-center" key={pt.key}>{pt.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {modules.flatMap(mod =>
          mod.children.map((sub, subIdx) => (
            <tr key={`${mod.key}.${sub.key}`}>
              {subIdx === 0 && (
                <td className="border px-3 py-1 font-bold text-primary align-top" rowSpan={mod.children.length}>
                  {mod.label}
                </td>
              )}
              <td className="border px-3 py-1">{sub.label}</td>
              {permissionTypes.map(pt => {
                const isLocked = !!lockedPermissions?.[mod.key]?.[sub.key]?.[pt.key];
                const checked =
                  isLocked
                    ? true
                    : !!value?.[mod.key]?.[sub.key]?.[pt.key];

                return (
                  <td className="border px-3 py-1 text-center" key={pt.key}>
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={isLocked}
                      onChange={() => handleCheck(mod.key, sub.key, pt.key)}
                    />
                  </td>
                );
              })}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
