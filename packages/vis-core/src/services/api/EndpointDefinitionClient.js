/**
 * @typedef {{
 *   enabled?: boolean,
 *   mode?: "query"|"body",
 *   arrayFormat?: "csv"|"repeat",
 *   paramMap?: Record<string,string>
 * }} ServerFilterConfig
 *
 * @typedef {{
 *   path: string,
 *   requestMethod?: "GET"|"POST",
 *   requestOptions?: { skipAuth?: boolean },
 *   body?: any,
 *   serverFilter?: ServerFilterConfig
 * }} EndpointDefinition
 */

/**
 * Normalises arrays for API requests.
 * - default behaviour should be CSV
 *
 * @param {any} value
 * @param {"csv"|"repeat"} arrayFormat
 * @returns {any}
 */
function normaliseArrayParam(value, arrayFormat) {
  if (!Array.isArray(value)) return value;
  return arrayFormat === "repeat" ? value : value.join(",");
}

/**
 * Builds query/body params from metadata-driven filters and a serverFilter config.
 *
 * @param {ServerFilterConfig} serverFilter
 * @param {Array<any>} filters - items with { id, paramName }
 * @param {Record<string, any>} filterState - keyed by filter.id
 * @returns {{ queryParams: Record<string, any>, body: Record<string, any> }}
 */
export function buildServerRequestFromFilters(serverFilter, filters, filterState) {
  if (!serverFilter?.enabled) return { queryParams: {}, body: {} };

  const arrayFormat = serverFilter.arrayFormat === "repeat" ? "repeat" : "csv";
  const mode = serverFilter.mode === "body" ? "body" : "query";
  const map = serverFilter.paramMap || {};

  const queryParams = {};
  const body = {};

  (filters || []).forEach((f) => {
    const val = filterState?.[f.id];
    const apiParam = map?.[f.paramName];
    if (!apiParam || val == null) return;

    const normalised = normaliseArrayParam(val, arrayFormat);
    if (mode === "body") body[apiParam] = normalised;
    else queryParams[apiParam] = normalised;
  });

  return { queryParams, body };
}

/**
 * EndpointDefinitionClient
 *
 * A small, generic "endpoint executor" intended for frontend-controlled API calling.
 *
 * This client exists because many screens want to:
 * - declare how to call an endpoint (path, HTTP method, auth behavior, static body),
 * - optionally derive query/body params from UI filters (serverFilter mapping),
 * - and receive consistent outputs (e.g., lists always becoming arrays).
 *
 * It is *not* a server-provided config. The frontend provides an endpoint definition object
 * and this client performs the request accordingly.
 *
 * Terminology
 * ----------
 * - "Endpoint definition": a plain object describing how to call a backend endpoint:
 *   { path, requestMethod, requestOptions, body, serverFilter }
 *
 * - "serverFilter": an optional contract that maps the current UI filter selections into
 *   either query string params or request body fields, via `paramMap`.
 *
 * Response shape handling
 * -----------------------
 * - fetchList(): returns an array. If the backend returns an envelope, it attempts common
 *   unwrapping patterns: res.data, res.results, res.rows.
 * - fetchDetails(): returns the response (or null).
 *
 * Array handling
 * --------------
 * - serverFilter supports array serialization:
 *   - arrayFormat: "csv"  -> array values become "a,b,c"
 *   - arrayFormat: "repeat" -> array values remain arrays; the transport layer may serialize
 *     as repeated keys (?k=a&k=b&k=c) depending on BaseService implementation 
 *
 *
 * @example
 * // Minimal GET list endpoint
 * const endpoint = { path: "/api/runs", requestMethod: "GET" };
 * const rows = await endpointClient.fetchList(endpoint, filters, filterState);
 *
 * @example
 * // GET list endpoint with server-side filtering in the query string
 * const endpoint = {
 *   path: "/api/runs",
 *   requestMethod: "GET",
 *   serverFilter: {
 *     enabled: true,
 *     mode: "query",
 *     arrayFormat: "csv",
 *     // maps your filter metadata's `paramName` -> API query param key
 *     paramMap: {
 *       programme: "programme_id",
 *       year: "year",
 *       zoneType: "zone_type_id",
 *     },
 *   },
 * };
 * // If filterState.year is [2018, 2042] and arrayFormat is "csv",
 * // request becomes GET /api/runs?year=2018,2042
 * const rows = await endpointClient.fetchList(endpoint, filters, filterState);
 *
 * @example
 * // POST list endpoint with serverFilter mapping into the body
 * const endpoint = {
 *   path: "/api/runs/search",
 *   requestMethod: "POST",
 *   body: { includeSomething: true }, // static body to always send
 *   serverFilter: {
 *     enabled: true,
 *     mode: "body",
 *     arrayFormat: "csv",
 *     paramMap: {
 *       programme: "programme_id",
 *       year: "year",
 *     },
 *   },
 * };
 * // If filterState.year is [2018, 2042], body contains { year: "2018,2042" }
 * const rows = await endpointClient.fetchList(endpoint, filters, filterState);
 *
 * @example
 * // POST list endpoint where serverFilter sends params in the query (mode: "query")
 * // while the POST body still contains static/extra content.
 * const endpoint = {
 *   path: "/api/runs/search",
 *   requestMethod: "POST",
 *   body: { includeSomething: true },
 *   serverFilter: {
 *     enabled: true,
 *     mode: "query",
 *     arrayFormat: "csv",
 *     paramMap: { year: "year" },
 *   },
 * };
 * // Request becomes POST /api/runs/search?year=2018,2042 with body { includeSomething: true }
 * const rows = await endpointClient.fetchList(endpoint, filters, filterState);
 *
 * @example
 * // Details GET endpoint: id passed in query string (default pattern used by directoryApi)
 * const detailsEndpoint = { path: "/api/runs/details", requestMethod: "GET" };
 * const details = await endpointClient.fetchDetails(detailsEndpoint, {
 *   idParamName: "run_id",
 *   idValue: 123,
 * });
 * // GET /api/runs/details?run_id=123
 *
 * @example
 * // Details POST endpoint: id merged into body (default pattern used by directoryApi)
 * const detailsEndpoint = {
 *   path: "/api/runs/details",
 *   requestMethod: "POST",
 *   body: { includeDiagnostics: true },
 * };
 * const details = await endpointClient.fetchDetails(detailsEndpoint, {
 *   idParamName: "run_id",
 *   idValue: 123,
 * });
 * // POST /api/runs/details body: { includeDiagnostics: true, run_id: 123 }
 *
 * @example
 * // Using pathParams in a plain execute() call (BaseService supports :id or {id})
 * const endpoint = { path: "/api/runs/{runId}", requestMethod: "GET" };
 * const res = await endpointClient.execute(endpoint, { pathParams: { runId: 123 } });
 * // GET /api/runs/123
 *
 * @example
 * // skipAuth: calling a public endpoint without Authorization header
 * const publicEndpoint = {
 *   path: "/swagger/v1/swagger.json",
 *   requestMethod: "GET",
 *   requestOptions: { skipAuth: true },
 * };
 * const swagger = await endpointClient.execute(publicEndpoint);
 */
