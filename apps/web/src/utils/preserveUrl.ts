import type { To, Location as reactLocation } from "react-router-dom";

/**
 * Keeps the current URL intact when navigating, but gets rid of previous hashes.
 * 
 * To override search parameters or hash, provide the path as a string directly (e.g., preserveUrl("/home?param=hello#section", location)).
 */
export default function preserveUrl(to: To, location: reactLocation<any> | Location) {
  const orgSearch = location.search,
    override = typeof to === "string" && to.includes("?") ? to.split("?") : [],
    hashOverride = override[0]?.split("#") || [];

  return {
    pathname: override[0] ? override[0] : typeof to === "string" ? to : to.pathname || "",
    search:
      override[1]
        ? `?${override[1]}`
        : typeof to.search === "string" // It's a object.
          ? orgSearch
            ? `${orgSearch}${to.search.replace("?", "&")}`
            : to.search
          : orgSearch,
    hash: typeof to !== "string" ? to.hash : hashOverride[1] && `#${hashOverride[1]}`
  };
}
