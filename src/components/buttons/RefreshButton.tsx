import React from "react";

import { Link } from "react-router-dom";

export function RefreshButtonMobile() {
  return (
    <div id="refresh-button-mobile">
      <span className="btn-wrap-catalog btn-wrap">
        <Link to={`/p/all/catalog`}>Refresh</Link>
      </span>
    </div>
  );
}

export function RefreshButtonDesktop() {
  return (
    <span className="return-button catalog-button" id="refresh-button-desktop">
      [
      <span
        id="button"
        style={{ cursor: "pointer" }}
        onClick={() =>
          window.location.reload()}
        onMouseOver={(event) =>
          event.target.style.cursor = "pointer"}
        onTouchStart={() => window.location.reload()}
      >
        Refresh
      </span>
      ]
    </span>
  );
}
