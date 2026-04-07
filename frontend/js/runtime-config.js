(function () {
  const isLocalFrontend =
    window.location.protocol === "file:" ||
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  const localApiHost =
    window.location.hostname === "127.0.0.1" ? "127.0.0.1" : "localhost";

  const overrideApiBase =
    typeof window.__BAC_API_BASE__ === "string"
      ? window.__BAC_API_BASE__.trim()
      : "";

  const fallbackApiBase = isLocalFrontend
    ? `http://${localApiHost}:5000/api`
    : "https://bac-api-n1je.onrender.com/api";

  window.appConfig = {
    isLocalFrontend,
    apiBase: (overrideApiBase || fallbackApiBase).replace(/\/+$/, ""),
  };
})();
