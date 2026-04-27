var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _client, _currentQuery, _currentQueryInitialState, _currentResult, _currentResultState, _currentResultOptions, _currentThenable, _selectError, _selectFn, _selectResult, _lastQueryWithDefinedData, _staleTimeoutId, _refetchIntervalId, _currentRefetchInterval, _trackedProps, _QueryObserver_instances, executeFetch_fn, updateStaleTimeout_fn, computeRefetchInterval_fn, updateRefetchInterval_fn, updateTimers_fn, clearStaleTimeout_fn, clearRefetchInterval_fn, updateQuery_fn, notify_fn, _a;
import { x as ProtocolError, y as TimeoutWaitingForResponseErrorCode, z as utf8ToBytes, A as ExternalError, M as MissingRootKeyErrorCode, C as Certificate, D as lookupResultToBuffer, F as RequestStatusResponseStatus, U as UnknownError, G as RequestStatusDoneNoReplyErrorCode, H as RejectError, I as CertifiedRejectErrorCode, J as UNREACHABLE_ERROR, K as InputError, L as InvalidReadStateRequestErrorCode, N as ReadRequestType, O as Principal, Q as IDL, V as MissingCanisterIdErrorCode, W as HttpAgent, X as encode, Y as QueryResponseStatus, Z as UncertifiedRejectErrorCode, _ as isV3ResponseBody, $ as isV2ResponseBody, a0 as UncertifiedRejectUpdateErrorCode, a1 as UnexpectedErrorCode, a2 as decode, S as Subscribable, a3 as pendingThenable, a4 as resolveEnabled, s as shallowEqualObjects, a5 as resolveStaleTime, q as noop, a6 as environmentManager, a7 as isValidTimeout, a8 as timeUntilStale, a9 as timeoutManager, aa as focusManager, ab as fetchState, ac as replaceData, p as notifyManager, r as reactExports, t as shouldThrowError, e as useQueryClient, ad as useInternetIdentity, ae as createActorWithConfig, j as jsxRuntimeExports, af as Slot, a as cn, ag as cva, ah as Variant, ai as Record, aj as Vec, ak as Service, al as Func, am as Null, an as Text, ao as Principal$1, ap as Nat, aq as Float64, ar as Int, as as Bool } from "./index-BqnJ5REX.js";
const FIVE_MINUTES_IN_MSEC = 5 * 60 * 1e3;
function defaultStrategy() {
  return chain(conditionalDelay(once(), 1e3), backoff(1e3, 1.2), timeout(FIVE_MINUTES_IN_MSEC));
}
function once() {
  let first = true;
  return async () => {
    if (first) {
      first = false;
      return true;
    }
    return false;
  };
}
function conditionalDelay(condition, timeInMsec) {
  return async (canisterId, requestId, status) => {
    if (await condition(canisterId, requestId, status)) {
      return new Promise((resolve) => setTimeout(resolve, timeInMsec));
    }
  };
}
function timeout(timeInMsec) {
  const end = Date.now() + timeInMsec;
  return async (_canisterId, requestId, status) => {
    if (Date.now() > end) {
      throw ProtocolError.fromCode(new TimeoutWaitingForResponseErrorCode(`Request timed out after ${timeInMsec} msec`, requestId, status));
    }
  };
}
function backoff(startingThrottleInMsec, backoffFactor) {
  let currentThrottling = startingThrottleInMsec;
  return () => new Promise((resolve) => setTimeout(() => {
    currentThrottling *= backoffFactor;
    resolve();
  }, currentThrottling));
}
function chain(...strategies) {
  return async (canisterId, requestId, status) => {
    for (const a of strategies) {
      await a(canisterId, requestId, status);
    }
  };
}
const DEFAULT_POLLING_OPTIONS = {
  preSignReadStateRequest: false
};
function hasProperty(value, property) {
  return Object.prototype.hasOwnProperty.call(value, property);
}
function isObjectWithProperty(value, property) {
  return value !== null && typeof value === "object" && hasProperty(value, property);
}
function hasFunction(value, property) {
  return hasProperty(value, property) && typeof value[property] === "function";
}
function isSignedReadStateRequestWithExpiry(value) {
  return isObjectWithProperty(value, "body") && isObjectWithProperty(value.body, "content") && value.body.content.request_type === ReadRequestType.ReadState && isObjectWithProperty(value.body.content, "ingress_expiry") && typeof value.body.content.ingress_expiry === "object" && value.body.content.ingress_expiry !== null && hasFunction(value.body.content.ingress_expiry, "toHash");
}
async function pollForResponse(agent, canisterId, requestId, options = {}) {
  const path = [utf8ToBytes("request_status"), requestId];
  let state;
  let currentRequest;
  const preSignReadStateRequest = options.preSignReadStateRequest ?? false;
  if (preSignReadStateRequest) {
    currentRequest = await constructRequest({
      paths: [path],
      agent,
      pollingOptions: options
    });
    state = await agent.readState(canisterId, { paths: [path] }, void 0, currentRequest);
  } else {
    state = await agent.readState(canisterId, { paths: [path] });
  }
  if (agent.rootKey == null) {
    throw ExternalError.fromCode(new MissingRootKeyErrorCode());
  }
  const cert = await Certificate.create({
    certificate: state.certificate,
    rootKey: agent.rootKey,
    canisterId,
    blsVerify: options.blsVerify,
    agent
  });
  const maybeBuf = lookupResultToBuffer(cert.lookup_path([...path, utf8ToBytes("status")]));
  let status;
  if (typeof maybeBuf === "undefined") {
    status = RequestStatusResponseStatus.Unknown;
  } else {
    status = new TextDecoder().decode(maybeBuf);
  }
  switch (status) {
    case RequestStatusResponseStatus.Replied: {
      return {
        reply: lookupResultToBuffer(cert.lookup_path([...path, "reply"])),
        certificate: cert
      };
    }
    case RequestStatusResponseStatus.Received:
    case RequestStatusResponseStatus.Unknown:
    case RequestStatusResponseStatus.Processing: {
      const strategy = options.strategy ?? defaultStrategy();
      await strategy(canisterId, requestId, status);
      return pollForResponse(agent, canisterId, requestId, {
        ...options,
        // Pass over either the strategy already provided or the new one created above
        strategy,
        request: currentRequest
      });
    }
    case RequestStatusResponseStatus.Rejected: {
      const rejectCode = new Uint8Array(lookupResultToBuffer(cert.lookup_path([...path, "reject_code"])))[0];
      const rejectMessage = new TextDecoder().decode(lookupResultToBuffer(cert.lookup_path([...path, "reject_message"])));
      const errorCodeBuf = lookupResultToBuffer(cert.lookup_path([...path, "error_code"]));
      const errorCode = errorCodeBuf ? new TextDecoder().decode(errorCodeBuf) : void 0;
      throw RejectError.fromCode(new CertifiedRejectErrorCode(requestId, rejectCode, rejectMessage, errorCode));
    }
    case RequestStatusResponseStatus.Done:
      throw UnknownError.fromCode(new RequestStatusDoneNoReplyErrorCode(requestId));
  }
  throw UNREACHABLE_ERROR;
}
async function constructRequest(options) {
  var _a2;
  const { paths, agent, pollingOptions } = options;
  if (pollingOptions.request && isSignedReadStateRequestWithExpiry(pollingOptions.request)) {
    return pollingOptions.request;
  }
  const request = await ((_a2 = agent.createReadStateRequest) == null ? void 0 : _a2.call(agent, {
    paths
  }, void 0));
  if (!isSignedReadStateRequestWithExpiry(request)) {
    throw InputError.fromCode(new InvalidReadStateRequestErrorCode(request));
  }
  return request;
}
const metadataSymbol = Symbol.for("ic-agent-metadata");
class Actor {
  /**
   * Get the Agent class this Actor would call, or undefined if the Actor would use
   * the default agent (global.ic.agent).
   * @param actor The actor to get the agent of.
   */
  static agentOf(actor) {
    return actor[metadataSymbol].config.agent;
  }
  /**
   * Get the interface of an actor, in the form of an instance of a Service.
   * @param actor The actor to get the interface of.
   */
  static interfaceOf(actor) {
    return actor[metadataSymbol].service;
  }
  static canisterIdOf(actor) {
    return Principal.from(actor[metadataSymbol].config.canisterId);
  }
  static createActorClass(interfaceFactory, options) {
    const service = interfaceFactory({ IDL });
    class CanisterActor extends Actor {
      constructor(config) {
        if (!config.canisterId) {
          throw InputError.fromCode(new MissingCanisterIdErrorCode(config.canisterId));
        }
        const canisterId = typeof config.canisterId === "string" ? Principal.fromText(config.canisterId) : config.canisterId;
        super({
          config: {
            ...DEFAULT_ACTOR_CONFIG,
            ...config,
            canisterId
          },
          service
        });
        for (const [methodName, func] of service._fields) {
          if (options == null ? void 0 : options.httpDetails) {
            func.annotations.push(ACTOR_METHOD_WITH_HTTP_DETAILS);
          }
          if (options == null ? void 0 : options.certificate) {
            func.annotations.push(ACTOR_METHOD_WITH_CERTIFICATE);
          }
          this[methodName] = _createActorMethod(this, methodName, func, config.blsVerify);
        }
      }
    }
    return CanisterActor;
  }
  /**
   * Creates an actor with the given interface factory and configuration.
   *
   * The [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package can be used to generate the interface factory for your canister.
   * @param interfaceFactory - the interface factory for the actor, typically generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package
   * @param configuration - the configuration for the actor
   * @returns an actor with the given interface factory and configuration
   * @example
   * Using the interface factory generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package:
   * ```ts
   * import { Actor, HttpAgent } from '@icp-sdk/core/agent';
   * import { Principal } from '@icp-sdk/core/principal';
   * import { idlFactory } from './api/declarations/hello-world.did';
   *
   * const canisterId = Principal.fromText('rrkah-fqaaa-aaaaa-aaaaq-cai');
   *
   * const agent = await HttpAgent.create({
   *   host: 'https://icp-api.io',
   * });
   *
   * const actor = Actor.createActor(idlFactory, {
   *   agent,
   *   canisterId,
   * });
   *
   * const response = await actor.greet('world');
   * console.log(response);
   * ```
   * @example
   * Using the `createActor` wrapper function generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package:
   * ```ts
   * import { HttpAgent } from '@icp-sdk/core/agent';
   * import { Principal } from '@icp-sdk/core/principal';
   * import { createActor } from './api/hello-world';
   *
   * const canisterId = Principal.fromText('rrkah-fqaaa-aaaaa-aaaaq-cai');
   *
   * const agent = await HttpAgent.create({
   *   host: 'https://icp-api.io',
   * });
   *
   * const actor = createActor(canisterId, {
   *   agent,
   * });
   *
   * const response = await actor.greet('world');
   * console.log(response);
   * ```
   */
  static createActor(interfaceFactory, configuration) {
    if (!configuration.canisterId) {
      throw InputError.fromCode(new MissingCanisterIdErrorCode(configuration.canisterId));
    }
    return new (this.createActorClass(interfaceFactory))(configuration);
  }
  /**
   * Returns an actor with methods that return the http response details along with the result
   * @param interfaceFactory - the interface factory for the actor
   * @param configuration - the configuration for the actor
   * @deprecated - use createActor with actorClassOptions instead
   */
  static createActorWithHttpDetails(interfaceFactory, configuration) {
    return new (this.createActorClass(interfaceFactory, { httpDetails: true }))(configuration);
  }
  /**
   * Returns an actor with methods that return the http response details along with the result
   * @param interfaceFactory - the interface factory for the actor
   * @param configuration - the configuration for the actor
   * @param actorClassOptions - options for the actor class extended details to return with the result
   */
  static createActorWithExtendedDetails(interfaceFactory, configuration, actorClassOptions = {
    httpDetails: true,
    certificate: true
  }) {
    return new (this.createActorClass(interfaceFactory, actorClassOptions))(configuration);
  }
  constructor(metadata) {
    this[metadataSymbol] = Object.freeze(metadata);
  }
}
function decodeReturnValue(types, msg) {
  const returnValues = decode(types, msg);
  switch (returnValues.length) {
    case 0:
      return void 0;
    case 1:
      return returnValues[0];
    default:
      return returnValues;
  }
}
const DEFAULT_ACTOR_CONFIG = {
  pollingOptions: DEFAULT_POLLING_OPTIONS
};
const ACTOR_METHOD_WITH_HTTP_DETAILS = "http-details";
const ACTOR_METHOD_WITH_CERTIFICATE = "certificate";
function _createActorMethod(actor, methodName, func, blsVerify) {
  let caller;
  if (func.annotations.includes("query") || func.annotations.includes("composite_query")) {
    caller = async (options, ...args) => {
      var _a2, _b;
      options = {
        ...options,
        ...(_b = (_a2 = actor[metadataSymbol].config).queryTransform) == null ? void 0 : _b.call(_a2, methodName, args, {
          ...actor[metadataSymbol].config,
          ...options
        })
      };
      const agent = options.agent || actor[metadataSymbol].config.agent || new HttpAgent();
      const cid = Principal.from(options.canisterId || actor[metadataSymbol].config.canisterId);
      const arg = encode(func.argTypes, args);
      const result = await agent.query(cid, {
        methodName,
        arg,
        effectiveCanisterId: options.effectiveCanisterId
      });
      const httpDetails = {
        ...result.httpDetails,
        requestDetails: result.requestDetails
      };
      switch (result.status) {
        case QueryResponseStatus.Rejected: {
          const uncertifiedRejectErrorCode = new UncertifiedRejectErrorCode(result.requestId, result.reject_code, result.reject_message, result.error_code, result.signatures);
          uncertifiedRejectErrorCode.callContext = {
            canisterId: cid,
            methodName,
            httpDetails
          };
          throw RejectError.fromCode(uncertifiedRejectErrorCode);
        }
        case QueryResponseStatus.Replied:
          return func.annotations.includes(ACTOR_METHOD_WITH_HTTP_DETAILS) ? {
            httpDetails,
            result: decodeReturnValue(func.retTypes, result.reply.arg)
          } : decodeReturnValue(func.retTypes, result.reply.arg);
      }
    };
  } else {
    caller = async (options, ...args) => {
      var _a2, _b;
      options = {
        ...options,
        ...(_b = (_a2 = actor[metadataSymbol].config).callTransform) == null ? void 0 : _b.call(_a2, methodName, args, {
          ...actor[metadataSymbol].config,
          ...options
        })
      };
      const agent = options.agent || actor[metadataSymbol].config.agent || HttpAgent.createSync();
      const { canisterId, effectiveCanisterId, pollingOptions } = {
        ...DEFAULT_ACTOR_CONFIG,
        ...actor[metadataSymbol].config,
        ...options
      };
      const cid = Principal.from(canisterId);
      const ecid = effectiveCanisterId !== void 0 ? Principal.from(effectiveCanisterId) : cid;
      const arg = encode(func.argTypes, args);
      const { requestId, response, requestDetails } = await agent.call(cid, {
        methodName,
        arg,
        effectiveCanisterId: ecid,
        nonce: options.nonce
      });
      let reply;
      let certificate;
      if (isV3ResponseBody(response.body)) {
        if (agent.rootKey == null) {
          throw ExternalError.fromCode(new MissingRootKeyErrorCode());
        }
        const cert = response.body.certificate;
        certificate = await Certificate.create({
          certificate: cert,
          rootKey: agent.rootKey,
          canisterId: ecid,
          blsVerify,
          agent
        });
        const path = [utf8ToBytes("request_status"), requestId];
        const status = new TextDecoder().decode(lookupResultToBuffer(certificate.lookup_path([...path, "status"])));
        switch (status) {
          case "replied":
            reply = lookupResultToBuffer(certificate.lookup_path([...path, "reply"]));
            break;
          case "rejected": {
            const rejectCode = new Uint8Array(lookupResultToBuffer(certificate.lookup_path([...path, "reject_code"])))[0];
            const rejectMessage = new TextDecoder().decode(lookupResultToBuffer(certificate.lookup_path([...path, "reject_message"])));
            const error_code_buf = lookupResultToBuffer(certificate.lookup_path([...path, "error_code"]));
            const error_code = error_code_buf ? new TextDecoder().decode(error_code_buf) : void 0;
            const certifiedRejectErrorCode = new CertifiedRejectErrorCode(requestId, rejectCode, rejectMessage, error_code);
            certifiedRejectErrorCode.callContext = {
              canisterId: cid,
              methodName,
              httpDetails: response
            };
            throw RejectError.fromCode(certifiedRejectErrorCode);
          }
        }
      } else if (isV2ResponseBody(response.body)) {
        const { reject_code, reject_message, error_code } = response.body;
        const errorCode = new UncertifiedRejectUpdateErrorCode(requestId, reject_code, reject_message, error_code);
        errorCode.callContext = {
          canisterId: cid,
          methodName,
          httpDetails: response
        };
        throw RejectError.fromCode(errorCode);
      }
      if (response.status === 202) {
        const pollOptions = {
          ...pollingOptions,
          blsVerify
        };
        const response2 = await pollForResponse(agent, ecid, requestId, pollOptions);
        certificate = response2.certificate;
        reply = response2.reply;
      }
      const shouldIncludeHttpDetails = func.annotations.includes(ACTOR_METHOD_WITH_HTTP_DETAILS);
      const shouldIncludeCertificate = func.annotations.includes(ACTOR_METHOD_WITH_CERTIFICATE);
      const httpDetails = { ...response, requestDetails };
      if (reply !== void 0) {
        if (shouldIncludeHttpDetails && shouldIncludeCertificate) {
          return {
            httpDetails,
            certificate,
            result: decodeReturnValue(func.retTypes, reply)
          };
        } else if (shouldIncludeCertificate) {
          return {
            certificate,
            result: decodeReturnValue(func.retTypes, reply)
          };
        } else if (shouldIncludeHttpDetails) {
          return {
            httpDetails,
            result: decodeReturnValue(func.retTypes, reply)
          };
        }
        return decodeReturnValue(func.retTypes, reply);
      } else {
        const errorCode = new UnexpectedErrorCode(`Call was returned undefined. We cannot determine if the call was successful or not. Return types: [${func.retTypes.map((t) => t.display()).join(",")}].`);
        errorCode.callContext = {
          canisterId: cid,
          methodName,
          httpDetails
        };
        throw UnknownError.fromCode(errorCode);
      }
    };
  }
  const handler = (...args) => caller({}, ...args);
  handler.withOptions = (options) => (...args) => caller(options, ...args);
  return handler;
}
var QueryObserver = (_a = class extends Subscribable {
  constructor(client, options) {
    super();
    __privateAdd(this, _QueryObserver_instances);
    __privateAdd(this, _client);
    __privateAdd(this, _currentQuery);
    __privateAdd(this, _currentQueryInitialState);
    __privateAdd(this, _currentResult);
    __privateAdd(this, _currentResultState);
    __privateAdd(this, _currentResultOptions);
    __privateAdd(this, _currentThenable);
    __privateAdd(this, _selectError);
    __privateAdd(this, _selectFn);
    __privateAdd(this, _selectResult);
    // This property keeps track of the last query with defined data.
    // It will be used to pass the previous data and query to the placeholder function between renders.
    __privateAdd(this, _lastQueryWithDefinedData);
    __privateAdd(this, _staleTimeoutId);
    __privateAdd(this, _refetchIntervalId);
    __privateAdd(this, _currentRefetchInterval);
    __privateAdd(this, _trackedProps, /* @__PURE__ */ new Set());
    this.options = options;
    __privateSet(this, _client, client);
    __privateSet(this, _selectError, null);
    __privateSet(this, _currentThenable, pendingThenable());
    this.bindMethods();
    this.setOptions(options);
  }
  bindMethods() {
    this.refetch = this.refetch.bind(this);
  }
  onSubscribe() {
    if (this.listeners.size === 1) {
      __privateGet(this, _currentQuery).addObserver(this);
      if (shouldFetchOnMount(__privateGet(this, _currentQuery), this.options)) {
        __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
      } else {
        this.updateResult();
      }
      __privateMethod(this, _QueryObserver_instances, updateTimers_fn).call(this);
    }
  }
  onUnsubscribe() {
    if (!this.hasListeners()) {
      this.destroy();
    }
  }
  shouldFetchOnReconnect() {
    return shouldFetchOn(
      __privateGet(this, _currentQuery),
      this.options,
      this.options.refetchOnReconnect
    );
  }
  shouldFetchOnWindowFocus() {
    return shouldFetchOn(
      __privateGet(this, _currentQuery),
      this.options,
      this.options.refetchOnWindowFocus
    );
  }
  destroy() {
    this.listeners = /* @__PURE__ */ new Set();
    __privateMethod(this, _QueryObserver_instances, clearStaleTimeout_fn).call(this);
    __privateMethod(this, _QueryObserver_instances, clearRefetchInterval_fn).call(this);
    __privateGet(this, _currentQuery).removeObserver(this);
  }
  setOptions(options) {
    const prevOptions = this.options;
    const prevQuery = __privateGet(this, _currentQuery);
    this.options = __privateGet(this, _client).defaultQueryOptions(options);
    if (this.options.enabled !== void 0 && typeof this.options.enabled !== "boolean" && typeof this.options.enabled !== "function" && typeof resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== "boolean") {
      throw new Error(
        "Expected enabled to be a boolean or a callback that returns a boolean"
      );
    }
    __privateMethod(this, _QueryObserver_instances, updateQuery_fn).call(this);
    __privateGet(this, _currentQuery).setOptions(this.options);
    if (prevOptions._defaulted && !shallowEqualObjects(this.options, prevOptions)) {
      __privateGet(this, _client).getQueryCache().notify({
        type: "observerOptionsUpdated",
        query: __privateGet(this, _currentQuery),
        observer: this
      });
    }
    const mounted = this.hasListeners();
    if (mounted && shouldFetchOptionally(
      __privateGet(this, _currentQuery),
      prevQuery,
      this.options,
      prevOptions
    )) {
      __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
    }
    this.updateResult();
    if (mounted && (__privateGet(this, _currentQuery) !== prevQuery || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== resolveEnabled(prevOptions.enabled, __privateGet(this, _currentQuery)) || resolveStaleTime(this.options.staleTime, __privateGet(this, _currentQuery)) !== resolveStaleTime(prevOptions.staleTime, __privateGet(this, _currentQuery)))) {
      __privateMethod(this, _QueryObserver_instances, updateStaleTimeout_fn).call(this);
    }
    const nextRefetchInterval = __privateMethod(this, _QueryObserver_instances, computeRefetchInterval_fn).call(this);
    if (mounted && (__privateGet(this, _currentQuery) !== prevQuery || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== resolveEnabled(prevOptions.enabled, __privateGet(this, _currentQuery)) || nextRefetchInterval !== __privateGet(this, _currentRefetchInterval))) {
      __privateMethod(this, _QueryObserver_instances, updateRefetchInterval_fn).call(this, nextRefetchInterval);
    }
  }
  getOptimisticResult(options) {
    const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), options);
    const result = this.createResult(query, options);
    if (shouldAssignObserverCurrentProperties(this, result)) {
      __privateSet(this, _currentResult, result);
      __privateSet(this, _currentResultOptions, this.options);
      __privateSet(this, _currentResultState, __privateGet(this, _currentQuery).state);
    }
    return result;
  }
  getCurrentResult() {
    return __privateGet(this, _currentResult);
  }
  trackResult(result, onPropTracked) {
    return new Proxy(result, {
      get: (target, key) => {
        this.trackProp(key);
        onPropTracked == null ? void 0 : onPropTracked(key);
        if (key === "promise") {
          this.trackProp("data");
          if (!this.options.experimental_prefetchInRender && __privateGet(this, _currentThenable).status === "pending") {
            __privateGet(this, _currentThenable).reject(
              new Error(
                "experimental_prefetchInRender feature flag is not enabled"
              )
            );
          }
        }
        return Reflect.get(target, key);
      }
    });
  }
  trackProp(key) {
    __privateGet(this, _trackedProps).add(key);
  }
  getCurrentQuery() {
    return __privateGet(this, _currentQuery);
  }
  refetch({ ...options } = {}) {
    return this.fetch({
      ...options
    });
  }
  fetchOptimistic(options) {
    const defaultedOptions = __privateGet(this, _client).defaultQueryOptions(options);
    const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), defaultedOptions);
    return query.fetch().then(() => this.createResult(query, defaultedOptions));
  }
  fetch(fetchOptions) {
    return __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this, {
      ...fetchOptions,
      cancelRefetch: fetchOptions.cancelRefetch ?? true
    }).then(() => {
      this.updateResult();
      return __privateGet(this, _currentResult);
    });
  }
  createResult(query, options) {
    var _a2;
    const prevQuery = __privateGet(this, _currentQuery);
    const prevOptions = this.options;
    const prevResult = __privateGet(this, _currentResult);
    const prevResultState = __privateGet(this, _currentResultState);
    const prevResultOptions = __privateGet(this, _currentResultOptions);
    const queryChange = query !== prevQuery;
    const queryInitialState = queryChange ? query.state : __privateGet(this, _currentQueryInitialState);
    const { state } = query;
    let newState = { ...state };
    let isPlaceholderData = false;
    let data;
    if (options._optimisticResults) {
      const mounted = this.hasListeners();
      const fetchOnMount = !mounted && shouldFetchOnMount(query, options);
      const fetchOptionally = mounted && shouldFetchOptionally(query, prevQuery, options, prevOptions);
      if (fetchOnMount || fetchOptionally) {
        newState = {
          ...newState,
          ...fetchState(state.data, query.options)
        };
      }
      if (options._optimisticResults === "isRestoring") {
        newState.fetchStatus = "idle";
      }
    }
    let { error, errorUpdatedAt, status } = newState;
    data = newState.data;
    let skipSelect = false;
    if (options.placeholderData !== void 0 && data === void 0 && status === "pending") {
      let placeholderData;
      if ((prevResult == null ? void 0 : prevResult.isPlaceholderData) && options.placeholderData === (prevResultOptions == null ? void 0 : prevResultOptions.placeholderData)) {
        placeholderData = prevResult.data;
        skipSelect = true;
      } else {
        placeholderData = typeof options.placeholderData === "function" ? options.placeholderData(
          (_a2 = __privateGet(this, _lastQueryWithDefinedData)) == null ? void 0 : _a2.state.data,
          __privateGet(this, _lastQueryWithDefinedData)
        ) : options.placeholderData;
      }
      if (placeholderData !== void 0) {
        status = "success";
        data = replaceData(
          prevResult == null ? void 0 : prevResult.data,
          placeholderData,
          options
        );
        isPlaceholderData = true;
      }
    }
    if (options.select && data !== void 0 && !skipSelect) {
      if (prevResult && data === (prevResultState == null ? void 0 : prevResultState.data) && options.select === __privateGet(this, _selectFn)) {
        data = __privateGet(this, _selectResult);
      } else {
        try {
          __privateSet(this, _selectFn, options.select);
          data = options.select(data);
          data = replaceData(prevResult == null ? void 0 : prevResult.data, data, options);
          __privateSet(this, _selectResult, data);
          __privateSet(this, _selectError, null);
        } catch (selectError) {
          __privateSet(this, _selectError, selectError);
        }
      }
    }
    if (__privateGet(this, _selectError)) {
      error = __privateGet(this, _selectError);
      data = __privateGet(this, _selectResult);
      errorUpdatedAt = Date.now();
      status = "error";
    }
    const isFetching = newState.fetchStatus === "fetching";
    const isPending = status === "pending";
    const isError = status === "error";
    const isLoading = isPending && isFetching;
    const hasData = data !== void 0;
    const result = {
      status,
      fetchStatus: newState.fetchStatus,
      isPending,
      isSuccess: status === "success",
      isError,
      isInitialLoading: isLoading,
      isLoading,
      data,
      dataUpdatedAt: newState.dataUpdatedAt,
      error,
      errorUpdatedAt,
      failureCount: newState.fetchFailureCount,
      failureReason: newState.fetchFailureReason,
      errorUpdateCount: newState.errorUpdateCount,
      isFetched: query.isFetched(),
      isFetchedAfterMount: newState.dataUpdateCount > queryInitialState.dataUpdateCount || newState.errorUpdateCount > queryInitialState.errorUpdateCount,
      isFetching,
      isRefetching: isFetching && !isPending,
      isLoadingError: isError && !hasData,
      isPaused: newState.fetchStatus === "paused",
      isPlaceholderData,
      isRefetchError: isError && hasData,
      isStale: isStale(query, options),
      refetch: this.refetch,
      promise: __privateGet(this, _currentThenable),
      isEnabled: resolveEnabled(options.enabled, query) !== false
    };
    const nextResult = result;
    if (this.options.experimental_prefetchInRender) {
      const hasResultData = nextResult.data !== void 0;
      const isErrorWithoutData = nextResult.status === "error" && !hasResultData;
      const finalizeThenableIfPossible = (thenable) => {
        if (isErrorWithoutData) {
          thenable.reject(nextResult.error);
        } else if (hasResultData) {
          thenable.resolve(nextResult.data);
        }
      };
      const recreateThenable = () => {
        const pending = __privateSet(this, _currentThenable, nextResult.promise = pendingThenable());
        finalizeThenableIfPossible(pending);
      };
      const prevThenable = __privateGet(this, _currentThenable);
      switch (prevThenable.status) {
        case "pending":
          if (query.queryHash === prevQuery.queryHash) {
            finalizeThenableIfPossible(prevThenable);
          }
          break;
        case "fulfilled":
          if (isErrorWithoutData || nextResult.data !== prevThenable.value) {
            recreateThenable();
          }
          break;
        case "rejected":
          if (!isErrorWithoutData || nextResult.error !== prevThenable.reason) {
            recreateThenable();
          }
          break;
      }
    }
    return nextResult;
  }
  updateResult() {
    const prevResult = __privateGet(this, _currentResult);
    const nextResult = this.createResult(__privateGet(this, _currentQuery), this.options);
    __privateSet(this, _currentResultState, __privateGet(this, _currentQuery).state);
    __privateSet(this, _currentResultOptions, this.options);
    if (__privateGet(this, _currentResultState).data !== void 0) {
      __privateSet(this, _lastQueryWithDefinedData, __privateGet(this, _currentQuery));
    }
    if (shallowEqualObjects(nextResult, prevResult)) {
      return;
    }
    __privateSet(this, _currentResult, nextResult);
    const shouldNotifyListeners = () => {
      if (!prevResult) {
        return true;
      }
      const { notifyOnChangeProps } = this.options;
      const notifyOnChangePropsValue = typeof notifyOnChangeProps === "function" ? notifyOnChangeProps() : notifyOnChangeProps;
      if (notifyOnChangePropsValue === "all" || !notifyOnChangePropsValue && !__privateGet(this, _trackedProps).size) {
        return true;
      }
      const includedProps = new Set(
        notifyOnChangePropsValue ?? __privateGet(this, _trackedProps)
      );
      if (this.options.throwOnError) {
        includedProps.add("error");
      }
      return Object.keys(__privateGet(this, _currentResult)).some((key) => {
        const typedKey = key;
        const changed = __privateGet(this, _currentResult)[typedKey] !== prevResult[typedKey];
        return changed && includedProps.has(typedKey);
      });
    };
    __privateMethod(this, _QueryObserver_instances, notify_fn).call(this, { listeners: shouldNotifyListeners() });
  }
  onQueryUpdate() {
    this.updateResult();
    if (this.hasListeners()) {
      __privateMethod(this, _QueryObserver_instances, updateTimers_fn).call(this);
    }
  }
}, _client = new WeakMap(), _currentQuery = new WeakMap(), _currentQueryInitialState = new WeakMap(), _currentResult = new WeakMap(), _currentResultState = new WeakMap(), _currentResultOptions = new WeakMap(), _currentThenable = new WeakMap(), _selectError = new WeakMap(), _selectFn = new WeakMap(), _selectResult = new WeakMap(), _lastQueryWithDefinedData = new WeakMap(), _staleTimeoutId = new WeakMap(), _refetchIntervalId = new WeakMap(), _currentRefetchInterval = new WeakMap(), _trackedProps = new WeakMap(), _QueryObserver_instances = new WeakSet(), executeFetch_fn = function(fetchOptions) {
  __privateMethod(this, _QueryObserver_instances, updateQuery_fn).call(this);
  let promise = __privateGet(this, _currentQuery).fetch(
    this.options,
    fetchOptions
  );
  if (!(fetchOptions == null ? void 0 : fetchOptions.throwOnError)) {
    promise = promise.catch(noop);
  }
  return promise;
}, updateStaleTimeout_fn = function() {
  __privateMethod(this, _QueryObserver_instances, clearStaleTimeout_fn).call(this);
  const staleTime = resolveStaleTime(
    this.options.staleTime,
    __privateGet(this, _currentQuery)
  );
  if (environmentManager.isServer() || __privateGet(this, _currentResult).isStale || !isValidTimeout(staleTime)) {
    return;
  }
  const time = timeUntilStale(__privateGet(this, _currentResult).dataUpdatedAt, staleTime);
  const timeout2 = time + 1;
  __privateSet(this, _staleTimeoutId, timeoutManager.setTimeout(() => {
    if (!__privateGet(this, _currentResult).isStale) {
      this.updateResult();
    }
  }, timeout2));
}, computeRefetchInterval_fn = function() {
  return (typeof this.options.refetchInterval === "function" ? this.options.refetchInterval(__privateGet(this, _currentQuery)) : this.options.refetchInterval) ?? false;
}, updateRefetchInterval_fn = function(nextInterval) {
  __privateMethod(this, _QueryObserver_instances, clearRefetchInterval_fn).call(this);
  __privateSet(this, _currentRefetchInterval, nextInterval);
  if (environmentManager.isServer() || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) === false || !isValidTimeout(__privateGet(this, _currentRefetchInterval)) || __privateGet(this, _currentRefetchInterval) === 0) {
    return;
  }
  __privateSet(this, _refetchIntervalId, timeoutManager.setInterval(() => {
    if (this.options.refetchIntervalInBackground || focusManager.isFocused()) {
      __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
    }
  }, __privateGet(this, _currentRefetchInterval)));
}, updateTimers_fn = function() {
  __privateMethod(this, _QueryObserver_instances, updateStaleTimeout_fn).call(this);
  __privateMethod(this, _QueryObserver_instances, updateRefetchInterval_fn).call(this, __privateMethod(this, _QueryObserver_instances, computeRefetchInterval_fn).call(this));
}, clearStaleTimeout_fn = function() {
  if (__privateGet(this, _staleTimeoutId)) {
    timeoutManager.clearTimeout(__privateGet(this, _staleTimeoutId));
    __privateSet(this, _staleTimeoutId, void 0);
  }
}, clearRefetchInterval_fn = function() {
  if (__privateGet(this, _refetchIntervalId)) {
    timeoutManager.clearInterval(__privateGet(this, _refetchIntervalId));
    __privateSet(this, _refetchIntervalId, void 0);
  }
}, updateQuery_fn = function() {
  const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), this.options);
  if (query === __privateGet(this, _currentQuery)) {
    return;
  }
  const prevQuery = __privateGet(this, _currentQuery);
  __privateSet(this, _currentQuery, query);
  __privateSet(this, _currentQueryInitialState, query.state);
  if (this.hasListeners()) {
    prevQuery == null ? void 0 : prevQuery.removeObserver(this);
    query.addObserver(this);
  }
}, notify_fn = function(notifyOptions) {
  notifyManager.batch(() => {
    if (notifyOptions.listeners) {
      this.listeners.forEach((listener) => {
        listener(__privateGet(this, _currentResult));
      });
    }
    __privateGet(this, _client).getQueryCache().notify({
      query: __privateGet(this, _currentQuery),
      type: "observerResultsUpdated"
    });
  });
}, _a);
function shouldLoadOnMount(query, options) {
  return resolveEnabled(options.enabled, query) !== false && query.state.data === void 0 && !(query.state.status === "error" && options.retryOnMount === false);
}
function shouldFetchOnMount(query, options) {
  return shouldLoadOnMount(query, options) || query.state.data !== void 0 && shouldFetchOn(query, options, options.refetchOnMount);
}
function shouldFetchOn(query, options, field) {
  if (resolveEnabled(options.enabled, query) !== false && resolveStaleTime(options.staleTime, query) !== "static") {
    const value = typeof field === "function" ? field(query) : field;
    return value === "always" || value !== false && isStale(query, options);
  }
  return false;
}
function shouldFetchOptionally(query, prevQuery, options, prevOptions) {
  return (query !== prevQuery || resolveEnabled(prevOptions.enabled, query) === false) && (!options.suspense || query.state.status !== "error") && isStale(query, options);
}
function isStale(query, options) {
  return resolveEnabled(options.enabled, query) !== false && query.isStaleByTime(resolveStaleTime(options.staleTime, query));
}
function shouldAssignObserverCurrentProperties(observer, optimisticResult) {
  if (!shallowEqualObjects(observer.getCurrentResult(), optimisticResult)) {
    return true;
  }
  return false;
}
var IsRestoringContext = reactExports.createContext(false);
var useIsRestoring = () => reactExports.useContext(IsRestoringContext);
IsRestoringContext.Provider;
function createValue() {
  let isReset = false;
  return {
    clearReset: () => {
      isReset = false;
    },
    reset: () => {
      isReset = true;
    },
    isReset: () => {
      return isReset;
    }
  };
}
var QueryErrorResetBoundaryContext = reactExports.createContext(createValue());
var useQueryErrorResetBoundary = () => reactExports.useContext(QueryErrorResetBoundaryContext);
var ensurePreventErrorBoundaryRetry = (options, errorResetBoundary, query) => {
  const throwOnError = (query == null ? void 0 : query.state.error) && typeof options.throwOnError === "function" ? shouldThrowError(options.throwOnError, [query.state.error, query]) : options.throwOnError;
  if (options.suspense || options.experimental_prefetchInRender || throwOnError) {
    if (!errorResetBoundary.isReset()) {
      options.retryOnMount = false;
    }
  }
};
var useClearResetErrorBoundary = (errorResetBoundary) => {
  reactExports.useEffect(() => {
    errorResetBoundary.clearReset();
  }, [errorResetBoundary]);
};
var getHasError = ({
  result,
  errorResetBoundary,
  throwOnError,
  query,
  suspense
}) => {
  return result.isError && !errorResetBoundary.isReset() && !result.isFetching && query && (suspense && result.data === void 0 || shouldThrowError(throwOnError, [result.error, query]));
};
var ensureSuspenseTimers = (defaultedOptions) => {
  if (defaultedOptions.suspense) {
    const MIN_SUSPENSE_TIME_MS = 1e3;
    const clamp = (value) => value === "static" ? value : Math.max(value ?? MIN_SUSPENSE_TIME_MS, MIN_SUSPENSE_TIME_MS);
    const originalStaleTime = defaultedOptions.staleTime;
    defaultedOptions.staleTime = typeof originalStaleTime === "function" ? (...args) => clamp(originalStaleTime(...args)) : clamp(originalStaleTime);
    if (typeof defaultedOptions.gcTime === "number") {
      defaultedOptions.gcTime = Math.max(
        defaultedOptions.gcTime,
        MIN_SUSPENSE_TIME_MS
      );
    }
  }
};
var willFetch = (result, isRestoring) => result.isLoading && result.isFetching && !isRestoring;
var shouldSuspend = (defaultedOptions, result) => (defaultedOptions == null ? void 0 : defaultedOptions.suspense) && result.isPending;
var fetchOptimistic = (defaultedOptions, observer, errorResetBoundary) => observer.fetchOptimistic(defaultedOptions).catch(() => {
  errorResetBoundary.clearReset();
});
function useBaseQuery(options, Observer, queryClient) {
  var _a2, _b, _c, _d;
  const isRestoring = useIsRestoring();
  const errorResetBoundary = useQueryErrorResetBoundary();
  const client = useQueryClient();
  const defaultedOptions = client.defaultQueryOptions(options);
  (_b = (_a2 = client.getDefaultOptions().queries) == null ? void 0 : _a2._experimental_beforeQuery) == null ? void 0 : _b.call(
    _a2,
    defaultedOptions
  );
  const query = client.getQueryCache().get(defaultedOptions.queryHash);
  defaultedOptions._optimisticResults = isRestoring ? "isRestoring" : "optimistic";
  ensureSuspenseTimers(defaultedOptions);
  ensurePreventErrorBoundaryRetry(defaultedOptions, errorResetBoundary, query);
  useClearResetErrorBoundary(errorResetBoundary);
  const isNewCacheEntry = !client.getQueryCache().get(defaultedOptions.queryHash);
  const [observer] = reactExports.useState(
    () => new Observer(
      client,
      defaultedOptions
    )
  );
  const result = observer.getOptimisticResult(defaultedOptions);
  const shouldSubscribe = !isRestoring && options.subscribed !== false;
  reactExports.useSyncExternalStore(
    reactExports.useCallback(
      (onStoreChange) => {
        const unsubscribe = shouldSubscribe ? observer.subscribe(notifyManager.batchCalls(onStoreChange)) : noop;
        observer.updateResult();
        return unsubscribe;
      },
      [observer, shouldSubscribe]
    ),
    () => observer.getCurrentResult(),
    () => observer.getCurrentResult()
  );
  reactExports.useEffect(() => {
    observer.setOptions(defaultedOptions);
  }, [defaultedOptions, observer]);
  if (shouldSuspend(defaultedOptions, result)) {
    throw fetchOptimistic(defaultedOptions, observer, errorResetBoundary);
  }
  if (getHasError({
    result,
    errorResetBoundary,
    throwOnError: defaultedOptions.throwOnError,
    query,
    suspense: defaultedOptions.suspense
  })) {
    throw result.error;
  }
  (_d = (_c = client.getDefaultOptions().queries) == null ? void 0 : _c._experimental_afterQuery) == null ? void 0 : _d.call(
    _c,
    defaultedOptions,
    result
  );
  if (defaultedOptions.experimental_prefetchInRender && !environmentManager.isServer() && willFetch(result, isRestoring)) {
    const promise = isNewCacheEntry ? (
      // Fetch immediately on render in order to ensure `.promise` is resolved even if the component is unmounted
      fetchOptimistic(defaultedOptions, observer, errorResetBoundary)
    ) : (
      // subscribe to the "cache promise" so that we can finalize the currentThenable once data comes in
      query == null ? void 0 : query.promise
    );
    promise == null ? void 0 : promise.catch(noop).finally(() => {
      observer.updateResult();
    });
  }
  return !defaultedOptions.notifyOnChangeProps ? observer.trackResult(result) : result;
}
function useQuery(options, queryClient) {
  return useBaseQuery(options, QueryObserver);
}
function hasAccessControl(actor) {
  return typeof actor === "object" && actor !== null && "_initializeAccessControl" in actor;
}
const ACTOR_QUERY_KEY = "actor";
function useActor(createActor2) {
  const { identity, isAuthenticated } = useInternetIdentity();
  const queryClient = useQueryClient();
  const actorQuery = useQuery({
    queryKey: [ACTOR_QUERY_KEY, identity == null ? void 0 : identity.getPrincipal().toString()],
    queryFn: async () => {
      if (!isAuthenticated) {
        return await createActorWithConfig(createActor2);
      }
      const actorOptions = {
        agentOptions: {
          identity
        }
      };
      const actor = await createActorWithConfig(createActor2, actorOptions);
      if (hasAccessControl(actor)) {
        await actor._initializeAccessControl();
      }
      return actor;
    },
    // Only refetch when identity changes
    staleTime: Number.POSITIVE_INFINITY,
    // This will cause the actor to be recreated when the identity changes
    enabled: true
  });
  reactExports.useEffect(() => {
    if (actorQuery.data) {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return !query.queryKey.includes(ACTOR_QUERY_KEY);
        }
      });
      queryClient.refetchQueries({
        predicate: (query) => {
          return !query.queryKey.includes(ACTOR_QUERY_KEY);
        }
      });
    }
  }, [actorQuery.data, queryClient]);
  return {
    actor: actorQuery.data || null,
    isFetching: actorQuery.isFetching
  };
}
const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary: "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive: "border-transparent bg-destructive text-destructive-foreground [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({
  className,
  variant,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "span";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Comp,
    {
      "data-slot": "badge",
      className: cn(badgeVariants({ variant }), className),
      ...props
    }
  );
}
function Card({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "card",
      className: cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      ),
      ...props
    }
  );
}
function CardHeader({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "card-header",
      className: cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      ),
      ...props
    }
  );
}
function CardTitle({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "card-title",
      className: cn("leading-none font-semibold", className),
      ...props
    }
  );
}
function CardContent({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "card-content",
      className: cn("px-6", className),
      ...props
    }
  );
}
const AccountType$1 = Variant({
  "both": Null,
  "intraday": Null,
  "delivery": Null
});
const BrokerInput = Record({
  "accountId": Text,
  "accountType": AccountType$1,
  "brokerName": Text
});
const BrokerId = Nat;
const UserId = Principal$1;
const BrokerAccount = Record({
  "id": BrokerId,
  "accountId": Text,
  "owner": UserId,
  "accountType": AccountType$1,
  "brokerName": Text
});
const Timestamp = Int;
const AssetClass$1 = Variant({
  "mutualFund": Null,
  "equity": Null
});
const HoldingInput = Record({
  "ticker": Text,
  "purchasePrice": Float64,
  "purchaseDate": Timestamp,
  "companyName": Text,
  "quantity": Float64,
  "assetClass": AssetClass$1
});
const HoldingId = Nat;
const Holding = Record({
  "id": HoldingId,
  "ticker": Text,
  "purchasePrice": Float64,
  "purchaseDate": Timestamp,
  "owner": UserId,
  "companyName": Text,
  "quantity": Float64,
  "assetClass": AssetClass$1
});
const BenchmarkResult = Record({
  "sp500YtdReturn": Float64,
  "portfolioYtdReturn": Float64
});
const Action$1 = Variant({
  "buy": Null,
  "hold": Null,
  "sell": Null
});
const RiskRating$1 = Variant({
  "low": Null,
  "high": Null,
  "medium": Null
});
const StockRecommendation = Record({
  "currentPrice": Float64,
  "action": Action$1,
  "ticker": Text,
  "expectedReturn": Float64,
  "riskRating": RiskRating$1,
  "targetPrice": Float64,
  "companyName": Text
});
const PortfolioSummary = Record({
  "gainLossAmt": Float64,
  "gainLossPct": Float64,
  "totalInvestment": Float64,
  "totalValue": Float64
});
const RebalanceAlert = Record({
  "ticker": Text,
  "targetPct": Float64,
  "currentPct": Float64,
  "driftPct": Float64,
  "assetClass": AssetClass$1
});
const TargetAllocation = Record({
  "targetPct": Float64,
  "assetClass": AssetClass$1
});
const RebalancingFrequency$1 = Variant({
  "monthly": Null,
  "daily": Null,
  "weekly": Null
});
const PortfolioSettingsView = Record({
  "name": Text,
  "targetAllocations": Vec(TargetAllocation),
  "rebalancingFrequency": RebalancingFrequency$1,
  "riskFreeRate": Float64,
  "cashBalance": Float64,
  "initialInvestment": Float64
});
const TaxBucket$1 = Variant({
  "ltcg": Null,
  "stcg": Null,
  "unrealized": Null
});
const TaxPosition = Record({
  "gainLossAmt": Float64,
  "ticker": Text,
  "taxLiability": Float64,
  "holdingId": HoldingId,
  "bucket": TaxBucket$1
});
const TaxSummary = Record({
  "ltcgTax": Float64,
  "stcgTax": Float64,
  "unrealizedTotal": Float64,
  "stcgTotal": Float64,
  "positions": Vec(TaxPosition),
  "ltcgTotal": Float64
});
Service({
  "addBroker": Func([BrokerInput], [BrokerAccount], []),
  "addHolding": Func([HoldingInput], [Holding], []),
  "deleteHolding": Func([HoldingId], [Bool], []),
  "getBenchmark": Func([], [BenchmarkResult], ["query"]),
  "getDailyRecommendations": Func(
    [],
    [Vec(StockRecommendation)],
    ["query"]
  ),
  "getPortfolioSummary": Func([], [PortfolioSummary], ["query"]),
  "getRebalanceAlerts": Func([], [Vec(RebalanceAlert)], ["query"]),
  "getSettings": Func([], [PortfolioSettingsView], ["query"]),
  "getSharpeRatio": Func([], [Float64], ["query"]),
  "getTaxSummary": Func([], [TaxSummary], ["query"]),
  "getVolatility": Func([], [Float64], ["query"]),
  "listBrokers": Func([], [Vec(BrokerAccount)], ["query"]),
  "listHoldings": Func([], [Vec(Holding)], ["query"]),
  "removeBroker": Func([BrokerId], [Bool], []),
  "updateHolding": Func([HoldingId, HoldingInput], [Bool], []),
  "updateSettings": Func([PortfolioSettingsView], [], [])
});
const idlFactory = ({ IDL: IDL2 }) => {
  const AccountType2 = IDL2.Variant({
    "both": IDL2.Null,
    "intraday": IDL2.Null,
    "delivery": IDL2.Null
  });
  const BrokerInput2 = IDL2.Record({
    "accountId": IDL2.Text,
    "accountType": AccountType2,
    "brokerName": IDL2.Text
  });
  const BrokerId2 = IDL2.Nat;
  const UserId2 = IDL2.Principal;
  const BrokerAccount2 = IDL2.Record({
    "id": BrokerId2,
    "accountId": IDL2.Text,
    "owner": UserId2,
    "accountType": AccountType2,
    "brokerName": IDL2.Text
  });
  const Timestamp2 = IDL2.Int;
  const AssetClass2 = IDL2.Variant({
    "mutualFund": IDL2.Null,
    "equity": IDL2.Null
  });
  const HoldingInput2 = IDL2.Record({
    "ticker": IDL2.Text,
    "purchasePrice": IDL2.Float64,
    "purchaseDate": Timestamp2,
    "companyName": IDL2.Text,
    "quantity": IDL2.Float64,
    "assetClass": AssetClass2
  });
  const HoldingId2 = IDL2.Nat;
  const Holding2 = IDL2.Record({
    "id": HoldingId2,
    "ticker": IDL2.Text,
    "purchasePrice": IDL2.Float64,
    "purchaseDate": Timestamp2,
    "owner": UserId2,
    "companyName": IDL2.Text,
    "quantity": IDL2.Float64,
    "assetClass": AssetClass2
  });
  const BenchmarkResult2 = IDL2.Record({
    "sp500YtdReturn": IDL2.Float64,
    "portfolioYtdReturn": IDL2.Float64
  });
  const Action2 = IDL2.Variant({
    "buy": IDL2.Null,
    "hold": IDL2.Null,
    "sell": IDL2.Null
  });
  const RiskRating2 = IDL2.Variant({
    "low": IDL2.Null,
    "high": IDL2.Null,
    "medium": IDL2.Null
  });
  const StockRecommendation2 = IDL2.Record({
    "currentPrice": IDL2.Float64,
    "action": Action2,
    "ticker": IDL2.Text,
    "expectedReturn": IDL2.Float64,
    "riskRating": RiskRating2,
    "targetPrice": IDL2.Float64,
    "companyName": IDL2.Text
  });
  const PortfolioSummary2 = IDL2.Record({
    "gainLossAmt": IDL2.Float64,
    "gainLossPct": IDL2.Float64,
    "totalInvestment": IDL2.Float64,
    "totalValue": IDL2.Float64
  });
  const RebalanceAlert2 = IDL2.Record({
    "ticker": IDL2.Text,
    "targetPct": IDL2.Float64,
    "currentPct": IDL2.Float64,
    "driftPct": IDL2.Float64,
    "assetClass": AssetClass2
  });
  const TargetAllocation2 = IDL2.Record({
    "targetPct": IDL2.Float64,
    "assetClass": AssetClass2
  });
  const RebalancingFrequency2 = IDL2.Variant({
    "monthly": IDL2.Null,
    "daily": IDL2.Null,
    "weekly": IDL2.Null
  });
  const PortfolioSettingsView2 = IDL2.Record({
    "name": IDL2.Text,
    "targetAllocations": IDL2.Vec(TargetAllocation2),
    "rebalancingFrequency": RebalancingFrequency2,
    "riskFreeRate": IDL2.Float64,
    "cashBalance": IDL2.Float64,
    "initialInvestment": IDL2.Float64
  });
  const TaxBucket2 = IDL2.Variant({
    "ltcg": IDL2.Null,
    "stcg": IDL2.Null,
    "unrealized": IDL2.Null
  });
  const TaxPosition2 = IDL2.Record({
    "gainLossAmt": IDL2.Float64,
    "ticker": IDL2.Text,
    "taxLiability": IDL2.Float64,
    "holdingId": HoldingId2,
    "bucket": TaxBucket2
  });
  const TaxSummary2 = IDL2.Record({
    "ltcgTax": IDL2.Float64,
    "stcgTax": IDL2.Float64,
    "unrealizedTotal": IDL2.Float64,
    "stcgTotal": IDL2.Float64,
    "positions": IDL2.Vec(TaxPosition2),
    "ltcgTotal": IDL2.Float64
  });
  return IDL2.Service({
    "addBroker": IDL2.Func([BrokerInput2], [BrokerAccount2], []),
    "addHolding": IDL2.Func([HoldingInput2], [Holding2], []),
    "deleteHolding": IDL2.Func([HoldingId2], [IDL2.Bool], []),
    "getBenchmark": IDL2.Func([], [BenchmarkResult2], ["query"]),
    "getDailyRecommendations": IDL2.Func(
      [],
      [IDL2.Vec(StockRecommendation2)],
      ["query"]
    ),
    "getPortfolioSummary": IDL2.Func([], [PortfolioSummary2], ["query"]),
    "getRebalanceAlerts": IDL2.Func([], [IDL2.Vec(RebalanceAlert2)], ["query"]),
    "getSettings": IDL2.Func([], [PortfolioSettingsView2], ["query"]),
    "getSharpeRatio": IDL2.Func([], [IDL2.Float64], ["query"]),
    "getTaxSummary": IDL2.Func([], [TaxSummary2], ["query"]),
    "getVolatility": IDL2.Func([], [IDL2.Float64], ["query"]),
    "listBrokers": IDL2.Func([], [IDL2.Vec(BrokerAccount2)], ["query"]),
    "listHoldings": IDL2.Func([], [IDL2.Vec(Holding2)], ["query"]),
    "removeBroker": IDL2.Func([BrokerId2], [IDL2.Bool], []),
    "updateHolding": IDL2.Func([HoldingId2, HoldingInput2], [IDL2.Bool], []),
    "updateSettings": IDL2.Func([PortfolioSettingsView2], [], [])
  });
};
var AccountType = /* @__PURE__ */ ((AccountType2) => {
  AccountType2["both"] = "both";
  AccountType2["intraday"] = "intraday";
  AccountType2["delivery"] = "delivery";
  return AccountType2;
})(AccountType || {});
var Action = /* @__PURE__ */ ((Action2) => {
  Action2["buy"] = "buy";
  Action2["hold"] = "hold";
  Action2["sell"] = "sell";
  return Action2;
})(Action || {});
var AssetClass = /* @__PURE__ */ ((AssetClass2) => {
  AssetClass2["mutualFund"] = "mutualFund";
  AssetClass2["equity"] = "equity";
  return AssetClass2;
})(AssetClass || {});
var RebalancingFrequency = /* @__PURE__ */ ((RebalancingFrequency2) => {
  RebalancingFrequency2["monthly"] = "monthly";
  RebalancingFrequency2["daily"] = "daily";
  RebalancingFrequency2["weekly"] = "weekly";
  return RebalancingFrequency2;
})(RebalancingFrequency || {});
var RiskRating = /* @__PURE__ */ ((RiskRating2) => {
  RiskRating2["low"] = "low";
  RiskRating2["high"] = "high";
  RiskRating2["medium"] = "medium";
  return RiskRating2;
})(RiskRating || {});
var TaxBucket = /* @__PURE__ */ ((TaxBucket2) => {
  TaxBucket2["ltcg"] = "ltcg";
  TaxBucket2["stcg"] = "stcg";
  TaxBucket2["unrealized"] = "unrealized";
  return TaxBucket2;
})(TaxBucket || {});
class Backend {
  constructor(actor, _uploadFile, _downloadFile, processError) {
    this.actor = actor;
    this._uploadFile = _uploadFile;
    this._downloadFile = _downloadFile;
    this.processError = processError;
  }
  async addBroker(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.addBroker(to_candid_BrokerInput_n1(this._uploadFile, this._downloadFile, arg0));
        return from_candid_BrokerAccount_n5(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.addBroker(to_candid_BrokerInput_n1(this._uploadFile, this._downloadFile, arg0));
      return from_candid_BrokerAccount_n5(this._uploadFile, this._downloadFile, result);
    }
  }
  async addHolding(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.addHolding(to_candid_HoldingInput_n9(this._uploadFile, this._downloadFile, arg0));
        return from_candid_Holding_n13(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.addHolding(to_candid_HoldingInput_n9(this._uploadFile, this._downloadFile, arg0));
      return from_candid_Holding_n13(this._uploadFile, this._downloadFile, result);
    }
  }
  async deleteHolding(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.deleteHolding(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.deleteHolding(arg0);
      return result;
    }
  }
  async getBenchmark() {
    if (this.processError) {
      try {
        const result = await this.actor.getBenchmark();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getBenchmark();
      return result;
    }
  }
  async getDailyRecommendations() {
    if (this.processError) {
      try {
        const result = await this.actor.getDailyRecommendations();
        return from_candid_vec_n17(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getDailyRecommendations();
      return from_candid_vec_n17(this._uploadFile, this._downloadFile, result);
    }
  }
  async getPortfolioSummary() {
    if (this.processError) {
      try {
        const result = await this.actor.getPortfolioSummary();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getPortfolioSummary();
      return result;
    }
  }
  async getRebalanceAlerts() {
    if (this.processError) {
      try {
        const result = await this.actor.getRebalanceAlerts();
        return from_candid_vec_n24(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getRebalanceAlerts();
      return from_candid_vec_n24(this._uploadFile, this._downloadFile, result);
    }
  }
  async getSettings() {
    if (this.processError) {
      try {
        const result = await this.actor.getSettings();
        return from_candid_PortfolioSettingsView_n27(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getSettings();
      return from_candid_PortfolioSettingsView_n27(this._uploadFile, this._downloadFile, result);
    }
  }
  async getSharpeRatio() {
    if (this.processError) {
      try {
        const result = await this.actor.getSharpeRatio();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getSharpeRatio();
      return result;
    }
  }
  async getTaxSummary() {
    if (this.processError) {
      try {
        const result = await this.actor.getTaxSummary();
        return from_candid_TaxSummary_n34(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getTaxSummary();
      return from_candid_TaxSummary_n34(this._uploadFile, this._downloadFile, result);
    }
  }
  async getVolatility() {
    if (this.processError) {
      try {
        const result = await this.actor.getVolatility();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getVolatility();
      return result;
    }
  }
  async listBrokers() {
    if (this.processError) {
      try {
        const result = await this.actor.listBrokers();
        return from_candid_vec_n41(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.listBrokers();
      return from_candid_vec_n41(this._uploadFile, this._downloadFile, result);
    }
  }
  async listHoldings() {
    if (this.processError) {
      try {
        const result = await this.actor.listHoldings();
        return from_candid_vec_n42(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.listHoldings();
      return from_candid_vec_n42(this._uploadFile, this._downloadFile, result);
    }
  }
  async removeBroker(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.removeBroker(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.removeBroker(arg0);
      return result;
    }
  }
  async updateHolding(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.updateHolding(arg0, to_candid_HoldingInput_n9(this._uploadFile, this._downloadFile, arg1));
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.updateHolding(arg0, to_candid_HoldingInput_n9(this._uploadFile, this._downloadFile, arg1));
      return result;
    }
  }
  async updateSettings(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.updateSettings(to_candid_PortfolioSettingsView_n43(this._uploadFile, this._downloadFile, arg0));
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.updateSettings(to_candid_PortfolioSettingsView_n43(this._uploadFile, this._downloadFile, arg0));
      return result;
    }
  }
}
function from_candid_AccountType_n7(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n8(_uploadFile, _downloadFile, value);
}
function from_candid_Action_n20(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n21(_uploadFile, _downloadFile, value);
}
function from_candid_AssetClass_n15(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n16(_uploadFile, _downloadFile, value);
}
function from_candid_BrokerAccount_n5(_uploadFile, _downloadFile, value) {
  return from_candid_record_n6(_uploadFile, _downloadFile, value);
}
function from_candid_Holding_n13(_uploadFile, _downloadFile, value) {
  return from_candid_record_n14(_uploadFile, _downloadFile, value);
}
function from_candid_PortfolioSettingsView_n27(_uploadFile, _downloadFile, value) {
  return from_candid_record_n28(_uploadFile, _downloadFile, value);
}
function from_candid_RebalanceAlert_n25(_uploadFile, _downloadFile, value) {
  return from_candid_record_n26(_uploadFile, _downloadFile, value);
}
function from_candid_RebalancingFrequency_n32(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n33(_uploadFile, _downloadFile, value);
}
function from_candid_RiskRating_n22(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n23(_uploadFile, _downloadFile, value);
}
function from_candid_StockRecommendation_n18(_uploadFile, _downloadFile, value) {
  return from_candid_record_n19(_uploadFile, _downloadFile, value);
}
function from_candid_TargetAllocation_n30(_uploadFile, _downloadFile, value) {
  return from_candid_record_n31(_uploadFile, _downloadFile, value);
}
function from_candid_TaxBucket_n39(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n40(_uploadFile, _downloadFile, value);
}
function from_candid_TaxPosition_n37(_uploadFile, _downloadFile, value) {
  return from_candid_record_n38(_uploadFile, _downloadFile, value);
}
function from_candid_TaxSummary_n34(_uploadFile, _downloadFile, value) {
  return from_candid_record_n35(_uploadFile, _downloadFile, value);
}
function from_candid_record_n14(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    ticker: value.ticker,
    purchasePrice: value.purchasePrice,
    purchaseDate: value.purchaseDate,
    owner: value.owner,
    companyName: value.companyName,
    quantity: value.quantity,
    assetClass: from_candid_AssetClass_n15(_uploadFile, _downloadFile, value.assetClass)
  };
}
function from_candid_record_n19(_uploadFile, _downloadFile, value) {
  return {
    currentPrice: value.currentPrice,
    action: from_candid_Action_n20(_uploadFile, _downloadFile, value.action),
    ticker: value.ticker,
    expectedReturn: value.expectedReturn,
    riskRating: from_candid_RiskRating_n22(_uploadFile, _downloadFile, value.riskRating),
    targetPrice: value.targetPrice,
    companyName: value.companyName
  };
}
function from_candid_record_n26(_uploadFile, _downloadFile, value) {
  return {
    ticker: value.ticker,
    targetPct: value.targetPct,
    currentPct: value.currentPct,
    driftPct: value.driftPct,
    assetClass: from_candid_AssetClass_n15(_uploadFile, _downloadFile, value.assetClass)
  };
}
function from_candid_record_n28(_uploadFile, _downloadFile, value) {
  return {
    name: value.name,
    targetAllocations: from_candid_vec_n29(_uploadFile, _downloadFile, value.targetAllocations),
    rebalancingFrequency: from_candid_RebalancingFrequency_n32(_uploadFile, _downloadFile, value.rebalancingFrequency),
    riskFreeRate: value.riskFreeRate,
    cashBalance: value.cashBalance,
    initialInvestment: value.initialInvestment
  };
}
function from_candid_record_n31(_uploadFile, _downloadFile, value) {
  return {
    targetPct: value.targetPct,
    assetClass: from_candid_AssetClass_n15(_uploadFile, _downloadFile, value.assetClass)
  };
}
function from_candid_record_n35(_uploadFile, _downloadFile, value) {
  return {
    ltcgTax: value.ltcgTax,
    stcgTax: value.stcgTax,
    unrealizedTotal: value.unrealizedTotal,
    stcgTotal: value.stcgTotal,
    positions: from_candid_vec_n36(_uploadFile, _downloadFile, value.positions),
    ltcgTotal: value.ltcgTotal
  };
}
function from_candid_record_n38(_uploadFile, _downloadFile, value) {
  return {
    gainLossAmt: value.gainLossAmt,
    ticker: value.ticker,
    taxLiability: value.taxLiability,
    holdingId: value.holdingId,
    bucket: from_candid_TaxBucket_n39(_uploadFile, _downloadFile, value.bucket)
  };
}
function from_candid_record_n6(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    accountId: value.accountId,
    owner: value.owner,
    accountType: from_candid_AccountType_n7(_uploadFile, _downloadFile, value.accountType),
    brokerName: value.brokerName
  };
}
function from_candid_variant_n16(_uploadFile, _downloadFile, value) {
  return "mutualFund" in value ? "mutualFund" : "equity" in value ? "equity" : value;
}
function from_candid_variant_n21(_uploadFile, _downloadFile, value) {
  return "buy" in value ? "buy" : "hold" in value ? "hold" : "sell" in value ? "sell" : value;
}
function from_candid_variant_n23(_uploadFile, _downloadFile, value) {
  return "low" in value ? "low" : "high" in value ? "high" : "medium" in value ? "medium" : value;
}
function from_candid_variant_n33(_uploadFile, _downloadFile, value) {
  return "monthly" in value ? "monthly" : "daily" in value ? "daily" : "weekly" in value ? "weekly" : value;
}
function from_candid_variant_n40(_uploadFile, _downloadFile, value) {
  return "ltcg" in value ? "ltcg" : "stcg" in value ? "stcg" : "unrealized" in value ? "unrealized" : value;
}
function from_candid_variant_n8(_uploadFile, _downloadFile, value) {
  return "both" in value ? "both" : "intraday" in value ? "intraday" : "delivery" in value ? "delivery" : value;
}
function from_candid_vec_n17(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_StockRecommendation_n18(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n24(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_RebalanceAlert_n25(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n29(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_TargetAllocation_n30(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n36(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_TaxPosition_n37(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n41(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_BrokerAccount_n5(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n42(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_Holding_n13(_uploadFile, _downloadFile, x));
}
function to_candid_AccountType_n3(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n4(_uploadFile, _downloadFile, value);
}
function to_candid_AssetClass_n11(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n12(_uploadFile, _downloadFile, value);
}
function to_candid_BrokerInput_n1(_uploadFile, _downloadFile, value) {
  return to_candid_record_n2(_uploadFile, _downloadFile, value);
}
function to_candid_HoldingInput_n9(_uploadFile, _downloadFile, value) {
  return to_candid_record_n10(_uploadFile, _downloadFile, value);
}
function to_candid_PortfolioSettingsView_n43(_uploadFile, _downloadFile, value) {
  return to_candid_record_n44(_uploadFile, _downloadFile, value);
}
function to_candid_RebalancingFrequency_n48(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n49(_uploadFile, _downloadFile, value);
}
function to_candid_TargetAllocation_n46(_uploadFile, _downloadFile, value) {
  return to_candid_record_n47(_uploadFile, _downloadFile, value);
}
function to_candid_record_n10(_uploadFile, _downloadFile, value) {
  return {
    ticker: value.ticker,
    purchasePrice: value.purchasePrice,
    purchaseDate: value.purchaseDate,
    companyName: value.companyName,
    quantity: value.quantity,
    assetClass: to_candid_AssetClass_n11(_uploadFile, _downloadFile, value.assetClass)
  };
}
function to_candid_record_n2(_uploadFile, _downloadFile, value) {
  return {
    accountId: value.accountId,
    accountType: to_candid_AccountType_n3(_uploadFile, _downloadFile, value.accountType),
    brokerName: value.brokerName
  };
}
function to_candid_record_n44(_uploadFile, _downloadFile, value) {
  return {
    name: value.name,
    targetAllocations: to_candid_vec_n45(_uploadFile, _downloadFile, value.targetAllocations),
    rebalancingFrequency: to_candid_RebalancingFrequency_n48(_uploadFile, _downloadFile, value.rebalancingFrequency),
    riskFreeRate: value.riskFreeRate,
    cashBalance: value.cashBalance,
    initialInvestment: value.initialInvestment
  };
}
function to_candid_record_n47(_uploadFile, _downloadFile, value) {
  return {
    targetPct: value.targetPct,
    assetClass: to_candid_AssetClass_n11(_uploadFile, _downloadFile, value.assetClass)
  };
}
function to_candid_variant_n12(_uploadFile, _downloadFile, value) {
  return value == "mutualFund" ? {
    mutualFund: null
  } : value == "equity" ? {
    equity: null
  } : value;
}
function to_candid_variant_n4(_uploadFile, _downloadFile, value) {
  return value == "both" ? {
    both: null
  } : value == "intraday" ? {
    intraday: null
  } : value == "delivery" ? {
    delivery: null
  } : value;
}
function to_candid_variant_n49(_uploadFile, _downloadFile, value) {
  return value == "monthly" ? {
    monthly: null
  } : value == "daily" ? {
    daily: null
  } : value == "weekly" ? {
    weekly: null
  } : value;
}
function to_candid_vec_n45(_uploadFile, _downloadFile, value) {
  return value.map((x) => to_candid_TargetAllocation_n46(_uploadFile, _downloadFile, x));
}
function createActor(canisterId, _uploadFile, _downloadFile, options = {}) {
  const agent = options.agent || HttpAgent.createSync({
    ...options.agentOptions
  });
  if (options.agent && options.agentOptions) {
    console.warn("Detected both agent and agentOptions passed to createActor. Ignoring agentOptions and proceeding with the provided agent.");
  }
  const actor = Actor.createActor(idlFactory, {
    agent,
    canisterId,
    ...options.actorOptions
  });
  return new Backend(actor, _uploadFile, _downloadFile, options.processError);
}
export {
  Action as A,
  Badge as B,
  Card as C,
  RiskRating as R,
  TaxBucket as T,
  CardHeader as a,
  CardTitle as b,
  CardContent as c,
  AssetClass as d,
  useQuery as e,
  createActor as f,
  RebalancingFrequency as g,
  AccountType as h,
  useActor as u
};
