import type { To, Location as reactLocation } from "react-router-dom";

/**
 * Keeps the current URL intact when navigating, but gets rid of previous hashes.
 * 
 * - To override search parameters or hash, provide the path as a string directly (e.g., preserveUrl("/home?param=hello#section", location)).
 * - If `null` is passed for `search` or `hash` in a `To` object, it removes them.
 */
export default function preserveUrl(to: To, location: reactLocation<any> | Location) {
  const orgSearch = location.search,
    override = typeof to === "string" && to.includes("?") ? to.split("?") : [],
    hashOverride = override[0]?.split("#") || [];

  return {
    pathname:
      override[0] === "" ? location.pathname
        : override[0] ? override[0]
        : typeof to === "string"
        ? to
        : to.pathname || location.pathname,
    search:
      typeof to === "object" && to.search === null
        ? ""
        : override[1]
        ? `?${override[1]}`
        : typeof to.search === "string" // It's a object.
        ? orgSearch
          ? `${orgSearch}${to.search.replace("?", "&")}`
          : to.search
        : orgSearch,
    hash:
      typeof to === "object"
        ? to.hash === null
          ? ""
          : to.hash
        : hashOverride[1]
        ? `#${hashOverride[1]}`
        : location.hash,
  };
}
