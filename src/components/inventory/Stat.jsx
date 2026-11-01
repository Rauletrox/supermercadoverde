import React from "react";
export default function Stat({ label, value, icon, detail, warning }) {
  return (
    <article className={`stat ${warning ? "warning" : ""}`}>
      <div className="stat-top">
        {label}
        <span>{icon}</span>
      </div>
      <strong className="stat-value">{value}</strong>
      <small>{detail}</small>
    </article>
  );
}