export class EndpointDefinitionClient {
  /**
   * @param {{ baseService: import("./Base").default }} deps
   */
  constructor({ baseService }) {
    if (!baseService) throw new Error("EndpointDefinitionClient requires baseService");
    this.baseService = baseService;
  }

  /**
   * execute()
   *
   * Low-level executor: performs a request exactly as described by the endpoint definition,
   * plus optional overrides for path/query/body.
   *
   * Behaviour
   * --------
   * - requestMethod defaults to GET
   * - requestOptions.skipAuth controls whether Authorization is attached
   * - For GET: uses baseService.get(path, { pathParams, queryParams })
   * - For POST: merges endpoint.body with overrides.body and uses baseService.post(...)
   *
   * @param {import("./EndpointDefinitionClient").EndpointDefinition} endpoint
   * @param {{
   *   pathParams?: Record<string, any>,
   *   queryParams?: Record<string, any>,
   *   body?: any
   * }} [overrides]
   * @returns {Promise<any>} Raw parsed JSON response
   *
   * @example
   * // GET with query params
   * await endpointClient.execute(
   *   { path: "/api/runs", requestMethod: "GET" },
   *   { queryParams: { year: 2018 } }
   * );
   *
   * @example
   * // POST with static body + override body merged
   * await endpointClient.execute(
   *   { path: "/api/runs/search", requestMethod: "POST", body: { include: true } },
   *   { body: { year: "2018,2042" } }
   * );
  */
  async execute(endpoint, overrides = {}) {
    if (!endpoint?.path) throw new Error("EndpointDefinitionClient.execute: endpoint.path is required");

    const method = (endpoint.requestMethod || "GET").toUpperCase();
    const skipAuth = !!endpoint?.requestOptions?.skipAuth;

    const pathParams = overrides.pathParams || {};
    const queryParams = overrides.queryParams || {};

    if (method === "POST") {
      const mergedBody = { ...(endpoint.body || {}), ...(overrides.body || {}) };
      return await this.baseService.post(endpoint.path, mergedBody, {
        skipAuth,
        pathParams,
        queryParams,
      });
    }

    return await this.baseService.get(endpoint.path, {
      skipAuth,
      pathParams,
      queryParams,
    });
  }

