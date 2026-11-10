import React from "react";
export default function RestockNotice({ count, onShow }) {
  if (count === 0) return null;
  return (
    <div className="notice">
      <span className="notice-icon">!</span>
      <p>
        <strong>Un vistazo a tus estantes.</strong> Tienes {count} productos que necesitan
        reposición.
      </p>
      <button onClick={onShow}>Ver productos por reponer →</button>
    </div>
  );
}