  /**
   * fetchList()
   *
   * High-level helper for "list" endpoints:
   * - applies serverFilter mapping (if configured) to build query/body params from filter state
   * - performs GET/POST depending on endpoint.requestMethod
   * - returns a *normalised array*, unwrapping {data}/{results}/{rows} envelopes
   *
   * serverFilter rules
   * ------------------
   * - enabled: if false/missing, no derived query/body params are produced
   * - mode:
   *   - "query": derived params become query string params
   *   - "body": derived params are merged into POST body
   * - arrayFormat:
   *   - "csv": arrays become comma-separated strings
   *   - "repeat": arrays are left as arrays; transport may serialize as repeated query keys[1]
   * - paramMap:
   *   - keys correspond to filter metadata's `paramName`
   *   - values are the API parameter names to send
   *
   * @param {import("./EndpointDefinitionClient").EndpointDefinition} endpoint
   * @param {Array<any>} filters - metadata-driven filters; expected to include { id, paramName }
   * @param {Record<string, any>} filterState - keyed by filter.id
   * @returns {Promise<any[]>} Array result (defaults to [] on error)
   *
   * @example
   * // GET list without serverFilter
   * const rows = await endpointClient.fetchList(
   *   { path: "/api/runs", requestMethod: "GET" },
   *   filters,
   *   filterState
   * );
   *
   * @example
   * // GET list with serverFilter -> query params
   * const rows = await endpointClient.fetchList(
   *   {
   *     path: "/api/runs",
   *     requestMethod: "GET",
   *     serverFilter: {
   *       enabled: true,
   *       mode: "query",
   *       arrayFormat: "csv",
   *       paramMap: { year: "year" },
   *     },
   *   },
   *   filters,
   *   { ...filterState, yearFilterId: [2018, 2042] }
   * );
   *
   * @example
   * // POST list with serverFilter -> body
   * const rows = await endpointClient.fetchList(
   *   {
   *     path: "/api/runs/search",
   *     requestMethod: "POST",
   *     body: { includeSomething: true },
   *     serverFilter: {
   *       enabled: true,
   *       mode: "body",
   *       arrayFormat: "csv",
   *       paramMap: { year: "year" },
   *     },
   *   },
   *   filters,
   *   filterState
   * );
  */
  async fetchList(endpoint, filters, filterState, extras = {}) {
    const method = (endpoint?.requestMethod || "GET").toUpperCase();

    const { queryParams: sfQuery, body: sfBody } = buildServerRequestFromFilters(
      endpoint?.serverFilter,
      filters,
      filterState
    );

    try {
      if (method === "POST") {
        const body =
          endpoint?.serverFilter?.mode === "body"
            ? { ...(sfBody || {}), ...(extras.extraBody || {}) }
            : { ...(extras.extraBody || {}) };

        const res = await this.execute(endpoint, {
          queryParams:
            endpoint?.serverFilter?.mode === "query"
              ? { ...(sfQuery || {}), ...(extras.extraQuery || {}) }
              : { ...(extras.extraQuery || {}) },
          body,
        });

        return this.baseService.unwrapListResponse(res);
      }

      const res = await this.execute(endpoint, {
        queryParams: { ...(sfQuery || {}), ...(extras.extraQuery || {}) },
      });
      return this.baseService.unwrapListResponse(res);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("EndpointDefinitionClient.fetchList failed:", err);
      return [];
    }
  }

  /**
   * fetchDetails()
   *
   * High-level helper for "details" endpoints:
   * - For GET endpoints: identifier fields are sent as query parameters
   * - For POST endpoints: identifier fields are merged into the POST body
   *
   * @param {import("./EndpointDefinitionClient").EndpointDefinition} endpoint
   * @param {{
   *   idParamName?: string,
   *   idValue?: string|number,
   *   extraQuery?: Record<string, any>
   * }} idConfig
   * @returns {Promise<any|null>} Raw response or null on error
   *
   * @example
   * // GET details: /api/runs/details?run_id=123
   * const details = await endpointClient.fetchDetails(
   *   { path: "/api/runs/details", requestMethod: "GET" },
   *   { idParamName: "run_id", idValue: 123 }
   * );
   *
   * @example
   * // POST details: body merged
   * const details = await endpointClient.fetchDetails(
   *   { path: "/api/runs/details", requestMethod: "POST", body: { verbose: true } },
   *   { idParamName: "run_id", idValue: 123 }
   * );
   */
  async fetchDetails(endpoint, idConfig) {
    const method = (endpoint?.requestMethod || "GET").toUpperCase();

    const idParams = {
      ...(idConfig?.idParamName && idConfig?.idValue != null
        ? { [idConfig.idParamName]: idConfig.idValue }
        : {}),
      ...(idConfig?.extraQuery || {}),
    };

    try {
      if (method === "POST") {
        const res = await this.execute(endpoint, {
          body: idParams,
          queryParams: {},
        });
        return this.baseService.unwrapObjectResponse(res);
      }

      const res = await this.execute(endpoint, {
        queryParams: idParams,
      });
      return this.baseService.unwrapObjectResponse(res);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("EndpointDefinitionClient.fetchDetails failed:", err);
      return null;
    }
  }
}