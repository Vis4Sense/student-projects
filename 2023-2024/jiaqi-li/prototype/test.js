/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@azure-rest/core-client/dist/browser/apiVersionPolicy.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@azure-rest/core-client/dist/browser/apiVersionPolicy.js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   apiVersionPolicy: () => (/* binding */ apiVersionPolicy),
/* harmony export */   apiVersionPolicyName: () => (/* binding */ apiVersionPolicyName)
/* harmony export */ });
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
const apiVersionPolicyName = "ApiVersionPolicy";
/**
 * Creates a policy that sets the apiVersion as a query parameter on every request
 * @param options - Client options
 * @returns Pipeline policy that sets the apiVersion as a query parameter on every request
 */
function apiVersionPolicy(options) {
    return {
        name: apiVersionPolicyName,
        sendRequest: (req, next) => {
            // Use the apiVesion defined in request url directly
            // Append one if there is no apiVesion and we have one at client options
            const url = new URL(req.url);
            if (!url.searchParams.get("api-version") && options.apiVersion) {
                req.url = `${req.url}${Array.from(url.searchParams.keys()).length > 0 ? "&" : "?"}api-version=${options.apiVersion}`;
            }
            return next(req);
        },
    };
}
//# sourceMappingURL=apiVersionPolicy.js.map

/***/ }),

/***/ "./node_modules/@azure-rest/core-client/dist/browser/clientHelpers.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@azure-rest/core-client/dist/browser/clientHelpers.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addCredentialPipelinePolicy: () => (/* binding */ addCredentialPipelinePolicy),
/* harmony export */   createDefaultPipeline: () => (/* binding */ createDefaultPipeline),
/* harmony export */   getCachedDefaultHttpsClient: () => (/* binding */ getCachedDefaultHttpsClient)
/* harmony export */ });
/* harmony import */ var _azure_core_rest_pipeline__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @azure/core-rest-pipeline */ "./node_modules/@azure/core-rest-pipeline/dist/browser/index.js");
/* harmony import */ var _azure_core_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @azure/core-auth */ "./node_modules/@azure/core-auth/dist/browser/index.js");
/* harmony import */ var _apiVersionPolicy_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./apiVersionPolicy.js */ "./node_modules/@azure-rest/core-client/dist/browser/apiVersionPolicy.js");
/* harmony import */ var _keyCredentialAuthenticationPolicy_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./keyCredentialAuthenticationPolicy.js */ "./node_modules/@azure-rest/core-client/dist/browser/keyCredentialAuthenticationPolicy.js");
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.




let cachedHttpClient;
/**
 * Adds a credential policy to the pipeline if a credential is provided. If none is provided, no policy is added.
 */
function addCredentialPipelinePolicy(pipeline, endpoint, options = {}) {
    var _a, _b, _c, _d;
    const { credential, clientOptions } = options;
    if (!credential) {
        return;
    }
    if ((0,_azure_core_auth__WEBPACK_IMPORTED_MODULE_1__.isTokenCredential)(credential)) {
        const tokenPolicy = (0,_azure_core_rest_pipeline__WEBPACK_IMPORTED_MODULE_0__.bearerTokenAuthenticationPolicy)({
            credential,
            scopes: (_b = (_a = clientOptions === null || clientOptions === void 0 ? void 0 : clientOptions.credentials) === null || _a === void 0 ? void 0 : _a.scopes) !== null && _b !== void 0 ? _b : `${endpoint}/.default`,
        });
        pipeline.addPolicy(tokenPolicy);
    }
    else if (isKeyCredential(credential)) {
        if (!((_c = clientOptions === null || clientOptions === void 0 ? void 0 : clientOptions.credentials) === null || _c === void 0 ? void 0 : _c.apiKeyHeaderName)) {
            throw new Error(`Missing API Key Header Name`);
        }
        const keyPolicy = (0,_keyCredentialAuthenticationPolicy_js__WEBPACK_IMPORTED_MODULE_3__.keyCredentialAuthenticationPolicy)(credential, (_d = clientOptions === null || clientOptions === void 0 ? void 0 : clientOptions.credentials) === null || _d === void 0 ? void 0 : _d.apiKeyHeaderName);
        pipeline.addPolicy(keyPolicy);
    }
}
/**
 * Creates a default rest pipeline to re-use accross Rest Level Clients
 */
function createDefaultPipeline(endpoint, credential, options = {}) {
    const pipeline = (0,_azure_core_rest_pipeline__WEBPACK_IMPORTED_MODULE_0__.createPipelineFromOptions)(options);
    pipeline.addPolicy((0,_apiVersionPolicy_js__WEBPACK_IMPORTED_MODULE_2__.apiVersionPolicy)(options));
    addCredentialPipelinePolicy(pipeline, endpoint, { credential, clientOptions: options });
    return pipeline;
}
function isKeyCredential(credential) {
    return credential.key !== undefined;
}
function getCachedDefaultHttpsClient() {
    if (!cachedHttpClient) {
        cachedHttpClient = (0,_azure_core_rest_pipeline__WEBPACK_IMPORTED_MODULE_0__.createDefaultHttpClient)();
    }
    return cachedHttpClient;
}
//# sourceMappingURL=clientHelpers.js.map

/***/ }),

/***/ "./node_modules/@azure-rest/core-client/dist/browser/common.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@azure-rest/core-client/dist/browser/common.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

//# sourceMappingURL=common.js.map

/***/ }),

/***/ "./node_modules/@azure-rest/core-client/dist/browser/getClient.js":
/*!************************************************************************!*\
  !*** ./node_modules/@azure-rest/core-client/dist/browser/getClient.js ***!
  \************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getClient: () => (/* binding */ getClient)
/* harmony export */ });
/* harmony import */ var _azure_core_auth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @azure/core-auth */ "./node_modules/@azure/core-auth/dist/browser/index.js");
/* harmony import */ var _clientHelpers_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./clientHelpers.js */ "./node_modules/@azure-rest/core-client/dist/browser/clientHelpers.js");
/* harmony import */ var _sendRequest_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./sendRequest.js */ "./node_modules/@azure-rest/core-client/dist/browser/sendRequest.js");
/* harmony import */ var _urlHelpers_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./urlHelpers.js */ "./node_modules/@azure-rest/core-client/dist/browser/urlHelpers.js");
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.




function getClient(endpoint, credentialsOrPipelineOptions, clientOptions = {}) {
    var _a, _b;
    let credentials;
    if (credentialsOrPipelineOptions) {
        if (isCredential(credentialsOrPipelineOptions)) {
            credentials = credentialsOrPipelineOptions;
        }
        else {
            clientOptions = credentialsOrPipelineOptions !== null && credentialsOrPipelineOptions !== void 0 ? credentialsOrPipelineOptions : {};
        }
    }
    const pipeline = (0,_clientHelpers_js__WEBPACK_IMPORTED_MODULE_1__.createDefaultPipeline)(endpoint, credentials, clientOptions);
    if ((_a = clientOptions.additionalPolicies) === null || _a === void 0 ? void 0 : _a.length) {
        for (const { policy, position } of clientOptions.additionalPolicies) {
            // Sign happens after Retry and is commonly needed to occur
            // before policies that intercept post-retry.
            const afterPhase = position === "perRetry" ? "Sign" : undefined;
            pipeline.addPolicy(policy, {
                afterPhase,
            });
        }
    }
    const { allowInsecureConnection, httpClient } = clientOptions;
    const endpointUrl = (_b = clientOptions.endpoint) !== null && _b !== void 0 ? _b : endpoint;
    const client = (path, ...args) => {
        const getUrl = (requestOptions) => (0,_urlHelpers_js__WEBPACK_IMPORTED_MODULE_3__.buildRequestUrl)(endpointUrl, path, args, Object.assign({ allowInsecureConnection }, requestOptions));
        return {
            get: (requestOptions = {}) => {
                return buildOperation("GET", getUrl(requestOptions), pipeline, requestOptions, allowInsecureConnection, httpClient);
            },
            post: (requestOptions = {}) => {
                return buildOperation("POST", getUrl(requestOptions), pipeline, requestOptions, allowInsecureConnection, httpClient);
            },
            put: (requestOptions = {}) => {
                return buildOperation("PUT", getUrl(requestOptions), pipeline, requestOptions, allowInsecureConnection, httpClient);
            },
            patch: (requestOptions = {}) => {
                return buildOperation("PATCH", getUrl(requestOptions), pipeline, requestOptions, allowInsecureConnection, httpClient);
            },
            delete: (requestOptions = {}) => {
                return buildOperation("DELETE", getUrl(requestOptions), pipeline, requestOptions, allowInsecureConnection, httpClient);
            },
            head: (requestOptions = {}) => {
                return buildOperation("HEAD", getUrl(requestOptions), pipeline, requestOptions, allowInsecureConnection, httpClient);
            },
            options: (requestOptions = {}) => {
                return buildOperation("OPTIONS", getUrl(requestOptions), pipeline, requestOptions, allowInsecureConnection, httpClient);
            },
            trace: (requestOptions = {}) => {
                return buildOperation("TRACE", getUrl(requestOptions), pipeline, requestOptions, allowInsecureConnection, httpClient);
            },
        };
    };
    return {
        path: client,
        pathUnchecked: client,
        pipeline,
    };
}
function buildOperation(method, url, pipeline, options, allowInsecureConnection, httpClient) {
    var _a;
    allowInsecureConnection = (_a = options.allowInsecureConnection) !== null && _a !== void 0 ? _a : allowInsecureConnection;
    return {
        then: function (onFulfilled, onrejected) {
            return (0,_sendRequest_js__WEBPACK_IMPORTED_MODULE_2__.sendRequest)(method, url, pipeline, Object.assign(Object.assign({}, options), { allowInsecureConnection }), httpClient).then(onFulfilled, onrejected);
        },
        async asBrowserStream() {
            return (0,_sendRequest_js__WEBPACK_IMPORTED_MODULE_2__.sendRequest)(method, url, pipeline, Object.assign(Object.assign({}, options), { allowInsecureConnection, responseAsStream: true }), httpClient);
        },
        async asNodeStream() {
            return (0,_sendRequest_js__WEBPACK_IMPORTED_MODULE_2__.sendRequest)(method, url, pipeline, Object.assign(Object.assign({}, options), { allowInsecureConnection, responseAsStream: true }), httpClient);
        },
    };
}
function isCredential(param) {
    if (param.key !== undefined || (0,_azure_core_auth__WEBPACK_IMPORTED_MODULE_0__.isTokenCredential)(param)) {
        return true;
    }
    return false;
}
//# sourceMappingURL=getClient.js.map

/***/ }),

/***/ "./node_modules/@azure-rest/core-client/dist/browser/helpers/isReadableStream.js":
/*!***************************************************************************************!*\
  !*** ./node_modules/@azure-rest/core-client/dist/browser/helpers/isReadableStream.js ***!
  \***************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isReadableStream: () => (/* binding */ isReadableStream)
/* harmony export */ });
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/**
 * Checks if the body is a ReadableStream supported by browsers
 * @internal
 */
function isReadableStream(body) {
    return Boolean(body &&
        typeof body.getReader === "function" &&
        typeof body.tee === "function");
}
//# sourceMappingURL=isReadableStream-browser.mjs.map

/***/ }),

/***/ "./node_modules/@azure-rest/core-client/dist/browser/index.js":
/*!********************************************************************!*\
  !*** ./node_modules/@azure-rest/core-client/dist/browser/index.js ***!
  \********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addCredentialPipelinePolicy: () => (/* reexport safe */ _clientHelpers_js__WEBPACK_IMPORTED_MODULE_1__.addCredentialPipelinePolicy),
/* harmony export */   createRestError: () => (/* reexport safe */ _restError_js__WEBPACK_IMPORTED_MODULE_0__.createRestError),
/* harmony export */   getClient: () => (/* reexport safe */ _getClient_js__WEBPACK_IMPORTED_MODULE_3__.getClient),
/* harmony export */   operationOptionsToRequestParameters: () => (/* reexport safe */ _operationOptionHelpers_js__WEBPACK_IMPORTED_MODULE_2__.operationOptionsToRequestParameters)
/* harmony export */ });
/* harmony import */ var _restError_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./restError.js */ "./node_modules/@azure-rest/core-client/dist/browser/restError.js");
/* harmony import */ var _clientHelpers_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./clientHelpers.js */ "./node_modules/@azure-rest/core-client/dist/browser/clientHelpers.js");
/* harmony import */ var _operationOptionHelpers_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./operationOptionHelpers.js */ "./node_modules/@azure-rest/core-client/dist/browser/operationOptionHelpers.js");
/* harmony import */ var _getClient_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getClient.js */ "./node_modules/@azure-rest/core-client/dist/browser/getClient.js");
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./common.js */ "./node_modules/@azure-rest/core-client/dist/browser/common.js");
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/**
 * Azure Rest Core Client library for JavaScript
 * @packageDocumentation
 */





//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@azure-rest/core-client/dist/browser/keyCredentialAuthenticationPolicy.js":
/*!************************************************************************************************!*\
  !*** ./node_modules/@azure-rest/core-client/dist/browser/keyCredentialAuthenticationPolicy.js ***!
  \************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   keyCredentialAuthenticationPolicy: () => (/* binding */ keyCredentialAuthenticationPolicy),
/* harmony export */   keyCredentialAuthenticationPolicyName: () => (/* binding */ keyCredentialAuthenticationPolicyName)
/* harmony export */ });
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/**
 * The programmatic identifier of the bearerTokenAuthenticationPolicy.
 */
const keyCredentialAuthenticationPolicyName = "keyCredentialAuthenticationPolicy";
function keyCredentialAuthenticationPolicy(credential, apiKeyHeaderName) {
    return {
        name: keyCredentialAuthenticationPolicyName,
        async sendRequest(request, next) {
            request.headers.set(apiKeyHeaderName, credential.key);
            return next(request);
        },
    };
}
//# sourceMappingURL=keyCredentialAuthenticationPolicy.js.map

/***/ }),

/***/ "./node_modules/@azure-rest/core-client/dist/browser/operationOptionHelpers.js":
/*!*************************************************************************************!*\
  !*** ./node_modules/@azure-rest/core-client/dist/browser/operationOptionHelpers.js ***!
  \*************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   operationOptionsToRequestParameters: () => (/* binding */ operationOptionsToRequestParameters)
/* harmony export */ });
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/**
 * Helper function to convert OperationOptions to RequestParameters
 * @param options - the options that are used by Modular layer to send the request
 * @returns the result of the conversion in RequestParameters of RLC layer
 */
function operationOptionsToRequestParameters(options) {
    var _a, _b, _c, _d, _e, _f;
    return {
        allowInsecureConnection: (_a = options.requestOptions) === null || _a === void 0 ? void 0 : _a.allowInsecureConnection,
        timeout: (_b = options.requestOptions) === null || _b === void 0 ? void 0 : _b.timeout,
        skipUrlEncoding: (_c = options.requestOptions) === null || _c === void 0 ? void 0 : _c.skipUrlEncoding,
        abortSignal: options.abortSignal,
        onUploadProgress: (_d = options.requestOptions) === null || _d === void 0 ? void 0 : _d.onUploadProgress,
        onDownloadProgress: (_e = options.requestOptions) === null || _e === void 0 ? void 0 : _e.onDownloadProgress,
        tracingOptions: options.tracingOptions,
        headers: Object.assign({}, (_f = options.requestOptions) === null || _f === void 0 ? void 0 : _f.headers),
        onResponse: options.onResponse,
    };
}
//# sourceMappingURL=operationOptionHelpers.js.map

/***/ }),

/***/ "./node_modules/@azure-rest/core-client/dist/browser/restError.js":
/*!************************************************************************!*\
  !*** ./node_modules/@azure-rest/core-client/dist/browser/restError.js ***!
  \************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createRestError: () => (/* binding */ createRestError)
/* harmony export */ });
/* harmony import */ var _azure_core_rest_pipeline__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @azure/core-rest-pipeline */ "./node_modules/@azure/core-rest-pipeline/dist/browser/index.js");
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

function createRestError(messageOrResponse, response) {
    var _a;
    const resp = typeof messageOrResponse === "string" ? response : messageOrResponse;
    const internalError = resp.body.error || resp.body;
    const message = typeof messageOrResponse === "string"
        ? messageOrResponse
        : (_a = internalError.message) !== null && _a !== void 0 ? _a : `Unexpected status code: ${resp.status}`;
    return new _azure_core_rest_pipeline__WEBPACK_IMPORTED_MODULE_0__.RestError(message, {
        statusCode: statusCodeToNumber(resp.status),
        code: internalError.code,
        request: resp.request,
        response: toPipelineResponse(resp),
    });
}
function toPipelineResponse(response) {
    var _a;
    return {
        headers: (0,_azure_core_rest_pipeline__WEBPACK_IMPORTED_MODULE_0__.createHttpHeaders)(response.headers),
        request: response.request,
        status: (_a = statusCodeToNumber(response.status)) !== null && _a !== void 0 ? _a : -1,
    };
}
function statusCodeToNumber(statusCode) {
    const status = Number.parseInt(statusCode);
    return Number.isNaN(status) ? undefined : status;
}
//# sourceMappingURL=restError.js.map

/***/ }),

/***/ "./node_modules/@azure-rest/core-client/dist/browser/sendRequest.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@azure-rest/core-client/dist/browser/sendRequest.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   sendRequest: () => (/* binding */ sendRequest)
/* harmony export */ });
/* harmony import */ var _azure_core_rest_pipeline__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @azure/core-rest-pipeline */ "./node_modules/@azure/core-rest-pipeline/dist/browser/index.js");
/* harmony import */ var _clientHelpers_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./clientHelpers.js */ "./node_modules/@azure-rest/core-client/dist/browser/clientHelpers.js");
/* harmony import */ var _helpers_isReadableStream_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./helpers/isReadableStream.js */ "./node_modules/@azure-rest/core-client/dist/browser/helpers/isReadableStream.js");
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.



/**
 * Helper function to send request used by the client
 * @param method - method to use to send the request
 * @param url - url to send the request to
 * @param pipeline - pipeline with the policies to run when sending the request
 * @param options - request options
 * @param customHttpClient - a custom HttpClient to use when making the request
 * @returns returns and HttpResponse
 */
async function sendRequest(method, url, pipeline, options = {}, customHttpClient) {
    var _a;
    const httpClient = customHttpClient !== null && customHttpClient !== void 0 ? customHttpClient : (0,_clientHelpers_js__WEBPACK_IMPORTED_MODULE_1__.getCachedDefaultHttpsClient)();
    const request = buildPipelineRequest(method, url, options);
    const response = await pipeline.sendRequest(httpClient, request);
    const headers = response.headers.toJSON();
    const stream = (_a = response.readableStreamBody) !== null && _a !== void 0 ? _a : response.browserStreamBody;
    const parsedBody = options.responseAsStream || stream !== undefined ? undefined : getResponseBody(response);
    const body = stream !== null && stream !== void 0 ? stream : parsedBody;
    if (options === null || options === void 0 ? void 0 : options.onResponse) {
        options.onResponse(Object.assign(Object.assign({}, response), { request, rawHeaders: headers, parsedBody }));
    }
    return {
        request,
        headers,
        status: `${response.status}`,
        body,
    };
}
/**
 * Function to determine the request content type
 * @param options - request options InternalRequestParameters
 * @returns returns the content-type
 */
function getRequestContentType(options = {}) {
    var _a, _b, _c;
    return ((_c = (_a = options.contentType) !== null && _a !== void 0 ? _a : (_b = options.headers) === null || _b === void 0 ? void 0 : _b["content-type"]) !== null && _c !== void 0 ? _c : getContentType(options.body));
}
/**
 * Function to determine the content-type of a body
 * this is used if an explicit content-type is not provided
 * @param body - body in the request
 * @returns returns the content-type
 */
function getContentType(body) {
    if (ArrayBuffer.isView(body)) {
        return "application/octet-stream";
    }
    if (typeof body === "string") {
        try {
            JSON.parse(body);
            return "application/json; charset=UTF-8";
        }
        catch (error) {
            // If we fail to parse the body, it is not json
            return undefined;
        }
    }
    // By default return json
    return "application/json; charset=UTF-8";
}
function buildPipelineRequest(method, url, options = {}) {
    var _a, _b, _c;
    const requestContentType = getRequestContentType(options);
    const { body, formData } = getRequestBody(options.body, requestContentType);
    const hasContent = body !== undefined || formData !== undefined;
    const headers = (0,_azure_core_rest_pipeline__WEBPACK_IMPORTED_MODULE_0__.createHttpHeaders)(Object.assign(Object.assign(Object.assign({}, (options.headers ? options.headers : {})), { accept: (_c = (_a = options.accept) !== null && _a !== void 0 ? _a : (_b = options.headers) === null || _b === void 0 ? void 0 : _b.accept) !== null && _c !== void 0 ? _c : "application/json" }), (hasContent &&
        requestContentType && {
        "content-type": requestContentType,
    })));
    return (0,_azure_core_rest_pipeline__WEBPACK_IMPORTED_MODULE_0__.createPipelineRequest)({
        url,
        method,
        body,
        formData,
        headers,
        allowInsecureConnection: options.allowInsecureConnection,
        tracingOptions: options.tracingOptions,
        abortSignal: options.abortSignal,
        onUploadProgress: options.onUploadProgress,
        onDownloadProgress: options.onDownloadProgress,
        timeout: options.timeout,
        enableBrowserStreams: true,
        streamResponseStatusCodes: options.responseAsStream
            ? new Set([Number.POSITIVE_INFINITY])
            : undefined,
    });
}
/**
 * Prepares the body before sending the request
 */
function getRequestBody(body, contentType = "") {
    if (body === undefined) {
        return { body: undefined };
    }
    if ((0,_helpers_isReadableStream_js__WEBPACK_IMPORTED_MODULE_2__.isReadableStream)(body)) {
        return { body };
    }
    const firstType = contentType.split(";")[0];
    if (firstType === "application/json") {
        return { body: JSON.stringify(body) };
    }
    if (ArrayBuffer.isView(body)) {
        return { body: body instanceof Uint8Array ? body : JSON.stringify(body) };
    }
    switch (firstType) {
        case "multipart/form-data":
            return isRLCFormDataInput(body)
                ? { formData: processFormData(body) }
                : { body: JSON.stringify(body) };
        case "text/plain":
            return { body: String(body) };
        default:
            if (typeof body === "string") {
                return { body };
            }
            return { body: JSON.stringify(body) };
    }
}
function isRLCFormDataValue(value) {
    return (typeof value === "string" ||
        value instanceof Uint8Array ||
        // We don't do `instanceof Blob` since we should also accept polyfills of e.g. File in Node.
        typeof value.stream === "function");
}
function isRLCFormDataInput(body) {
    return (body !== undefined &&
        body instanceof Object &&
        Object.values(body).every((value) => isRLCFormDataValue(value) || (Array.isArray(value) && value.every(isRLCFormDataValue))));
}
function processFormDataValue(value) {
    return value instanceof Uint8Array ? (0,_azure_core_rest_pipeline__WEBPACK_IMPORTED_MODULE_0__.createFile)(value, "blob") : value;
}
/**
 * Checks if binary data is in Uint8Array format, if so wrap it in a Blob
 * to send over the wire
 */
function processFormData(formData) {
    const processedFormData = {};
    for (const element in formData) {
        const value = formData[element];
        processedFormData[element] = Array.isArray(value)
            ? value.map(processFormDataValue)
            : processFormDataValue(value);
    }
    return processedFormData;
}
/**
 * Prepares the response body
 */
function getResponseBody(response) {
    var _a, _b;
    // Set the default response type
    const contentType = (_a = response.headers.get("content-type")) !== null && _a !== void 0 ? _a : "";
    const firstType = contentType.split(";")[0];
    const bodyToParse = (_b = response.bodyAsText) !== null && _b !== void 0 ? _b : "";
    if (firstType === "text/plain") {
        return String(bodyToParse);
    }
    // Default to "application/json" and fallback to string;
    try {
        return bodyToParse ? JSON.parse(bodyToParse) : undefined;
    }
    catch (error) {
        // If we were supposed to get a JSON object and failed to
        // parse, throw a parse error
        if (firstType === "application/json") {
            throw createParseError(response, error);
        }
        // We are not sure how to handle the response so we return it as
        // plain text.
        return String(bodyToParse);
    }
}
function createParseError(response, err) {
    var _a;
    const msg = `Error "${err}" occurred while parsing the response body - ${response.bodyAsText}.`;
    const errCode = (_a = err.code) !== null && _a !== void 0 ? _a : _azure_core_rest_pipeline__WEBPACK_IMPORTED_MODULE_0__.RestError.PARSE_ERROR;
    return new _azure_core_rest_pipeline__WEBPACK_IMPORTED_MODULE_0__.RestError(msg, {
        code: errCode,
        statusCode: response.status,
        request: response.request,
        response: response,
    });
}
//# sourceMappingURL=sendRequest.js.map

/***/ }),

/***/ "./node_modules/@azure-rest/core-client/dist/browser/urlHelpers.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@azure-rest/core-client/dist/browser/urlHelpers.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   buildBaseUrl: () => (/* binding */ buildBaseUrl),
/* harmony export */   buildRequestUrl: () => (/* binding */ buildRequestUrl),
/* harmony export */   replaceAll: () => (/* binding */ replaceAll)
/* harmony export */ });
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/**
 * Builds the request url, filling in query and path parameters
 * @param endpoint - base url which can be a template url
 * @param routePath - path to append to the endpoint
 * @param pathParameters - values of the path parameters
 * @param options - request parameters including query parameters
 * @returns a full url with path and query parameters
 */
function buildRequestUrl(endpoint, routePath, pathParameters, options = {}) {
    if (routePath.startsWith("https://") || routePath.startsWith("http://")) {
        return routePath;
    }
    endpoint = buildBaseUrl(endpoint, options);
    routePath = buildRoutePath(routePath, pathParameters, options);
    const requestUrl = appendQueryParams(`${endpoint}/${routePath}`, options);
    const url = new URL(requestUrl);
    return (url
        .toString()
        // Remove double forward slashes
        .replace(/([^:]\/)\/+/g, "$1"));
}
function appendQueryParams(url, options = {}) {
    if (!options.queryParameters) {
        return url;
    }
    let parsedUrl = new URL(url);
    const queryParams = options.queryParameters;
    for (const key of Object.keys(queryParams)) {
        const param = queryParams[key];
        if (param === undefined || param === null) {
            continue;
        }
        if (!param.toString || typeof param.toString !== "function") {
            throw new Error(`Query parameters must be able to be represented as string, ${key} can't`);
        }
        const value = param.toISOString !== undefined ? param.toISOString() : param.toString();
        parsedUrl.searchParams.append(key, value);
    }
    if (options.skipUrlEncoding) {
        parsedUrl = skipQueryParameterEncoding(parsedUrl);
    }
    return parsedUrl.toString();
}
function skipQueryParameterEncoding(url) {
    if (!url) {
        return url;
    }
    const searchPieces = [];
    for (const [name, value] of url.searchParams) {
        // QUIRK: searchParams.get retrieves the values decoded
        searchPieces.push(`${name}=${value}`);
    }
    // QUIRK: we have to set search manually as searchParams will encode comma when it shouldn't.
    url.search = searchPieces.length ? `?${searchPieces.join("&")}` : "";
    return url;
}
function buildBaseUrl(endpoint, options) {
    var _a;
    if (!options.pathParameters) {
        return endpoint;
    }
    const pathParams = options.pathParameters;
    for (const [key, param] of Object.entries(pathParams)) {
        if (param === undefined || param === null) {
            throw new Error(`Path parameters ${key} must not be undefined or null`);
        }
        if (!param.toString || typeof param.toString !== "function") {
            throw new Error(`Path parameters must be able to be represented as string, ${key} can't`);
        }
        let value = param.toISOString !== undefined ? param.toISOString() : String(param);
        if (!options.skipUrlEncoding) {
            value = encodeURIComponent(param);
        }
        endpoint = (_a = replaceAll(endpoint, `{${key}}`, value)) !== null && _a !== void 0 ? _a : "";
    }
    return endpoint;
}
function buildRoutePath(routePath, pathParameters, options = {}) {
    for (const pathParam of pathParameters) {
        let value = pathParam;
        if (!options.skipUrlEncoding) {
            value = encodeURIComponent(pathParam);
        }
        routePath = routePath.replace(/\{\w+\}/, value);
    }
    return routePath;
}
/**
 * Replace all of the instances of searchValue in value with the provided replaceValue.
 * @param value - The value to search and replace in.
 * @param searchValue - The value to search for in the value argument.
 * @param replaceValue - The value to replace searchValue with in the value argument.
 * @returns The value where each instance of searchValue was replaced with replacedValue.
 */
function replaceAll(value, searchValue, replaceValue) {
    return !value || !searchValue ? value : value.split(searchValue).join(replaceValue || "");
}
//# sourceMappingURL=urlHelpers.js.map

/***/ }),

/***/ "./node_modules/@azure/abort-controller/dist/browser/AbortError.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@azure/abort-controller/dist/browser/AbortError.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AbortError: () => (/* binding */ AbortError)
/* harmony export */ });
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/**
 * This error is thrown when an asynchronous operation has been aborted.
 * Check for this error by testing the `name` that the name property of the
 * error matches `"AbortError"`.
 *
 * @example
 * ```ts
 * const controller = new AbortController();
 * controller.abort();
 * try {
 *   doAsyncWork(controller.signal)
 * } catch (e) {
 *   if (e.name === 'AbortError') {
 *     // handle abort error here.
 *   }
 * }
 * ```
 */
class AbortError extends Error {
    constructor(message) {
        super(message);
        this.name = "AbortError";
    }
}
//# sourceMappingURL=AbortError.js.map

/***/ }),

/***/ "./node_modules/@azure/abort-controller/dist/browser/index.js":
/*!********************************************************************!*\
  !*** ./node_modules/@azure/abort-controller/dist/browser/index.js ***!
  \********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AbortError: () => (/* reexport safe */ _AbortError_js__WEBPACK_IMPORTED_MODULE_0__.AbortError)
/* harmony export */ });
/* harmony import */ var _AbortError_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AbortError.js */ "./node_modules/@azure/abort-controller/dist/browser/AbortError.js");
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@azure/core-auth/dist/browser/azureKeyCredential.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@azure/core-auth/dist/browser/azureKeyCredential.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AzureKeyCredential: () => (/* binding */ AzureKeyCredential)
/* harmony export */ });
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/**
 * A static-key-based credential that supports updating
 * the underlying key value.
 */
class AzureKeyCredential {
    /**
     * The value of the key to be used in authentication
     */
    get key() {
        return this._key;
    }
    /**
     * Create an instance of an AzureKeyCredential for use
     * with a service client.
     *
     * @param key - The initial value of the key to use in authentication
     */
    constructor(key) {
        if (!key) {
            throw new Error("key must be a non-empty string");
        }
        this._key = key;
    }
    /**
     * Change the value of the key.
     *
     * Updates will take effect upon the next request after
     * updating the key value.
     *
     * @param newKey - The new key value to be used
     */
    update(newKey) {
        this._key = newKey;
    }
}
//# sourceMappingURL=azureKeyCredential.js.map

/***/ }),

/***/ "./node_modules/@azure/core-auth/dist/browser/azureNamedKeyCredential.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@azure/core-auth/dist/browser/azureNamedKeyCredential.js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AzureNamedKeyCredential: () => (/* binding */ AzureNamedKeyCredential),
/* harmony export */   isNamedKeyCredential: () => (/* binding */ isNamedKeyCredential)
/* harmony export */ });
/* harmony import */ var _azure_core_util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @azure/core-util */ "./node_modules/@azure/core-util/dist/browser/index.js");
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * A static name/key-based credential that supports updating
 * the underlying name and key values.
 */
class AzureNamedKeyCredential {
    /**
     * The value of the key to be used in authentication.
     */
    get key() {
        return this._key;
    }
    /**
     * The value of the name to be used in authentication.
     */
    get name() {
        return this._name;
    }
    /**
     * Create an instance of an AzureNamedKeyCredential for use
     * with a service client.
     *
     * @param name - The initial value of the name to use in authentication.
     * @param key - The initial value of the key to use in authentication.
     */
    constructor(name, key) {
        if (!name || !key) {
            throw new TypeError("name and key must be non-empty strings");
        }
        this._name = name;
        this._key = key;
    }
    /**
     * Change the value of the key.
     *
     * Updates will take effect upon the next request after
     * updating the key value.
     *
     * @param newName - The new name value to be used.
     * @param newKey - The new key value to be used.
     */
    update(newName, newKey) {
        if (!newName || !newKey) {
            throw new TypeError("newName and newKey must be non-empty strings");
        }
        this._name = newName;
        this._key = newKey;
    }
}
/**
 * Tests an object to determine whether it implements NamedKeyCredential.
 *
 * @param credential - The assumed NamedKeyCredential to be tested.
 */
function isNamedKeyCredential(credential) {
    return ((0,_azure_core_util__WEBPACK_IMPORTED_MODULE_0__.isObjectWithProperties)(credential, ["name", "key"]) &&
        typeof credential.key === "string" &&
        typeof credential.name === "string");
}
//# sourceMappingURL=azureNamedKeyCredential.js.map

/***/ }),

/***/ "./node_modules/@azure/core-auth/dist/browser/azureSASCredential.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@azure/core-auth/dist/browser/azureSASCredential.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AzureSASCredential: () => (/* binding */ AzureSASCredential),
/* harmony export */   isSASCredential: () => (/* binding */ isSASCredential)
/* harmony export */ });
/* harmony import */ var _azure_core_util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @azure/core-util */ "./node_modules/@azure/core-util/dist/browser/index.js");
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * A static-signature-based credential that supports updating
 * the underlying signature value.
 */
class AzureSASCredential {
    /**
     * The value of the shared access signature to be used in authentication
     */
    get signature() {
        return this._signature;
    }
    /**
     * Create an instance of an AzureSASCredential for use
     * with a service client.
     *
     * @param signature - The initial value of the shared access signature to use in authentication
     */
    constructor(signature) {
        if (!signature) {
            throw new Error("shared access signature must be a non-empty string");
        }
        this._signature = signature;
    }
    /**
     * Change the value of the signature.
     *
     * Updates will take effect upon the next request after
     * updating the signature value.
     *
     * @param newSignature - The new shared access signature value to be used
     */
    update(newSignature) {
        if (!newSignature) {
            throw new Error("shared access signature must be a non-empty string");
        }
        this._signature = newSignature;
    }
}
/**
 * Tests an object to determine whether it implements SASCredential.
 *
 * @param credential - The assumed SASCredential to be tested.
 */
function isSASCredential(credential) {
    return ((0,_azure_core_util__WEBPACK_IMPORTED_MODULE_0__.isObjectWithProperties)(credential, ["signature"]) && typeof credential.signature === "string");
}
//# sourceMappingURL=azureSASCredential.js.map

/***/ }),

/***/ "./node_modules/@azure/core-auth/dist/browser/index.js":
/*!*************************************************************!*\
  !*** ./node_modules/@azure/core-auth/dist/browser/index.js ***!
  \*************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AzureKeyCredential: () => (/* reexport safe */ _azureKeyCredential_js__WEBPACK_IMPORTED_MODULE_0__.AzureKeyCredential),
/* harmony export */   AzureNamedKeyCredential: () => (/* reexport safe */ _azureNamedKeyCredential_js__WEBPACK_IMPORTED_MODULE_2__.AzureNamedKeyCredential),
/* harmony export */   AzureSASCredential: () => (/* reexport safe */ _azureSASCredential_js__WEBPACK_IMPORTED_MODULE_3__.AzureSASCredential),
/* harmony export */   isKeyCredential: () => (/* reexport safe */ _keyCredential_js__WEBPACK_IMPORTED_MODULE_1__.isKeyCredential),
/* harmony export */   isNamedKeyCredential: () => (/* reexport safe */ _azureNamedKeyCredential_js__WEBPACK_IMPORTED_MODULE_2__.isNamedKeyCredential),
/* harmony export */   isSASCredential: () => (/* reexport safe */ _azureSASCredential_js__WEBPACK_IMPORTED_MODULE_3__.isSASCredential),
/* harmony export */   isTokenCredential: () => (/* reexport safe */ _tokenCredential_js__WEBPACK_IMPORTED_MODULE_4__.isTokenCredential)
/* harmony export */ });
/* harmony import */ var _azureKeyCredential_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./azureKeyCredential.js */ "./node_modules/@azure/core-auth/dist/browser/azureKeyCredential.js");
/* harmony import */ var _keyCredential_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./keyCredential.js */ "./node_modules/@azure/core-auth/dist/browser/keyCredential.js");
/* harmony import */ var _azureNamedKeyCredential_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./azureNamedKeyCredential.js */ "./node_modules/@azure/core-auth/dist/browser/azureNamedKeyCredential.js");
/* harmony import */ var _azureSASCredential_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./azureSASCredential.js */ "./node_modules/@azure/core-auth/dist/browser/azureSASCredential.js");
/* harmony import */ var _tokenCredential_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./tokenCredential.js */ "./node_modules/@azure/core-auth/dist/browser/tokenCredential.js");
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.





//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@azure/core-auth/dist/browser/keyCredential.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@azure/core-auth/dist/browser/keyCredential.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isKeyCredential: () => (/* binding */ isKeyCredential)
/* harmony export */ });
/* harmony import */ var _azure_core_util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @azure/core-util */ "./node_modules/@azure/core-util/dist/browser/index.js");
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * Tests an object to determine whether it implements KeyCredential.
 *
 * @param credential - The assumed KeyCredential to be tested.
 */
function isKeyCredential(credential) {
    return (0,_azure_core_util__WEBPACK_IMPORTED_MODULE_0__.isObjectWithProperties)(credential, ["key"]) && typeof credential.key === "string";
}
//# sourceMappingURL=keyCredential.js.map

/***/ }),

/***/ "./node_modules/@azure/core-auth/dist/browser/tokenCredential.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@azure/core-auth/dist/browser/tokenCredential.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isTokenCredential: () => (/* binding */ isTokenCredential)
/* harmony export */ });
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/**
 * Tests an object to determine whether it implements TokenCredential.
 *
 * @param credential - The assumed TokenCredential to be tested.
 */
function isTokenCredential(credential) {
    // Check for an object with a 'getToken' function and possibly with
    // a 'signRequest' function.  We do this check to make sure that
    // a ServiceClientCredentials implementor (like TokenClientCredentials
    // in ms-rest-nodeauth) doesn't get mistaken for a TokenCredential if
    // it doesn't actually implement TokenCredential also.
    const castCredential = credential;
    return (castCredential &&
        typeof castCredential.getToken === "function" &&
        (castCredential.signRequest === undefined || castCredential.getToken.length > 0));
}
//# sourceMappingURL=tokenCredential.js.map

/***/ }),

/***/ "./node_modules/@azure/core-rest-pipeline/dist/browser/constants.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@azure/core-rest-pipeline/dist/browser/constants.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DEFAULT_RETRY_POLICY_COUNT: () => (/* binding */ DEFAULT_RETRY_POLICY_COUNT),
/* harmony export */   SDK_VERSION: () => (/* binding */ SDK_VERSION)
/* harmony export */ });
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
const SDK_VERSION = "1.16.0";
const DEFAULT_RETRY_POLICY_COUNT = 3;
//# sourceMappingURL=constants.js.map

/***/ }),

/***/ "./node_modules/@azure/core-rest-pipeline/dist/browser/createPipelineFromOptions.js":
/*!******************************************************************************************!*\
  !*** ./node_modules/@azure/core-rest-pipeline/dist/browser/createPipelineFromOptions.js ***!
  \******************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createPipelineFromOptions: () => (/* binding */ createPipelineFromOptions)
/* harmony export */ });
/* harmony import */ var _policies_logPolicy_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./policies/logPolicy.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/policies/logPolicy.js");
/* harmony import */ var _pipeline_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./pipeline.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/pipeline.js");
/* harmony import */ var _policies_redirectPolicy_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./policies/redirectPolicy.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/policies/redirectPolicy.js");
/* harmony import */ var _policies_userAgentPolicy_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./policies/userAgentPolicy.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/policies/userAgentPolicy.js");
/* harmony import */ var _policies_multipartPolicy_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./policies/multipartPolicy.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/policies/multipartPolicy.js");
/* harmony import */ var _policies_decompressResponsePolicy_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./policies/decompressResponsePolicy.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/policies/decompressResponsePolicy.js");
/* harmony import */ var _policies_defaultRetryPolicy_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./policies/defaultRetryPolicy.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/policies/defaultRetryPolicy.js");
/* harmony import */ var _policies_formDataPolicy_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./policies/formDataPolicy.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/policies/formDataPolicy.js");
/* harmony import */ var _azure_core_util__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @azure/core-util */ "./node_modules/@azure/core-util/dist/browser/index.js");
/* harmony import */ var _policies_proxyPolicy_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./policies/proxyPolicy.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/policies/proxyPolicy.js");
/* harmony import */ var _policies_setClientRequestIdPolicy_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./policies/setClientRequestIdPolicy.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/policies/setClientRequestIdPolicy.js");
/* harmony import */ var _policies_tlsPolicy_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./policies/tlsPolicy.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/policies/tlsPolicy.js");
/* harmony import */ var _policies_tracingPolicy_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./policies/tracingPolicy.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/policies/tracingPolicy.js");
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.













/**
 * Create a new pipeline with a default set of customizable policies.
 * @param options - Options to configure a custom pipeline.
 */
function createPipelineFromOptions(options) {
    var _a;
    const pipeline = (0,_pipeline_js__WEBPACK_IMPORTED_MODULE_1__.createEmptyPipeline)();
    if (_azure_core_util__WEBPACK_IMPORTED_MODULE_8__.isNodeLike) {
        if (options.tlsOptions) {
            pipeline.addPolicy((0,_policies_tlsPolicy_js__WEBPACK_IMPORTED_MODULE_11__.tlsPolicy)(options.tlsOptions));
        }
        pipeline.addPolicy((0,_policies_proxyPolicy_js__WEBPACK_IMPORTED_MODULE_9__.proxyPolicy)(options.proxyOptions));
        pipeline.addPolicy((0,_policies_decompressResponsePolicy_js__WEBPACK_IMPORTED_MODULE_5__.decompressResponsePolicy)());
    }
    pipeline.addPolicy((0,_policies_formDataPolicy_js__WEBPACK_IMPORTED_MODULE_7__.formDataPolicy)(), { beforePolicies: [_policies_multipartPolicy_js__WEBPACK_IMPORTED_MODULE_4__.multipartPolicyName] });
    pipeline.addPolicy((0,_policies_userAgentPolicy_js__WEBPACK_IMPORTED_MODULE_3__.userAgentPolicy)(options.userAgentOptions));
    pipeline.addPolicy((0,_policies_setClientRequestIdPolicy_js__WEBPACK_IMPORTED_MODULE_10__.setClientRequestIdPolicy)((_a = options.telemetryOptions) === null || _a === void 0 ? void 0 : _a.clientRequestIdHeaderName));
    // The multipart policy is added after policies with no phase, so that
    // policies can be added between it and formDataPolicy to modify
    // properties (e.g., making the boundary constant in recorded tests).
    pipeline.addPolicy((0,_policies_multipartPolicy_js__WEBPACK_IMPORTED_MODULE_4__.multipartPolicy)(), { afterPhase: "Deserialize" });
    pipeline.addPolicy((0,_policies_defaultRetryPolicy_js__WEBPACK_IMPORTED_MODULE_6__.defaultRetryPolicy)(options.retryOptions), { phase: "Retry" });
    pipeline.addPolicy((0,_policies_tracingPolicy_js__WEBPACK_IMPORTED_MODULE_12__.tracingPolicy)(options.userAgentOptions), { afterPhase: "Retry" });
    if (_azure_core_util__WEBPACK_IMPORTED_MODULE_8__.isNodeLike) {
        // Both XHR and Fetch expect to handle redirects automatically,
        // so only include this policy when we're in Node.
        pipeline.addPolicy((0,_policies_redirectPolicy_js__WEBPACK_IMPORTED_MODULE_2__.redirectPolicy)(options.redirectOptions), { afterPhase: "Retry" });
    }
    pipeline.addPolicy((0,_policies_logPolicy_js__WEBPACK_IMPORTED_MODULE_0__.logPolicy)(options.loggingOptions), { afterPhase: "Sign" });
    return pipeline;
}
//# sourceMappingURL=createPipelineFromOptions.js.map

/***/ }),

/***/ "./node_modules/@azure/core-rest-pipeline/dist/browser/defaultHttpClient.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/@azure/core-rest-pipeline/dist/browser/defaultHttpClient.js ***!
  \**********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createDefaultHttpClient: () => (/* binding */ createDefaultHttpClient)
/* harmony export */ });
/* harmony import */ var _fetchHttpClient_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./fetchHttpClient.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/fetchHttpClient.js");
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * Create the correct HttpClient for the current environment.
 */
function createDefaultHttpClient() {
    return (0,_fetchHttpClient_js__WEBPACK_IMPORTED_MODULE_0__.createFetchHttpClient)();
}
//# sourceMappingURL=defaultHttpClient-browser.mjs.map

/***/ }),

/***/ "./node_modules/@azure/core-rest-pipeline/dist/browser/fetchHttpClient.js":
/*!********************************************************************************!*\
  !*** ./node_modules/@azure/core-rest-pipeline/dist/browser/fetchHttpClient.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createFetchHttpClient: () => (/* binding */ createFetchHttpClient)
/* harmony export */ });
/* harmony import */ var _azure_abort_controller__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @azure/abort-controller */ "./node_modules/@azure/abort-controller/dist/browser/index.js");
/* harmony import */ var _restError_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./restError.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/restError.js");
/* harmony import */ var _httpHeaders_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./httpHeaders.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/httpHeaders.js");
/* harmony import */ var _util_typeGuards_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./util/typeGuards.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/util/typeGuards.js");
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.




/**
 * Checks if the body is a Blob or Blob-like
 */
function isBlob(body) {
    // File objects count as a type of Blob, so we want to use instanceof explicitly
    return (typeof Blob === "function" || typeof Blob === "object") && body instanceof Blob;
}
/**
 * A HttpClient implementation that uses window.fetch to send HTTP requests.
 * @internal
 */
class FetchHttpClient {
    /**
     * Makes a request over an underlying transport layer and returns the response.
     * @param request - The request to be made.
     */
    async sendRequest(request) {
        const url = new URL(request.url);
        const isInsecure = url.protocol !== "https:";
        if (isInsecure && !request.allowInsecureConnection) {
            throw new Error(`Cannot connect to ${request.url} while allowInsecureConnection is false.`);
        }
        if (request.proxySettings) {
            throw new Error("HTTP proxy is not supported in browser environment");
        }
        try {
            return await makeRequest(request);
        }
        catch (e) {
            throw getError(e, request);
        }
    }
}
/**
 * Sends a request
 */
async function makeRequest(request) {
    const { abortController, abortControllerCleanup } = setupAbortSignal(request);
    try {
        const headers = buildFetchHeaders(request.headers);
        const { streaming, body: requestBody } = buildRequestBody(request);
        const requestInit = Object.assign(Object.assign({ body: requestBody, method: request.method, headers: headers, signal: abortController.signal }, ("credentials" in Request.prototype
            ? { credentials: request.withCredentials ? "include" : "same-origin" }
            : {})), ("cache" in Request.prototype ? { cache: "no-store" } : {}));
        // According to https://fetch.spec.whatwg.org/#fetch-method,
        // init.duplex must be set when body is a ReadableStream object.
        // currently "half" is the only valid value.
        if (streaming) {
            requestInit.duplex = "half";
        }
        /**
         * Developers of the future:
         * Do not set redirect: "manual" as part
         * of request options.
         * It will not work as you expect.
         */
        const response = await fetch(request.url, requestInit);
        // If we're uploading a blob, we need to fire the progress event manually
        if (isBlob(request.body) && request.onUploadProgress) {
            request.onUploadProgress({ loadedBytes: request.body.size });
        }
        return buildPipelineResponse(response, request, abortControllerCleanup);
    }
    catch (e) {
        abortControllerCleanup === null || abortControllerCleanup === void 0 ? void 0 : abortControllerCleanup();
        throw e;
    }
}
/**
 * Creates a pipeline response from a Fetch response;
 */
async function buildPipelineResponse(httpResponse, request, abortControllerCleanup) {
    var _a, _b;
    const headers = buildPipelineHeaders(httpResponse);
    const response = {
        request,
        headers,
        status: httpResponse.status,
    };
    const bodyStream = (0,_util_typeGuards_js__WEBPACK_IMPORTED_MODULE_3__.isWebReadableStream)(httpResponse.body)
        ? buildBodyStream(httpResponse.body, {
            onProgress: request.onDownloadProgress,
            onEnd: abortControllerCleanup,
        })
        : httpResponse.body;
    if (
    // Value of POSITIVE_INFINITY in streamResponseStatusCodes is considered as any status code
    ((_a = request.streamResponseStatusCodes) === null || _a === void 0 ? void 0 : _a.has(Number.POSITIVE_INFINITY)) ||
        ((_b = request.streamResponseStatusCodes) === null || _b === void 0 ? void 0 : _b.has(response.status))) {
        if (request.enableBrowserStreams) {
            response.browserStreamBody = bodyStream !== null && bodyStream !== void 0 ? bodyStream : undefined;
        }
        else {
            const responseStream = new Response(bodyStream);
            response.blobBody = responseStream.blob();
            abortControllerCleanup === null || abortControllerCleanup === void 0 ? void 0 : abortControllerCleanup();
        }
    }
    else {
        const responseStream = new Response(bodyStream);
        response.bodyAsText = await responseStream.text();
        abortControllerCleanup === null || abortControllerCleanup === void 0 ? void 0 : abortControllerCleanup();
    }
    return response;
}
function setupAbortSignal(request) {
    const abortController = new AbortController();
    // Cleanup function
    let abortControllerCleanup;
    /**
     * Attach an abort listener to the request
     */
    let abortListener;
    if (request.abortSignal) {
        if (request.abortSignal.aborted) {
            throw new _azure_abort_controller__WEBPACK_IMPORTED_MODULE_0__.AbortError("The operation was aborted.");
        }
        abortListener = (event) => {
            if (event.type === "abort") {
                abortController.abort();
            }
        };
        request.abortSignal.addEventListener("abort", abortListener);
        abortControllerCleanup = () => {
            var _a;
            if (abortListener) {
                (_a = request.abortSignal) === null || _a === void 0 ? void 0 : _a.removeEventListener("abort", abortListener);
            }
        };
    }
    // If a timeout was passed, call the abort signal once the time elapses
    if (request.timeout > 0) {
        setTimeout(() => {
            abortController.abort();
        }, request.timeout);
    }
    return { abortController, abortControllerCleanup };
}
/**
 * Gets the specific error
 */
// eslint-disable-next-line @azure/azure-sdk/ts-use-interface-parameters
function getError(e, request) {
    var _a;
    if (e && (e === null || e === void 0 ? void 0 : e.name) === "AbortError") {
        return e;
    }
    else {
        return new _restError_js__WEBPACK_IMPORTED_MODULE_1__.RestError(`Error sending request: ${e.message}`, {
            code: (_a = e === null || e === void 0 ? void 0 : e.code) !== null && _a !== void 0 ? _a : _restError_js__WEBPACK_IMPORTED_MODULE_1__.RestError.REQUEST_SEND_ERROR,
            request,
        });
    }
}
/**
 * Converts PipelineRequest headers to Fetch headers
 */
function buildFetchHeaders(pipelineHeaders) {
    const headers = new Headers();
    for (const [name, value] of pipelineHeaders) {
        headers.append(name, value);
    }
    return headers;
}
function buildPipelineHeaders(httpResponse) {
    const responseHeaders = (0,_httpHeaders_js__WEBPACK_IMPORTED_MODULE_2__.createHttpHeaders)();
    for (const [name, value] of httpResponse.headers) {
        responseHeaders.set(name, value);
    }
    return responseHeaders;
}
function buildRequestBody(request) {
    const body = typeof request.body === "function" ? request.body() : request.body;
    if ((0,_util_typeGuards_js__WEBPACK_IMPORTED_MODULE_3__.isNodeReadableStream)(body)) {
        throw new Error("Node streams are not supported in browser environment.");
    }
    return (0,_util_typeGuards_js__WEBPACK_IMPORTED_MODULE_3__.isWebReadableStream)(body)
        ? { streaming: true, body: buildBodyStream(body, { onProgress: request.onUploadProgress }) }
        : { streaming: false, body };
}
/**
 * Reads the request/response original stream and stream it through a new
 * ReadableStream, this is done to be able to report progress in a way that
 * all modern browsers support. TransformStreams would be an alternative,
 * however they are not yet supported by all browsers i.e Firefox
 */
function buildBodyStream(readableStream, options = {}) {
    let loadedBytes = 0;
    const { onProgress, onEnd } = options;
    // If the current browser supports pipeThrough we use a TransformStream
    // to report progress
    if (isTransformStreamSupported(readableStream)) {
        return readableStream.pipeThrough(new TransformStream({
            transform(chunk, controller) {
                if (chunk === null) {
                    controller.terminate();
                    return;
                }
                controller.enqueue(chunk);
                loadedBytes += chunk.length;
                if (onProgress) {
                    onProgress({ loadedBytes });
                }
            },
            flush() {
                onEnd === null || onEnd === void 0 ? void 0 : onEnd();
            },
        }));
    }
    else {
        // If we can't use transform streams, wrap the original stream in a new readable stream
        // and use pull to enqueue each chunk and report progress.
        const reader = readableStream.getReader();
        return new ReadableStream({
            async pull(controller) {
                var _a;
                const { done, value } = await reader.read();
                // When no more data needs to be consumed, break the reading
                if (done || !value) {
                    onEnd === null || onEnd === void 0 ? void 0 : onEnd();
                    // Close the stream
                    controller.close();
                    reader.releaseLock();
                    return;
                }
                loadedBytes += (_a = value === null || value === void 0 ? void 0 : value.length) !== null && _a !== void 0 ? _a : 0;
                // Enqueue the next data chunk into our target stream
                controller.enqueue(value);
                if (onProgress) {
                    onProgress({ loadedBytes });
                }
            },
            cancel(reason) {
                onEnd === null || onEnd === void 0 ? void 0 : onEnd();
                return reader.cancel(reason);
            },
        });
    }
}
/**
 * Create a new HttpClient instance for the browser environment.
 * @internal
 */
function createFetchHttpClient() {
    return new FetchHttpClient();
}
function isTransformStreamSupported(readableStream) {
    return readableStream.pipeThrough !== undefined && self.TransformStream !== undefined;
}
//# sourceMappingURL=fetchHttpClient.js.map

/***/ }),

/***/ "./node_modules/@azure/core-rest-pipeline/dist/browser/httpHeaders.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@azure/core-rest-pipeline/dist/browser/httpHeaders.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createHttpHeaders: () => (/* binding */ createHttpHeaders)
/* harmony export */ });
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
function normalizeName(name) {
    return name.toLowerCase();
}
function* headerIterator(map) {
    for (const entry of map.values()) {
        yield [entry.name, entry.value];
    }
}
class HttpHeadersImpl {
    constructor(rawHeaders) {
        this._headersMap = new Map();
        if (rawHeaders) {
            for (const headerName of Object.keys(rawHeaders)) {
                this.set(headerName, rawHeaders[headerName]);
            }
        }
    }
    /**
     * Set a header in this collection with the provided name and value. The name is
     * case-insensitive.
     * @param name - The name of the header to set. This value is case-insensitive.
     * @param value - The value of the header to set.
     */
    set(name, value) {
        this._headersMap.set(normalizeName(name), { name, value: String(value).trim() });
    }
    /**
     * Get the header value for the provided header name, or undefined if no header exists in this
     * collection with the provided name.
     * @param name - The name of the header. This value is case-insensitive.
     */
    get(name) {
        var _a;
        return (_a = this._headersMap.get(normalizeName(name))) === null || _a === void 0 ? void 0 : _a.value;
    }
    /**
     * Get whether or not this header collection contains a header entry for the provided header name.
     * @param name - The name of the header to set. This value is case-insensitive.
     */
    has(name) {
        return this._headersMap.has(normalizeName(name));
    }
    /**
     * Remove the header with the provided headerName.
     * @param name - The name of the header to remove.
     */
    delete(name) {
        this._headersMap.delete(normalizeName(name));
    }
    /**
     * Get the JSON object representation of this HTTP header collection.
     */
    toJSON(options = {}) {
        const result = {};
        if (options.preserveCase) {
            for (const entry of this._headersMap.values()) {
                result[entry.name] = entry.value;
            }
        }
        else {
            for (const [normalizedName, entry] of this._headersMap) {
                result[normalizedName] = entry.value;
            }
        }
        return result;
    }
    /**
     * Get the string representation of this HTTP header collection.
     */
    toString() {
        return JSON.stringify(this.toJSON({ preserveCase: true }));
    }
    /**
     * Iterate over tuples of header [name, value] pairs.
     */
    [Symbol.iterator]() {
        return headerIterator(this._headersMap);
    }
}
/**
 * Creates an object that satisfies the `HttpHeaders` interface.
 * @param rawHeaders - A simple object representing initial headers
 */
function createHttpHeaders(rawHeaders) {
    return new HttpHeadersImpl(rawHeaders);
}
//# sourceMappingURL=httpHeaders.js.map

/***/ }),

/***/ "./node_modules/@azure/core-rest-pipeline/dist/browser/index.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@azure/core-rest-pipeline/dist/browser/index.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RestError: () => (/* reexport safe */ _restError_js__WEBPACK_IMPORTED_MODULE_5__.RestError),
/* harmony export */   auxiliaryAuthenticationHeaderPolicy: () => (/* reexport safe */ _policies_auxiliaryAuthenticationHeaderPolicy_js__WEBPACK_IMPORTED_MODULE_23__.auxiliaryAuthenticationHeaderPolicy),
/* harmony export */   auxiliaryAuthenticationHeaderPolicyName: () => (/* reexport safe */ _policies_auxiliaryAuthenticationHeaderPolicy_js__WEBPACK_IMPORTED_MODULE_23__.auxiliaryAuthenticationHeaderPolicyName),
/* harmony export */   bearerTokenAuthenticationPolicy: () => (/* reexport safe */ _policies_bearerTokenAuthenticationPolicy_js__WEBPACK_IMPORTED_MODULE_21__.bearerTokenAuthenticationPolicy),
/* harmony export */   bearerTokenAuthenticationPolicyName: () => (/* reexport safe */ _policies_bearerTokenAuthenticationPolicy_js__WEBPACK_IMPORTED_MODULE_21__.bearerTokenAuthenticationPolicyName),
/* harmony export */   createDefaultHttpClient: () => (/* reexport safe */ _defaultHttpClient_js__WEBPACK_IMPORTED_MODULE_2__.createDefaultHttpClient),
/* harmony export */   createEmptyPipeline: () => (/* reexport safe */ _pipeline_js__WEBPACK_IMPORTED_MODULE_0__.createEmptyPipeline),
/* harmony export */   createFile: () => (/* reexport safe */ _util_file_js__WEBPACK_IMPORTED_MODULE_24__.createFile),
/* harmony export */   createFileFromStream: () => (/* reexport safe */ _util_file_js__WEBPACK_IMPORTED_MODULE_24__.createFileFromStream),
/* harmony export */   createHttpHeaders: () => (/* reexport safe */ _httpHeaders_js__WEBPACK_IMPORTED_MODULE_3__.createHttpHeaders),
/* harmony export */   createPipelineFromOptions: () => (/* reexport safe */ _createPipelineFromOptions_js__WEBPACK_IMPORTED_MODULE_1__.createPipelineFromOptions),
/* harmony export */   createPipelineRequest: () => (/* reexport safe */ _pipelineRequest_js__WEBPACK_IMPORTED_MODULE_4__.createPipelineRequest),
/* harmony export */   decompressResponsePolicy: () => (/* reexport safe */ _policies_decompressResponsePolicy_js__WEBPACK_IMPORTED_MODULE_6__.decompressResponsePolicy),
/* harmony export */   decompressResponsePolicyName: () => (/* reexport safe */ _policies_decompressResponsePolicy_js__WEBPACK_IMPORTED_MODULE_6__.decompressResponsePolicyName),
/* harmony export */   defaultRetryPolicy: () => (/* reexport safe */ _policies_defaultRetryPolicy_js__WEBPACK_IMPORTED_MODULE_17__.defaultRetryPolicy),
/* harmony export */   exponentialRetryPolicy: () => (/* reexport safe */ _policies_exponentialRetryPolicy_js__WEBPACK_IMPORTED_MODULE_7__.exponentialRetryPolicy),
/* harmony export */   exponentialRetryPolicyName: () => (/* reexport safe */ _policies_exponentialRetryPolicy_js__WEBPACK_IMPORTED_MODULE_7__.exponentialRetryPolicyName),
/* harmony export */   formDataPolicy: () => (/* reexport safe */ _policies_formDataPolicy_js__WEBPACK_IMPORTED_MODULE_20__.formDataPolicy),
/* harmony export */   formDataPolicyName: () => (/* reexport safe */ _policies_formDataPolicy_js__WEBPACK_IMPORTED_MODULE_20__.formDataPolicyName),
/* harmony export */   getDefaultProxySettings: () => (/* reexport safe */ _policies_proxyPolicy_js__WEBPACK_IMPORTED_MODULE_11__.getDefaultProxySettings),
/* harmony export */   isRestError: () => (/* reexport safe */ _restError_js__WEBPACK_IMPORTED_MODULE_5__.isRestError),
/* harmony export */   logPolicy: () => (/* reexport safe */ _policies_logPolicy_js__WEBPACK_IMPORTED_MODULE_9__.logPolicy),
/* harmony export */   logPolicyName: () => (/* reexport safe */ _policies_logPolicy_js__WEBPACK_IMPORTED_MODULE_9__.logPolicyName),
/* harmony export */   multipartPolicy: () => (/* reexport safe */ _policies_multipartPolicy_js__WEBPACK_IMPORTED_MODULE_10__.multipartPolicy),
/* harmony export */   multipartPolicyName: () => (/* reexport safe */ _policies_multipartPolicy_js__WEBPACK_IMPORTED_MODULE_10__.multipartPolicyName),
/* harmony export */   ndJsonPolicy: () => (/* reexport safe */ _policies_ndJsonPolicy_js__WEBPACK_IMPORTED_MODULE_22__.ndJsonPolicy),
/* harmony export */   ndJsonPolicyName: () => (/* reexport safe */ _policies_ndJsonPolicy_js__WEBPACK_IMPORTED_MODULE_22__.ndJsonPolicyName),
/* harmony export */   proxyPolicy: () => (/* reexport safe */ _policies_proxyPolicy_js__WEBPACK_IMPORTED_MODULE_11__.proxyPolicy),
/* harmony export */   proxyPolicyName: () => (/* reexport safe */ _policies_proxyPolicy_js__WEBPACK_IMPORTED_MODULE_11__.proxyPolicyName),
/* harmony export */   redirectPolicy: () => (/* reexport safe */ _policies_redirectPolicy_js__WEBPACK_IMPORTED_MODULE_12__.redirectPolicy),
/* harmony export */   redirectPolicyName: () => (/* reexport safe */ _policies_redirectPolicy_js__WEBPACK_IMPORTED_MODULE_12__.redirectPolicyName),
/* harmony export */   retryPolicy: () => (/* reexport safe */ _policies_retryPolicy_js__WEBPACK_IMPORTED_MODULE_15__.retryPolicy),
/* harmony export */   setClientRequestIdPolicy: () => (/* reexport safe */ _policies_setClientRequestIdPolicy_js__WEBPACK_IMPORTED_MODULE_8__.setClientRequestIdPolicy),
/* harmony export */   setClientRequestIdPolicyName: () => (/* reexport safe */ _policies_setClientRequestIdPolicy_js__WEBPACK_IMPORTED_MODULE_8__.setClientRequestIdPolicyName),
/* harmony export */   systemErrorRetryPolicy: () => (/* reexport safe */ _policies_systemErrorRetryPolicy_js__WEBPACK_IMPORTED_MODULE_13__.systemErrorRetryPolicy),
/* harmony export */   systemErrorRetryPolicyName: () => (/* reexport safe */ _policies_systemErrorRetryPolicy_js__WEBPACK_IMPORTED_MODULE_13__.systemErrorRetryPolicyName),
/* harmony export */   throttlingRetryPolicy: () => (/* reexport safe */ _policies_throttlingRetryPolicy_js__WEBPACK_IMPORTED_MODULE_14__.throttlingRetryPolicy),
/* harmony export */   throttlingRetryPolicyName: () => (/* reexport safe */ _policies_throttlingRetryPolicy_js__WEBPACK_IMPORTED_MODULE_14__.throttlingRetryPolicyName),
/* harmony export */   tlsPolicy: () => (/* reexport safe */ _policies_tlsPolicy_js__WEBPACK_IMPORTED_MODULE_19__.tlsPolicy),
/* harmony export */   tlsPolicyName: () => (/* reexport safe */ _policies_tlsPolicy_js__WEBPACK_IMPORTED_MODULE_19__.tlsPolicyName),
/* harmony export */   tracingPolicy: () => (/* reexport safe */ _policies_tracingPolicy_js__WEBPACK_IMPORTED_MODULE_16__.tracingPolicy),
/* harmony export */   tracingPolicyName: () => (/* reexport safe */ _policies_tracingPolicy_js__WEBPACK_IMPORTED_MODULE_16__.tracingPolicyName),
/* harmony export */   userAgentPolicy: () => (/* reexport safe */ _policies_userAgentPolicy_js__WEBPACK_IMPORTED_MODULE_18__.userAgentPolicy),
/* harmony export */   userAgentPolicyName: () => (/* reexport safe */ _policies_userAgentPolicy_js__WEBPACK_IMPORTED_MODULE_18__.userAgentPolicyName)
/* harmony export */ });
/* harmony import */ var _pipeline_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pipeline.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/pipeline.js");
/* harmony import */ var _createPipelineFromOptions_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./createPipelineFromOptions.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/createPipelineFromOptions.js");
/* harmony import */ var _defaultHttpClient_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./defaultHttpClient.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/defaultHttpClient.js");
/* harmony import */ var _httpHeaders_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./httpHeaders.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/httpHeaders.js");
/* harmony import */ var _pipelineRequest_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./pipelineRequest.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/pipelineRequest.js");
/* harmony import */ var _restError_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./restError.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/restError.js");
/* harmony import */ var _policies_decompressResponsePolicy_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./policies/decompressResponsePolicy.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/policies/decompressResponsePolicy.js");
/* harmony import */ var _policies_exponentialRetryPolicy_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./policies/exponentialRetryPolicy.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/policies/exponentialRetryPolicy.js");
/* harmony import */ var _policies_setClientRequestIdPolicy_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./policies/setClientRequestIdPolicy.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/policies/setClientRequestIdPolicy.js");
/* harmony import */ var _policies_logPolicy_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./policies/logPolicy.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/policies/logPolicy.js");
/* harmony import */ var _policies_multipartPolicy_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./policies/multipartPolicy.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/policies/multipartPolicy.js");
/* harmony import */ var _policies_proxyPolicy_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./policies/proxyPolicy.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/policies/proxyPolicy.js");
/* harmony import */ var _policies_redirectPolicy_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./policies/redirectPolicy.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/policies/redirectPolicy.js");
/* harmony import */ var _policies_systemErrorRetryPolicy_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./policies/systemErrorRetryPolicy.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/policies/systemErrorRetryPolicy.js");
/* harmony import */ var _policies_throttlingRetryPolicy_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./policies/throttlingRetryPolicy.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/policies/throttlingRetryPolicy.js");
/* harmony import */ var _policies_retryPolicy_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./policies/retryPolicy.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/policies/retryPolicy.js");
/* harmony import */ var _policies_tracingPolicy_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./policies/tracingPolicy.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/policies/tracingPolicy.js");
/* harmony import */ var _policies_defaultRetryPolicy_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./policies/defaultRetryPolicy.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/policies/defaultRetryPolicy.js");
/* harmony import */ var _policies_userAgentPolicy_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./policies/userAgentPolicy.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/policies/userAgentPolicy.js");
/* harmony import */ var _policies_tlsPolicy_js__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./policies/tlsPolicy.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/policies/tlsPolicy.js");
/* harmony import */ var _policies_formDataPolicy_js__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./policies/formDataPolicy.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/policies/formDataPolicy.js");
/* harmony import */ var _policies_bearerTokenAuthenticationPolicy_js__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./policies/bearerTokenAuthenticationPolicy.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/policies/bearerTokenAuthenticationPolicy.js");
/* harmony import */ var _policies_ndJsonPolicy_js__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./policies/ndJsonPolicy.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/policies/ndJsonPolicy.js");
/* harmony import */ var _policies_auxiliaryAuthenticationHeaderPolicy_js__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./policies/auxiliaryAuthenticationHeaderPolicy.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/policies/auxiliaryAuthenticationHeaderPolicy.js");
/* harmony import */ var _util_file_js__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./util/file.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/util/file.js");
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

























//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@azure/core-rest-pipeline/dist/browser/log.js":
/*!********************************************************************!*\
  !*** ./node_modules/@azure/core-rest-pipeline/dist/browser/log.js ***!
  \********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   logger: () => (/* binding */ logger)
/* harmony export */ });
/* harmony import */ var _azure_logger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @azure/logger */ "./node_modules/@azure/logger/dist/browser/index.js");
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

const logger = (0,_azure_logger__WEBPACK_IMPORTED_MODULE_0__.createClientLogger)("core-rest-pipeline");
//# sourceMappingURL=log.js.map

/***/ }),

/***/ "./node_modules/@azure/core-rest-pipeline/dist/browser/pipeline.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@azure/core-rest-pipeline/dist/browser/pipeline.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createEmptyPipeline: () => (/* binding */ createEmptyPipeline)
/* harmony export */ });
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
const ValidPhaseNames = new Set(["Deserialize", "Serialize", "Retry", "Sign"]);
/**
 * A private implementation of Pipeline.
 * Do not export this class from the package.
 * @internal
 */
class HttpPipeline {
    constructor(policies) {
        var _a;
        this._policies = [];
        this._policies = (_a = policies === null || policies === void 0 ? void 0 : policies.slice(0)) !== null && _a !== void 0 ? _a : [];
        this._orderedPolicies = undefined;
    }
    addPolicy(policy, options = {}) {
        if (options.phase && options.afterPhase) {
            throw new Error("Policies inside a phase cannot specify afterPhase.");
        }
        if (options.phase && !ValidPhaseNames.has(options.phase)) {
            throw new Error(`Invalid phase name: ${options.phase}`);
        }
        if (options.afterPhase && !ValidPhaseNames.has(options.afterPhase)) {
            throw new Error(`Invalid afterPhase name: ${options.afterPhase}`);
        }
        this._policies.push({
            policy,
            options,
        });
        this._orderedPolicies = undefined;
    }
    removePolicy(options) {
        const removedPolicies = [];
        this._policies = this._policies.filter((policyDescriptor) => {
            if ((options.name && policyDescriptor.policy.name === options.name) ||
                (options.phase && policyDescriptor.options.phase === options.phase)) {
                removedPolicies.push(policyDescriptor.policy);
                return false;
            }
            else {
                return true;
            }
        });
        this._orderedPolicies = undefined;
        return removedPolicies;
    }
    sendRequest(httpClient, request) {
        const policies = this.getOrderedPolicies();
        const pipeline = policies.reduceRight((next, policy) => {
            return (req) => {
                return policy.sendRequest(req, next);
            };
        }, (req) => httpClient.sendRequest(req));
        return pipeline(request);
    }
    getOrderedPolicies() {
        if (!this._orderedPolicies) {
            this._orderedPolicies = this.orderPolicies();
        }
        return this._orderedPolicies;
    }
    clone() {
        return new HttpPipeline(this._policies);
    }
    static create() {
        return new HttpPipeline();
    }
    orderPolicies() {
        /**
         * The goal of this method is to reliably order pipeline policies
         * based on their declared requirements when they were added.
         *
         * Order is first determined by phase:
         *
         * 1. Serialize Phase
         * 2. Policies not in a phase
         * 3. Deserialize Phase
         * 4. Retry Phase
         * 5. Sign Phase
         *
         * Within each phase, policies are executed in the order
         * they were added unless they were specified to execute
         * before/after other policies or after a particular phase.
         *
         * To determine the final order, we will walk the policy list
         * in phase order multiple times until all dependencies are
         * satisfied.
         *
         * `afterPolicies` are the set of policies that must be
         * executed before a given policy. This requirement is
         * considered satisfied when each of the listed policies
         * have been scheduled.
         *
         * `beforePolicies` are the set of policies that must be
         * executed after a given policy. Since this dependency
         * can be expressed by converting it into a equivalent
         * `afterPolicies` declarations, they are normalized
         * into that form for simplicity.
         *
         * An `afterPhase` dependency is considered satisfied when all
         * policies in that phase have scheduled.
         *
         */
        const result = [];
        // Track all policies we know about.
        const policyMap = new Map();
        function createPhase(name) {
            return {
                name,
                policies: new Set(),
                hasRun: false,
                hasAfterPolicies: false,
            };
        }
        // Track policies for each phase.
        const serializePhase = createPhase("Serialize");
        const noPhase = createPhase("None");
        const deserializePhase = createPhase("Deserialize");
        const retryPhase = createPhase("Retry");
        const signPhase = createPhase("Sign");
        // a list of phases in order
        const orderedPhases = [serializePhase, noPhase, deserializePhase, retryPhase, signPhase];
        // Small helper function to map phase name to each Phase
        function getPhase(phase) {
            if (phase === "Retry") {
                return retryPhase;
            }
            else if (phase === "Serialize") {
                return serializePhase;
            }
            else if (phase === "Deserialize") {
                return deserializePhase;
            }
            else if (phase === "Sign") {
                return signPhase;
            }
            else {
                return noPhase;
            }
        }
        // First walk each policy and create a node to track metadata.
        for (const descriptor of this._policies) {
            const policy = descriptor.policy;
            const options = descriptor.options;
            const policyName = policy.name;
            if (policyMap.has(policyName)) {
                throw new Error("Duplicate policy names not allowed in pipeline");
            }
            const node = {
                policy,
                dependsOn: new Set(),
                dependants: new Set(),
            };
            if (options.afterPhase) {
                node.afterPhase = getPhase(options.afterPhase);
                node.afterPhase.hasAfterPolicies = true;
            }
            policyMap.set(policyName, node);
            const phase = getPhase(options.phase);
            phase.policies.add(node);
        }
        // Now that each policy has a node, connect dependency references.
        for (const descriptor of this._policies) {
            const { policy, options } = descriptor;
            const policyName = policy.name;
            const node = policyMap.get(policyName);
            if (!node) {
                throw new Error(`Missing node for policy ${policyName}`);
            }
            if (options.afterPolicies) {
                for (const afterPolicyName of options.afterPolicies) {
                    const afterNode = policyMap.get(afterPolicyName);
                    if (afterNode) {
                        // Linking in both directions helps later
                        // when we want to notify dependants.
                        node.dependsOn.add(afterNode);
                        afterNode.dependants.add(node);
                    }
                }
            }
            if (options.beforePolicies) {
                for (const beforePolicyName of options.beforePolicies) {
                    const beforeNode = policyMap.get(beforePolicyName);
                    if (beforeNode) {
                        // To execute before another node, make it
                        // depend on the current node.
                        beforeNode.dependsOn.add(node);
                        node.dependants.add(beforeNode);
                    }
                }
            }
        }
        function walkPhase(phase) {
            phase.hasRun = true;
            // Sets iterate in insertion order
            for (const node of phase.policies) {
                if (node.afterPhase && (!node.afterPhase.hasRun || node.afterPhase.policies.size)) {
                    // If this node is waiting on a phase to complete,
                    // we need to skip it for now.
                    // Even if the phase is empty, we should wait for it
                    // to be walked to avoid re-ordering policies.
                    continue;
                }
                if (node.dependsOn.size === 0) {
                    // If there's nothing else we're waiting for, we can
                    // add this policy to the result list.
                    result.push(node.policy);
                    // Notify anything that depends on this policy that
                    // the policy has been scheduled.
                    for (const dependant of node.dependants) {
                        dependant.dependsOn.delete(node);
                    }
                    policyMap.delete(node.policy.name);
                    phase.policies.delete(node);
                }
            }
        }
        function walkPhases() {
            for (const phase of orderedPhases) {
                walkPhase(phase);
                // if the phase isn't complete
                if (phase.policies.size > 0 && phase !== noPhase) {
                    if (!noPhase.hasRun) {
                        // Try running noPhase to see if that unblocks this phase next tick.
                        // This can happen if a phase that happens before noPhase
                        // is waiting on a noPhase policy to complete.
                        walkPhase(noPhase);
                    }
                    // Don't proceed to the next phase until this phase finishes.
                    return;
                }
                if (phase.hasAfterPolicies) {
                    // Run any policies unblocked by this phase
                    walkPhase(noPhase);
                }
            }
        }
        // Iterate until we've put every node in the result list.
        let iteration = 0;
        while (policyMap.size > 0) {
            iteration++;
            const initialResultLength = result.length;
            // Keep walking each phase in order until we can order every node.
            walkPhases();
            // The result list *should* get at least one larger each time
            // after the first full pass.
            // Otherwise, we're going to loop forever.
            if (result.length <= initialResultLength && iteration > 1) {
                throw new Error("Cannot satisfy policy dependencies due to requirements cycle.");
            }
        }
        return result;
    }
}
/**
 * Creates a totally empty pipeline.
 * Useful for testing or creating a custom one.
 */
function createEmptyPipeline() {
    return HttpPipeline.create();
}
//# sourceMappingURL=pipeline.js.map

/***/ }),

/***/ "./node_modules/@azure/core-rest-pipeline/dist/browser/pipelineRequest.js":
/*!********************************************************************************!*\
  !*** ./node_modules/@azure/core-rest-pipeline/dist/browser/pipelineRequest.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createPipelineRequest: () => (/* binding */ createPipelineRequest)
/* harmony export */ });
/* harmony import */ var _httpHeaders_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./httpHeaders.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/httpHeaders.js");
/* harmony import */ var _azure_core_util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @azure/core-util */ "./node_modules/@azure/core-util/dist/browser/index.js");
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.


class PipelineRequestImpl {
    constructor(options) {
        var _a, _b, _c, _d, _e, _f, _g;
        this.url = options.url;
        this.body = options.body;
        this.headers = (_a = options.headers) !== null && _a !== void 0 ? _a : (0,_httpHeaders_js__WEBPACK_IMPORTED_MODULE_0__.createHttpHeaders)();
        this.method = (_b = options.method) !== null && _b !== void 0 ? _b : "GET";
        this.timeout = (_c = options.timeout) !== null && _c !== void 0 ? _c : 0;
        this.multipartBody = options.multipartBody;
        this.formData = options.formData;
        this.disableKeepAlive = (_d = options.disableKeepAlive) !== null && _d !== void 0 ? _d : false;
        this.proxySettings = options.proxySettings;
        this.streamResponseStatusCodes = options.streamResponseStatusCodes;
        this.withCredentials = (_e = options.withCredentials) !== null && _e !== void 0 ? _e : false;
        this.abortSignal = options.abortSignal;
        this.tracingOptions = options.tracingOptions;
        this.onUploadProgress = options.onUploadProgress;
        this.onDownloadProgress = options.onDownloadProgress;
        this.requestId = options.requestId || (0,_azure_core_util__WEBPACK_IMPORTED_MODULE_1__.randomUUID)();
        this.allowInsecureConnection = (_f = options.allowInsecureConnection) !== null && _f !== void 0 ? _f : false;
        this.enableBrowserStreams = (_g = options.enableBrowserStreams) !== null && _g !== void 0 ? _g : false;
    }
}
/**
 * Creates a new pipeline request with the given options.
 * This method is to allow for the easy setting of default values and not required.
 * @param options - The options to create the request with.
 */
function createPipelineRequest(options) {
    return new PipelineRequestImpl(options);
}
//# sourceMappingURL=pipelineRequest.js.map

/***/ }),

/***/ "./node_modules/@azure/core-rest-pipeline/dist/browser/policies/auxiliaryAuthenticationHeaderPolicy.js":
/*!*************************************************************************************************************!*\
  !*** ./node_modules/@azure/core-rest-pipeline/dist/browser/policies/auxiliaryAuthenticationHeaderPolicy.js ***!
  \*************************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   auxiliaryAuthenticationHeaderPolicy: () => (/* binding */ auxiliaryAuthenticationHeaderPolicy),
/* harmony export */   auxiliaryAuthenticationHeaderPolicyName: () => (/* binding */ auxiliaryAuthenticationHeaderPolicyName)
/* harmony export */ });
/* harmony import */ var _util_tokenCycler_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/tokenCycler.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/util/tokenCycler.js");
/* harmony import */ var _log_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../log.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/log.js");
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.


/**
 * The programmatic identifier of the auxiliaryAuthenticationHeaderPolicy.
 */
const auxiliaryAuthenticationHeaderPolicyName = "auxiliaryAuthenticationHeaderPolicy";
const AUTHORIZATION_AUXILIARY_HEADER = "x-ms-authorization-auxiliary";
async function sendAuthorizeRequest(options) {
    var _a, _b;
    const { scopes, getAccessToken, request } = options;
    const getTokenOptions = {
        abortSignal: request.abortSignal,
        tracingOptions: request.tracingOptions,
    };
    return (_b = (_a = (await getAccessToken(scopes, getTokenOptions))) === null || _a === void 0 ? void 0 : _a.token) !== null && _b !== void 0 ? _b : "";
}
/**
 * A policy for external tokens to `x-ms-authorization-auxiliary` header.
 * This header will be used when creating a cross-tenant application we may need to handle authentication requests
 * for resources that are in different tenants.
 * You could see [ARM docs](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/authenticate-multi-tenant) for a rundown of how this feature works
 */
function auxiliaryAuthenticationHeaderPolicy(options) {
    const { credentials, scopes } = options;
    const logger = options.logger || _log_js__WEBPACK_IMPORTED_MODULE_1__.logger;
    const tokenCyclerMap = new WeakMap();
    return {
        name: auxiliaryAuthenticationHeaderPolicyName,
        async sendRequest(request, next) {
            if (!request.url.toLowerCase().startsWith("https://")) {
                throw new Error("Bearer token authentication for auxiliary header is not permitted for non-TLS protected (non-https) URLs.");
            }
            if (!credentials || credentials.length === 0) {
                logger.info(`${auxiliaryAuthenticationHeaderPolicyName} header will not be set due to empty credentials.`);
                return next(request);
            }
            const tokenPromises = [];
            for (const credential of credentials) {
                let getAccessToken = tokenCyclerMap.get(credential);
                if (!getAccessToken) {
                    getAccessToken = (0,_util_tokenCycler_js__WEBPACK_IMPORTED_MODULE_0__.createTokenCycler)(credential);
                    tokenCyclerMap.set(credential, getAccessToken);
                }
                tokenPromises.push(sendAuthorizeRequest({
                    scopes: Array.isArray(scopes) ? scopes : [scopes],
                    request,
                    getAccessToken,
                    logger,
                }));
            }
            const auxiliaryTokens = (await Promise.all(tokenPromises)).filter((token) => Boolean(token));
            if (auxiliaryTokens.length === 0) {
                logger.warning(`None of the auxiliary tokens are valid. ${AUTHORIZATION_AUXILIARY_HEADER} header will not be set.`);
                return next(request);
            }
            request.headers.set(AUTHORIZATION_AUXILIARY_HEADER, auxiliaryTokens.map((token) => `Bearer ${token}`).join(", "));
            return next(request);
        },
    };
}
//# sourceMappingURL=auxiliaryAuthenticationHeaderPolicy.js.map

/***/ }),

/***/ "./node_modules/@azure/core-rest-pipeline/dist/browser/policies/bearerTokenAuthenticationPolicy.js":
/*!*********************************************************************************************************!*\
  !*** ./node_modules/@azure/core-rest-pipeline/dist/browser/policies/bearerTokenAuthenticationPolicy.js ***!
  \*********************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bearerTokenAuthenticationPolicy: () => (/* binding */ bearerTokenAuthenticationPolicy),
/* harmony export */   bearerTokenAuthenticationPolicyName: () => (/* binding */ bearerTokenAuthenticationPolicyName)
/* harmony export */ });
/* harmony import */ var _util_tokenCycler_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/tokenCycler.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/util/tokenCycler.js");
/* harmony import */ var _log_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../log.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/log.js");
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.


/**
 * The programmatic identifier of the bearerTokenAuthenticationPolicy.
 */
const bearerTokenAuthenticationPolicyName = "bearerTokenAuthenticationPolicy";
/**
 * Default authorize request handler
 */
async function defaultAuthorizeRequest(options) {
    const { scopes, getAccessToken, request } = options;
    const getTokenOptions = {
        abortSignal: request.abortSignal,
        tracingOptions: request.tracingOptions,
    };
    const accessToken = await getAccessToken(scopes, getTokenOptions);
    if (accessToken) {
        options.request.headers.set("Authorization", `Bearer ${accessToken.token}`);
    }
}
/**
 * We will retrieve the challenge only if the response status code was 401,
 * and if the response contained the header "WWW-Authenticate" with a non-empty value.
 */
function getChallenge(response) {
    const challenge = response.headers.get("WWW-Authenticate");
    if (response.status === 401 && challenge) {
        return challenge;
    }
    return;
}
/**
 * A policy that can request a token from a TokenCredential implementation and
 * then apply it to the Authorization header of a request as a Bearer token.
 */
function bearerTokenAuthenticationPolicy(options) {
    var _a;
    const { credential, scopes, challengeCallbacks } = options;
    const logger = options.logger || _log_js__WEBPACK_IMPORTED_MODULE_1__.logger;
    const callbacks = Object.assign({ authorizeRequest: (_a = challengeCallbacks === null || challengeCallbacks === void 0 ? void 0 : challengeCallbacks.authorizeRequest) !== null && _a !== void 0 ? _a : defaultAuthorizeRequest, authorizeRequestOnChallenge: challengeCallbacks === null || challengeCallbacks === void 0 ? void 0 : challengeCallbacks.authorizeRequestOnChallenge }, challengeCallbacks);
    // This function encapsulates the entire process of reliably retrieving the token
    // The options are left out of the public API until there's demand to configure this.
    // Remember to extend `BearerTokenAuthenticationPolicyOptions` with `TokenCyclerOptions`
    // in order to pass through the `options` object.
    const getAccessToken = credential
        ? (0,_util_tokenCycler_js__WEBPACK_IMPORTED_MODULE_0__.createTokenCycler)(credential /* , options */)
        : () => Promise.resolve(null);
    return {
        name: bearerTokenAuthenticationPolicyName,
        /**
         * If there's no challenge parameter:
         * - It will try to retrieve the token using the cache, or the credential's getToken.
         * - Then it will try the next policy with or without the retrieved token.
         *
         * It uses the challenge parameters to:
         * - Skip a first attempt to get the token from the credential if there's no cached token,
         *   since it expects the token to be retrievable only after the challenge.
         * - Prepare the outgoing request if the `prepareRequest` method has been provided.
         * - Send an initial request to receive the challenge if it fails.
         * - Process a challenge if the response contains it.
         * - Retrieve a token with the challenge information, then re-send the request.
         */
        async sendRequest(request, next) {
            if (!request.url.toLowerCase().startsWith("https://")) {
                throw new Error("Bearer token authentication is not permitted for non-TLS protected (non-https) URLs.");
            }
            await callbacks.authorizeRequest({
                scopes: Array.isArray(scopes) ? scopes : [scopes],
                request,
                getAccessToken,
                logger,
            });
            let response;
            let error;
            try {
                response = await next(request);
            }
            catch (err) {
                error = err;
                response = err.response;
            }
            if (callbacks.authorizeRequestOnChallenge &&
                (response === null || response === void 0 ? void 0 : response.status) === 401 &&
                getChallenge(response)) {
                // processes challenge
                const shouldSendRequest = await callbacks.authorizeRequestOnChallenge({
                    scopes: Array.isArray(scopes) ? scopes : [scopes],
                    request,
                    response,
                    getAccessToken,
                    logger,
                });
                if (shouldSendRequest) {
                    return next(request);
                }
            }
            if (error) {
                throw error;
            }
            else {
                return response;
            }
        },
    };
}
//# sourceMappingURL=bearerTokenAuthenticationPolicy.js.map

/***/ }),

/***/ "./node_modules/@azure/core-rest-pipeline/dist/browser/policies/decompressResponsePolicy.js":
/*!**************************************************************************************************!*\
  !*** ./node_modules/@azure/core-rest-pipeline/dist/browser/policies/decompressResponsePolicy.js ***!
  \**************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   decompressResponsePolicy: () => (/* binding */ decompressResponsePolicy),
/* harmony export */   decompressResponsePolicyName: () => (/* binding */ decompressResponsePolicyName)
/* harmony export */ });
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/*
 * NOTE: When moving this file, please update "browser" section in package.json
 */
const decompressResponsePolicyName = "decompressResponsePolicy";
/**
 * decompressResponsePolicy is not supported in the browser and attempting
 * to use it will raise an error.
 */
function decompressResponsePolicy() {
    throw new Error("decompressResponsePolicy is not supported in browser environment");
}
//# sourceMappingURL=decompressResponsePolicy-browser.mjs.map

/***/ }),

/***/ "./node_modules/@azure/core-rest-pipeline/dist/browser/policies/defaultRetryPolicy.js":
/*!********************************************************************************************!*\
  !*** ./node_modules/@azure/core-rest-pipeline/dist/browser/policies/defaultRetryPolicy.js ***!
  \********************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   defaultRetryPolicy: () => (/* binding */ defaultRetryPolicy),
/* harmony export */   defaultRetryPolicyName: () => (/* binding */ defaultRetryPolicyName)
/* harmony export */ });
/* harmony import */ var _retryStrategies_exponentialRetryStrategy_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../retryStrategies/exponentialRetryStrategy.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/retryStrategies/exponentialRetryStrategy.js");
/* harmony import */ var _retryStrategies_throttlingRetryStrategy_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../retryStrategies/throttlingRetryStrategy.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/retryStrategies/throttlingRetryStrategy.js");
/* harmony import */ var _retryPolicy_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./retryPolicy.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/policies/retryPolicy.js");
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../constants.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/constants.js");
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.




/**
 * Name of the {@link defaultRetryPolicy}
 */
const defaultRetryPolicyName = "defaultRetryPolicy";
/**
 * A policy that retries according to three strategies:
 * - When the server sends a 429 response with a Retry-After header.
 * - When there are errors in the underlying transport layer (e.g. DNS lookup failures).
 * - Or otherwise if the outgoing request fails, it will retry with an exponentially increasing delay.
 */
function defaultRetryPolicy(options = {}) {
    var _a;
    return {
        name: defaultRetryPolicyName,
        sendRequest: (0,_retryPolicy_js__WEBPACK_IMPORTED_MODULE_2__.retryPolicy)([(0,_retryStrategies_throttlingRetryStrategy_js__WEBPACK_IMPORTED_MODULE_1__.throttlingRetryStrategy)(), (0,_retryStrategies_exponentialRetryStrategy_js__WEBPACK_IMPORTED_MODULE_0__.exponentialRetryStrategy)(options)], {
            maxRetries: (_a = options.maxRetries) !== null && _a !== void 0 ? _a : _constants_js__WEBPACK_IMPORTED_MODULE_3__.DEFAULT_RETRY_POLICY_COUNT,
        }).sendRequest,
    };
}
//# sourceMappingURL=defaultRetryPolicy.js.map

/***/ }),

/***/ "./node_modules/@azure/core-rest-pipeline/dist/browser/policies/exponentialRetryPolicy.js":
/*!************************************************************************************************!*\
  !*** ./node_modules/@azure/core-rest-pipeline/dist/browser/policies/exponentialRetryPolicy.js ***!
  \************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   exponentialRetryPolicy: () => (/* binding */ exponentialRetryPolicy),
/* harmony export */   exponentialRetryPolicyName: () => (/* binding */ exponentialRetryPolicyName)
/* harmony export */ });
/* harmony import */ var _retryStrategies_exponentialRetryStrategy_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../retryStrategies/exponentialRetryStrategy.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/retryStrategies/exponentialRetryStrategy.js");
/* harmony import */ var _retryPolicy_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./retryPolicy.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/policies/retryPolicy.js");
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../constants.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/constants.js");
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.



/**
 * The programmatic identifier of the exponentialRetryPolicy.
 */
const exponentialRetryPolicyName = "exponentialRetryPolicy";
/**
 * A policy that attempts to retry requests while introducing an exponentially increasing delay.
 * @param options - Options that configure retry logic.
 */
function exponentialRetryPolicy(options = {}) {
    var _a;
    return (0,_retryPolicy_js__WEBPACK_IMPORTED_MODULE_1__.retryPolicy)([
        (0,_retryStrategies_exponentialRetryStrategy_js__WEBPACK_IMPORTED_MODULE_0__.exponentialRetryStrategy)(Object.assign(Object.assign({}, options), { ignoreSystemErrors: true })),
    ], {
        maxRetries: (_a = options.maxRetries) !== null && _a !== void 0 ? _a : _constants_js__WEBPACK_IMPORTED_MODULE_2__.DEFAULT_RETRY_POLICY_COUNT,
    });
}
//# sourceMappingURL=exponentialRetryPolicy.js.map

/***/ }),

/***/ "./node_modules/@azure/core-rest-pipeline/dist/browser/policies/formDataPolicy.js":
/*!****************************************************************************************!*\
  !*** ./node_modules/@azure/core-rest-pipeline/dist/browser/policies/formDataPolicy.js ***!
  \****************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   formDataPolicy: () => (/* binding */ formDataPolicy),
/* harmony export */   formDataPolicyName: () => (/* binding */ formDataPolicyName)
/* harmony export */ });
/* harmony import */ var _azure_core_util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @azure/core-util */ "./node_modules/@azure/core-util/dist/browser/index.js");
/* harmony import */ var _httpHeaders_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../httpHeaders.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/httpHeaders.js");
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.


/**
 * The programmatic identifier of the formDataPolicy.
 */
const formDataPolicyName = "formDataPolicy";
function formDataToFormDataMap(formData) {
    var _a;
    const formDataMap = {};
    for (const [key, value] of formData.entries()) {
        (_a = formDataMap[key]) !== null && _a !== void 0 ? _a : (formDataMap[key] = []);
        formDataMap[key].push(value);
    }
    return formDataMap;
}
/**
 * A policy that encodes FormData on the request into the body.
 */
function formDataPolicy() {
    return {
        name: formDataPolicyName,
        async sendRequest(request, next) {
            if (_azure_core_util__WEBPACK_IMPORTED_MODULE_0__.isNodeLike && typeof FormData !== "undefined" && request.body instanceof FormData) {
                request.formData = formDataToFormDataMap(request.body);
                request.body = undefined;
            }
            if (request.formData) {
                const contentType = request.headers.get("Content-Type");
                if (contentType && contentType.indexOf("application/x-www-form-urlencoded") !== -1) {
                    request.body = wwwFormUrlEncode(request.formData);
                }
                else {
                    await prepareFormData(request.formData, request);
                }
                request.formData = undefined;
            }
            return next(request);
        },
    };
}
function wwwFormUrlEncode(formData) {
    const urlSearchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(formData)) {
        if (Array.isArray(value)) {
            for (const subValue of value) {
                urlSearchParams.append(key, subValue.toString());
            }
        }
        else {
            urlSearchParams.append(key, value.toString());
        }
    }
    return urlSearchParams.toString();
}
async function prepareFormData(formData, request) {
    // validate content type (multipart/form-data)
    const contentType = request.headers.get("Content-Type");
    if (contentType && !contentType.startsWith("multipart/form-data")) {
        // content type is specified and is not multipart/form-data. Exit.
        return;
    }
    request.headers.set("Content-Type", contentType !== null && contentType !== void 0 ? contentType : "multipart/form-data");
    // set body to MultipartRequestBody using content from FormDataMap
    const parts = [];
    for (const [fieldName, values] of Object.entries(formData)) {
        for (const value of Array.isArray(values) ? values : [values]) {
            if (typeof value === "string") {
                parts.push({
                    headers: (0,_httpHeaders_js__WEBPACK_IMPORTED_MODULE_1__.createHttpHeaders)({
                        "Content-Disposition": `form-data; name="${fieldName}"`,
                    }),
                    body: (0,_azure_core_util__WEBPACK_IMPORTED_MODULE_0__.stringToUint8Array)(value, "utf-8"),
                });
            }
            else if (value === undefined || value === null || typeof value !== "object") {
                throw new Error(`Unexpected value for key ${fieldName}: ${value}. Value should be serialized to string first.`);
            }
            else {
                // using || instead of ?? here since if value.name is empty we should create a file name
                const fileName = value.name || "blob";
                const headers = (0,_httpHeaders_js__WEBPACK_IMPORTED_MODULE_1__.createHttpHeaders)();
                headers.set("Content-Disposition", `form-data; name="${fieldName}"; filename="${fileName}"`);
                // again, || is used since an empty value.type means the content type is unset
                headers.set("Content-Type", value.type || "application/octet-stream");
                parts.push({
                    headers,
                    body: value,
                });
            }
        }
    }
    request.multipartBody = { parts };
}
//# sourceMappingURL=formDataPolicy.js.map

/***/ }),

/***/ "./node_modules/@azure/core-rest-pipeline/dist/browser/policies/logPolicy.js":
/*!***********************************************************************************!*\
  !*** ./node_modules/@azure/core-rest-pipeline/dist/browser/policies/logPolicy.js ***!
  \***********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   logPolicy: () => (/* binding */ logPolicy),
/* harmony export */   logPolicyName: () => (/* binding */ logPolicyName)
/* harmony export */ });
/* harmony import */ var _log_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../log.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/log.js");
/* harmony import */ var _util_sanitizer_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util/sanitizer.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/util/sanitizer.js");
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.


/**
 * The programmatic identifier of the logPolicy.
 */
const logPolicyName = "logPolicy";
/**
 * A policy that logs all requests and responses.
 * @param options - Options to configure logPolicy.
 */
function logPolicy(options = {}) {
    var _a;
    const logger = (_a = options.logger) !== null && _a !== void 0 ? _a : _log_js__WEBPACK_IMPORTED_MODULE_0__.logger.info;
    const sanitizer = new _util_sanitizer_js__WEBPACK_IMPORTED_MODULE_1__.Sanitizer({
        additionalAllowedHeaderNames: options.additionalAllowedHeaderNames,
        additionalAllowedQueryParameters: options.additionalAllowedQueryParameters,
    });
    return {
        name: logPolicyName,
        async sendRequest(request, next) {
            if (!logger.enabled) {
                return next(request);
            }
            logger(`Request: ${sanitizer.sanitize(request)}`);
            const response = await next(request);
            logger(`Response status code: ${response.status}`);
            logger(`Headers: ${sanitizer.sanitize(response.headers)}`);
            return response;
        },
    };
}
//# sourceMappingURL=logPolicy.js.map

/***/ }),

/***/ "./node_modules/@azure/core-rest-pipeline/dist/browser/policies/multipartPolicy.js":
/*!*****************************************************************************************!*\
  !*** ./node_modules/@azure/core-rest-pipeline/dist/browser/policies/multipartPolicy.js ***!
  \*****************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   multipartPolicy: () => (/* binding */ multipartPolicy),
/* harmony export */   multipartPolicyName: () => (/* binding */ multipartPolicyName)
/* harmony export */ });
/* harmony import */ var _azure_core_util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @azure/core-util */ "./node_modules/@azure/core-util/dist/browser/index.js");
/* harmony import */ var _util_concat_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util/concat.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/util/concat.js");
/* harmony import */ var _util_typeGuards_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../util/typeGuards.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/util/typeGuards.js");
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.



function generateBoundary() {
    return `----AzSDKFormBoundary${(0,_azure_core_util__WEBPACK_IMPORTED_MODULE_0__.randomUUID)()}`;
}
function encodeHeaders(headers) {
    let result = "";
    for (const [key, value] of headers) {
        result += `${key}: ${value}\r\n`;
    }
    return result;
}
function getLength(source) {
    if (source instanceof Uint8Array) {
        return source.byteLength;
    }
    else if ((0,_util_typeGuards_js__WEBPACK_IMPORTED_MODULE_2__.isBlob)(source)) {
        // if was created using createFile then -1 means we have an unknown size
        return source.size === -1 ? undefined : source.size;
    }
    else {
        return undefined;
    }
}
function getTotalLength(sources) {
    let total = 0;
    for (const source of sources) {
        const partLength = getLength(source);
        if (partLength === undefined) {
            return undefined;
        }
        else {
            total += partLength;
        }
    }
    return total;
}
async function buildRequestBody(request, parts, boundary) {
    const sources = [
        (0,_azure_core_util__WEBPACK_IMPORTED_MODULE_0__.stringToUint8Array)(`--${boundary}`, "utf-8"),
        ...parts.flatMap((part) => [
            (0,_azure_core_util__WEBPACK_IMPORTED_MODULE_0__.stringToUint8Array)("\r\n", "utf-8"),
            (0,_azure_core_util__WEBPACK_IMPORTED_MODULE_0__.stringToUint8Array)(encodeHeaders(part.headers), "utf-8"),
            (0,_azure_core_util__WEBPACK_IMPORTED_MODULE_0__.stringToUint8Array)("\r\n", "utf-8"),
            part.body,
            (0,_azure_core_util__WEBPACK_IMPORTED_MODULE_0__.stringToUint8Array)(`\r\n--${boundary}`, "utf-8"),
        ]),
        (0,_azure_core_util__WEBPACK_IMPORTED_MODULE_0__.stringToUint8Array)("--\r\n\r\n", "utf-8"),
    ];
    const contentLength = getTotalLength(sources);
    if (contentLength) {
        request.headers.set("Content-Length", contentLength);
    }
    request.body = await (0,_util_concat_js__WEBPACK_IMPORTED_MODULE_1__.concat)(sources);
}
/**
 * Name of multipart policy
 */
const multipartPolicyName = "multipartPolicy";
const maxBoundaryLength = 70;
const validBoundaryCharacters = new Set(`abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'()+,-./:=?`);
function assertValidBoundary(boundary) {
    if (boundary.length > maxBoundaryLength) {
        throw new Error(`Multipart boundary "${boundary}" exceeds maximum length of 70 characters`);
    }
    if (Array.from(boundary).some((x) => !validBoundaryCharacters.has(x))) {
        throw new Error(`Multipart boundary "${boundary}" contains invalid characters`);
    }
}
/**
 * Pipeline policy for multipart requests
 */
function multipartPolicy() {
    return {
        name: multipartPolicyName,
        async sendRequest(request, next) {
            var _a;
            if (!request.multipartBody) {
                return next(request);
            }
            if (request.body) {
                throw new Error("multipartBody and regular body cannot be set at the same time");
            }
            let boundary = request.multipartBody.boundary;
            const contentTypeHeader = (_a = request.headers.get("Content-Type")) !== null && _a !== void 0 ? _a : "multipart/mixed";
            const parsedHeader = contentTypeHeader.match(/^(multipart\/[^ ;]+)(?:; *boundary=(.+))?$/);
            if (!parsedHeader) {
                throw new Error(`Got multipart request body, but content-type header was not multipart: ${contentTypeHeader}`);
            }
            const [, contentType, parsedBoundary] = parsedHeader;
            if (parsedBoundary && boundary && parsedBoundary !== boundary) {
                throw new Error(`Multipart boundary was specified as ${parsedBoundary} in the header, but got ${boundary} in the request body`);
            }
            boundary !== null && boundary !== void 0 ? boundary : (boundary = parsedBoundary);
            if (boundary) {
                assertValidBoundary(boundary);
            }
            else {
                boundary = generateBoundary();
            }
            request.headers.set("Content-Type", `${contentType}; boundary=${boundary}`);
            await buildRequestBody(request, request.multipartBody.parts, boundary);
            request.multipartBody = undefined;
            return next(request);
        },
    };
}
//# sourceMappingURL=multipartPolicy.js.map

/***/ }),

/***/ "./node_modules/@azure/core-rest-pipeline/dist/browser/policies/ndJsonPolicy.js":
/*!**************************************************************************************!*\
  !*** ./node_modules/@azure/core-rest-pipeline/dist/browser/policies/ndJsonPolicy.js ***!
  \**************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ndJsonPolicy: () => (/* binding */ ndJsonPolicy),
/* harmony export */   ndJsonPolicyName: () => (/* binding */ ndJsonPolicyName)
/* harmony export */ });
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/**
 * The programmatic identifier of the ndJsonPolicy.
 */
const ndJsonPolicyName = "ndJsonPolicy";
/**
 * ndJsonPolicy is a policy used to control keep alive settings for every request.
 */
function ndJsonPolicy() {
    return {
        name: ndJsonPolicyName,
        async sendRequest(request, next) {
            // There currently isn't a good way to bypass the serializer
            if (typeof request.body === "string" && request.body.startsWith("[")) {
                const body = JSON.parse(request.body);
                if (Array.isArray(body)) {
                    request.body = body.map((item) => JSON.stringify(item) + "\n").join("");
                }
            }
            return next(request);
        },
    };
}
//# sourceMappingURL=ndJsonPolicy.js.map

/***/ }),

/***/ "./node_modules/@azure/core-rest-pipeline/dist/browser/policies/proxyPolicy.js":
/*!*************************************************************************************!*\
  !*** ./node_modules/@azure/core-rest-pipeline/dist/browser/policies/proxyPolicy.js ***!
  \*************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getDefaultProxySettings: () => (/* binding */ getDefaultProxySettings),
/* harmony export */   proxyPolicy: () => (/* binding */ proxyPolicy),
/* harmony export */   proxyPolicyName: () => (/* binding */ proxyPolicyName),
/* harmony export */   resetCachedProxyAgents: () => (/* binding */ resetCachedProxyAgents)
/* harmony export */ });
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/*
 * NOTE: When moving this file, please update "browser" section in package.json
 */
const proxyPolicyName = "proxyPolicy";
const errorMessage = "proxyPolicy is not supported in browser environment";
function getDefaultProxySettings() {
    throw new Error(errorMessage);
}
/**
 * proxyPolicy is not supported in the browser and attempting
 * to use it will raise an error.
 */
function proxyPolicy() {
    throw new Error(errorMessage);
}
/**
 * A function to reset the cached agents.
 * proxyPolicy is not supported in the browser and attempting
 * to use it will raise an error.
 * @internal
 */
function resetCachedProxyAgents() {
    throw new Error(errorMessage);
}
//# sourceMappingURL=proxyPolicy-browser.mjs.map

/***/ }),

/***/ "./node_modules/@azure/core-rest-pipeline/dist/browser/policies/redirectPolicy.js":
/*!****************************************************************************************!*\
  !*** ./node_modules/@azure/core-rest-pipeline/dist/browser/policies/redirectPolicy.js ***!
  \****************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   redirectPolicy: () => (/* binding */ redirectPolicy),
/* harmony export */   redirectPolicyName: () => (/* binding */ redirectPolicyName)
/* harmony export */ });
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/**
 * The programmatic identifier of the redirectPolicy.
 */
const redirectPolicyName = "redirectPolicy";
/**
 * Methods that are allowed to follow redirects 301 and 302
 */
const allowedRedirect = ["GET", "HEAD"];
/**
 * A policy to follow Location headers from the server in order
 * to support server-side redirection.
 * In the browser, this policy is not used.
 * @param options - Options to control policy behavior.
 */
function redirectPolicy(options = {}) {
    const { maxRetries = 20 } = options;
    return {
        name: redirectPolicyName,
        async sendRequest(request, next) {
            const response = await next(request);
            return handleRedirect(next, response, maxRetries);
        },
    };
}
async function handleRedirect(next, response, maxRetries, currentRetries = 0) {
    const { request, status, headers } = response;
    const locationHeader = headers.get("location");
    if (locationHeader &&
        (status === 300 ||
            (status === 301 && allowedRedirect.includes(request.method)) ||
            (status === 302 && allowedRedirect.includes(request.method)) ||
            (status === 303 && request.method === "POST") ||
            status === 307) &&
        currentRetries < maxRetries) {
        const url = new URL(locationHeader, request.url);
        request.url = url.toString();
        // POST request with Status code 303 should be converted into a
        // redirected GET request if the redirect url is present in the location header
        if (status === 303) {
            request.method = "GET";
            request.headers.delete("Content-Length");
            delete request.body;
        }
        request.headers.delete("Authorization");
        const res = await next(request);
        return handleRedirect(next, res, maxRetries, currentRetries + 1);
    }
    return response;
}
//# sourceMappingURL=redirectPolicy.js.map

/***/ }),

/***/ "./node_modules/@azure/core-rest-pipeline/dist/browser/policies/retryPolicy.js":
/*!*************************************************************************************!*\
  !*** ./node_modules/@azure/core-rest-pipeline/dist/browser/policies/retryPolicy.js ***!
  \*************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   retryPolicy: () => (/* binding */ retryPolicy)
/* harmony export */ });
/* harmony import */ var _util_helpers_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/helpers.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/util/helpers.js");
/* harmony import */ var _azure_logger__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @azure/logger */ "./node_modules/@azure/logger/dist/browser/index.js");
/* harmony import */ var _azure_abort_controller__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @azure/abort-controller */ "./node_modules/@azure/abort-controller/dist/browser/index.js");
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../constants.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/constants.js");
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.




const retryPolicyLogger = (0,_azure_logger__WEBPACK_IMPORTED_MODULE_1__.createClientLogger)("core-rest-pipeline retryPolicy");
/**
 * The programmatic identifier of the retryPolicy.
 */
const retryPolicyName = "retryPolicy";
/**
 * retryPolicy is a generic policy to enable retrying requests when certain conditions are met
 */
function retryPolicy(strategies, options = { maxRetries: _constants_js__WEBPACK_IMPORTED_MODULE_3__.DEFAULT_RETRY_POLICY_COUNT }) {
    const logger = options.logger || retryPolicyLogger;
    return {
        name: retryPolicyName,
        async sendRequest(request, next) {
            var _a, _b;
            let response;
            let responseError;
            let retryCount = -1;
            // eslint-disable-next-line no-constant-condition
            retryRequest: while (true) {
                retryCount += 1;
                response = undefined;
                responseError = undefined;
                try {
                    logger.info(`Retry ${retryCount}: Attempting to send request`, request.requestId);
                    response = await next(request);
                    logger.info(`Retry ${retryCount}: Received a response from request`, request.requestId);
                }
                catch (e) {
                    logger.error(`Retry ${retryCount}: Received an error from request`, request.requestId);
                    // RestErrors are valid targets for the retry strategies.
                    // If none of the retry strategies can work with them, they will be thrown later in this policy.
                    // If the received error is not a RestError, it is immediately thrown.
                    responseError = e;
                    if (!e || responseError.name !== "RestError") {
                        throw e;
                    }
                    response = responseError.response;
                }
                if ((_a = request.abortSignal) === null || _a === void 0 ? void 0 : _a.aborted) {
                    logger.error(`Retry ${retryCount}: Request aborted.`);
                    const abortError = new _azure_abort_controller__WEBPACK_IMPORTED_MODULE_2__.AbortError();
                    throw abortError;
                }
                if (retryCount >= ((_b = options.maxRetries) !== null && _b !== void 0 ? _b : _constants_js__WEBPACK_IMPORTED_MODULE_3__.DEFAULT_RETRY_POLICY_COUNT)) {
                    logger.info(`Retry ${retryCount}: Maximum retries reached. Returning the last received response, or throwing the last received error.`);
                    if (responseError) {
                        throw responseError;
                    }
                    else if (response) {
                        return response;
                    }
                    else {
                        throw new Error("Maximum retries reached with no response or error to throw");
                    }
                }
                logger.info(`Retry ${retryCount}: Processing ${strategies.length} retry strategies.`);
                strategiesLoop: for (const strategy of strategies) {
                    const strategyLogger = strategy.logger || retryPolicyLogger;
                    strategyLogger.info(`Retry ${retryCount}: Processing retry strategy ${strategy.name}.`);
                    const modifiers = strategy.retry({
                        retryCount,
                        response,
                        responseError,
                    });
                    if (modifiers.skipStrategy) {
                        strategyLogger.info(`Retry ${retryCount}: Skipped.`);
                        continue strategiesLoop;
                    }
                    const { errorToThrow, retryAfterInMs, redirectTo } = modifiers;
                    if (errorToThrow) {
                        strategyLogger.error(`Retry ${retryCount}: Retry strategy ${strategy.name} throws error:`, errorToThrow);
                        throw errorToThrow;
                    }
                    if (retryAfterInMs || retryAfterInMs === 0) {
                        strategyLogger.info(`Retry ${retryCount}: Retry strategy ${strategy.name} retries after ${retryAfterInMs}`);
                        await (0,_util_helpers_js__WEBPACK_IMPORTED_MODULE_0__.delay)(retryAfterInMs, undefined, { abortSignal: request.abortSignal });
                        continue retryRequest;
                    }
                    if (redirectTo) {
                        strategyLogger.info(`Retry ${retryCount}: Retry strategy ${strategy.name} redirects to ${redirectTo}`);
                        request.url = redirectTo;
                        continue retryRequest;
                    }
                }
                if (responseError) {
                    logger.info(`None of the retry strategies could work with the received error. Throwing it.`);
                    throw responseError;
                }
                if (response) {
                    logger.info(`None of the retry strategies could work with the received response. Returning it.`);
                    return response;
                }
                // If all the retries skip and there's no response,
                // we're still in the retry loop, so a new request will be sent
                // until `maxRetries` is reached.
            }
        },
    };
}
//# sourceMappingURL=retryPolicy.js.map

/***/ }),

/***/ "./node_modules/@azure/core-rest-pipeline/dist/browser/policies/setClientRequestIdPolicy.js":
/*!**************************************************************************************************!*\
  !*** ./node_modules/@azure/core-rest-pipeline/dist/browser/policies/setClientRequestIdPolicy.js ***!
  \**************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   setClientRequestIdPolicy: () => (/* binding */ setClientRequestIdPolicy),
/* harmony export */   setClientRequestIdPolicyName: () => (/* binding */ setClientRequestIdPolicyName)
/* harmony export */ });
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/**
 * The programmatic identifier of the setClientRequestIdPolicy.
 */
const setClientRequestIdPolicyName = "setClientRequestIdPolicy";
/**
 * Each PipelineRequest gets a unique id upon creation.
 * This policy passes that unique id along via an HTTP header to enable better
 * telemetry and tracing.
 * @param requestIdHeaderName - The name of the header to pass the request ID to.
 */
function setClientRequestIdPolicy(requestIdHeaderName = "x-ms-client-request-id") {
    return {
        name: setClientRequestIdPolicyName,
        async sendRequest(request, next) {
            if (!request.headers.has(requestIdHeaderName)) {
                request.headers.set(requestIdHeaderName, request.requestId);
            }
            return next(request);
        },
    };
}
//# sourceMappingURL=setClientRequestIdPolicy.js.map

/***/ }),

/***/ "./node_modules/@azure/core-rest-pipeline/dist/browser/policies/systemErrorRetryPolicy.js":
/*!************************************************************************************************!*\
  !*** ./node_modules/@azure/core-rest-pipeline/dist/browser/policies/systemErrorRetryPolicy.js ***!
  \************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   systemErrorRetryPolicy: () => (/* binding */ systemErrorRetryPolicy),
/* harmony export */   systemErrorRetryPolicyName: () => (/* binding */ systemErrorRetryPolicyName)
/* harmony export */ });
/* harmony import */ var _retryStrategies_exponentialRetryStrategy_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../retryStrategies/exponentialRetryStrategy.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/retryStrategies/exponentialRetryStrategy.js");
/* harmony import */ var _retryPolicy_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./retryPolicy.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/policies/retryPolicy.js");
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../constants.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/constants.js");
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.



/**
 * Name of the {@link systemErrorRetryPolicy}
 */
const systemErrorRetryPolicyName = "systemErrorRetryPolicy";
/**
 * A retry policy that specifically seeks to handle errors in the
 * underlying transport layer (e.g. DNS lookup failures) rather than
 * retryable error codes from the server itself.
 * @param options - Options that customize the policy.
 */
function systemErrorRetryPolicy(options = {}) {
    var _a;
    return {
        name: systemErrorRetryPolicyName,
        sendRequest: (0,_retryPolicy_js__WEBPACK_IMPORTED_MODULE_1__.retryPolicy)([
            (0,_retryStrategies_exponentialRetryStrategy_js__WEBPACK_IMPORTED_MODULE_0__.exponentialRetryStrategy)(Object.assign(Object.assign({}, options), { ignoreHttpStatusCodes: true })),
        ], {
            maxRetries: (_a = options.maxRetries) !== null && _a !== void 0 ? _a : _constants_js__WEBPACK_IMPORTED_MODULE_2__.DEFAULT_RETRY_POLICY_COUNT,
        }).sendRequest,
    };
}
//# sourceMappingURL=systemErrorRetryPolicy.js.map

/***/ }),

/***/ "./node_modules/@azure/core-rest-pipeline/dist/browser/policies/throttlingRetryPolicy.js":
/*!***********************************************************************************************!*\
  !*** ./node_modules/@azure/core-rest-pipeline/dist/browser/policies/throttlingRetryPolicy.js ***!
  \***********************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   throttlingRetryPolicy: () => (/* binding */ throttlingRetryPolicy),
/* harmony export */   throttlingRetryPolicyName: () => (/* binding */ throttlingRetryPolicyName)
/* harmony export */ });
/* harmony import */ var _retryStrategies_throttlingRetryStrategy_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../retryStrategies/throttlingRetryStrategy.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/retryStrategies/throttlingRetryStrategy.js");
/* harmony import */ var _retryPolicy_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./retryPolicy.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/policies/retryPolicy.js");
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../constants.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/constants.js");
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.



/**
 * Name of the {@link throttlingRetryPolicy}
 */
const throttlingRetryPolicyName = "throttlingRetryPolicy";
/**
 * A policy that retries when the server sends a 429 response with a Retry-After header.
 *
 * To learn more, please refer to
 * https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-manager-request-limits,
 * https://docs.microsoft.com/en-us/azure/azure-subscription-service-limits and
 * https://docs.microsoft.com/en-us/azure/virtual-machines/troubleshooting/troubleshooting-throttling-errors
 *
 * @param options - Options that configure retry logic.
 */
function throttlingRetryPolicy(options = {}) {
    var _a;
    return {
        name: throttlingRetryPolicyName,
        sendRequest: (0,_retryPolicy_js__WEBPACK_IMPORTED_MODULE_1__.retryPolicy)([(0,_retryStrategies_throttlingRetryStrategy_js__WEBPACK_IMPORTED_MODULE_0__.throttlingRetryStrategy)()], {
            maxRetries: (_a = options.maxRetries) !== null && _a !== void 0 ? _a : _constants_js__WEBPACK_IMPORTED_MODULE_2__.DEFAULT_RETRY_POLICY_COUNT,
        }).sendRequest,
    };
}
//# sourceMappingURL=throttlingRetryPolicy.js.map

/***/ }),

/***/ "./node_modules/@azure/core-rest-pipeline/dist/browser/policies/tlsPolicy.js":
/*!***********************************************************************************!*\
  !*** ./node_modules/@azure/core-rest-pipeline/dist/browser/policies/tlsPolicy.js ***!
  \***********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   tlsPolicy: () => (/* binding */ tlsPolicy),
/* harmony export */   tlsPolicyName: () => (/* binding */ tlsPolicyName)
/* harmony export */ });
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/**
 * Name of the TLS Policy
 */
const tlsPolicyName = "tlsPolicy";
/**
 * Gets a pipeline policy that adds the client certificate to the HttpClient agent for authentication.
 */
function tlsPolicy(tlsSettings) {
    return {
        name: tlsPolicyName,
        sendRequest: async (req, next) => {
            // Users may define a request tlsSettings, honor those over the client level one
            if (!req.tlsSettings) {
                req.tlsSettings = tlsSettings;
            }
            return next(req);
        },
    };
}
//# sourceMappingURL=tlsPolicy.js.map

/***/ }),

/***/ "./node_modules/@azure/core-rest-pipeline/dist/browser/policies/tracingPolicy.js":
/*!***************************************************************************************!*\
  !*** ./node_modules/@azure/core-rest-pipeline/dist/browser/policies/tracingPolicy.js ***!
  \***************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   tracingPolicy: () => (/* binding */ tracingPolicy),
/* harmony export */   tracingPolicyName: () => (/* binding */ tracingPolicyName)
/* harmony export */ });
/* harmony import */ var _azure_core_tracing__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @azure/core-tracing */ "./node_modules/@azure/core-tracing/dist/browser/index.js");
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../constants.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/constants.js");
/* harmony import */ var _util_userAgent_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../util/userAgent.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/util/userAgent.js");
/* harmony import */ var _log_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../log.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/log.js");
/* harmony import */ var _azure_core_util__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @azure/core-util */ "./node_modules/@azure/core-util/dist/browser/index.js");
/* harmony import */ var _restError_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../restError.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/restError.js");
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.






/**
 * The programmatic identifier of the tracingPolicy.
 */
const tracingPolicyName = "tracingPolicy";
/**
 * A simple policy to create OpenTelemetry Spans for each request made by the pipeline
 * that has SpanOptions with a parent.
 * Requests made without a parent Span will not be recorded.
 * @param options - Options to configure the telemetry logged by the tracing policy.
 */
function tracingPolicy(options = {}) {
    const userAgent = (0,_util_userAgent_js__WEBPACK_IMPORTED_MODULE_2__.getUserAgentValue)(options.userAgentPrefix);
    const tracingClient = tryCreateTracingClient();
    return {
        name: tracingPolicyName,
        async sendRequest(request, next) {
            var _a, _b;
            if (!tracingClient || !((_a = request.tracingOptions) === null || _a === void 0 ? void 0 : _a.tracingContext)) {
                return next(request);
            }
            const { span, tracingContext } = (_b = tryCreateSpan(tracingClient, request, userAgent)) !== null && _b !== void 0 ? _b : {};
            if (!span || !tracingContext) {
                return next(request);
            }
            try {
                const response = await tracingClient.withContext(tracingContext, next, request);
                tryProcessResponse(span, response);
                return response;
            }
            catch (err) {
                tryProcessError(span, err);
                throw err;
            }
        },
    };
}
function tryCreateTracingClient() {
    try {
        return (0,_azure_core_tracing__WEBPACK_IMPORTED_MODULE_0__.createTracingClient)({
            namespace: "",
            packageName: "@azure/core-rest-pipeline",
            packageVersion: _constants_js__WEBPACK_IMPORTED_MODULE_1__.SDK_VERSION,
        });
    }
    catch (e) {
        _log_js__WEBPACK_IMPORTED_MODULE_3__.logger.warning(`Error when creating the TracingClient: ${(0,_azure_core_util__WEBPACK_IMPORTED_MODULE_4__.getErrorMessage)(e)}`);
        return undefined;
    }
}
function tryCreateSpan(tracingClient, request, userAgent) {
    try {
        // As per spec, we do not need to differentiate between HTTP and HTTPS in span name.
        const { span, updatedOptions } = tracingClient.startSpan(`HTTP ${request.method}`, { tracingOptions: request.tracingOptions }, {
            spanKind: "client",
            spanAttributes: {
                "http.method": request.method,
                "http.url": request.url,
                requestId: request.requestId,
            },
        });
        // If the span is not recording, don't do any more work.
        if (!span.isRecording()) {
            span.end();
            return undefined;
        }
        if (userAgent) {
            span.setAttribute("http.user_agent", userAgent);
        }
        // set headers
        const headers = tracingClient.createRequestHeaders(updatedOptions.tracingOptions.tracingContext);
        for (const [key, value] of Object.entries(headers)) {
            request.headers.set(key, value);
        }
        return { span, tracingContext: updatedOptions.tracingOptions.tracingContext };
    }
    catch (e) {
        _log_js__WEBPACK_IMPORTED_MODULE_3__.logger.warning(`Skipping creating a tracing span due to an error: ${(0,_azure_core_util__WEBPACK_IMPORTED_MODULE_4__.getErrorMessage)(e)}`);
        return undefined;
    }
}
function tryProcessError(span, error) {
    try {
        span.setStatus({
            status: "error",
            error: (0,_azure_core_util__WEBPACK_IMPORTED_MODULE_4__.isError)(error) ? error : undefined,
        });
        if ((0,_restError_js__WEBPACK_IMPORTED_MODULE_5__.isRestError)(error) && error.statusCode) {
            span.setAttribute("http.status_code", error.statusCode);
        }
        span.end();
    }
    catch (e) {
        _log_js__WEBPACK_IMPORTED_MODULE_3__.logger.warning(`Skipping tracing span processing due to an error: ${(0,_azure_core_util__WEBPACK_IMPORTED_MODULE_4__.getErrorMessage)(e)}`);
    }
}
function tryProcessResponse(span, response) {
    try {
        span.setAttribute("http.status_code", response.status);
        const serviceRequestId = response.headers.get("x-ms-request-id");
        if (serviceRequestId) {
            span.setAttribute("serviceRequestId", serviceRequestId);
        }
        span.setStatus({
            status: "success",
        });
        span.end();
    }
    catch (e) {
        _log_js__WEBPACK_IMPORTED_MODULE_3__.logger.warning(`Skipping tracing span processing due to an error: ${(0,_azure_core_util__WEBPACK_IMPORTED_MODULE_4__.getErrorMessage)(e)}`);
    }
}
//# sourceMappingURL=tracingPolicy.js.map

/***/ }),

/***/ "./node_modules/@azure/core-rest-pipeline/dist/browser/policies/userAgentPolicy.js":
/*!*****************************************************************************************!*\
  !*** ./node_modules/@azure/core-rest-pipeline/dist/browser/policies/userAgentPolicy.js ***!
  \*****************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   userAgentPolicy: () => (/* binding */ userAgentPolicy),
/* harmony export */   userAgentPolicyName: () => (/* binding */ userAgentPolicyName)
/* harmony export */ });
/* harmony import */ var _util_userAgent_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/userAgent.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/util/userAgent.js");
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

const UserAgentHeaderName = (0,_util_userAgent_js__WEBPACK_IMPORTED_MODULE_0__.getUserAgentHeaderName)();
/**
 * The programmatic identifier of the userAgentPolicy.
 */
const userAgentPolicyName = "userAgentPolicy";
/**
 * A policy that sets the User-Agent header (or equivalent) to reflect
 * the library version.
 * @param options - Options to customize the user agent value.
 */
function userAgentPolicy(options = {}) {
    const userAgentValue = (0,_util_userAgent_js__WEBPACK_IMPORTED_MODULE_0__.getUserAgentValue)(options.userAgentPrefix);
    return {
        name: userAgentPolicyName,
        async sendRequest(request, next) {
            if (!request.headers.has(UserAgentHeaderName)) {
                request.headers.set(UserAgentHeaderName, userAgentValue);
            }
            return next(request);
        },
    };
}
//# sourceMappingURL=userAgentPolicy.js.map

/***/ }),

/***/ "./node_modules/@azure/core-rest-pipeline/dist/browser/restError.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@azure/core-rest-pipeline/dist/browser/restError.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RestError: () => (/* binding */ RestError),
/* harmony export */   isRestError: () => (/* binding */ isRestError)
/* harmony export */ });
/* harmony import */ var _azure_core_util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @azure/core-util */ "./node_modules/@azure/core-util/dist/browser/index.js");
/* harmony import */ var _util_inspect_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util/inspect.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/util/inspect.js");
/* harmony import */ var _util_sanitizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./util/sanitizer.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/util/sanitizer.js");
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.



const errorSanitizer = new _util_sanitizer_js__WEBPACK_IMPORTED_MODULE_2__.Sanitizer();
/**
 * A custom error type for failed pipeline requests.
 */
class RestError extends Error {
    constructor(message, options = {}) {
        super(message);
        this.name = "RestError";
        this.code = options.code;
        this.statusCode = options.statusCode;
        this.request = options.request;
        this.response = options.response;
        Object.setPrototypeOf(this, RestError.prototype);
    }
    /**
     * Logging method for util.inspect in Node
     */
    [_util_inspect_js__WEBPACK_IMPORTED_MODULE_1__.custom]() {
        return `RestError: ${this.message} \n ${errorSanitizer.sanitize(this)}`;
    }
}
/**
 * Something went wrong when making the request.
 * This means the actual request failed for some reason,
 * such as a DNS issue or the connection being lost.
 */
RestError.REQUEST_SEND_ERROR = "REQUEST_SEND_ERROR";
/**
 * This means that parsing the response from the server failed.
 * It may have been malformed.
 */
RestError.PARSE_ERROR = "PARSE_ERROR";
/**
 * Typeguard for RestError
 * @param e - Something caught by a catch clause.
 */
function isRestError(e) {
    if (e instanceof RestError) {
        return true;
    }
    return (0,_azure_core_util__WEBPACK_IMPORTED_MODULE_0__.isError)(e) && e.name === "RestError";
}
//# sourceMappingURL=restError.js.map

/***/ }),

/***/ "./node_modules/@azure/core-rest-pipeline/dist/browser/retryStrategies/exponentialRetryStrategy.js":
/*!*********************************************************************************************************!*\
  !*** ./node_modules/@azure/core-rest-pipeline/dist/browser/retryStrategies/exponentialRetryStrategy.js ***!
  \*********************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   exponentialRetryStrategy: () => (/* binding */ exponentialRetryStrategy),
/* harmony export */   isExponentialRetryResponse: () => (/* binding */ isExponentialRetryResponse),
/* harmony export */   isSystemError: () => (/* binding */ isSystemError)
/* harmony export */ });
/* harmony import */ var _azure_core_util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @azure/core-util */ "./node_modules/@azure/core-util/dist/browser/index.js");
/* harmony import */ var _throttlingRetryStrategy_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./throttlingRetryStrategy.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/retryStrategies/throttlingRetryStrategy.js");
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.


// intervals are in milliseconds
const DEFAULT_CLIENT_RETRY_INTERVAL = 1000;
const DEFAULT_CLIENT_MAX_RETRY_INTERVAL = 1000 * 64;
/**
 * A retry strategy that retries with an exponentially increasing delay in these two cases:
 * - When there are errors in the underlying transport layer (e.g. DNS lookup failures).
 * - Or otherwise if the outgoing request fails (408, greater or equal than 500, except for 501 and 505).
 */
function exponentialRetryStrategy(options = {}) {
    var _a, _b;
    const retryInterval = (_a = options.retryDelayInMs) !== null && _a !== void 0 ? _a : DEFAULT_CLIENT_RETRY_INTERVAL;
    const maxRetryInterval = (_b = options.maxRetryDelayInMs) !== null && _b !== void 0 ? _b : DEFAULT_CLIENT_MAX_RETRY_INTERVAL;
    let retryAfterInMs = retryInterval;
    return {
        name: "exponentialRetryStrategy",
        retry({ retryCount, response, responseError }) {
            const matchedSystemError = isSystemError(responseError);
            const ignoreSystemErrors = matchedSystemError && options.ignoreSystemErrors;
            const isExponential = isExponentialRetryResponse(response);
            const ignoreExponentialResponse = isExponential && options.ignoreHttpStatusCodes;
            const unknownResponse = response && ((0,_throttlingRetryStrategy_js__WEBPACK_IMPORTED_MODULE_1__.isThrottlingRetryResponse)(response) || !isExponential);
            if (unknownResponse || ignoreExponentialResponse || ignoreSystemErrors) {
                return { skipStrategy: true };
            }
            if (responseError && !matchedSystemError && !isExponential) {
                return { errorToThrow: responseError };
            }
            // Exponentially increase the delay each time
            const exponentialDelay = retryAfterInMs * Math.pow(2, retryCount);
            // Don't let the delay exceed the maximum
            const clampedExponentialDelay = Math.min(maxRetryInterval, exponentialDelay);
            // Allow the final value to have some "jitter" (within 50% of the delay size) so
            // that retries across multiple clients don't occur simultaneously.
            retryAfterInMs =
                clampedExponentialDelay / 2 + (0,_azure_core_util__WEBPACK_IMPORTED_MODULE_0__.getRandomIntegerInclusive)(0, clampedExponentialDelay / 2);
            return { retryAfterInMs };
        },
    };
}
/**
 * A response is a retry response if it has status codes:
 * - 408, or
 * - Greater or equal than 500, except for 501 and 505.
 */
function isExponentialRetryResponse(response) {
    return Boolean(response &&
        response.status !== undefined &&
        (response.status >= 500 || response.status === 408) &&
        response.status !== 501 &&
        response.status !== 505);
}
/**
 * Determines whether an error from a pipeline response was triggered in the network layer.
 */
function isSystemError(err) {
    if (!err) {
        return false;
    }
    return (err.code === "ETIMEDOUT" ||
        err.code === "ESOCKETTIMEDOUT" ||
        err.code === "ECONNREFUSED" ||
        err.code === "ECONNRESET" ||
        err.code === "ENOENT" ||
        err.code === "ENOTFOUND");
}
//# sourceMappingURL=exponentialRetryStrategy.js.map

/***/ }),

/***/ "./node_modules/@azure/core-rest-pipeline/dist/browser/retryStrategies/throttlingRetryStrategy.js":
/*!********************************************************************************************************!*\
  !*** ./node_modules/@azure/core-rest-pipeline/dist/browser/retryStrategies/throttlingRetryStrategy.js ***!
  \********************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isThrottlingRetryResponse: () => (/* binding */ isThrottlingRetryResponse),
/* harmony export */   throttlingRetryStrategy: () => (/* binding */ throttlingRetryStrategy)
/* harmony export */ });
/* harmony import */ var _util_helpers_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/helpers.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/util/helpers.js");
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * The header that comes back from Azure services representing
 * the amount of time (minimum) to wait to retry (in seconds or timestamp after which we can retry).
 */
const RetryAfterHeader = "Retry-After";
/**
 * The headers that come back from Azure services representing
 * the amount of time (minimum) to wait to retry.
 *
 * "retry-after-ms", "x-ms-retry-after-ms" : milliseconds
 * "Retry-After" : seconds or timestamp
 */
const AllRetryAfterHeaders = ["retry-after-ms", "x-ms-retry-after-ms", RetryAfterHeader];
/**
 * A response is a throttling retry response if it has a throttling status code (429 or 503),
 * as long as one of the [ "Retry-After" or "retry-after-ms" or "x-ms-retry-after-ms" ] headers has a valid value.
 *
 * Returns the `retryAfterInMs` value if the response is a throttling retry response.
 * If not throttling retry response, returns `undefined`.
 *
 * @internal
 */
function getRetryAfterInMs(response) {
    if (!(response && [429, 503].includes(response.status)))
        return undefined;
    try {
        // Headers: "retry-after-ms", "x-ms-retry-after-ms", "Retry-After"
        for (const header of AllRetryAfterHeaders) {
            const retryAfterValue = (0,_util_helpers_js__WEBPACK_IMPORTED_MODULE_0__.parseHeaderValueAsNumber)(response, header);
            if (retryAfterValue === 0 || retryAfterValue) {
                // "Retry-After" header ==> seconds
                // "retry-after-ms", "x-ms-retry-after-ms" headers ==> milli-seconds
                const multiplyingFactor = header === RetryAfterHeader ? 1000 : 1;
                return retryAfterValue * multiplyingFactor; // in milli-seconds
            }
        }
        // RetryAfterHeader ("Retry-After") has a special case where it might be formatted as a date instead of a number of seconds
        const retryAfterHeader = response.headers.get(RetryAfterHeader);
        if (!retryAfterHeader)
            return;
        const date = Date.parse(retryAfterHeader);
        const diff = date - Date.now();
        // negative diff would mean a date in the past, so retry asap with 0 milliseconds
        return Number.isFinite(diff) ? Math.max(0, diff) : undefined;
    }
    catch (e) {
        return undefined;
    }
}
/**
 * A response is a retry response if it has a throttling status code (429 or 503),
 * as long as one of the [ "Retry-After" or "retry-after-ms" or "x-ms-retry-after-ms" ] headers has a valid value.
 */
function isThrottlingRetryResponse(response) {
    return Number.isFinite(getRetryAfterInMs(response));
}
function throttlingRetryStrategy() {
    return {
        name: "throttlingRetryStrategy",
        retry({ response }) {
            const retryAfterInMs = getRetryAfterInMs(response);
            if (!Number.isFinite(retryAfterInMs)) {
                return { skipStrategy: true };
            }
            return {
                retryAfterInMs,
            };
        },
    };
}
//# sourceMappingURL=throttlingRetryStrategy.js.map

/***/ }),

/***/ "./node_modules/@azure/core-rest-pipeline/dist/browser/util/concat.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@azure/core-rest-pipeline/dist/browser/util/concat.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   concat: () => (/* binding */ concat)
/* harmony export */ });
/* harmony import */ var _file_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./file.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/util/file.js");
/* harmony import */ var _typeGuards_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./typeGuards.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/util/typeGuards.js");
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.


/**
 * Drain the content of the given ReadableStream into a Blob.
 * The blob's content may end up in memory or on disk dependent on size.
 */
function drain(stream) {
    return new Response(stream).blob();
}
async function toBlobPart(source) {
    if (source instanceof Blob || source instanceof Uint8Array) {
        return source;
    }
    if ((0,_typeGuards_js__WEBPACK_IMPORTED_MODULE_1__.isWebReadableStream)(source)) {
        return drain(source);
    }
    // If it's not a true Blob, and it's not a Uint8Array, we can assume the source
    // is a fake File created by createFileFromStream and we can get the original stream
    // using getRawContent.
    const rawContent = (0,_file_js__WEBPACK_IMPORTED_MODULE_0__.getRawContent)(source);
    // Shouldn't happen but guard for it anyway
    if ((0,_typeGuards_js__WEBPACK_IMPORTED_MODULE_1__.isNodeReadableStream)(rawContent)) {
        throw new Error("Encountered unexpected type. In the browser, `concat` supports Web ReadableStream, Blob, Uint8Array, and files created using `createFile` only.");
    }
    return toBlobPart(rawContent);
}
/**
 * Utility function that concatenates a set of binary inputs into one combined output.
 *
 * @param sources - array of sources for the concatenation
 * @returns - in Node, a (() =\> NodeJS.ReadableStream) which, when read, produces a concatenation of all the inputs.
 *           In browser, returns a `Blob` representing all the concatenated inputs.
 *
 * @internal
 */
async function concat(sources) {
    const parts = [];
    for (const source of sources) {
        parts.push(await toBlobPart(typeof source === "function" ? source() : source));
    }
    return new Blob(parts);
}
//# sourceMappingURL=concat-browser.mjs.map

/***/ }),

/***/ "./node_modules/@azure/core-rest-pipeline/dist/browser/util/file.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@azure/core-rest-pipeline/dist/browser/util/file.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createFile: () => (/* binding */ createFile),
/* harmony export */   createFileFromStream: () => (/* binding */ createFileFromStream),
/* harmony export */   getRawContent: () => (/* binding */ getRawContent)
/* harmony export */ });
/* harmony import */ var _azure_core_util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @azure/core-util */ "./node_modules/@azure/core-util/dist/browser/index.js");
/* harmony import */ var _typeGuards_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./typeGuards.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/util/typeGuards.js");
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.


const unimplementedMethods = {
    arrayBuffer: () => {
        throw new Error("Not implemented");
    },
    slice: () => {
        throw new Error("Not implemented");
    },
    text: () => {
        throw new Error("Not implemented");
    },
};
/**
 * Private symbol used as key on objects created using createFile containing the
 * original source of the file object.
 *
 * This is used in Node to access the original Node stream without using Blob#stream, which
 * returns a web stream. This is done to avoid a couple of bugs to do with Blob#stream and
 * Readable#to/fromWeb in Node versions we support:
 * - https://github.com/nodejs/node/issues/42694 (fixed in Node 18.14)
 * - https://github.com/nodejs/node/issues/48916 (fixed in Node 20.6)
 *
 * Once these versions are no longer supported, we may be able to stop doing this.
 *
 * @internal
 */
const rawContent = Symbol("rawContent");
function hasRawContent(x) {
    return typeof x[rawContent] === "function";
}
/**
 * Extract the raw content from a given blob-like object. If the input was created using createFile
 * or createFileFromStream, the exact content passed into createFile/createFileFromStream will be used.
 * For true instances of Blob and File, returns the blob's content as a Web ReadableStream<Uint8Array>.
 *
 * @internal
 */
function getRawContent(blob) {
    if (hasRawContent(blob)) {
        return blob[rawContent]();
    }
    else {
        return blob.stream();
    }
}
/**
 * Create an object that implements the File interface. This object is intended to be
 * passed into RequestBodyType.formData, and is not guaranteed to work as expected in
 * other situations.
 *
 * Use this function to:
 * - Create a File object for use in RequestBodyType.formData in environments where the
 *   global File object is unavailable.
 * - Create a File-like object from a readable stream without reading the stream into memory.
 *
 * @param stream - the content of the file as a callback returning a stream. When a File object made using createFile is
 *                  passed in a request's form data map, the stream will not be read into memory
 *                  and instead will be streamed when the request is made. In the event of a retry, the
 *                  stream needs to be read again, so this callback SHOULD return a fresh stream if possible.
 * @param name - the name of the file.
 * @param options - optional metadata about the file, e.g. file name, file size, MIME type.
 */
function createFileFromStream(stream, name, options = {}) {
    var _a, _b, _c, _d;
    return Object.assign(Object.assign({}, unimplementedMethods), { type: (_a = options.type) !== null && _a !== void 0 ? _a : "", lastModified: (_b = options.lastModified) !== null && _b !== void 0 ? _b : new Date().getTime(), webkitRelativePath: (_c = options.webkitRelativePath) !== null && _c !== void 0 ? _c : "", size: (_d = options.size) !== null && _d !== void 0 ? _d : -1, name, stream: () => {
            const s = stream();
            if ((0,_typeGuards_js__WEBPACK_IMPORTED_MODULE_1__.isNodeReadableStream)(s)) {
                throw new Error("Not supported: a Node stream was provided as input to createFileFromStream.");
            }
            return s;
        }, [rawContent]: stream });
}
/**
 * Create an object that implements the File interface. This object is intended to be
 * passed into RequestBodyType.formData, and is not guaranteed to work as expected in
 * other situations.
 *
 * Use this function create a File object for use in RequestBodyType.formData in environments where the global File object is unavailable.
 *
 * @param content - the content of the file as a Uint8Array in memory.
 * @param name - the name of the file.
 * @param options - optional metadata about the file, e.g. file name, file size, MIME type.
 */
function createFile(content, name, options = {}) {
    var _a, _b, _c;
    if (_azure_core_util__WEBPACK_IMPORTED_MODULE_0__.isNodeLike) {
        return Object.assign(Object.assign({}, unimplementedMethods), { type: (_a = options.type) !== null && _a !== void 0 ? _a : "", lastModified: (_b = options.lastModified) !== null && _b !== void 0 ? _b : new Date().getTime(), webkitRelativePath: (_c = options.webkitRelativePath) !== null && _c !== void 0 ? _c : "", size: content.byteLength, name, arrayBuffer: async () => content.buffer, stream: () => new Blob([content]).stream(), [rawContent]: () => content });
    }
    else {
        return new File([content], name, options);
    }
}
//# sourceMappingURL=file.js.map

/***/ }),

/***/ "./node_modules/@azure/core-rest-pipeline/dist/browser/util/helpers.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/@azure/core-rest-pipeline/dist/browser/util/helpers.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   delay: () => (/* binding */ delay),
/* harmony export */   parseHeaderValueAsNumber: () => (/* binding */ parseHeaderValueAsNumber)
/* harmony export */ });
/* harmony import */ var _azure_abort_controller__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @azure/abort-controller */ "./node_modules/@azure/abort-controller/dist/browser/index.js");
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

const StandardAbortMessage = "The operation was aborted.";
/**
 * A wrapper for setTimeout that resolves a promise after delayInMs milliseconds.
 * @param delayInMs - The number of milliseconds to be delayed.
 * @param value - The value to be resolved with after a timeout of t milliseconds.
 * @param options - The options for delay - currently abort options
 *                  - abortSignal - The abortSignal associated with containing operation.
 *                  - abortErrorMsg - The abort error message associated with containing operation.
 * @returns Resolved promise
 */
function delay(delayInMs, value, options) {
    return new Promise((resolve, reject) => {
        let timer = undefined;
        let onAborted = undefined;
        const rejectOnAbort = () => {
            return reject(new _azure_abort_controller__WEBPACK_IMPORTED_MODULE_0__.AbortError((options === null || options === void 0 ? void 0 : options.abortErrorMsg) ? options === null || options === void 0 ? void 0 : options.abortErrorMsg : StandardAbortMessage));
        };
        const removeListeners = () => {
            if ((options === null || options === void 0 ? void 0 : options.abortSignal) && onAborted) {
                options.abortSignal.removeEventListener("abort", onAborted);
            }
        };
        onAborted = () => {
            if (timer) {
                clearTimeout(timer);
            }
            removeListeners();
            return rejectOnAbort();
        };
        if ((options === null || options === void 0 ? void 0 : options.abortSignal) && options.abortSignal.aborted) {
            return rejectOnAbort();
        }
        timer = setTimeout(() => {
            removeListeners();
            resolve(value);
        }, delayInMs);
        if (options === null || options === void 0 ? void 0 : options.abortSignal) {
            options.abortSignal.addEventListener("abort", onAborted);
        }
    });
}
/**
 * @internal
 * @returns the parsed value or undefined if the parsed value is invalid.
 */
function parseHeaderValueAsNumber(response, headerName) {
    const value = response.headers.get(headerName);
    if (!value)
        return;
    const valueAsNum = Number(value);
    if (Number.isNaN(valueAsNum))
        return;
    return valueAsNum;
}
//# sourceMappingURL=helpers.js.map

/***/ }),

/***/ "./node_modules/@azure/core-rest-pipeline/dist/browser/util/inspect.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/@azure/core-rest-pipeline/dist/browser/util/inspect.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   custom: () => (/* binding */ custom)
/* harmony export */ });
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
const custom = {};
//# sourceMappingURL=inspect-browser.mjs.map

/***/ }),

/***/ "./node_modules/@azure/core-rest-pipeline/dist/browser/util/sanitizer.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@azure/core-rest-pipeline/dist/browser/util/sanitizer.js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Sanitizer: () => (/* binding */ Sanitizer)
/* harmony export */ });
/* harmony import */ var _azure_core_util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @azure/core-util */ "./node_modules/@azure/core-util/dist/browser/index.js");
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

const RedactedString = "REDACTED";
// Make sure this list is up-to-date with the one under core/logger/Readme#Keyconcepts
const defaultAllowedHeaderNames = [
    "x-ms-client-request-id",
    "x-ms-return-client-request-id",
    "x-ms-useragent",
    "x-ms-correlation-request-id",
    "x-ms-request-id",
    "client-request-id",
    "ms-cv",
    "return-client-request-id",
    "traceparent",
    "Access-Control-Allow-Credentials",
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Methods",
    "Access-Control-Allow-Origin",
    "Access-Control-Expose-Headers",
    "Access-Control-Max-Age",
    "Access-Control-Request-Headers",
    "Access-Control-Request-Method",
    "Origin",
    "Accept",
    "Accept-Encoding",
    "Cache-Control",
    "Connection",
    "Content-Length",
    "Content-Type",
    "Date",
    "ETag",
    "Expires",
    "If-Match",
    "If-Modified-Since",
    "If-None-Match",
    "If-Unmodified-Since",
    "Last-Modified",
    "Pragma",
    "Request-Id",
    "Retry-After",
    "Server",
    "Transfer-Encoding",
    "User-Agent",
    "WWW-Authenticate",
];
const defaultAllowedQueryParameters = ["api-version"];
/**
 * @internal
 */
class Sanitizer {
    constructor({ additionalAllowedHeaderNames: allowedHeaderNames = [], additionalAllowedQueryParameters: allowedQueryParameters = [], } = {}) {
        allowedHeaderNames = defaultAllowedHeaderNames.concat(allowedHeaderNames);
        allowedQueryParameters = defaultAllowedQueryParameters.concat(allowedQueryParameters);
        this.allowedHeaderNames = new Set(allowedHeaderNames.map((n) => n.toLowerCase()));
        this.allowedQueryParameters = new Set(allowedQueryParameters.map((p) => p.toLowerCase()));
    }
    sanitize(obj) {
        const seen = new Set();
        return JSON.stringify(obj, (key, value) => {
            // Ensure Errors include their interesting non-enumerable members
            if (value instanceof Error) {
                return Object.assign(Object.assign({}, value), { name: value.name, message: value.message });
            }
            if (key === "headers") {
                return this.sanitizeHeaders(value);
            }
            else if (key === "url") {
                return this.sanitizeUrl(value);
            }
            else if (key === "query") {
                return this.sanitizeQuery(value);
            }
            else if (key === "body") {
                // Don't log the request body
                return undefined;
            }
            else if (key === "response") {
                // Don't log response again
                return undefined;
            }
            else if (key === "operationSpec") {
                // When using sendOperationRequest, the request carries a massive
                // field with the autorest spec. No need to log it.
                return undefined;
            }
            else if (Array.isArray(value) || (0,_azure_core_util__WEBPACK_IMPORTED_MODULE_0__.isObject)(value)) {
                if (seen.has(value)) {
                    return "[Circular]";
                }
                seen.add(value);
            }
            return value;
        }, 2);
    }
    sanitizeHeaders(obj) {
        const sanitized = {};
        for (const key of Object.keys(obj)) {
            if (this.allowedHeaderNames.has(key.toLowerCase())) {
                sanitized[key] = obj[key];
            }
            else {
                sanitized[key] = RedactedString;
            }
        }
        return sanitized;
    }
    sanitizeQuery(value) {
        if (typeof value !== "object" || value === null) {
            return value;
        }
        const sanitized = {};
        for (const k of Object.keys(value)) {
            if (this.allowedQueryParameters.has(k.toLowerCase())) {
                sanitized[k] = value[k];
            }
            else {
                sanitized[k] = RedactedString;
            }
        }
        return sanitized;
    }
    sanitizeUrl(value) {
        if (typeof value !== "string" || value === null) {
            return value;
        }
        const url = new URL(value);
        if (!url.search) {
            return value;
        }
        for (const [key] of url.searchParams) {
            if (!this.allowedQueryParameters.has(key.toLowerCase())) {
                url.searchParams.set(key, RedactedString);
            }
        }
        return url.toString();
    }
}
//# sourceMappingURL=sanitizer.js.map

/***/ }),

/***/ "./node_modules/@azure/core-rest-pipeline/dist/browser/util/tokenCycler.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/@azure/core-rest-pipeline/dist/browser/util/tokenCycler.js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DEFAULT_CYCLER_OPTIONS: () => (/* binding */ DEFAULT_CYCLER_OPTIONS),
/* harmony export */   createTokenCycler: () => (/* binding */ createTokenCycler)
/* harmony export */ });
/* harmony import */ var _helpers_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helpers.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/util/helpers.js");
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

// Default options for the cycler if none are provided
const DEFAULT_CYCLER_OPTIONS = {
    forcedRefreshWindowInMs: 1000, // Force waiting for a refresh 1s before the token expires
    retryIntervalInMs: 3000, // Allow refresh attempts every 3s
    refreshWindowInMs: 1000 * 60 * 2, // Start refreshing 2m before expiry
};
/**
 * Converts an an unreliable access token getter (which may resolve with null)
 * into an AccessTokenGetter by retrying the unreliable getter in a regular
 * interval.
 *
 * @param getAccessToken - A function that produces a promise of an access token that may fail by returning null.
 * @param retryIntervalInMs - The time (in milliseconds) to wait between retry attempts.
 * @param refreshTimeout - The timestamp after which the refresh attempt will fail, throwing an exception.
 * @returns - A promise that, if it resolves, will resolve with an access token.
 */
async function beginRefresh(getAccessToken, retryIntervalInMs, refreshTimeout) {
    // This wrapper handles exceptions gracefully as long as we haven't exceeded
    // the timeout.
    async function tryGetAccessToken() {
        if (Date.now() < refreshTimeout) {
            try {
                return await getAccessToken();
            }
            catch (_a) {
                return null;
            }
        }
        else {
            const finalToken = await getAccessToken();
            // Timeout is up, so throw if it's still null
            if (finalToken === null) {
                throw new Error("Failed to refresh access token.");
            }
            return finalToken;
        }
    }
    let token = await tryGetAccessToken();
    while (token === null) {
        await (0,_helpers_js__WEBPACK_IMPORTED_MODULE_0__.delay)(retryIntervalInMs);
        token = await tryGetAccessToken();
    }
    return token;
}
/**
 * Creates a token cycler from a credential, scopes, and optional settings.
 *
 * A token cycler represents a way to reliably retrieve a valid access token
 * from a TokenCredential. It will handle initializing the token, refreshing it
 * when it nears expiration, and synchronizes refresh attempts to avoid
 * concurrency hazards.
 *
 * @param credential - the underlying TokenCredential that provides the access
 * token
 * @param tokenCyclerOptions - optionally override default settings for the cycler
 *
 * @returns - a function that reliably produces a valid access token
 */
function createTokenCycler(credential, tokenCyclerOptions) {
    let refreshWorker = null;
    let token = null;
    let tenantId;
    const options = Object.assign(Object.assign({}, DEFAULT_CYCLER_OPTIONS), tokenCyclerOptions);
    /**
     * This little holder defines several predicates that we use to construct
     * the rules of refreshing the token.
     */
    const cycler = {
        /**
         * Produces true if a refresh job is currently in progress.
         */
        get isRefreshing() {
            return refreshWorker !== null;
        },
        /**
         * Produces true if the cycler SHOULD refresh (we are within the refresh
         * window and not already refreshing)
         */
        get shouldRefresh() {
            var _a;
            return (!cycler.isRefreshing &&
                ((_a = token === null || token === void 0 ? void 0 : token.expiresOnTimestamp) !== null && _a !== void 0 ? _a : 0) - options.refreshWindowInMs < Date.now());
        },
        /**
         * Produces true if the cycler MUST refresh (null or nearly-expired
         * token).
         */
        get mustRefresh() {
            return (token === null || token.expiresOnTimestamp - options.forcedRefreshWindowInMs < Date.now());
        },
    };
    /**
     * Starts a refresh job or returns the existing job if one is already
     * running.
     */
    function refresh(scopes, getTokenOptions) {
        var _a;
        if (!cycler.isRefreshing) {
            // We bind `scopes` here to avoid passing it around a lot
            const tryGetAccessToken = () => credential.getToken(scopes, getTokenOptions);
            // Take advantage of promise chaining to insert an assignment to `token`
            // before the refresh can be considered done.
            refreshWorker = beginRefresh(tryGetAccessToken, options.retryIntervalInMs, 
            // If we don't have a token, then we should timeout immediately
            (_a = token === null || token === void 0 ? void 0 : token.expiresOnTimestamp) !== null && _a !== void 0 ? _a : Date.now())
                .then((_token) => {
                refreshWorker = null;
                token = _token;
                tenantId = getTokenOptions.tenantId;
                return token;
            })
                .catch((reason) => {
                // We also should reset the refresher if we enter a failed state.  All
                // existing awaiters will throw, but subsequent requests will start a
                // new retry chain.
                refreshWorker = null;
                token = null;
                tenantId = undefined;
                throw reason;
            });
        }
        return refreshWorker;
    }
    return async (scopes, tokenOptions) => {
        //
        // Simple rules:
        // - If we MUST refresh, then return the refresh task, blocking
        //   the pipeline until a token is available.
        // - If we SHOULD refresh, then run refresh but don't return it
        //   (we can still use the cached token).
        // - Return the token, since it's fine if we didn't return in
        //   step 1.
        //
        // If the tenantId passed in token options is different to the one we have
        // Or if we are in claim challenge and the token was rejected and a new access token need to be issued, we need to
        // refresh the token with the new tenantId or token.
        const mustRefresh = tenantId !== tokenOptions.tenantId || Boolean(tokenOptions.claims) || cycler.mustRefresh;
        if (mustRefresh)
            return refresh(scopes, tokenOptions);
        if (cycler.shouldRefresh) {
            refresh(scopes, tokenOptions);
        }
        return token;
    };
}
//# sourceMappingURL=tokenCycler.js.map

/***/ }),

/***/ "./node_modules/@azure/core-rest-pipeline/dist/browser/util/typeGuards.js":
/*!********************************************************************************!*\
  !*** ./node_modules/@azure/core-rest-pipeline/dist/browser/util/typeGuards.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isBlob: () => (/* binding */ isBlob),
/* harmony export */   isNodeReadableStream: () => (/* binding */ isNodeReadableStream),
/* harmony export */   isReadableStream: () => (/* binding */ isReadableStream),
/* harmony export */   isWebReadableStream: () => (/* binding */ isWebReadableStream)
/* harmony export */ });
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
function isNodeReadableStream(x) {
    return Boolean(x && typeof x["pipe"] === "function");
}
function isWebReadableStream(x) {
    return Boolean(x &&
        typeof x.getReader === "function" &&
        typeof x.tee === "function");
}
function isReadableStream(x) {
    return isNodeReadableStream(x) || isWebReadableStream(x);
}
function isBlob(x) {
    return typeof x.stream === "function";
}
//# sourceMappingURL=typeGuards.js.map

/***/ }),

/***/ "./node_modules/@azure/core-rest-pipeline/dist/browser/util/userAgent.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@azure/core-rest-pipeline/dist/browser/util/userAgent.js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getUserAgentHeaderName: () => (/* binding */ getUserAgentHeaderName),
/* harmony export */   getUserAgentValue: () => (/* binding */ getUserAgentValue)
/* harmony export */ });
/* harmony import */ var _userAgentPlatform_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./userAgentPlatform.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/util/userAgentPlatform.js");
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../constants.js */ "./node_modules/@azure/core-rest-pipeline/dist/browser/constants.js");
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.


function getUserAgentString(telemetryInfo) {
    const parts = [];
    for (const [key, value] of telemetryInfo) {
        const token = value ? `${key}/${value}` : key;
        parts.push(token);
    }
    return parts.join(" ");
}
/**
 * @internal
 */
function getUserAgentHeaderName() {
    return (0,_userAgentPlatform_js__WEBPACK_IMPORTED_MODULE_0__.getHeaderName)();
}
/**
 * @internal
 */
function getUserAgentValue(prefix) {
    const runtimeInfo = new Map();
    runtimeInfo.set("core-rest-pipeline", _constants_js__WEBPACK_IMPORTED_MODULE_1__.SDK_VERSION);
    (0,_userAgentPlatform_js__WEBPACK_IMPORTED_MODULE_0__.setPlatformSpecificData)(runtimeInfo);
    const defaultAgent = getUserAgentString(runtimeInfo);
    const userAgentValue = prefix ? `${prefix} ${defaultAgent}` : defaultAgent;
    return userAgentValue;
}
//# sourceMappingURL=userAgent.js.map

/***/ }),

/***/ "./node_modules/@azure/core-rest-pipeline/dist/browser/util/userAgentPlatform.js":
/*!***************************************************************************************!*\
  !*** ./node_modules/@azure/core-rest-pipeline/dist/browser/util/userAgentPlatform.js ***!
  \***************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getHeaderName: () => (/* binding */ getHeaderName),
/* harmony export */   setPlatformSpecificData: () => (/* binding */ setPlatformSpecificData)
/* harmony export */ });
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/*
 * NOTE: When moving this file, please update "browser" section in package.json.
 */
/**
 * @internal
 */
function getHeaderName() {
    return "x-ms-useragent";
}
/**
 * @internal
 */
function setPlatformSpecificData(map) {
    var _a, _b, _c;
    const localNavigator = globalThis.navigator;
    map.set("OS", ((_c = (_b = (_a = localNavigator === null || localNavigator === void 0 ? void 0 : localNavigator.userAgentData) === null || _a === void 0 ? void 0 : _a.platform) !== null && _b !== void 0 ? _b : localNavigator === null || localNavigator === void 0 ? void 0 : localNavigator.platform) !== null && _c !== void 0 ? _c : "unknown").replace(" ", ""));
}
//# sourceMappingURL=userAgentPlatform-browser.mjs.map

/***/ }),

/***/ "./node_modules/@azure/core-sse/dist/browser/index.js":
/*!************************************************************!*\
  !*** ./node_modules/@azure/core-sse/dist/browser/index.js ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createSseStream: () => (/* reexport safe */ _sse_js__WEBPACK_IMPORTED_MODULE_0__.createSseStream)
/* harmony export */ });
/* harmony import */ var _sse_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./sse.js */ "./node_modules/@azure/core-sse/dist/browser/sse.js");
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@azure/core-sse/dist/browser/sse.js":
/*!**********************************************************!*\
  !*** ./node_modules/@azure/core-sse/dist/browser/sse.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createSseStream: () => (/* binding */ createSseStream)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.mjs");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./node_modules/@azure/core-sse/dist/browser/utils.js");
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.


var ControlChars;
(function (ControlChars) {
    ControlChars[ControlChars["NewLine"] = 10] = "NewLine";
    ControlChars[ControlChars["CarriageReturn"] = 13] = "CarriageReturn";
    ControlChars[ControlChars["Space"] = 32] = "Space";
    ControlChars[ControlChars["Colon"] = 58] = "Colon";
})(ControlChars || (ControlChars = {}));
function createSseStream(chunkStream) {
    const { cancel, iterable } = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.ensureAsyncIterable)(chunkStream);
    const asyncIter = toMessage(toLine(iterable));
    return (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.createStream)(asyncIter, cancel);
}
function concatBuffer(a, b) {
    const res = new Uint8Array(a.length + b.length);
    res.set(a);
    res.set(b, a.length);
    return res;
}
function createMessage() {
    return {
        data: undefined,
        event: "",
        id: "",
        retry: undefined,
    };
}
function toLine(chunkIter) {
    return (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__asyncGenerator)(this, arguments, function* toLine_1() {
        var _a, e_1, _b, _c;
        let buf;
        let bufIdx = 0;
        let fieldLen = -1;
        let discardTrailingNewline = false;
        try {
            for (var _d = true, chunkIter_1 = (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__asyncValues)(chunkIter), chunkIter_1_1; chunkIter_1_1 = yield (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__await)(chunkIter_1.next()), _a = chunkIter_1_1.done, !_a; _d = true) {
                _c = chunkIter_1_1.value;
                _d = false;
                const chunk = _c;
                if (buf === undefined) {
                    buf = chunk;
                    bufIdx = 0;
                    fieldLen = -1;
                }
                else {
                    buf = concatBuffer(buf, chunk);
                }
                const bufLen = buf.length;
                let start = 0;
                while (bufIdx < bufLen) {
                    if (discardTrailingNewline) {
                        if (buf[bufIdx] === ControlChars.NewLine) {
                            start = ++bufIdx;
                        }
                        discardTrailingNewline = false;
                    }
                    let end = -1;
                    for (; bufIdx < bufLen && end === -1; ++bufIdx) {
                        switch (buf[bufIdx]) {
                            case ControlChars.Colon:
                                if (fieldLen === -1) {
                                    fieldLen = bufIdx - start;
                                }
                                break;
                            case ControlChars.CarriageReturn:
                                // We need to discard the trailing newline if any but can't do
                                // that now because we need to dispatch the current line first.
                                discardTrailingNewline = true;
                                end = bufIdx;
                                break;
                            case ControlChars.NewLine:
                                end = bufIdx;
                                break;
                        }
                    }
                    if (end === -1) {
                        // We reached the end of the buffer but the line hasn't ended.
                        // Wait for the next chunk and then continue parsing:
                        break;
                    }
                    yield yield (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__await)({ line: buf.subarray(start, end), fieldLen });
                    start = bufIdx; // we're now on the next line
                    fieldLen = -1;
                }
                if (start === bufLen) {
                    buf = undefined;
                }
                else if (start !== 0) {
                    // discard already processed lines
                    buf = buf.subarray(start);
                    bufIdx -= start;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = chunkIter_1.return)) yield (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__await)(_b.call(chunkIter_1));
            }
            finally { if (e_1) throw e_1.error; }
        }
    });
}
function toMessage(lineIter) {
    return (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__asyncGenerator)(this, arguments, function* toMessage_1() {
        var _a, e_2, _b, _c;
        let message = createMessage();
        const decoder = new TextDecoder();
        try {
            for (var _d = true, lineIter_1 = (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__asyncValues)(lineIter), lineIter_1_1; lineIter_1_1 = yield (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__await)(lineIter_1.next()), _a = lineIter_1_1.done, !_a; _d = true) {
                _c = lineIter_1_1.value;
                _d = false;
                const { line, fieldLen } = _c;
                if (line.length === 0 && message.data !== undefined) {
                    // empty line denotes end of message. Yield and start a new message:
                    yield yield (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__await)(message);
                    message = createMessage();
                }
                else if (fieldLen > 0) {
                    // exclude comments and lines with no values
                    // line is of format "<field>:<value>" or "<field>: <value>"
                    // https://html.spec.whatwg.org/multipage/server-sent-events.html#event-stream-interpretation
                    const field = decoder.decode(line.subarray(0, fieldLen));
                    const valueOffset = fieldLen + (line[fieldLen + 1] === ControlChars.Space ? 2 : 1);
                    const value = decoder.decode(line.subarray(valueOffset));
                    switch (field) {
                        case "data":
                            message.data = message.data ? message.data + "\n" + value : value;
                            break;
                        case "event":
                            message.event = value;
                            break;
                        case "id":
                            message.id = value;
                            break;
                        case "retry": {
                            const retry = parseInt(value, 10);
                            if (!isNaN(retry)) {
                                message.retry = retry;
                            }
                            break;
                        }
                    }
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = lineIter_1.return)) yield (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__await)(_b.call(lineIter_1));
            }
            finally { if (e_2) throw e_2.error; }
        }
    });
}
//# sourceMappingURL=sse.js.map

/***/ }),

/***/ "./node_modules/@azure/core-sse/dist/browser/utils.js":
/*!************************************************************!*\
  !*** ./node_modules/@azure/core-sse/dist/browser/utils.js ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createStream: () => (/* binding */ createStream),
/* harmony export */   ensureAsyncIterable: () => (/* binding */ ensureAsyncIterable)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.mjs");
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

function createStream(asyncIter, cancel) {
    const stream = iteratorToStream(asyncIter, cancel);
    /** TODO: remove these polyfills once all supported runtimes support them */
    return polyfillStream(stream, cancel);
}
function polyfillStream(stream, dispose) {
    makeAsyncIterable(stream);
    makeAsyncDisposable(stream, dispose);
    return stream;
}
function makeAsyncDisposable(webStream, dispose) {
    var _a;
    (_a = Symbol.asyncDispose) !== null && _a !== void 0 ? _a : (Symbol.asyncDispose = Symbol("Symbol.asyncDispose"));
    if (!webStream[Symbol.asyncDispose]) {
        webStream[Symbol.asyncDispose] = () => dispose();
    }
}
function makeAsyncIterable(webStream) {
    if (!webStream[Symbol.asyncIterator]) {
        webStream[Symbol.asyncIterator] = () => toAsyncIterable(webStream);
    }
    if (!webStream.values) {
        webStream.values = () => toAsyncIterable(webStream);
    }
}
function iteratorToStream(iterator, cancel) {
    return new ReadableStream({
        async pull(controller) {
            const { value, done } = await iterator.next();
            if (done) {
                controller.close();
            }
            else {
                controller.enqueue(value);
            }
        },
        cancel,
    });
}
function ensureAsyncIterable(stream) {
    if (isReadableStream(stream)) {
        makeAsyncIterable(stream);
        return {
            cancel: () => stream.cancel(),
            iterable: stream,
        };
    }
    else {
        return {
            cancel: async () => {
                stream.socket.end();
            },
            iterable: stream,
        };
    }
}
function isReadableStream(body) {
    return Boolean(body &&
        typeof body.getReader === "function" &&
        typeof body.tee === "function");
}
function toAsyncIterable(stream) {
    return (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__asyncGenerator)(this, arguments, function* toAsyncIterable_1() {
        const reader = stream.getReader();
        try {
            while (true) {
                const { value, done } = yield (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__await)(reader.read());
                if (done) {
                    return yield (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__await)(void 0);
                }
                yield yield (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__await)(value);
            }
        }
        finally {
            const cancelPromise = reader.cancel();
            reader.releaseLock();
            yield (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__await)(cancelPromise);
        }
    });
}
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ "./node_modules/@azure/core-tracing/dist/browser/index.js":
/*!****************************************************************!*\
  !*** ./node_modules/@azure/core-tracing/dist/browser/index.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createTracingClient: () => (/* reexport safe */ _tracingClient_js__WEBPACK_IMPORTED_MODULE_1__.createTracingClient),
/* harmony export */   useInstrumenter: () => (/* reexport safe */ _instrumenter_js__WEBPACK_IMPORTED_MODULE_0__.useInstrumenter)
/* harmony export */ });
/* harmony import */ var _instrumenter_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instrumenter.js */ "./node_modules/@azure/core-tracing/dist/browser/instrumenter.js");
/* harmony import */ var _tracingClient_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./tracingClient.js */ "./node_modules/@azure/core-tracing/dist/browser/tracingClient.js");
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.


//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@azure/core-tracing/dist/browser/instrumenter.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@azure/core-tracing/dist/browser/instrumenter.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createDefaultInstrumenter: () => (/* binding */ createDefaultInstrumenter),
/* harmony export */   createDefaultTracingSpan: () => (/* binding */ createDefaultTracingSpan),
/* harmony export */   getInstrumenter: () => (/* binding */ getInstrumenter),
/* harmony export */   useInstrumenter: () => (/* binding */ useInstrumenter)
/* harmony export */ });
/* harmony import */ var _tracingContext_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tracingContext.js */ "./node_modules/@azure/core-tracing/dist/browser/tracingContext.js");
/* harmony import */ var _state_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./state.js */ "./node_modules/@azure/core-tracing/dist/browser/state.js");
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.


function createDefaultTracingSpan() {
    return {
        end: () => {
            // noop
        },
        isRecording: () => false,
        recordException: () => {
            // noop
        },
        setAttribute: () => {
            // noop
        },
        setStatus: () => {
            // noop
        },
    };
}
function createDefaultInstrumenter() {
    return {
        createRequestHeaders: () => {
            return {};
        },
        parseTraceparentHeader: () => {
            return undefined;
        },
        startSpan: (_name, spanOptions) => {
            return {
                span: createDefaultTracingSpan(),
                tracingContext: (0,_tracingContext_js__WEBPACK_IMPORTED_MODULE_0__.createTracingContext)({ parentContext: spanOptions.tracingContext }),
            };
        },
        withContext(_context, callback, ...callbackArgs) {
            return callback(...callbackArgs);
        },
    };
}
/**
 * Extends the Azure SDK with support for a given instrumenter implementation.
 *
 * @param instrumenter - The instrumenter implementation to use.
 */
function useInstrumenter(instrumenter) {
    _state_js__WEBPACK_IMPORTED_MODULE_1__.state.instrumenterImplementation = instrumenter;
}
/**
 * Gets the currently set instrumenter, a No-Op instrumenter by default.
 *
 * @returns The currently set instrumenter
 */
function getInstrumenter() {
    if (!_state_js__WEBPACK_IMPORTED_MODULE_1__.state.instrumenterImplementation) {
        _state_js__WEBPACK_IMPORTED_MODULE_1__.state.instrumenterImplementation = createDefaultInstrumenter();
    }
    return _state_js__WEBPACK_IMPORTED_MODULE_1__.state.instrumenterImplementation;
}
//# sourceMappingURL=instrumenter.js.map

/***/ }),

/***/ "./node_modules/@azure/core-tracing/dist/browser/state.js":
/*!****************************************************************!*\
  !*** ./node_modules/@azure/core-tracing/dist/browser/state.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   state: () => (/* binding */ state)
/* harmony export */ });
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/**
 * Browser-only implementation of the module's state. The browser esm variant will not load the commonjs state, so we do not need to share state between the two.
 */
const state = {
    instrumenterImplementation: undefined,
};
//# sourceMappingURL=state-browser.mjs.map

/***/ }),

/***/ "./node_modules/@azure/core-tracing/dist/browser/tracingClient.js":
/*!************************************************************************!*\
  !*** ./node_modules/@azure/core-tracing/dist/browser/tracingClient.js ***!
  \************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createTracingClient: () => (/* binding */ createTracingClient)
/* harmony export */ });
/* harmony import */ var _instrumenter_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instrumenter.js */ "./node_modules/@azure/core-tracing/dist/browser/instrumenter.js");
/* harmony import */ var _tracingContext_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./tracingContext.js */ "./node_modules/@azure/core-tracing/dist/browser/tracingContext.js");
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.


/**
 * Creates a new tracing client.
 *
 * @param options - Options used to configure the tracing client.
 * @returns - An instance of {@link TracingClient}.
 */
function createTracingClient(options) {
    const { namespace, packageName, packageVersion } = options;
    function startSpan(name, operationOptions, spanOptions) {
        var _a;
        const startSpanResult = (0,_instrumenter_js__WEBPACK_IMPORTED_MODULE_0__.getInstrumenter)().startSpan(name, Object.assign(Object.assign({}, spanOptions), { packageName: packageName, packageVersion: packageVersion, tracingContext: (_a = operationOptions === null || operationOptions === void 0 ? void 0 : operationOptions.tracingOptions) === null || _a === void 0 ? void 0 : _a.tracingContext }));
        let tracingContext = startSpanResult.tracingContext;
        const span = startSpanResult.span;
        if (!tracingContext.getValue(_tracingContext_js__WEBPACK_IMPORTED_MODULE_1__.knownContextKeys.namespace)) {
            tracingContext = tracingContext.setValue(_tracingContext_js__WEBPACK_IMPORTED_MODULE_1__.knownContextKeys.namespace, namespace);
        }
        span.setAttribute("az.namespace", tracingContext.getValue(_tracingContext_js__WEBPACK_IMPORTED_MODULE_1__.knownContextKeys.namespace));
        const updatedOptions = Object.assign({}, operationOptions, {
            tracingOptions: Object.assign(Object.assign({}, operationOptions === null || operationOptions === void 0 ? void 0 : operationOptions.tracingOptions), { tracingContext }),
        });
        return {
            span,
            updatedOptions,
        };
    }
    async function withSpan(name, operationOptions, callback, spanOptions) {
        const { span, updatedOptions } = startSpan(name, operationOptions, spanOptions);
        try {
            const result = await withContext(updatedOptions.tracingOptions.tracingContext, () => Promise.resolve(callback(updatedOptions, span)));
            span.setStatus({ status: "success" });
            return result;
        }
        catch (err) {
            span.setStatus({ status: "error", error: err });
            throw err;
        }
        finally {
            span.end();
        }
    }
    function withContext(context, callback, ...callbackArgs) {
        return (0,_instrumenter_js__WEBPACK_IMPORTED_MODULE_0__.getInstrumenter)().withContext(context, callback, ...callbackArgs);
    }
    /**
     * Parses a traceparent header value into a span identifier.
     *
     * @param traceparentHeader - The traceparent header to parse.
     * @returns An implementation-specific identifier for the span.
     */
    function parseTraceparentHeader(traceparentHeader) {
        return (0,_instrumenter_js__WEBPACK_IMPORTED_MODULE_0__.getInstrumenter)().parseTraceparentHeader(traceparentHeader);
    }
    /**
     * Creates a set of request headers to propagate tracing information to a backend.
     *
     * @param tracingContext - The context containing the span to serialize.
     * @returns The set of headers to add to a request.
     */
    function createRequestHeaders(tracingContext) {
        return (0,_instrumenter_js__WEBPACK_IMPORTED_MODULE_0__.getInstrumenter)().createRequestHeaders(tracingContext);
    }
    return {
        startSpan,
        withSpan,
        withContext,
        parseTraceparentHeader,
        createRequestHeaders,
    };
}
//# sourceMappingURL=tracingClient.js.map

/***/ }),

/***/ "./node_modules/@azure/core-tracing/dist/browser/tracingContext.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@azure/core-tracing/dist/browser/tracingContext.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TracingContextImpl: () => (/* binding */ TracingContextImpl),
/* harmony export */   createTracingContext: () => (/* binding */ createTracingContext),
/* harmony export */   knownContextKeys: () => (/* binding */ knownContextKeys)
/* harmony export */ });
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/** @internal */
const knownContextKeys = {
    span: Symbol.for("@azure/core-tracing span"),
    namespace: Symbol.for("@azure/core-tracing namespace"),
};
/**
 * Creates a new {@link TracingContext} with the given options.
 * @param options - A set of known keys that may be set on the context.
 * @returns A new {@link TracingContext} with the given options.
 *
 * @internal
 */
function createTracingContext(options = {}) {
    let context = new TracingContextImpl(options.parentContext);
    if (options.span) {
        context = context.setValue(knownContextKeys.span, options.span);
    }
    if (options.namespace) {
        context = context.setValue(knownContextKeys.namespace, options.namespace);
    }
    return context;
}
/** @internal */
class TracingContextImpl {
    constructor(initialContext) {
        this._contextMap =
            initialContext instanceof TracingContextImpl
                ? new Map(initialContext._contextMap)
                : new Map();
    }
    setValue(key, value) {
        const newContext = new TracingContextImpl(this);
        newContext._contextMap.set(key, value);
        return newContext;
    }
    getValue(key) {
        return this._contextMap.get(key);
    }
    deleteValue(key) {
        const newContext = new TracingContextImpl(this);
        newContext._contextMap.delete(key);
        return newContext;
    }
}
//# sourceMappingURL=tracingContext.js.map

/***/ }),

/***/ "./node_modules/@azure/core-util/dist/browser/aborterUtils.js":
/*!********************************************************************!*\
  !*** ./node_modules/@azure/core-util/dist/browser/aborterUtils.js ***!
  \********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   cancelablePromiseRace: () => (/* binding */ cancelablePromiseRace)
/* harmony export */ });
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/**
 * promise.race() wrapper that aborts rest of promises as soon as the first promise settles.
 */
async function cancelablePromiseRace(abortablePromiseBuilders, options) {
    var _a, _b;
    const aborter = new AbortController();
    function abortHandler() {
        aborter.abort();
    }
    (_a = options === null || options === void 0 ? void 0 : options.abortSignal) === null || _a === void 0 ? void 0 : _a.addEventListener("abort", abortHandler);
    try {
        return await Promise.race(abortablePromiseBuilders.map((p) => p({ abortSignal: aborter.signal })));
    }
    finally {
        aborter.abort();
        (_b = options === null || options === void 0 ? void 0 : options.abortSignal) === null || _b === void 0 ? void 0 : _b.removeEventListener("abort", abortHandler);
    }
}
//# sourceMappingURL=aborterUtils.js.map

/***/ }),

/***/ "./node_modules/@azure/core-util/dist/browser/bytesEncoding.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@azure/core-util/dist/browser/bytesEncoding.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   base64ToUint8Array: () => (/* binding */ base64ToUint8Array),
/* harmony export */   base64UrlToUint8Array: () => (/* binding */ base64UrlToUint8Array),
/* harmony export */   hexStringToUint8Array: () => (/* binding */ hexStringToUint8Array),
/* harmony export */   stringToUint8Array: () => (/* binding */ stringToUint8Array),
/* harmony export */   uint8ArrayToBase64: () => (/* binding */ uint8ArrayToBase64),
/* harmony export */   uint8ArrayToBase64Url: () => (/* binding */ uint8ArrayToBase64Url),
/* harmony export */   uint8ArrayToHexString: () => (/* binding */ uint8ArrayToHexString),
/* harmony export */   uint8ArrayToString: () => (/* binding */ uint8ArrayToString),
/* harmony export */   uint8ArrayToUtf8String: () => (/* binding */ uint8ArrayToUtf8String),
/* harmony export */   utf8StringToUint8Array: () => (/* binding */ utf8StringToUint8Array)
/* harmony export */ });
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/**
 * The helper that transforms bytes with specific character encoding into string
 * @param bytes - the uint8array bytes
 * @param format - the format we use to encode the byte
 * @returns a string of the encoded string
 */
function uint8ArrayToString(bytes, format) {
    switch (format) {
        case "utf-8":
            return uint8ArrayToUtf8String(bytes);
        case "base64":
            return uint8ArrayToBase64(bytes);
        case "base64url":
            return uint8ArrayToBase64Url(bytes);
        case "hex":
            return uint8ArrayToHexString(bytes);
    }
}
/**
 * The helper that transforms string to specific character encoded bytes array.
 * @param value - the string to be converted
 * @param format - the format we use to decode the value
 * @returns a uint8array
 */
function stringToUint8Array(value, format) {
    switch (format) {
        case "utf-8":
            return utf8StringToUint8Array(value);
        case "base64":
            return base64ToUint8Array(value);
        case "base64url":
            return base64UrlToUint8Array(value);
        case "hex":
            return hexStringToUint8Array(value);
    }
}
/**
 * Decodes a Uint8Array into a Base64 string.
 * @internal
 */
function uint8ArrayToBase64(bytes) {
    return btoa([...bytes].map((x) => String.fromCharCode(x)).join(""));
}
/**
 * Decodes a Uint8Array into a Base64Url string.
 * @internal
 */
function uint8ArrayToBase64Url(bytes) {
    return uint8ArrayToBase64(bytes).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}
/**
 * Decodes a Uint8Array into a javascript string.
 * @internal
 */
function uint8ArrayToUtf8String(bytes) {
    const decoder = new TextDecoder();
    const dataString = decoder.decode(bytes);
    return dataString;
}
/**
 * Decodes a Uint8Array into a hex string
 * @internal
 */
function uint8ArrayToHexString(bytes) {
    return [...bytes].map((x) => x.toString(16).padStart(2, "0")).join("");
}
/**
 * Encodes a JavaScript string into a Uint8Array.
 * @internal
 */
function utf8StringToUint8Array(value) {
    return new TextEncoder().encode(value);
}
/**
 * Encodes a Base64 string into a Uint8Array.
 * @internal
 */
function base64ToUint8Array(value) {
    return new Uint8Array([...atob(value)].map((x) => x.charCodeAt(0)));
}
/**
 * Encodes a Base64Url string into a Uint8Array.
 * @internal
 */
function base64UrlToUint8Array(value) {
    const base64String = value.replace(/-/g, "+").replace(/_/g, "/");
    return base64ToUint8Array(base64String);
}
const hexDigits = new Set("0123456789abcdefABCDEF");
/**
 * Encodes a hex string into a Uint8Array
 * @internal
 */
function hexStringToUint8Array(value) {
    // If value has odd length, the last character will be ignored, consistent with NodeJS Buffer behavior
    const bytes = new Uint8Array(value.length / 2);
    for (let i = 0; i < value.length / 2; ++i) {
        const highNibble = value[2 * i];
        const lowNibble = value[2 * i + 1];
        if (!hexDigits.has(highNibble) || !hexDigits.has(lowNibble)) {
            // Replicate Node Buffer behavior by exiting early when we encounter an invalid byte
            return bytes.slice(0, i);
        }
        bytes[i] = parseInt(`${highNibble}${lowNibble}`, 16);
    }
    return bytes;
}
//# sourceMappingURL=bytesEncoding-browser.mjs.map

/***/ }),

/***/ "./node_modules/@azure/core-util/dist/browser/checkEnvironment.js":
/*!************************************************************************!*\
  !*** ./node_modules/@azure/core-util/dist/browser/checkEnvironment.js ***!
  \************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isBrowser: () => (/* binding */ isBrowser),
/* harmony export */   isBun: () => (/* binding */ isBun),
/* harmony export */   isDeno: () => (/* binding */ isDeno),
/* harmony export */   isNode: () => (/* binding */ isNode),
/* harmony export */   isNodeLike: () => (/* binding */ isNodeLike),
/* harmony export */   isNodeRuntime: () => (/* binding */ isNodeRuntime),
/* harmony export */   isReactNative: () => (/* binding */ isReactNative),
/* harmony export */   isWebWorker: () => (/* binding */ isWebWorker)
/* harmony export */ });
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
var _a, _b, _c, _d;
/**
 * A constant that indicates whether the environment the code is running is a Web Browser.
 */
// eslint-disable-next-line @azure/azure-sdk/ts-no-window
const isBrowser = typeof window !== "undefined" && typeof window.document !== "undefined";
/**
 * A constant that indicates whether the environment the code is running is a Web Worker.
 */
const isWebWorker = typeof self === "object" &&
    typeof (self === null || self === void 0 ? void 0 : self.importScripts) === "function" &&
    (((_a = self.constructor) === null || _a === void 0 ? void 0 : _a.name) === "DedicatedWorkerGlobalScope" ||
        ((_b = self.constructor) === null || _b === void 0 ? void 0 : _b.name) === "ServiceWorkerGlobalScope" ||
        ((_c = self.constructor) === null || _c === void 0 ? void 0 : _c.name) === "SharedWorkerGlobalScope");
/**
 * A constant that indicates whether the environment the code is running is Deno.
 */
const isDeno = typeof Deno !== "undefined" &&
    typeof Deno.version !== "undefined" &&
    typeof Deno.version.deno !== "undefined";
/**
 * A constant that indicates whether the environment the code is running is Bun.sh.
 */
const isBun = typeof Bun !== "undefined" && typeof Bun.version !== "undefined";
/**
 * A constant that indicates whether the environment the code is running is a Node.js compatible environment.
 */
const isNodeLike = typeof globalThis.process !== "undefined" &&
    Boolean(globalThis.process.version) &&
    Boolean((_d = globalThis.process.versions) === null || _d === void 0 ? void 0 : _d.node);
/**
 * A constant that indicates whether the environment the code is running is a Node.js compatible environment.
 * @deprecated Use `isNodeLike` instead.
 */
const isNode = isNodeLike;
/**
 * A constant that indicates whether the environment the code is running is Node.JS.
 */
const isNodeRuntime = isNodeLike && !isBun && !isDeno;
/**
 * A constant that indicates whether the environment the code is running is in React-Native.
 */
// https://github.com/facebook/react-native/blob/main/packages/react-native/Libraries/Core/setUpNavigator.js
const isReactNative = typeof navigator !== "undefined" && (navigator === null || navigator === void 0 ? void 0 : navigator.product) === "ReactNative";
//# sourceMappingURL=checkEnvironment.js.map

/***/ }),

/***/ "./node_modules/@azure/core-util/dist/browser/createAbortablePromise.js":
/*!******************************************************************************!*\
  !*** ./node_modules/@azure/core-util/dist/browser/createAbortablePromise.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createAbortablePromise: () => (/* binding */ createAbortablePromise)
/* harmony export */ });
/* harmony import */ var _azure_abort_controller__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @azure/abort-controller */ "./node_modules/@azure/abort-controller/dist/browser/index.js");
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * Creates an abortable promise.
 * @param buildPromise - A function that takes the resolve and reject functions as parameters.
 * @param options - The options for the abortable promise.
 * @returns A promise that can be aborted.
 */
function createAbortablePromise(buildPromise, options) {
    const { cleanupBeforeAbort, abortSignal, abortErrorMsg } = options !== null && options !== void 0 ? options : {};
    return new Promise((resolve, reject) => {
        function rejectOnAbort() {
            reject(new _azure_abort_controller__WEBPACK_IMPORTED_MODULE_0__.AbortError(abortErrorMsg !== null && abortErrorMsg !== void 0 ? abortErrorMsg : "The operation was aborted."));
        }
        function removeListeners() {
            abortSignal === null || abortSignal === void 0 ? void 0 : abortSignal.removeEventListener("abort", onAbort);
        }
        function onAbort() {
            cleanupBeforeAbort === null || cleanupBeforeAbort === void 0 ? void 0 : cleanupBeforeAbort();
            removeListeners();
            rejectOnAbort();
        }
        if (abortSignal === null || abortSignal === void 0 ? void 0 : abortSignal.aborted) {
            return rejectOnAbort();
        }
        try {
            buildPromise((x) => {
                removeListeners();
                resolve(x);
            }, (x) => {
                removeListeners();
                reject(x);
            });
        }
        catch (err) {
            reject(err);
        }
        abortSignal === null || abortSignal === void 0 ? void 0 : abortSignal.addEventListener("abort", onAbort);
    });
}
//# sourceMappingURL=createAbortablePromise.js.map

/***/ }),

/***/ "./node_modules/@azure/core-util/dist/browser/delay.js":
/*!*************************************************************!*\
  !*** ./node_modules/@azure/core-util/dist/browser/delay.js ***!
  \*************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   delay: () => (/* binding */ delay)
/* harmony export */ });
/* harmony import */ var _createAbortablePromise_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./createAbortablePromise.js */ "./node_modules/@azure/core-util/dist/browser/createAbortablePromise.js");
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

const StandardAbortMessage = "The delay was aborted.";
/**
 * A wrapper for setTimeout that resolves a promise after timeInMs milliseconds.
 * @param timeInMs - The number of milliseconds to be delayed.
 * @param options - The options for delay - currently abort options
 * @returns Promise that is resolved after timeInMs
 */
function delay(timeInMs, options) {
    let token;
    const { abortSignal, abortErrorMsg } = options !== null && options !== void 0 ? options : {};
    return (0,_createAbortablePromise_js__WEBPACK_IMPORTED_MODULE_0__.createAbortablePromise)((resolve) => {
        token = setTimeout(resolve, timeInMs);
    }, {
        cleanupBeforeAbort: () => clearTimeout(token),
        abortSignal,
        abortErrorMsg: abortErrorMsg !== null && abortErrorMsg !== void 0 ? abortErrorMsg : StandardAbortMessage,
    });
}
//# sourceMappingURL=delay.js.map

/***/ }),

/***/ "./node_modules/@azure/core-util/dist/browser/error.js":
/*!*************************************************************!*\
  !*** ./node_modules/@azure/core-util/dist/browser/error.js ***!
  \*************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getErrorMessage: () => (/* binding */ getErrorMessage),
/* harmony export */   isError: () => (/* binding */ isError)
/* harmony export */ });
/* harmony import */ var _object_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./object.js */ "./node_modules/@azure/core-util/dist/browser/object.js");
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * Typeguard for an error object shape (has name and message)
 * @param e - Something caught by a catch clause.
 */
function isError(e) {
    if ((0,_object_js__WEBPACK_IMPORTED_MODULE_0__.isObject)(e)) {
        const hasName = typeof e.name === "string";
        const hasMessage = typeof e.message === "string";
        return hasName && hasMessage;
    }
    return false;
}
/**
 * Given what is thought to be an error object, return the message if possible.
 * If the message is missing, returns a stringified version of the input.
 * @param e - Something thrown from a try block
 * @returns The error message or a string of the input
 */
function getErrorMessage(e) {
    if (isError(e)) {
        return e.message;
    }
    else {
        let stringified;
        try {
            if (typeof e === "object" && e) {
                stringified = JSON.stringify(e);
            }
            else {
                stringified = String(e);
            }
        }
        catch (err) {
            stringified = "[unable to stringify input]";
        }
        return `Unknown error ${stringified}`;
    }
}
//# sourceMappingURL=error.js.map

/***/ }),

/***/ "./node_modules/@azure/core-util/dist/browser/index.js":
/*!*************************************************************!*\
  !*** ./node_modules/@azure/core-util/dist/browser/index.js ***!
  \*************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   cancelablePromiseRace: () => (/* reexport safe */ _aborterUtils_js__WEBPACK_IMPORTED_MODULE_1__.cancelablePromiseRace),
/* harmony export */   computeSha256Hash: () => (/* reexport safe */ _sha256_js__WEBPACK_IMPORTED_MODULE_6__.computeSha256Hash),
/* harmony export */   computeSha256Hmac: () => (/* reexport safe */ _sha256_js__WEBPACK_IMPORTED_MODULE_6__.computeSha256Hmac),
/* harmony export */   createAbortablePromise: () => (/* reexport safe */ _createAbortablePromise_js__WEBPACK_IMPORTED_MODULE_2__.createAbortablePromise),
/* harmony export */   delay: () => (/* reexport safe */ _delay_js__WEBPACK_IMPORTED_MODULE_0__.delay),
/* harmony export */   getErrorMessage: () => (/* reexport safe */ _error_js__WEBPACK_IMPORTED_MODULE_5__.getErrorMessage),
/* harmony export */   getRandomIntegerInclusive: () => (/* reexport safe */ _random_js__WEBPACK_IMPORTED_MODULE_3__.getRandomIntegerInclusive),
/* harmony export */   isBrowser: () => (/* reexport safe */ _checkEnvironment_js__WEBPACK_IMPORTED_MODULE_9__.isBrowser),
/* harmony export */   isBun: () => (/* reexport safe */ _checkEnvironment_js__WEBPACK_IMPORTED_MODULE_9__.isBun),
/* harmony export */   isDefined: () => (/* reexport safe */ _typeGuards_js__WEBPACK_IMPORTED_MODULE_7__.isDefined),
/* harmony export */   isDeno: () => (/* reexport safe */ _checkEnvironment_js__WEBPACK_IMPORTED_MODULE_9__.isDeno),
/* harmony export */   isError: () => (/* reexport safe */ _error_js__WEBPACK_IMPORTED_MODULE_5__.isError),
/* harmony export */   isNode: () => (/* reexport safe */ _checkEnvironment_js__WEBPACK_IMPORTED_MODULE_9__.isNode),
/* harmony export */   isNodeLike: () => (/* reexport safe */ _checkEnvironment_js__WEBPACK_IMPORTED_MODULE_9__.isNodeLike),
/* harmony export */   isNodeRuntime: () => (/* reexport safe */ _checkEnvironment_js__WEBPACK_IMPORTED_MODULE_9__.isNodeRuntime),
/* harmony export */   isObject: () => (/* reexport safe */ _object_js__WEBPACK_IMPORTED_MODULE_4__.isObject),
/* harmony export */   isObjectWithProperties: () => (/* reexport safe */ _typeGuards_js__WEBPACK_IMPORTED_MODULE_7__.isObjectWithProperties),
/* harmony export */   isReactNative: () => (/* reexport safe */ _checkEnvironment_js__WEBPACK_IMPORTED_MODULE_9__.isReactNative),
/* harmony export */   isWebWorker: () => (/* reexport safe */ _checkEnvironment_js__WEBPACK_IMPORTED_MODULE_9__.isWebWorker),
/* harmony export */   objectHasProperty: () => (/* reexport safe */ _typeGuards_js__WEBPACK_IMPORTED_MODULE_7__.objectHasProperty),
/* harmony export */   randomUUID: () => (/* reexport safe */ _uuidUtils_js__WEBPACK_IMPORTED_MODULE_8__.randomUUID),
/* harmony export */   stringToUint8Array: () => (/* reexport safe */ _bytesEncoding_js__WEBPACK_IMPORTED_MODULE_10__.stringToUint8Array),
/* harmony export */   uint8ArrayToString: () => (/* reexport safe */ _bytesEncoding_js__WEBPACK_IMPORTED_MODULE_10__.uint8ArrayToString)
/* harmony export */ });
/* harmony import */ var _delay_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./delay.js */ "./node_modules/@azure/core-util/dist/browser/delay.js");
/* harmony import */ var _aborterUtils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./aborterUtils.js */ "./node_modules/@azure/core-util/dist/browser/aborterUtils.js");
/* harmony import */ var _createAbortablePromise_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./createAbortablePromise.js */ "./node_modules/@azure/core-util/dist/browser/createAbortablePromise.js");
/* harmony import */ var _random_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./random.js */ "./node_modules/@azure/core-util/dist/browser/random.js");
/* harmony import */ var _object_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./object.js */ "./node_modules/@azure/core-util/dist/browser/object.js");
/* harmony import */ var _error_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./error.js */ "./node_modules/@azure/core-util/dist/browser/error.js");
/* harmony import */ var _sha256_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./sha256.js */ "./node_modules/@azure/core-util/dist/browser/sha256.js");
/* harmony import */ var _typeGuards_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./typeGuards.js */ "./node_modules/@azure/core-util/dist/browser/typeGuards.js");
/* harmony import */ var _uuidUtils_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./uuidUtils.js */ "./node_modules/@azure/core-util/dist/browser/uuidUtils.js");
/* harmony import */ var _checkEnvironment_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./checkEnvironment.js */ "./node_modules/@azure/core-util/dist/browser/checkEnvironment.js");
/* harmony import */ var _bytesEncoding_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./bytesEncoding.js */ "./node_modules/@azure/core-util/dist/browser/bytesEncoding.js");
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.











//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@azure/core-util/dist/browser/object.js":
/*!**************************************************************!*\
  !*** ./node_modules/@azure/core-util/dist/browser/object.js ***!
  \**************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isObject: () => (/* binding */ isObject)
/* harmony export */ });
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/**
 * Helper to determine when an input is a generic JS object.
 * @returns true when input is an object type that is not null, Array, RegExp, or Date.
 */
function isObject(input) {
    return (typeof input === "object" &&
        input !== null &&
        !Array.isArray(input) &&
        !(input instanceof RegExp) &&
        !(input instanceof Date));
}
//# sourceMappingURL=object.js.map

/***/ }),

/***/ "./node_modules/@azure/core-util/dist/browser/random.js":
/*!**************************************************************!*\
  !*** ./node_modules/@azure/core-util/dist/browser/random.js ***!
  \**************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getRandomIntegerInclusive: () => (/* binding */ getRandomIntegerInclusive)
/* harmony export */ });
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/**
 * Returns a random integer value between a lower and upper bound,
 * inclusive of both bounds.
 * Note that this uses Math.random and isn't secure. If you need to use
 * this for any kind of security purpose, find a better source of random.
 * @param min - The smallest integer value allowed.
 * @param max - The largest integer value allowed.
 */
function getRandomIntegerInclusive(min, max) {
    // Make sure inputs are integers.
    min = Math.ceil(min);
    max = Math.floor(max);
    // Pick a random offset from zero to the size of the range.
    // Since Math.random() can never return 1, we have to make the range one larger
    // in order to be inclusive of the maximum value after we take the floor.
    const offset = Math.floor(Math.random() * (max - min + 1));
    return offset + min;
}
//# sourceMappingURL=random.js.map

/***/ }),

/***/ "./node_modules/@azure/core-util/dist/browser/sha256.js":
/*!**************************************************************!*\
  !*** ./node_modules/@azure/core-util/dist/browser/sha256.js ***!
  \**************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   computeSha256Hash: () => (/* binding */ computeSha256Hash),
/* harmony export */   computeSha256Hmac: () => (/* binding */ computeSha256Hmac)
/* harmony export */ });
/* harmony import */ var _bytesEncoding_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./bytesEncoding.js */ "./node_modules/@azure/core-util/dist/browser/bytesEncoding.js");
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

let subtleCrypto;
/**
 * Returns a cached reference to the Web API crypto.subtle object.
 * @internal
 */
function getCrypto() {
    if (subtleCrypto) {
        return subtleCrypto;
    }
    if (!self.crypto || !self.crypto.subtle) {
        throw new Error("Your browser environment does not support cryptography functions.");
    }
    subtleCrypto = self.crypto.subtle;
    return subtleCrypto;
}
/**
 * Generates a SHA-256 HMAC signature.
 * @param key - The HMAC key represented as a base64 string, used to generate the cryptographic HMAC hash.
 * @param stringToSign - The data to be signed.
 * @param encoding - The textual encoding to use for the returned HMAC digest.
 */
async function computeSha256Hmac(key, stringToSign, encoding) {
    const crypto = getCrypto();
    const keyBytes = (0,_bytesEncoding_js__WEBPACK_IMPORTED_MODULE_0__.stringToUint8Array)(key, "base64");
    const stringToSignBytes = (0,_bytesEncoding_js__WEBPACK_IMPORTED_MODULE_0__.stringToUint8Array)(stringToSign, "utf-8");
    const cryptoKey = await crypto.importKey("raw", keyBytes, {
        name: "HMAC",
        hash: { name: "SHA-256" },
    }, false, ["sign"]);
    const signature = await crypto.sign({
        name: "HMAC",
        hash: { name: "SHA-256" },
    }, cryptoKey, stringToSignBytes);
    return (0,_bytesEncoding_js__WEBPACK_IMPORTED_MODULE_0__.uint8ArrayToString)(new Uint8Array(signature), encoding);
}
/**
 * Generates a SHA-256 hash.
 * @param content - The data to be included in the hash.
 * @param encoding - The textual encoding to use for the returned hash.
 */
async function computeSha256Hash(content, encoding) {
    const contentBytes = (0,_bytesEncoding_js__WEBPACK_IMPORTED_MODULE_0__.stringToUint8Array)(content, "utf-8");
    const digest = await getCrypto().digest({ name: "SHA-256" }, contentBytes);
    return (0,_bytesEncoding_js__WEBPACK_IMPORTED_MODULE_0__.uint8ArrayToString)(new Uint8Array(digest), encoding);
}
//# sourceMappingURL=sha256-browser.mjs.map

/***/ }),

/***/ "./node_modules/@azure/core-util/dist/browser/typeGuards.js":
/*!******************************************************************!*\
  !*** ./node_modules/@azure/core-util/dist/browser/typeGuards.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isDefined: () => (/* binding */ isDefined),
/* harmony export */   isObjectWithProperties: () => (/* binding */ isObjectWithProperties),
/* harmony export */   objectHasProperty: () => (/* binding */ objectHasProperty)
/* harmony export */ });
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/**
 * Helper TypeGuard that checks if something is defined or not.
 * @param thing - Anything
 */
function isDefined(thing) {
    return typeof thing !== "undefined" && thing !== null;
}
/**
 * Helper TypeGuard that checks if the input is an object with the specified properties.
 * @param thing - Anything.
 * @param properties - The name of the properties that should appear in the object.
 */
function isObjectWithProperties(thing, properties) {
    if (!isDefined(thing) || typeof thing !== "object") {
        return false;
    }
    for (const property of properties) {
        if (!objectHasProperty(thing, property)) {
            return false;
        }
    }
    return true;
}
/**
 * Helper TypeGuard that checks if the input is an object with the specified property.
 * @param thing - Any object.
 * @param property - The name of the property that should appear in the object.
 */
function objectHasProperty(thing, property) {
    return (isDefined(thing) && typeof thing === "object" && property in thing);
}
//# sourceMappingURL=typeGuards.js.map

/***/ }),

/***/ "./node_modules/@azure/core-util/dist/browser/uuidUtils.common.js":
/*!************************************************************************!*\
  !*** ./node_modules/@azure/core-util/dist/browser/uuidUtils.common.js ***!
  \************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   generateUUID: () => (/* binding */ generateUUID),
/* harmony export */   randomUUID: () => (/* binding */ randomUUID)
/* harmony export */ });
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/**
 * Generated Universally Unique Identifier
 *
 * @returns RFC4122 v4 UUID.
 */
function generateUUID() {
    let uuid = "";
    for (let i = 0; i < 32; i++) {
        // Generate a random number between 0 and 15
        const randomNumber = Math.floor(Math.random() * 16);
        // Set the UUID version to 4 in the 13th position
        if (i === 12) {
            uuid += "4";
        }
        else if (i === 16) {
            // Set the UUID variant to "10" in the 17th position
            uuid += (randomNumber & 0x3) | 0x8;
        }
        else {
            // Add a random hexadecimal digit to the UUID string
            uuid += randomNumber.toString(16);
        }
        // Add hyphens to the UUID string at the appropriate positions
        if (i === 7 || i === 11 || i === 15 || i === 19) {
            uuid += "-";
        }
    }
    return uuid;
}
/**
 * Generated Universally Unique Identifier
 *
 * @returns RFC4122 v4 UUID.
 */
function randomUUID() {
    return generateUUID();
}
//# sourceMappingURL=uuidUtils.common.js.map

/***/ }),

/***/ "./node_modules/@azure/core-util/dist/browser/uuidUtils.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@azure/core-util/dist/browser/uuidUtils.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   randomUUID: () => (/* binding */ randomUUID)
/* harmony export */ });
/* harmony import */ var _uuidUtils_common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./uuidUtils.common.js */ "./node_modules/@azure/core-util/dist/browser/uuidUtils.common.js");
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
var _a;

// NOTE: This could be undefined if not used in a secure context
const uuidFunction = typeof ((_a = globalThis === null || globalThis === void 0 ? void 0 : globalThis.crypto) === null || _a === void 0 ? void 0 : _a.randomUUID) === "function"
    ? globalThis.crypto.randomUUID.bind(globalThis.crypto)
    : _uuidUtils_common_js__WEBPACK_IMPORTED_MODULE_0__.generateUUID;
/**
 * Generated Universally Unique Identifier
 *
 * @returns RFC4122 v4 UUID.
 */
function randomUUID() {
    return uuidFunction();
}
//# sourceMappingURL=uuidUtils-browser.mjs.map

/***/ }),

/***/ "./node_modules/@azure/logger/dist/browser/debug.js":
/*!**********************************************************!*\
  !*** ./node_modules/@azure/logger/dist/browser/debug.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _log_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./log.js */ "./node_modules/@azure/logger/dist/browser/log.js");
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

const debugEnvVariable = (typeof process !== "undefined" && process.env && process.env.DEBUG) || undefined;
let enabledString;
let enabledNamespaces = [];
let skippedNamespaces = [];
const debuggers = [];
if (debugEnvVariable) {
    enable(debugEnvVariable);
}
const debugObj = Object.assign((namespace) => {
    return createDebugger(namespace);
}, {
    enable,
    enabled,
    disable,
    log: _log_js__WEBPACK_IMPORTED_MODULE_0__.log,
});
function enable(namespaces) {
    enabledString = namespaces;
    enabledNamespaces = [];
    skippedNamespaces = [];
    const wildcard = /\*/g;
    const namespaceList = namespaces.split(",").map((ns) => ns.trim().replace(wildcard, ".*?"));
    for (const ns of namespaceList) {
        if (ns.startsWith("-")) {
            skippedNamespaces.push(new RegExp(`^${ns.substr(1)}$`));
        }
        else {
            enabledNamespaces.push(new RegExp(`^${ns}$`));
        }
    }
    for (const instance of debuggers) {
        instance.enabled = enabled(instance.namespace);
    }
}
function enabled(namespace) {
    if (namespace.endsWith("*")) {
        return true;
    }
    for (const skipped of skippedNamespaces) {
        if (skipped.test(namespace)) {
            return false;
        }
    }
    for (const enabledNamespace of enabledNamespaces) {
        if (enabledNamespace.test(namespace)) {
            return true;
        }
    }
    return false;
}
function disable() {
    const result = enabledString || "";
    enable("");
    return result;
}
function createDebugger(namespace) {
    const newDebugger = Object.assign(debug, {
        enabled: enabled(namespace),
        destroy,
        log: debugObj.log,
        namespace,
        extend,
    });
    function debug(...args) {
        if (!newDebugger.enabled) {
            return;
        }
        if (args.length > 0) {
            args[0] = `${namespace} ${args[0]}`;
        }
        newDebugger.log(...args);
    }
    debuggers.push(newDebugger);
    return newDebugger;
}
function destroy() {
    const index = debuggers.indexOf(this);
    if (index >= 0) {
        debuggers.splice(index, 1);
        return true;
    }
    return false;
}
function extend(namespace) {
    const newDebugger = createDebugger(`${this.namespace}:${namespace}`);
    newDebugger.log = this.log;
    return newDebugger;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (debugObj);
//# sourceMappingURL=debug.js.map

/***/ }),

/***/ "./node_modules/@azure/logger/dist/browser/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/@azure/logger/dist/browser/index.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AzureLogger: () => (/* binding */ AzureLogger),
/* harmony export */   createClientLogger: () => (/* binding */ createClientLogger),
/* harmony export */   getLogLevel: () => (/* binding */ getLogLevel),
/* harmony export */   setLogLevel: () => (/* binding */ setLogLevel)
/* harmony export */ });
/* harmony import */ var _debug_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./debug.js */ "./node_modules/@azure/logger/dist/browser/debug.js");
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

const registeredLoggers = new Set();
const logLevelFromEnv = (typeof process !== "undefined" && process.env && process.env.AZURE_LOG_LEVEL) || undefined;
let azureLogLevel;
/**
 * The AzureLogger provides a mechanism for overriding where logs are output to.
 * By default, logs are sent to stderr.
 * Override the `log` method to redirect logs to another location.
 */
const AzureLogger = (0,_debug_js__WEBPACK_IMPORTED_MODULE_0__["default"])("azure");
AzureLogger.log = (...args) => {
    _debug_js__WEBPACK_IMPORTED_MODULE_0__["default"].log(...args);
};
const AZURE_LOG_LEVELS = ["verbose", "info", "warning", "error"];
if (logLevelFromEnv) {
    // avoid calling setLogLevel because we don't want a mis-set environment variable to crash
    if (isAzureLogLevel(logLevelFromEnv)) {
        setLogLevel(logLevelFromEnv);
    }
    else {
        console.error(`AZURE_LOG_LEVEL set to unknown log level '${logLevelFromEnv}'; logging is not enabled. Acceptable values: ${AZURE_LOG_LEVELS.join(", ")}.`);
    }
}
/**
 * Immediately enables logging at the specified log level. If no level is specified, logging is disabled.
 * @param level - The log level to enable for logging.
 * Options from most verbose to least verbose are:
 * - verbose
 * - info
 * - warning
 * - error
 */
function setLogLevel(level) {
    if (level && !isAzureLogLevel(level)) {
        throw new Error(`Unknown log level '${level}'. Acceptable values: ${AZURE_LOG_LEVELS.join(",")}`);
    }
    azureLogLevel = level;
    const enabledNamespaces = [];
    for (const logger of registeredLoggers) {
        if (shouldEnable(logger)) {
            enabledNamespaces.push(logger.namespace);
        }
    }
    _debug_js__WEBPACK_IMPORTED_MODULE_0__["default"].enable(enabledNamespaces.join(","));
}
/**
 * Retrieves the currently specified log level.
 */
function getLogLevel() {
    return azureLogLevel;
}
const levelMap = {
    verbose: 400,
    info: 300,
    warning: 200,
    error: 100,
};
/**
 * Creates a logger for use by the Azure SDKs that inherits from `AzureLogger`.
 * @param namespace - The name of the SDK package.
 * @hidden
 */
function createClientLogger(namespace) {
    const clientRootLogger = AzureLogger.extend(namespace);
    patchLogMethod(AzureLogger, clientRootLogger);
    return {
        error: createLogger(clientRootLogger, "error"),
        warning: createLogger(clientRootLogger, "warning"),
        info: createLogger(clientRootLogger, "info"),
        verbose: createLogger(clientRootLogger, "verbose"),
    };
}
function patchLogMethod(parent, child) {
    child.log = (...args) => {
        parent.log(...args);
    };
}
function createLogger(parent, level) {
    const logger = Object.assign(parent.extend(level), {
        level,
    });
    patchLogMethod(parent, logger);
    if (shouldEnable(logger)) {
        const enabledNamespaces = _debug_js__WEBPACK_IMPORTED_MODULE_0__["default"].disable();
        _debug_js__WEBPACK_IMPORTED_MODULE_0__["default"].enable(enabledNamespaces + "," + logger.namespace);
    }
    registeredLoggers.add(logger);
    return logger;
}
function shouldEnable(logger) {
    return Boolean(azureLogLevel && levelMap[logger.level] <= levelMap[azureLogLevel]);
}
function isAzureLogLevel(logLevel) {
    return AZURE_LOG_LEVELS.includes(logLevel);
}
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@azure/logger/dist/browser/log.js":
/*!********************************************************!*\
  !*** ./node_modules/@azure/logger/dist/browser/log.js ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   log: () => (/* binding */ log)
/* harmony export */ });
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
function log(...args) {
    if (args.length > 0) {
        const firstArg = String(args[0]);
        if (firstArg.includes(":error")) {
            console.error(...args);
        }
        else if (firstArg.includes(":warning")) {
            console.warn(...args);
        }
        else if (firstArg.includes(":info")) {
            console.info(...args);
        }
        else if (firstArg.includes(":verbose")) {
            console.debug(...args);
        }
        else {
            console.debug(...args);
        }
    }
}
//# sourceMappingURL=log-browser.mjs.map

/***/ }),

/***/ "./node_modules/@azure/openai/dist-esm/src/OpenAIClient.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@azure/openai/dist-esm/src/OpenAIClient.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   OpenAIClient: () => (/* binding */ OpenAIClient)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.mjs");
/* harmony import */ var _azure_core_auth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @azure/core-auth */ "./node_modules/@azure/core-auth/dist/browser/index.js");
/* harmony import */ var _api_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./api/index.js */ "./node_modules/@azure/openai/dist-esm/src/api/OpenAIContext.js");
/* harmony import */ var _api_operations_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./api/operations.js */ "./node_modules/@azure/openai/dist-esm/src/api/operations.js");
/* harmony import */ var _api_policies_nonAzure_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./api/policies/nonAzure.js */ "./node_modules/@azure/openai/dist-esm/src/api/policies/nonAzure.js");
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.






function createOpenAIEndpoint(version) {
    return `https://api.openai.com/v${version}`;
}
function isCred(cred) {
    return (0,_azure_core_auth__WEBPACK_IMPORTED_MODULE_0__.isTokenCredential)(cred) || cred.key !== undefined;
}
/**
 * A client for interacting with Azure OpenAI.
 *
 * The client needs the endpoint of an OpenAI resource and an authentication
 * method such as an API key or token. The API key and endpoint can be found in
 * the OpenAI resource page. They will be located in the resource's Keys and Endpoint page.
 *
 * ### Examples for authentication:
 *
 * #### API Key
 *
 * ```js
 * import { OpenAIClient } from "@azure/openai";
 * import { AzureKeyCredential } from "@azure/core-auth";
 *
 * const endpoint = "<azure endpoint>";
 * const credential = new AzureKeyCredential("<api key>");
 *
 * const client = new OpenAIClient(endpoint, credential);
 * ```
 *
 * #### Azure Active Directory
 *
 * ```js
 * import { OpenAIClient } from "@azure/openai";
 * import { DefaultAzureCredential } from "@azure/identity";
 *
 * const endpoint = "<azure endpoint>";
 * const credential = new DefaultAzureCredential();
 *
 * const client = new OpenAIClient(endpoint, credential);
 * ```
 */
class OpenAIClient {
    constructor(endpointOrOpenAiKey, credOrOptions = {}, options = {}) {
        var _a, _b;
        this._isAzure = false;
        let opts;
        let endpoint;
        let cred;
        if (isCred(credOrOptions)) {
            endpoint = endpointOrOpenAiKey;
            cred = credOrOptions;
            opts = options;
            this._isAzure = true;
        }
        else {
            endpoint = createOpenAIEndpoint(1);
            cred = endpointOrOpenAiKey;
            const { credentials } = credOrOptions, restOpts = (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__rest)(credOrOptions, ["credentials"]);
            opts = Object.assign({ credentials: {
                    apiKeyHeaderName: (_a = credentials === null || credentials === void 0 ? void 0 : credentials.apiKeyHeaderName) !== null && _a !== void 0 ? _a : "Authorization",
                    scopes: credentials === null || credentials === void 0 ? void 0 : credentials.scopes,
                } }, restOpts);
        }
        this._client = (0,_api_index_js__WEBPACK_IMPORTED_MODULE_2__.createOpenAI)(endpoint, cred, Object.assign(Object.assign({}, opts), (this._isAzure
            ? {}
            : {
                additionalPolicies: [
                    ...((_b = opts.additionalPolicies) !== null && _b !== void 0 ? _b : []),
                    {
                        position: "perCall",
                        policy: (0,_api_policies_nonAzure_js__WEBPACK_IMPORTED_MODULE_3__.nonAzurePolicy)(),
                    },
                ],
            })));
    }
    setModel(model, options) {
        if (!this._isAzure) {
            options.model = model;
        }
    }
    // implementation
    async getAudioTranslation(deploymentName, fileContent, formatOrOptions, inputOptions) {
        const options = inputOptions !== null && inputOptions !== void 0 ? inputOptions : (typeof formatOrOptions === "string" ? {} : formatOrOptions !== null && formatOrOptions !== void 0 ? formatOrOptions : {});
        const response_format = typeof formatOrOptions === "string" ? formatOrOptions : undefined;
        this.setModel(deploymentName, options);
        if (response_format === undefined) {
            return (0,_api_operations_js__WEBPACK_IMPORTED_MODULE_4__.getAudioTranslation)(this._client, deploymentName, fileContent, options);
        }
        return (0,_api_operations_js__WEBPACK_IMPORTED_MODULE_4__.getAudioTranslation)(this._client, deploymentName, fileContent, response_format, options);
    }
    // implementation
    async getAudioTranscription(deploymentName, fileContent, formatOrOptions, inputOptions) {
        const options = inputOptions !== null && inputOptions !== void 0 ? inputOptions : (typeof formatOrOptions === "string" ? {} : formatOrOptions !== null && formatOrOptions !== void 0 ? formatOrOptions : {});
        const response_format = typeof formatOrOptions === "string" ? formatOrOptions : undefined;
        this.setModel(deploymentName, options);
        if (response_format === undefined) {
            return (0,_api_operations_js__WEBPACK_IMPORTED_MODULE_4__.getAudioTranscription)(this._client, deploymentName, fileContent, options);
        }
        return (0,_api_operations_js__WEBPACK_IMPORTED_MODULE_4__.getAudioTranscription)(this._client, deploymentName, fileContent, response_format, options);
    }
    /**
     * Gets completions for the provided input prompts.
     * Completions support a wide variety of tasks and generate text that continues from or "completes"
     * provided prompt data.
     */
    getCompletions(deploymentName, prompt, options = { requestOptions: {} }) {
        this.setModel(deploymentName, options);
        const { abortSignal, onResponse, requestOptions, tracingOptions } = options, rest = (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__rest)(options, ["abortSignal", "onResponse", "requestOptions", "tracingOptions"]);
        return (0,_api_operations_js__WEBPACK_IMPORTED_MODULE_4__.getCompletions)(this._client, deploymentName, Object.assign({ prompt }, rest), { abortSignal, onResponse, requestOptions, tracingOptions });
    }
    /**
     * Lists the completions tokens as they become available for a given prompt.
     * @param deploymentName - The name of the model deployment (when using Azure OpenAI) or model name (when using non-Azure OpenAI) to use for this request.
     * @param prompt - The prompt to use for this request.
     * @param options - The completions options for this completions request.
     * @returns An asynchronous iterable of completions tokens.
     */
    streamCompletions(deploymentName, prompt, options = {}) {
        this.setModel(deploymentName, options);
        return (0,_api_operations_js__WEBPACK_IMPORTED_MODULE_4__.streamCompletions)(this._client, deploymentName, prompt, options);
    }
    /**
     * Gets chat completions for the provided chat messages.
     * Completions support a wide variety of tasks and generate text that continues from or "completes"
     * provided prompt data.
     */
    getChatCompletions(deploymentName, messages, options = { requestOptions: {} }) {
        this.setModel(deploymentName, options);
        return (0,_api_operations_js__WEBPACK_IMPORTED_MODULE_4__.getChatCompletions)(this._client, deploymentName, messages, options);
    }
    /**
     * Lists the chat completions tokens as they become available for a chat context.
     * @param deploymentName - The name of the model deployment (when using Azure OpenAI) or model name (when using non-Azure OpenAI) to use for this request.
     * @param messages - The chat context messages to use for this request.
     * @param options - The chat completions options for this chat completions request.
     * @returns An asynchronous iterable of chat completions tokens.
     */
    streamChatCompletions(deploymentName, messages, options = { requestOptions: {} }) {
        this.setModel(deploymentName, options);
        return (0,_api_operations_js__WEBPACK_IMPORTED_MODULE_4__.streamChatCompletions)(this._client, deploymentName, messages, options);
    }
    /** Creates an image given a prompt. */
    getImages(deploymentName, prompt, options = { requestOptions: {} }) {
        this.setModel(deploymentName, options);
        const { abortSignal, onResponse, requestOptions, tracingOptions } = options, rest = (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__rest)(options, ["abortSignal", "onResponse", "requestOptions", "tracingOptions"]);
        return (0,_api_operations_js__WEBPACK_IMPORTED_MODULE_4__.getImageGenerations)(this._client, deploymentName, Object.assign({ prompt }, rest), { abortSignal, onResponse, requestOptions, tracingOptions });
    }
    /** Return the embeddings for a given prompt. */
    getEmbeddings(deploymentName, input, options = { requestOptions: {} }) {
        this.setModel(deploymentName, options);
        const { abortSignal, onResponse, requestOptions, tracingOptions } = options, rest = (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__rest)(options, ["abortSignal", "onResponse", "requestOptions", "tracingOptions"]);
        return (0,_api_operations_js__WEBPACK_IMPORTED_MODULE_4__.getEmbeddings)(this._client, deploymentName, Object.assign({ input }, rest), { abortSignal, onResponse, requestOptions, tracingOptions });
    }
}
//# sourceMappingURL=OpenAIClient.js.map

/***/ }),

/***/ "./node_modules/@azure/openai/dist-esm/src/api/OpenAIContext.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@azure/openai/dist-esm/src/api/OpenAIContext.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createOpenAI: () => (/* binding */ createOpenAI)
/* harmony export */ });
/* harmony import */ var _rest_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../rest/index.js */ "./node_modules/@azure/openai/dist-esm/src/rest/index.js");
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

function createOpenAI(endpoint, credential, options = {}) {
    const clientContext = (0,_rest_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])(endpoint, credential, options);
    return clientContext;
}
//# sourceMappingURL=OpenAIContext.js.map

/***/ }),

/***/ "./node_modules/@azure/openai/dist-esm/src/api/getSSEs.browser.js":
/*!************************************************************************!*\
  !*** ./node_modules/@azure/openai/dist-esm/src/api/getSSEs.browser.js ***!
  \************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getStream: () => (/* binding */ getStream)
/* harmony export */ });
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util.js */ "./node_modules/@azure/openai/dist-esm/src/api/util.js");
/* harmony import */ var _readableStreamUtils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./readableStreamUtils.js */ "./node_modules/@azure/openai/dist-esm/src/api/readableStreamUtils.js");
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.


async function getStream(response) {
    const { body, status } = await response.asBrowserStream();
    if (status !== "200" && body !== undefined) {
        const text = await (0,_readableStreamUtils_js__WEBPACK_IMPORTED_MODULE_0__.streamToText)(body);
        throw (0,_util_js__WEBPACK_IMPORTED_MODULE_1__.wrapError)(() => JSON.parse(text).error, "Error parsing response body");
    }
    if (!body)
        throw new Error("No stream found in response. Did you enable the stream option?");
    return body;
}
//# sourceMappingURL=getSSEs.browser.js.map

/***/ }),

/***/ "./node_modules/@azure/openai/dist-esm/src/api/oaiSse.js":
/*!***************************************************************!*\
  !*** ./node_modules/@azure/openai/dist-esm/src/api/oaiSse.js ***!
  \***************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getOaiSSEs: () => (/* binding */ getOaiSSEs)
/* harmony export */ });
/* harmony import */ var _getSSEs_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getSSEs.js */ "./node_modules/@azure/openai/dist-esm/src/api/getSSEs.browser.js");
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./util.js */ "./node_modules/@azure/openai/dist-esm/src/api/util.js");
/* harmony import */ var _azure_core_sse__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @azure/core-sse */ "./node_modules/@azure/core-sse/dist/browser/index.js");
/* harmony import */ var _readableStreamUtils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./readableStreamUtils.js */ "./node_modules/@azure/openai/dist-esm/src/api/readableStreamUtils.js");
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.




async function getOaiSSEs(response, toEvent) {
    const stringStream = await (0,_getSSEs_js__WEBPACK_IMPORTED_MODULE_1__.getStream)(response);
    const eventStream = (0,_azure_core_sse__WEBPACK_IMPORTED_MODULE_0__.createSseStream)(stringStream);
    const jsonParser = new TransformStream({
        transform: async (chunk, controller) => {
            if (chunk.data === "[DONE]") {
                return;
            }
            controller.enqueue(toEvent((0,_util_js__WEBPACK_IMPORTED_MODULE_2__.wrapError)(() => JSON.parse(chunk.data), "Error parsing an event. See 'cause' for more details")));
        },
    });
    /** TODO: remove these polyfills once all supported runtimes support them */
    return (0,_readableStreamUtils_js__WEBPACK_IMPORTED_MODULE_3__.polyfillStream)(eventStream.pipeThrough(jsonParser));
}
//# sourceMappingURL=oaiSse.js.map

/***/ }),

/***/ "./node_modules/@azure/openai/dist-esm/src/api/operations.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@azure/openai/dist-esm/src/api/operations.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   _getChatCompletionsDeserialize: () => (/* binding */ _getChatCompletionsDeserialize),
/* harmony export */   _getChatCompletionsSend: () => (/* binding */ _getChatCompletionsSend),
/* harmony export */   _getCompletionsDeserialize: () => (/* binding */ _getCompletionsDeserialize),
/* harmony export */   _getCompletionsSend: () => (/* binding */ _getCompletionsSend),
/* harmony export */   _getEmbeddingsDeserialize: () => (/* binding */ _getEmbeddingsDeserialize),
/* harmony export */   _getEmbeddingsSend: () => (/* binding */ _getEmbeddingsSend),
/* harmony export */   _getImageGenerationsDeserialize: () => (/* binding */ _getImageGenerationsDeserialize),
/* harmony export */   _getImageGenerationsSend: () => (/* binding */ _getImageGenerationsSend),
/* harmony export */   getAudioTranscription: () => (/* binding */ getAudioTranscription),
/* harmony export */   getAudioTranslation: () => (/* binding */ getAudioTranslation),
/* harmony export */   getChatCompletions: () => (/* binding */ getChatCompletions),
/* harmony export */   getChatCompletionsResult: () => (/* binding */ getChatCompletionsResult),
/* harmony export */   getCompletions: () => (/* binding */ getCompletions),
/* harmony export */   getCompletionsResult: () => (/* binding */ getCompletionsResult),
/* harmony export */   getEmbeddings: () => (/* binding */ getEmbeddings),
/* harmony export */   getImageGenerations: () => (/* binding */ getImageGenerations),
/* harmony export */   streamChatCompletions: () => (/* binding */ streamChatCompletions),
/* harmony export */   streamCompletions: () => (/* binding */ streamCompletions)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.mjs");
/* harmony import */ var _utils_serializeUtil_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils/serializeUtil.js */ "./node_modules/@azure/openai/dist-esm/src/utils/serializeUtil.js");
/* harmony import */ var _rest_index_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../rest/index.js */ "./node_modules/@azure/openai/dist-esm/src/rest/isUnexpected.js");
/* harmony import */ var _azure_rest_core_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @azure-rest/core-client */ "./node_modules/@azure-rest/core-client/dist/browser/index.js");
/* harmony import */ var _oaiSse_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./oaiSse.js */ "./node_modules/@azure/openai/dist-esm/src/api/oaiSse.js");
/* harmony import */ var _azure_core_rest_pipeline__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @azure/core-rest-pipeline */ "./node_modules/@azure/core-rest-pipeline/dist/browser/index.js");
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./util.js */ "./node_modules/@azure/openai/dist-esm/src/api/util.js");
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.







// implementation
async function getAudioTranscription(context, deploymentName, fileContent, formatOrOptions, inputOptions) {
    const options = inputOptions !== null && inputOptions !== void 0 ? inputOptions : (typeof formatOrOptions === "string" ? {} : formatOrOptions !== null && formatOrOptions !== void 0 ? formatOrOptions : {});
    const response_format = typeof formatOrOptions === "string" ? formatOrOptions : undefined;
    const { abortSignal, onResponse, requestOptions, tracingOptions } = options, rest = (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__rest)(options, ["abortSignal", "onResponse", "requestOptions", "tracingOptions"]);
    const { body, status } = await context
        .pathUnchecked("deployments/{deploymentName}/audio/transcriptions", deploymentName)
        .post(Object.assign(Object.assign({}, (0,_azure_rest_core_client__WEBPACK_IMPORTED_MODULE_0__.operationOptionsToRequestParameters)({
        abortSignal,
        onResponse,
        tracingOptions,
        requestOptions,
    })), { contentType: "multipart/form-data", body: Object.assign(Object.assign(Object.assign({}, (0,_util_js__WEBPACK_IMPORTED_MODULE_3__.snakeCaseKeys)(rest)), { file: (0,_azure_core_rest_pipeline__WEBPACK_IMPORTED_MODULE_1__.createFile)(fileContent, "placeholder.wav") }), (response_format ? { response_format } : {})) }));
    if (status !== "200") {
        throw body.error;
    }
    return response_format !== "verbose_json"
        ? body
        : (0,_util_js__WEBPACK_IMPORTED_MODULE_3__.camelCaseKeys)(body);
}
// implementation
async function getAudioTranslation(context, deploymentName, fileContent, formatOrOptions, inputOptions) {
    const options = inputOptions !== null && inputOptions !== void 0 ? inputOptions : (typeof formatOrOptions === "string" ? {} : formatOrOptions !== null && formatOrOptions !== void 0 ? formatOrOptions : {});
    const response_format = typeof formatOrOptions === "string" ? formatOrOptions : undefined;
    const { abortSignal, onResponse, requestOptions, tracingOptions } = options, rest = (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__rest)(options, ["abortSignal", "onResponse", "requestOptions", "tracingOptions"]);
    const { body, status } = await context
        .pathUnchecked("deployments/{deploymentName}/audio/translations", deploymentName)
        .post(Object.assign(Object.assign({}, (0,_azure_rest_core_client__WEBPACK_IMPORTED_MODULE_0__.operationOptionsToRequestParameters)({
        abortSignal,
        onResponse,
        tracingOptions,
        requestOptions,
    })), { contentType: "multipart/form-data", body: Object.assign(Object.assign(Object.assign({}, (0,_util_js__WEBPACK_IMPORTED_MODULE_3__.snakeCaseKeys)(rest)), { file: (0,_azure_core_rest_pipeline__WEBPACK_IMPORTED_MODULE_1__.createFile)(fileContent, "placeholder.wav") }), (response_format ? { response_format } : {})) }));
    if (status !== "200") {
        throw body.error;
    }
    return response_format !== "verbose_json"
        ? body
        : (0,_util_js__WEBPACK_IMPORTED_MODULE_3__.camelCaseKeys)(body);
}
function _getCompletionsSend(context, deploymentId, body, options = { requestOptions: {} }) {
    return context.path("/deployments/{deploymentId}/completions", deploymentId).post(Object.assign(Object.assign({}, (0,_azure_rest_core_client__WEBPACK_IMPORTED_MODULE_0__.operationOptionsToRequestParameters)(options)), { body: {
            prompt: body["prompt"],
            max_tokens: body["maxTokens"],
            temperature: body["temperature"],
            top_p: body["topP"],
            logit_bias: body["logitBias"],
            user: body["user"],
            n: body["n"],
            logprobs: body["logprobs"],
            suffix: body["suffix"],
            echo: body["echo"],
            stop: body["stop"],
            presence_penalty: body["presencePenalty"],
            frequency_penalty: body["frequencyPenalty"],
            best_of: body["bestOf"],
            stream: body["stream"],
            model: body["model"],
        } }));
}
async function _getCompletionsDeserialize(result) {
    if ((0,_rest_index_js__WEBPACK_IMPORTED_MODULE_4__.isUnexpected)(result)) {
        throw result.body.error;
    }
    return getCompletionsResult(result.body);
}
function getCompletionsResult(body) {
    const { created, choices, prompt_filter_results, prompt_annotations } = body, rest = (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__rest)(body, ["created", "choices", "prompt_filter_results", "prompt_annotations"]);
    return Object.assign(Object.assign(Object.assign(Object.assign({}, (0,_util_js__WEBPACK_IMPORTED_MODULE_3__.camelCaseKeys)(rest)), { created: new Date(created) }), {
        promptFilterResults: getContentFilterResultsForPrompt({
            prompt_filter_results,
            prompt_annotations,
        }),
    }), { choices: choices.map((_a) => {
            var { content_filter_results } = _a, choice = (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__rest)(_a, ["content_filter_results"]);
            return (Object.assign(Object.assign({}, (0,_util_js__WEBPACK_IMPORTED_MODULE_3__.camelCaseKeys)(choice)), (!content_filter_results
                ? {}
                : {
                    contentFilterResults: parseContentFilterResultsForChoiceOutput(content_filter_results),
                })));
        }) });
}
/**
 * Gets completions for the provided input prompts.
 * Completions support a wide variety of tasks and generate text that continues from or "completes"
 * provided prompt data.
 */
async function getCompletions(context, deploymentId, body, options = { requestOptions: {} }) {
    const result = await _getCompletionsSend(context, deploymentId, body, options);
    return _getCompletionsDeserialize(result);
}
function streamCompletions(context, deploymentName, prompt, options = { requestOptions: {} }) {
    const { abortSignal, onResponse, requestOptions, tracingOptions } = options, rest = (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__rest)(options, ["abortSignal", "onResponse", "requestOptions", "tracingOptions"]);
    const response = _getCompletionsSend(context, deploymentName, Object.assign(Object.assign({ prompt }, rest), { stream: true }), { abortSignal, onResponse, requestOptions, tracingOptions });
    return (0,_oaiSse_js__WEBPACK_IMPORTED_MODULE_5__.getOaiSSEs)(response, getCompletionsResult);
}
function _getChatCompletionsSend(context, deploymentId, body, options = { requestOptions: {} }) {
    var _a, _b, _c, _d, _e, _f, _g;
    return context.path("/deployments/{deploymentId}/chat/completions", deploymentId).post(Object.assign(Object.assign({}, (0,_azure_rest_core_client__WEBPACK_IMPORTED_MODULE_0__.operationOptionsToRequestParameters)(options)), { body: {
            model: body["model"],
            stream: body["stream"],
            max_tokens: body["maxTokens"],
            temperature: body["temperature"],
            top_p: body["topP"],
            logit_bias: body["logitBias"],
            user: body["user"],
            n: body["n"],
            stop: body["stop"],
            presence_penalty: body["presencePenalty"],
            frequency_penalty: body["frequencyPenalty"],
            data_sources: body["dataSources"] === undefined
                ? body["dataSources"]
                : body["dataSources"].map((p) => (0,_utils_serializeUtil_js__WEBPACK_IMPORTED_MODULE_6__.serializeAzureChatExtensionConfigurationUnion)(p)),
            enhancements: !body.enhancements
                ? undefined
                : {
                    grounding: !((_a = body.enhancements) === null || _a === void 0 ? void 0 : _a.grounding)
                        ? undefined
                        : { enabled: (_c = (_b = body.enhancements) === null || _b === void 0 ? void 0 : _b.grounding) === null || _c === void 0 ? void 0 : _c["enabled"] },
                    ocr: !((_d = body.enhancements) === null || _d === void 0 ? void 0 : _d.ocr)
                        ? undefined
                        : { enabled: (_f = (_e = body.enhancements) === null || _e === void 0 ? void 0 : _e.ocr) === null || _f === void 0 ? void 0 : _f["enabled"] },
                },
            seed: body["seed"],
            logprobs: body["logprobs"],
            top_logprobs: body["topLogprobs"],
            response_format: !body.responseFormat ? undefined : { type: (_g = body.responseFormat) === null || _g === void 0 ? void 0 : _g["type"] },
            tool_choice: body["toolChoice"],
            tools: body["tools"],
            functions: body["functions"] === undefined
                ? body["functions"]
                : body["functions"].map((p) => ({
                    name: p["name"],
                    description: p["description"],
                    parameters: p["parameters"],
                })),
            function_call: body["functionCall"],
            messages: body["messages"].map((p) => (0,_utils_serializeUtil_js__WEBPACK_IMPORTED_MODULE_6__.serializeChatRequestMessageUnion)(p)),
        } }));
}
async function _getChatCompletionsDeserialize(result) {
    if ((0,_rest_index_js__WEBPACK_IMPORTED_MODULE_4__.isUnexpected)(result)) {
        throw result.body.error;
    }
    return getChatCompletionsResult(result.body);
}
function getChatCompletionsResult(body) {
    const { created, choices, prompt_filter_results, prompt_annotations, usage } = body, rest = (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__rest)(body, ["created", "choices", "prompt_filter_results", "prompt_annotations", "usage"]);
    return Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (0,_util_js__WEBPACK_IMPORTED_MODULE_3__.camelCaseKeys)(rest)), { created: new Date(created) }), {
        promptFilterResults: getContentFilterResultsForPrompt({
            prompt_filter_results,
            prompt_annotations,
        }),
    }), (!usage
        ? {}
        : {
            usage: {
                completionTokens: usage["completion_tokens"],
                promptTokens: usage["prompt_tokens"],
                totalTokens: usage["total_tokens"],
            },
        })), { choices: !choices
            ? []
            : choices.map((_a) => {
                var { content_filter_results } = _a, choice = (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__rest)(_a, ["content_filter_results"]);
                return (Object.assign(Object.assign({}, (0,_util_js__WEBPACK_IMPORTED_MODULE_3__.camelCaseKeys)(choice)), (!content_filter_results
                    ? {}
                    : {
                        contentFilterResults: parseContentFilterResultsForChoiceOutput(content_filter_results),
                    })));
            }) });
}
/**
 * Gets chat completions for the provided chat messages.
 * Completions support a wide variety of tasks and generate text that continues from or "completes"
 * provided prompt data.
 */
async function getChatCompletions(context, deploymentName, messages, options = { requestOptions: {} }) {
    const result = await _getChatCompletionsSendX(context, deploymentName, messages, options);
    return _getChatCompletionsDeserialize(result);
}
function _getChatCompletionsSendX(context, deploymentName, messages, options = { requestOptions: {} }) {
    const { azureExtensionOptions, abortSignal, onResponse, requestOptions, tracingOptions } = options, rest = (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__rest)(options, ["azureExtensionOptions", "abortSignal", "onResponse", "requestOptions", "tracingOptions"]);
    const coreOptions = {
        abortSignal,
        onResponse,
        requestOptions,
        tracingOptions,
    };
    const azure = Object.assign(Object.assign({}, (!(azureExtensionOptions === null || azureExtensionOptions === void 0 ? void 0 : azureExtensionOptions.extensions)
        ? {}
        : { dataSources: azureExtensionOptions.extensions })), (!(azureExtensionOptions === null || azureExtensionOptions === void 0 ? void 0 : azureExtensionOptions.enhancements)
        ? {}
        : { enhancements: azureExtensionOptions.enhancements }));
    return _getChatCompletionsSend(context, deploymentName, Object.assign(Object.assign({ messages }, rest), azure), coreOptions);
}
function streamChatCompletions(context, deploymentName, messages, options = { requestOptions: {} }) {
    const response = _getChatCompletionsSendX(context, deploymentName, messages, Object.assign(Object.assign({}, options), { stream: true }));
    return (0,_oaiSse_js__WEBPACK_IMPORTED_MODULE_5__.getOaiSSEs)(response, getChatCompletionsResult);
}
function _getImageGenerationsSend(context, deploymentId, body, options = { requestOptions: {} }) {
    return context.path("/deployments/{deploymentId}/images/generations", deploymentId).post(Object.assign(Object.assign({}, (0,_azure_rest_core_client__WEBPACK_IMPORTED_MODULE_0__.operationOptionsToRequestParameters)(options)), { body: {
            model: body["model"],
            prompt: body["prompt"],
            n: body["n"],
            size: body["size"],
            response_format: body["responseFormat"],
            quality: body["quality"],
            style: body["style"],
            user: body["user"],
        } }));
}
async function _getImageGenerationsDeserialize(result) {
    if ((0,_rest_index_js__WEBPACK_IMPORTED_MODULE_4__.isUnexpected)(result)) {
        throw result.body.error;
    }
    return {
        created: new Date(result.body["created"]),
        data: result.body["data"].map((p) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25;
            return ({
                url: p["url"],
                base64Data: p["b64_json"],
                contentFilterResults: !p.content_filter_results
                    ? undefined
                    : {
                        sexual: !((_a = p.content_filter_results) === null || _a === void 0 ? void 0 : _a.sexual)
                            ? undefined
                            : {
                                severity: (_c = (_b = p.content_filter_results) === null || _b === void 0 ? void 0 : _b.sexual) === null || _c === void 0 ? void 0 : _c["severity"],
                                filtered: (_e = (_d = p.content_filter_results) === null || _d === void 0 ? void 0 : _d.sexual) === null || _e === void 0 ? void 0 : _e["filtered"],
                            },
                        violence: !((_f = p.content_filter_results) === null || _f === void 0 ? void 0 : _f.violence)
                            ? undefined
                            : {
                                severity: (_h = (_g = p.content_filter_results) === null || _g === void 0 ? void 0 : _g.violence) === null || _h === void 0 ? void 0 : _h["severity"],
                                filtered: (_k = (_j = p.content_filter_results) === null || _j === void 0 ? void 0 : _j.violence) === null || _k === void 0 ? void 0 : _k["filtered"],
                            },
                        hate: !((_l = p.content_filter_results) === null || _l === void 0 ? void 0 : _l.hate)
                            ? undefined
                            : {
                                severity: (_o = (_m = p.content_filter_results) === null || _m === void 0 ? void 0 : _m.hate) === null || _o === void 0 ? void 0 : _o["severity"],
                                filtered: (_q = (_p = p.content_filter_results) === null || _p === void 0 ? void 0 : _p.hate) === null || _q === void 0 ? void 0 : _q["filtered"],
                            },
                        selfHarm: !((_r = p.content_filter_results) === null || _r === void 0 ? void 0 : _r.self_harm)
                            ? undefined
                            : {
                                severity: (_t = (_s = p.content_filter_results) === null || _s === void 0 ? void 0 : _s.self_harm) === null || _t === void 0 ? void 0 : _t["severity"],
                                filtered: (_v = (_u = p.content_filter_results) === null || _u === void 0 ? void 0 : _u.self_harm) === null || _v === void 0 ? void 0 : _v["filtered"],
                            },
                    },
                revisedPrompt: p["revised_prompt"],
                promptFilterResults: !p.prompt_filter_results
                    ? undefined
                    : {
                        sexual: !((_w = p.prompt_filter_results) === null || _w === void 0 ? void 0 : _w.sexual)
                            ? undefined
                            : {
                                severity: (_y = (_x = p.prompt_filter_results) === null || _x === void 0 ? void 0 : _x.sexual) === null || _y === void 0 ? void 0 : _y["severity"],
                                filtered: (_0 = (_z = p.prompt_filter_results) === null || _z === void 0 ? void 0 : _z.sexual) === null || _0 === void 0 ? void 0 : _0["filtered"],
                            },
                        violence: !((_1 = p.prompt_filter_results) === null || _1 === void 0 ? void 0 : _1.violence)
                            ? undefined
                            : {
                                severity: (_3 = (_2 = p.prompt_filter_results) === null || _2 === void 0 ? void 0 : _2.violence) === null || _3 === void 0 ? void 0 : _3["severity"],
                                filtered: (_5 = (_4 = p.prompt_filter_results) === null || _4 === void 0 ? void 0 : _4.violence) === null || _5 === void 0 ? void 0 : _5["filtered"],
                            },
                        hate: !((_6 = p.prompt_filter_results) === null || _6 === void 0 ? void 0 : _6.hate)
                            ? undefined
                            : {
                                severity: (_8 = (_7 = p.prompt_filter_results) === null || _7 === void 0 ? void 0 : _7.hate) === null || _8 === void 0 ? void 0 : _8["severity"],
                                filtered: (_10 = (_9 = p.prompt_filter_results) === null || _9 === void 0 ? void 0 : _9.hate) === null || _10 === void 0 ? void 0 : _10["filtered"],
                            },
                        selfHarm: !((_11 = p.prompt_filter_results) === null || _11 === void 0 ? void 0 : _11.self_harm)
                            ? undefined
                            : {
                                severity: (_13 = (_12 = p.prompt_filter_results) === null || _12 === void 0 ? void 0 : _12.self_harm) === null || _13 === void 0 ? void 0 : _13["severity"],
                                filtered: (_15 = (_14 = p.prompt_filter_results) === null || _14 === void 0 ? void 0 : _14.self_harm) === null || _15 === void 0 ? void 0 : _15["filtered"],
                            },
                        profanity: !((_16 = p.prompt_filter_results) === null || _16 === void 0 ? void 0 : _16.profanity)
                            ? undefined
                            : {
                                filtered: (_18 = (_17 = p.prompt_filter_results) === null || _17 === void 0 ? void 0 : _17.profanity) === null || _18 === void 0 ? void 0 : _18["filtered"],
                                detected: (_20 = (_19 = p.prompt_filter_results) === null || _19 === void 0 ? void 0 : _19.profanity) === null || _20 === void 0 ? void 0 : _20["detected"],
                            },
                        jailbreak: !((_21 = p.prompt_filter_results) === null || _21 === void 0 ? void 0 : _21.jailbreak)
                            ? undefined
                            : {
                                filtered: (_23 = (_22 = p.prompt_filter_results) === null || _22 === void 0 ? void 0 : _22.jailbreak) === null || _23 === void 0 ? void 0 : _23["filtered"],
                                detected: (_25 = (_24 = p.prompt_filter_results) === null || _24 === void 0 ? void 0 : _24.jailbreak) === null || _25 === void 0 ? void 0 : _25["detected"],
                            },
                    },
            });
        }),
    };
}
/** Creates an image given a prompt. */
async function getImageGenerations(context, deploymentId, body, options = { requestOptions: {} }) {
    const result = await _getImageGenerationsSend(context, deploymentId, body, options);
    return _getImageGenerationsDeserialize(result);
}
function _getEmbeddingsSend(context, deploymentId, body, options = { requestOptions: {} }) {
    return context.path("/deployments/{deploymentId}/embeddings", deploymentId).post(Object.assign(Object.assign({}, (0,_azure_rest_core_client__WEBPACK_IMPORTED_MODULE_0__.operationOptionsToRequestParameters)(options)), { body: {
            user: body["user"],
            model: body["model"],
            input: body["input"],
            dimensions: body["dimensions"],
        } }));
}
async function _getEmbeddingsDeserialize(result) {
    if ((0,_rest_index_js__WEBPACK_IMPORTED_MODULE_4__.isUnexpected)(result)) {
        throw result.body.error;
    }
    return {
        data: result.body["data"].map((p) => ({
            embedding: p["embedding"],
            index: p["index"],
        })),
        usage: {
            promptTokens: result.body.usage["prompt_tokens"],
            totalTokens: result.body.usage["total_tokens"],
        },
    };
}
/** Return the embeddings for a given prompt. */
async function getEmbeddings(context, deploymentId, body, options = { requestOptions: {} }) {
    const result = await _getEmbeddingsSend(context, deploymentId, body, options);
    return _getEmbeddingsDeserialize(result);
}
function getContentFilterResultsForPrompt({ prompt_annotations, prompt_filter_results, }) {
    const res = prompt_filter_results !== null && prompt_filter_results !== void 0 ? prompt_filter_results : prompt_annotations;
    return res === null || res === void 0 ? void 0 : res.map((_a) => {
        var { content_filter_results } = _a, rest = (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__rest)(_a, ["content_filter_results"]);
        return (Object.assign(Object.assign({}, (0,_util_js__WEBPACK_IMPORTED_MODULE_3__.camelCaseKeys)(rest)), { contentFilterResults: parseContentFilterResultDetailsForPromptOutput(content_filter_results) }));
    });
}
function parseContentFilterResultDetailsForPromptOutput(_a = {}) {
    var { error } = _a, rest = (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__rest)(_a, ["error"]);
    return error ? parseError(error) : (0,_util_js__WEBPACK_IMPORTED_MODULE_3__.camelCaseKeys)(rest);
}
function parseError(error) {
    var _a;
    return {
        error: Object.assign(Object.assign({}, error), { details: (_a = error["details"]) !== null && _a !== void 0 ? _a : [] }),
    };
}
function parseContentFilterResultsForChoiceOutput(_a = {}) {
    var _b;
    var { error } = _a, successResult = (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__rest)(_a, ["error"]);
    return error
        ? {
            error: Object.assign(Object.assign({}, error), { details: (_b = error["details"]) !== null && _b !== void 0 ? _b : [] }),
        }
        : (0,_util_js__WEBPACK_IMPORTED_MODULE_3__.camelCaseKeys)(successResult);
}
//# sourceMappingURL=operations.js.map

/***/ }),

/***/ "./node_modules/@azure/openai/dist-esm/src/api/policies/nonAzure.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@azure/openai/dist-esm/src/api/policies/nonAzure.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   nonAzurePolicy: () => (/* binding */ nonAzurePolicy)
/* harmony export */ });
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
function nonAzurePolicy() {
    const policy = {
        name: "openAiEndpoint",
        sendRequest: (request, next) => {
            const obj = new URL(request.url);
            const parts = obj.pathname.split("/");
            switch (parts[parts.length - 1]) {
                case "completions":
                    if (parts[parts.length - 2] === "chat") {
                        obj.pathname = `${parts[1]}/chat/completions`;
                    }
                    else {
                        obj.pathname = `${parts[1]}/completions`;
                    }
                    break;
                case "embeddings":
                    obj.pathname = `${parts[1]}/embeddings`;
                    break;
                case "generations":
                    if (parts[parts.length - 2] === "images") {
                        obj.pathname = `${parts[1]}/images/generations`;
                    }
                    else {
                        throw new Error("Unexpected path");
                    }
                    break;
                case "transcriptions":
                    obj.pathname = `${parts[1]}/audio/transcriptions`;
                    break;
                case "translations":
                    obj.pathname = `${parts[1]}/audio/translations`;
                    break;
            }
            obj.searchParams.delete("api-version");
            request.url = obj.toString();
            return next(request);
        },
    };
    return policy;
}
//# sourceMappingURL=nonAzure.js.map

/***/ }),

/***/ "./node_modules/@azure/openai/dist-esm/src/api/readableStreamUtils.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@azure/openai/dist-esm/src/api/readableStreamUtils.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   polyfillStream: () => (/* binding */ polyfillStream),
/* harmony export */   streamToText: () => (/* binding */ streamToText)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.mjs");
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

function polyfillStream(stream) {
    makeAsyncIterable(stream);
    return stream;
}
function makeAsyncIterable(webStream) {
    if (!webStream[Symbol.asyncIterator]) {
        webStream[Symbol.asyncIterator] = () => toAsyncIterable(webStream);
    }
    if (!webStream.values) {
        webStream.values = () => toAsyncIterable(webStream);
    }
}
function toAsyncIterable(stream) {
    return (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__asyncGenerator)(this, arguments, function* toAsyncIterable_1() {
        const reader = stream.getReader();
        try {
            while (true) {
                const { value, done } = yield (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__await)(reader.read());
                if (done) {
                    return yield (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__await)(void 0);
                }
                yield yield (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__await)(value);
            }
        }
        finally {
            const cancelPromise = reader.cancel();
            reader.releaseLock();
            yield (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__await)(cancelPromise);
        }
    });
}
async function streamToText(stream) {
    const reader = stream.getReader();
    const buffers = [];
    let length = 0;
    try {
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const { value, done } = await reader.read();
            if (done) {
                return new TextDecoder().decode(concatBuffers(buffers, length));
            }
            length += value.length;
            buffers.push(value);
        }
    }
    finally {
        reader.releaseLock();
    }
}
function getBuffersLength(buffers) {
    return buffers.reduce((acc, curr) => acc + curr.length, 0);
}
function concatBuffers(buffers, len) {
    const length = len !== null && len !== void 0 ? len : getBuffersLength(buffers);
    const res = new Uint8Array(length);
    for (let i = 0, pos = 0; i < buffers.length; i++) {
        const buffer = buffers[i];
        res.set(buffer, pos);
        pos += buffer.length;
    }
    return res;
}
//# sourceMappingURL=readableStreamUtils.js.map

/***/ }),

/***/ "./node_modules/@azure/openai/dist-esm/src/api/util.js":
/*!*************************************************************!*\
  !*** ./node_modules/@azure/openai/dist-esm/src/api/util.js ***!
  \*************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   camelCaseKeys: () => (/* binding */ camelCaseKeys),
/* harmony export */   snakeCaseKeys: () => (/* binding */ snakeCaseKeys),
/* harmony export */   wrapError: () => (/* binding */ wrapError)
/* harmony export */ });
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
function wrapError(f, message) {
    try {
        const result = f();
        return result;
    }
    catch (cause) {
        throw new Error(`${message}: ${cause}`, { cause });
    }
}
function camelCaseKeys(obj) {
    if (typeof obj !== "object" || !obj)
        return obj;
    if (Array.isArray(obj)) {
        return obj.map((v) => camelCaseKeys(v));
    }
    else {
        for (const key of Object.keys(obj)) {
            const value = obj[key];
            const newKey = tocamelCase(key);
            if (newKey !== key) {
                delete obj[key];
            }
            obj[newKey] =
                typeof obj[newKey] === "object" ? camelCaseKeys(value) : value;
        }
        return obj;
    }
}
function snakeCaseKeys(obj) {
    if (typeof obj !== "object" || !obj)
        return obj;
    if (Array.isArray(obj)) {
        return obj.map((v) => snakeCaseKeys(v));
    }
    else {
        for (const key of Object.keys(obj)) {
            const value = obj[key];
            const newKey = toSnakeCase(key);
            if (newKey !== key) {
                delete obj[key];
            }
            obj[newKey] =
                typeof obj[newKey] === "object" ? snakeCaseKeys(value) : value;
        }
        return obj;
    }
}
function tocamelCase(str) {
    return str
        .toLowerCase()
        .replace(/([_][a-z])/g, (group) => group.toUpperCase().replace("_", ""));
}
function toSnakeCase(str) {
    return str
        .replace(/([A-Z])/g, (group) => `_${group.toLowerCase()}`)
        .replace(/^_/, "");
}
//# sourceMappingURL=util.js.map

/***/ }),

/***/ "./node_modules/@azure/openai/dist-esm/src/logger.js":
/*!***********************************************************!*\
  !*** ./node_modules/@azure/openai/dist-esm/src/logger.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   logger: () => (/* binding */ logger)
/* harmony export */ });
/* harmony import */ var _azure_logger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @azure/logger */ "./node_modules/@azure/logger/dist/browser/index.js");
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

const logger = (0,_azure_logger__WEBPACK_IMPORTED_MODULE_0__.createClientLogger)("openai");
//# sourceMappingURL=logger.js.map

/***/ }),

/***/ "./node_modules/@azure/openai/dist-esm/src/rest/index.js":
/*!***************************************************************!*\
  !*** ./node_modules/@azure/openai/dist-esm/src/rest/index.js ***!
  \***************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   isUnexpected: () => (/* reexport safe */ _isUnexpected_js__WEBPACK_IMPORTED_MODULE_0__.isUnexpected)
/* harmony export */ });
/* harmony import */ var _openAIClient_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./openAIClient.js */ "./node_modules/@azure/openai/dist-esm/src/rest/openAIClient.js");
/* harmony import */ var _isUnexpected_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isUnexpected.js */ "./node_modules/@azure/openai/dist-esm/src/rest/isUnexpected.js");
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.








/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_openAIClient_js__WEBPACK_IMPORTED_MODULE_1__["default"]);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@azure/openai/dist-esm/src/rest/isUnexpected.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@azure/openai/dist-esm/src/rest/isUnexpected.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isUnexpected: () => (/* binding */ isUnexpected)
/* harmony export */ });
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
const responseMap = {
    "POST /deployments/{deploymentId}/audio/transcriptions": ["200"],
    "POST /deployments/{deploymentId}/audio/translations": ["200"],
    "POST /deployments/{deploymentId}/completions": ["200"],
    "POST /deployments/{deploymentId}/chat/completions": ["200"],
    "POST /deployments/{deploymentId}/images/generations": ["200"],
    "POST /deployments/{deploymentId}/embeddings": ["200"],
    "GET /operations/images/{operationId}": ["200"],
    "POST /images/generations:submit": ["202"],
    "GET /images/generations:submit": ["200", "202"],
};
function isUnexpected(response) {
    const lroOriginal = response.headers["x-ms-original-url"];
    const url = new URL(lroOriginal !== null && lroOriginal !== void 0 ? lroOriginal : response.request.url);
    const method = response.request.method;
    let pathDetails = responseMap[`${method} ${url.pathname}`];
    if (!pathDetails) {
        pathDetails = getParametrizedPathSuccess(method, url.pathname);
    }
    return !pathDetails.includes(response.status);
}
function getParametrizedPathSuccess(method, path) {
    var _a, _b, _c, _d;
    const pathParts = path.split("/");
    // Traverse list to match the longest candidate
    // matchedLen: the length of candidate path
    // matchedValue: the matched status code array
    let matchedLen = -1, matchedValue = [];
    // Iterate the responseMap to find a match
    for (const [key, value] of Object.entries(responseMap)) {
        // Extracting the path from the map key which is in format
        // GET /path/foo
        if (!key.startsWith(method)) {
            continue;
        }
        const candidatePath = getPathFromMapKey(key);
        // Get each part of the url path
        const candidateParts = candidatePath.split("/");
        // track if we have found a match to return the values found.
        let found = true;
        for (let i = candidateParts.length - 1, j = pathParts.length - 1; i >= 1 && j >= 1; i--, j--) {
            if (((_a = candidateParts[i]) === null || _a === void 0 ? void 0 : _a.startsWith("{")) && ((_b = candidateParts[i]) === null || _b === void 0 ? void 0 : _b.indexOf("}")) !== -1) {
                const start = candidateParts[i].indexOf("}") + 1, end = (_c = candidateParts[i]) === null || _c === void 0 ? void 0 : _c.length;
                // If the current part of the candidate is a "template" part
                // Try to use the suffix of pattern to match the path
                // {guid} ==> $
                // {guid}:export ==> :export$
                const isMatched = new RegExp(`${(_d = candidateParts[i]) === null || _d === void 0 ? void 0 : _d.slice(start, end)}`).test(pathParts[j] || "");
                if (!isMatched) {
                    found = false;
                    break;
                }
                continue;
            }
            // If the candidate part is not a template and
            // the parts don't match mark the candidate as not found
            // to move on with the next candidate path.
            if (candidateParts[i] !== pathParts[j]) {
                found = false;
                break;
            }
        }
        // We finished evaluating the current candidate parts
        // Update the matched value if and only if we found the longer pattern
        if (found && candidatePath.length > matchedLen) {
            matchedLen = candidatePath.length;
            matchedValue = value;
        }
    }
    return matchedValue;
}
function getPathFromMapKey(mapKey) {
    const pathStart = mapKey.indexOf("/");
    return mapKey.slice(pathStart);
}
//# sourceMappingURL=isUnexpected.js.map

/***/ }),

/***/ "./node_modules/@azure/openai/dist-esm/src/rest/openAIClient.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@azure/openai/dist-esm/src/rest/openAIClient.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ createClient)
/* harmony export */ });
/* harmony import */ var _azure_rest_core_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @azure-rest/core-client */ "./node_modules/@azure-rest/core-client/dist/browser/index.js");
/* harmony import */ var _logger_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../logger.js */ "./node_modules/@azure/openai/dist-esm/src/logger.js");
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.


/**
 * Initialize a new instance of `OpenAIContext`
 * @param endpoint - Supported Cognitive Services endpoints (protocol and hostname, for example:
 * https://westus.api.cognitive.microsoft.com).
 * @param credentials - uniquely identify client credential
 * @param options - the parameter for all optional parameters
 */
function createClient(endpoint, credentials, options = {}) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const baseUrl = (_a = options.baseUrl) !== null && _a !== void 0 ? _a : `${endpoint}/openai`;
    options.apiVersion = (_b = options.apiVersion) !== null && _b !== void 0 ? _b : "2024-03-01-preview";
    const userAgentInfo = `azsdk-js-openai-rest/1.0.0-beta.12`;
    const userAgentPrefix = options.userAgentOptions && options.userAgentOptions.userAgentPrefix
        ? `${options.userAgentOptions.userAgentPrefix} ${userAgentInfo}`
        : `${userAgentInfo}`;
    options = Object.assign(Object.assign({}, options), { userAgentOptions: {
            userAgentPrefix,
        }, loggingOptions: {
            logger: (_d = (_c = options.loggingOptions) === null || _c === void 0 ? void 0 : _c.logger) !== null && _d !== void 0 ? _d : _logger_js__WEBPACK_IMPORTED_MODULE_1__.logger.info,
        }, credentials: {
            scopes: (_f = (_e = options.credentials) === null || _e === void 0 ? void 0 : _e.scopes) !== null && _f !== void 0 ? _f : ["https://cognitiveservices.azure.com/.default"],
            apiKeyHeaderName: (_h = (_g = options.credentials) === null || _g === void 0 ? void 0 : _g.apiKeyHeaderName) !== null && _h !== void 0 ? _h : "api-key",
        } });
    const client = (0,_azure_rest_core_client__WEBPACK_IMPORTED_MODULE_0__.getClient)(baseUrl, credentials, options);
    return client;
}
//# sourceMappingURL=openAIClient.js.map

/***/ }),

/***/ "./node_modules/@azure/openai/dist-esm/src/utils/serializeUtil.js":
/*!************************************************************************!*\
  !*** ./node_modules/@azure/openai/dist-esm/src/utils/serializeUtil.js ***!
  \************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   serializeAzureChatExtensionConfigurationUnion: () => (/* binding */ serializeAzureChatExtensionConfigurationUnion),
/* harmony export */   serializeChatMessageContentItemUnion: () => (/* binding */ serializeChatMessageContentItemUnion),
/* harmony export */   serializeChatRequestMessageUnion: () => (/* binding */ serializeChatRequestMessageUnion),
/* harmony export */   serializeOnYourDataAuthenticationOptionsUnion: () => (/* binding */ serializeOnYourDataAuthenticationOptionsUnion),
/* harmony export */   serializeOnYourDataVectorizationSourceUnion: () => (/* binding */ serializeOnYourDataVectorizationSourceUnion)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.mjs");
/* harmony import */ var _api_util_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../api/util.js */ "./node_modules/@azure/openai/dist-esm/src/api/util.js");
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.


/** serialize function for ChatRequestUserMessage */
function serializeChatRequestUserMessage(obj) {
    return {
        role: obj["role"],
        content: typeof obj["content"] === "string"
            ? obj["content"]
            : obj["content"].map(serializeChatRequestContentItemUnion),
        name: obj["name"],
    };
}
/** serialize function for ChatMessageImageContentItem */
function serializeChatRequestContentItemUnion(obj) {
    switch (obj.type) {
        case "image_url":
            return serializeChatMessageImageContentItem(obj);
        default:
            return obj;
    }
}
/** serialize function for ChatRequestAssistantMessage */
function serializeChatRequestAssistantMessage(obj) {
    if (obj.content === undefined) {
        obj.content = null;
    }
    const { functionCall, toolCalls } = obj, rest = (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__rest)(obj, ["functionCall", "toolCalls"]);
    return Object.assign(Object.assign(Object.assign({}, (0,_api_util_js__WEBPACK_IMPORTED_MODULE_1__.snakeCaseKeys)(rest)), (!toolCalls || toolCalls.length === 0 ? {} : { tool_calls: toolCalls })), (functionCall ? { function_call: functionCall } : {}));
}
/** serialize function for ChatRequestToolMessage */
function serializeChatRequestToolMessage(obj) {
    return {
        role: obj["role"],
        content: obj["content"],
        tool_call_id: obj["toolCallId"],
    };
}
/** serialize function for ChatRequestMessageUnion */
function serializeChatRequestMessageUnion(obj) {
    switch (obj.role) {
        case "user":
            return serializeChatRequestUserMessage(obj);
        case "assistant":
            return serializeChatRequestAssistantMessage(obj);
        case "tool":
            return serializeChatRequestToolMessage(obj);
        default:
            return obj;
    }
}
/** serialize function for ChatMessageImageContentItem */
function serializeChatMessageImageContentItem(obj) {
    return {
        type: obj["type"],
        image_url: { url: obj.imageUrl["url"], detail: obj.imageUrl["detail"] },
    };
}
/** serialize function for ChatMessageContentItemUnion */
function serializeChatMessageContentItemUnion(obj) {
    switch (obj.type) {
        case "image_url":
            return serializeChatMessageImageContentItem(obj);
        default:
            return obj;
    }
}
/** serialize function for AzureSearchChatExtensionConfiguration */
function serializeAzureSearchChatExtensionConfiguration(obj) {
    var _a, _b, _c, _d, _e, _f, _g;
    return {
        type: obj["type"],
        parameters: {
            authentication: !obj.authentication
                ? obj.authentication
                : serializeOnYourDataAuthenticationOptionsUnion(obj.authentication),
            top_n_documents: obj["topNDocuments"],
            in_scope: obj["inScope"],
            strictness: obj["strictness"],
            role_information: obj["roleInformation"],
            endpoint: obj["endpoint"],
            index_name: obj["indexName"],
            fields_mapping: !obj.fieldsMapping
                ? undefined
                : {
                    title_field: (_a = obj.fieldsMapping) === null || _a === void 0 ? void 0 : _a["titleField"],
                    url_field: (_b = obj.fieldsMapping) === null || _b === void 0 ? void 0 : _b["urlField"],
                    filepath_field: (_c = obj.fieldsMapping) === null || _c === void 0 ? void 0 : _c["filepathField"],
                    content_fields: (_d = obj.fieldsMapping) === null || _d === void 0 ? void 0 : _d["contentFields"],
                    content_fields_separator: (_e = obj.fieldsMapping) === null || _e === void 0 ? void 0 : _e["contentFieldsSeparator"],
                    vector_fields: (_f = obj.fieldsMapping) === null || _f === void 0 ? void 0 : _f["vectorFields"],
                    image_vector_fields: (_g = obj.fieldsMapping) === null || _g === void 0 ? void 0 : _g["imageVectorFields"],
                },
            query_type: obj["queryType"],
            semantic_configuration: obj["semanticConfiguration"],
            filter: obj["filter"],
            embedding_dependency: !obj.embeddingDependency
                ? obj.embeddingDependency
                : serializeOnYourDataVectorizationSourceUnion(obj.embeddingDependency),
        },
    };
}
/** serialize function for AzureMachineLearningIndexChatExtensionConfiguration */
function serializeAzureMachineLearningIndexChatExtensionConfiguration(obj) {
    return {
        type: obj["type"],
        parameters: {
            authentication: !obj.authentication
                ? obj.authentication
                : serializeOnYourDataAuthenticationOptionsUnion(obj.authentication),
            top_n_documents: obj["topNDocuments"],
            in_scope: obj["inScope"],
            strictness: obj["strictness"],
            role_information: obj["roleInformation"],
            project_resource_id: obj["projectResourceId"],
            name: obj["name"],
            version: obj["version"],
            filter: obj["filter"],
        },
    };
}
/** serialize function for AzureCosmosDBChatExtensionConfiguration */
function serializeAzureCosmosDBChatExtensionConfiguration(obj) {
    return {
        type: obj["type"],
        parameters: {
            authentication: !obj.authentication
                ? obj.authentication
                : serializeOnYourDataAuthenticationOptionsUnion(obj.authentication),
            top_n_documents: obj["topNDocuments"],
            in_scope: obj["inScope"],
            strictness: obj["strictness"],
            role_information: obj["roleInformation"],
            database_name: obj["databaseName"],
            container_name: obj["containerName"],
            index_name: obj["indexName"],
            fields_mapping: {
                title_field: obj.fieldsMapping["titleField"],
                url_field: obj.fieldsMapping["urlField"],
                filepath_field: obj.fieldsMapping["filepathField"],
                content_fields: obj.fieldsMapping["contentFields"],
                content_fields_separator: obj.fieldsMapping["contentFieldsSeparator"],
                vector_fields: obj.fieldsMapping["vectorFields"],
            },
            embedding_dependency: serializeOnYourDataVectorizationSourceUnion(obj.embeddingDependency),
        },
    };
}
/** serialize function for ElasticsearchChatExtensionConfiguration */
function serializeElasticsearchChatExtensionConfiguration(obj) {
    var _a, _b, _c, _d, _e, _f;
    return {
        type: obj["type"],
        parameters: {
            authentication: !obj.authentication
                ? obj.authentication
                : serializeOnYourDataAuthenticationOptionsUnion(obj.authentication),
            top_n_documents: obj["topNDocuments"],
            in_scope: obj["inScope"],
            strictness: obj["strictness"],
            role_information: obj["roleInformation"],
            endpoint: obj["endpoint"],
            index_name: obj["indexName"],
            fields_mapping: !obj.fieldsMapping
                ? undefined
                : {
                    title_field: (_a = obj.fieldsMapping) === null || _a === void 0 ? void 0 : _a["titleField"],
                    url_field: (_b = obj.fieldsMapping) === null || _b === void 0 ? void 0 : _b["urlField"],
                    filepath_field: (_c = obj.fieldsMapping) === null || _c === void 0 ? void 0 : _c["filepathField"],
                    content_fields: (_d = obj.fieldsMapping) === null || _d === void 0 ? void 0 : _d["contentFields"],
                    content_fields_separator: (_e = obj.fieldsMapping) === null || _e === void 0 ? void 0 : _e["contentFieldsSeparator"],
                    vector_fields: (_f = obj.fieldsMapping) === null || _f === void 0 ? void 0 : _f["vectorFields"],
                },
            query_type: obj["queryType"],
            embedding_dependency: !obj.embeddingDependency
                ? obj.embeddingDependency
                : serializeOnYourDataVectorizationSourceUnion(obj.embeddingDependency),
        },
    };
}
/** serialize function for PineconeChatExtensionConfiguration */
function serializePineconeChatExtensionConfiguration(obj) {
    return {
        type: obj["type"],
        parameters: {
            authentication: !obj.authentication
                ? obj.authentication
                : serializeOnYourDataAuthenticationOptionsUnion(obj.authentication),
            top_n_documents: obj["topNDocuments"],
            in_scope: obj["inScope"],
            strictness: obj["strictness"],
            role_information: obj["roleInformation"],
            environment: obj["environment"],
            index_name: obj["indexName"],
            fields_mapping: {
                title_field: obj.fieldsMapping["titleField"],
                url_field: obj.fieldsMapping["urlField"],
                filepath_field: obj.fieldsMapping["filepathField"],
                content_fields: obj.fieldsMapping["contentFields"],
                content_fields_separator: obj.fieldsMapping["contentFieldsSeparator"],
            },
            embedding_dependency: serializeOnYourDataVectorizationSourceUnion(obj.embeddingDependency),
        },
    };
}
/** serialize function for AzureChatExtensionConfigurationUnion */
function serializeAzureChatExtensionConfigurationUnion(obj) {
    switch (obj.type) {
        case "azure_search":
            return serializeAzureSearchChatExtensionConfiguration(obj);
        case "azure_ml_index":
            return serializeAzureMachineLearningIndexChatExtensionConfiguration(obj);
        case "azure_cosmos_db":
            return serializeAzureCosmosDBChatExtensionConfiguration(obj);
        case "elasticsearch":
            return serializeElasticsearchChatExtensionConfiguration(obj);
        case "pinecone":
            return serializePineconeChatExtensionConfiguration(obj);
        default:
            return obj;
    }
}
/** serialize function for OnYourDataConnectionStringAuthenticationOptions */
function serializeOnYourDataConnectionStringAuthenticationOptions(obj) {
    return { type: obj["type"], connection_string: obj["connectionString"] };
}
/** serialize function for OnYourDataKeyAndKeyIdAuthenticationOptions */
function serializeOnYourDataKeyAndKeyIdAuthenticationOptions(obj) {
    return { type: obj["type"], key: obj["key"], key_id: obj["keyId"] };
}
/** serialize function for OnYourDataEncodedApiKeyAuthenticationOptions */
function serializeOnYourDataEncodedApiKeyAuthenticationOptions(obj) {
    return { type: obj["type"], encoded_api_key: obj["encodedApiKey"] };
}
/** serialize function for OnYourDataAccessTokenAuthenticationOptions */
function serializeOnYourDataAccessTokenAuthenticationOptions(obj) {
    return { type: obj["type"], access_token: obj["accessToken"] };
}
/** serialize function for OnYourDataUserAssignedManagedIdentityAuthenticationOptions */
function serializeOnYourDataUserAssignedManagedIdentityAuthenticationOptions(obj) {
    return {
        type: obj["type"],
        managed_identity_resource_id: obj["managedIdentityResourceId"],
    };
}
/** serialize function for OnYourDataAuthenticationOptionsUnion */
function serializeOnYourDataAuthenticationOptionsUnion(obj) {
    switch (obj.type) {
        case "connection_string":
            return serializeOnYourDataConnectionStringAuthenticationOptions(obj);
        case "key_and_key_id":
            return serializeOnYourDataKeyAndKeyIdAuthenticationOptions(obj);
        case "encoded_api_key":
            return serializeOnYourDataEncodedApiKeyAuthenticationOptions(obj);
        case "access_token":
            return serializeOnYourDataAccessTokenAuthenticationOptions(obj);
        case "user_assigned_managed_identity":
            return serializeOnYourDataUserAssignedManagedIdentityAuthenticationOptions(obj);
        default:
            return obj;
    }
}
/** serialize function for OnYourDataEndpointVectorizationSource */
function serializeOnYourDataEndpointVectorizationSource(obj) {
    return {
        type: obj["type"],
        endpoint: obj["endpoint"],
        authentication: serializeOnYourDataAuthenticationOptionsUnion(obj.authentication),
    };
}
/** serialize function for OnYourDataDeploymentNameVectorizationSource */
function serializeOnYourDataDeploymentNameVectorizationSource(obj) {
    return { type: obj["type"], deployment_name: obj["deploymentName"] };
}
/** serialize function for OnYourDataModelIdVectorizationSource */
function serializeOnYourDataModelIdVectorizationSource(obj) {
    return { type: obj["type"], model_id: obj["modelId"] };
}
/** serialize function for OnYourDataVectorizationSourceUnion */
function serializeOnYourDataVectorizationSourceUnion(obj) {
    switch (obj.type) {
        case "endpoint":
            return serializeOnYourDataEndpointVectorizationSource(obj);
        case "deployment_name":
            return serializeOnYourDataDeploymentNameVectorizationSource(obj);
        case "model_id":
            return serializeOnYourDataModelIdVectorizationSource(obj);
        default:
            return obj;
    }
}
//# sourceMappingURL=serializeUtil.js.map

/***/ }),

/***/ "./node_modules/tslib/tslib.es6.mjs":
/*!******************************************!*\
  !*** ./node_modules/tslib/tslib.es6.mjs ***!
  \******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __addDisposableResource: () => (/* binding */ __addDisposableResource),
/* harmony export */   __assign: () => (/* binding */ __assign),
/* harmony export */   __asyncDelegator: () => (/* binding */ __asyncDelegator),
/* harmony export */   __asyncGenerator: () => (/* binding */ __asyncGenerator),
/* harmony export */   __asyncValues: () => (/* binding */ __asyncValues),
/* harmony export */   __await: () => (/* binding */ __await),
/* harmony export */   __awaiter: () => (/* binding */ __awaiter),
/* harmony export */   __classPrivateFieldGet: () => (/* binding */ __classPrivateFieldGet),
/* harmony export */   __classPrivateFieldIn: () => (/* binding */ __classPrivateFieldIn),
/* harmony export */   __classPrivateFieldSet: () => (/* binding */ __classPrivateFieldSet),
/* harmony export */   __createBinding: () => (/* binding */ __createBinding),
/* harmony export */   __decorate: () => (/* binding */ __decorate),
/* harmony export */   __disposeResources: () => (/* binding */ __disposeResources),
/* harmony export */   __esDecorate: () => (/* binding */ __esDecorate),
/* harmony export */   __exportStar: () => (/* binding */ __exportStar),
/* harmony export */   __extends: () => (/* binding */ __extends),
/* harmony export */   __generator: () => (/* binding */ __generator),
/* harmony export */   __importDefault: () => (/* binding */ __importDefault),
/* harmony export */   __importStar: () => (/* binding */ __importStar),
/* harmony export */   __makeTemplateObject: () => (/* binding */ __makeTemplateObject),
/* harmony export */   __metadata: () => (/* binding */ __metadata),
/* harmony export */   __param: () => (/* binding */ __param),
/* harmony export */   __propKey: () => (/* binding */ __propKey),
/* harmony export */   __read: () => (/* binding */ __read),
/* harmony export */   __rest: () => (/* binding */ __rest),
/* harmony export */   __runInitializers: () => (/* binding */ __runInitializers),
/* harmony export */   __setFunctionName: () => (/* binding */ __setFunctionName),
/* harmony export */   __spread: () => (/* binding */ __spread),
/* harmony export */   __spreadArray: () => (/* binding */ __spreadArray),
/* harmony export */   __spreadArrays: () => (/* binding */ __spreadArrays),
/* harmony export */   __values: () => (/* binding */ __values),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */

var extendStatics = function(d, b) {
  extendStatics = Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
      function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
  return extendStatics(d, b);
};

function __extends(d, b) {
  if (typeof b !== "function" && b !== null)
      throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
  extendStatics(d, b);
  function __() { this.constructor = d; }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
  __assign = Object.assign || function __assign(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
      return t;
  }
  return __assign.apply(this, arguments);
}

function __rest(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
      t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
          if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
              t[p[i]] = s[p[i]];
      }
  return t;
}

function __decorate(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
  return function (target, key) { decorator(target, key, paramIndex); }
}

function __esDecorate(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
  var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
  var _, done = false;
  for (var i = decorators.length - 1; i >= 0; i--) {
      var context = {};
      for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
      for (var p in contextIn.access) context.access[p] = contextIn.access[p];
      context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
      var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
      if (kind === "accessor") {
          if (result === void 0) continue;
          if (result === null || typeof result !== "object") throw new TypeError("Object expected");
          if (_ = accept(result.get)) descriptor.get = _;
          if (_ = accept(result.set)) descriptor.set = _;
          if (_ = accept(result.init)) initializers.unshift(_);
      }
      else if (_ = accept(result)) {
          if (kind === "field") initializers.unshift(_);
          else descriptor[key] = _;
      }
  }
  if (target) Object.defineProperty(target, contextIn.name, descriptor);
  done = true;
};

function __runInitializers(thisArg, initializers, value) {
  var useValue = arguments.length > 2;
  for (var i = 0; i < initializers.length; i++) {
      value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
  }
  return useValue ? value : void 0;
};

function __propKey(x) {
  return typeof x === "symbol" ? x : "".concat(x);
};

function __setFunctionName(f, name, prefix) {
  if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
  return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};

function __metadata(metadataKey, metadataValue) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
      function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
      function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}

function __generator(thisArg, body) {
  var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
  return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
  function verb(n) { return function (v) { return step([n, v]); }; }
  function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
              case 0: case 1: t = op; break;
              case 4: _.label++; return { value: op[1], done: false };
              case 5: _.label++; y = op[1]; op = [0]; continue;
              case 7: op = _.ops.pop(); _.trys.pop(); continue;
              default:
                  if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                  if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                  if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                  if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                  if (t[2]) _.ops.pop();
                  _.trys.pop(); continue;
          }
          op = body.call(thisArg, _);
      } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
      if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
  }
}

var __createBinding = Object.create ? (function(o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  var desc = Object.getOwnPropertyDescriptor(m, k);
  if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
  }
  Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

function __exportStar(m, o) {
  for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
}

function __values(o) {
  var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
  if (m) return m.call(o);
  if (o && typeof o.length === "number") return {
      next: function () {
          if (o && i >= o.length) o = void 0;
          return { value: o && o[i++], done: !o };
      }
  };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar = [], e;
  try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  }
  catch (error) { e = { error: error }; }
  finally {
      try {
          if (r && !r.done && (m = i["return"])) m.call(i);
      }
      finally { if (e) throw e.error; }
  }
  return ar;
}

/** @deprecated */
function __spread() {
  for (var ar = [], i = 0; i < arguments.length; i++)
      ar = ar.concat(__read(arguments[i]));
  return ar;
}

/** @deprecated */
function __spreadArrays() {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
  for (var r = Array(s), k = 0, i = 0; i < il; i++)
      for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
          r[k] = a[j];
  return r;
}

function __spreadArray(to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
      }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
}

function __await(v) {
  return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var g = generator.apply(thisArg, _arguments || []), i, q = [];
  return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
  function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
  function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
  function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
  function fulfill(value) { resume("next", value); }
  function reject(value) { resume("throw", value); }
  function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
  var i, p;
  return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
  function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: false } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var m = o[Symbol.asyncIterator], i;
  return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
  function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
  function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
  if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
  return cooked;
};

var __setModuleDefault = Object.create ? (function(o, v) {
  Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
  o["default"] = v;
};

function __importStar(mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
  __setModuleDefault(result, mod);
  return result;
}

function __importDefault(mod) {
  return (mod && mod.__esModule) ? mod : { default: mod };
}

function __classPrivateFieldGet(receiver, state, kind, f) {
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

function __classPrivateFieldSet(receiver, state, value, kind, f) {
  if (kind === "m") throw new TypeError("Private method is not writable");
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
}

function __classPrivateFieldIn(state, receiver) {
  if (receiver === null || (typeof receiver !== "object" && typeof receiver !== "function")) throw new TypeError("Cannot use 'in' operator on non-object");
  return typeof state === "function" ? receiver === state : state.has(receiver);
}

function __addDisposableResource(env, value, async) {
  if (value !== null && value !== void 0) {
    if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
    var dispose;
    if (async) {
        if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
        dispose = value[Symbol.asyncDispose];
    }
    if (dispose === void 0) {
        if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
        dispose = value[Symbol.dispose];
    }
    if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
    env.stack.push({ value: value, dispose: dispose, async: async });
  }
  else if (async) {
    env.stack.push({ async: true });
  }
  return value;
}

var _SuppressedError = typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

function __disposeResources(env) {
  function fail(e) {
    env.error = env.hasError ? new _SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
    env.hasError = true;
  }
  function next() {
    while (env.stack.length) {
      var rec = env.stack.pop();
      try {
        var result = rec.dispose && rec.dispose.call(rec.value);
        if (rec.async) return Promise.resolve(result).then(next, function(e) { fail(e); return next(); });
      }
      catch (e) {
          fail(e);
      }
    }
    if (env.hasError) throw env.error;
  }
  return next();
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  __extends,
  __assign,
  __rest,
  __decorate,
  __param,
  __metadata,
  __awaiter,
  __generator,
  __createBinding,
  __exportStar,
  __values,
  __read,
  __spread,
  __spreadArrays,
  __spreadArray,
  __await,
  __asyncGenerator,
  __asyncDelegator,
  __asyncValues,
  __makeTemplateObject,
  __importStar,
  __importDefault,
  __classPrivateFieldGet,
  __classPrivateFieldSet,
  __classPrivateFieldIn,
  __addDisposableResource,
  __disposeResources,
});


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*********************!*\
  !*** ./src/test.js ***!
  \*********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _azure_openai__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @azure/openai */ "./node_modules/@azure/openai/dist-esm/src/OpenAIClient.js");
/* harmony import */ var _azure_openai__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @azure/openai */ "./node_modules/@azure/core-auth/dist/browser/index.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var endpoint = "https://ai-rum-swe-a909a5-2.openai.azure.com/";
var azureApiKey = "fb4f676e065c4e238870e2adc0cd5956";
var messages = [{
  role: "system",
  content: "You are a helpful assistant."
}, {
  role: "user",
  content: "Does Azure OpenAI support customer managed keys?"
}, {
  role: "assistant",
  content: "Yes, customer managed keys are supported by Azure OpenAI"
}, {
  role: "user",
  content: "Do other Azure AI services support this too"
}];
function main() {
  return _main.apply(this, arguments);
}
function _main() {
  _main = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
    var client, deploymentId, result, _iterator, _step, choice;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          console.log("== Chat Completions Sample ==");
          client = new _azure_openai__WEBPACK_IMPORTED_MODULE_0__.OpenAIClient(endpoint, new _azure_openai__WEBPACK_IMPORTED_MODULE_1__.AzureKeyCredential(azureApiKey));
          deploymentId = "gpt-35-turbo";
          _context.next = 5;
          let response = client.getChatCompletions(deploymentId, messages);
          console.log(response)
          return response;
        case 5:
          result = _context.sent;
          _iterator = _createForOfIteratorHelper(result.choices);
          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              choice = _step.value;
              console.log(choice.message);
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
        case 8:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _main.apply(this, arguments);
}
main()["catch"](function (err) {
  console.error("The sample encountered an error:", err);
});
main();
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1AsWUFBWSx3RUFBc0I7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUM3REE7QUFDQTtBQUMwRDtBQUMxRDtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1AsWUFBWSx3RUFBc0I7QUFDbEM7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2pEQTtBQUNBO0FBQzZEO0FBQ1I7QUFDeUM7QUFDaEI7QUFDcEI7QUFDMUQ7Ozs7Ozs7Ozs7Ozs7OztBQ1BBO0FBQ0E7QUFDMEQ7QUFDMUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1AsV0FBVyx3RUFBc0I7QUFDakM7QUFDQTs7Ozs7Ozs7Ozs7Ozs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7O0FDbEJBO0FBQ0E7QUFDTztBQUNBO0FBQ1A7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0pBO0FBQ0E7QUFDb0Q7QUFDQTtBQUNVO0FBQ0U7QUFDcUI7QUFDSDtBQUNaO0FBQ1I7QUFDaEI7QUFDVTtBQUMwQjtBQUM5QjtBQUNRO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBLHFCQUFxQixpRUFBbUI7QUFDeEMsUUFBUSx3REFBVTtBQUNsQjtBQUNBLCtCQUErQixrRUFBUztBQUN4QztBQUNBLDJCQUEyQixxRUFBVztBQUN0QywyQkFBMkIsK0ZBQXdCO0FBQ25EO0FBQ0EsdUJBQXVCLDJFQUFjLE1BQU0saUJBQWlCLDZFQUFtQixHQUFHO0FBQ2xGLHVCQUF1Qiw2RUFBZTtBQUN0Qyx1QkFBdUIsZ0dBQXdCO0FBQy9DO0FBQ0E7QUFDQTtBQUNBLHVCQUF1Qiw2RUFBZSxNQUFNLDJCQUEyQjtBQUN2RSx1QkFBdUIsbUZBQWtCLDBCQUEwQixnQkFBZ0I7QUFDbkYsdUJBQXVCLDBFQUFhLDhCQUE4QixxQkFBcUI7QUFDdkYsUUFBUSx3REFBVTtBQUNsQjtBQUNBO0FBQ0EsMkJBQTJCLDJFQUFjLDZCQUE2QixxQkFBcUI7QUFDM0Y7QUFDQSx1QkFBdUIsaUVBQVMsNEJBQTRCLG9CQUFvQjtBQUNoRjtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQzlDQTtBQUNBO0FBQzZEO0FBQzdEO0FBQ0E7QUFDQTtBQUNPO0FBQ1AsV0FBVywwRUFBcUI7QUFDaEM7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDVEE7QUFDQTtBQUNxRDtBQUNWO0FBQ1U7QUFDNEI7QUFDakY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUFpRCxhQUFhO0FBQzlEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSwwQ0FBMEM7QUFDdEQ7QUFDQTtBQUNBLGdCQUFnQiwrQkFBK0I7QUFDL0MsMERBQTBELDZGQUE2RjtBQUN2SixnQkFBZ0I7QUFDaEIsZ0JBQWdCLHNDQUFzQyxvQkFBb0IsSUFBSTtBQUM5RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUMsZ0NBQWdDO0FBQ3ZFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLHdFQUFtQjtBQUMxQztBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0IsK0RBQVU7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsb0RBQVMsMkJBQTJCLFVBQVU7QUFDakUsdUdBQXVHLG9EQUFTO0FBQ2hIO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLGtFQUFpQjtBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVEseUVBQW9CO0FBQzVCO0FBQ0E7QUFDQSxXQUFXLHdFQUFtQjtBQUM5QixZQUFZLCtDQUErQyxzQ0FBc0M7QUFDakcsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscURBQXFEO0FBQ3JEO0FBQ0EsWUFBWSxvQkFBb0I7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDLGFBQWE7QUFDOUM7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLGFBQWE7QUFDYixTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixjQUFjO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQyxhQUFhO0FBQzlDO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FDL1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvREFBb0QsbUNBQW1DO0FBQ3ZGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QjtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNENBQTRDLG9CQUFvQjtBQUNoRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3hGQTtBQUNBO0FBQ3FEO0FBQ3VCO0FBQ1g7QUFDWjtBQUNRO0FBQ0w7QUFDeUQ7QUFDTjtBQUNNO0FBQzlDO0FBQ2tCO0FBQ2E7QUFDZjtBQUN3QjtBQUNIO0FBQ2hEO0FBQ3dCO0FBQ1Q7QUFDZTtBQUNuQjtBQUNlO0FBQ29EO0FBQzFEO0FBQ3NFO0FBQy9FO0FBQ25FOzs7Ozs7Ozs7Ozs7Ozs7QUMzQkE7QUFDQTtBQUNtRDtBQUM1QyxlQUFlLGlFQUFrQjtBQUN4Qzs7Ozs7Ozs7Ozs7Ozs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0M7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtREFBbUQsY0FBYztBQUNqRTtBQUNBO0FBQ0Esd0RBQXdELG1CQUFtQjtBQUMzRTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixrQkFBa0I7QUFDdEM7QUFDQTtBQUNBO0FBQ0EsMkRBQTJELFdBQVc7QUFDdEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUNyUUE7QUFDQTtBQUNxRDtBQUNQO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrRUFBK0Usa0VB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QUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7O0FDMUlBO0FBQ0E7QUFDcUM7QUFDckM7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYyxrREFBSztBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBLGtEQUFrRDtBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FB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c0JBQXNCO0FBQ3pDO0FBQ0E7QUFDQTtBQUNPLDBDQUEwQztBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7OztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBFQUEwRSw2QkFBNkI7QUFDdkc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQSxvQkFBb0Isc0JBQXNCO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtC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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FB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QUFBO1FBQUE7UUFBQTtVQUFBLE9BQUEwSCxRQUFBLENBQUE1RCxJQUFBO01BQUE7SUFBQSxHQUFBb0QsT0FBQTtFQUFBLENBQ0Y7RUFBQSxPQUFBRCxLQUFBLENBQUFWLEtBQUEsT0FBQUQsU0FBQTtBQUFBO0FBRURVLElBQUksQ0FBQyxDQUFDLFNBQU0sQ0FBQyxVQUFDakMsR0FBRyxFQUFLO0VBQ3BCNEMsT0FBTyxDQUFDMUIsS0FBSyxDQUFDLGtDQUFrQyxFQUFFbEIsR0FBRyxDQUFDO0FBQ3hELENBQUMsQ0FBQztBQUVGaUMsSUFBSSxDQUFDLENBQUMsQyIsInNvdXJjZXMiOlsid2VicGFjazovL2V4dGVuc2lvbi8uL25vZGVfbW9kdWxlcy9AYXp1cmUtcmVzdC9jb3JlLWNsaWVudC9kaXN0L2Jyb3dzZXIvYXBpVmVyc2lvblBvbGljeS5qcyIsIndlYnBhY2s6Ly9leHRlbnNpb24vLi9ub2RlX21vZHVsZXMvQGF6dXJlLXJlc3QvY29yZS1jbGllbnQvZGlzdC9icm93c2VyL2NsaWVudEhlbHBlcnMuanMiLCJ3ZWJwYWNrOi8vZXh0ZW5zaW9uLy4vbm9kZV9tb2R1bGVzL0BhenVyZS1yZXN0L2NvcmUtY2xpZW50L2Rpc3QvYnJvd3Nlci9jb21tb24uanMiLCJ3ZWJwYWNrOi8vZXh0ZW5zaW9uLy4vbm9kZV9tb2R1bGVzL0BhenVyZS1yZXN0L2NvcmUtY2xpZW50L2Rpc3QvYnJvd3Nlci9nZXRDbGllbnQuanMiLCJ3ZWJwYWNrOi8vZXh0ZW5zaW9uLy4vbm9kZV9tb2R1bGVzL0BhenVyZS1yZXN0L2NvcmUtY2xpZW50L2Rpc3QvYnJvd3Nlci9oZWxwZXJzL2lzUmVhZGFibGVTdHJlYW0uanMiLCJ3ZWJwYWNrOi8vZXh0ZW5zaW9uLy4vbm9kZV9tb2R1bGVzL0BhenVyZS1yZXN0L2NvcmUtY2xpZW50L2Rpc3QvYnJvd3Nlci9pbmRleC5qcyIsIndlYnBhY2s6Ly9leHRlbnNpb24vLi9ub2RlX21vZHVsZXMvQGF6dXJlLXJlc3QvY29yZS1jbGllbnQvZGlzdC9icm93c2VyL2tleUNyZWRlbnRpYWxBdXRoZW50aWNhdGlvblBvbGljeS5qcyIsIndlYnBhY2s6Ly9leHRlbnNpb24vLi9ub2RlX21vZHVsZXMvQGF6dXJlLXJlc3QvY29yZS1jbGllbnQvZGlzdC9icm93c2VyL29wZXJhdGlvbk9wdGlvbkhlbHBlcnMuanMiLCJ3ZWJwYWNrOi8vZXh0ZW5zaW9uLy4vbm9kZV9tb2R1bGVzL0BhenVyZS1yZXN0L2NvcmUtY2xpZW50L2Rpc3QvYnJvd3Nlci9yZXN0RXJyb3IuanMiLCJ3ZWJwYWNrOi8vZXh0ZW5zaW9uLy4vbm9kZV9tb2R1bGVzL0BhenVyZS1yZXN0L2NvcmUtY2xpZW50L2Rpc3QvYnJvd3Nlci9zZW5kUmVxdWVzdC5qcyIsIndlYnBhY2s6Ly9leHRlbnNpb24vLi9ub2RlX21vZHVsZXMvQGF6dXJlLXJlc3QvY29yZS1jbGllbnQvZGlzdC9icm93c2VyL3VybEhlbHBlcnMuanMiLCJ3ZWJwYWNrOi8vZXh0ZW5zaW9uLy4vbm9kZV9tb2R1bGVzL0BhenVyZS9hYm9ydC1jb250cm9sbGVyL2Rpc3QvYnJvd3Nlci9BYm9ydEVycm9yLmpzIiwid2VicGFjazovL2V4dGVuc2lvbi8uL25vZGVfbW9kdWxlcy9AYXp1cmUvYWJvcnQtY29udHJvbGxlci9kaXN0L2Jyb3dzZXIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vZXh0ZW5zaW9uLy4vbm9kZV9tb2R1bGVzL0BhenVyZS9jb3JlLWF1dGgvZGlzdC9icm93c2VyL2F6dXJlS2V5Q3JlZGVudGlhbC5qcyIsIndlYnBhY2s6Ly9leHRlbnNpb24vLi9ub2RlX21vZHVsZXMvQGF6dXJlL2NvcmUtYXV0aC9kaXN0L2Jyb3dzZXIvYXp1cmVOYW1lZEtleUNyZWRlbnRpYWwuanMiLCJ3ZWJwYWNrOi8vZXh0ZW5zaW9uLy4vbm9kZV9tb2R1bGVzL0BhenVyZS9jb3JlLWF1dGgvZGlzdC9icm93c2VyL2F6dXJlU0FTQ3JlZGVudGlhbC5qcyIsIndlYnBhY2s6Ly9leHRlbnNpb24vLi9ub2RlX21vZHVsZXMvQGF6dXJlL2NvcmUtYXV0aC9kaXN0L2Jyb3dzZXIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vZXh0ZW5zaW9uLy4vbm9kZV9tb2R1bGVzL0BhenVyZS9jb3JlLWF1dGgvZGlzdC9icm93c2VyL2tleUNyZWRlbnRpYWwuanMiLCJ3ZWJwYWNrOi8vZXh0ZW5zaW9uLy4vbm9kZV9tb2R1bGVzL0BhenVyZS9jb3JlLWF1dGgvZGlzdC9icm93c2VyL3Rva2VuQ3JlZGVudGlhbC5qcyIsIndlYnBhY2s6Ly9leHRlbnNpb24vLi9ub2RlX21vZHVsZXMvQGF6dXJlL2NvcmUtcmVzdC1waXBlbGluZS9kaXN0L2Jyb3dzZXIvY29uc3RhbnRzLmpzIiwid2VicGFjazovL2V4dGVuc2lvbi8uL25vZGVfbW9kdWxlcy9AYXp1cmUvY29yZS1yZXN0LXBpcGVsaW5lL2Rpc3QvYnJvd3Nlci9jcmVhdGVQaXBlbGluZUZyb21PcHRpb25zLmpzIiwid2VicGFjazovL2V4dGVuc2lvbi8uL25vZGVfbW9kdWxlcy9AYXp1cmUvY29yZS1yZXN0LXBpcGVsaW5lL2Rpc3QvYnJvd3Nlci9kZWZhdWx0SHR0cENsaWVudC5qcyIsIndlYnBhY2s6Ly9leHRlbnNpb24vLi9ub2RlX21vZHVsZXMvQGF6dXJlL2NvcmUtcmVzdC1waXBlbGluZS9kaXN0L2Jyb3dzZXIvZmV0Y2hIdHRwQ2xpZW50LmpzIiwid2VicGFjazovL2V4dGVuc2lvbi8uL25vZGVfbW9kdWxlcy9AYXp1cmUvY29yZS1yZXN0LXBpcGVsaW5lL2Rpc3QvYnJvd3Nlci9odHRwSGVhZGVycy5qcyIsIndlYnBhY2s6Ly9leHRlbnNpb24vLi9ub2RlX21vZHVsZXMvQGF6dXJlL2NvcmUtcmVzdC1waXBlbGluZS9kaXN0L2Jyb3dzZXIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vZXh0ZW5zaW9uLy4vbm9kZV9tb2R1bGVzL0BhenVyZS9jb3JlLXJlc3QtcGlwZWxpbmUvZGlzdC9icm93c2VyL2xvZy5qcyIsIndlYnBhY2s6Ly9leHRlbnNpb24vLi9ub2RlX21vZHVsZXMvQGF6dXJlL2NvcmUtcmVzdC1waXBlbGluZS9kaXN0L2Jyb3dzZXIvcGlwZWxpbmUuanMiLCJ3ZWJwYWNrOi8vZXh0ZW5zaW9uLy4vbm9kZV9tb2R1bGVzL0BhenVyZS9jb3JlLXJlc3QtcGlwZWxpbmUvZGlzdC9icm93c2VyL3BpcGVsaW5lUmVxdWVzdC5qcyIsIndlYnBhY2s6Ly9leHRlbnNpb24vLi9ub2RlX21vZHVsZXMvQGF6dXJlL2NvcmUtcmVzdC1waXBlbGluZS9kaXN0L2Jyb3dzZXIvcG9saWNpZXMvYXV4aWxpYXJ5QXV0aGVudGljYXRpb25IZWFkZXJQb2xpY3kuanMiLCJ3ZWJwYWNrOi8vZXh0ZW5zaW9uLy4vbm9kZV9tb2R1bGVzL0BhenVyZS9jb3JlLXJlc3QtcGlwZWxpbmUvZGlzdC9icm93c2VyL3BvbGljaWVzL2JlYXJlclRva2VuQXV0aGVudGljYXRpb25Qb2xpY3kuanMiLCJ3ZWJwYWNrOi8vZXh0ZW5zaW9uLy4vbm9kZV9tb2R1bGVzL0BhenVyZS9jb3JlLXJlc3QtcGlwZWxpbmUvZGlzdC9icm93c2VyL3BvbGljaWVzL2RlY29tcHJlc3NSZXNwb25zZVBvbGljeS5qcyIsIndlYnBhY2s6Ly9leHRlbnNpb24vLi9ub2RlX21vZHVsZXMvQGF6dXJlL2NvcmUtcmVzdC1waXBlbGluZS9kaXN0L2Jyb3dzZXIvcG9saWNpZXMvZGVmYXVsdFJldHJ5UG9saWN5LmpzIiwid2VicGFjazovL2V4dGVuc2lvbi8uL25vZGVfbW9kdWxlcy9AYXp1cmUvY29yZS1yZXN0LXBpcGVsaW5lL2Rpc3QvYnJvd3Nlci9wb2xpY2llcy9leHBvbmVudGlhbFJldHJ5UG9saWN5LmpzIiwid2VicGFjazovL2V4dGVuc2lvbi8uL25vZGVfbW9kdWxlcy9AYXp1cmUvY29yZS1yZXN0LXBpcGVsaW5lL2Rpc3QvYnJvd3Nlci9wb2xpY2llcy9mb3JtRGF0YVBvbGljeS5qcyIsIndlYnBhY2s6Ly9leHRlbnNpb24vLi9ub2RlX21vZHVsZXMvQGF6dXJlL2NvcmUtcmVzdC1waXBlbGluZS9kaXN0L2Jyb3dzZXIvcG9saWNpZXMvbG9nUG9saWN5LmpzIiwid2VicGFjazovL2V4dGVuc2lvbi8uL25vZGVfbW9kdWxlcy9AYXp1cmUvY29yZS1yZXN0LXBpcGVsaW5lL2Rpc3QvYnJvd3Nlci9wb2xpY2llcy9tdWx0aXBhcnRQb2xpY3kuanMiLCJ3ZWJwYWNrOi8vZXh0ZW5zaW9uLy4vbm9kZV9tb2R1bGVzL0BhenVyZS9jb3JlLXJlc3QtcGlwZWxpbmUvZGlzdC9icm93c2VyL3BvbGljaWVzL25kSnNvblBvbGljeS5qcyIsIndlYnBhY2s6Ly9leHRlbnNpb24vLi9ub2RlX21vZHVsZXMvQGF6dXJlL2NvcmUtcmVzdC1waXBlbGluZS9kaXN0L2Jyb3dzZXIvcG9saWNpZXMvcHJveHlQb2xpY3kuanMiLCJ3ZWJwYWNrOi8vZXh0ZW5zaW9uLy4vbm9kZV9tb2R1bGVzL0BhenVyZS9jb3JlLXJlc3QtcGlwZWxpbmUvZGlzdC9icm93c2VyL3BvbGljaWVzL3JlZGlyZWN0UG9saWN5LmpzIiwid2VicGFjazovL2V4dGVuc2lvbi8uL25vZGVfbW9kdWxlcy9AYXp1cmUvY29yZS1yZXN0LXBpcGVsaW5lL2Rpc3QvYnJvd3Nlci9wb2xpY2llcy9yZXRyeVBvbGljeS5qcyIsIndlYnBhY2s6Ly9leHRlbnNpb24vLi9ub2RlX21vZHVsZXMvQGF6dXJlL2NvcmUtcmVzdC1waXBlbGluZS9kaXN0L2Jyb3dzZXIvcG9saWNpZXMvc2V0Q2xpZW50UmVxdWVzdElkUG9saWN5LmpzIiwid2VicGFjazovL2V4dGVuc2lvbi8uL25vZGVfbW9kdWxlcy9AYXp1cmUvY29yZS1yZXN0LXBpcGVsaW5lL2Rpc3QvYnJvd3Nlci9wb2xpY2llcy9zeXN0ZW1FcnJvclJldHJ5UG9saWN5LmpzIiwid2VicGFjazovL2V4dGVuc2lvbi8uL25vZGVfbW9kdWxlcy9AYXp1cmUvY29yZS1yZXN0LXBpcGVsaW5lL2Rpc3QvYnJvd3Nlci9wb2xpY2llcy90aHJvdHRsaW5nUmV0cnlQb2xpY3kuanMiLCJ3ZWJwYWNrOi8vZXh0ZW5zaW9uLy4vbm9kZV9tb2R1bGVzL0BhenVyZS9jb3JlLXJlc3QtcGlwZWxpbmUvZGlzdC9icm93c2VyL3BvbGljaWVzL3Rsc1BvbGljeS5qcyIsIndlYnBhY2s6Ly9leHRlbnNpb24vLi9ub2RlX21vZHVsZXMvQGF6dXJlL2NvcmUtcmVzdC1waXBlbGluZS9kaXN0L2Jyb3dzZXIvcG9saWNpZXMvdHJhY2luZ1BvbGljeS5qcyIsIndlYnBhY2s6Ly9leHRlbnNpb24vLi9ub2RlX21vZHVsZXMvQGF6dXJlL2NvcmUtcmVzdC1waXBlbGluZS9kaXN0L2Jyb3dzZXIvcG9saWNpZXMvdXNlckFnZW50UG9saWN5LmpzIiwid2VicGFjazovL2V4dGVuc2lvbi8uL25vZGVfbW9kdWxlcy9AYXp1cmUvY29yZS1yZXN0LXBpcGVsaW5lL2Rpc3QvYnJvd3Nlci9yZXN0RXJyb3IuanMiLCJ3ZWJwYWNrOi8vZXh0ZW5zaW9uLy4vbm9kZV9tb2R1bGVzL0BhenVyZS9jb3JlLXJlc3QtcGlwZWxpbmUvZGlzdC9icm93c2VyL3JldHJ5U3RyYXRlZ2llcy9leHBvbmVudGlhbFJldHJ5U3RyYXRlZ3kuanMiLCJ3ZWJwYWNrOi8vZXh0ZW5zaW9uLy4vbm9kZV9tb2R1bGVzL0BhenVyZS9jb3JlLXJlc3QtcGlwZWxpbmUvZGlzdC9icm93c2VyL3JldHJ5U3RyYXRlZ2llcy90aHJvdHRsaW5nUmV0cnlTdHJhdGVneS5qcyIsIndlYnBhY2s6Ly9leHRlbnNpb24vLi9ub2RlX21vZHVsZXMvQGF6dXJlL2NvcmUtcmVzdC1waXBlbGluZS9kaXN0L2Jyb3dzZXIvdXRpbC9jb25jYXQuanMiLCJ3ZWJwYWNrOi8vZXh0ZW5zaW9uLy4vbm9kZV9tb2R1bGVzL0BhenVyZS9jb3JlLXJlc3QtcGlwZWxpbmUvZGlzdC9icm93c2VyL3V0aWwvZmlsZS5qcyIsIndlYnBhY2s6Ly9leHRlbnNpb24vLi9ub2RlX21vZHVsZXMvQGF6dXJlL2NvcmUtcmVzdC1waXBlbGluZS9kaXN0L2Jyb3dzZXIvdXRpbC9oZWxwZXJzLmpzIiwid2VicGFjazovL2V4dGVuc2lvbi8uL25vZGVfbW9kdWxlcy9AYXp1cmUvY29yZS1yZXN0LXBpcGVsaW5lL2Rpc3QvYnJvd3Nlci91dGlsL2luc3BlY3QuanMiLCJ3ZWJwYWNrOi8vZXh0ZW5zaW9uLy4vbm9kZV9tb2R1bGVzL0BhenVyZS9jb3JlLXJlc3QtcGlwZWxpbmUvZGlzdC9icm93c2VyL3V0aWwvc2FuaXRpemVyLmpzIiwid2VicGFjazovL2V4dGVuc2lvbi8uL25vZGVfbW9kdWxlcy9AYXp1cmUvY29yZS1yZXN0LXBpcGVsaW5lL2Rpc3QvYnJvd3Nlci91dGlsL3Rva2VuQ3ljbGVyLmpzIiwid2VicGFjazovL2V4dGVuc2lvbi8uL25vZGVfbW9kdWxlcy9AYXp1cmUvY29yZS1yZXN0LXBpcGVsaW5lL2Rpc3QvYnJvd3Nlci91dGlsL3R5cGVHdWFyZHMuanMiLCJ3ZWJwYWNrOi8vZXh0ZW5zaW9uLy4vbm9kZV9tb2R1bGVzL0BhenVyZS9jb3JlLXJlc3QtcGlwZWxpbmUvZGlzdC9icm93c2VyL3V0aWwvdXNlckFnZW50LmpzIiwid2VicGFjazovL2V4dGVuc2lvbi8uL25vZGVfbW9kdWxlcy9AYXp1cmUvY29yZS1yZXN0LXBpcGVsaW5lL2Rpc3QvYnJvd3Nlci91dGlsL3VzZXJBZ2VudFBsYXRmb3JtLmpzIiwid2VicGFjazovL2V4dGVuc2lvbi8uL25vZGVfbW9kdWxlcy9AYXp1cmUvY29yZS1zc2UvZGlzdC9icm93c2VyL2luZGV4LmpzIiwid2VicGFjazovL2V4dGVuc2lvbi8uL25vZGVfbW9kdWxlcy9AYXp1cmUvY29yZS1zc2UvZGlzdC9icm93c2VyL3NzZS5qcyIsIndlYnBhY2s6Ly9leHRlbnNpb24vLi9ub2RlX21vZHVsZXMvQGF6dXJlL2NvcmUtc3NlL2Rpc3QvYnJvd3Nlci91dGlscy5qcyIsIndlYnBhY2s6Ly9leHRlbnNpb24vLi9ub2RlX21vZHVsZXMvQGF6dXJlL2NvcmUtdHJhY2luZy9kaXN0L2Jyb3dzZXIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vZXh0ZW5zaW9uLy4vbm9kZV9tb2R1bGVzL0BhenVyZS9jb3JlLXRyYWNpbmcvZGlzdC9icm93c2VyL2luc3RydW1lbnRlci5qcyIsIndlYnBhY2s6Ly9leHRlbnNpb24vLi9ub2RlX21vZHVsZXMvQGF6dXJlL2NvcmUtdHJhY2luZy9kaXN0L2Jyb3dzZXIvc3RhdGUuanMiLCJ3ZWJwYWNrOi8vZXh0ZW5zaW9uLy4vbm9kZV9tb2R1bGVzL0BhenVyZS9jb3JlLXRyYWNpbmcvZGlzdC9icm93c2VyL3RyYWNpbmdDbGllbnQuanMiLCJ3ZWJwYWNrOi8vZXh0ZW5zaW9uLy4vbm9kZV9tb2R1bGVzL0BhenVyZS9jb3JlLXRyYWNpbmcvZGlzdC9icm93c2VyL3RyYWNpbmdDb250ZXh0LmpzIiwid2VicGFjazovL2V4dGVuc2lvbi8uL25vZGVfbW9kdWxlcy9AYXp1cmUvY29yZS11dGlsL2Rpc3QvYnJvd3Nlci9hYm9ydGVyVXRpbHMuanMiLCJ3ZWJwYWNrOi8vZXh0ZW5zaW9uLy4vbm9kZV9tb2R1bGVzL0BhenVyZS9jb3JlLXV0aWwvZGlzdC9icm93c2VyL2J5dGVzRW5jb2RpbmcuanMiLCJ3ZWJwYWNrOi8vZXh0ZW5zaW9uLy4vbm9kZV9tb2R1bGVzL0BhenVyZS9jb3JlLXV0aWwvZGlzdC9icm93c2VyL2NoZWNrRW52aXJvbm1lbnQuanMiLCJ3ZWJwYWNrOi8vZXh0ZW5zaW9uLy4vbm9kZV9tb2R1bGVzL0BhenVyZS9jb3JlLXV0aWwvZGlzdC9icm93c2VyL2NyZWF0ZUFib3J0YWJsZVByb21pc2UuanMiLCJ3ZWJwYWNrOi8vZXh0ZW5zaW9uLy4vbm9kZV9tb2R1bGVzL0BhenVyZS9jb3JlLXV0aWwvZGlzdC9icm93c2VyL2RlbGF5LmpzIiwid2VicGFjazovL2V4dGVuc2lvbi8uL25vZGVfbW9kdWxlcy9AYXp1cmUvY29yZS11dGlsL2Rpc3QvYnJvd3Nlci9lcnJvci5qcyIsIndlYnBhY2s6Ly9leHRlbnNpb24vLi9ub2RlX21vZHVsZXMvQGF6dXJlL2NvcmUtdXRpbC9kaXN0L2Jyb3dzZXIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vZXh0ZW5zaW9uLy4vbm9kZV9tb2R1bGVzL0BhenVyZS9jb3JlLXV0aWwvZGlzdC9icm93c2VyL29iamVjdC5qcyIsIndlYnBhY2s6Ly9leHRlbnNpb24vLi9ub2RlX21vZHVsZXMvQGF6dXJlL2NvcmUtdXRpbC9kaXN0L2Jyb3dzZXIvcmFuZG9tLmpzIiwid2VicGFjazovL2V4dGVuc2lvbi8uL25vZGVfbW9kdWxlcy9AYXp1cmUvY29yZS11dGlsL2Rpc3QvYnJvd3Nlci9zaGEyNTYuanMiLCJ3ZWJwYWNrOi8vZXh0ZW5zaW9uLy4vbm9kZV9tb2R1bGVzL0BhenVyZS9jb3JlLXV0aWwvZGlzdC9icm93c2VyL3R5cGVHdWFyZHMuanMiLCJ3ZWJwYWNrOi8vZXh0ZW5zaW9uLy4vbm9kZV9tb2R1bGVzL0BhenVyZS9jb3JlLXV0aWwvZGlzdC9icm93c2VyL3V1aWRVdGlscy5jb21tb24uanMiLCJ3ZWJwYWNrOi8vZXh0ZW5zaW9uLy4vbm9kZV9tb2R1bGVzL0BhenVyZS9jb3JlLXV0aWwvZGlzdC9icm93c2VyL3V1aWRVdGlscy5qcyIsIndlYnBhY2s6Ly9leHRlbnNpb24vLi9ub2RlX21vZHVsZXMvQGF6dXJlL2xvZ2dlci9kaXN0L2Jyb3dzZXIvZGVidWcuanMiLCJ3ZWJwYWNrOi8vZXh0ZW5zaW9uLy4vbm9kZV9tb2R1bGVzL0BhenVyZS9sb2dnZXIvZGlzdC9icm93c2VyL2luZGV4LmpzIiwid2VicGFjazovL2V4dGVuc2lvbi8uL25vZGVfbW9kdWxlcy9AYXp1cmUvbG9nZ2VyL2Rpc3QvYnJvd3Nlci9sb2cuanMiLCJ3ZWJwYWNrOi8vZXh0ZW5zaW9uLy4vbm9kZV9tb2R1bGVzL0BhenVyZS9vcGVuYWkvZGlzdC1lc20vc3JjL09wZW5BSUNsaWVudC5qcyIsIndlYnBhY2s6Ly9leHRlbnNpb24vLi9ub2RlX21vZHVsZXMvQGF6dXJlL29wZW5haS9kaXN0LWVzbS9zcmMvYXBpL09wZW5BSUNvbnRleHQuanMiLCJ3ZWJwYWNrOi8vZXh0ZW5zaW9uLy4vbm9kZV9tb2R1bGVzL0BhenVyZS9vcGVuYWkvZGlzdC1lc20vc3JjL2FwaS9nZXRTU0VzLmJyb3dzZXIuanMiLCJ3ZWJwYWNrOi8vZXh0ZW5zaW9uLy4vbm9kZV9tb2R1bGVzL0BhenVyZS9vcGVuYWkvZGlzdC1lc20vc3JjL2FwaS9vYWlTc2UuanMiLCJ3ZWJwYWNrOi8vZXh0ZW5zaW9uLy4vbm9kZV9tb2R1bGVzL0BhenVyZS9vcGVuYWkvZGlzdC1lc20vc3JjL2FwaS9vcGVyYXRpb25zLmpzIiwid2VicGFjazovL2V4dGVuc2lvbi8uL25vZGVfbW9kdWxlcy9AYXp1cmUvb3BlbmFpL2Rpc3QtZXNtL3NyYy9hcGkvcG9saWNpZXMvbm9uQXp1cmUuanMiLCJ3ZWJwYWNrOi8vZXh0ZW5zaW9uLy4vbm9kZV9tb2R1bGVzL0BhenVyZS9vcGVuYWkvZGlzdC1lc20vc3JjL2FwaS9yZWFkYWJsZVN0cmVhbVV0aWxzLmpzIiwid2VicGFjazovL2V4dGVuc2lvbi8uL25vZGVfbW9kdWxlcy9AYXp1cmUvb3BlbmFpL2Rpc3QtZXNtL3NyYy9hcGkvdXRpbC5qcyIsIndlYnBhY2s6Ly9leHRlbnNpb24vLi9ub2RlX21vZHVsZXMvQGF6dXJlL29wZW5haS9kaXN0LWVzbS9zcmMvbG9nZ2VyLmpzIiwid2VicGFjazovL2V4dGVuc2lvbi8uL25vZGVfbW9kdWxlcy9AYXp1cmUvb3BlbmFpL2Rpc3QtZXNtL3NyYy9yZXN0L2luZGV4LmpzIiwid2VicGFjazovL2V4dGVuc2lvbi8uL25vZGVfbW9kdWxlcy9AYXp1cmUvb3BlbmFpL2Rpc3QtZXNtL3NyYy9yZXN0L2lzVW5leHBlY3RlZC5qcyIsIndlYnBhY2s6Ly9leHRlbnNpb24vLi9ub2RlX21vZHVsZXMvQGF6dXJlL29wZW5haS9kaXN0LWVzbS9zcmMvcmVzdC9vcGVuQUlDbGllbnQuanMiLCJ3ZWJwYWNrOi8vZXh0ZW5zaW9uLy4vbm9kZV9tb2R1bGVzL0BhenVyZS9vcGVuYWkvZGlzdC1lc20vc3JjL3V0aWxzL3NlcmlhbGl6ZVV0aWwuanMiLCJ3ZWJwYWNrOi8vZXh0ZW5zaW9uLy4vbm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5tanMiLCJ3ZWJwYWNrOi8vZXh0ZW5zaW9uL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2V4dGVuc2lvbi93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vZXh0ZW5zaW9uL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vZXh0ZW5zaW9uL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vZXh0ZW5zaW9uLy4vc3JjL3Rlc3QuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG5leHBvcnQgY29uc3QgYXBpVmVyc2lvblBvbGljeU5hbWUgPSBcIkFwaVZlcnNpb25Qb2xpY3lcIjtcbi8qKlxuICogQ3JlYXRlcyBhIHBvbGljeSB0aGF0IHNldHMgdGhlIGFwaVZlcnNpb24gYXMgYSBxdWVyeSBwYXJhbWV0ZXIgb24gZXZlcnkgcmVxdWVzdFxuICogQHBhcmFtIG9wdGlvbnMgLSBDbGllbnQgb3B0aW9uc1xuICogQHJldHVybnMgUGlwZWxpbmUgcG9saWN5IHRoYXQgc2V0cyB0aGUgYXBpVmVyc2lvbiBhcyBhIHF1ZXJ5IHBhcmFtZXRlciBvbiBldmVyeSByZXF1ZXN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhcGlWZXJzaW9uUG9saWN5KG9wdGlvbnMpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBuYW1lOiBhcGlWZXJzaW9uUG9saWN5TmFtZSxcbiAgICAgICAgc2VuZFJlcXVlc3Q6IChyZXEsIG5leHQpID0+IHtcbiAgICAgICAgICAgIC8vIFVzZSB0aGUgYXBpVmVzaW9uIGRlZmluZWQgaW4gcmVxdWVzdCB1cmwgZGlyZWN0bHlcbiAgICAgICAgICAgIC8vIEFwcGVuZCBvbmUgaWYgdGhlcmUgaXMgbm8gYXBpVmVzaW9uIGFuZCB3ZSBoYXZlIG9uZSBhdCBjbGllbnQgb3B0aW9uc1xuICAgICAgICAgICAgY29uc3QgdXJsID0gbmV3IFVSTChyZXEudXJsKTtcbiAgICAgICAgICAgIGlmICghdXJsLnNlYXJjaFBhcmFtcy5nZXQoXCJhcGktdmVyc2lvblwiKSAmJiBvcHRpb25zLmFwaVZlcnNpb24pIHtcbiAgICAgICAgICAgICAgICByZXEudXJsID0gYCR7cmVxLnVybH0ke0FycmF5LmZyb20odXJsLnNlYXJjaFBhcmFtcy5rZXlzKCkpLmxlbmd0aCA+IDAgPyBcIiZcIiA6IFwiP1wifWFwaS12ZXJzaW9uPSR7b3B0aW9ucy5hcGlWZXJzaW9ufWA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbmV4dChyZXEpO1xuICAgICAgICB9LFxuICAgIH07XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcGlWZXJzaW9uUG9saWN5LmpzLm1hcCIsIi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuaW1wb3J0IHsgYmVhcmVyVG9rZW5BdXRoZW50aWNhdGlvblBvbGljeSwgY3JlYXRlRGVmYXVsdEh0dHBDbGllbnQsIGNyZWF0ZVBpcGVsaW5lRnJvbU9wdGlvbnMsIH0gZnJvbSBcIkBhenVyZS9jb3JlLXJlc3QtcGlwZWxpbmVcIjtcbmltcG9ydCB7IGlzVG9rZW5DcmVkZW50aWFsIH0gZnJvbSBcIkBhenVyZS9jb3JlLWF1dGhcIjtcbmltcG9ydCB7IGFwaVZlcnNpb25Qb2xpY3kgfSBmcm9tIFwiLi9hcGlWZXJzaW9uUG9saWN5LmpzXCI7XG5pbXBvcnQgeyBrZXlDcmVkZW50aWFsQXV0aGVudGljYXRpb25Qb2xpY3kgfSBmcm9tIFwiLi9rZXlDcmVkZW50aWFsQXV0aGVudGljYXRpb25Qb2xpY3kuanNcIjtcbmxldCBjYWNoZWRIdHRwQ2xpZW50O1xuLyoqXG4gKiBBZGRzIGEgY3JlZGVudGlhbCBwb2xpY3kgdG8gdGhlIHBpcGVsaW5lIGlmIGEgY3JlZGVudGlhbCBpcyBwcm92aWRlZC4gSWYgbm9uZSBpcyBwcm92aWRlZCwgbm8gcG9saWN5IGlzIGFkZGVkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYWRkQ3JlZGVudGlhbFBpcGVsaW5lUG9saWN5KHBpcGVsaW5lLCBlbmRwb2ludCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgdmFyIF9hLCBfYiwgX2MsIF9kO1xuICAgIGNvbnN0IHsgY3JlZGVudGlhbCwgY2xpZW50T3B0aW9ucyB9ID0gb3B0aW9ucztcbiAgICBpZiAoIWNyZWRlbnRpYWwpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoaXNUb2tlbkNyZWRlbnRpYWwoY3JlZGVudGlhbCkpIHtcbiAgICAgICAgY29uc3QgdG9rZW5Qb2xpY3kgPSBiZWFyZXJUb2tlbkF1dGhlbnRpY2F0aW9uUG9saWN5KHtcbiAgICAgICAgICAgIGNyZWRlbnRpYWwsXG4gICAgICAgICAgICBzY29wZXM6IChfYiA9IChfYSA9IGNsaWVudE9wdGlvbnMgPT09IG51bGwgfHwgY2xpZW50T3B0aW9ucyA9PT0gdm9pZCAwID8gdm9pZCAwIDogY2xpZW50T3B0aW9ucy5jcmVkZW50aWFscykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnNjb3BlcykgIT09IG51bGwgJiYgX2IgIT09IHZvaWQgMCA/IF9iIDogYCR7ZW5kcG9pbnR9Ly5kZWZhdWx0YCxcbiAgICAgICAgfSk7XG4gICAgICAgIHBpcGVsaW5lLmFkZFBvbGljeSh0b2tlblBvbGljeSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKGlzS2V5Q3JlZGVudGlhbChjcmVkZW50aWFsKSkge1xuICAgICAgICBpZiAoISgoX2MgPSBjbGllbnRPcHRpb25zID09PSBudWxsIHx8IGNsaWVudE9wdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGNsaWVudE9wdGlvbnMuY3JlZGVudGlhbHMpID09PSBudWxsIHx8IF9jID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYy5hcGlLZXlIZWFkZXJOYW1lKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBNaXNzaW5nIEFQSSBLZXkgSGVhZGVyIE5hbWVgKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBrZXlQb2xpY3kgPSBrZXlDcmVkZW50aWFsQXV0aGVudGljYXRpb25Qb2xpY3koY3JlZGVudGlhbCwgKF9kID0gY2xpZW50T3B0aW9ucyA9PT0gbnVsbCB8fCBjbGllbnRPcHRpb25zID09PSB2b2lkIDAgPyB2b2lkIDAgOiBjbGllbnRPcHRpb25zLmNyZWRlbnRpYWxzKSA9PT0gbnVsbCB8fCBfZCA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2QuYXBpS2V5SGVhZGVyTmFtZSk7XG4gICAgICAgIHBpcGVsaW5lLmFkZFBvbGljeShrZXlQb2xpY3kpO1xuICAgIH1cbn1cbi8qKlxuICogQ3JlYXRlcyBhIGRlZmF1bHQgcmVzdCBwaXBlbGluZSB0byByZS11c2UgYWNjcm9zcyBSZXN0IExldmVsIENsaWVudHNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZURlZmF1bHRQaXBlbGluZShlbmRwb2ludCwgY3JlZGVudGlhbCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgcGlwZWxpbmUgPSBjcmVhdGVQaXBlbGluZUZyb21PcHRpb25zKG9wdGlvbnMpO1xuICAgIHBpcGVsaW5lLmFkZFBvbGljeShhcGlWZXJzaW9uUG9saWN5KG9wdGlvbnMpKTtcbiAgICBhZGRDcmVkZW50aWFsUGlwZWxpbmVQb2xpY3kocGlwZWxpbmUsIGVuZHBvaW50LCB7IGNyZWRlbnRpYWwsIGNsaWVudE9wdGlvbnM6IG9wdGlvbnMgfSk7XG4gICAgcmV0dXJuIHBpcGVsaW5lO1xufVxuZnVuY3Rpb24gaXNLZXlDcmVkZW50aWFsKGNyZWRlbnRpYWwpIHtcbiAgICByZXR1cm4gY3JlZGVudGlhbC5rZXkgIT09IHVuZGVmaW5lZDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBnZXRDYWNoZWREZWZhdWx0SHR0cHNDbGllbnQoKSB7XG4gICAgaWYgKCFjYWNoZWRIdHRwQ2xpZW50KSB7XG4gICAgICAgIGNhY2hlZEh0dHBDbGllbnQgPSBjcmVhdGVEZWZhdWx0SHR0cENsaWVudCgpO1xuICAgIH1cbiAgICByZXR1cm4gY2FjaGVkSHR0cENsaWVudDtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNsaWVudEhlbHBlcnMuanMubWFwIiwiLy8gQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG5leHBvcnQge307XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jb21tb24uanMubWFwIiwiLy8gQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG5pbXBvcnQgeyBpc1Rva2VuQ3JlZGVudGlhbCB9IGZyb20gXCJAYXp1cmUvY29yZS1hdXRoXCI7XG5pbXBvcnQgeyBjcmVhdGVEZWZhdWx0UGlwZWxpbmUgfSBmcm9tIFwiLi9jbGllbnRIZWxwZXJzLmpzXCI7XG5pbXBvcnQgeyBzZW5kUmVxdWVzdCB9IGZyb20gXCIuL3NlbmRSZXF1ZXN0LmpzXCI7XG5pbXBvcnQgeyBidWlsZFJlcXVlc3RVcmwgfSBmcm9tIFwiLi91cmxIZWxwZXJzLmpzXCI7XG5leHBvcnQgZnVuY3Rpb24gZ2V0Q2xpZW50KGVuZHBvaW50LCBjcmVkZW50aWFsc09yUGlwZWxpbmVPcHRpb25zLCBjbGllbnRPcHRpb25zID0ge30pIHtcbiAgICB2YXIgX2EsIF9iO1xuICAgIGxldCBjcmVkZW50aWFscztcbiAgICBpZiAoY3JlZGVudGlhbHNPclBpcGVsaW5lT3B0aW9ucykge1xuICAgICAgICBpZiAoaXNDcmVkZW50aWFsKGNyZWRlbnRpYWxzT3JQaXBlbGluZU9wdGlvbnMpKSB7XG4gICAgICAgICAgICBjcmVkZW50aWFscyA9IGNyZWRlbnRpYWxzT3JQaXBlbGluZU9wdGlvbnM7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjbGllbnRPcHRpb25zID0gY3JlZGVudGlhbHNPclBpcGVsaW5lT3B0aW9ucyAhPT0gbnVsbCAmJiBjcmVkZW50aWFsc09yUGlwZWxpbmVPcHRpb25zICE9PSB2b2lkIDAgPyBjcmVkZW50aWFsc09yUGlwZWxpbmVPcHRpb25zIDoge307XG4gICAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgcGlwZWxpbmUgPSBjcmVhdGVEZWZhdWx0UGlwZWxpbmUoZW5kcG9pbnQsIGNyZWRlbnRpYWxzLCBjbGllbnRPcHRpb25zKTtcbiAgICBpZiAoKF9hID0gY2xpZW50T3B0aW9ucy5hZGRpdGlvbmFsUG9saWNpZXMpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5sZW5ndGgpIHtcbiAgICAgICAgZm9yIChjb25zdCB7IHBvbGljeSwgcG9zaXRpb24gfSBvZiBjbGllbnRPcHRpb25zLmFkZGl0aW9uYWxQb2xpY2llcykge1xuICAgICAgICAgICAgLy8gU2lnbiBoYXBwZW5zIGFmdGVyIFJldHJ5IGFuZCBpcyBjb21tb25seSBuZWVkZWQgdG8gb2NjdXJcbiAgICAgICAgICAgIC8vIGJlZm9yZSBwb2xpY2llcyB0aGF0IGludGVyY2VwdCBwb3N0LXJldHJ5LlxuICAgICAgICAgICAgY29uc3QgYWZ0ZXJQaGFzZSA9IHBvc2l0aW9uID09PSBcInBlclJldHJ5XCIgPyBcIlNpZ25cIiA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIHBpcGVsaW5lLmFkZFBvbGljeShwb2xpY3ksIHtcbiAgICAgICAgICAgICAgICBhZnRlclBoYXNlLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgeyBhbGxvd0luc2VjdXJlQ29ubmVjdGlvbiwgaHR0cENsaWVudCB9ID0gY2xpZW50T3B0aW9ucztcbiAgICBjb25zdCBlbmRwb2ludFVybCA9IChfYiA9IGNsaWVudE9wdGlvbnMuZW5kcG9pbnQpICE9PSBudWxsICYmIF9iICE9PSB2b2lkIDAgPyBfYiA6IGVuZHBvaW50O1xuICAgIGNvbnN0IGNsaWVudCA9IChwYXRoLCAuLi5hcmdzKSA9PiB7XG4gICAgICAgIGNvbnN0IGdldFVybCA9IChyZXF1ZXN0T3B0aW9ucykgPT4gYnVpbGRSZXF1ZXN0VXJsKGVuZHBvaW50VXJsLCBwYXRoLCBhcmdzLCBPYmplY3QuYXNzaWduKHsgYWxsb3dJbnNlY3VyZUNvbm5lY3Rpb24gfSwgcmVxdWVzdE9wdGlvbnMpKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGdldDogKHJlcXVlc3RPcHRpb25zID0ge30pID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYnVpbGRPcGVyYXRpb24oXCJHRVRcIiwgZ2V0VXJsKHJlcXVlc3RPcHRpb25zKSwgcGlwZWxpbmUsIHJlcXVlc3RPcHRpb25zLCBhbGxvd0luc2VjdXJlQ29ubmVjdGlvbiwgaHR0cENsaWVudCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcG9zdDogKHJlcXVlc3RPcHRpb25zID0ge30pID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYnVpbGRPcGVyYXRpb24oXCJQT1NUXCIsIGdldFVybChyZXF1ZXN0T3B0aW9ucyksIHBpcGVsaW5lLCByZXF1ZXN0T3B0aW9ucywgYWxsb3dJbnNlY3VyZUNvbm5lY3Rpb24sIGh0dHBDbGllbnQpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHB1dDogKHJlcXVlc3RPcHRpb25zID0ge30pID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYnVpbGRPcGVyYXRpb24oXCJQVVRcIiwgZ2V0VXJsKHJlcXVlc3RPcHRpb25zKSwgcGlwZWxpbmUsIHJlcXVlc3RPcHRpb25zLCBhbGxvd0luc2VjdXJlQ29ubmVjdGlvbiwgaHR0cENsaWVudCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcGF0Y2g6IChyZXF1ZXN0T3B0aW9ucyA9IHt9KSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGJ1aWxkT3BlcmF0aW9uKFwiUEFUQ0hcIiwgZ2V0VXJsKHJlcXVlc3RPcHRpb25zKSwgcGlwZWxpbmUsIHJlcXVlc3RPcHRpb25zLCBhbGxvd0luc2VjdXJlQ29ubmVjdGlvbiwgaHR0cENsaWVudCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGVsZXRlOiAocmVxdWVzdE9wdGlvbnMgPSB7fSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBidWlsZE9wZXJhdGlvbihcIkRFTEVURVwiLCBnZXRVcmwocmVxdWVzdE9wdGlvbnMpLCBwaXBlbGluZSwgcmVxdWVzdE9wdGlvbnMsIGFsbG93SW5zZWN1cmVDb25uZWN0aW9uLCBodHRwQ2xpZW50KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBoZWFkOiAocmVxdWVzdE9wdGlvbnMgPSB7fSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBidWlsZE9wZXJhdGlvbihcIkhFQURcIiwgZ2V0VXJsKHJlcXVlc3RPcHRpb25zKSwgcGlwZWxpbmUsIHJlcXVlc3RPcHRpb25zLCBhbGxvd0luc2VjdXJlQ29ubmVjdGlvbiwgaHR0cENsaWVudCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb3B0aW9uczogKHJlcXVlc3RPcHRpb25zID0ge30pID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYnVpbGRPcGVyYXRpb24oXCJPUFRJT05TXCIsIGdldFVybChyZXF1ZXN0T3B0aW9ucyksIHBpcGVsaW5lLCByZXF1ZXN0T3B0aW9ucywgYWxsb3dJbnNlY3VyZUNvbm5lY3Rpb24sIGh0dHBDbGllbnQpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRyYWNlOiAocmVxdWVzdE9wdGlvbnMgPSB7fSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBidWlsZE9wZXJhdGlvbihcIlRSQUNFXCIsIGdldFVybChyZXF1ZXN0T3B0aW9ucyksIHBpcGVsaW5lLCByZXF1ZXN0T3B0aW9ucywgYWxsb3dJbnNlY3VyZUNvbm5lY3Rpb24sIGh0dHBDbGllbnQpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICB9O1xuICAgIHJldHVybiB7XG4gICAgICAgIHBhdGg6IGNsaWVudCxcbiAgICAgICAgcGF0aFVuY2hlY2tlZDogY2xpZW50LFxuICAgICAgICBwaXBlbGluZSxcbiAgICB9O1xufVxuZnVuY3Rpb24gYnVpbGRPcGVyYXRpb24obWV0aG9kLCB1cmwsIHBpcGVsaW5lLCBvcHRpb25zLCBhbGxvd0luc2VjdXJlQ29ubmVjdGlvbiwgaHR0cENsaWVudCkge1xuICAgIHZhciBfYTtcbiAgICBhbGxvd0luc2VjdXJlQ29ubmVjdGlvbiA9IChfYSA9IG9wdGlvbnMuYWxsb3dJbnNlY3VyZUNvbm5lY3Rpb24pICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IGFsbG93SW5zZWN1cmVDb25uZWN0aW9uO1xuICAgIHJldHVybiB7XG4gICAgICAgIHRoZW46IGZ1bmN0aW9uIChvbkZ1bGZpbGxlZCwgb25yZWplY3RlZCkge1xuICAgICAgICAgICAgcmV0dXJuIHNlbmRSZXF1ZXN0KG1ldGhvZCwgdXJsLCBwaXBlbGluZSwgT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zKSwgeyBhbGxvd0luc2VjdXJlQ29ubmVjdGlvbiB9KSwgaHR0cENsaWVudCkudGhlbihvbkZ1bGZpbGxlZCwgb25yZWplY3RlZCk7XG4gICAgICAgIH0sXG4gICAgICAgIGFzeW5jIGFzQnJvd3NlclN0cmVhbSgpIHtcbiAgICAgICAgICAgIHJldHVybiBzZW5kUmVxdWVzdChtZXRob2QsIHVybCwgcGlwZWxpbmUsIE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucyksIHsgYWxsb3dJbnNlY3VyZUNvbm5lY3Rpb24sIHJlc3BvbnNlQXNTdHJlYW06IHRydWUgfSksIGh0dHBDbGllbnQpO1xuICAgICAgICB9LFxuICAgICAgICBhc3luYyBhc05vZGVTdHJlYW0oKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VuZFJlcXVlc3QobWV0aG9kLCB1cmwsIHBpcGVsaW5lLCBPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMpLCB7IGFsbG93SW5zZWN1cmVDb25uZWN0aW9uLCByZXNwb25zZUFzU3RyZWFtOiB0cnVlIH0pLCBodHRwQ2xpZW50KTtcbiAgICAgICAgfSxcbiAgICB9O1xufVxuZnVuY3Rpb24gaXNDcmVkZW50aWFsKHBhcmFtKSB7XG4gICAgaWYgKHBhcmFtLmtleSAhPT0gdW5kZWZpbmVkIHx8IGlzVG9rZW5DcmVkZW50aWFsKHBhcmFtKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Z2V0Q2xpZW50LmpzLm1hcCIsIi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuLyoqXG4gKiBDaGVja3MgaWYgdGhlIGJvZHkgaXMgYSBSZWFkYWJsZVN0cmVhbSBzdXBwb3J0ZWQgYnkgYnJvd3NlcnNcbiAqIEBpbnRlcm5hbFxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNSZWFkYWJsZVN0cmVhbShib2R5KSB7XG4gICAgcmV0dXJuIEJvb2xlYW4oYm9keSAmJlxuICAgICAgICB0eXBlb2YgYm9keS5nZXRSZWFkZXIgPT09IFwiZnVuY3Rpb25cIiAmJlxuICAgICAgICB0eXBlb2YgYm9keS50ZWUgPT09IFwiZnVuY3Rpb25cIik7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pc1JlYWRhYmxlU3RyZWFtLWJyb3dzZXIubWpzLm1hcCIsIi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuLyoqXG4gKiBBenVyZSBSZXN0IENvcmUgQ2xpZW50IGxpYnJhcnkgZm9yIEphdmFTY3JpcHRcbiAqIEBwYWNrYWdlRG9jdW1lbnRhdGlvblxuICovXG5leHBvcnQgeyBjcmVhdGVSZXN0RXJyb3IgfSBmcm9tIFwiLi9yZXN0RXJyb3IuanNcIjtcbmV4cG9ydCB7IGFkZENyZWRlbnRpYWxQaXBlbGluZVBvbGljeSwgfSBmcm9tIFwiLi9jbGllbnRIZWxwZXJzLmpzXCI7XG5leHBvcnQgeyBvcGVyYXRpb25PcHRpb25zVG9SZXF1ZXN0UGFyYW1ldGVycyB9IGZyb20gXCIuL29wZXJhdGlvbk9wdGlvbkhlbHBlcnMuanNcIjtcbmV4cG9ydCAqIGZyb20gXCIuL2dldENsaWVudC5qc1wiO1xuZXhwb3J0ICogZnJvbSBcIi4vY29tbW9uLmpzXCI7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiLCIvLyBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi5cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbi8qKlxuICogVGhlIHByb2dyYW1tYXRpYyBpZGVudGlmaWVyIG9mIHRoZSBiZWFyZXJUb2tlbkF1dGhlbnRpY2F0aW9uUG9saWN5LlxuICovXG5leHBvcnQgY29uc3Qga2V5Q3JlZGVudGlhbEF1dGhlbnRpY2F0aW9uUG9saWN5TmFtZSA9IFwia2V5Q3JlZGVudGlhbEF1dGhlbnRpY2F0aW9uUG9saWN5XCI7XG5leHBvcnQgZnVuY3Rpb24ga2V5Q3JlZGVudGlhbEF1dGhlbnRpY2F0aW9uUG9saWN5KGNyZWRlbnRpYWwsIGFwaUtleUhlYWRlck5hbWUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBuYW1lOiBrZXlDcmVkZW50aWFsQXV0aGVudGljYXRpb25Qb2xpY3lOYW1lLFxuICAgICAgICBhc3luYyBzZW5kUmVxdWVzdChyZXF1ZXN0LCBuZXh0KSB7XG4gICAgICAgICAgICByZXF1ZXN0LmhlYWRlcnMuc2V0KGFwaUtleUhlYWRlck5hbWUsIGNyZWRlbnRpYWwua2V5KTtcbiAgICAgICAgICAgIHJldHVybiBuZXh0KHJlcXVlc3QpO1xuICAgICAgICB9LFxuICAgIH07XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1rZXlDcmVkZW50aWFsQXV0aGVudGljYXRpb25Qb2xpY3kuanMubWFwIiwiLy8gQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4vKipcbiAqIEhlbHBlciBmdW5jdGlvbiB0byBjb252ZXJ0IE9wZXJhdGlvbk9wdGlvbnMgdG8gUmVxdWVzdFBhcmFtZXRlcnNcbiAqIEBwYXJhbSBvcHRpb25zIC0gdGhlIG9wdGlvbnMgdGhhdCBhcmUgdXNlZCBieSBNb2R1bGFyIGxheWVyIHRvIHNlbmQgdGhlIHJlcXVlc3RcbiAqIEByZXR1cm5zIHRoZSByZXN1bHQgb2YgdGhlIGNvbnZlcnNpb24gaW4gUmVxdWVzdFBhcmFtZXRlcnMgb2YgUkxDIGxheWVyXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBvcGVyYXRpb25PcHRpb25zVG9SZXF1ZXN0UGFyYW1ldGVycyhvcHRpb25zKSB7XG4gICAgdmFyIF9hLCBfYiwgX2MsIF9kLCBfZSwgX2Y7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgYWxsb3dJbnNlY3VyZUNvbm5lY3Rpb246IChfYSA9IG9wdGlvbnMucmVxdWVzdE9wdGlvbnMpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5hbGxvd0luc2VjdXJlQ29ubmVjdGlvbixcbiAgICAgICAgdGltZW91dDogKF9iID0gb3B0aW9ucy5yZXF1ZXN0T3B0aW9ucykgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLnRpbWVvdXQsXG4gICAgICAgIHNraXBVcmxFbmNvZGluZzogKF9jID0gb3B0aW9ucy5yZXF1ZXN0T3B0aW9ucykgPT09IG51bGwgfHwgX2MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9jLnNraXBVcmxFbmNvZGluZyxcbiAgICAgICAgYWJvcnRTaWduYWw6IG9wdGlvbnMuYWJvcnRTaWduYWwsXG4gICAgICAgIG9uVXBsb2FkUHJvZ3Jlc3M6IChfZCA9IG9wdGlvbnMucmVxdWVzdE9wdGlvbnMpID09PSBudWxsIHx8IF9kID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZC5vblVwbG9hZFByb2dyZXNzLFxuICAgICAgICBvbkRvd25sb2FkUHJvZ3Jlc3M6IChfZSA9IG9wdGlvbnMucmVxdWVzdE9wdGlvbnMpID09PSBudWxsIHx8IF9lID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZS5vbkRvd25sb2FkUHJvZ3Jlc3MsXG4gICAgICAgIHRyYWNpbmdPcHRpb25zOiBvcHRpb25zLnRyYWNpbmdPcHRpb25zLFxuICAgICAgICBoZWFkZXJzOiBPYmplY3QuYXNzaWduKHt9LCAoX2YgPSBvcHRpb25zLnJlcXVlc3RPcHRpb25zKSA9PT0gbnVsbCB8fCBfZiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2YuaGVhZGVycyksXG4gICAgICAgIG9uUmVzcG9uc2U6IG9wdGlvbnMub25SZXNwb25zZSxcbiAgICB9O1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9b3BlcmF0aW9uT3B0aW9uSGVscGVycy5qcy5tYXAiLCIvLyBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi5cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbmltcG9ydCB7IFJlc3RFcnJvciwgY3JlYXRlSHR0cEhlYWRlcnMgfSBmcm9tIFwiQGF6dXJlL2NvcmUtcmVzdC1waXBlbGluZVwiO1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVJlc3RFcnJvcihtZXNzYWdlT3JSZXNwb25zZSwgcmVzcG9uc2UpIHtcbiAgICB2YXIgX2E7XG4gICAgY29uc3QgcmVzcCA9IHR5cGVvZiBtZXNzYWdlT3JSZXNwb25zZSA9PT0gXCJzdHJpbmdcIiA/IHJlc3BvbnNlIDogbWVzc2FnZU9yUmVzcG9uc2U7XG4gICAgY29uc3QgaW50ZXJuYWxFcnJvciA9IHJlc3AuYm9keS5lcnJvciB8fCByZXNwLmJvZHk7XG4gICAgY29uc3QgbWVzc2FnZSA9IHR5cGVvZiBtZXNzYWdlT3JSZXNwb25zZSA9PT0gXCJzdHJpbmdcIlxuICAgICAgICA/IG1lc3NhZ2VPclJlc3BvbnNlXG4gICAgICAgIDogKF9hID0gaW50ZXJuYWxFcnJvci5tZXNzYWdlKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBgVW5leHBlY3RlZCBzdGF0dXMgY29kZTogJHtyZXNwLnN0YXR1c31gO1xuICAgIHJldHVybiBuZXcgUmVzdEVycm9yKG1lc3NhZ2UsIHtcbiAgICAgICAgc3RhdHVzQ29kZTogc3RhdHVzQ29kZVRvTnVtYmVyKHJlc3Auc3RhdHVzKSxcbiAgICAgICAgY29kZTogaW50ZXJuYWxFcnJvci5jb2RlLFxuICAgICAgICByZXF1ZXN0OiByZXNwLnJlcXVlc3QsXG4gICAgICAgIHJlc3BvbnNlOiB0b1BpcGVsaW5lUmVzcG9uc2UocmVzcCksXG4gICAgfSk7XG59XG5mdW5jdGlvbiB0b1BpcGVsaW5lUmVzcG9uc2UocmVzcG9uc2UpIHtcbiAgICB2YXIgX2E7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgaGVhZGVyczogY3JlYXRlSHR0cEhlYWRlcnMocmVzcG9uc2UuaGVhZGVycyksXG4gICAgICAgIHJlcXVlc3Q6IHJlc3BvbnNlLnJlcXVlc3QsXG4gICAgICAgIHN0YXR1czogKF9hID0gc3RhdHVzQ29kZVRvTnVtYmVyKHJlc3BvbnNlLnN0YXR1cykpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IC0xLFxuICAgIH07XG59XG5mdW5jdGlvbiBzdGF0dXNDb2RlVG9OdW1iZXIoc3RhdHVzQ29kZSkge1xuICAgIGNvbnN0IHN0YXR1cyA9IE51bWJlci5wYXJzZUludChzdGF0dXNDb2RlKTtcbiAgICByZXR1cm4gTnVtYmVyLmlzTmFOKHN0YXR1cykgPyB1bmRlZmluZWQgOiBzdGF0dXM7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1yZXN0RXJyb3IuanMubWFwIiwiLy8gQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG5pbXBvcnQgeyBSZXN0RXJyb3IsIGNyZWF0ZUZpbGUsIGNyZWF0ZUh0dHBIZWFkZXJzLCBjcmVhdGVQaXBlbGluZVJlcXVlc3QsIH0gZnJvbSBcIkBhenVyZS9jb3JlLXJlc3QtcGlwZWxpbmVcIjtcbmltcG9ydCB7IGdldENhY2hlZERlZmF1bHRIdHRwc0NsaWVudCB9IGZyb20gXCIuL2NsaWVudEhlbHBlcnMuanNcIjtcbmltcG9ydCB7IGlzUmVhZGFibGVTdHJlYW0gfSBmcm9tIFwiLi9oZWxwZXJzL2lzUmVhZGFibGVTdHJlYW0uanNcIjtcbi8qKlxuICogSGVscGVyIGZ1bmN0aW9uIHRvIHNlbmQgcmVxdWVzdCB1c2VkIGJ5IHRoZSBjbGllbnRcbiAqIEBwYXJhbSBtZXRob2QgLSBtZXRob2QgdG8gdXNlIHRvIHNlbmQgdGhlIHJlcXVlc3RcbiAqIEBwYXJhbSB1cmwgLSB1cmwgdG8gc2VuZCB0aGUgcmVxdWVzdCB0b1xuICogQHBhcmFtIHBpcGVsaW5lIC0gcGlwZWxpbmUgd2l0aCB0aGUgcG9saWNpZXMgdG8gcnVuIHdoZW4gc2VuZGluZyB0aGUgcmVxdWVzdFxuICogQHBhcmFtIG9wdGlvbnMgLSByZXF1ZXN0IG9wdGlvbnNcbiAqIEBwYXJhbSBjdXN0b21IdHRwQ2xpZW50IC0gYSBjdXN0b20gSHR0cENsaWVudCB0byB1c2Ugd2hlbiBtYWtpbmcgdGhlIHJlcXVlc3RcbiAqIEByZXR1cm5zIHJldHVybnMgYW5kIEh0dHBSZXNwb25zZVxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2VuZFJlcXVlc3QobWV0aG9kLCB1cmwsIHBpcGVsaW5lLCBvcHRpb25zID0ge30sIGN1c3RvbUh0dHBDbGllbnQpIHtcbiAgICB2YXIgX2E7XG4gICAgY29uc3QgaHR0cENsaWVudCA9IGN1c3RvbUh0dHBDbGllbnQgIT09IG51bGwgJiYgY3VzdG9tSHR0cENsaWVudCAhPT0gdm9pZCAwID8gY3VzdG9tSHR0cENsaWVudCA6IGdldENhY2hlZERlZmF1bHRIdHRwc0NsaWVudCgpO1xuICAgIGNvbnN0IHJlcXVlc3QgPSBidWlsZFBpcGVsaW5lUmVxdWVzdChtZXRob2QsIHVybCwgb3B0aW9ucyk7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBwaXBlbGluZS5zZW5kUmVxdWVzdChodHRwQ2xpZW50LCByZXF1ZXN0KTtcbiAgICBjb25zdCBoZWFkZXJzID0gcmVzcG9uc2UuaGVhZGVycy50b0pTT04oKTtcbiAgICBjb25zdCBzdHJlYW0gPSAoX2EgPSByZXNwb25zZS5yZWFkYWJsZVN0cmVhbUJvZHkpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IHJlc3BvbnNlLmJyb3dzZXJTdHJlYW1Cb2R5O1xuICAgIGNvbnN0IHBhcnNlZEJvZHkgPSBvcHRpb25zLnJlc3BvbnNlQXNTdHJlYW0gfHwgc3RyZWFtICE9PSB1bmRlZmluZWQgPyB1bmRlZmluZWQgOiBnZXRSZXNwb25zZUJvZHkocmVzcG9uc2UpO1xuICAgIGNvbnN0IGJvZHkgPSBzdHJlYW0gIT09IG51bGwgJiYgc3RyZWFtICE9PSB2b2lkIDAgPyBzdHJlYW0gOiBwYXJzZWRCb2R5O1xuICAgIGlmIChvcHRpb25zID09PSBudWxsIHx8IG9wdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9wdGlvbnMub25SZXNwb25zZSkge1xuICAgICAgICBvcHRpb25zLm9uUmVzcG9uc2UoT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCByZXNwb25zZSksIHsgcmVxdWVzdCwgcmF3SGVhZGVyczogaGVhZGVycywgcGFyc2VkQm9keSB9KSk7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIHJlcXVlc3QsXG4gICAgICAgIGhlYWRlcnMsXG4gICAgICAgIHN0YXR1czogYCR7cmVzcG9uc2Uuc3RhdHVzfWAsXG4gICAgICAgIGJvZHksXG4gICAgfTtcbn1cbi8qKlxuICogRnVuY3Rpb24gdG8gZGV0ZXJtaW5lIHRoZSByZXF1ZXN0IGNvbnRlbnQgdHlwZVxuICogQHBhcmFtIG9wdGlvbnMgLSByZXF1ZXN0IG9wdGlvbnMgSW50ZXJuYWxSZXF1ZXN0UGFyYW1ldGVyc1xuICogQHJldHVybnMgcmV0dXJucyB0aGUgY29udGVudC10eXBlXG4gKi9cbmZ1bmN0aW9uIGdldFJlcXVlc3RDb250ZW50VHlwZShvcHRpb25zID0ge30pIHtcbiAgICB2YXIgX2EsIF9iLCBfYztcbiAgICByZXR1cm4gKChfYyA9IChfYSA9IG9wdGlvbnMuY29udGVudFR5cGUpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IChfYiA9IG9wdGlvbnMuaGVhZGVycykgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iW1wiY29udGVudC10eXBlXCJdKSAhPT0gbnVsbCAmJiBfYyAhPT0gdm9pZCAwID8gX2MgOiBnZXRDb250ZW50VHlwZShvcHRpb25zLmJvZHkpKTtcbn1cbi8qKlxuICogRnVuY3Rpb24gdG8gZGV0ZXJtaW5lIHRoZSBjb250ZW50LXR5cGUgb2YgYSBib2R5XG4gKiB0aGlzIGlzIHVzZWQgaWYgYW4gZXhwbGljaXQgY29udGVudC10eXBlIGlzIG5vdCBwcm92aWRlZFxuICogQHBhcmFtIGJvZHkgLSBib2R5IGluIHRoZSByZXF1ZXN0XG4gKiBAcmV0dXJucyByZXR1cm5zIHRoZSBjb250ZW50LXR5cGVcbiAqL1xuZnVuY3Rpb24gZ2V0Q29udGVudFR5cGUoYm9keSkge1xuICAgIGlmIChBcnJheUJ1ZmZlci5pc1ZpZXcoYm9keSkpIHtcbiAgICAgICAgcmV0dXJuIFwiYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtXCI7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgYm9keSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgSlNPTi5wYXJzZShib2R5KTtcbiAgICAgICAgICAgIHJldHVybiBcImFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9VVRGLThcIjtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIC8vIElmIHdlIGZhaWwgdG8gcGFyc2UgdGhlIGJvZHksIGl0IGlzIG5vdCBqc29uXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIEJ5IGRlZmF1bHQgcmV0dXJuIGpzb25cbiAgICByZXR1cm4gXCJhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PVVURi04XCI7XG59XG5mdW5jdGlvbiBidWlsZFBpcGVsaW5lUmVxdWVzdChtZXRob2QsIHVybCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgdmFyIF9hLCBfYiwgX2M7XG4gICAgY29uc3QgcmVxdWVzdENvbnRlbnRUeXBlID0gZ2V0UmVxdWVzdENvbnRlbnRUeXBlKG9wdGlvbnMpO1xuICAgIGNvbnN0IHsgYm9keSwgZm9ybURhdGEgfSA9IGdldFJlcXVlc3RCb2R5KG9wdGlvbnMuYm9keSwgcmVxdWVzdENvbnRlbnRUeXBlKTtcbiAgICBjb25zdCBoYXNDb250ZW50ID0gYm9keSAhPT0gdW5kZWZpbmVkIHx8IGZvcm1EYXRhICE9PSB1bmRlZmluZWQ7XG4gICAgY29uc3QgaGVhZGVycyA9IGNyZWF0ZUh0dHBIZWFkZXJzKE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCAob3B0aW9ucy5oZWFkZXJzID8gb3B0aW9ucy5oZWFkZXJzIDoge30pKSwgeyBhY2NlcHQ6IChfYyA9IChfYSA9IG9wdGlvbnMuYWNjZXB0KSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiAoX2IgPSBvcHRpb25zLmhlYWRlcnMpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5hY2NlcHQpICE9PSBudWxsICYmIF9jICE9PSB2b2lkIDAgPyBfYyA6IFwiYXBwbGljYXRpb24vanNvblwiIH0pLCAoaGFzQ29udGVudCAmJlxuICAgICAgICByZXF1ZXN0Q29udGVudFR5cGUgJiYge1xuICAgICAgICBcImNvbnRlbnQtdHlwZVwiOiByZXF1ZXN0Q29udGVudFR5cGUsXG4gICAgfSkpKTtcbiAgICByZXR1cm4gY3JlYXRlUGlwZWxpbmVSZXF1ZXN0KHtcbiAgICAgICAgdXJsLFxuICAgICAgICBtZXRob2QsXG4gICAgICAgIGJvZHksXG4gICAgICAgIGZvcm1EYXRhLFxuICAgICAgICBoZWFkZXJzLFxuICAgICAgICBhbGxvd0luc2VjdXJlQ29ubmVjdGlvbjogb3B0aW9ucy5hbGxvd0luc2VjdXJlQ29ubmVjdGlvbixcbiAgICAgICAgdHJhY2luZ09wdGlvbnM6IG9wdGlvbnMudHJhY2luZ09wdGlvbnMsXG4gICAgICAgIGFib3J0U2lnbmFsOiBvcHRpb25zLmFib3J0U2lnbmFsLFxuICAgICAgICBvblVwbG9hZFByb2dyZXNzOiBvcHRpb25zLm9uVXBsb2FkUHJvZ3Jlc3MsXG4gICAgICAgIG9uRG93bmxvYWRQcm9ncmVzczogb3B0aW9ucy5vbkRvd25sb2FkUHJvZ3Jlc3MsXG4gICAgICAgIHRpbWVvdXQ6IG9wdGlvbnMudGltZW91dCxcbiAgICAgICAgZW5hYmxlQnJvd3NlclN0cmVhbXM6IHRydWUsXG4gICAgICAgIHN0cmVhbVJlc3BvbnNlU3RhdHVzQ29kZXM6IG9wdGlvbnMucmVzcG9uc2VBc1N0cmVhbVxuICAgICAgICAgICAgPyBuZXcgU2V0KFtOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFldKVxuICAgICAgICAgICAgOiB1bmRlZmluZWQsXG4gICAgfSk7XG59XG4vKipcbiAqIFByZXBhcmVzIHRoZSBib2R5IGJlZm9yZSBzZW5kaW5nIHRoZSByZXF1ZXN0XG4gKi9cbmZ1bmN0aW9uIGdldFJlcXVlc3RCb2R5KGJvZHksIGNvbnRlbnRUeXBlID0gXCJcIikge1xuICAgIGlmIChib2R5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIHsgYm9keTogdW5kZWZpbmVkIH07XG4gICAgfVxuICAgIGlmIChpc1JlYWRhYmxlU3RyZWFtKGJvZHkpKSB7XG4gICAgICAgIHJldHVybiB7IGJvZHkgfTtcbiAgICB9XG4gICAgY29uc3QgZmlyc3RUeXBlID0gY29udGVudFR5cGUuc3BsaXQoXCI7XCIpWzBdO1xuICAgIGlmIChmaXJzdFR5cGUgPT09IFwiYXBwbGljYXRpb24vanNvblwiKSB7XG4gICAgICAgIHJldHVybiB7IGJvZHk6IEpTT04uc3RyaW5naWZ5KGJvZHkpIH07XG4gICAgfVxuICAgIGlmIChBcnJheUJ1ZmZlci5pc1ZpZXcoYm9keSkpIHtcbiAgICAgICAgcmV0dXJuIHsgYm9keTogYm9keSBpbnN0YW5jZW9mIFVpbnQ4QXJyYXkgPyBib2R5IDogSlNPTi5zdHJpbmdpZnkoYm9keSkgfTtcbiAgICB9XG4gICAgc3dpdGNoIChmaXJzdFR5cGUpIHtcbiAgICAgICAgY2FzZSBcIm11bHRpcGFydC9mb3JtLWRhdGFcIjpcbiAgICAgICAgICAgIHJldHVybiBpc1JMQ0Zvcm1EYXRhSW5wdXQoYm9keSlcbiAgICAgICAgICAgICAgICA/IHsgZm9ybURhdGE6IHByb2Nlc3NGb3JtRGF0YShib2R5KSB9XG4gICAgICAgICAgICAgICAgOiB7IGJvZHk6IEpTT04uc3RyaW5naWZ5KGJvZHkpIH07XG4gICAgICAgIGNhc2UgXCJ0ZXh0L3BsYWluXCI6XG4gICAgICAgICAgICByZXR1cm4geyBib2R5OiBTdHJpbmcoYm9keSkgfTtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGlmICh0eXBlb2YgYm9keSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiB7IGJvZHkgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB7IGJvZHk6IEpTT04uc3RyaW5naWZ5KGJvZHkpIH07XG4gICAgfVxufVxuZnVuY3Rpb24gaXNSTENGb3JtRGF0YVZhbHVlKHZhbHVlKSB7XG4gICAgcmV0dXJuICh0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIgfHxcbiAgICAgICAgdmFsdWUgaW5zdGFuY2VvZiBVaW50OEFycmF5IHx8XG4gICAgICAgIC8vIFdlIGRvbid0IGRvIGBpbnN0YW5jZW9mIEJsb2JgIHNpbmNlIHdlIHNob3VsZCBhbHNvIGFjY2VwdCBwb2x5ZmlsbHMgb2YgZS5nLiBGaWxlIGluIE5vZGUuXG4gICAgICAgIHR5cGVvZiB2YWx1ZS5zdHJlYW0gPT09IFwiZnVuY3Rpb25cIik7XG59XG5mdW5jdGlvbiBpc1JMQ0Zvcm1EYXRhSW5wdXQoYm9keSkge1xuICAgIHJldHVybiAoYm9keSAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgIGJvZHkgaW5zdGFuY2VvZiBPYmplY3QgJiZcbiAgICAgICAgT2JqZWN0LnZhbHVlcyhib2R5KS5ldmVyeSgodmFsdWUpID0+IGlzUkxDRm9ybURhdGFWYWx1ZSh2YWx1ZSkgfHwgKEFycmF5LmlzQXJyYXkodmFsdWUpICYmIHZhbHVlLmV2ZXJ5KGlzUkxDRm9ybURhdGFWYWx1ZSkpKSk7XG59XG5mdW5jdGlvbiBwcm9jZXNzRm9ybURhdGFWYWx1ZSh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFVpbnQ4QXJyYXkgPyBjcmVhdGVGaWxlKHZhbHVlLCBcImJsb2JcIikgOiB2YWx1ZTtcbn1cbi8qKlxuICogQ2hlY2tzIGlmIGJpbmFyeSBkYXRhIGlzIGluIFVpbnQ4QXJyYXkgZm9ybWF0LCBpZiBzbyB3cmFwIGl0IGluIGEgQmxvYlxuICogdG8gc2VuZCBvdmVyIHRoZSB3aXJlXG4gKi9cbmZ1bmN0aW9uIHByb2Nlc3NGb3JtRGF0YShmb3JtRGF0YSkge1xuICAgIGNvbnN0IHByb2Nlc3NlZEZvcm1EYXRhID0ge307XG4gICAgZm9yIChjb25zdCBlbGVtZW50IGluIGZvcm1EYXRhKSB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gZm9ybURhdGFbZWxlbWVudF07XG4gICAgICAgIHByb2Nlc3NlZEZvcm1EYXRhW2VsZW1lbnRdID0gQXJyYXkuaXNBcnJheSh2YWx1ZSlcbiAgICAgICAgICAgID8gdmFsdWUubWFwKHByb2Nlc3NGb3JtRGF0YVZhbHVlKVxuICAgICAgICAgICAgOiBwcm9jZXNzRm9ybURhdGFWYWx1ZSh2YWx1ZSk7XG4gICAgfVxuICAgIHJldHVybiBwcm9jZXNzZWRGb3JtRGF0YTtcbn1cbi8qKlxuICogUHJlcGFyZXMgdGhlIHJlc3BvbnNlIGJvZHlcbiAqL1xuZnVuY3Rpb24gZ2V0UmVzcG9uc2VCb2R5KHJlc3BvbnNlKSB7XG4gICAgdmFyIF9hLCBfYjtcbiAgICAvLyBTZXQgdGhlIGRlZmF1bHQgcmVzcG9uc2UgdHlwZVxuICAgIGNvbnN0IGNvbnRlbnRUeXBlID0gKF9hID0gcmVzcG9uc2UuaGVhZGVycy5nZXQoXCJjb250ZW50LXR5cGVcIikpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IFwiXCI7XG4gICAgY29uc3QgZmlyc3RUeXBlID0gY29udGVudFR5cGUuc3BsaXQoXCI7XCIpWzBdO1xuICAgIGNvbnN0IGJvZHlUb1BhcnNlID0gKF9iID0gcmVzcG9uc2UuYm9keUFzVGV4dCkgIT09IG51bGwgJiYgX2IgIT09IHZvaWQgMCA/IF9iIDogXCJcIjtcbiAgICBpZiAoZmlyc3RUeXBlID09PSBcInRleHQvcGxhaW5cIikge1xuICAgICAgICByZXR1cm4gU3RyaW5nKGJvZHlUb1BhcnNlKTtcbiAgICB9XG4gICAgLy8gRGVmYXVsdCB0byBcImFwcGxpY2F0aW9uL2pzb25cIiBhbmQgZmFsbGJhY2sgdG8gc3RyaW5nO1xuICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBib2R5VG9QYXJzZSA/IEpTT04ucGFyc2UoYm9keVRvUGFyc2UpIDogdW5kZWZpbmVkO1xuICAgIH1cbiAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgLy8gSWYgd2Ugd2VyZSBzdXBwb3NlZCB0byBnZXQgYSBKU09OIG9iamVjdCBhbmQgZmFpbGVkIHRvXG4gICAgICAgIC8vIHBhcnNlLCB0aHJvdyBhIHBhcnNlIGVycm9yXG4gICAgICAgIGlmIChmaXJzdFR5cGUgPT09IFwiYXBwbGljYXRpb24vanNvblwiKSB7XG4gICAgICAgICAgICB0aHJvdyBjcmVhdGVQYXJzZUVycm9yKHJlc3BvbnNlLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICAgICAgLy8gV2UgYXJlIG5vdCBzdXJlIGhvdyB0byBoYW5kbGUgdGhlIHJlc3BvbnNlIHNvIHdlIHJldHVybiBpdCBhc1xuICAgICAgICAvLyBwbGFpbiB0ZXh0LlxuICAgICAgICByZXR1cm4gU3RyaW5nKGJvZHlUb1BhcnNlKTtcbiAgICB9XG59XG5mdW5jdGlvbiBjcmVhdGVQYXJzZUVycm9yKHJlc3BvbnNlLCBlcnIpIHtcbiAgICB2YXIgX2E7XG4gICAgY29uc3QgbXNnID0gYEVycm9yIFwiJHtlcnJ9XCIgb2NjdXJyZWQgd2hpbGUgcGFyc2luZyB0aGUgcmVzcG9uc2UgYm9keSAtICR7cmVzcG9uc2UuYm9keUFzVGV4dH0uYDtcbiAgICBjb25zdCBlcnJDb2RlID0gKF9hID0gZXJyLmNvZGUpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IFJlc3RFcnJvci5QQVJTRV9FUlJPUjtcbiAgICByZXR1cm4gbmV3IFJlc3RFcnJvcihtc2csIHtcbiAgICAgICAgY29kZTogZXJyQ29kZSxcbiAgICAgICAgc3RhdHVzQ29kZTogcmVzcG9uc2Uuc3RhdHVzLFxuICAgICAgICByZXF1ZXN0OiByZXNwb25zZS5yZXF1ZXN0LFxuICAgICAgICByZXNwb25zZTogcmVzcG9uc2UsXG4gICAgfSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1zZW5kUmVxdWVzdC5qcy5tYXAiLCIvLyBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi5cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbi8qKlxuICogQnVpbGRzIHRoZSByZXF1ZXN0IHVybCwgZmlsbGluZyBpbiBxdWVyeSBhbmQgcGF0aCBwYXJhbWV0ZXJzXG4gKiBAcGFyYW0gZW5kcG9pbnQgLSBiYXNlIHVybCB3aGljaCBjYW4gYmUgYSB0ZW1wbGF0ZSB1cmxcbiAqIEBwYXJhbSByb3V0ZVBhdGggLSBwYXRoIHRvIGFwcGVuZCB0byB0aGUgZW5kcG9pbnRcbiAqIEBwYXJhbSBwYXRoUGFyYW1ldGVycyAtIHZhbHVlcyBvZiB0aGUgcGF0aCBwYXJhbWV0ZXJzXG4gKiBAcGFyYW0gb3B0aW9ucyAtIHJlcXVlc3QgcGFyYW1ldGVycyBpbmNsdWRpbmcgcXVlcnkgcGFyYW1ldGVyc1xuICogQHJldHVybnMgYSBmdWxsIHVybCB3aXRoIHBhdGggYW5kIHF1ZXJ5IHBhcmFtZXRlcnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkUmVxdWVzdFVybChlbmRwb2ludCwgcm91dGVQYXRoLCBwYXRoUGFyYW1ldGVycywgb3B0aW9ucyA9IHt9KSB7XG4gICAgaWYgKHJvdXRlUGF0aC5zdGFydHNXaXRoKFwiaHR0cHM6Ly9cIikgfHwgcm91dGVQYXRoLnN0YXJ0c1dpdGgoXCJodHRwOi8vXCIpKSB7XG4gICAgICAgIHJldHVybiByb3V0ZVBhdGg7XG4gICAgfVxuICAgIGVuZHBvaW50ID0gYnVpbGRCYXNlVXJsKGVuZHBvaW50LCBvcHRpb25zKTtcbiAgICByb3V0ZVBhdGggPSBidWlsZFJvdXRlUGF0aChyb3V0ZVBhdGgsIHBhdGhQYXJhbWV0ZXJzLCBvcHRpb25zKTtcbiAgICBjb25zdCByZXF1ZXN0VXJsID0gYXBwZW5kUXVlcnlQYXJhbXMoYCR7ZW5kcG9pbnR9LyR7cm91dGVQYXRofWAsIG9wdGlvbnMpO1xuICAgIGNvbnN0IHVybCA9IG5ldyBVUkwocmVxdWVzdFVybCk7XG4gICAgcmV0dXJuICh1cmxcbiAgICAgICAgLnRvU3RyaW5nKClcbiAgICAgICAgLy8gUmVtb3ZlIGRvdWJsZSBmb3J3YXJkIHNsYXNoZXNcbiAgICAgICAgLnJlcGxhY2UoLyhbXjpdXFwvKVxcLysvZywgXCIkMVwiKSk7XG59XG5mdW5jdGlvbiBhcHBlbmRRdWVyeVBhcmFtcyh1cmwsIG9wdGlvbnMgPSB7fSkge1xuICAgIGlmICghb3B0aW9ucy5xdWVyeVBhcmFtZXRlcnMpIHtcbiAgICAgICAgcmV0dXJuIHVybDtcbiAgICB9XG4gICAgbGV0IHBhcnNlZFVybCA9IG5ldyBVUkwodXJsKTtcbiAgICBjb25zdCBxdWVyeVBhcmFtcyA9IG9wdGlvbnMucXVlcnlQYXJhbWV0ZXJzO1xuICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKHF1ZXJ5UGFyYW1zKSkge1xuICAgICAgICBjb25zdCBwYXJhbSA9IHF1ZXJ5UGFyYW1zW2tleV07XG4gICAgICAgIGlmIChwYXJhbSA9PT0gdW5kZWZpbmVkIHx8IHBhcmFtID09PSBudWxsKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXBhcmFtLnRvU3RyaW5nIHx8IHR5cGVvZiBwYXJhbS50b1N0cmluZyAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFF1ZXJ5IHBhcmFtZXRlcnMgbXVzdCBiZSBhYmxlIHRvIGJlIHJlcHJlc2VudGVkIGFzIHN0cmluZywgJHtrZXl9IGNhbid0YCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdmFsdWUgPSBwYXJhbS50b0lTT1N0cmluZyAhPT0gdW5kZWZpbmVkID8gcGFyYW0udG9JU09TdHJpbmcoKSA6IHBhcmFtLnRvU3RyaW5nKCk7XG4gICAgICAgIHBhcnNlZFVybC5zZWFyY2hQYXJhbXMuYXBwZW5kKGtleSwgdmFsdWUpO1xuICAgIH1cbiAgICBpZiAob3B0aW9ucy5za2lwVXJsRW5jb2RpbmcpIHtcbiAgICAgICAgcGFyc2VkVXJsID0gc2tpcFF1ZXJ5UGFyYW1ldGVyRW5jb2RpbmcocGFyc2VkVXJsKTtcbiAgICB9XG4gICAgcmV0dXJuIHBhcnNlZFVybC50b1N0cmluZygpO1xufVxuZnVuY3Rpb24gc2tpcFF1ZXJ5UGFyYW1ldGVyRW5jb2RpbmcodXJsKSB7XG4gICAgaWYgKCF1cmwpIHtcbiAgICAgICAgcmV0dXJuIHVybDtcbiAgICB9XG4gICAgY29uc3Qgc2VhcmNoUGllY2VzID0gW107XG4gICAgZm9yIChjb25zdCBbbmFtZSwgdmFsdWVdIG9mIHVybC5zZWFyY2hQYXJhbXMpIHtcbiAgICAgICAgLy8gUVVJUks6IHNlYXJjaFBhcmFtcy5nZXQgcmV0cmlldmVzIHRoZSB2YWx1ZXMgZGVjb2RlZFxuICAgICAgICBzZWFyY2hQaWVjZXMucHVzaChgJHtuYW1lfT0ke3ZhbHVlfWApO1xuICAgIH1cbiAgICAvLyBRVUlSSzogd2UgaGF2ZSB0byBzZXQgc2VhcmNoIG1hbnVhbGx5IGFzIHNlYXJjaFBhcmFtcyB3aWxsIGVuY29kZSBjb21tYSB3aGVuIGl0IHNob3VsZG4ndC5cbiAgICB1cmwuc2VhcmNoID0gc2VhcmNoUGllY2VzLmxlbmd0aCA/IGA/JHtzZWFyY2hQaWVjZXMuam9pbihcIiZcIil9YCA6IFwiXCI7XG4gICAgcmV0dXJuIHVybDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBidWlsZEJhc2VVcmwoZW5kcG9pbnQsIG9wdGlvbnMpIHtcbiAgICB2YXIgX2E7XG4gICAgaWYgKCFvcHRpb25zLnBhdGhQYXJhbWV0ZXJzKSB7XG4gICAgICAgIHJldHVybiBlbmRwb2ludDtcbiAgICB9XG4gICAgY29uc3QgcGF0aFBhcmFtcyA9IG9wdGlvbnMucGF0aFBhcmFtZXRlcnM7XG4gICAgZm9yIChjb25zdCBba2V5LCBwYXJhbV0gb2YgT2JqZWN0LmVudHJpZXMocGF0aFBhcmFtcykpIHtcbiAgICAgICAgaWYgKHBhcmFtID09PSB1bmRlZmluZWQgfHwgcGFyYW0gPT09IG51bGwpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgUGF0aCBwYXJhbWV0ZXJzICR7a2V5fSBtdXN0IG5vdCBiZSB1bmRlZmluZWQgb3IgbnVsbGApO1xuICAgICAgICB9XG4gICAgICAgIGlmICghcGFyYW0udG9TdHJpbmcgfHwgdHlwZW9mIHBhcmFtLnRvU3RyaW5nICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgUGF0aCBwYXJhbWV0ZXJzIG11c3QgYmUgYWJsZSB0byBiZSByZXByZXNlbnRlZCBhcyBzdHJpbmcsICR7a2V5fSBjYW4ndGApO1xuICAgICAgICB9XG4gICAgICAgIGxldCB2YWx1ZSA9IHBhcmFtLnRvSVNPU3RyaW5nICE9PSB1bmRlZmluZWQgPyBwYXJhbS50b0lTT1N0cmluZygpIDogU3RyaW5nKHBhcmFtKTtcbiAgICAgICAgaWYgKCFvcHRpb25zLnNraXBVcmxFbmNvZGluZykge1xuICAgICAgICAgICAgdmFsdWUgPSBlbmNvZGVVUklDb21wb25lbnQocGFyYW0pO1xuICAgICAgICB9XG4gICAgICAgIGVuZHBvaW50ID0gKF9hID0gcmVwbGFjZUFsbChlbmRwb2ludCwgYHske2tleX19YCwgdmFsdWUpKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBcIlwiO1xuICAgIH1cbiAgICByZXR1cm4gZW5kcG9pbnQ7XG59XG5mdW5jdGlvbiBidWlsZFJvdXRlUGF0aChyb3V0ZVBhdGgsIHBhdGhQYXJhbWV0ZXJzLCBvcHRpb25zID0ge30pIHtcbiAgICBmb3IgKGNvbnN0IHBhdGhQYXJhbSBvZiBwYXRoUGFyYW1ldGVycykge1xuICAgICAgICBsZXQgdmFsdWUgPSBwYXRoUGFyYW07XG4gICAgICAgIGlmICghb3B0aW9ucy5za2lwVXJsRW5jb2RpbmcpIHtcbiAgICAgICAgICAgIHZhbHVlID0gZW5jb2RlVVJJQ29tcG9uZW50KHBhdGhQYXJhbSk7XG4gICAgICAgIH1cbiAgICAgICAgcm91dGVQYXRoID0gcm91dGVQYXRoLnJlcGxhY2UoL1xce1xcdytcXH0vLCB2YWx1ZSk7XG4gICAgfVxuICAgIHJldHVybiByb3V0ZVBhdGg7XG59XG4vKipcbiAqIFJlcGxhY2UgYWxsIG9mIHRoZSBpbnN0YW5jZXMgb2Ygc2VhcmNoVmFsdWUgaW4gdmFsdWUgd2l0aCB0aGUgcHJvdmlkZWQgcmVwbGFjZVZhbHVlLlxuICogQHBhcmFtIHZhbHVlIC0gVGhlIHZhbHVlIHRvIHNlYXJjaCBhbmQgcmVwbGFjZSBpbi5cbiAqIEBwYXJhbSBzZWFyY2hWYWx1ZSAtIFRoZSB2YWx1ZSB0byBzZWFyY2ggZm9yIGluIHRoZSB2YWx1ZSBhcmd1bWVudC5cbiAqIEBwYXJhbSByZXBsYWNlVmFsdWUgLSBUaGUgdmFsdWUgdG8gcmVwbGFjZSBzZWFyY2hWYWx1ZSB3aXRoIGluIHRoZSB2YWx1ZSBhcmd1bWVudC5cbiAqIEByZXR1cm5zIFRoZSB2YWx1ZSB3aGVyZSBlYWNoIGluc3RhbmNlIG9mIHNlYXJjaFZhbHVlIHdhcyByZXBsYWNlZCB3aXRoIHJlcGxhY2VkVmFsdWUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZXBsYWNlQWxsKHZhbHVlLCBzZWFyY2hWYWx1ZSwgcmVwbGFjZVZhbHVlKSB7XG4gICAgcmV0dXJuICF2YWx1ZSB8fCAhc2VhcmNoVmFsdWUgPyB2YWx1ZSA6IHZhbHVlLnNwbGl0KHNlYXJjaFZhbHVlKS5qb2luKHJlcGxhY2VWYWx1ZSB8fCBcIlwiKTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXVybEhlbHBlcnMuanMubWFwIiwiLy8gQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4vKipcbiAqIFRoaXMgZXJyb3IgaXMgdGhyb3duIHdoZW4gYW4gYXN5bmNocm9ub3VzIG9wZXJhdGlvbiBoYXMgYmVlbiBhYm9ydGVkLlxuICogQ2hlY2sgZm9yIHRoaXMgZXJyb3IgYnkgdGVzdGluZyB0aGUgYG5hbWVgIHRoYXQgdGhlIG5hbWUgcHJvcGVydHkgb2YgdGhlXG4gKiBlcnJvciBtYXRjaGVzIGBcIkFib3J0RXJyb3JcImAuXG4gKlxuICogQGV4YW1wbGVcbiAqIGBgYHRzXG4gKiBjb25zdCBjb250cm9sbGVyID0gbmV3IEFib3J0Q29udHJvbGxlcigpO1xuICogY29udHJvbGxlci5hYm9ydCgpO1xuICogdHJ5IHtcbiAqICAgZG9Bc3luY1dvcmsoY29udHJvbGxlci5zaWduYWwpXG4gKiB9IGNhdGNoIChlKSB7XG4gKiAgIGlmIChlLm5hbWUgPT09ICdBYm9ydEVycm9yJykge1xuICogICAgIC8vIGhhbmRsZSBhYm9ydCBlcnJvciBoZXJlLlxuICogICB9XG4gKiB9XG4gKiBgYGBcbiAqL1xuZXhwb3J0IGNsYXNzIEFib3J0RXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gICAgY29uc3RydWN0b3IobWVzc2FnZSkge1xuICAgICAgICBzdXBlcihtZXNzYWdlKTtcbiAgICAgICAgdGhpcy5uYW1lID0gXCJBYm9ydEVycm9yXCI7XG4gICAgfVxufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9QWJvcnRFcnJvci5qcy5tYXAiLCIvLyBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi5cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbmV4cG9ydCB7IEFib3J0RXJyb3IgfSBmcm9tIFwiLi9BYm9ydEVycm9yLmpzXCI7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiLCIvLyBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi5cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbi8qKlxuICogQSBzdGF0aWMta2V5LWJhc2VkIGNyZWRlbnRpYWwgdGhhdCBzdXBwb3J0cyB1cGRhdGluZ1xuICogdGhlIHVuZGVybHlpbmcga2V5IHZhbHVlLlxuICovXG5leHBvcnQgY2xhc3MgQXp1cmVLZXlDcmVkZW50aWFsIHtcbiAgICAvKipcbiAgICAgKiBUaGUgdmFsdWUgb2YgdGhlIGtleSB0byBiZSB1c2VkIGluIGF1dGhlbnRpY2F0aW9uXG4gICAgICovXG4gICAgZ2V0IGtleSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2tleTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGFuIGluc3RhbmNlIG9mIGFuIEF6dXJlS2V5Q3JlZGVudGlhbCBmb3IgdXNlXG4gICAgICogd2l0aCBhIHNlcnZpY2UgY2xpZW50LlxuICAgICAqXG4gICAgICogQHBhcmFtIGtleSAtIFRoZSBpbml0aWFsIHZhbHVlIG9mIHRoZSBrZXkgdG8gdXNlIGluIGF1dGhlbnRpY2F0aW9uXG4gICAgICovXG4gICAgY29uc3RydWN0b3Ioa2V5KSB7XG4gICAgICAgIGlmICgha2V5KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJrZXkgbXVzdCBiZSBhIG5vbi1lbXB0eSBzdHJpbmdcIik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fa2V5ID0ga2V5O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDaGFuZ2UgdGhlIHZhbHVlIG9mIHRoZSBrZXkuXG4gICAgICpcbiAgICAgKiBVcGRhdGVzIHdpbGwgdGFrZSBlZmZlY3QgdXBvbiB0aGUgbmV4dCByZXF1ZXN0IGFmdGVyXG4gICAgICogdXBkYXRpbmcgdGhlIGtleSB2YWx1ZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBuZXdLZXkgLSBUaGUgbmV3IGtleSB2YWx1ZSB0byBiZSB1c2VkXG4gICAgICovXG4gICAgdXBkYXRlKG5ld0tleSkge1xuICAgICAgICB0aGlzLl9rZXkgPSBuZXdLZXk7XG4gICAgfVxufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXp1cmVLZXlDcmVkZW50aWFsLmpzLm1hcCIsIi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuaW1wb3J0IHsgaXNPYmplY3RXaXRoUHJvcGVydGllcyB9IGZyb20gXCJAYXp1cmUvY29yZS11dGlsXCI7XG4vKipcbiAqIEEgc3RhdGljIG5hbWUva2V5LWJhc2VkIGNyZWRlbnRpYWwgdGhhdCBzdXBwb3J0cyB1cGRhdGluZ1xuICogdGhlIHVuZGVybHlpbmcgbmFtZSBhbmQga2V5IHZhbHVlcy5cbiAqL1xuZXhwb3J0IGNsYXNzIEF6dXJlTmFtZWRLZXlDcmVkZW50aWFsIHtcbiAgICAvKipcbiAgICAgKiBUaGUgdmFsdWUgb2YgdGhlIGtleSB0byBiZSB1c2VkIGluIGF1dGhlbnRpY2F0aW9uLlxuICAgICAqL1xuICAgIGdldCBrZXkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9rZXk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFRoZSB2YWx1ZSBvZiB0aGUgbmFtZSB0byBiZSB1c2VkIGluIGF1dGhlbnRpY2F0aW9uLlxuICAgICAqL1xuICAgIGdldCBuYW1lKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbmFtZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGFuIGluc3RhbmNlIG9mIGFuIEF6dXJlTmFtZWRLZXlDcmVkZW50aWFsIGZvciB1c2VcbiAgICAgKiB3aXRoIGEgc2VydmljZSBjbGllbnQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gbmFtZSAtIFRoZSBpbml0aWFsIHZhbHVlIG9mIHRoZSBuYW1lIHRvIHVzZSBpbiBhdXRoZW50aWNhdGlvbi5cbiAgICAgKiBAcGFyYW0ga2V5IC0gVGhlIGluaXRpYWwgdmFsdWUgb2YgdGhlIGtleSB0byB1c2UgaW4gYXV0aGVudGljYXRpb24uXG4gICAgICovXG4gICAgY29uc3RydWN0b3IobmFtZSwga2V5KSB7XG4gICAgICAgIGlmICghbmFtZSB8fCAha2V5KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwibmFtZSBhbmQga2V5IG11c3QgYmUgbm9uLWVtcHR5IHN0cmluZ3NcIik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fbmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMuX2tleSA9IGtleTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ2hhbmdlIHRoZSB2YWx1ZSBvZiB0aGUga2V5LlxuICAgICAqXG4gICAgICogVXBkYXRlcyB3aWxsIHRha2UgZWZmZWN0IHVwb24gdGhlIG5leHQgcmVxdWVzdCBhZnRlclxuICAgICAqIHVwZGF0aW5nIHRoZSBrZXkgdmFsdWUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gbmV3TmFtZSAtIFRoZSBuZXcgbmFtZSB2YWx1ZSB0byBiZSB1c2VkLlxuICAgICAqIEBwYXJhbSBuZXdLZXkgLSBUaGUgbmV3IGtleSB2YWx1ZSB0byBiZSB1c2VkLlxuICAgICAqL1xuICAgIHVwZGF0ZShuZXdOYW1lLCBuZXdLZXkpIHtcbiAgICAgICAgaWYgKCFuZXdOYW1lIHx8ICFuZXdLZXkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJuZXdOYW1lIGFuZCBuZXdLZXkgbXVzdCBiZSBub24tZW1wdHkgc3RyaW5nc1wiKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9uYW1lID0gbmV3TmFtZTtcbiAgICAgICAgdGhpcy5fa2V5ID0gbmV3S2V5O1xuICAgIH1cbn1cbi8qKlxuICogVGVzdHMgYW4gb2JqZWN0IHRvIGRldGVybWluZSB3aGV0aGVyIGl0IGltcGxlbWVudHMgTmFtZWRLZXlDcmVkZW50aWFsLlxuICpcbiAqIEBwYXJhbSBjcmVkZW50aWFsIC0gVGhlIGFzc3VtZWQgTmFtZWRLZXlDcmVkZW50aWFsIHRvIGJlIHRlc3RlZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzTmFtZWRLZXlDcmVkZW50aWFsKGNyZWRlbnRpYWwpIHtcbiAgICByZXR1cm4gKGlzT2JqZWN0V2l0aFByb3BlcnRpZXMoY3JlZGVudGlhbCwgW1wibmFtZVwiLCBcImtleVwiXSkgJiZcbiAgICAgICAgdHlwZW9mIGNyZWRlbnRpYWwua2V5ID09PSBcInN0cmluZ1wiICYmXG4gICAgICAgIHR5cGVvZiBjcmVkZW50aWFsLm5hbWUgPT09IFwic3RyaW5nXCIpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXp1cmVOYW1lZEtleUNyZWRlbnRpYWwuanMubWFwIiwiLy8gQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG5pbXBvcnQgeyBpc09iamVjdFdpdGhQcm9wZXJ0aWVzIH0gZnJvbSBcIkBhenVyZS9jb3JlLXV0aWxcIjtcbi8qKlxuICogQSBzdGF0aWMtc2lnbmF0dXJlLWJhc2VkIGNyZWRlbnRpYWwgdGhhdCBzdXBwb3J0cyB1cGRhdGluZ1xuICogdGhlIHVuZGVybHlpbmcgc2lnbmF0dXJlIHZhbHVlLlxuICovXG5leHBvcnQgY2xhc3MgQXp1cmVTQVNDcmVkZW50aWFsIHtcbiAgICAvKipcbiAgICAgKiBUaGUgdmFsdWUgb2YgdGhlIHNoYXJlZCBhY2Nlc3Mgc2lnbmF0dXJlIHRvIGJlIHVzZWQgaW4gYXV0aGVudGljYXRpb25cbiAgICAgKi9cbiAgICBnZXQgc2lnbmF0dXJlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc2lnbmF0dXJlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYW4gaW5zdGFuY2Ugb2YgYW4gQXp1cmVTQVNDcmVkZW50aWFsIGZvciB1c2VcbiAgICAgKiB3aXRoIGEgc2VydmljZSBjbGllbnQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc2lnbmF0dXJlIC0gVGhlIGluaXRpYWwgdmFsdWUgb2YgdGhlIHNoYXJlZCBhY2Nlc3Mgc2lnbmF0dXJlIHRvIHVzZSBpbiBhdXRoZW50aWNhdGlvblxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHNpZ25hdHVyZSkge1xuICAgICAgICBpZiAoIXNpZ25hdHVyZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwic2hhcmVkIGFjY2VzcyBzaWduYXR1cmUgbXVzdCBiZSBhIG5vbi1lbXB0eSBzdHJpbmdcIik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fc2lnbmF0dXJlID0gc2lnbmF0dXJlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDaGFuZ2UgdGhlIHZhbHVlIG9mIHRoZSBzaWduYXR1cmUuXG4gICAgICpcbiAgICAgKiBVcGRhdGVzIHdpbGwgdGFrZSBlZmZlY3QgdXBvbiB0aGUgbmV4dCByZXF1ZXN0IGFmdGVyXG4gICAgICogdXBkYXRpbmcgdGhlIHNpZ25hdHVyZSB2YWx1ZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBuZXdTaWduYXR1cmUgLSBUaGUgbmV3IHNoYXJlZCBhY2Nlc3Mgc2lnbmF0dXJlIHZhbHVlIHRvIGJlIHVzZWRcbiAgICAgKi9cbiAgICB1cGRhdGUobmV3U2lnbmF0dXJlKSB7XG4gICAgICAgIGlmICghbmV3U2lnbmF0dXJlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJzaGFyZWQgYWNjZXNzIHNpZ25hdHVyZSBtdXN0IGJlIGEgbm9uLWVtcHR5IHN0cmluZ1wiKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9zaWduYXR1cmUgPSBuZXdTaWduYXR1cmU7XG4gICAgfVxufVxuLyoqXG4gKiBUZXN0cyBhbiBvYmplY3QgdG8gZGV0ZXJtaW5lIHdoZXRoZXIgaXQgaW1wbGVtZW50cyBTQVNDcmVkZW50aWFsLlxuICpcbiAqIEBwYXJhbSBjcmVkZW50aWFsIC0gVGhlIGFzc3VtZWQgU0FTQ3JlZGVudGlhbCB0byBiZSB0ZXN0ZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1NBU0NyZWRlbnRpYWwoY3JlZGVudGlhbCkge1xuICAgIHJldHVybiAoaXNPYmplY3RXaXRoUHJvcGVydGllcyhjcmVkZW50aWFsLCBbXCJzaWduYXR1cmVcIl0pICYmIHR5cGVvZiBjcmVkZW50aWFsLnNpZ25hdHVyZSA9PT0gXCJzdHJpbmdcIik7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1henVyZVNBU0NyZWRlbnRpYWwuanMubWFwIiwiLy8gQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG5leHBvcnQgeyBBenVyZUtleUNyZWRlbnRpYWwgfSBmcm9tIFwiLi9henVyZUtleUNyZWRlbnRpYWwuanNcIjtcbmV4cG9ydCB7IGlzS2V5Q3JlZGVudGlhbCB9IGZyb20gXCIuL2tleUNyZWRlbnRpYWwuanNcIjtcbmV4cG9ydCB7IEF6dXJlTmFtZWRLZXlDcmVkZW50aWFsLCBpc05hbWVkS2V5Q3JlZGVudGlhbCwgfSBmcm9tIFwiLi9henVyZU5hbWVkS2V5Q3JlZGVudGlhbC5qc1wiO1xuZXhwb3J0IHsgQXp1cmVTQVNDcmVkZW50aWFsLCBpc1NBU0NyZWRlbnRpYWwgfSBmcm9tIFwiLi9henVyZVNBU0NyZWRlbnRpYWwuanNcIjtcbmV4cG9ydCB7IGlzVG9rZW5DcmVkZW50aWFsLCB9IGZyb20gXCIuL3Rva2VuQ3JlZGVudGlhbC5qc1wiO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwiLy8gQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG5pbXBvcnQgeyBpc09iamVjdFdpdGhQcm9wZXJ0aWVzIH0gZnJvbSBcIkBhenVyZS9jb3JlLXV0aWxcIjtcbi8qKlxuICogVGVzdHMgYW4gb2JqZWN0IHRvIGRldGVybWluZSB3aGV0aGVyIGl0IGltcGxlbWVudHMgS2V5Q3JlZGVudGlhbC5cbiAqXG4gKiBAcGFyYW0gY3JlZGVudGlhbCAtIFRoZSBhc3N1bWVkIEtleUNyZWRlbnRpYWwgdG8gYmUgdGVzdGVkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNLZXlDcmVkZW50aWFsKGNyZWRlbnRpYWwpIHtcbiAgICByZXR1cm4gaXNPYmplY3RXaXRoUHJvcGVydGllcyhjcmVkZW50aWFsLCBbXCJrZXlcIl0pICYmIHR5cGVvZiBjcmVkZW50aWFsLmtleSA9PT0gXCJzdHJpbmdcIjtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWtleUNyZWRlbnRpYWwuanMubWFwIiwiLy8gQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4vKipcbiAqIFRlc3RzIGFuIG9iamVjdCB0byBkZXRlcm1pbmUgd2hldGhlciBpdCBpbXBsZW1lbnRzIFRva2VuQ3JlZGVudGlhbC5cbiAqXG4gKiBAcGFyYW0gY3JlZGVudGlhbCAtIFRoZSBhc3N1bWVkIFRva2VuQ3JlZGVudGlhbCB0byBiZSB0ZXN0ZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1Rva2VuQ3JlZGVudGlhbChjcmVkZW50aWFsKSB7XG4gICAgLy8gQ2hlY2sgZm9yIGFuIG9iamVjdCB3aXRoIGEgJ2dldFRva2VuJyBmdW5jdGlvbiBhbmQgcG9zc2libHkgd2l0aFxuICAgIC8vIGEgJ3NpZ25SZXF1ZXN0JyBmdW5jdGlvbi4gIFdlIGRvIHRoaXMgY2hlY2sgdG8gbWFrZSBzdXJlIHRoYXRcbiAgICAvLyBhIFNlcnZpY2VDbGllbnRDcmVkZW50aWFscyBpbXBsZW1lbnRvciAobGlrZSBUb2tlbkNsaWVudENyZWRlbnRpYWxzXG4gICAgLy8gaW4gbXMtcmVzdC1ub2RlYXV0aCkgZG9lc24ndCBnZXQgbWlzdGFrZW4gZm9yIGEgVG9rZW5DcmVkZW50aWFsIGlmXG4gICAgLy8gaXQgZG9lc24ndCBhY3R1YWxseSBpbXBsZW1lbnQgVG9rZW5DcmVkZW50aWFsIGFsc28uXG4gICAgY29uc3QgY2FzdENyZWRlbnRpYWwgPSBjcmVkZW50aWFsO1xuICAgIHJldHVybiAoY2FzdENyZWRlbnRpYWwgJiZcbiAgICAgICAgdHlwZW9mIGNhc3RDcmVkZW50aWFsLmdldFRva2VuID09PSBcImZ1bmN0aW9uXCIgJiZcbiAgICAgICAgKGNhc3RDcmVkZW50aWFsLnNpZ25SZXF1ZXN0ID09PSB1bmRlZmluZWQgfHwgY2FzdENyZWRlbnRpYWwuZ2V0VG9rZW4ubGVuZ3RoID4gMCkpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dG9rZW5DcmVkZW50aWFsLmpzLm1hcCIsIi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuZXhwb3J0IGNvbnN0IFNES19WRVJTSU9OID0gXCIxLjE2LjBcIjtcbmV4cG9ydCBjb25zdCBERUZBVUxUX1JFVFJZX1BPTElDWV9DT1VOVCA9IDM7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jb25zdGFudHMuanMubWFwIiwiLy8gQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG5pbXBvcnQgeyBsb2dQb2xpY3kgfSBmcm9tIFwiLi9wb2xpY2llcy9sb2dQb2xpY3kuanNcIjtcbmltcG9ydCB7IGNyZWF0ZUVtcHR5UGlwZWxpbmUgfSBmcm9tIFwiLi9waXBlbGluZS5qc1wiO1xuaW1wb3J0IHsgcmVkaXJlY3RQb2xpY3kgfSBmcm9tIFwiLi9wb2xpY2llcy9yZWRpcmVjdFBvbGljeS5qc1wiO1xuaW1wb3J0IHsgdXNlckFnZW50UG9saWN5IH0gZnJvbSBcIi4vcG9saWNpZXMvdXNlckFnZW50UG9saWN5LmpzXCI7XG5pbXBvcnQgeyBtdWx0aXBhcnRQb2xpY3ksIG11bHRpcGFydFBvbGljeU5hbWUgfSBmcm9tIFwiLi9wb2xpY2llcy9tdWx0aXBhcnRQb2xpY3kuanNcIjtcbmltcG9ydCB7IGRlY29tcHJlc3NSZXNwb25zZVBvbGljeSB9IGZyb20gXCIuL3BvbGljaWVzL2RlY29tcHJlc3NSZXNwb25zZVBvbGljeS5qc1wiO1xuaW1wb3J0IHsgZGVmYXVsdFJldHJ5UG9saWN5IH0gZnJvbSBcIi4vcG9saWNpZXMvZGVmYXVsdFJldHJ5UG9saWN5LmpzXCI7XG5pbXBvcnQgeyBmb3JtRGF0YVBvbGljeSB9IGZyb20gXCIuL3BvbGljaWVzL2Zvcm1EYXRhUG9saWN5LmpzXCI7XG5pbXBvcnQgeyBpc05vZGVMaWtlIH0gZnJvbSBcIkBhenVyZS9jb3JlLXV0aWxcIjtcbmltcG9ydCB7IHByb3h5UG9saWN5IH0gZnJvbSBcIi4vcG9saWNpZXMvcHJveHlQb2xpY3kuanNcIjtcbmltcG9ydCB7IHNldENsaWVudFJlcXVlc3RJZFBvbGljeSB9IGZyb20gXCIuL3BvbGljaWVzL3NldENsaWVudFJlcXVlc3RJZFBvbGljeS5qc1wiO1xuaW1wb3J0IHsgdGxzUG9saWN5IH0gZnJvbSBcIi4vcG9saWNpZXMvdGxzUG9saWN5LmpzXCI7XG5pbXBvcnQgeyB0cmFjaW5nUG9saWN5IH0gZnJvbSBcIi4vcG9saWNpZXMvdHJhY2luZ1BvbGljeS5qc1wiO1xuLyoqXG4gKiBDcmVhdGUgYSBuZXcgcGlwZWxpbmUgd2l0aCBhIGRlZmF1bHQgc2V0IG9mIGN1c3RvbWl6YWJsZSBwb2xpY2llcy5cbiAqIEBwYXJhbSBvcHRpb25zIC0gT3B0aW9ucyB0byBjb25maWd1cmUgYSBjdXN0b20gcGlwZWxpbmUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVQaXBlbGluZUZyb21PcHRpb25zKG9wdGlvbnMpIHtcbiAgICB2YXIgX2E7XG4gICAgY29uc3QgcGlwZWxpbmUgPSBjcmVhdGVFbXB0eVBpcGVsaW5lKCk7XG4gICAgaWYgKGlzTm9kZUxpa2UpIHtcbiAgICAgICAgaWYgKG9wdGlvbnMudGxzT3B0aW9ucykge1xuICAgICAgICAgICAgcGlwZWxpbmUuYWRkUG9saWN5KHRsc1BvbGljeShvcHRpb25zLnRsc09wdGlvbnMpKTtcbiAgICAgICAgfVxuICAgICAgICBwaXBlbGluZS5hZGRQb2xpY3kocHJveHlQb2xpY3kob3B0aW9ucy5wcm94eU9wdGlvbnMpKTtcbiAgICAgICAgcGlwZWxpbmUuYWRkUG9saWN5KGRlY29tcHJlc3NSZXNwb25zZVBvbGljeSgpKTtcbiAgICB9XG4gICAgcGlwZWxpbmUuYWRkUG9saWN5KGZvcm1EYXRhUG9saWN5KCksIHsgYmVmb3JlUG9saWNpZXM6IFttdWx0aXBhcnRQb2xpY3lOYW1lXSB9KTtcbiAgICBwaXBlbGluZS5hZGRQb2xpY3kodXNlckFnZW50UG9saWN5KG9wdGlvbnMudXNlckFnZW50T3B0aW9ucykpO1xuICAgIHBpcGVsaW5lLmFkZFBvbGljeShzZXRDbGllbnRSZXF1ZXN0SWRQb2xpY3koKF9hID0gb3B0aW9ucy50ZWxlbWV0cnlPcHRpb25zKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuY2xpZW50UmVxdWVzdElkSGVhZGVyTmFtZSkpO1xuICAgIC8vIFRoZSBtdWx0aXBhcnQgcG9saWN5IGlzIGFkZGVkIGFmdGVyIHBvbGljaWVzIHdpdGggbm8gcGhhc2UsIHNvIHRoYXRcbiAgICAvLyBwb2xpY2llcyBjYW4gYmUgYWRkZWQgYmV0d2VlbiBpdCBhbmQgZm9ybURhdGFQb2xpY3kgdG8gbW9kaWZ5XG4gICAgLy8gcHJvcGVydGllcyAoZS5nLiwgbWFraW5nIHRoZSBib3VuZGFyeSBjb25zdGFudCBpbiByZWNvcmRlZCB0ZXN0cykuXG4gICAgcGlwZWxpbmUuYWRkUG9saWN5KG11bHRpcGFydFBvbGljeSgpLCB7IGFmdGVyUGhhc2U6IFwiRGVzZXJpYWxpemVcIiB9KTtcbiAgICBwaXBlbGluZS5hZGRQb2xpY3koZGVmYXVsdFJldHJ5UG9saWN5KG9wdGlvbnMucmV0cnlPcHRpb25zKSwgeyBwaGFzZTogXCJSZXRyeVwiIH0pO1xuICAgIHBpcGVsaW5lLmFkZFBvbGljeSh0cmFjaW5nUG9saWN5KG9wdGlvbnMudXNlckFnZW50T3B0aW9ucyksIHsgYWZ0ZXJQaGFzZTogXCJSZXRyeVwiIH0pO1xuICAgIGlmIChpc05vZGVMaWtlKSB7XG4gICAgICAgIC8vIEJvdGggWEhSIGFuZCBGZXRjaCBleHBlY3QgdG8gaGFuZGxlIHJlZGlyZWN0cyBhdXRvbWF0aWNhbGx5LFxuICAgICAgICAvLyBzbyBvbmx5IGluY2x1ZGUgdGhpcyBwb2xpY3kgd2hlbiB3ZSdyZSBpbiBOb2RlLlxuICAgICAgICBwaXBlbGluZS5hZGRQb2xpY3kocmVkaXJlY3RQb2xpY3kob3B0aW9ucy5yZWRpcmVjdE9wdGlvbnMpLCB7IGFmdGVyUGhhc2U6IFwiUmV0cnlcIiB9KTtcbiAgICB9XG4gICAgcGlwZWxpbmUuYWRkUG9saWN5KGxvZ1BvbGljeShvcHRpb25zLmxvZ2dpbmdPcHRpb25zKSwgeyBhZnRlclBoYXNlOiBcIlNpZ25cIiB9KTtcbiAgICByZXR1cm4gcGlwZWxpbmU7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jcmVhdGVQaXBlbGluZUZyb21PcHRpb25zLmpzLm1hcCIsIi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuaW1wb3J0IHsgY3JlYXRlRmV0Y2hIdHRwQ2xpZW50IH0gZnJvbSBcIi4vZmV0Y2hIdHRwQ2xpZW50LmpzXCI7XG4vKipcbiAqIENyZWF0ZSB0aGUgY29ycmVjdCBIdHRwQ2xpZW50IGZvciB0aGUgY3VycmVudCBlbnZpcm9ubWVudC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZURlZmF1bHRIdHRwQ2xpZW50KCkge1xuICAgIHJldHVybiBjcmVhdGVGZXRjaEh0dHBDbGllbnQoKTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRlZmF1bHRIdHRwQ2xpZW50LWJyb3dzZXIubWpzLm1hcCIsIi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuaW1wb3J0IHsgQWJvcnRFcnJvciB9IGZyb20gXCJAYXp1cmUvYWJvcnQtY29udHJvbGxlclwiO1xuaW1wb3J0IHsgUmVzdEVycm9yIH0gZnJvbSBcIi4vcmVzdEVycm9yLmpzXCI7XG5pbXBvcnQgeyBjcmVhdGVIdHRwSGVhZGVycyB9IGZyb20gXCIuL2h0dHBIZWFkZXJzLmpzXCI7XG5pbXBvcnQgeyBpc05vZGVSZWFkYWJsZVN0cmVhbSwgaXNXZWJSZWFkYWJsZVN0cmVhbSB9IGZyb20gXCIuL3V0aWwvdHlwZUd1YXJkcy5qc1wiO1xuLyoqXG4gKiBDaGVja3MgaWYgdGhlIGJvZHkgaXMgYSBCbG9iIG9yIEJsb2ItbGlrZVxuICovXG5mdW5jdGlvbiBpc0Jsb2IoYm9keSkge1xuICAgIC8vIEZpbGUgb2JqZWN0cyBjb3VudCBhcyBhIHR5cGUgb2YgQmxvYiwgc28gd2Ugd2FudCB0byB1c2UgaW5zdGFuY2VvZiBleHBsaWNpdGx5XG4gICAgcmV0dXJuICh0eXBlb2YgQmxvYiA9PT0gXCJmdW5jdGlvblwiIHx8IHR5cGVvZiBCbG9iID09PSBcIm9iamVjdFwiKSAmJiBib2R5IGluc3RhbmNlb2YgQmxvYjtcbn1cbi8qKlxuICogQSBIdHRwQ2xpZW50IGltcGxlbWVudGF0aW9uIHRoYXQgdXNlcyB3aW5kb3cuZmV0Y2ggdG8gc2VuZCBIVFRQIHJlcXVlc3RzLlxuICogQGludGVybmFsXG4gKi9cbmNsYXNzIEZldGNoSHR0cENsaWVudCB7XG4gICAgLyoqXG4gICAgICogTWFrZXMgYSByZXF1ZXN0IG92ZXIgYW4gdW5kZXJseWluZyB0cmFuc3BvcnQgbGF5ZXIgYW5kIHJldHVybnMgdGhlIHJlc3BvbnNlLlxuICAgICAqIEBwYXJhbSByZXF1ZXN0IC0gVGhlIHJlcXVlc3QgdG8gYmUgbWFkZS5cbiAgICAgKi9cbiAgICBhc3luYyBzZW5kUmVxdWVzdChyZXF1ZXN0KSB7XG4gICAgICAgIGNvbnN0IHVybCA9IG5ldyBVUkwocmVxdWVzdC51cmwpO1xuICAgICAgICBjb25zdCBpc0luc2VjdXJlID0gdXJsLnByb3RvY29sICE9PSBcImh0dHBzOlwiO1xuICAgICAgICBpZiAoaXNJbnNlY3VyZSAmJiAhcmVxdWVzdC5hbGxvd0luc2VjdXJlQ29ubmVjdGlvbikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgY29ubmVjdCB0byAke3JlcXVlc3QudXJsfSB3aGlsZSBhbGxvd0luc2VjdXJlQ29ubmVjdGlvbiBpcyBmYWxzZS5gKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVxdWVzdC5wcm94eVNldHRpbmdzKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJIVFRQIHByb3h5IGlzIG5vdCBzdXBwb3J0ZWQgaW4gYnJvd3NlciBlbnZpcm9ubWVudFwiKTtcbiAgICAgICAgfVxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IG1ha2VSZXF1ZXN0KHJlcXVlc3QpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICB0aHJvdyBnZXRFcnJvcihlLCByZXF1ZXN0KTtcbiAgICAgICAgfVxuICAgIH1cbn1cbi8qKlxuICogU2VuZHMgYSByZXF1ZXN0XG4gKi9cbmFzeW5jIGZ1bmN0aW9uIG1ha2VSZXF1ZXN0KHJlcXVlc3QpIHtcbiAgICBjb25zdCB7IGFib3J0Q29udHJvbGxlciwgYWJvcnRDb250cm9sbGVyQ2xlYW51cCB9ID0gc2V0dXBBYm9ydFNpZ25hbChyZXF1ZXN0KTtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCBoZWFkZXJzID0gYnVpbGRGZXRjaEhlYWRlcnMocmVxdWVzdC5oZWFkZXJzKTtcbiAgICAgICAgY29uc3QgeyBzdHJlYW1pbmcsIGJvZHk6IHJlcXVlc3RCb2R5IH0gPSBidWlsZFJlcXVlc3RCb2R5KHJlcXVlc3QpO1xuICAgICAgICBjb25zdCByZXF1ZXN0SW5pdCA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7IGJvZHk6IHJlcXVlc3RCb2R5LCBtZXRob2Q6IHJlcXVlc3QubWV0aG9kLCBoZWFkZXJzOiBoZWFkZXJzLCBzaWduYWw6IGFib3J0Q29udHJvbGxlci5zaWduYWwgfSwgKFwiY3JlZGVudGlhbHNcIiBpbiBSZXF1ZXN0LnByb3RvdHlwZVxuICAgICAgICAgICAgPyB7IGNyZWRlbnRpYWxzOiByZXF1ZXN0LndpdGhDcmVkZW50aWFscyA/IFwiaW5jbHVkZVwiIDogXCJzYW1lLW9yaWdpblwiIH1cbiAgICAgICAgICAgIDoge30pKSwgKFwiY2FjaGVcIiBpbiBSZXF1ZXN0LnByb3RvdHlwZSA/IHsgY2FjaGU6IFwibm8tc3RvcmVcIiB9IDoge30pKTtcbiAgICAgICAgLy8gQWNjb3JkaW5nIHRvIGh0dHBzOi8vZmV0Y2guc3BlYy53aGF0d2cub3JnLyNmZXRjaC1tZXRob2QsXG4gICAgICAgIC8vIGluaXQuZHVwbGV4IG11c3QgYmUgc2V0IHdoZW4gYm9keSBpcyBhIFJlYWRhYmxlU3RyZWFtIG9iamVjdC5cbiAgICAgICAgLy8gY3VycmVudGx5IFwiaGFsZlwiIGlzIHRoZSBvbmx5IHZhbGlkIHZhbHVlLlxuICAgICAgICBpZiAoc3RyZWFtaW5nKSB7XG4gICAgICAgICAgICByZXF1ZXN0SW5pdC5kdXBsZXggPSBcImhhbGZcIjtcbiAgICAgICAgfVxuICAgICAgICAvKipcbiAgICAgICAgICogRGV2ZWxvcGVycyBvZiB0aGUgZnV0dXJlOlxuICAgICAgICAgKiBEbyBub3Qgc2V0IHJlZGlyZWN0OiBcIm1hbnVhbFwiIGFzIHBhcnRcbiAgICAgICAgICogb2YgcmVxdWVzdCBvcHRpb25zLlxuICAgICAgICAgKiBJdCB3aWxsIG5vdCB3b3JrIGFzIHlvdSBleHBlY3QuXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHJlcXVlc3QudXJsLCByZXF1ZXN0SW5pdCk7XG4gICAgICAgIC8vIElmIHdlJ3JlIHVwbG9hZGluZyBhIGJsb2IsIHdlIG5lZWQgdG8gZmlyZSB0aGUgcHJvZ3Jlc3MgZXZlbnQgbWFudWFsbHlcbiAgICAgICAgaWYgKGlzQmxvYihyZXF1ZXN0LmJvZHkpICYmIHJlcXVlc3Qub25VcGxvYWRQcm9ncmVzcykge1xuICAgICAgICAgICAgcmVxdWVzdC5vblVwbG9hZFByb2dyZXNzKHsgbG9hZGVkQnl0ZXM6IHJlcXVlc3QuYm9keS5zaXplIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBidWlsZFBpcGVsaW5lUmVzcG9uc2UocmVzcG9uc2UsIHJlcXVlc3QsIGFib3J0Q29udHJvbGxlckNsZWFudXApO1xuICAgIH1cbiAgICBjYXRjaCAoZSkge1xuICAgICAgICBhYm9ydENvbnRyb2xsZXJDbGVhbnVwID09PSBudWxsIHx8IGFib3J0Q29udHJvbGxlckNsZWFudXAgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGFib3J0Q29udHJvbGxlckNsZWFudXAoKTtcbiAgICAgICAgdGhyb3cgZTtcbiAgICB9XG59XG4vKipcbiAqIENyZWF0ZXMgYSBwaXBlbGluZSByZXNwb25zZSBmcm9tIGEgRmV0Y2ggcmVzcG9uc2U7XG4gKi9cbmFzeW5jIGZ1bmN0aW9uIGJ1aWxkUGlwZWxpbmVSZXNwb25zZShodHRwUmVzcG9uc2UsIHJlcXVlc3QsIGFib3J0Q29udHJvbGxlckNsZWFudXApIHtcbiAgICB2YXIgX2EsIF9iO1xuICAgIGNvbnN0IGhlYWRlcnMgPSBidWlsZFBpcGVsaW5lSGVhZGVycyhodHRwUmVzcG9uc2UpO1xuICAgIGNvbnN0IHJlc3BvbnNlID0ge1xuICAgICAgICByZXF1ZXN0LFxuICAgICAgICBoZWFkZXJzLFxuICAgICAgICBzdGF0dXM6IGh0dHBSZXNwb25zZS5zdGF0dXMsXG4gICAgfTtcbiAgICBjb25zdCBib2R5U3RyZWFtID0gaXNXZWJSZWFkYWJsZVN0cmVhbShodHRwUmVzcG9uc2UuYm9keSlcbiAgICAgICAgPyBidWlsZEJvZHlTdHJlYW0oaHR0cFJlc3BvbnNlLmJvZHksIHtcbiAgICAgICAgICAgIG9uUHJvZ3Jlc3M6IHJlcXVlc3Qub25Eb3dubG9hZFByb2dyZXNzLFxuICAgICAgICAgICAgb25FbmQ6IGFib3J0Q29udHJvbGxlckNsZWFudXAsXG4gICAgICAgIH0pXG4gICAgICAgIDogaHR0cFJlc3BvbnNlLmJvZHk7XG4gICAgaWYgKFxuICAgIC8vIFZhbHVlIG9mIFBPU0lUSVZFX0lORklOSVRZIGluIHN0cmVhbVJlc3BvbnNlU3RhdHVzQ29kZXMgaXMgY29uc2lkZXJlZCBhcyBhbnkgc3RhdHVzIGNvZGVcbiAgICAoKF9hID0gcmVxdWVzdC5zdHJlYW1SZXNwb25zZVN0YXR1c0NvZGVzKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuaGFzKE51bWJlci5QT1NJVElWRV9JTkZJTklUWSkpIHx8XG4gICAgICAgICgoX2IgPSByZXF1ZXN0LnN0cmVhbVJlc3BvbnNlU3RhdHVzQ29kZXMpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5oYXMocmVzcG9uc2Uuc3RhdHVzKSkpIHtcbiAgICAgICAgaWYgKHJlcXVlc3QuZW5hYmxlQnJvd3NlclN0cmVhbXMpIHtcbiAgICAgICAgICAgIHJlc3BvbnNlLmJyb3dzZXJTdHJlYW1Cb2R5ID0gYm9keVN0cmVhbSAhPT0gbnVsbCAmJiBib2R5U3RyZWFtICE9PSB2b2lkIDAgPyBib2R5U3RyZWFtIDogdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2VTdHJlYW0gPSBuZXcgUmVzcG9uc2UoYm9keVN0cmVhbSk7XG4gICAgICAgICAgICByZXNwb25zZS5ibG9iQm9keSA9IHJlc3BvbnNlU3RyZWFtLmJsb2IoKTtcbiAgICAgICAgICAgIGFib3J0Q29udHJvbGxlckNsZWFudXAgPT09IG51bGwgfHwgYWJvcnRDb250cm9sbGVyQ2xlYW51cCA9PT0gdm9pZCAwID8gdm9pZCAwIDogYWJvcnRDb250cm9sbGVyQ2xlYW51cCgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBjb25zdCByZXNwb25zZVN0cmVhbSA9IG5ldyBSZXNwb25zZShib2R5U3RyZWFtKTtcbiAgICAgICAgcmVzcG9uc2UuYm9keUFzVGV4dCA9IGF3YWl0IHJlc3BvbnNlU3RyZWFtLnRleHQoKTtcbiAgICAgICAgYWJvcnRDb250cm9sbGVyQ2xlYW51cCA9PT0gbnVsbCB8fCBhYm9ydENvbnRyb2xsZXJDbGVhbnVwID09PSB2b2lkIDAgPyB2b2lkIDAgOiBhYm9ydENvbnRyb2xsZXJDbGVhbnVwKCk7XG4gICAgfVxuICAgIHJldHVybiByZXNwb25zZTtcbn1cbmZ1bmN0aW9uIHNldHVwQWJvcnRTaWduYWwocmVxdWVzdCkge1xuICAgIGNvbnN0IGFib3J0Q29udHJvbGxlciA9IG5ldyBBYm9ydENvbnRyb2xsZXIoKTtcbiAgICAvLyBDbGVhbnVwIGZ1bmN0aW9uXG4gICAgbGV0IGFib3J0Q29udHJvbGxlckNsZWFudXA7XG4gICAgLyoqXG4gICAgICogQXR0YWNoIGFuIGFib3J0IGxpc3RlbmVyIHRvIHRoZSByZXF1ZXN0XG4gICAgICovXG4gICAgbGV0IGFib3J0TGlzdGVuZXI7XG4gICAgaWYgKHJlcXVlc3QuYWJvcnRTaWduYWwpIHtcbiAgICAgICAgaWYgKHJlcXVlc3QuYWJvcnRTaWduYWwuYWJvcnRlZCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEFib3J0RXJyb3IoXCJUaGUgb3BlcmF0aW9uIHdhcyBhYm9ydGVkLlwiKTtcbiAgICAgICAgfVxuICAgICAgICBhYm9ydExpc3RlbmVyID0gKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBpZiAoZXZlbnQudHlwZSA9PT0gXCJhYm9ydFwiKSB7XG4gICAgICAgICAgICAgICAgYWJvcnRDb250cm9sbGVyLmFib3J0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHJlcXVlc3QuYWJvcnRTaWduYWwuYWRkRXZlbnRMaXN0ZW5lcihcImFib3J0XCIsIGFib3J0TGlzdGVuZXIpO1xuICAgICAgICBhYm9ydENvbnRyb2xsZXJDbGVhbnVwID0gKCkgPT4ge1xuICAgICAgICAgICAgdmFyIF9hO1xuICAgICAgICAgICAgaWYgKGFib3J0TGlzdGVuZXIpIHtcbiAgICAgICAgICAgICAgICAoX2EgPSByZXF1ZXN0LmFib3J0U2lnbmFsKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImFib3J0XCIsIGFib3J0TGlzdGVuZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbiAgICAvLyBJZiBhIHRpbWVvdXQgd2FzIHBhc3NlZCwgY2FsbCB0aGUgYWJvcnQgc2lnbmFsIG9uY2UgdGhlIHRpbWUgZWxhcHNlc1xuICAgIGlmIChyZXF1ZXN0LnRpbWVvdXQgPiAwKSB7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgYWJvcnRDb250cm9sbGVyLmFib3J0KCk7XG4gICAgICAgIH0sIHJlcXVlc3QudGltZW91dCk7XG4gICAgfVxuICAgIHJldHVybiB7IGFib3J0Q29udHJvbGxlciwgYWJvcnRDb250cm9sbGVyQ2xlYW51cCB9O1xufVxuLyoqXG4gKiBHZXRzIHRoZSBzcGVjaWZpYyBlcnJvclxuICovXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQGF6dXJlL2F6dXJlLXNkay90cy11c2UtaW50ZXJmYWNlLXBhcmFtZXRlcnNcbmZ1bmN0aW9uIGdldEVycm9yKGUsIHJlcXVlc3QpIHtcbiAgICB2YXIgX2E7XG4gICAgaWYgKGUgJiYgKGUgPT09IG51bGwgfHwgZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogZS5uYW1lKSA9PT0gXCJBYm9ydEVycm9yXCIpIHtcbiAgICAgICAgcmV0dXJuIGU7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gbmV3IFJlc3RFcnJvcihgRXJyb3Igc2VuZGluZyByZXF1ZXN0OiAke2UubWVzc2FnZX1gLCB7XG4gICAgICAgICAgICBjb2RlOiAoX2EgPSBlID09PSBudWxsIHx8IGUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGUuY29kZSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogUmVzdEVycm9yLlJFUVVFU1RfU0VORF9FUlJPUixcbiAgICAgICAgICAgIHJlcXVlc3QsXG4gICAgICAgIH0pO1xuICAgIH1cbn1cbi8qKlxuICogQ29udmVydHMgUGlwZWxpbmVSZXF1ZXN0IGhlYWRlcnMgdG8gRmV0Y2ggaGVhZGVyc1xuICovXG5mdW5jdGlvbiBidWlsZEZldGNoSGVhZGVycyhwaXBlbGluZUhlYWRlcnMpIHtcbiAgICBjb25zdCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoKTtcbiAgICBmb3IgKGNvbnN0IFtuYW1lLCB2YWx1ZV0gb2YgcGlwZWxpbmVIZWFkZXJzKSB7XG4gICAgICAgIGhlYWRlcnMuYXBwZW5kKG5hbWUsIHZhbHVlKTtcbiAgICB9XG4gICAgcmV0dXJuIGhlYWRlcnM7XG59XG5mdW5jdGlvbiBidWlsZFBpcGVsaW5lSGVhZGVycyhodHRwUmVzcG9uc2UpIHtcbiAgICBjb25zdCByZXNwb25zZUhlYWRlcnMgPSBjcmVhdGVIdHRwSGVhZGVycygpO1xuICAgIGZvciAoY29uc3QgW25hbWUsIHZhbHVlXSBvZiBodHRwUmVzcG9uc2UuaGVhZGVycykge1xuICAgICAgICByZXNwb25zZUhlYWRlcnMuc2V0KG5hbWUsIHZhbHVlKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3BvbnNlSGVhZGVycztcbn1cbmZ1bmN0aW9uIGJ1aWxkUmVxdWVzdEJvZHkocmVxdWVzdCkge1xuICAgIGNvbnN0IGJvZHkgPSB0eXBlb2YgcmVxdWVzdC5ib2R5ID09PSBcImZ1bmN0aW9uXCIgPyByZXF1ZXN0LmJvZHkoKSA6IHJlcXVlc3QuYm9keTtcbiAgICBpZiAoaXNOb2RlUmVhZGFibGVTdHJlYW0oYm9keSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm9kZSBzdHJlYW1zIGFyZSBub3Qgc3VwcG9ydGVkIGluIGJyb3dzZXIgZW52aXJvbm1lbnQuXCIpO1xuICAgIH1cbiAgICByZXR1cm4gaXNXZWJSZWFkYWJsZVN0cmVhbShib2R5KVxuICAgICAgICA/IHsgc3RyZWFtaW5nOiB0cnVlLCBib2R5OiBidWlsZEJvZHlTdHJlYW0oYm9keSwgeyBvblByb2dyZXNzOiByZXF1ZXN0Lm9uVXBsb2FkUHJvZ3Jlc3MgfSkgfVxuICAgICAgICA6IHsgc3RyZWFtaW5nOiBmYWxzZSwgYm9keSB9O1xufVxuLyoqXG4gKiBSZWFkcyB0aGUgcmVxdWVzdC9yZXNwb25zZSBvcmlnaW5hbCBzdHJlYW0gYW5kIHN0cmVhbSBpdCB0aHJvdWdoIGEgbmV3XG4gKiBSZWFkYWJsZVN0cmVhbSwgdGhpcyBpcyBkb25lIHRvIGJlIGFibGUgdG8gcmVwb3J0IHByb2dyZXNzIGluIGEgd2F5IHRoYXRcbiAqIGFsbCBtb2Rlcm4gYnJvd3NlcnMgc3VwcG9ydC4gVHJhbnNmb3JtU3RyZWFtcyB3b3VsZCBiZSBhbiBhbHRlcm5hdGl2ZSxcbiAqIGhvd2V2ZXIgdGhleSBhcmUgbm90IHlldCBzdXBwb3J0ZWQgYnkgYWxsIGJyb3dzZXJzIGkuZSBGaXJlZm94XG4gKi9cbmZ1bmN0aW9uIGJ1aWxkQm9keVN0cmVhbShyZWFkYWJsZVN0cmVhbSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgbGV0IGxvYWRlZEJ5dGVzID0gMDtcbiAgICBjb25zdCB7IG9uUHJvZ3Jlc3MsIG9uRW5kIH0gPSBvcHRpb25zO1xuICAgIC8vIElmIHRoZSBjdXJyZW50IGJyb3dzZXIgc3VwcG9ydHMgcGlwZVRocm91Z2ggd2UgdXNlIGEgVHJhbnNmb3JtU3RyZWFtXG4gICAgLy8gdG8gcmVwb3J0IHByb2dyZXNzXG4gICAgaWYgKGlzVHJhbnNmb3JtU3RyZWFtU3VwcG9ydGVkKHJlYWRhYmxlU3RyZWFtKSkge1xuICAgICAgICByZXR1cm4gcmVhZGFibGVTdHJlYW0ucGlwZVRocm91Z2gobmV3IFRyYW5zZm9ybVN0cmVhbSh7XG4gICAgICAgICAgICB0cmFuc2Zvcm0oY2h1bmssIGNvbnRyb2xsZXIpIHtcbiAgICAgICAgICAgICAgICBpZiAoY2h1bmsgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlci50ZXJtaW5hdGUoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb250cm9sbGVyLmVucXVldWUoY2h1bmspO1xuICAgICAgICAgICAgICAgIGxvYWRlZEJ5dGVzICs9IGNodW5rLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBpZiAob25Qcm9ncmVzcykge1xuICAgICAgICAgICAgICAgICAgICBvblByb2dyZXNzKHsgbG9hZGVkQnl0ZXMgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZsdXNoKCkge1xuICAgICAgICAgICAgICAgIG9uRW5kID09PSBudWxsIHx8IG9uRW5kID09PSB2b2lkIDAgPyB2b2lkIDAgOiBvbkVuZCgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSkpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgLy8gSWYgd2UgY2FuJ3QgdXNlIHRyYW5zZm9ybSBzdHJlYW1zLCB3cmFwIHRoZSBvcmlnaW5hbCBzdHJlYW0gaW4gYSBuZXcgcmVhZGFibGUgc3RyZWFtXG4gICAgICAgIC8vIGFuZCB1c2UgcHVsbCB0byBlbnF1ZXVlIGVhY2ggY2h1bmsgYW5kIHJlcG9ydCBwcm9ncmVzcy5cbiAgICAgICAgY29uc3QgcmVhZGVyID0gcmVhZGFibGVTdHJlYW0uZ2V0UmVhZGVyKCk7XG4gICAgICAgIHJldHVybiBuZXcgUmVhZGFibGVTdHJlYW0oe1xuICAgICAgICAgICAgYXN5bmMgcHVsbChjb250cm9sbGVyKSB7XG4gICAgICAgICAgICAgICAgdmFyIF9hO1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgZG9uZSwgdmFsdWUgfSA9IGF3YWl0IHJlYWRlci5yZWFkKCk7XG4gICAgICAgICAgICAgICAgLy8gV2hlbiBubyBtb3JlIGRhdGEgbmVlZHMgdG8gYmUgY29uc3VtZWQsIGJyZWFrIHRoZSByZWFkaW5nXG4gICAgICAgICAgICAgICAgaWYgKGRvbmUgfHwgIXZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIG9uRW5kID09PSBudWxsIHx8IG9uRW5kID09PSB2b2lkIDAgPyB2b2lkIDAgOiBvbkVuZCgpO1xuICAgICAgICAgICAgICAgICAgICAvLyBDbG9zZSB0aGUgc3RyZWFtXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXIuY2xvc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgcmVhZGVyLnJlbGVhc2VMb2NrKCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbG9hZGVkQnl0ZXMgKz0gKF9hID0gdmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHZhbHVlLmxlbmd0aCkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogMDtcbiAgICAgICAgICAgICAgICAvLyBFbnF1ZXVlIHRoZSBuZXh0IGRhdGEgY2h1bmsgaW50byBvdXIgdGFyZ2V0IHN0cmVhbVxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXIuZW5xdWV1ZSh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgaWYgKG9uUHJvZ3Jlc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgb25Qcm9ncmVzcyh7IGxvYWRlZEJ5dGVzIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjYW5jZWwocmVhc29uKSB7XG4gICAgICAgICAgICAgICAgb25FbmQgPT09IG51bGwgfHwgb25FbmQgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9uRW5kKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlYWRlci5jYW5jZWwocmVhc29uKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgIH1cbn1cbi8qKlxuICogQ3JlYXRlIGEgbmV3IEh0dHBDbGllbnQgaW5zdGFuY2UgZm9yIHRoZSBicm93c2VyIGVudmlyb25tZW50LlxuICogQGludGVybmFsXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVGZXRjaEh0dHBDbGllbnQoKSB7XG4gICAgcmV0dXJuIG5ldyBGZXRjaEh0dHBDbGllbnQoKTtcbn1cbmZ1bmN0aW9uIGlzVHJhbnNmb3JtU3RyZWFtU3VwcG9ydGVkKHJlYWRhYmxlU3RyZWFtKSB7XG4gICAgcmV0dXJuIHJlYWRhYmxlU3RyZWFtLnBpcGVUaHJvdWdoICE9PSB1bmRlZmluZWQgJiYgc2VsZi5UcmFuc2Zvcm1TdHJlYW0gIT09IHVuZGVmaW5lZDtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZldGNoSHR0cENsaWVudC5qcy5tYXAiLCIvLyBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi5cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbmZ1bmN0aW9uIG5vcm1hbGl6ZU5hbWUobmFtZSkge1xuICAgIHJldHVybiBuYW1lLnRvTG93ZXJDYXNlKCk7XG59XG5mdW5jdGlvbiogaGVhZGVySXRlcmF0b3IobWFwKSB7XG4gICAgZm9yIChjb25zdCBlbnRyeSBvZiBtYXAudmFsdWVzKCkpIHtcbiAgICAgICAgeWllbGQgW2VudHJ5Lm5hbWUsIGVudHJ5LnZhbHVlXTtcbiAgICB9XG59XG5jbGFzcyBIdHRwSGVhZGVyc0ltcGwge1xuICAgIGNvbnN0cnVjdG9yKHJhd0hlYWRlcnMpIHtcbiAgICAgICAgdGhpcy5faGVhZGVyc01hcCA9IG5ldyBNYXAoKTtcbiAgICAgICAgaWYgKHJhd0hlYWRlcnMpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgaGVhZGVyTmFtZSBvZiBPYmplY3Qua2V5cyhyYXdIZWFkZXJzKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0KGhlYWRlck5hbWUsIHJhd0hlYWRlcnNbaGVhZGVyTmFtZV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldCBhIGhlYWRlciBpbiB0aGlzIGNvbGxlY3Rpb24gd2l0aCB0aGUgcHJvdmlkZWQgbmFtZSBhbmQgdmFsdWUuIFRoZSBuYW1lIGlzXG4gICAgICogY2FzZS1pbnNlbnNpdGl2ZS5cbiAgICAgKiBAcGFyYW0gbmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBoZWFkZXIgdG8gc2V0LiBUaGlzIHZhbHVlIGlzIGNhc2UtaW5zZW5zaXRpdmUuXG4gICAgICogQHBhcmFtIHZhbHVlIC0gVGhlIHZhbHVlIG9mIHRoZSBoZWFkZXIgdG8gc2V0LlxuICAgICAqL1xuICAgIHNldChuYW1lLCB2YWx1ZSkge1xuICAgICAgICB0aGlzLl9oZWFkZXJzTWFwLnNldChub3JtYWxpemVOYW1lKG5hbWUpLCB7IG5hbWUsIHZhbHVlOiBTdHJpbmcodmFsdWUpLnRyaW0oKSB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBoZWFkZXIgdmFsdWUgZm9yIHRoZSBwcm92aWRlZCBoZWFkZXIgbmFtZSwgb3IgdW5kZWZpbmVkIGlmIG5vIGhlYWRlciBleGlzdHMgaW4gdGhpc1xuICAgICAqIGNvbGxlY3Rpb24gd2l0aCB0aGUgcHJvdmlkZWQgbmFtZS5cbiAgICAgKiBAcGFyYW0gbmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBoZWFkZXIuIFRoaXMgdmFsdWUgaXMgY2FzZS1pbnNlbnNpdGl2ZS5cbiAgICAgKi9cbiAgICBnZXQobmFtZSkge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIHJldHVybiAoX2EgPSB0aGlzLl9oZWFkZXJzTWFwLmdldChub3JtYWxpemVOYW1lKG5hbWUpKSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnZhbHVlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZXQgd2hldGhlciBvciBub3QgdGhpcyBoZWFkZXIgY29sbGVjdGlvbiBjb250YWlucyBhIGhlYWRlciBlbnRyeSBmb3IgdGhlIHByb3ZpZGVkIGhlYWRlciBuYW1lLlxuICAgICAqIEBwYXJhbSBuYW1lIC0gVGhlIG5hbWUgb2YgdGhlIGhlYWRlciB0byBzZXQuIFRoaXMgdmFsdWUgaXMgY2FzZS1pbnNlbnNpdGl2ZS5cbiAgICAgKi9cbiAgICBoYXMobmFtZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5faGVhZGVyc01hcC5oYXMobm9ybWFsaXplTmFtZShuYW1lKSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJlbW92ZSB0aGUgaGVhZGVyIHdpdGggdGhlIHByb3ZpZGVkIGhlYWRlck5hbWUuXG4gICAgICogQHBhcmFtIG5hbWUgLSBUaGUgbmFtZSBvZiB0aGUgaGVhZGVyIHRvIHJlbW92ZS5cbiAgICAgKi9cbiAgICBkZWxldGUobmFtZSkge1xuICAgICAgICB0aGlzLl9oZWFkZXJzTWFwLmRlbGV0ZShub3JtYWxpemVOYW1lKG5hbWUpKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBKU09OIG9iamVjdCByZXByZXNlbnRhdGlvbiBvZiB0aGlzIEhUVFAgaGVhZGVyIGNvbGxlY3Rpb24uXG4gICAgICovXG4gICAgdG9KU09OKG9wdGlvbnMgPSB7fSkge1xuICAgICAgICBjb25zdCByZXN1bHQgPSB7fTtcbiAgICAgICAgaWYgKG9wdGlvbnMucHJlc2VydmVDYXNlKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIHRoaXMuX2hlYWRlcnNNYXAudmFsdWVzKCkpIHtcbiAgICAgICAgICAgICAgICByZXN1bHRbZW50cnkubmFtZV0gPSBlbnRyeS52YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgW25vcm1hbGl6ZWROYW1lLCBlbnRyeV0gb2YgdGhpcy5faGVhZGVyc01hcCkge1xuICAgICAgICAgICAgICAgIHJlc3VsdFtub3JtYWxpemVkTmFtZV0gPSBlbnRyeS52YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGlzIEhUVFAgaGVhZGVyIGNvbGxlY3Rpb24uXG4gICAgICovXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzLnRvSlNPTih7IHByZXNlcnZlQ2FzZTogdHJ1ZSB9KSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEl0ZXJhdGUgb3ZlciB0dXBsZXMgb2YgaGVhZGVyIFtuYW1lLCB2YWx1ZV0gcGFpcnMuXG4gICAgICovXG4gICAgW1N5bWJvbC5pdGVyYXRvcl0oKSB7XG4gICAgICAgIHJldHVybiBoZWFkZXJJdGVyYXRvcih0aGlzLl9oZWFkZXJzTWFwKTtcbiAgICB9XG59XG4vKipcbiAqIENyZWF0ZXMgYW4gb2JqZWN0IHRoYXQgc2F0aXNmaWVzIHRoZSBgSHR0cEhlYWRlcnNgIGludGVyZmFjZS5cbiAqIEBwYXJhbSByYXdIZWFkZXJzIC0gQSBzaW1wbGUgb2JqZWN0IHJlcHJlc2VudGluZyBpbml0aWFsIGhlYWRlcnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUh0dHBIZWFkZXJzKHJhd0hlYWRlcnMpIHtcbiAgICByZXR1cm4gbmV3IEh0dHBIZWFkZXJzSW1wbChyYXdIZWFkZXJzKTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWh0dHBIZWFkZXJzLmpzLm1hcCIsIi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuZXhwb3J0IHsgY3JlYXRlRW1wdHlQaXBlbGluZSwgfSBmcm9tIFwiLi9waXBlbGluZS5qc1wiO1xuZXhwb3J0IHsgY3JlYXRlUGlwZWxpbmVGcm9tT3B0aW9ucywgfSBmcm9tIFwiLi9jcmVhdGVQaXBlbGluZUZyb21PcHRpb25zLmpzXCI7XG5leHBvcnQgeyBjcmVhdGVEZWZhdWx0SHR0cENsaWVudCB9IGZyb20gXCIuL2RlZmF1bHRIdHRwQ2xpZW50LmpzXCI7XG5leHBvcnQgeyBjcmVhdGVIdHRwSGVhZGVycyB9IGZyb20gXCIuL2h0dHBIZWFkZXJzLmpzXCI7XG5leHBvcnQgeyBjcmVhdGVQaXBlbGluZVJlcXVlc3QgfSBmcm9tIFwiLi9waXBlbGluZVJlcXVlc3QuanNcIjtcbmV4cG9ydCB7IFJlc3RFcnJvciwgaXNSZXN0RXJyb3IgfSBmcm9tIFwiLi9yZXN0RXJyb3IuanNcIjtcbmV4cG9ydCB7IGRlY29tcHJlc3NSZXNwb25zZVBvbGljeSwgZGVjb21wcmVzc1Jlc3BvbnNlUG9saWN5TmFtZSwgfSBmcm9tIFwiLi9wb2xpY2llcy9kZWNvbXByZXNzUmVzcG9uc2VQb2xpY3kuanNcIjtcbmV4cG9ydCB7IGV4cG9uZW50aWFsUmV0cnlQb2xpY3ksIGV4cG9uZW50aWFsUmV0cnlQb2xpY3lOYW1lLCB9IGZyb20gXCIuL3BvbGljaWVzL2V4cG9uZW50aWFsUmV0cnlQb2xpY3kuanNcIjtcbmV4cG9ydCB7IHNldENsaWVudFJlcXVlc3RJZFBvbGljeSwgc2V0Q2xpZW50UmVxdWVzdElkUG9saWN5TmFtZSwgfSBmcm9tIFwiLi9wb2xpY2llcy9zZXRDbGllbnRSZXF1ZXN0SWRQb2xpY3kuanNcIjtcbmV4cG9ydCB7IGxvZ1BvbGljeSwgbG9nUG9saWN5TmFtZSB9IGZyb20gXCIuL3BvbGljaWVzL2xvZ1BvbGljeS5qc1wiO1xuZXhwb3J0IHsgbXVsdGlwYXJ0UG9saWN5LCBtdWx0aXBhcnRQb2xpY3lOYW1lIH0gZnJvbSBcIi4vcG9saWNpZXMvbXVsdGlwYXJ0UG9saWN5LmpzXCI7XG5leHBvcnQgeyBwcm94eVBvbGljeSwgcHJveHlQb2xpY3lOYW1lLCBnZXREZWZhdWx0UHJveHlTZXR0aW5ncyB9IGZyb20gXCIuL3BvbGljaWVzL3Byb3h5UG9saWN5LmpzXCI7XG5leHBvcnQgeyByZWRpcmVjdFBvbGljeSwgcmVkaXJlY3RQb2xpY3lOYW1lLCB9IGZyb20gXCIuL3BvbGljaWVzL3JlZGlyZWN0UG9saWN5LmpzXCI7XG5leHBvcnQgeyBzeXN0ZW1FcnJvclJldHJ5UG9saWN5LCBzeXN0ZW1FcnJvclJldHJ5UG9saWN5TmFtZSwgfSBmcm9tIFwiLi9wb2xpY2llcy9zeXN0ZW1FcnJvclJldHJ5UG9saWN5LmpzXCI7XG5leHBvcnQgeyB0aHJvdHRsaW5nUmV0cnlQb2xpY3ksIHRocm90dGxpbmdSZXRyeVBvbGljeU5hbWUsIH0gZnJvbSBcIi4vcG9saWNpZXMvdGhyb3R0bGluZ1JldHJ5UG9saWN5LmpzXCI7XG5leHBvcnQgeyByZXRyeVBvbGljeSB9IGZyb20gXCIuL3BvbGljaWVzL3JldHJ5UG9saWN5LmpzXCI7XG5leHBvcnQgeyB0cmFjaW5nUG9saWN5LCB0cmFjaW5nUG9saWN5TmFtZSwgfSBmcm9tIFwiLi9wb2xpY2llcy90cmFjaW5nUG9saWN5LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0UmV0cnlQb2xpY3ksIH0gZnJvbSBcIi4vcG9saWNpZXMvZGVmYXVsdFJldHJ5UG9saWN5LmpzXCI7XG5leHBvcnQgeyB1c2VyQWdlbnRQb2xpY3ksIHVzZXJBZ2VudFBvbGljeU5hbWUsIH0gZnJvbSBcIi4vcG9saWNpZXMvdXNlckFnZW50UG9saWN5LmpzXCI7XG5leHBvcnQgeyB0bHNQb2xpY3ksIHRsc1BvbGljeU5hbWUgfSBmcm9tIFwiLi9wb2xpY2llcy90bHNQb2xpY3kuanNcIjtcbmV4cG9ydCB7IGZvcm1EYXRhUG9saWN5LCBmb3JtRGF0YVBvbGljeU5hbWUgfSBmcm9tIFwiLi9wb2xpY2llcy9mb3JtRGF0YVBvbGljeS5qc1wiO1xuZXhwb3J0IHsgYmVhcmVyVG9rZW5BdXRoZW50aWNhdGlvblBvbGljeSwgYmVhcmVyVG9rZW5BdXRoZW50aWNhdGlvblBvbGljeU5hbWUsIH0gZnJvbSBcIi4vcG9saWNpZXMvYmVhcmVyVG9rZW5BdXRoZW50aWNhdGlvblBvbGljeS5qc1wiO1xuZXhwb3J0IHsgbmRKc29uUG9saWN5LCBuZEpzb25Qb2xpY3lOYW1lIH0gZnJvbSBcIi4vcG9saWNpZXMvbmRKc29uUG9saWN5LmpzXCI7XG5leHBvcnQgeyBhdXhpbGlhcnlBdXRoZW50aWNhdGlvbkhlYWRlclBvbGljeSwgYXV4aWxpYXJ5QXV0aGVudGljYXRpb25IZWFkZXJQb2xpY3lOYW1lLCB9IGZyb20gXCIuL3BvbGljaWVzL2F1eGlsaWFyeUF1dGhlbnRpY2F0aW9uSGVhZGVyUG9saWN5LmpzXCI7XG5leHBvcnQgeyBjcmVhdGVGaWxlLCBjcmVhdGVGaWxlRnJvbVN0cmVhbSwgfSBmcm9tIFwiLi91dGlsL2ZpbGUuanNcIjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsIi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuaW1wb3J0IHsgY3JlYXRlQ2xpZW50TG9nZ2VyIH0gZnJvbSBcIkBhenVyZS9sb2dnZXJcIjtcbmV4cG9ydCBjb25zdCBsb2dnZXIgPSBjcmVhdGVDbGllbnRMb2dnZXIoXCJjb3JlLXJlc3QtcGlwZWxpbmVcIik7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1sb2cuanMubWFwIiwiLy8gQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG5jb25zdCBWYWxpZFBoYXNlTmFtZXMgPSBuZXcgU2V0KFtcIkRlc2VyaWFsaXplXCIsIFwiU2VyaWFsaXplXCIsIFwiUmV0cnlcIiwgXCJTaWduXCJdKTtcbi8qKlxuICogQSBwcml2YXRlIGltcGxlbWVudGF0aW9uIG9mIFBpcGVsaW5lLlxuICogRG8gbm90IGV4cG9ydCB0aGlzIGNsYXNzIGZyb20gdGhlIHBhY2thZ2UuXG4gKiBAaW50ZXJuYWxcbiAqL1xuY2xhc3MgSHR0cFBpcGVsaW5lIHtcbiAgICBjb25zdHJ1Y3Rvcihwb2xpY2llcykge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIHRoaXMuX3BvbGljaWVzID0gW107XG4gICAgICAgIHRoaXMuX3BvbGljaWVzID0gKF9hID0gcG9saWNpZXMgPT09IG51bGwgfHwgcG9saWNpZXMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHBvbGljaWVzLnNsaWNlKDApKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBbXTtcbiAgICAgICAgdGhpcy5fb3JkZXJlZFBvbGljaWVzID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBhZGRQb2xpY3kocG9saWN5LCBvcHRpb25zID0ge30pIHtcbiAgICAgICAgaWYgKG9wdGlvbnMucGhhc2UgJiYgb3B0aW9ucy5hZnRlclBoYXNlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJQb2xpY2llcyBpbnNpZGUgYSBwaGFzZSBjYW5ub3Qgc3BlY2lmeSBhZnRlclBoYXNlLlwiKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0aW9ucy5waGFzZSAmJiAhVmFsaWRQaGFzZU5hbWVzLmhhcyhvcHRpb25zLnBoYXNlKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHBoYXNlIG5hbWU6ICR7b3B0aW9ucy5waGFzZX1gKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0aW9ucy5hZnRlclBoYXNlICYmICFWYWxpZFBoYXNlTmFtZXMuaGFzKG9wdGlvbnMuYWZ0ZXJQaGFzZSkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBhZnRlclBoYXNlIG5hbWU6ICR7b3B0aW9ucy5hZnRlclBoYXNlfWApO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3BvbGljaWVzLnB1c2goe1xuICAgICAgICAgICAgcG9saWN5LFxuICAgICAgICAgICAgb3B0aW9ucyxcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuX29yZGVyZWRQb2xpY2llcyA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgcmVtb3ZlUG9saWN5KG9wdGlvbnMpIHtcbiAgICAgICAgY29uc3QgcmVtb3ZlZFBvbGljaWVzID0gW107XG4gICAgICAgIHRoaXMuX3BvbGljaWVzID0gdGhpcy5fcG9saWNpZXMuZmlsdGVyKChwb2xpY3lEZXNjcmlwdG9yKSA9PiB7XG4gICAgICAgICAgICBpZiAoKG9wdGlvbnMubmFtZSAmJiBwb2xpY3lEZXNjcmlwdG9yLnBvbGljeS5uYW1lID09PSBvcHRpb25zLm5hbWUpIHx8XG4gICAgICAgICAgICAgICAgKG9wdGlvbnMucGhhc2UgJiYgcG9saWN5RGVzY3JpcHRvci5vcHRpb25zLnBoYXNlID09PSBvcHRpb25zLnBoYXNlKSkge1xuICAgICAgICAgICAgICAgIHJlbW92ZWRQb2xpY2llcy5wdXNoKHBvbGljeURlc2NyaXB0b3IucG9saWN5KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuX29yZGVyZWRQb2xpY2llcyA9IHVuZGVmaW5lZDtcbiAgICAgICAgcmV0dXJuIHJlbW92ZWRQb2xpY2llcztcbiAgICB9XG4gICAgc2VuZFJlcXVlc3QoaHR0cENsaWVudCwgcmVxdWVzdCkge1xuICAgICAgICBjb25zdCBwb2xpY2llcyA9IHRoaXMuZ2V0T3JkZXJlZFBvbGljaWVzKCk7XG4gICAgICAgIGNvbnN0IHBpcGVsaW5lID0gcG9saWNpZXMucmVkdWNlUmlnaHQoKG5leHQsIHBvbGljeSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIChyZXEpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcG9saWN5LnNlbmRSZXF1ZXN0KHJlcSwgbmV4dCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9LCAocmVxKSA9PiBodHRwQ2xpZW50LnNlbmRSZXF1ZXN0KHJlcSkpO1xuICAgICAgICByZXR1cm4gcGlwZWxpbmUocmVxdWVzdCk7XG4gICAgfVxuICAgIGdldE9yZGVyZWRQb2xpY2llcygpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9vcmRlcmVkUG9saWNpZXMpIHtcbiAgICAgICAgICAgIHRoaXMuX29yZGVyZWRQb2xpY2llcyA9IHRoaXMub3JkZXJQb2xpY2llcygpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9vcmRlcmVkUG9saWNpZXM7XG4gICAgfVxuICAgIGNsb25lKCkge1xuICAgICAgICByZXR1cm4gbmV3IEh0dHBQaXBlbGluZSh0aGlzLl9wb2xpY2llcyk7XG4gICAgfVxuICAgIHN0YXRpYyBjcmVhdGUoKSB7XG4gICAgICAgIHJldHVybiBuZXcgSHR0cFBpcGVsaW5lKCk7XG4gICAgfVxuICAgIG9yZGVyUG9saWNpZXMoKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgZ29hbCBvZiB0aGlzIG1ldGhvZCBpcyB0byByZWxpYWJseSBvcmRlciBwaXBlbGluZSBwb2xpY2llc1xuICAgICAgICAgKiBiYXNlZCBvbiB0aGVpciBkZWNsYXJlZCByZXF1aXJlbWVudHMgd2hlbiB0aGV5IHdlcmUgYWRkZWQuXG4gICAgICAgICAqXG4gICAgICAgICAqIE9yZGVyIGlzIGZpcnN0IGRldGVybWluZWQgYnkgcGhhc2U6XG4gICAgICAgICAqXG4gICAgICAgICAqIDEuIFNlcmlhbGl6ZSBQaGFzZVxuICAgICAgICAgKiAyLiBQb2xpY2llcyBub3QgaW4gYSBwaGFzZVxuICAgICAgICAgKiAzLiBEZXNlcmlhbGl6ZSBQaGFzZVxuICAgICAgICAgKiA0LiBSZXRyeSBQaGFzZVxuICAgICAgICAgKiA1LiBTaWduIFBoYXNlXG4gICAgICAgICAqXG4gICAgICAgICAqIFdpdGhpbiBlYWNoIHBoYXNlLCBwb2xpY2llcyBhcmUgZXhlY3V0ZWQgaW4gdGhlIG9yZGVyXG4gICAgICAgICAqIHRoZXkgd2VyZSBhZGRlZCB1bmxlc3MgdGhleSB3ZXJlIHNwZWNpZmllZCB0byBleGVjdXRlXG4gICAgICAgICAqIGJlZm9yZS9hZnRlciBvdGhlciBwb2xpY2llcyBvciBhZnRlciBhIHBhcnRpY3VsYXIgcGhhc2UuXG4gICAgICAgICAqXG4gICAgICAgICAqIFRvIGRldGVybWluZSB0aGUgZmluYWwgb3JkZXIsIHdlIHdpbGwgd2FsayB0aGUgcG9saWN5IGxpc3RcbiAgICAgICAgICogaW4gcGhhc2Ugb3JkZXIgbXVsdGlwbGUgdGltZXMgdW50aWwgYWxsIGRlcGVuZGVuY2llcyBhcmVcbiAgICAgICAgICogc2F0aXNmaWVkLlxuICAgICAgICAgKlxuICAgICAgICAgKiBgYWZ0ZXJQb2xpY2llc2AgYXJlIHRoZSBzZXQgb2YgcG9saWNpZXMgdGhhdCBtdXN0IGJlXG4gICAgICAgICAqIGV4ZWN1dGVkIGJlZm9yZSBhIGdpdmVuIHBvbGljeS4gVGhpcyByZXF1aXJlbWVudCBpc1xuICAgICAgICAgKiBjb25zaWRlcmVkIHNhdGlzZmllZCB3aGVuIGVhY2ggb2YgdGhlIGxpc3RlZCBwb2xpY2llc1xuICAgICAgICAgKiBoYXZlIGJlZW4gc2NoZWR1bGVkLlxuICAgICAgICAgKlxuICAgICAgICAgKiBgYmVmb3JlUG9saWNpZXNgIGFyZSB0aGUgc2V0IG9mIHBvbGljaWVzIHRoYXQgbXVzdCBiZVxuICAgICAgICAgKiBleGVjdXRlZCBhZnRlciBhIGdpdmVuIHBvbGljeS4gU2luY2UgdGhpcyBkZXBlbmRlbmN5XG4gICAgICAgICAqIGNhbiBiZSBleHByZXNzZWQgYnkgY29udmVydGluZyBpdCBpbnRvIGEgZXF1aXZhbGVudFxuICAgICAgICAgKiBgYWZ0ZXJQb2xpY2llc2AgZGVjbGFyYXRpb25zLCB0aGV5IGFyZSBub3JtYWxpemVkXG4gICAgICAgICAqIGludG8gdGhhdCBmb3JtIGZvciBzaW1wbGljaXR5LlxuICAgICAgICAgKlxuICAgICAgICAgKiBBbiBgYWZ0ZXJQaGFzZWAgZGVwZW5kZW5jeSBpcyBjb25zaWRlcmVkIHNhdGlzZmllZCB3aGVuIGFsbFxuICAgICAgICAgKiBwb2xpY2llcyBpbiB0aGF0IHBoYXNlIGhhdmUgc2NoZWR1bGVkLlxuICAgICAgICAgKlxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgcmVzdWx0ID0gW107XG4gICAgICAgIC8vIFRyYWNrIGFsbCBwb2xpY2llcyB3ZSBrbm93IGFib3V0LlxuICAgICAgICBjb25zdCBwb2xpY3lNYXAgPSBuZXcgTWFwKCk7XG4gICAgICAgIGZ1bmN0aW9uIGNyZWF0ZVBoYXNlKG5hbWUpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgbmFtZSxcbiAgICAgICAgICAgICAgICBwb2xpY2llczogbmV3IFNldCgpLFxuICAgICAgICAgICAgICAgIGhhc1J1bjogZmFsc2UsXG4gICAgICAgICAgICAgICAgaGFzQWZ0ZXJQb2xpY2llczogZmFsc2UsXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIC8vIFRyYWNrIHBvbGljaWVzIGZvciBlYWNoIHBoYXNlLlxuICAgICAgICBjb25zdCBzZXJpYWxpemVQaGFzZSA9IGNyZWF0ZVBoYXNlKFwiU2VyaWFsaXplXCIpO1xuICAgICAgICBjb25zdCBub1BoYXNlID0gY3JlYXRlUGhhc2UoXCJOb25lXCIpO1xuICAgICAgICBjb25zdCBkZXNlcmlhbGl6ZVBoYXNlID0gY3JlYXRlUGhhc2UoXCJEZXNlcmlhbGl6ZVwiKTtcbiAgICAgICAgY29uc3QgcmV0cnlQaGFzZSA9IGNyZWF0ZVBoYXNlKFwiUmV0cnlcIik7XG4gICAgICAgIGNvbnN0IHNpZ25QaGFzZSA9IGNyZWF0ZVBoYXNlKFwiU2lnblwiKTtcbiAgICAgICAgLy8gYSBsaXN0IG9mIHBoYXNlcyBpbiBvcmRlclxuICAgICAgICBjb25zdCBvcmRlcmVkUGhhc2VzID0gW3NlcmlhbGl6ZVBoYXNlLCBub1BoYXNlLCBkZXNlcmlhbGl6ZVBoYXNlLCByZXRyeVBoYXNlLCBzaWduUGhhc2VdO1xuICAgICAgICAvLyBTbWFsbCBoZWxwZXIgZnVuY3Rpb24gdG8gbWFwIHBoYXNlIG5hbWUgdG8gZWFjaCBQaGFzZVxuICAgICAgICBmdW5jdGlvbiBnZXRQaGFzZShwaGFzZSkge1xuICAgICAgICAgICAgaWYgKHBoYXNlID09PSBcIlJldHJ5XCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmV0cnlQaGFzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHBoYXNlID09PSBcIlNlcmlhbGl6ZVwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlcmlhbGl6ZVBoYXNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAocGhhc2UgPT09IFwiRGVzZXJpYWxpemVcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBkZXNlcmlhbGl6ZVBoYXNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAocGhhc2UgPT09IFwiU2lnblwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNpZ25QaGFzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBub1BoYXNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIEZpcnN0IHdhbGsgZWFjaCBwb2xpY3kgYW5kIGNyZWF0ZSBhIG5vZGUgdG8gdHJhY2sgbWV0YWRhdGEuXG4gICAgICAgIGZvciAoY29uc3QgZGVzY3JpcHRvciBvZiB0aGlzLl9wb2xpY2llcykge1xuICAgICAgICAgICAgY29uc3QgcG9saWN5ID0gZGVzY3JpcHRvci5wb2xpY3k7XG4gICAgICAgICAgICBjb25zdCBvcHRpb25zID0gZGVzY3JpcHRvci5vcHRpb25zO1xuICAgICAgICAgICAgY29uc3QgcG9saWN5TmFtZSA9IHBvbGljeS5uYW1lO1xuICAgICAgICAgICAgaWYgKHBvbGljeU1hcC5oYXMocG9saWN5TmFtZSkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJEdXBsaWNhdGUgcG9saWN5IG5hbWVzIG5vdCBhbGxvd2VkIGluIHBpcGVsaW5lXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3Qgbm9kZSA9IHtcbiAgICAgICAgICAgICAgICBwb2xpY3ksXG4gICAgICAgICAgICAgICAgZGVwZW5kc09uOiBuZXcgU2V0KCksXG4gICAgICAgICAgICAgICAgZGVwZW5kYW50czogbmV3IFNldCgpLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmFmdGVyUGhhc2UpIHtcbiAgICAgICAgICAgICAgICBub2RlLmFmdGVyUGhhc2UgPSBnZXRQaGFzZShvcHRpb25zLmFmdGVyUGhhc2UpO1xuICAgICAgICAgICAgICAgIG5vZGUuYWZ0ZXJQaGFzZS5oYXNBZnRlclBvbGljaWVzID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBvbGljeU1hcC5zZXQocG9saWN5TmFtZSwgbm9kZSk7XG4gICAgICAgICAgICBjb25zdCBwaGFzZSA9IGdldFBoYXNlKG9wdGlvbnMucGhhc2UpO1xuICAgICAgICAgICAgcGhhc2UucG9saWNpZXMuYWRkKG5vZGUpO1xuICAgICAgICB9XG4gICAgICAgIC8vIE5vdyB0aGF0IGVhY2ggcG9saWN5IGhhcyBhIG5vZGUsIGNvbm5lY3QgZGVwZW5kZW5jeSByZWZlcmVuY2VzLlxuICAgICAgICBmb3IgKGNvbnN0IGRlc2NyaXB0b3Igb2YgdGhpcy5fcG9saWNpZXMpIHtcbiAgICAgICAgICAgIGNvbnN0IHsgcG9saWN5LCBvcHRpb25zIH0gPSBkZXNjcmlwdG9yO1xuICAgICAgICAgICAgY29uc3QgcG9saWN5TmFtZSA9IHBvbGljeS5uYW1lO1xuICAgICAgICAgICAgY29uc3Qgbm9kZSA9IHBvbGljeU1hcC5nZXQocG9saWN5TmFtZSk7XG4gICAgICAgICAgICBpZiAoIW5vZGUpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE1pc3Npbmcgbm9kZSBmb3IgcG9saWN5ICR7cG9saWN5TmFtZX1gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvcHRpb25zLmFmdGVyUG9saWNpZXMpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGFmdGVyUG9saWN5TmFtZSBvZiBvcHRpb25zLmFmdGVyUG9saWNpZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYWZ0ZXJOb2RlID0gcG9saWN5TWFwLmdldChhZnRlclBvbGljeU5hbWUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYWZ0ZXJOb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBMaW5raW5nIGluIGJvdGggZGlyZWN0aW9ucyBoZWxwcyBsYXRlclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gd2hlbiB3ZSB3YW50IHRvIG5vdGlmeSBkZXBlbmRhbnRzLlxuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5kZXBlbmRzT24uYWRkKGFmdGVyTm9kZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBhZnRlck5vZGUuZGVwZW5kYW50cy5hZGQobm9kZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5iZWZvcmVQb2xpY2llcykge1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgYmVmb3JlUG9saWN5TmFtZSBvZiBvcHRpb25zLmJlZm9yZVBvbGljaWVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGJlZm9yZU5vZGUgPSBwb2xpY3lNYXAuZ2V0KGJlZm9yZVBvbGljeU5hbWUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYmVmb3JlTm9kZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gVG8gZXhlY3V0ZSBiZWZvcmUgYW5vdGhlciBub2RlLCBtYWtlIGl0XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBkZXBlbmQgb24gdGhlIGN1cnJlbnQgbm9kZS5cbiAgICAgICAgICAgICAgICAgICAgICAgIGJlZm9yZU5vZGUuZGVwZW5kc09uLmFkZChub2RlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUuZGVwZW5kYW50cy5hZGQoYmVmb3JlTm9kZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gd2Fsa1BoYXNlKHBoYXNlKSB7XG4gICAgICAgICAgICBwaGFzZS5oYXNSdW4gPSB0cnVlO1xuICAgICAgICAgICAgLy8gU2V0cyBpdGVyYXRlIGluIGluc2VydGlvbiBvcmRlclxuICAgICAgICAgICAgZm9yIChjb25zdCBub2RlIG9mIHBoYXNlLnBvbGljaWVzKSB7XG4gICAgICAgICAgICAgICAgaWYgKG5vZGUuYWZ0ZXJQaGFzZSAmJiAoIW5vZGUuYWZ0ZXJQaGFzZS5oYXNSdW4gfHwgbm9kZS5hZnRlclBoYXNlLnBvbGljaWVzLnNpemUpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIElmIHRoaXMgbm9kZSBpcyB3YWl0aW5nIG9uIGEgcGhhc2UgdG8gY29tcGxldGUsXG4gICAgICAgICAgICAgICAgICAgIC8vIHdlIG5lZWQgdG8gc2tpcCBpdCBmb3Igbm93LlxuICAgICAgICAgICAgICAgICAgICAvLyBFdmVuIGlmIHRoZSBwaGFzZSBpcyBlbXB0eSwgd2Ugc2hvdWxkIHdhaXQgZm9yIGl0XG4gICAgICAgICAgICAgICAgICAgIC8vIHRvIGJlIHdhbGtlZCB0byBhdm9pZCByZS1vcmRlcmluZyBwb2xpY2llcy5cbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChub2RlLmRlcGVuZHNPbi5zaXplID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIElmIHRoZXJlJ3Mgbm90aGluZyBlbHNlIHdlJ3JlIHdhaXRpbmcgZm9yLCB3ZSBjYW5cbiAgICAgICAgICAgICAgICAgICAgLy8gYWRkIHRoaXMgcG9saWN5IHRvIHRoZSByZXN1bHQgbGlzdC5cbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2gobm9kZS5wb2xpY3kpO1xuICAgICAgICAgICAgICAgICAgICAvLyBOb3RpZnkgYW55dGhpbmcgdGhhdCBkZXBlbmRzIG9uIHRoaXMgcG9saWN5IHRoYXRcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhlIHBvbGljeSBoYXMgYmVlbiBzY2hlZHVsZWQuXG4gICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgZGVwZW5kYW50IG9mIG5vZGUuZGVwZW5kYW50cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVwZW5kYW50LmRlcGVuZHNPbi5kZWxldGUobm9kZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcG9saWN5TWFwLmRlbGV0ZShub2RlLnBvbGljeS5uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgcGhhc2UucG9saWNpZXMuZGVsZXRlKG5vZGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiB3YWxrUGhhc2VzKCkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBwaGFzZSBvZiBvcmRlcmVkUGhhc2VzKSB7XG4gICAgICAgICAgICAgICAgd2Fsa1BoYXNlKHBoYXNlKTtcbiAgICAgICAgICAgICAgICAvLyBpZiB0aGUgcGhhc2UgaXNuJ3QgY29tcGxldGVcbiAgICAgICAgICAgICAgICBpZiAocGhhc2UucG9saWNpZXMuc2l6ZSA+IDAgJiYgcGhhc2UgIT09IG5vUGhhc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFub1BoYXNlLmhhc1J1bikge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gVHJ5IHJ1bm5pbmcgbm9QaGFzZSB0byBzZWUgaWYgdGhhdCB1bmJsb2NrcyB0aGlzIHBoYXNlIG5leHQgdGljay5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRoaXMgY2FuIGhhcHBlbiBpZiBhIHBoYXNlIHRoYXQgaGFwcGVucyBiZWZvcmUgbm9QaGFzZVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaXMgd2FpdGluZyBvbiBhIG5vUGhhc2UgcG9saWN5IHRvIGNvbXBsZXRlLlxuICAgICAgICAgICAgICAgICAgICAgICAgd2Fsa1BoYXNlKG5vUGhhc2UpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vIERvbid0IHByb2NlZWQgdG8gdGhlIG5leHQgcGhhc2UgdW50aWwgdGhpcyBwaGFzZSBmaW5pc2hlcy5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocGhhc2UuaGFzQWZ0ZXJQb2xpY2llcykge1xuICAgICAgICAgICAgICAgICAgICAvLyBSdW4gYW55IHBvbGljaWVzIHVuYmxvY2tlZCBieSB0aGlzIHBoYXNlXG4gICAgICAgICAgICAgICAgICAgIHdhbGtQaGFzZShub1BoYXNlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gSXRlcmF0ZSB1bnRpbCB3ZSd2ZSBwdXQgZXZlcnkgbm9kZSBpbiB0aGUgcmVzdWx0IGxpc3QuXG4gICAgICAgIGxldCBpdGVyYXRpb24gPSAwO1xuICAgICAgICB3aGlsZSAocG9saWN5TWFwLnNpemUgPiAwKSB7XG4gICAgICAgICAgICBpdGVyYXRpb24rKztcbiAgICAgICAgICAgIGNvbnN0IGluaXRpYWxSZXN1bHRMZW5ndGggPSByZXN1bHQubGVuZ3RoO1xuICAgICAgICAgICAgLy8gS2VlcCB3YWxraW5nIGVhY2ggcGhhc2UgaW4gb3JkZXIgdW50aWwgd2UgY2FuIG9yZGVyIGV2ZXJ5IG5vZGUuXG4gICAgICAgICAgICB3YWxrUGhhc2VzKCk7XG4gICAgICAgICAgICAvLyBUaGUgcmVzdWx0IGxpc3QgKnNob3VsZCogZ2V0IGF0IGxlYXN0IG9uZSBsYXJnZXIgZWFjaCB0aW1lXG4gICAgICAgICAgICAvLyBhZnRlciB0aGUgZmlyc3QgZnVsbCBwYXNzLlxuICAgICAgICAgICAgLy8gT3RoZXJ3aXNlLCB3ZSdyZSBnb2luZyB0byBsb29wIGZvcmV2ZXIuXG4gICAgICAgICAgICBpZiAocmVzdWx0Lmxlbmd0aCA8PSBpbml0aWFsUmVzdWx0TGVuZ3RoICYmIGl0ZXJhdGlvbiA+IDEpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3Qgc2F0aXNmeSBwb2xpY3kgZGVwZW5kZW5jaWVzIGR1ZSB0byByZXF1aXJlbWVudHMgY3ljbGUuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxufVxuLyoqXG4gKiBDcmVhdGVzIGEgdG90YWxseSBlbXB0eSBwaXBlbGluZS5cbiAqIFVzZWZ1bCBmb3IgdGVzdGluZyBvciBjcmVhdGluZyBhIGN1c3RvbSBvbmUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVFbXB0eVBpcGVsaW5lKCkge1xuICAgIHJldHVybiBIdHRwUGlwZWxpbmUuY3JlYXRlKCk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1waXBlbGluZS5qcy5tYXAiLCIvLyBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi5cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbmltcG9ydCB7IGNyZWF0ZUh0dHBIZWFkZXJzIH0gZnJvbSBcIi4vaHR0cEhlYWRlcnMuanNcIjtcbmltcG9ydCB7IHJhbmRvbVVVSUQgfSBmcm9tIFwiQGF6dXJlL2NvcmUtdXRpbFwiO1xuY2xhc3MgUGlwZWxpbmVSZXF1ZXN0SW1wbCB7XG4gICAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgICAgICB2YXIgX2EsIF9iLCBfYywgX2QsIF9lLCBfZiwgX2c7XG4gICAgICAgIHRoaXMudXJsID0gb3B0aW9ucy51cmw7XG4gICAgICAgIHRoaXMuYm9keSA9IG9wdGlvbnMuYm9keTtcbiAgICAgICAgdGhpcy5oZWFkZXJzID0gKF9hID0gb3B0aW9ucy5oZWFkZXJzKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBjcmVhdGVIdHRwSGVhZGVycygpO1xuICAgICAgICB0aGlzLm1ldGhvZCA9IChfYiA9IG9wdGlvbnMubWV0aG9kKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiBcIkdFVFwiO1xuICAgICAgICB0aGlzLnRpbWVvdXQgPSAoX2MgPSBvcHRpb25zLnRpbWVvdXQpICE9PSBudWxsICYmIF9jICE9PSB2b2lkIDAgPyBfYyA6IDA7XG4gICAgICAgIHRoaXMubXVsdGlwYXJ0Qm9keSA9IG9wdGlvbnMubXVsdGlwYXJ0Qm9keTtcbiAgICAgICAgdGhpcy5mb3JtRGF0YSA9IG9wdGlvbnMuZm9ybURhdGE7XG4gICAgICAgIHRoaXMuZGlzYWJsZUtlZXBBbGl2ZSA9IChfZCA9IG9wdGlvbnMuZGlzYWJsZUtlZXBBbGl2ZSkgIT09IG51bGwgJiYgX2QgIT09IHZvaWQgMCA/IF9kIDogZmFsc2U7XG4gICAgICAgIHRoaXMucHJveHlTZXR0aW5ncyA9IG9wdGlvbnMucHJveHlTZXR0aW5ncztcbiAgICAgICAgdGhpcy5zdHJlYW1SZXNwb25zZVN0YXR1c0NvZGVzID0gb3B0aW9ucy5zdHJlYW1SZXNwb25zZVN0YXR1c0NvZGVzO1xuICAgICAgICB0aGlzLndpdGhDcmVkZW50aWFscyA9IChfZSA9IG9wdGlvbnMud2l0aENyZWRlbnRpYWxzKSAhPT0gbnVsbCAmJiBfZSAhPT0gdm9pZCAwID8gX2UgOiBmYWxzZTtcbiAgICAgICAgdGhpcy5hYm9ydFNpZ25hbCA9IG9wdGlvbnMuYWJvcnRTaWduYWw7XG4gICAgICAgIHRoaXMudHJhY2luZ09wdGlvbnMgPSBvcHRpb25zLnRyYWNpbmdPcHRpb25zO1xuICAgICAgICB0aGlzLm9uVXBsb2FkUHJvZ3Jlc3MgPSBvcHRpb25zLm9uVXBsb2FkUHJvZ3Jlc3M7XG4gICAgICAgIHRoaXMub25Eb3dubG9hZFByb2dyZXNzID0gb3B0aW9ucy5vbkRvd25sb2FkUHJvZ3Jlc3M7XG4gICAgICAgIHRoaXMucmVxdWVzdElkID0gb3B0aW9ucy5yZXF1ZXN0SWQgfHwgcmFuZG9tVVVJRCgpO1xuICAgICAgICB0aGlzLmFsbG93SW5zZWN1cmVDb25uZWN0aW9uID0gKF9mID0gb3B0aW9ucy5hbGxvd0luc2VjdXJlQ29ubmVjdGlvbikgIT09IG51bGwgJiYgX2YgIT09IHZvaWQgMCA/IF9mIDogZmFsc2U7XG4gICAgICAgIHRoaXMuZW5hYmxlQnJvd3NlclN0cmVhbXMgPSAoX2cgPSBvcHRpb25zLmVuYWJsZUJyb3dzZXJTdHJlYW1zKSAhPT0gbnVsbCAmJiBfZyAhPT0gdm9pZCAwID8gX2cgOiBmYWxzZTtcbiAgICB9XG59XG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgcGlwZWxpbmUgcmVxdWVzdCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICogVGhpcyBtZXRob2QgaXMgdG8gYWxsb3cgZm9yIHRoZSBlYXN5IHNldHRpbmcgb2YgZGVmYXVsdCB2YWx1ZXMgYW5kIG5vdCByZXF1aXJlZC5cbiAqIEBwYXJhbSBvcHRpb25zIC0gVGhlIG9wdGlvbnMgdG8gY3JlYXRlIHRoZSByZXF1ZXN0IHdpdGguXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVQaXBlbGluZVJlcXVlc3Qob3B0aW9ucykge1xuICAgIHJldHVybiBuZXcgUGlwZWxpbmVSZXF1ZXN0SW1wbChvcHRpb25zKTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXBpcGVsaW5lUmVxdWVzdC5qcy5tYXAiLCIvLyBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi5cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbmltcG9ydCB7IGNyZWF0ZVRva2VuQ3ljbGVyIH0gZnJvbSBcIi4uL3V0aWwvdG9rZW5DeWNsZXIuanNcIjtcbmltcG9ydCB7IGxvZ2dlciBhcyBjb3JlTG9nZ2VyIH0gZnJvbSBcIi4uL2xvZy5qc1wiO1xuLyoqXG4gKiBUaGUgcHJvZ3JhbW1hdGljIGlkZW50aWZpZXIgb2YgdGhlIGF1eGlsaWFyeUF1dGhlbnRpY2F0aW9uSGVhZGVyUG9saWN5LlxuICovXG5leHBvcnQgY29uc3QgYXV4aWxpYXJ5QXV0aGVudGljYXRpb25IZWFkZXJQb2xpY3lOYW1lID0gXCJhdXhpbGlhcnlBdXRoZW50aWNhdGlvbkhlYWRlclBvbGljeVwiO1xuY29uc3QgQVVUSE9SSVpBVElPTl9BVVhJTElBUllfSEVBREVSID0gXCJ4LW1zLWF1dGhvcml6YXRpb24tYXV4aWxpYXJ5XCI7XG5hc3luYyBmdW5jdGlvbiBzZW5kQXV0aG9yaXplUmVxdWVzdChvcHRpb25zKSB7XG4gICAgdmFyIF9hLCBfYjtcbiAgICBjb25zdCB7IHNjb3BlcywgZ2V0QWNjZXNzVG9rZW4sIHJlcXVlc3QgfSA9IG9wdGlvbnM7XG4gICAgY29uc3QgZ2V0VG9rZW5PcHRpb25zID0ge1xuICAgICAgICBhYm9ydFNpZ25hbDogcmVxdWVzdC5hYm9ydFNpZ25hbCxcbiAgICAgICAgdHJhY2luZ09wdGlvbnM6IHJlcXVlc3QudHJhY2luZ09wdGlvbnMsXG4gICAgfTtcbiAgICByZXR1cm4gKF9iID0gKF9hID0gKGF3YWl0IGdldEFjY2Vzc1Rva2VuKHNjb3BlcywgZ2V0VG9rZW5PcHRpb25zKSkpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS50b2tlbikgIT09IG51bGwgJiYgX2IgIT09IHZvaWQgMCA/IF9iIDogXCJcIjtcbn1cbi8qKlxuICogQSBwb2xpY3kgZm9yIGV4dGVybmFsIHRva2VucyB0byBgeC1tcy1hdXRob3JpemF0aW9uLWF1eGlsaWFyeWAgaGVhZGVyLlxuICogVGhpcyBoZWFkZXIgd2lsbCBiZSB1c2VkIHdoZW4gY3JlYXRpbmcgYSBjcm9zcy10ZW5hbnQgYXBwbGljYXRpb24gd2UgbWF5IG5lZWQgdG8gaGFuZGxlIGF1dGhlbnRpY2F0aW9uIHJlcXVlc3RzXG4gKiBmb3IgcmVzb3VyY2VzIHRoYXQgYXJlIGluIGRpZmZlcmVudCB0ZW5hbnRzLlxuICogWW91IGNvdWxkIHNlZSBbQVJNIGRvY3NdKGh0dHBzOi8vbGVhcm4ubWljcm9zb2Z0LmNvbS9lbi11cy9henVyZS9henVyZS1yZXNvdXJjZS1tYW5hZ2VyL21hbmFnZW1lbnQvYXV0aGVudGljYXRlLW11bHRpLXRlbmFudCkgZm9yIGEgcnVuZG93biBvZiBob3cgdGhpcyBmZWF0dXJlIHdvcmtzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhdXhpbGlhcnlBdXRoZW50aWNhdGlvbkhlYWRlclBvbGljeShvcHRpb25zKSB7XG4gICAgY29uc3QgeyBjcmVkZW50aWFscywgc2NvcGVzIH0gPSBvcHRpb25zO1xuICAgIGNvbnN0IGxvZ2dlciA9IG9wdGlvbnMubG9nZ2VyIHx8IGNvcmVMb2dnZXI7XG4gICAgY29uc3QgdG9rZW5DeWNsZXJNYXAgPSBuZXcgV2Vha01hcCgpO1xuICAgIHJldHVybiB7XG4gICAgICAgIG5hbWU6IGF1eGlsaWFyeUF1dGhlbnRpY2F0aW9uSGVhZGVyUG9saWN5TmFtZSxcbiAgICAgICAgYXN5bmMgc2VuZFJlcXVlc3QocmVxdWVzdCwgbmV4dCkge1xuICAgICAgICAgICAgaWYgKCFyZXF1ZXN0LnVybC50b0xvd2VyQ2FzZSgpLnN0YXJ0c1dpdGgoXCJodHRwczovL1wiKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkJlYXJlciB0b2tlbiBhdXRoZW50aWNhdGlvbiBmb3IgYXV4aWxpYXJ5IGhlYWRlciBpcyBub3QgcGVybWl0dGVkIGZvciBub24tVExTIHByb3RlY3RlZCAobm9uLWh0dHBzKSBVUkxzLlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghY3JlZGVudGlhbHMgfHwgY3JlZGVudGlhbHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oYCR7YXV4aWxpYXJ5QXV0aGVudGljYXRpb25IZWFkZXJQb2xpY3lOYW1lfSBoZWFkZXIgd2lsbCBub3QgYmUgc2V0IGR1ZSB0byBlbXB0eSBjcmVkZW50aWFscy5gKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV4dChyZXF1ZXN0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHRva2VuUHJvbWlzZXMgPSBbXTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgY3JlZGVudGlhbCBvZiBjcmVkZW50aWFscykge1xuICAgICAgICAgICAgICAgIGxldCBnZXRBY2Nlc3NUb2tlbiA9IHRva2VuQ3ljbGVyTWFwLmdldChjcmVkZW50aWFsKTtcbiAgICAgICAgICAgICAgICBpZiAoIWdldEFjY2Vzc1Rva2VuKSB7XG4gICAgICAgICAgICAgICAgICAgIGdldEFjY2Vzc1Rva2VuID0gY3JlYXRlVG9rZW5DeWNsZXIoY3JlZGVudGlhbCk7XG4gICAgICAgICAgICAgICAgICAgIHRva2VuQ3ljbGVyTWFwLnNldChjcmVkZW50aWFsLCBnZXRBY2Nlc3NUb2tlbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRva2VuUHJvbWlzZXMucHVzaChzZW5kQXV0aG9yaXplUmVxdWVzdCh7XG4gICAgICAgICAgICAgICAgICAgIHNjb3BlczogQXJyYXkuaXNBcnJheShzY29wZXMpID8gc2NvcGVzIDogW3Njb3Blc10sXG4gICAgICAgICAgICAgICAgICAgIHJlcXVlc3QsXG4gICAgICAgICAgICAgICAgICAgIGdldEFjY2Vzc1Rva2VuLFxuICAgICAgICAgICAgICAgICAgICBsb2dnZXIsXG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgYXV4aWxpYXJ5VG9rZW5zID0gKGF3YWl0IFByb21pc2UuYWxsKHRva2VuUHJvbWlzZXMpKS5maWx0ZXIoKHRva2VuKSA9PiBCb29sZWFuKHRva2VuKSk7XG4gICAgICAgICAgICBpZiAoYXV4aWxpYXJ5VG9rZW5zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGxvZ2dlci53YXJuaW5nKGBOb25lIG9mIHRoZSBhdXhpbGlhcnkgdG9rZW5zIGFyZSB2YWxpZC4gJHtBVVRIT1JJWkFUSU9OX0FVWElMSUFSWV9IRUFERVJ9IGhlYWRlciB3aWxsIG5vdCBiZSBzZXQuYCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5leHQocmVxdWVzdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXF1ZXN0LmhlYWRlcnMuc2V0KEFVVEhPUklaQVRJT05fQVVYSUxJQVJZX0hFQURFUiwgYXV4aWxpYXJ5VG9rZW5zLm1hcCgodG9rZW4pID0+IGBCZWFyZXIgJHt0b2tlbn1gKS5qb2luKFwiLCBcIikpO1xuICAgICAgICAgICAgcmV0dXJuIG5leHQocmVxdWVzdCk7XG4gICAgICAgIH0sXG4gICAgfTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWF1eGlsaWFyeUF1dGhlbnRpY2F0aW9uSGVhZGVyUG9saWN5LmpzLm1hcCIsIi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuaW1wb3J0IHsgY3JlYXRlVG9rZW5DeWNsZXIgfSBmcm9tIFwiLi4vdXRpbC90b2tlbkN5Y2xlci5qc1wiO1xuaW1wb3J0IHsgbG9nZ2VyIGFzIGNvcmVMb2dnZXIgfSBmcm9tIFwiLi4vbG9nLmpzXCI7XG4vKipcbiAqIFRoZSBwcm9ncmFtbWF0aWMgaWRlbnRpZmllciBvZiB0aGUgYmVhcmVyVG9rZW5BdXRoZW50aWNhdGlvblBvbGljeS5cbiAqL1xuZXhwb3J0IGNvbnN0IGJlYXJlclRva2VuQXV0aGVudGljYXRpb25Qb2xpY3lOYW1lID0gXCJiZWFyZXJUb2tlbkF1dGhlbnRpY2F0aW9uUG9saWN5XCI7XG4vKipcbiAqIERlZmF1bHQgYXV0aG9yaXplIHJlcXVlc3QgaGFuZGxlclxuICovXG5hc3luYyBmdW5jdGlvbiBkZWZhdWx0QXV0aG9yaXplUmVxdWVzdChvcHRpb25zKSB7XG4gICAgY29uc3QgeyBzY29wZXMsIGdldEFjY2Vzc1Rva2VuLCByZXF1ZXN0IH0gPSBvcHRpb25zO1xuICAgIGNvbnN0IGdldFRva2VuT3B0aW9ucyA9IHtcbiAgICAgICAgYWJvcnRTaWduYWw6IHJlcXVlc3QuYWJvcnRTaWduYWwsXG4gICAgICAgIHRyYWNpbmdPcHRpb25zOiByZXF1ZXN0LnRyYWNpbmdPcHRpb25zLFxuICAgIH07XG4gICAgY29uc3QgYWNjZXNzVG9rZW4gPSBhd2FpdCBnZXRBY2Nlc3NUb2tlbihzY29wZXMsIGdldFRva2VuT3B0aW9ucyk7XG4gICAgaWYgKGFjY2Vzc1Rva2VuKSB7XG4gICAgICAgIG9wdGlvbnMucmVxdWVzdC5oZWFkZXJzLnNldChcIkF1dGhvcml6YXRpb25cIiwgYEJlYXJlciAke2FjY2Vzc1Rva2VuLnRva2VufWApO1xuICAgIH1cbn1cbi8qKlxuICogV2Ugd2lsbCByZXRyaWV2ZSB0aGUgY2hhbGxlbmdlIG9ubHkgaWYgdGhlIHJlc3BvbnNlIHN0YXR1cyBjb2RlIHdhcyA0MDEsXG4gKiBhbmQgaWYgdGhlIHJlc3BvbnNlIGNvbnRhaW5lZCB0aGUgaGVhZGVyIFwiV1dXLUF1dGhlbnRpY2F0ZVwiIHdpdGggYSBub24tZW1wdHkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGdldENoYWxsZW5nZShyZXNwb25zZSkge1xuICAgIGNvbnN0IGNoYWxsZW5nZSA9IHJlc3BvbnNlLmhlYWRlcnMuZ2V0KFwiV1dXLUF1dGhlbnRpY2F0ZVwiKTtcbiAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSA0MDEgJiYgY2hhbGxlbmdlKSB7XG4gICAgICAgIHJldHVybiBjaGFsbGVuZ2U7XG4gICAgfVxuICAgIHJldHVybjtcbn1cbi8qKlxuICogQSBwb2xpY3kgdGhhdCBjYW4gcmVxdWVzdCBhIHRva2VuIGZyb20gYSBUb2tlbkNyZWRlbnRpYWwgaW1wbGVtZW50YXRpb24gYW5kXG4gKiB0aGVuIGFwcGx5IGl0IHRvIHRoZSBBdXRob3JpemF0aW9uIGhlYWRlciBvZiBhIHJlcXVlc3QgYXMgYSBCZWFyZXIgdG9rZW4uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBiZWFyZXJUb2tlbkF1dGhlbnRpY2F0aW9uUG9saWN5KG9wdGlvbnMpIHtcbiAgICB2YXIgX2E7XG4gICAgY29uc3QgeyBjcmVkZW50aWFsLCBzY29wZXMsIGNoYWxsZW5nZUNhbGxiYWNrcyB9ID0gb3B0aW9ucztcbiAgICBjb25zdCBsb2dnZXIgPSBvcHRpb25zLmxvZ2dlciB8fCBjb3JlTG9nZ2VyO1xuICAgIGNvbnN0IGNhbGxiYWNrcyA9IE9iamVjdC5hc3NpZ24oeyBhdXRob3JpemVSZXF1ZXN0OiAoX2EgPSBjaGFsbGVuZ2VDYWxsYmFja3MgPT09IG51bGwgfHwgY2hhbGxlbmdlQ2FsbGJhY2tzID09PSB2b2lkIDAgPyB2b2lkIDAgOiBjaGFsbGVuZ2VDYWxsYmFja3MuYXV0aG9yaXplUmVxdWVzdCkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogZGVmYXVsdEF1dGhvcml6ZVJlcXVlc3QsIGF1dGhvcml6ZVJlcXVlc3RPbkNoYWxsZW5nZTogY2hhbGxlbmdlQ2FsbGJhY2tzID09PSBudWxsIHx8IGNoYWxsZW5nZUNhbGxiYWNrcyA9PT0gdm9pZCAwID8gdm9pZCAwIDogY2hhbGxlbmdlQ2FsbGJhY2tzLmF1dGhvcml6ZVJlcXVlc3RPbkNoYWxsZW5nZSB9LCBjaGFsbGVuZ2VDYWxsYmFja3MpO1xuICAgIC8vIFRoaXMgZnVuY3Rpb24gZW5jYXBzdWxhdGVzIHRoZSBlbnRpcmUgcHJvY2VzcyBvZiByZWxpYWJseSByZXRyaWV2aW5nIHRoZSB0b2tlblxuICAgIC8vIFRoZSBvcHRpb25zIGFyZSBsZWZ0IG91dCBvZiB0aGUgcHVibGljIEFQSSB1bnRpbCB0aGVyZSdzIGRlbWFuZCB0byBjb25maWd1cmUgdGhpcy5cbiAgICAvLyBSZW1lbWJlciB0byBleHRlbmQgYEJlYXJlclRva2VuQXV0aGVudGljYXRpb25Qb2xpY3lPcHRpb25zYCB3aXRoIGBUb2tlbkN5Y2xlck9wdGlvbnNgXG4gICAgLy8gaW4gb3JkZXIgdG8gcGFzcyB0aHJvdWdoIHRoZSBgb3B0aW9uc2Agb2JqZWN0LlxuICAgIGNvbnN0IGdldEFjY2Vzc1Rva2VuID0gY3JlZGVudGlhbFxuICAgICAgICA/IGNyZWF0ZVRva2VuQ3ljbGVyKGNyZWRlbnRpYWwgLyogLCBvcHRpb25zICovKVxuICAgICAgICA6ICgpID0+IFByb21pc2UucmVzb2x2ZShudWxsKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBuYW1lOiBiZWFyZXJUb2tlbkF1dGhlbnRpY2F0aW9uUG9saWN5TmFtZSxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIElmIHRoZXJlJ3Mgbm8gY2hhbGxlbmdlIHBhcmFtZXRlcjpcbiAgICAgICAgICogLSBJdCB3aWxsIHRyeSB0byByZXRyaWV2ZSB0aGUgdG9rZW4gdXNpbmcgdGhlIGNhY2hlLCBvciB0aGUgY3JlZGVudGlhbCdzIGdldFRva2VuLlxuICAgICAgICAgKiAtIFRoZW4gaXQgd2lsbCB0cnkgdGhlIG5leHQgcG9saWN5IHdpdGggb3Igd2l0aG91dCB0aGUgcmV0cmlldmVkIHRva2VuLlxuICAgICAgICAgKlxuICAgICAgICAgKiBJdCB1c2VzIHRoZSBjaGFsbGVuZ2UgcGFyYW1ldGVycyB0bzpcbiAgICAgICAgICogLSBTa2lwIGEgZmlyc3QgYXR0ZW1wdCB0byBnZXQgdGhlIHRva2VuIGZyb20gdGhlIGNyZWRlbnRpYWwgaWYgdGhlcmUncyBubyBjYWNoZWQgdG9rZW4sXG4gICAgICAgICAqICAgc2luY2UgaXQgZXhwZWN0cyB0aGUgdG9rZW4gdG8gYmUgcmV0cmlldmFibGUgb25seSBhZnRlciB0aGUgY2hhbGxlbmdlLlxuICAgICAgICAgKiAtIFByZXBhcmUgdGhlIG91dGdvaW5nIHJlcXVlc3QgaWYgdGhlIGBwcmVwYXJlUmVxdWVzdGAgbWV0aG9kIGhhcyBiZWVuIHByb3ZpZGVkLlxuICAgICAgICAgKiAtIFNlbmQgYW4gaW5pdGlhbCByZXF1ZXN0IHRvIHJlY2VpdmUgdGhlIGNoYWxsZW5nZSBpZiBpdCBmYWlscy5cbiAgICAgICAgICogLSBQcm9jZXNzIGEgY2hhbGxlbmdlIGlmIHRoZSByZXNwb25zZSBjb250YWlucyBpdC5cbiAgICAgICAgICogLSBSZXRyaWV2ZSBhIHRva2VuIHdpdGggdGhlIGNoYWxsZW5nZSBpbmZvcm1hdGlvbiwgdGhlbiByZS1zZW5kIHRoZSByZXF1ZXN0LlxuICAgICAgICAgKi9cbiAgICAgICAgYXN5bmMgc2VuZFJlcXVlc3QocmVxdWVzdCwgbmV4dCkge1xuICAgICAgICAgICAgaWYgKCFyZXF1ZXN0LnVybC50b0xvd2VyQ2FzZSgpLnN0YXJ0c1dpdGgoXCJodHRwczovL1wiKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkJlYXJlciB0b2tlbiBhdXRoZW50aWNhdGlvbiBpcyBub3QgcGVybWl0dGVkIGZvciBub24tVExTIHByb3RlY3RlZCAobm9uLWh0dHBzKSBVUkxzLlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGF3YWl0IGNhbGxiYWNrcy5hdXRob3JpemVSZXF1ZXN0KHtcbiAgICAgICAgICAgICAgICBzY29wZXM6IEFycmF5LmlzQXJyYXkoc2NvcGVzKSA/IHNjb3BlcyA6IFtzY29wZXNdLFxuICAgICAgICAgICAgICAgIHJlcXVlc3QsXG4gICAgICAgICAgICAgICAgZ2V0QWNjZXNzVG9rZW4sXG4gICAgICAgICAgICAgICAgbG9nZ2VyLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBsZXQgcmVzcG9uc2U7XG4gICAgICAgICAgICBsZXQgZXJyb3I7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gYXdhaXQgbmV4dChyZXF1ZXN0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBlcnJvciA9IGVycjtcbiAgICAgICAgICAgICAgICByZXNwb25zZSA9IGVyci5yZXNwb25zZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjYWxsYmFja3MuYXV0aG9yaXplUmVxdWVzdE9uQ2hhbGxlbmdlICYmXG4gICAgICAgICAgICAgICAgKHJlc3BvbnNlID09PSBudWxsIHx8IHJlc3BvbnNlID09PSB2b2lkIDAgPyB2b2lkIDAgOiByZXNwb25zZS5zdGF0dXMpID09PSA0MDEgJiZcbiAgICAgICAgICAgICAgICBnZXRDaGFsbGVuZ2UocmVzcG9uc2UpKSB7XG4gICAgICAgICAgICAgICAgLy8gcHJvY2Vzc2VzIGNoYWxsZW5nZVxuICAgICAgICAgICAgICAgIGNvbnN0IHNob3VsZFNlbmRSZXF1ZXN0ID0gYXdhaXQgY2FsbGJhY2tzLmF1dGhvcml6ZVJlcXVlc3RPbkNoYWxsZW5nZSh7XG4gICAgICAgICAgICAgICAgICAgIHNjb3BlczogQXJyYXkuaXNBcnJheShzY29wZXMpID8gc2NvcGVzIDogW3Njb3Blc10sXG4gICAgICAgICAgICAgICAgICAgIHJlcXVlc3QsXG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlLFxuICAgICAgICAgICAgICAgICAgICBnZXRBY2Nlc3NUb2tlbixcbiAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGlmIChzaG91bGRTZW5kUmVxdWVzdCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV4dChyZXF1ZXN0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICB9O1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YmVhcmVyVG9rZW5BdXRoZW50aWNhdGlvblBvbGljeS5qcy5tYXAiLCIvLyBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi5cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbi8qXG4gKiBOT1RFOiBXaGVuIG1vdmluZyB0aGlzIGZpbGUsIHBsZWFzZSB1cGRhdGUgXCJicm93c2VyXCIgc2VjdGlvbiBpbiBwYWNrYWdlLmpzb25cbiAqL1xuZXhwb3J0IGNvbnN0IGRlY29tcHJlc3NSZXNwb25zZVBvbGljeU5hbWUgPSBcImRlY29tcHJlc3NSZXNwb25zZVBvbGljeVwiO1xuLyoqXG4gKiBkZWNvbXByZXNzUmVzcG9uc2VQb2xpY3kgaXMgbm90IHN1cHBvcnRlZCBpbiB0aGUgYnJvd3NlciBhbmQgYXR0ZW1wdGluZ1xuICogdG8gdXNlIGl0IHdpbGwgcmFpc2UgYW4gZXJyb3IuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZWNvbXByZXNzUmVzcG9uc2VQb2xpY3koKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiZGVjb21wcmVzc1Jlc3BvbnNlUG9saWN5IGlzIG5vdCBzdXBwb3J0ZWQgaW4gYnJvd3NlciBlbnZpcm9ubWVudFwiKTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRlY29tcHJlc3NSZXNwb25zZVBvbGljeS1icm93c2VyLm1qcy5tYXAiLCIvLyBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi5cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbmltcG9ydCB7IGV4cG9uZW50aWFsUmV0cnlTdHJhdGVneSB9IGZyb20gXCIuLi9yZXRyeVN0cmF0ZWdpZXMvZXhwb25lbnRpYWxSZXRyeVN0cmF0ZWd5LmpzXCI7XG5pbXBvcnQgeyB0aHJvdHRsaW5nUmV0cnlTdHJhdGVneSB9IGZyb20gXCIuLi9yZXRyeVN0cmF0ZWdpZXMvdGhyb3R0bGluZ1JldHJ5U3RyYXRlZ3kuanNcIjtcbmltcG9ydCB7IHJldHJ5UG9saWN5IH0gZnJvbSBcIi4vcmV0cnlQb2xpY3kuanNcIjtcbmltcG9ydCB7IERFRkFVTFRfUkVUUllfUE9MSUNZX0NPVU5UIH0gZnJvbSBcIi4uL2NvbnN0YW50cy5qc1wiO1xuLyoqXG4gKiBOYW1lIG9mIHRoZSB7QGxpbmsgZGVmYXVsdFJldHJ5UG9saWN5fVxuICovXG5leHBvcnQgY29uc3QgZGVmYXVsdFJldHJ5UG9saWN5TmFtZSA9IFwiZGVmYXVsdFJldHJ5UG9saWN5XCI7XG4vKipcbiAqIEEgcG9saWN5IHRoYXQgcmV0cmllcyBhY2NvcmRpbmcgdG8gdGhyZWUgc3RyYXRlZ2llczpcbiAqIC0gV2hlbiB0aGUgc2VydmVyIHNlbmRzIGEgNDI5IHJlc3BvbnNlIHdpdGggYSBSZXRyeS1BZnRlciBoZWFkZXIuXG4gKiAtIFdoZW4gdGhlcmUgYXJlIGVycm9ycyBpbiB0aGUgdW5kZXJseWluZyB0cmFuc3BvcnQgbGF5ZXIgKGUuZy4gRE5TIGxvb2t1cCBmYWlsdXJlcykuXG4gKiAtIE9yIG90aGVyd2lzZSBpZiB0aGUgb3V0Z29pbmcgcmVxdWVzdCBmYWlscywgaXQgd2lsbCByZXRyeSB3aXRoIGFuIGV4cG9uZW50aWFsbHkgaW5jcmVhc2luZyBkZWxheS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlZmF1bHRSZXRyeVBvbGljeShvcHRpb25zID0ge30pIHtcbiAgICB2YXIgX2E7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgbmFtZTogZGVmYXVsdFJldHJ5UG9saWN5TmFtZSxcbiAgICAgICAgc2VuZFJlcXVlc3Q6IHJldHJ5UG9saWN5KFt0aHJvdHRsaW5nUmV0cnlTdHJhdGVneSgpLCBleHBvbmVudGlhbFJldHJ5U3RyYXRlZ3kob3B0aW9ucyldLCB7XG4gICAgICAgICAgICBtYXhSZXRyaWVzOiAoX2EgPSBvcHRpb25zLm1heFJldHJpZXMpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IERFRkFVTFRfUkVUUllfUE9MSUNZX0NPVU5ULFxuICAgICAgICB9KS5zZW5kUmVxdWVzdCxcbiAgICB9O1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGVmYXVsdFJldHJ5UG9saWN5LmpzLm1hcCIsIi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuaW1wb3J0IHsgZXhwb25lbnRpYWxSZXRyeVN0cmF0ZWd5IH0gZnJvbSBcIi4uL3JldHJ5U3RyYXRlZ2llcy9leHBvbmVudGlhbFJldHJ5U3RyYXRlZ3kuanNcIjtcbmltcG9ydCB7IHJldHJ5UG9saWN5IH0gZnJvbSBcIi4vcmV0cnlQb2xpY3kuanNcIjtcbmltcG9ydCB7IERFRkFVTFRfUkVUUllfUE9MSUNZX0NPVU5UIH0gZnJvbSBcIi4uL2NvbnN0YW50cy5qc1wiO1xuLyoqXG4gKiBUaGUgcHJvZ3JhbW1hdGljIGlkZW50aWZpZXIgb2YgdGhlIGV4cG9uZW50aWFsUmV0cnlQb2xpY3kuXG4gKi9cbmV4cG9ydCBjb25zdCBleHBvbmVudGlhbFJldHJ5UG9saWN5TmFtZSA9IFwiZXhwb25lbnRpYWxSZXRyeVBvbGljeVwiO1xuLyoqXG4gKiBBIHBvbGljeSB0aGF0IGF0dGVtcHRzIHRvIHJldHJ5IHJlcXVlc3RzIHdoaWxlIGludHJvZHVjaW5nIGFuIGV4cG9uZW50aWFsbHkgaW5jcmVhc2luZyBkZWxheS5cbiAqIEBwYXJhbSBvcHRpb25zIC0gT3B0aW9ucyB0aGF0IGNvbmZpZ3VyZSByZXRyeSBsb2dpYy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGV4cG9uZW50aWFsUmV0cnlQb2xpY3kob3B0aW9ucyA9IHt9KSB7XG4gICAgdmFyIF9hO1xuICAgIHJldHVybiByZXRyeVBvbGljeShbXG4gICAgICAgIGV4cG9uZW50aWFsUmV0cnlTdHJhdGVneShPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMpLCB7IGlnbm9yZVN5c3RlbUVycm9yczogdHJ1ZSB9KSksXG4gICAgXSwge1xuICAgICAgICBtYXhSZXRyaWVzOiAoX2EgPSBvcHRpb25zLm1heFJldHJpZXMpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IERFRkFVTFRfUkVUUllfUE9MSUNZX0NPVU5ULFxuICAgIH0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZXhwb25lbnRpYWxSZXRyeVBvbGljeS5qcy5tYXAiLCIvLyBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi5cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbmltcG9ydCB7IGlzTm9kZUxpa2UsIHN0cmluZ1RvVWludDhBcnJheSB9IGZyb20gXCJAYXp1cmUvY29yZS11dGlsXCI7XG5pbXBvcnQgeyBjcmVhdGVIdHRwSGVhZGVycyB9IGZyb20gXCIuLi9odHRwSGVhZGVycy5qc1wiO1xuLyoqXG4gKiBUaGUgcHJvZ3JhbW1hdGljIGlkZW50aWZpZXIgb2YgdGhlIGZvcm1EYXRhUG9saWN5LlxuICovXG5leHBvcnQgY29uc3QgZm9ybURhdGFQb2xpY3lOYW1lID0gXCJmb3JtRGF0YVBvbGljeVwiO1xuZnVuY3Rpb24gZm9ybURhdGFUb0Zvcm1EYXRhTWFwKGZvcm1EYXRhKSB7XG4gICAgdmFyIF9hO1xuICAgIGNvbnN0IGZvcm1EYXRhTWFwID0ge307XG4gICAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgZm9ybURhdGEuZW50cmllcygpKSB7XG4gICAgICAgIChfYSA9IGZvcm1EYXRhTWFwW2tleV0pICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IChmb3JtRGF0YU1hcFtrZXldID0gW10pO1xuICAgICAgICBmb3JtRGF0YU1hcFtrZXldLnB1c2godmFsdWUpO1xuICAgIH1cbiAgICByZXR1cm4gZm9ybURhdGFNYXA7XG59XG4vKipcbiAqIEEgcG9saWN5IHRoYXQgZW5jb2RlcyBGb3JtRGF0YSBvbiB0aGUgcmVxdWVzdCBpbnRvIHRoZSBib2R5LlxuICovXG5leHBvcnQgZnVuY3Rpb24gZm9ybURhdGFQb2xpY3koKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgbmFtZTogZm9ybURhdGFQb2xpY3lOYW1lLFxuICAgICAgICBhc3luYyBzZW5kUmVxdWVzdChyZXF1ZXN0LCBuZXh0KSB7XG4gICAgICAgICAgICBpZiAoaXNOb2RlTGlrZSAmJiB0eXBlb2YgRm9ybURhdGEgIT09IFwidW5kZWZpbmVkXCIgJiYgcmVxdWVzdC5ib2R5IGluc3RhbmNlb2YgRm9ybURhdGEpIHtcbiAgICAgICAgICAgICAgICByZXF1ZXN0LmZvcm1EYXRhID0gZm9ybURhdGFUb0Zvcm1EYXRhTWFwKHJlcXVlc3QuYm9keSk7XG4gICAgICAgICAgICAgICAgcmVxdWVzdC5ib2R5ID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHJlcXVlc3QuZm9ybURhdGEpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjb250ZW50VHlwZSA9IHJlcXVlc3QuaGVhZGVycy5nZXQoXCJDb250ZW50LVR5cGVcIik7XG4gICAgICAgICAgICAgICAgaWYgKGNvbnRlbnRUeXBlICYmIGNvbnRlbnRUeXBlLmluZGV4T2YoXCJhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWRcIikgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlcXVlc3QuYm9keSA9IHd3d0Zvcm1VcmxFbmNvZGUocmVxdWVzdC5mb3JtRGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCBwcmVwYXJlRm9ybURhdGEocmVxdWVzdC5mb3JtRGF0YSwgcmVxdWVzdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlcXVlc3QuZm9ybURhdGEgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbmV4dChyZXF1ZXN0KTtcbiAgICAgICAgfSxcbiAgICB9O1xufVxuZnVuY3Rpb24gd3d3Rm9ybVVybEVuY29kZShmb3JtRGF0YSkge1xuICAgIGNvbnN0IHVybFNlYXJjaFBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMoKTtcbiAgICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhmb3JtRGF0YSkpIHtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHN1YlZhbHVlIG9mIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdXJsU2VhcmNoUGFyYW1zLmFwcGVuZChrZXksIHN1YlZhbHVlLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdXJsU2VhcmNoUGFyYW1zLmFwcGVuZChrZXksIHZhbHVlLnRvU3RyaW5nKCkpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB1cmxTZWFyY2hQYXJhbXMudG9TdHJpbmcoKTtcbn1cbmFzeW5jIGZ1bmN0aW9uIHByZXBhcmVGb3JtRGF0YShmb3JtRGF0YSwgcmVxdWVzdCkge1xuICAgIC8vIHZhbGlkYXRlIGNvbnRlbnQgdHlwZSAobXVsdGlwYXJ0L2Zvcm0tZGF0YSlcbiAgICBjb25zdCBjb250ZW50VHlwZSA9IHJlcXVlc3QuaGVhZGVycy5nZXQoXCJDb250ZW50LVR5cGVcIik7XG4gICAgaWYgKGNvbnRlbnRUeXBlICYmICFjb250ZW50VHlwZS5zdGFydHNXaXRoKFwibXVsdGlwYXJ0L2Zvcm0tZGF0YVwiKSkge1xuICAgICAgICAvLyBjb250ZW50IHR5cGUgaXMgc3BlY2lmaWVkIGFuZCBpcyBub3QgbXVsdGlwYXJ0L2Zvcm0tZGF0YS4gRXhpdC5cbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICByZXF1ZXN0LmhlYWRlcnMuc2V0KFwiQ29udGVudC1UeXBlXCIsIGNvbnRlbnRUeXBlICE9PSBudWxsICYmIGNvbnRlbnRUeXBlICE9PSB2b2lkIDAgPyBjb250ZW50VHlwZSA6IFwibXVsdGlwYXJ0L2Zvcm0tZGF0YVwiKTtcbiAgICAvLyBzZXQgYm9keSB0byBNdWx0aXBhcnRSZXF1ZXN0Qm9keSB1c2luZyBjb250ZW50IGZyb20gRm9ybURhdGFNYXBcbiAgICBjb25zdCBwYXJ0cyA9IFtdO1xuICAgIGZvciAoY29uc3QgW2ZpZWxkTmFtZSwgdmFsdWVzXSBvZiBPYmplY3QuZW50cmllcyhmb3JtRGF0YSkpIHtcbiAgICAgICAgZm9yIChjb25zdCB2YWx1ZSBvZiBBcnJheS5pc0FycmF5KHZhbHVlcykgPyB2YWx1ZXMgOiBbdmFsdWVzXSkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICAgIHBhcnRzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiBjcmVhdGVIdHRwSGVhZGVycyh7XG4gICAgICAgICAgICAgICAgICAgICAgICBcIkNvbnRlbnQtRGlzcG9zaXRpb25cIjogYGZvcm0tZGF0YTsgbmFtZT1cIiR7ZmllbGROYW1lfVwiYCxcbiAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICAgIGJvZHk6IHN0cmluZ1RvVWludDhBcnJheSh2YWx1ZSwgXCJ1dGYtOFwiKSxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHZhbHVlID09PSB1bmRlZmluZWQgfHwgdmFsdWUgPT09IG51bGwgfHwgdHlwZW9mIHZhbHVlICE9PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmV4cGVjdGVkIHZhbHVlIGZvciBrZXkgJHtmaWVsZE5hbWV9OiAke3ZhbHVlfS4gVmFsdWUgc2hvdWxkIGJlIHNlcmlhbGl6ZWQgdG8gc3RyaW5nIGZpcnN0LmApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gdXNpbmcgfHwgaW5zdGVhZCBvZiA/PyBoZXJlIHNpbmNlIGlmIHZhbHVlLm5hbWUgaXMgZW1wdHkgd2Ugc2hvdWxkIGNyZWF0ZSBhIGZpbGUgbmFtZVxuICAgICAgICAgICAgICAgIGNvbnN0IGZpbGVOYW1lID0gdmFsdWUubmFtZSB8fCBcImJsb2JcIjtcbiAgICAgICAgICAgICAgICBjb25zdCBoZWFkZXJzID0gY3JlYXRlSHR0cEhlYWRlcnMoKTtcbiAgICAgICAgICAgICAgICBoZWFkZXJzLnNldChcIkNvbnRlbnQtRGlzcG9zaXRpb25cIiwgYGZvcm0tZGF0YTsgbmFtZT1cIiR7ZmllbGROYW1lfVwiOyBmaWxlbmFtZT1cIiR7ZmlsZU5hbWV9XCJgKTtcbiAgICAgICAgICAgICAgICAvLyBhZ2FpbiwgfHwgaXMgdXNlZCBzaW5jZSBhbiBlbXB0eSB2YWx1ZS50eXBlIG1lYW5zIHRoZSBjb250ZW50IHR5cGUgaXMgdW5zZXRcbiAgICAgICAgICAgICAgICBoZWFkZXJzLnNldChcIkNvbnRlbnQtVHlwZVwiLCB2YWx1ZS50eXBlIHx8IFwiYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtXCIpO1xuICAgICAgICAgICAgICAgIHBhcnRzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzLFxuICAgICAgICAgICAgICAgICAgICBib2R5OiB2YWx1ZSxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXF1ZXN0Lm11bHRpcGFydEJvZHkgPSB7IHBhcnRzIH07XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1mb3JtRGF0YVBvbGljeS5qcy5tYXAiLCIvLyBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi5cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbmltcG9ydCB7IGxvZ2dlciBhcyBjb3JlTG9nZ2VyIH0gZnJvbSBcIi4uL2xvZy5qc1wiO1xuaW1wb3J0IHsgU2FuaXRpemVyIH0gZnJvbSBcIi4uL3V0aWwvc2FuaXRpemVyLmpzXCI7XG4vKipcbiAqIFRoZSBwcm9ncmFtbWF0aWMgaWRlbnRpZmllciBvZiB0aGUgbG9nUG9saWN5LlxuICovXG5leHBvcnQgY29uc3QgbG9nUG9saWN5TmFtZSA9IFwibG9nUG9saWN5XCI7XG4vKipcbiAqIEEgcG9saWN5IHRoYXQgbG9ncyBhbGwgcmVxdWVzdHMgYW5kIHJlc3BvbnNlcy5cbiAqIEBwYXJhbSBvcHRpb25zIC0gT3B0aW9ucyB0byBjb25maWd1cmUgbG9nUG9saWN5LlxuICovXG5leHBvcnQgZnVuY3Rpb24gbG9nUG9saWN5KG9wdGlvbnMgPSB7fSkge1xuICAgIHZhciBfYTtcbiAgICBjb25zdCBsb2dnZXIgPSAoX2EgPSBvcHRpb25zLmxvZ2dlcikgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogY29yZUxvZ2dlci5pbmZvO1xuICAgIGNvbnN0IHNhbml0aXplciA9IG5ldyBTYW5pdGl6ZXIoe1xuICAgICAgICBhZGRpdGlvbmFsQWxsb3dlZEhlYWRlck5hbWVzOiBvcHRpb25zLmFkZGl0aW9uYWxBbGxvd2VkSGVhZGVyTmFtZXMsXG4gICAgICAgIGFkZGl0aW9uYWxBbGxvd2VkUXVlcnlQYXJhbWV0ZXJzOiBvcHRpb25zLmFkZGl0aW9uYWxBbGxvd2VkUXVlcnlQYXJhbWV0ZXJzLFxuICAgIH0pO1xuICAgIHJldHVybiB7XG4gICAgICAgIG5hbWU6IGxvZ1BvbGljeU5hbWUsXG4gICAgICAgIGFzeW5jIHNlbmRSZXF1ZXN0KHJlcXVlc3QsIG5leHQpIHtcbiAgICAgICAgICAgIGlmICghbG9nZ2VyLmVuYWJsZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV4dChyZXF1ZXN0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxvZ2dlcihgUmVxdWVzdDogJHtzYW5pdGl6ZXIuc2FuaXRpemUocmVxdWVzdCl9YCk7XG4gICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IG5leHQocmVxdWVzdCk7XG4gICAgICAgICAgICBsb2dnZXIoYFJlc3BvbnNlIHN0YXR1cyBjb2RlOiAke3Jlc3BvbnNlLnN0YXR1c31gKTtcbiAgICAgICAgICAgIGxvZ2dlcihgSGVhZGVyczogJHtzYW5pdGl6ZXIuc2FuaXRpemUocmVzcG9uc2UuaGVhZGVycyl9YCk7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgIH0sXG4gICAgfTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWxvZ1BvbGljeS5qcy5tYXAiLCIvLyBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi5cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbmltcG9ydCB7IHJhbmRvbVVVSUQsIHN0cmluZ1RvVWludDhBcnJheSB9IGZyb20gXCJAYXp1cmUvY29yZS11dGlsXCI7XG5pbXBvcnQgeyBjb25jYXQgfSBmcm9tIFwiLi4vdXRpbC9jb25jYXQuanNcIjtcbmltcG9ydCB7IGlzQmxvYiB9IGZyb20gXCIuLi91dGlsL3R5cGVHdWFyZHMuanNcIjtcbmZ1bmN0aW9uIGdlbmVyYXRlQm91bmRhcnkoKSB7XG4gICAgcmV0dXJuIGAtLS0tQXpTREtGb3JtQm91bmRhcnkke3JhbmRvbVVVSUQoKX1gO1xufVxuZnVuY3Rpb24gZW5jb2RlSGVhZGVycyhoZWFkZXJzKSB7XG4gICAgbGV0IHJlc3VsdCA9IFwiXCI7XG4gICAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgaGVhZGVycykge1xuICAgICAgICByZXN1bHQgKz0gYCR7a2V5fTogJHt2YWx1ZX1cXHJcXG5gO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gZ2V0TGVuZ3RoKHNvdXJjZSkge1xuICAgIGlmIChzb3VyY2UgaW5zdGFuY2VvZiBVaW50OEFycmF5KSB7XG4gICAgICAgIHJldHVybiBzb3VyY2UuYnl0ZUxlbmd0aDtcbiAgICB9XG4gICAgZWxzZSBpZiAoaXNCbG9iKHNvdXJjZSkpIHtcbiAgICAgICAgLy8gaWYgd2FzIGNyZWF0ZWQgdXNpbmcgY3JlYXRlRmlsZSB0aGVuIC0xIG1lYW5zIHdlIGhhdmUgYW4gdW5rbm93biBzaXplXG4gICAgICAgIHJldHVybiBzb3VyY2Uuc2l6ZSA9PT0gLTEgPyB1bmRlZmluZWQgOiBzb3VyY2Uuc2l6ZTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxufVxuZnVuY3Rpb24gZ2V0VG90YWxMZW5ndGgoc291cmNlcykge1xuICAgIGxldCB0b3RhbCA9IDA7XG4gICAgZm9yIChjb25zdCBzb3VyY2Ugb2Ygc291cmNlcykge1xuICAgICAgICBjb25zdCBwYXJ0TGVuZ3RoID0gZ2V0TGVuZ3RoKHNvdXJjZSk7XG4gICAgICAgIGlmIChwYXJ0TGVuZ3RoID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0b3RhbCArPSBwYXJ0TGVuZ3RoO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0b3RhbDtcbn1cbmFzeW5jIGZ1bmN0aW9uIGJ1aWxkUmVxdWVzdEJvZHkocmVxdWVzdCwgcGFydHMsIGJvdW5kYXJ5KSB7XG4gICAgY29uc3Qgc291cmNlcyA9IFtcbiAgICAgICAgc3RyaW5nVG9VaW50OEFycmF5KGAtLSR7Ym91bmRhcnl9YCwgXCJ1dGYtOFwiKSxcbiAgICAgICAgLi4ucGFydHMuZmxhdE1hcCgocGFydCkgPT4gW1xuICAgICAgICAgICAgc3RyaW5nVG9VaW50OEFycmF5KFwiXFxyXFxuXCIsIFwidXRmLThcIiksXG4gICAgICAgICAgICBzdHJpbmdUb1VpbnQ4QXJyYXkoZW5jb2RlSGVhZGVycyhwYXJ0LmhlYWRlcnMpLCBcInV0Zi04XCIpLFxuICAgICAgICAgICAgc3RyaW5nVG9VaW50OEFycmF5KFwiXFxyXFxuXCIsIFwidXRmLThcIiksXG4gICAgICAgICAgICBwYXJ0LmJvZHksXG4gICAgICAgICAgICBzdHJpbmdUb1VpbnQ4QXJyYXkoYFxcclxcbi0tJHtib3VuZGFyeX1gLCBcInV0Zi04XCIpLFxuICAgICAgICBdKSxcbiAgICAgICAgc3RyaW5nVG9VaW50OEFycmF5KFwiLS1cXHJcXG5cXHJcXG5cIiwgXCJ1dGYtOFwiKSxcbiAgICBdO1xuICAgIGNvbnN0IGNvbnRlbnRMZW5ndGggPSBnZXRUb3RhbExlbmd0aChzb3VyY2VzKTtcbiAgICBpZiAoY29udGVudExlbmd0aCkge1xuICAgICAgICByZXF1ZXN0LmhlYWRlcnMuc2V0KFwiQ29udGVudC1MZW5ndGhcIiwgY29udGVudExlbmd0aCk7XG4gICAgfVxuICAgIHJlcXVlc3QuYm9keSA9IGF3YWl0IGNvbmNhdChzb3VyY2VzKTtcbn1cbi8qKlxuICogTmFtZSBvZiBtdWx0aXBhcnQgcG9saWN5XG4gKi9cbmV4cG9ydCBjb25zdCBtdWx0aXBhcnRQb2xpY3lOYW1lID0gXCJtdWx0aXBhcnRQb2xpY3lcIjtcbmNvbnN0IG1heEJvdW5kYXJ5TGVuZ3RoID0gNzA7XG5jb25zdCB2YWxpZEJvdW5kYXJ5Q2hhcmFjdGVycyA9IG5ldyBTZXQoYGFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6QUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVowMTIzNDU2Nzg5JygpKywtLi86PT9gKTtcbmZ1bmN0aW9uIGFzc2VydFZhbGlkQm91bmRhcnkoYm91bmRhcnkpIHtcbiAgICBpZiAoYm91bmRhcnkubGVuZ3RoID4gbWF4Qm91bmRhcnlMZW5ndGgpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBNdWx0aXBhcnQgYm91bmRhcnkgXCIke2JvdW5kYXJ5fVwiIGV4Y2VlZHMgbWF4aW11bSBsZW5ndGggb2YgNzAgY2hhcmFjdGVyc2ApO1xuICAgIH1cbiAgICBpZiAoQXJyYXkuZnJvbShib3VuZGFyeSkuc29tZSgoeCkgPT4gIXZhbGlkQm91bmRhcnlDaGFyYWN0ZXJzLmhhcyh4KSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBNdWx0aXBhcnQgYm91bmRhcnkgXCIke2JvdW5kYXJ5fVwiIGNvbnRhaW5zIGludmFsaWQgY2hhcmFjdGVyc2ApO1xuICAgIH1cbn1cbi8qKlxuICogUGlwZWxpbmUgcG9saWN5IGZvciBtdWx0aXBhcnQgcmVxdWVzdHNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG11bHRpcGFydFBvbGljeSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBuYW1lOiBtdWx0aXBhcnRQb2xpY3lOYW1lLFxuICAgICAgICBhc3luYyBzZW5kUmVxdWVzdChyZXF1ZXN0LCBuZXh0KSB7XG4gICAgICAgICAgICB2YXIgX2E7XG4gICAgICAgICAgICBpZiAoIXJlcXVlc3QubXVsdGlwYXJ0Qm9keSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXh0KHJlcXVlc3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHJlcXVlc3QuYm9keSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm11bHRpcGFydEJvZHkgYW5kIHJlZ3VsYXIgYm9keSBjYW5ub3QgYmUgc2V0IGF0IHRoZSBzYW1lIHRpbWVcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgYm91bmRhcnkgPSByZXF1ZXN0Lm11bHRpcGFydEJvZHkuYm91bmRhcnk7XG4gICAgICAgICAgICBjb25zdCBjb250ZW50VHlwZUhlYWRlciA9IChfYSA9IHJlcXVlc3QuaGVhZGVycy5nZXQoXCJDb250ZW50LVR5cGVcIikpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IFwibXVsdGlwYXJ0L21peGVkXCI7XG4gICAgICAgICAgICBjb25zdCBwYXJzZWRIZWFkZXIgPSBjb250ZW50VHlwZUhlYWRlci5tYXRjaCgvXihtdWx0aXBhcnRcXC9bXiA7XSspKD86OyAqYm91bmRhcnk9KC4rKSk/JC8pO1xuICAgICAgICAgICAgaWYgKCFwYXJzZWRIZWFkZXIpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEdvdCBtdWx0aXBhcnQgcmVxdWVzdCBib2R5LCBidXQgY29udGVudC10eXBlIGhlYWRlciB3YXMgbm90IG11bHRpcGFydDogJHtjb250ZW50VHlwZUhlYWRlcn1gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IFssIGNvbnRlbnRUeXBlLCBwYXJzZWRCb3VuZGFyeV0gPSBwYXJzZWRIZWFkZXI7XG4gICAgICAgICAgICBpZiAocGFyc2VkQm91bmRhcnkgJiYgYm91bmRhcnkgJiYgcGFyc2VkQm91bmRhcnkgIT09IGJvdW5kYXJ5KSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBNdWx0aXBhcnQgYm91bmRhcnkgd2FzIHNwZWNpZmllZCBhcyAke3BhcnNlZEJvdW5kYXJ5fSBpbiB0aGUgaGVhZGVyLCBidXQgZ290ICR7Ym91bmRhcnl9IGluIHRoZSByZXF1ZXN0IGJvZHlgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJvdW5kYXJ5ICE9PSBudWxsICYmIGJvdW5kYXJ5ICE9PSB2b2lkIDAgPyBib3VuZGFyeSA6IChib3VuZGFyeSA9IHBhcnNlZEJvdW5kYXJ5KTtcbiAgICAgICAgICAgIGlmIChib3VuZGFyeSkge1xuICAgICAgICAgICAgICAgIGFzc2VydFZhbGlkQm91bmRhcnkoYm91bmRhcnkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgYm91bmRhcnkgPSBnZW5lcmF0ZUJvdW5kYXJ5KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXF1ZXN0LmhlYWRlcnMuc2V0KFwiQ29udGVudC1UeXBlXCIsIGAke2NvbnRlbnRUeXBlfTsgYm91bmRhcnk9JHtib3VuZGFyeX1gKTtcbiAgICAgICAgICAgIGF3YWl0IGJ1aWxkUmVxdWVzdEJvZHkocmVxdWVzdCwgcmVxdWVzdC5tdWx0aXBhcnRCb2R5LnBhcnRzLCBib3VuZGFyeSk7XG4gICAgICAgICAgICByZXF1ZXN0Lm11bHRpcGFydEJvZHkgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICByZXR1cm4gbmV4dChyZXF1ZXN0KTtcbiAgICAgICAgfSxcbiAgICB9O1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bXVsdGlwYXJ0UG9saWN5LmpzLm1hcCIsIi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuLyoqXG4gKiBUaGUgcHJvZ3JhbW1hdGljIGlkZW50aWZpZXIgb2YgdGhlIG5kSnNvblBvbGljeS5cbiAqL1xuZXhwb3J0IGNvbnN0IG5kSnNvblBvbGljeU5hbWUgPSBcIm5kSnNvblBvbGljeVwiO1xuLyoqXG4gKiBuZEpzb25Qb2xpY3kgaXMgYSBwb2xpY3kgdXNlZCB0byBjb250cm9sIGtlZXAgYWxpdmUgc2V0dGluZ3MgZm9yIGV2ZXJ5IHJlcXVlc3QuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBuZEpzb25Qb2xpY3koKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgbmFtZTogbmRKc29uUG9saWN5TmFtZSxcbiAgICAgICAgYXN5bmMgc2VuZFJlcXVlc3QocmVxdWVzdCwgbmV4dCkge1xuICAgICAgICAgICAgLy8gVGhlcmUgY3VycmVudGx5IGlzbid0IGEgZ29vZCB3YXkgdG8gYnlwYXNzIHRoZSBzZXJpYWxpemVyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHJlcXVlc3QuYm9keSA9PT0gXCJzdHJpbmdcIiAmJiByZXF1ZXN0LmJvZHkuc3RhcnRzV2l0aChcIltcIikpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBib2R5ID0gSlNPTi5wYXJzZShyZXF1ZXN0LmJvZHkpO1xuICAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGJvZHkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlcXVlc3QuYm9keSA9IGJvZHkubWFwKChpdGVtKSA9PiBKU09OLnN0cmluZ2lmeShpdGVtKSArIFwiXFxuXCIpLmpvaW4oXCJcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG5leHQocmVxdWVzdCk7XG4gICAgICAgIH0sXG4gICAgfTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW5kSnNvblBvbGljeS5qcy5tYXAiLCIvLyBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi5cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbi8qXG4gKiBOT1RFOiBXaGVuIG1vdmluZyB0aGlzIGZpbGUsIHBsZWFzZSB1cGRhdGUgXCJicm93c2VyXCIgc2VjdGlvbiBpbiBwYWNrYWdlLmpzb25cbiAqL1xuZXhwb3J0IGNvbnN0IHByb3h5UG9saWN5TmFtZSA9IFwicHJveHlQb2xpY3lcIjtcbmNvbnN0IGVycm9yTWVzc2FnZSA9IFwicHJveHlQb2xpY3kgaXMgbm90IHN1cHBvcnRlZCBpbiBicm93c2VyIGVudmlyb25tZW50XCI7XG5leHBvcnQgZnVuY3Rpb24gZ2V0RGVmYXVsdFByb3h5U2V0dGluZ3MoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGVycm9yTWVzc2FnZSk7XG59XG4vKipcbiAqIHByb3h5UG9saWN5IGlzIG5vdCBzdXBwb3J0ZWQgaW4gdGhlIGJyb3dzZXIgYW5kIGF0dGVtcHRpbmdcbiAqIHRvIHVzZSBpdCB3aWxsIHJhaXNlIGFuIGVycm9yLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcHJveHlQb2xpY3koKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGVycm9yTWVzc2FnZSk7XG59XG4vKipcbiAqIEEgZnVuY3Rpb24gdG8gcmVzZXQgdGhlIGNhY2hlZCBhZ2VudHMuXG4gKiBwcm94eVBvbGljeSBpcyBub3Qgc3VwcG9ydGVkIGluIHRoZSBicm93c2VyIGFuZCBhdHRlbXB0aW5nXG4gKiB0byB1c2UgaXQgd2lsbCByYWlzZSBhbiBlcnJvci5cbiAqIEBpbnRlcm5hbFxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVzZXRDYWNoZWRQcm94eUFnZW50cygpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3JNZXNzYWdlKTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXByb3h5UG9saWN5LWJyb3dzZXIubWpzLm1hcCIsIi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuLyoqXG4gKiBUaGUgcHJvZ3JhbW1hdGljIGlkZW50aWZpZXIgb2YgdGhlIHJlZGlyZWN0UG9saWN5LlxuICovXG5leHBvcnQgY29uc3QgcmVkaXJlY3RQb2xpY3lOYW1lID0gXCJyZWRpcmVjdFBvbGljeVwiO1xuLyoqXG4gKiBNZXRob2RzIHRoYXQgYXJlIGFsbG93ZWQgdG8gZm9sbG93IHJlZGlyZWN0cyAzMDEgYW5kIDMwMlxuICovXG5jb25zdCBhbGxvd2VkUmVkaXJlY3QgPSBbXCJHRVRcIiwgXCJIRUFEXCJdO1xuLyoqXG4gKiBBIHBvbGljeSB0byBmb2xsb3cgTG9jYXRpb24gaGVhZGVycyBmcm9tIHRoZSBzZXJ2ZXIgaW4gb3JkZXJcbiAqIHRvIHN1cHBvcnQgc2VydmVyLXNpZGUgcmVkaXJlY3Rpb24uXG4gKiBJbiB0aGUgYnJvd3NlciwgdGhpcyBwb2xpY3kgaXMgbm90IHVzZWQuXG4gKiBAcGFyYW0gb3B0aW9ucyAtIE9wdGlvbnMgdG8gY29udHJvbCBwb2xpY3kgYmVoYXZpb3IuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZWRpcmVjdFBvbGljeShvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCB7IG1heFJldHJpZXMgPSAyMCB9ID0gb3B0aW9ucztcbiAgICByZXR1cm4ge1xuICAgICAgICBuYW1lOiByZWRpcmVjdFBvbGljeU5hbWUsXG4gICAgICAgIGFzeW5jIHNlbmRSZXF1ZXN0KHJlcXVlc3QsIG5leHQpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgbmV4dChyZXF1ZXN0KTtcbiAgICAgICAgICAgIHJldHVybiBoYW5kbGVSZWRpcmVjdChuZXh0LCByZXNwb25zZSwgbWF4UmV0cmllcyk7XG4gICAgICAgIH0sXG4gICAgfTtcbn1cbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZVJlZGlyZWN0KG5leHQsIHJlc3BvbnNlLCBtYXhSZXRyaWVzLCBjdXJyZW50UmV0cmllcyA9IDApIHtcbiAgICBjb25zdCB7IHJlcXVlc3QsIHN0YXR1cywgaGVhZGVycyB9ID0gcmVzcG9uc2U7XG4gICAgY29uc3QgbG9jYXRpb25IZWFkZXIgPSBoZWFkZXJzLmdldChcImxvY2F0aW9uXCIpO1xuICAgIGlmIChsb2NhdGlvbkhlYWRlciAmJlxuICAgICAgICAoc3RhdHVzID09PSAzMDAgfHxcbiAgICAgICAgICAgIChzdGF0dXMgPT09IDMwMSAmJiBhbGxvd2VkUmVkaXJlY3QuaW5jbHVkZXMocmVxdWVzdC5tZXRob2QpKSB8fFxuICAgICAgICAgICAgKHN0YXR1cyA9PT0gMzAyICYmIGFsbG93ZWRSZWRpcmVjdC5pbmNsdWRlcyhyZXF1ZXN0Lm1ldGhvZCkpIHx8XG4gICAgICAgICAgICAoc3RhdHVzID09PSAzMDMgJiYgcmVxdWVzdC5tZXRob2QgPT09IFwiUE9TVFwiKSB8fFxuICAgICAgICAgICAgc3RhdHVzID09PSAzMDcpICYmXG4gICAgICAgIGN1cnJlbnRSZXRyaWVzIDwgbWF4UmV0cmllcykge1xuICAgICAgICBjb25zdCB1cmwgPSBuZXcgVVJMKGxvY2F0aW9uSGVhZGVyLCByZXF1ZXN0LnVybCk7XG4gICAgICAgIHJlcXVlc3QudXJsID0gdXJsLnRvU3RyaW5nKCk7XG4gICAgICAgIC8vIFBPU1QgcmVxdWVzdCB3aXRoIFN0YXR1cyBjb2RlIDMwMyBzaG91bGQgYmUgY29udmVydGVkIGludG8gYVxuICAgICAgICAvLyByZWRpcmVjdGVkIEdFVCByZXF1ZXN0IGlmIHRoZSByZWRpcmVjdCB1cmwgaXMgcHJlc2VudCBpbiB0aGUgbG9jYXRpb24gaGVhZGVyXG4gICAgICAgIGlmIChzdGF0dXMgPT09IDMwMykge1xuICAgICAgICAgICAgcmVxdWVzdC5tZXRob2QgPSBcIkdFVFwiO1xuICAgICAgICAgICAgcmVxdWVzdC5oZWFkZXJzLmRlbGV0ZShcIkNvbnRlbnQtTGVuZ3RoXCIpO1xuICAgICAgICAgICAgZGVsZXRlIHJlcXVlc3QuYm9keTtcbiAgICAgICAgfVxuICAgICAgICByZXF1ZXN0LmhlYWRlcnMuZGVsZXRlKFwiQXV0aG9yaXphdGlvblwiKTtcbiAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgbmV4dChyZXF1ZXN0KTtcbiAgICAgICAgcmV0dXJuIGhhbmRsZVJlZGlyZWN0KG5leHQsIHJlcywgbWF4UmV0cmllcywgY3VycmVudFJldHJpZXMgKyAxKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3BvbnNlO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cmVkaXJlY3RQb2xpY3kuanMubWFwIiwiLy8gQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG5pbXBvcnQgeyBkZWxheSB9IGZyb20gXCIuLi91dGlsL2hlbHBlcnMuanNcIjtcbmltcG9ydCB7IGNyZWF0ZUNsaWVudExvZ2dlciB9IGZyb20gXCJAYXp1cmUvbG9nZ2VyXCI7XG5pbXBvcnQgeyBBYm9ydEVycm9yIH0gZnJvbSBcIkBhenVyZS9hYm9ydC1jb250cm9sbGVyXCI7XG5pbXBvcnQgeyBERUZBVUxUX1JFVFJZX1BPTElDWV9DT1VOVCB9IGZyb20gXCIuLi9jb25zdGFudHMuanNcIjtcbmNvbnN0IHJldHJ5UG9saWN5TG9nZ2VyID0gY3JlYXRlQ2xpZW50TG9nZ2VyKFwiY29yZS1yZXN0LXBpcGVsaW5lIHJldHJ5UG9saWN5XCIpO1xuLyoqXG4gKiBUaGUgcHJvZ3JhbW1hdGljIGlkZW50aWZpZXIgb2YgdGhlIHJldHJ5UG9saWN5LlxuICovXG5jb25zdCByZXRyeVBvbGljeU5hbWUgPSBcInJldHJ5UG9saWN5XCI7XG4vKipcbiAqIHJldHJ5UG9saWN5IGlzIGEgZ2VuZXJpYyBwb2xpY3kgdG8gZW5hYmxlIHJldHJ5aW5nIHJlcXVlc3RzIHdoZW4gY2VydGFpbiBjb25kaXRpb25zIGFyZSBtZXRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJldHJ5UG9saWN5KHN0cmF0ZWdpZXMsIG9wdGlvbnMgPSB7IG1heFJldHJpZXM6IERFRkFVTFRfUkVUUllfUE9MSUNZX0NPVU5UIH0pIHtcbiAgICBjb25zdCBsb2dnZXIgPSBvcHRpb25zLmxvZ2dlciB8fCByZXRyeVBvbGljeUxvZ2dlcjtcbiAgICByZXR1cm4ge1xuICAgICAgICBuYW1lOiByZXRyeVBvbGljeU5hbWUsXG4gICAgICAgIGFzeW5jIHNlbmRSZXF1ZXN0KHJlcXVlc3QsIG5leHQpIHtcbiAgICAgICAgICAgIHZhciBfYSwgX2I7XG4gICAgICAgICAgICBsZXQgcmVzcG9uc2U7XG4gICAgICAgICAgICBsZXQgcmVzcG9uc2VFcnJvcjtcbiAgICAgICAgICAgIGxldCByZXRyeUNvdW50ID0gLTE7XG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc3RhbnQtY29uZGl0aW9uXG4gICAgICAgICAgICByZXRyeVJlcXVlc3Q6IHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICAgICAgcmV0cnlDb3VudCArPSAxO1xuICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIHJlc3BvbnNlRXJyb3IgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oYFJldHJ5ICR7cmV0cnlDb3VudH06IEF0dGVtcHRpbmcgdG8gc2VuZCByZXF1ZXN0YCwgcmVxdWVzdC5yZXF1ZXN0SWQpO1xuICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IGF3YWl0IG5leHQocmVxdWVzdCk7XG4gICAgICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKGBSZXRyeSAke3JldHJ5Q291bnR9OiBSZWNlaXZlZCBhIHJlc3BvbnNlIGZyb20gcmVxdWVzdGAsIHJlcXVlc3QucmVxdWVzdElkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGBSZXRyeSAke3JldHJ5Q291bnR9OiBSZWNlaXZlZCBhbiBlcnJvciBmcm9tIHJlcXVlc3RgLCByZXF1ZXN0LnJlcXVlc3RJZCk7XG4gICAgICAgICAgICAgICAgICAgIC8vIFJlc3RFcnJvcnMgYXJlIHZhbGlkIHRhcmdldHMgZm9yIHRoZSByZXRyeSBzdHJhdGVnaWVzLlxuICAgICAgICAgICAgICAgICAgICAvLyBJZiBub25lIG9mIHRoZSByZXRyeSBzdHJhdGVnaWVzIGNhbiB3b3JrIHdpdGggdGhlbSwgdGhleSB3aWxsIGJlIHRocm93biBsYXRlciBpbiB0aGlzIHBvbGljeS5cbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgdGhlIHJlY2VpdmVkIGVycm9yIGlzIG5vdCBhIFJlc3RFcnJvciwgaXQgaXMgaW1tZWRpYXRlbHkgdGhyb3duLlxuICAgICAgICAgICAgICAgICAgICByZXNwb25zZUVycm9yID0gZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFlIHx8IHJlc3BvbnNlRXJyb3IubmFtZSAhPT0gXCJSZXN0RXJyb3JcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IHJlc3BvbnNlRXJyb3IucmVzcG9uc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICgoX2EgPSByZXF1ZXN0LmFib3J0U2lnbmFsKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuYWJvcnRlZCkge1xuICAgICAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoYFJldHJ5ICR7cmV0cnlDb3VudH06IFJlcXVlc3QgYWJvcnRlZC5gKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYWJvcnRFcnJvciA9IG5ldyBBYm9ydEVycm9yKCk7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IGFib3J0RXJyb3I7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChyZXRyeUNvdW50ID49ICgoX2IgPSBvcHRpb25zLm1heFJldHJpZXMpICE9PSBudWxsICYmIF9iICE9PSB2b2lkIDAgPyBfYiA6IERFRkFVTFRfUkVUUllfUE9MSUNZX0NPVU5UKSkge1xuICAgICAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhgUmV0cnkgJHtyZXRyeUNvdW50fTogTWF4aW11bSByZXRyaWVzIHJlYWNoZWQuIFJldHVybmluZyB0aGUgbGFzdCByZWNlaXZlZCByZXNwb25zZSwgb3IgdGhyb3dpbmcgdGhlIGxhc3QgcmVjZWl2ZWQgZXJyb3IuYCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZUVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyByZXNwb25zZUVycm9yO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNYXhpbXVtIHJldHJpZXMgcmVhY2hlZCB3aXRoIG5vIHJlc3BvbnNlIG9yIGVycm9yIHRvIHRocm93XCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKGBSZXRyeSAke3JldHJ5Q291bnR9OiBQcm9jZXNzaW5nICR7c3RyYXRlZ2llcy5sZW5ndGh9IHJldHJ5IHN0cmF0ZWdpZXMuYCk7XG4gICAgICAgICAgICAgICAgc3RyYXRlZ2llc0xvb3A6IGZvciAoY29uc3Qgc3RyYXRlZ3kgb2Ygc3RyYXRlZ2llcykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBzdHJhdGVneUxvZ2dlciA9IHN0cmF0ZWd5LmxvZ2dlciB8fCByZXRyeVBvbGljeUxvZ2dlcjtcbiAgICAgICAgICAgICAgICAgICAgc3RyYXRlZ3lMb2dnZXIuaW5mbyhgUmV0cnkgJHtyZXRyeUNvdW50fTogUHJvY2Vzc2luZyByZXRyeSBzdHJhdGVneSAke3N0cmF0ZWd5Lm5hbWV9LmApO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBtb2RpZmllcnMgPSBzdHJhdGVneS5yZXRyeSh7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXRyeUNvdW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZUVycm9yLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1vZGlmaWVycy5za2lwU3RyYXRlZ3kpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0cmF0ZWd5TG9nZ2VyLmluZm8oYFJldHJ5ICR7cmV0cnlDb3VudH06IFNraXBwZWQuYCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZSBzdHJhdGVnaWVzTG9vcDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjb25zdCB7IGVycm9yVG9UaHJvdywgcmV0cnlBZnRlckluTXMsIHJlZGlyZWN0VG8gfSA9IG1vZGlmaWVycztcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVycm9yVG9UaHJvdykge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RyYXRlZ3lMb2dnZXIuZXJyb3IoYFJldHJ5ICR7cmV0cnlDb3VudH06IFJldHJ5IHN0cmF0ZWd5ICR7c3RyYXRlZ3kubmFtZX0gdGhyb3dzIGVycm9yOmAsIGVycm9yVG9UaHJvdyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnJvclRvVGhyb3c7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHJldHJ5QWZ0ZXJJbk1zIHx8IHJldHJ5QWZ0ZXJJbk1zID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdHJhdGVneUxvZ2dlci5pbmZvKGBSZXRyeSAke3JldHJ5Q291bnR9OiBSZXRyeSBzdHJhdGVneSAke3N0cmF0ZWd5Lm5hbWV9IHJldHJpZXMgYWZ0ZXIgJHtyZXRyeUFmdGVySW5Nc31gKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IGRlbGF5KHJldHJ5QWZ0ZXJJbk1zLCB1bmRlZmluZWQsIHsgYWJvcnRTaWduYWw6IHJlcXVlc3QuYWJvcnRTaWduYWwgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZSByZXRyeVJlcXVlc3Q7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlZGlyZWN0VG8pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0cmF0ZWd5TG9nZ2VyLmluZm8oYFJldHJ5ICR7cmV0cnlDb3VudH06IFJldHJ5IHN0cmF0ZWd5ICR7c3RyYXRlZ3kubmFtZX0gcmVkaXJlY3RzIHRvICR7cmVkaXJlY3RUb31gKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVlc3QudXJsID0gcmVkaXJlY3RUbztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlIHJldHJ5UmVxdWVzdDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2VFcnJvcikge1xuICAgICAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhgTm9uZSBvZiB0aGUgcmV0cnkgc3RyYXRlZ2llcyBjb3VsZCB3b3JrIHdpdGggdGhlIHJlY2VpdmVkIGVycm9yLiBUaHJvd2luZyBpdC5gKTtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgcmVzcG9uc2VFcnJvcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKGBOb25lIG9mIHRoZSByZXRyeSBzdHJhdGVnaWVzIGNvdWxkIHdvcmsgd2l0aCB0aGUgcmVjZWl2ZWQgcmVzcG9uc2UuIFJldHVybmluZyBpdC5gKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBJZiBhbGwgdGhlIHJldHJpZXMgc2tpcCBhbmQgdGhlcmUncyBubyByZXNwb25zZSxcbiAgICAgICAgICAgICAgICAvLyB3ZSdyZSBzdGlsbCBpbiB0aGUgcmV0cnkgbG9vcCwgc28gYSBuZXcgcmVxdWVzdCB3aWxsIGJlIHNlbnRcbiAgICAgICAgICAgICAgICAvLyB1bnRpbCBgbWF4UmV0cmllc2AgaXMgcmVhY2hlZC5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICB9O1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cmV0cnlQb2xpY3kuanMubWFwIiwiLy8gQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4vKipcbiAqIFRoZSBwcm9ncmFtbWF0aWMgaWRlbnRpZmllciBvZiB0aGUgc2V0Q2xpZW50UmVxdWVzdElkUG9saWN5LlxuICovXG5leHBvcnQgY29uc3Qgc2V0Q2xpZW50UmVxdWVzdElkUG9saWN5TmFtZSA9IFwic2V0Q2xpZW50UmVxdWVzdElkUG9saWN5XCI7XG4vKipcbiAqIEVhY2ggUGlwZWxpbmVSZXF1ZXN0IGdldHMgYSB1bmlxdWUgaWQgdXBvbiBjcmVhdGlvbi5cbiAqIFRoaXMgcG9saWN5IHBhc3NlcyB0aGF0IHVuaXF1ZSBpZCBhbG9uZyB2aWEgYW4gSFRUUCBoZWFkZXIgdG8gZW5hYmxlIGJldHRlclxuICogdGVsZW1ldHJ5IGFuZCB0cmFjaW5nLlxuICogQHBhcmFtIHJlcXVlc3RJZEhlYWRlck5hbWUgLSBUaGUgbmFtZSBvZiB0aGUgaGVhZGVyIHRvIHBhc3MgdGhlIHJlcXVlc3QgSUQgdG8uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXRDbGllbnRSZXF1ZXN0SWRQb2xpY3kocmVxdWVzdElkSGVhZGVyTmFtZSA9IFwieC1tcy1jbGllbnQtcmVxdWVzdC1pZFwiKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgbmFtZTogc2V0Q2xpZW50UmVxdWVzdElkUG9saWN5TmFtZSxcbiAgICAgICAgYXN5bmMgc2VuZFJlcXVlc3QocmVxdWVzdCwgbmV4dCkge1xuICAgICAgICAgICAgaWYgKCFyZXF1ZXN0LmhlYWRlcnMuaGFzKHJlcXVlc3RJZEhlYWRlck5hbWUpKSB7XG4gICAgICAgICAgICAgICAgcmVxdWVzdC5oZWFkZXJzLnNldChyZXF1ZXN0SWRIZWFkZXJOYW1lLCByZXF1ZXN0LnJlcXVlc3RJZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbmV4dChyZXF1ZXN0KTtcbiAgICAgICAgfSxcbiAgICB9O1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c2V0Q2xpZW50UmVxdWVzdElkUG9saWN5LmpzLm1hcCIsIi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuaW1wb3J0IHsgZXhwb25lbnRpYWxSZXRyeVN0cmF0ZWd5IH0gZnJvbSBcIi4uL3JldHJ5U3RyYXRlZ2llcy9leHBvbmVudGlhbFJldHJ5U3RyYXRlZ3kuanNcIjtcbmltcG9ydCB7IHJldHJ5UG9saWN5IH0gZnJvbSBcIi4vcmV0cnlQb2xpY3kuanNcIjtcbmltcG9ydCB7IERFRkFVTFRfUkVUUllfUE9MSUNZX0NPVU5UIH0gZnJvbSBcIi4uL2NvbnN0YW50cy5qc1wiO1xuLyoqXG4gKiBOYW1lIG9mIHRoZSB7QGxpbmsgc3lzdGVtRXJyb3JSZXRyeVBvbGljeX1cbiAqL1xuZXhwb3J0IGNvbnN0IHN5c3RlbUVycm9yUmV0cnlQb2xpY3lOYW1lID0gXCJzeXN0ZW1FcnJvclJldHJ5UG9saWN5XCI7XG4vKipcbiAqIEEgcmV0cnkgcG9saWN5IHRoYXQgc3BlY2lmaWNhbGx5IHNlZWtzIHRvIGhhbmRsZSBlcnJvcnMgaW4gdGhlXG4gKiB1bmRlcmx5aW5nIHRyYW5zcG9ydCBsYXllciAoZS5nLiBETlMgbG9va3VwIGZhaWx1cmVzKSByYXRoZXIgdGhhblxuICogcmV0cnlhYmxlIGVycm9yIGNvZGVzIGZyb20gdGhlIHNlcnZlciBpdHNlbGYuXG4gKiBAcGFyYW0gb3B0aW9ucyAtIE9wdGlvbnMgdGhhdCBjdXN0b21pemUgdGhlIHBvbGljeS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHN5c3RlbUVycm9yUmV0cnlQb2xpY3kob3B0aW9ucyA9IHt9KSB7XG4gICAgdmFyIF9hO1xuICAgIHJldHVybiB7XG4gICAgICAgIG5hbWU6IHN5c3RlbUVycm9yUmV0cnlQb2xpY3lOYW1lLFxuICAgICAgICBzZW5kUmVxdWVzdDogcmV0cnlQb2xpY3koW1xuICAgICAgICAgICAgZXhwb25lbnRpYWxSZXRyeVN0cmF0ZWd5KE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucyksIHsgaWdub3JlSHR0cFN0YXR1c0NvZGVzOiB0cnVlIH0pKSxcbiAgICAgICAgXSwge1xuICAgICAgICAgICAgbWF4UmV0cmllczogKF9hID0gb3B0aW9ucy5tYXhSZXRyaWVzKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBERUZBVUxUX1JFVFJZX1BPTElDWV9DT1VOVCxcbiAgICAgICAgfSkuc2VuZFJlcXVlc3QsXG4gICAgfTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXN5c3RlbUVycm9yUmV0cnlQb2xpY3kuanMubWFwIiwiLy8gQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG5pbXBvcnQgeyB0aHJvdHRsaW5nUmV0cnlTdHJhdGVneSB9IGZyb20gXCIuLi9yZXRyeVN0cmF0ZWdpZXMvdGhyb3R0bGluZ1JldHJ5U3RyYXRlZ3kuanNcIjtcbmltcG9ydCB7IHJldHJ5UG9saWN5IH0gZnJvbSBcIi4vcmV0cnlQb2xpY3kuanNcIjtcbmltcG9ydCB7IERFRkFVTFRfUkVUUllfUE9MSUNZX0NPVU5UIH0gZnJvbSBcIi4uL2NvbnN0YW50cy5qc1wiO1xuLyoqXG4gKiBOYW1lIG9mIHRoZSB7QGxpbmsgdGhyb3R0bGluZ1JldHJ5UG9saWN5fVxuICovXG5leHBvcnQgY29uc3QgdGhyb3R0bGluZ1JldHJ5UG9saWN5TmFtZSA9IFwidGhyb3R0bGluZ1JldHJ5UG9saWN5XCI7XG4vKipcbiAqIEEgcG9saWN5IHRoYXQgcmV0cmllcyB3aGVuIHRoZSBzZXJ2ZXIgc2VuZHMgYSA0MjkgcmVzcG9uc2Ugd2l0aCBhIFJldHJ5LUFmdGVyIGhlYWRlci5cbiAqXG4gKiBUbyBsZWFybiBtb3JlLCBwbGVhc2UgcmVmZXIgdG9cbiAqIGh0dHBzOi8vZG9jcy5taWNyb3NvZnQuY29tL2VuLXVzL2F6dXJlL2F6dXJlLXJlc291cmNlLW1hbmFnZXIvcmVzb3VyY2UtbWFuYWdlci1yZXF1ZXN0LWxpbWl0cyxcbiAqIGh0dHBzOi8vZG9jcy5taWNyb3NvZnQuY29tL2VuLXVzL2F6dXJlL2F6dXJlLXN1YnNjcmlwdGlvbi1zZXJ2aWNlLWxpbWl0cyBhbmRcbiAqIGh0dHBzOi8vZG9jcy5taWNyb3NvZnQuY29tL2VuLXVzL2F6dXJlL3ZpcnR1YWwtbWFjaGluZXMvdHJvdWJsZXNob290aW5nL3Ryb3VibGVzaG9vdGluZy10aHJvdHRsaW5nLWVycm9yc1xuICpcbiAqIEBwYXJhbSBvcHRpb25zIC0gT3B0aW9ucyB0aGF0IGNvbmZpZ3VyZSByZXRyeSBsb2dpYy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRocm90dGxpbmdSZXRyeVBvbGljeShvcHRpb25zID0ge30pIHtcbiAgICB2YXIgX2E7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgbmFtZTogdGhyb3R0bGluZ1JldHJ5UG9saWN5TmFtZSxcbiAgICAgICAgc2VuZFJlcXVlc3Q6IHJldHJ5UG9saWN5KFt0aHJvdHRsaW5nUmV0cnlTdHJhdGVneSgpXSwge1xuICAgICAgICAgICAgbWF4UmV0cmllczogKF9hID0gb3B0aW9ucy5tYXhSZXRyaWVzKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBERUZBVUxUX1JFVFJZX1BPTElDWV9DT1VOVCxcbiAgICAgICAgfSkuc2VuZFJlcXVlc3QsXG4gICAgfTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRocm90dGxpbmdSZXRyeVBvbGljeS5qcy5tYXAiLCIvLyBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi5cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbi8qKlxuICogTmFtZSBvZiB0aGUgVExTIFBvbGljeVxuICovXG5leHBvcnQgY29uc3QgdGxzUG9saWN5TmFtZSA9IFwidGxzUG9saWN5XCI7XG4vKipcbiAqIEdldHMgYSBwaXBlbGluZSBwb2xpY3kgdGhhdCBhZGRzIHRoZSBjbGllbnQgY2VydGlmaWNhdGUgdG8gdGhlIEh0dHBDbGllbnQgYWdlbnQgZm9yIGF1dGhlbnRpY2F0aW9uLlxuICovXG5leHBvcnQgZnVuY3Rpb24gdGxzUG9saWN5KHRsc1NldHRpbmdzKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgbmFtZTogdGxzUG9saWN5TmFtZSxcbiAgICAgICAgc2VuZFJlcXVlc3Q6IGFzeW5jIChyZXEsIG5leHQpID0+IHtcbiAgICAgICAgICAgIC8vIFVzZXJzIG1heSBkZWZpbmUgYSByZXF1ZXN0IHRsc1NldHRpbmdzLCBob25vciB0aG9zZSBvdmVyIHRoZSBjbGllbnQgbGV2ZWwgb25lXG4gICAgICAgICAgICBpZiAoIXJlcS50bHNTZXR0aW5ncykge1xuICAgICAgICAgICAgICAgIHJlcS50bHNTZXR0aW5ncyA9IHRsc1NldHRpbmdzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG5leHQocmVxKTtcbiAgICAgICAgfSxcbiAgICB9O1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dGxzUG9saWN5LmpzLm1hcCIsIi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuaW1wb3J0IHsgY3JlYXRlVHJhY2luZ0NsaWVudCwgfSBmcm9tIFwiQGF6dXJlL2NvcmUtdHJhY2luZ1wiO1xuaW1wb3J0IHsgU0RLX1ZFUlNJT04gfSBmcm9tIFwiLi4vY29uc3RhbnRzLmpzXCI7XG5pbXBvcnQgeyBnZXRVc2VyQWdlbnRWYWx1ZSB9IGZyb20gXCIuLi91dGlsL3VzZXJBZ2VudC5qc1wiO1xuaW1wb3J0IHsgbG9nZ2VyIH0gZnJvbSBcIi4uL2xvZy5qc1wiO1xuaW1wb3J0IHsgZ2V0RXJyb3JNZXNzYWdlLCBpc0Vycm9yIH0gZnJvbSBcIkBhenVyZS9jb3JlLXV0aWxcIjtcbmltcG9ydCB7IGlzUmVzdEVycm9yIH0gZnJvbSBcIi4uL3Jlc3RFcnJvci5qc1wiO1xuLyoqXG4gKiBUaGUgcHJvZ3JhbW1hdGljIGlkZW50aWZpZXIgb2YgdGhlIHRyYWNpbmdQb2xpY3kuXG4gKi9cbmV4cG9ydCBjb25zdCB0cmFjaW5nUG9saWN5TmFtZSA9IFwidHJhY2luZ1BvbGljeVwiO1xuLyoqXG4gKiBBIHNpbXBsZSBwb2xpY3kgdG8gY3JlYXRlIE9wZW5UZWxlbWV0cnkgU3BhbnMgZm9yIGVhY2ggcmVxdWVzdCBtYWRlIGJ5IHRoZSBwaXBlbGluZVxuICogdGhhdCBoYXMgU3Bhbk9wdGlvbnMgd2l0aCBhIHBhcmVudC5cbiAqIFJlcXVlc3RzIG1hZGUgd2l0aG91dCBhIHBhcmVudCBTcGFuIHdpbGwgbm90IGJlIHJlY29yZGVkLlxuICogQHBhcmFtIG9wdGlvbnMgLSBPcHRpb25zIHRvIGNvbmZpZ3VyZSB0aGUgdGVsZW1ldHJ5IGxvZ2dlZCBieSB0aGUgdHJhY2luZyBwb2xpY3kuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0cmFjaW5nUG9saWN5KG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IHVzZXJBZ2VudCA9IGdldFVzZXJBZ2VudFZhbHVlKG9wdGlvbnMudXNlckFnZW50UHJlZml4KTtcbiAgICBjb25zdCB0cmFjaW5nQ2xpZW50ID0gdHJ5Q3JlYXRlVHJhY2luZ0NsaWVudCgpO1xuICAgIHJldHVybiB7XG4gICAgICAgIG5hbWU6IHRyYWNpbmdQb2xpY3lOYW1lLFxuICAgICAgICBhc3luYyBzZW5kUmVxdWVzdChyZXF1ZXN0LCBuZXh0KSB7XG4gICAgICAgICAgICB2YXIgX2EsIF9iO1xuICAgICAgICAgICAgaWYgKCF0cmFjaW5nQ2xpZW50IHx8ICEoKF9hID0gcmVxdWVzdC50cmFjaW5nT3B0aW9ucykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnRyYWNpbmdDb250ZXh0KSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXh0KHJlcXVlc3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgeyBzcGFuLCB0cmFjaW5nQ29udGV4dCB9ID0gKF9iID0gdHJ5Q3JlYXRlU3Bhbih0cmFjaW5nQ2xpZW50LCByZXF1ZXN0LCB1c2VyQWdlbnQpKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiB7fTtcbiAgICAgICAgICAgIGlmICghc3BhbiB8fCAhdHJhY2luZ0NvbnRleHQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV4dChyZXF1ZXN0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCB0cmFjaW5nQ2xpZW50LndpdGhDb250ZXh0KHRyYWNpbmdDb250ZXh0LCBuZXh0LCByZXF1ZXN0KTtcbiAgICAgICAgICAgICAgICB0cnlQcm9jZXNzUmVzcG9uc2Uoc3BhbiwgcmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICB0cnlQcm9jZXNzRXJyb3Ioc3BhbiwgZXJyKTtcbiAgICAgICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgfTtcbn1cbmZ1bmN0aW9uIHRyeUNyZWF0ZVRyYWNpbmdDbGllbnQoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZVRyYWNpbmdDbGllbnQoe1xuICAgICAgICAgICAgbmFtZXNwYWNlOiBcIlwiLFxuICAgICAgICAgICAgcGFja2FnZU5hbWU6IFwiQGF6dXJlL2NvcmUtcmVzdC1waXBlbGluZVwiLFxuICAgICAgICAgICAgcGFja2FnZVZlcnNpb246IFNES19WRVJTSU9OLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgbG9nZ2VyLndhcm5pbmcoYEVycm9yIHdoZW4gY3JlYXRpbmcgdGhlIFRyYWNpbmdDbGllbnQ6ICR7Z2V0RXJyb3JNZXNzYWdlKGUpfWApO1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHRyeUNyZWF0ZVNwYW4odHJhY2luZ0NsaWVudCwgcmVxdWVzdCwgdXNlckFnZW50KSB7XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gQXMgcGVyIHNwZWMsIHdlIGRvIG5vdCBuZWVkIHRvIGRpZmZlcmVudGlhdGUgYmV0d2VlbiBIVFRQIGFuZCBIVFRQUyBpbiBzcGFuIG5hbWUuXG4gICAgICAgIGNvbnN0IHsgc3BhbiwgdXBkYXRlZE9wdGlvbnMgfSA9IHRyYWNpbmdDbGllbnQuc3RhcnRTcGFuKGBIVFRQICR7cmVxdWVzdC5tZXRob2R9YCwgeyB0cmFjaW5nT3B0aW9uczogcmVxdWVzdC50cmFjaW5nT3B0aW9ucyB9LCB7XG4gICAgICAgICAgICBzcGFuS2luZDogXCJjbGllbnRcIixcbiAgICAgICAgICAgIHNwYW5BdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgICAgICAgXCJodHRwLm1ldGhvZFwiOiByZXF1ZXN0Lm1ldGhvZCxcbiAgICAgICAgICAgICAgICBcImh0dHAudXJsXCI6IHJlcXVlc3QudXJsLFxuICAgICAgICAgICAgICAgIHJlcXVlc3RJZDogcmVxdWVzdC5yZXF1ZXN0SWQsXG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgICAgLy8gSWYgdGhlIHNwYW4gaXMgbm90IHJlY29yZGluZywgZG9uJ3QgZG8gYW55IG1vcmUgd29yay5cbiAgICAgICAgaWYgKCFzcGFuLmlzUmVjb3JkaW5nKCkpIHtcbiAgICAgICAgICAgIHNwYW4uZW5kKCk7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIGlmICh1c2VyQWdlbnQpIHtcbiAgICAgICAgICAgIHNwYW4uc2V0QXR0cmlidXRlKFwiaHR0cC51c2VyX2FnZW50XCIsIHVzZXJBZ2VudCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gc2V0IGhlYWRlcnNcbiAgICAgICAgY29uc3QgaGVhZGVycyA9IHRyYWNpbmdDbGllbnQuY3JlYXRlUmVxdWVzdEhlYWRlcnModXBkYXRlZE9wdGlvbnMudHJhY2luZ09wdGlvbnMudHJhY2luZ0NvbnRleHQpO1xuICAgICAgICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhoZWFkZXJzKSkge1xuICAgICAgICAgICAgcmVxdWVzdC5oZWFkZXJzLnNldChrZXksIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geyBzcGFuLCB0cmFjaW5nQ29udGV4dDogdXBkYXRlZE9wdGlvbnMudHJhY2luZ09wdGlvbnMudHJhY2luZ0NvbnRleHQgfTtcbiAgICB9XG4gICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgbG9nZ2VyLndhcm5pbmcoYFNraXBwaW5nIGNyZWF0aW5nIGEgdHJhY2luZyBzcGFuIGR1ZSB0byBhbiBlcnJvcjogJHtnZXRFcnJvck1lc3NhZ2UoZSl9YCk7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxufVxuZnVuY3Rpb24gdHJ5UHJvY2Vzc0Vycm9yKHNwYW4sIGVycm9yKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgc3Bhbi5zZXRTdGF0dXMoe1xuICAgICAgICAgICAgc3RhdHVzOiBcImVycm9yXCIsXG4gICAgICAgICAgICBlcnJvcjogaXNFcnJvcihlcnJvcikgPyBlcnJvciA6IHVuZGVmaW5lZCxcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChpc1Jlc3RFcnJvcihlcnJvcikgJiYgZXJyb3Iuc3RhdHVzQ29kZSkge1xuICAgICAgICAgICAgc3Bhbi5zZXRBdHRyaWJ1dGUoXCJodHRwLnN0YXR1c19jb2RlXCIsIGVycm9yLnN0YXR1c0NvZGUpO1xuICAgICAgICB9XG4gICAgICAgIHNwYW4uZW5kKCk7XG4gICAgfVxuICAgIGNhdGNoIChlKSB7XG4gICAgICAgIGxvZ2dlci53YXJuaW5nKGBTa2lwcGluZyB0cmFjaW5nIHNwYW4gcHJvY2Vzc2luZyBkdWUgdG8gYW4gZXJyb3I6ICR7Z2V0RXJyb3JNZXNzYWdlKGUpfWApO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHRyeVByb2Nlc3NSZXNwb25zZShzcGFuLCByZXNwb25zZSkge1xuICAgIHRyeSB7XG4gICAgICAgIHNwYW4uc2V0QXR0cmlidXRlKFwiaHR0cC5zdGF0dXNfY29kZVwiLCByZXNwb25zZS5zdGF0dXMpO1xuICAgICAgICBjb25zdCBzZXJ2aWNlUmVxdWVzdElkID0gcmVzcG9uc2UuaGVhZGVycy5nZXQoXCJ4LW1zLXJlcXVlc3QtaWRcIik7XG4gICAgICAgIGlmIChzZXJ2aWNlUmVxdWVzdElkKSB7XG4gICAgICAgICAgICBzcGFuLnNldEF0dHJpYnV0ZShcInNlcnZpY2VSZXF1ZXN0SWRcIiwgc2VydmljZVJlcXVlc3RJZCk7XG4gICAgICAgIH1cbiAgICAgICAgc3Bhbi5zZXRTdGF0dXMoe1xuICAgICAgICAgICAgc3RhdHVzOiBcInN1Y2Nlc3NcIixcbiAgICAgICAgfSk7XG4gICAgICAgIHNwYW4uZW5kKCk7XG4gICAgfVxuICAgIGNhdGNoIChlKSB7XG4gICAgICAgIGxvZ2dlci53YXJuaW5nKGBTa2lwcGluZyB0cmFjaW5nIHNwYW4gcHJvY2Vzc2luZyBkdWUgdG8gYW4gZXJyb3I6ICR7Z2V0RXJyb3JNZXNzYWdlKGUpfWApO1xuICAgIH1cbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRyYWNpbmdQb2xpY3kuanMubWFwIiwiLy8gQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG5pbXBvcnQgeyBnZXRVc2VyQWdlbnRIZWFkZXJOYW1lLCBnZXRVc2VyQWdlbnRWYWx1ZSB9IGZyb20gXCIuLi91dGlsL3VzZXJBZ2VudC5qc1wiO1xuY29uc3QgVXNlckFnZW50SGVhZGVyTmFtZSA9IGdldFVzZXJBZ2VudEhlYWRlck5hbWUoKTtcbi8qKlxuICogVGhlIHByb2dyYW1tYXRpYyBpZGVudGlmaWVyIG9mIHRoZSB1c2VyQWdlbnRQb2xpY3kuXG4gKi9cbmV4cG9ydCBjb25zdCB1c2VyQWdlbnRQb2xpY3lOYW1lID0gXCJ1c2VyQWdlbnRQb2xpY3lcIjtcbi8qKlxuICogQSBwb2xpY3kgdGhhdCBzZXRzIHRoZSBVc2VyLUFnZW50IGhlYWRlciAob3IgZXF1aXZhbGVudCkgdG8gcmVmbGVjdFxuICogdGhlIGxpYnJhcnkgdmVyc2lvbi5cbiAqIEBwYXJhbSBvcHRpb25zIC0gT3B0aW9ucyB0byBjdXN0b21pemUgdGhlIHVzZXIgYWdlbnQgdmFsdWUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1c2VyQWdlbnRQb2xpY3kob3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgdXNlckFnZW50VmFsdWUgPSBnZXRVc2VyQWdlbnRWYWx1ZShvcHRpb25zLnVzZXJBZ2VudFByZWZpeCk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgbmFtZTogdXNlckFnZW50UG9saWN5TmFtZSxcbiAgICAgICAgYXN5bmMgc2VuZFJlcXVlc3QocmVxdWVzdCwgbmV4dCkge1xuICAgICAgICAgICAgaWYgKCFyZXF1ZXN0LmhlYWRlcnMuaGFzKFVzZXJBZ2VudEhlYWRlck5hbWUpKSB7XG4gICAgICAgICAgICAgICAgcmVxdWVzdC5oZWFkZXJzLnNldChVc2VyQWdlbnRIZWFkZXJOYW1lLCB1c2VyQWdlbnRWYWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbmV4dChyZXF1ZXN0KTtcbiAgICAgICAgfSxcbiAgICB9O1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dXNlckFnZW50UG9saWN5LmpzLm1hcCIsIi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuaW1wb3J0IHsgaXNFcnJvciB9IGZyb20gXCJAYXp1cmUvY29yZS11dGlsXCI7XG5pbXBvcnQgeyBjdXN0b20gfSBmcm9tIFwiLi91dGlsL2luc3BlY3QuanNcIjtcbmltcG9ydCB7IFNhbml0aXplciB9IGZyb20gXCIuL3V0aWwvc2FuaXRpemVyLmpzXCI7XG5jb25zdCBlcnJvclNhbml0aXplciA9IG5ldyBTYW5pdGl6ZXIoKTtcbi8qKlxuICogQSBjdXN0b20gZXJyb3IgdHlwZSBmb3IgZmFpbGVkIHBpcGVsaW5lIHJlcXVlc3RzLlxuICovXG5leHBvcnQgY2xhc3MgUmVzdEVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2UsIG9wdGlvbnMgPSB7fSkge1xuICAgICAgICBzdXBlcihtZXNzYWdlKTtcbiAgICAgICAgdGhpcy5uYW1lID0gXCJSZXN0RXJyb3JcIjtcbiAgICAgICAgdGhpcy5jb2RlID0gb3B0aW9ucy5jb2RlO1xuICAgICAgICB0aGlzLnN0YXR1c0NvZGUgPSBvcHRpb25zLnN0YXR1c0NvZGU7XG4gICAgICAgIHRoaXMucmVxdWVzdCA9IG9wdGlvbnMucmVxdWVzdDtcbiAgICAgICAgdGhpcy5yZXNwb25zZSA9IG9wdGlvbnMucmVzcG9uc2U7XG4gICAgICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZih0aGlzLCBSZXN0RXJyb3IucHJvdG90eXBlKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogTG9nZ2luZyBtZXRob2QgZm9yIHV0aWwuaW5zcGVjdCBpbiBOb2RlXG4gICAgICovXG4gICAgW2N1c3RvbV0oKSB7XG4gICAgICAgIHJldHVybiBgUmVzdEVycm9yOiAke3RoaXMubWVzc2FnZX0gXFxuICR7ZXJyb3JTYW5pdGl6ZXIuc2FuaXRpemUodGhpcyl9YDtcbiAgICB9XG59XG4vKipcbiAqIFNvbWV0aGluZyB3ZW50IHdyb25nIHdoZW4gbWFraW5nIHRoZSByZXF1ZXN0LlxuICogVGhpcyBtZWFucyB0aGUgYWN0dWFsIHJlcXVlc3QgZmFpbGVkIGZvciBzb21lIHJlYXNvbixcbiAqIHN1Y2ggYXMgYSBETlMgaXNzdWUgb3IgdGhlIGNvbm5lY3Rpb24gYmVpbmcgbG9zdC5cbiAqL1xuUmVzdEVycm9yLlJFUVVFU1RfU0VORF9FUlJPUiA9IFwiUkVRVUVTVF9TRU5EX0VSUk9SXCI7XG4vKipcbiAqIFRoaXMgbWVhbnMgdGhhdCBwYXJzaW5nIHRoZSByZXNwb25zZSBmcm9tIHRoZSBzZXJ2ZXIgZmFpbGVkLlxuICogSXQgbWF5IGhhdmUgYmVlbiBtYWxmb3JtZWQuXG4gKi9cblJlc3RFcnJvci5QQVJTRV9FUlJPUiA9IFwiUEFSU0VfRVJST1JcIjtcbi8qKlxuICogVHlwZWd1YXJkIGZvciBSZXN0RXJyb3JcbiAqIEBwYXJhbSBlIC0gU29tZXRoaW5nIGNhdWdodCBieSBhIGNhdGNoIGNsYXVzZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzUmVzdEVycm9yKGUpIHtcbiAgICBpZiAoZSBpbnN0YW5jZW9mIFJlc3RFcnJvcikge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGlzRXJyb3IoZSkgJiYgZS5uYW1lID09PSBcIlJlc3RFcnJvclwiO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cmVzdEVycm9yLmpzLm1hcCIsIi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuaW1wb3J0IHsgZ2V0UmFuZG9tSW50ZWdlckluY2x1c2l2ZSB9IGZyb20gXCJAYXp1cmUvY29yZS11dGlsXCI7XG5pbXBvcnQgeyBpc1Rocm90dGxpbmdSZXRyeVJlc3BvbnNlIH0gZnJvbSBcIi4vdGhyb3R0bGluZ1JldHJ5U3RyYXRlZ3kuanNcIjtcbi8vIGludGVydmFscyBhcmUgaW4gbWlsbGlzZWNvbmRzXG5jb25zdCBERUZBVUxUX0NMSUVOVF9SRVRSWV9JTlRFUlZBTCA9IDEwMDA7XG5jb25zdCBERUZBVUxUX0NMSUVOVF9NQVhfUkVUUllfSU5URVJWQUwgPSAxMDAwICogNjQ7XG4vKipcbiAqIEEgcmV0cnkgc3RyYXRlZ3kgdGhhdCByZXRyaWVzIHdpdGggYW4gZXhwb25lbnRpYWxseSBpbmNyZWFzaW5nIGRlbGF5IGluIHRoZXNlIHR3byBjYXNlczpcbiAqIC0gV2hlbiB0aGVyZSBhcmUgZXJyb3JzIGluIHRoZSB1bmRlcmx5aW5nIHRyYW5zcG9ydCBsYXllciAoZS5nLiBETlMgbG9va3VwIGZhaWx1cmVzKS5cbiAqIC0gT3Igb3RoZXJ3aXNlIGlmIHRoZSBvdXRnb2luZyByZXF1ZXN0IGZhaWxzICg0MDgsIGdyZWF0ZXIgb3IgZXF1YWwgdGhhbiA1MDAsIGV4Y2VwdCBmb3IgNTAxIGFuZCA1MDUpLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZXhwb25lbnRpYWxSZXRyeVN0cmF0ZWd5KG9wdGlvbnMgPSB7fSkge1xuICAgIHZhciBfYSwgX2I7XG4gICAgY29uc3QgcmV0cnlJbnRlcnZhbCA9IChfYSA9IG9wdGlvbnMucmV0cnlEZWxheUluTXMpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IERFRkFVTFRfQ0xJRU5UX1JFVFJZX0lOVEVSVkFMO1xuICAgIGNvbnN0IG1heFJldHJ5SW50ZXJ2YWwgPSAoX2IgPSBvcHRpb25zLm1heFJldHJ5RGVsYXlJbk1zKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiBERUZBVUxUX0NMSUVOVF9NQVhfUkVUUllfSU5URVJWQUw7XG4gICAgbGV0IHJldHJ5QWZ0ZXJJbk1zID0gcmV0cnlJbnRlcnZhbDtcbiAgICByZXR1cm4ge1xuICAgICAgICBuYW1lOiBcImV4cG9uZW50aWFsUmV0cnlTdHJhdGVneVwiLFxuICAgICAgICByZXRyeSh7IHJldHJ5Q291bnQsIHJlc3BvbnNlLCByZXNwb25zZUVycm9yIH0pIHtcbiAgICAgICAgICAgIGNvbnN0IG1hdGNoZWRTeXN0ZW1FcnJvciA9IGlzU3lzdGVtRXJyb3IocmVzcG9uc2VFcnJvcik7XG4gICAgICAgICAgICBjb25zdCBpZ25vcmVTeXN0ZW1FcnJvcnMgPSBtYXRjaGVkU3lzdGVtRXJyb3IgJiYgb3B0aW9ucy5pZ25vcmVTeXN0ZW1FcnJvcnM7XG4gICAgICAgICAgICBjb25zdCBpc0V4cG9uZW50aWFsID0gaXNFeHBvbmVudGlhbFJldHJ5UmVzcG9uc2UocmVzcG9uc2UpO1xuICAgICAgICAgICAgY29uc3QgaWdub3JlRXhwb25lbnRpYWxSZXNwb25zZSA9IGlzRXhwb25lbnRpYWwgJiYgb3B0aW9ucy5pZ25vcmVIdHRwU3RhdHVzQ29kZXM7XG4gICAgICAgICAgICBjb25zdCB1bmtub3duUmVzcG9uc2UgPSByZXNwb25zZSAmJiAoaXNUaHJvdHRsaW5nUmV0cnlSZXNwb25zZShyZXNwb25zZSkgfHwgIWlzRXhwb25lbnRpYWwpO1xuICAgICAgICAgICAgaWYgKHVua25vd25SZXNwb25zZSB8fCBpZ25vcmVFeHBvbmVudGlhbFJlc3BvbnNlIHx8IGlnbm9yZVN5c3RlbUVycm9ycykge1xuICAgICAgICAgICAgICAgIHJldHVybiB7IHNraXBTdHJhdGVneTogdHJ1ZSB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlRXJyb3IgJiYgIW1hdGNoZWRTeXN0ZW1FcnJvciAmJiAhaXNFeHBvbmVudGlhbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7IGVycm9yVG9UaHJvdzogcmVzcG9uc2VFcnJvciB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gRXhwb25lbnRpYWxseSBpbmNyZWFzZSB0aGUgZGVsYXkgZWFjaCB0aW1lXG4gICAgICAgICAgICBjb25zdCBleHBvbmVudGlhbERlbGF5ID0gcmV0cnlBZnRlckluTXMgKiBNYXRoLnBvdygyLCByZXRyeUNvdW50KTtcbiAgICAgICAgICAgIC8vIERvbid0IGxldCB0aGUgZGVsYXkgZXhjZWVkIHRoZSBtYXhpbXVtXG4gICAgICAgICAgICBjb25zdCBjbGFtcGVkRXhwb25lbnRpYWxEZWxheSA9IE1hdGgubWluKG1heFJldHJ5SW50ZXJ2YWwsIGV4cG9uZW50aWFsRGVsYXkpO1xuICAgICAgICAgICAgLy8gQWxsb3cgdGhlIGZpbmFsIHZhbHVlIHRvIGhhdmUgc29tZSBcImppdHRlclwiICh3aXRoaW4gNTAlIG9mIHRoZSBkZWxheSBzaXplKSBzb1xuICAgICAgICAgICAgLy8gdGhhdCByZXRyaWVzIGFjcm9zcyBtdWx0aXBsZSBjbGllbnRzIGRvbid0IG9jY3VyIHNpbXVsdGFuZW91c2x5LlxuICAgICAgICAgICAgcmV0cnlBZnRlckluTXMgPVxuICAgICAgICAgICAgICAgIGNsYW1wZWRFeHBvbmVudGlhbERlbGF5IC8gMiArIGdldFJhbmRvbUludGVnZXJJbmNsdXNpdmUoMCwgY2xhbXBlZEV4cG9uZW50aWFsRGVsYXkgLyAyKTtcbiAgICAgICAgICAgIHJldHVybiB7IHJldHJ5QWZ0ZXJJbk1zIH07XG4gICAgICAgIH0sXG4gICAgfTtcbn1cbi8qKlxuICogQSByZXNwb25zZSBpcyBhIHJldHJ5IHJlc3BvbnNlIGlmIGl0IGhhcyBzdGF0dXMgY29kZXM6XG4gKiAtIDQwOCwgb3JcbiAqIC0gR3JlYXRlciBvciBlcXVhbCB0aGFuIDUwMCwgZXhjZXB0IGZvciA1MDEgYW5kIDUwNS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzRXhwb25lbnRpYWxSZXRyeVJlc3BvbnNlKHJlc3BvbnNlKSB7XG4gICAgcmV0dXJuIEJvb2xlYW4ocmVzcG9uc2UgJiZcbiAgICAgICAgcmVzcG9uc2Uuc3RhdHVzICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICAgKHJlc3BvbnNlLnN0YXR1cyA+PSA1MDAgfHwgcmVzcG9uc2Uuc3RhdHVzID09PSA0MDgpICYmXG4gICAgICAgIHJlc3BvbnNlLnN0YXR1cyAhPT0gNTAxICYmXG4gICAgICAgIHJlc3BvbnNlLnN0YXR1cyAhPT0gNTA1KTtcbn1cbi8qKlxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIGFuIGVycm9yIGZyb20gYSBwaXBlbGluZSByZXNwb25zZSB3YXMgdHJpZ2dlcmVkIGluIHRoZSBuZXR3b3JrIGxheWVyLlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNTeXN0ZW1FcnJvcihlcnIpIHtcbiAgICBpZiAoIWVycikge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiAoZXJyLmNvZGUgPT09IFwiRVRJTUVET1VUXCIgfHxcbiAgICAgICAgZXJyLmNvZGUgPT09IFwiRVNPQ0tFVFRJTUVET1VUXCIgfHxcbiAgICAgICAgZXJyLmNvZGUgPT09IFwiRUNPTk5SRUZVU0VEXCIgfHxcbiAgICAgICAgZXJyLmNvZGUgPT09IFwiRUNPTk5SRVNFVFwiIHx8XG4gICAgICAgIGVyci5jb2RlID09PSBcIkVOT0VOVFwiIHx8XG4gICAgICAgIGVyci5jb2RlID09PSBcIkVOT1RGT1VORFwiKTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWV4cG9uZW50aWFsUmV0cnlTdHJhdGVneS5qcy5tYXAiLCIvLyBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi5cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbmltcG9ydCB7IHBhcnNlSGVhZGVyVmFsdWVBc051bWJlciB9IGZyb20gXCIuLi91dGlsL2hlbHBlcnMuanNcIjtcbi8qKlxuICogVGhlIGhlYWRlciB0aGF0IGNvbWVzIGJhY2sgZnJvbSBBenVyZSBzZXJ2aWNlcyByZXByZXNlbnRpbmdcbiAqIHRoZSBhbW91bnQgb2YgdGltZSAobWluaW11bSkgdG8gd2FpdCB0byByZXRyeSAoaW4gc2Vjb25kcyBvciB0aW1lc3RhbXAgYWZ0ZXIgd2hpY2ggd2UgY2FuIHJldHJ5KS5cbiAqL1xuY29uc3QgUmV0cnlBZnRlckhlYWRlciA9IFwiUmV0cnktQWZ0ZXJcIjtcbi8qKlxuICogVGhlIGhlYWRlcnMgdGhhdCBjb21lIGJhY2sgZnJvbSBBenVyZSBzZXJ2aWNlcyByZXByZXNlbnRpbmdcbiAqIHRoZSBhbW91bnQgb2YgdGltZSAobWluaW11bSkgdG8gd2FpdCB0byByZXRyeS5cbiAqXG4gKiBcInJldHJ5LWFmdGVyLW1zXCIsIFwieC1tcy1yZXRyeS1hZnRlci1tc1wiIDogbWlsbGlzZWNvbmRzXG4gKiBcIlJldHJ5LUFmdGVyXCIgOiBzZWNvbmRzIG9yIHRpbWVzdGFtcFxuICovXG5jb25zdCBBbGxSZXRyeUFmdGVySGVhZGVycyA9IFtcInJldHJ5LWFmdGVyLW1zXCIsIFwieC1tcy1yZXRyeS1hZnRlci1tc1wiLCBSZXRyeUFmdGVySGVhZGVyXTtcbi8qKlxuICogQSByZXNwb25zZSBpcyBhIHRocm90dGxpbmcgcmV0cnkgcmVzcG9uc2UgaWYgaXQgaGFzIGEgdGhyb3R0bGluZyBzdGF0dXMgY29kZSAoNDI5IG9yIDUwMyksXG4gKiBhcyBsb25nIGFzIG9uZSBvZiB0aGUgWyBcIlJldHJ5LUFmdGVyXCIgb3IgXCJyZXRyeS1hZnRlci1tc1wiIG9yIFwieC1tcy1yZXRyeS1hZnRlci1tc1wiIF0gaGVhZGVycyBoYXMgYSB2YWxpZCB2YWx1ZS5cbiAqXG4gKiBSZXR1cm5zIHRoZSBgcmV0cnlBZnRlckluTXNgIHZhbHVlIGlmIHRoZSByZXNwb25zZSBpcyBhIHRocm90dGxpbmcgcmV0cnkgcmVzcG9uc2UuXG4gKiBJZiBub3QgdGhyb3R0bGluZyByZXRyeSByZXNwb25zZSwgcmV0dXJucyBgdW5kZWZpbmVkYC5cbiAqXG4gKiBAaW50ZXJuYWxcbiAqL1xuZnVuY3Rpb24gZ2V0UmV0cnlBZnRlckluTXMocmVzcG9uc2UpIHtcbiAgICBpZiAoIShyZXNwb25zZSAmJiBbNDI5LCA1MDNdLmluY2x1ZGVzKHJlc3BvbnNlLnN0YXR1cykpKVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIHRyeSB7XG4gICAgICAgIC8vIEhlYWRlcnM6IFwicmV0cnktYWZ0ZXItbXNcIiwgXCJ4LW1zLXJldHJ5LWFmdGVyLW1zXCIsIFwiUmV0cnktQWZ0ZXJcIlxuICAgICAgICBmb3IgKGNvbnN0IGhlYWRlciBvZiBBbGxSZXRyeUFmdGVySGVhZGVycykge1xuICAgICAgICAgICAgY29uc3QgcmV0cnlBZnRlclZhbHVlID0gcGFyc2VIZWFkZXJWYWx1ZUFzTnVtYmVyKHJlc3BvbnNlLCBoZWFkZXIpO1xuICAgICAgICAgICAgaWYgKHJldHJ5QWZ0ZXJWYWx1ZSA9PT0gMCB8fCByZXRyeUFmdGVyVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAvLyBcIlJldHJ5LUFmdGVyXCIgaGVhZGVyID09PiBzZWNvbmRzXG4gICAgICAgICAgICAgICAgLy8gXCJyZXRyeS1hZnRlci1tc1wiLCBcIngtbXMtcmV0cnktYWZ0ZXItbXNcIiBoZWFkZXJzID09PiBtaWxsaS1zZWNvbmRzXG4gICAgICAgICAgICAgICAgY29uc3QgbXVsdGlwbHlpbmdGYWN0b3IgPSBoZWFkZXIgPT09IFJldHJ5QWZ0ZXJIZWFkZXIgPyAxMDAwIDogMTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmV0cnlBZnRlclZhbHVlICogbXVsdGlwbHlpbmdGYWN0b3I7IC8vIGluIG1pbGxpLXNlY29uZHNcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBSZXRyeUFmdGVySGVhZGVyIChcIlJldHJ5LUFmdGVyXCIpIGhhcyBhIHNwZWNpYWwgY2FzZSB3aGVyZSBpdCBtaWdodCBiZSBmb3JtYXR0ZWQgYXMgYSBkYXRlIGluc3RlYWQgb2YgYSBudW1iZXIgb2Ygc2Vjb25kc1xuICAgICAgICBjb25zdCByZXRyeUFmdGVySGVhZGVyID0gcmVzcG9uc2UuaGVhZGVycy5nZXQoUmV0cnlBZnRlckhlYWRlcik7XG4gICAgICAgIGlmICghcmV0cnlBZnRlckhlYWRlcilcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgY29uc3QgZGF0ZSA9IERhdGUucGFyc2UocmV0cnlBZnRlckhlYWRlcik7XG4gICAgICAgIGNvbnN0IGRpZmYgPSBkYXRlIC0gRGF0ZS5ub3coKTtcbiAgICAgICAgLy8gbmVnYXRpdmUgZGlmZiB3b3VsZCBtZWFuIGEgZGF0ZSBpbiB0aGUgcGFzdCwgc28gcmV0cnkgYXNhcCB3aXRoIDAgbWlsbGlzZWNvbmRzXG4gICAgICAgIHJldHVybiBOdW1iZXIuaXNGaW5pdGUoZGlmZikgPyBNYXRoLm1heCgwLCBkaWZmKSA6IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG59XG4vKipcbiAqIEEgcmVzcG9uc2UgaXMgYSByZXRyeSByZXNwb25zZSBpZiBpdCBoYXMgYSB0aHJvdHRsaW5nIHN0YXR1cyBjb2RlICg0Mjkgb3IgNTAzKSxcbiAqIGFzIGxvbmcgYXMgb25lIG9mIHRoZSBbIFwiUmV0cnktQWZ0ZXJcIiBvciBcInJldHJ5LWFmdGVyLW1zXCIgb3IgXCJ4LW1zLXJldHJ5LWFmdGVyLW1zXCIgXSBoZWFkZXJzIGhhcyBhIHZhbGlkIHZhbHVlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNUaHJvdHRsaW5nUmV0cnlSZXNwb25zZShyZXNwb25zZSkge1xuICAgIHJldHVybiBOdW1iZXIuaXNGaW5pdGUoZ2V0UmV0cnlBZnRlckluTXMocmVzcG9uc2UpKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiB0aHJvdHRsaW5nUmV0cnlTdHJhdGVneSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBuYW1lOiBcInRocm90dGxpbmdSZXRyeVN0cmF0ZWd5XCIsXG4gICAgICAgIHJldHJ5KHsgcmVzcG9uc2UgfSkge1xuICAgICAgICAgICAgY29uc3QgcmV0cnlBZnRlckluTXMgPSBnZXRSZXRyeUFmdGVySW5NcyhyZXNwb25zZSk7XG4gICAgICAgICAgICBpZiAoIU51bWJlci5pc0Zpbml0ZShyZXRyeUFmdGVySW5NcykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4geyBza2lwU3RyYXRlZ3k6IHRydWUgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgcmV0cnlBZnRlckluTXMsXG4gICAgICAgICAgICB9O1xuICAgICAgICB9LFxuICAgIH07XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD10aHJvdHRsaW5nUmV0cnlTdHJhdGVneS5qcy5tYXAiLCIvLyBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi5cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbmltcG9ydCB7IGdldFJhd0NvbnRlbnQgfSBmcm9tIFwiLi9maWxlLmpzXCI7XG5pbXBvcnQgeyBpc05vZGVSZWFkYWJsZVN0cmVhbSwgaXNXZWJSZWFkYWJsZVN0cmVhbSB9IGZyb20gXCIuL3R5cGVHdWFyZHMuanNcIjtcbi8qKlxuICogRHJhaW4gdGhlIGNvbnRlbnQgb2YgdGhlIGdpdmVuIFJlYWRhYmxlU3RyZWFtIGludG8gYSBCbG9iLlxuICogVGhlIGJsb2IncyBjb250ZW50IG1heSBlbmQgdXAgaW4gbWVtb3J5IG9yIG9uIGRpc2sgZGVwZW5kZW50IG9uIHNpemUuXG4gKi9cbmZ1bmN0aW9uIGRyYWluKHN0cmVhbSkge1xuICAgIHJldHVybiBuZXcgUmVzcG9uc2Uoc3RyZWFtKS5ibG9iKCk7XG59XG5hc3luYyBmdW5jdGlvbiB0b0Jsb2JQYXJ0KHNvdXJjZSkge1xuICAgIGlmIChzb3VyY2UgaW5zdGFuY2VvZiBCbG9iIHx8IHNvdXJjZSBpbnN0YW5jZW9mIFVpbnQ4QXJyYXkpIHtcbiAgICAgICAgcmV0dXJuIHNvdXJjZTtcbiAgICB9XG4gICAgaWYgKGlzV2ViUmVhZGFibGVTdHJlYW0oc291cmNlKSkge1xuICAgICAgICByZXR1cm4gZHJhaW4oc291cmNlKTtcbiAgICB9XG4gICAgLy8gSWYgaXQncyBub3QgYSB0cnVlIEJsb2IsIGFuZCBpdCdzIG5vdCBhIFVpbnQ4QXJyYXksIHdlIGNhbiBhc3N1bWUgdGhlIHNvdXJjZVxuICAgIC8vIGlzIGEgZmFrZSBGaWxlIGNyZWF0ZWQgYnkgY3JlYXRlRmlsZUZyb21TdHJlYW0gYW5kIHdlIGNhbiBnZXQgdGhlIG9yaWdpbmFsIHN0cmVhbVxuICAgIC8vIHVzaW5nIGdldFJhd0NvbnRlbnQuXG4gICAgY29uc3QgcmF3Q29udGVudCA9IGdldFJhd0NvbnRlbnQoc291cmNlKTtcbiAgICAvLyBTaG91bGRuJ3QgaGFwcGVuIGJ1dCBndWFyZCBmb3IgaXQgYW55d2F5XG4gICAgaWYgKGlzTm9kZVJlYWRhYmxlU3RyZWFtKHJhd0NvbnRlbnQpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkVuY291bnRlcmVkIHVuZXhwZWN0ZWQgdHlwZS4gSW4gdGhlIGJyb3dzZXIsIGBjb25jYXRgIHN1cHBvcnRzIFdlYiBSZWFkYWJsZVN0cmVhbSwgQmxvYiwgVWludDhBcnJheSwgYW5kIGZpbGVzIGNyZWF0ZWQgdXNpbmcgYGNyZWF0ZUZpbGVgIG9ubHkuXCIpO1xuICAgIH1cbiAgICByZXR1cm4gdG9CbG9iUGFydChyYXdDb250ZW50KTtcbn1cbi8qKlxuICogVXRpbGl0eSBmdW5jdGlvbiB0aGF0IGNvbmNhdGVuYXRlcyBhIHNldCBvZiBiaW5hcnkgaW5wdXRzIGludG8gb25lIGNvbWJpbmVkIG91dHB1dC5cbiAqXG4gKiBAcGFyYW0gc291cmNlcyAtIGFycmF5IG9mIHNvdXJjZXMgZm9yIHRoZSBjb25jYXRlbmF0aW9uXG4gKiBAcmV0dXJucyAtIGluIE5vZGUsIGEgKCgpID1cXD4gTm9kZUpTLlJlYWRhYmxlU3RyZWFtKSB3aGljaCwgd2hlbiByZWFkLCBwcm9kdWNlcyBhIGNvbmNhdGVuYXRpb24gb2YgYWxsIHRoZSBpbnB1dHMuXG4gKiAgICAgICAgICAgSW4gYnJvd3NlciwgcmV0dXJucyBhIGBCbG9iYCByZXByZXNlbnRpbmcgYWxsIHRoZSBjb25jYXRlbmF0ZWQgaW5wdXRzLlxuICpcbiAqIEBpbnRlcm5hbFxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY29uY2F0KHNvdXJjZXMpIHtcbiAgICBjb25zdCBwYXJ0cyA9IFtdO1xuICAgIGZvciAoY29uc3Qgc291cmNlIG9mIHNvdXJjZXMpIHtcbiAgICAgICAgcGFydHMucHVzaChhd2FpdCB0b0Jsb2JQYXJ0KHR5cGVvZiBzb3VyY2UgPT09IFwiZnVuY3Rpb25cIiA/IHNvdXJjZSgpIDogc291cmNlKSk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgQmxvYihwYXJ0cyk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jb25jYXQtYnJvd3Nlci5tanMubWFwIiwiLy8gQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG5pbXBvcnQgeyBpc05vZGVMaWtlIH0gZnJvbSBcIkBhenVyZS9jb3JlLXV0aWxcIjtcbmltcG9ydCB7IGlzTm9kZVJlYWRhYmxlU3RyZWFtIH0gZnJvbSBcIi4vdHlwZUd1YXJkcy5qc1wiO1xuY29uc3QgdW5pbXBsZW1lbnRlZE1ldGhvZHMgPSB7XG4gICAgYXJyYXlCdWZmZXI6ICgpID0+IHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm90IGltcGxlbWVudGVkXCIpO1xuICAgIH0sXG4gICAgc2xpY2U6ICgpID0+IHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm90IGltcGxlbWVudGVkXCIpO1xuICAgIH0sXG4gICAgdGV4dDogKCkgPT4ge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJOb3QgaW1wbGVtZW50ZWRcIik7XG4gICAgfSxcbn07XG4vKipcbiAqIFByaXZhdGUgc3ltYm9sIHVzZWQgYXMga2V5IG9uIG9iamVjdHMgY3JlYXRlZCB1c2luZyBjcmVhdGVGaWxlIGNvbnRhaW5pbmcgdGhlXG4gKiBvcmlnaW5hbCBzb3VyY2Ugb2YgdGhlIGZpbGUgb2JqZWN0LlxuICpcbiAqIFRoaXMgaXMgdXNlZCBpbiBOb2RlIHRvIGFjY2VzcyB0aGUgb3JpZ2luYWwgTm9kZSBzdHJlYW0gd2l0aG91dCB1c2luZyBCbG9iI3N0cmVhbSwgd2hpY2hcbiAqIHJldHVybnMgYSB3ZWIgc3RyZWFtLiBUaGlzIGlzIGRvbmUgdG8gYXZvaWQgYSBjb3VwbGUgb2YgYnVncyB0byBkbyB3aXRoIEJsb2Ijc3RyZWFtIGFuZFxuICogUmVhZGFibGUjdG8vZnJvbVdlYiBpbiBOb2RlIHZlcnNpb25zIHdlIHN1cHBvcnQ6XG4gKiAtIGh0dHBzOi8vZ2l0aHViLmNvbS9ub2RlanMvbm9kZS9pc3N1ZXMvNDI2OTQgKGZpeGVkIGluIE5vZGUgMTguMTQpXG4gKiAtIGh0dHBzOi8vZ2l0aHViLmNvbS9ub2RlanMvbm9kZS9pc3N1ZXMvNDg5MTYgKGZpeGVkIGluIE5vZGUgMjAuNilcbiAqXG4gKiBPbmNlIHRoZXNlIHZlcnNpb25zIGFyZSBubyBsb25nZXIgc3VwcG9ydGVkLCB3ZSBtYXkgYmUgYWJsZSB0byBzdG9wIGRvaW5nIHRoaXMuXG4gKlxuICogQGludGVybmFsXG4gKi9cbmNvbnN0IHJhd0NvbnRlbnQgPSBTeW1ib2woXCJyYXdDb250ZW50XCIpO1xuZnVuY3Rpb24gaGFzUmF3Q29udGVudCh4KSB7XG4gICAgcmV0dXJuIHR5cGVvZiB4W3Jhd0NvbnRlbnRdID09PSBcImZ1bmN0aW9uXCI7XG59XG4vKipcbiAqIEV4dHJhY3QgdGhlIHJhdyBjb250ZW50IGZyb20gYSBnaXZlbiBibG9iLWxpa2Ugb2JqZWN0LiBJZiB0aGUgaW5wdXQgd2FzIGNyZWF0ZWQgdXNpbmcgY3JlYXRlRmlsZVxuICogb3IgY3JlYXRlRmlsZUZyb21TdHJlYW0sIHRoZSBleGFjdCBjb250ZW50IHBhc3NlZCBpbnRvIGNyZWF0ZUZpbGUvY3JlYXRlRmlsZUZyb21TdHJlYW0gd2lsbCBiZSB1c2VkLlxuICogRm9yIHRydWUgaW5zdGFuY2VzIG9mIEJsb2IgYW5kIEZpbGUsIHJldHVybnMgdGhlIGJsb2IncyBjb250ZW50IGFzIGEgV2ViIFJlYWRhYmxlU3RyZWFtPFVpbnQ4QXJyYXk+LlxuICpcbiAqIEBpbnRlcm5hbFxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0UmF3Q29udGVudChibG9iKSB7XG4gICAgaWYgKGhhc1Jhd0NvbnRlbnQoYmxvYikpIHtcbiAgICAgICAgcmV0dXJuIGJsb2JbcmF3Q29udGVudF0oKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiBibG9iLnN0cmVhbSgpO1xuICAgIH1cbn1cbi8qKlxuICogQ3JlYXRlIGFuIG9iamVjdCB0aGF0IGltcGxlbWVudHMgdGhlIEZpbGUgaW50ZXJmYWNlLiBUaGlzIG9iamVjdCBpcyBpbnRlbmRlZCB0byBiZVxuICogcGFzc2VkIGludG8gUmVxdWVzdEJvZHlUeXBlLmZvcm1EYXRhLCBhbmQgaXMgbm90IGd1YXJhbnRlZWQgdG8gd29yayBhcyBleHBlY3RlZCBpblxuICogb3RoZXIgc2l0dWF0aW9ucy5cbiAqXG4gKiBVc2UgdGhpcyBmdW5jdGlvbiB0bzpcbiAqIC0gQ3JlYXRlIGEgRmlsZSBvYmplY3QgZm9yIHVzZSBpbiBSZXF1ZXN0Qm9keVR5cGUuZm9ybURhdGEgaW4gZW52aXJvbm1lbnRzIHdoZXJlIHRoZVxuICogICBnbG9iYWwgRmlsZSBvYmplY3QgaXMgdW5hdmFpbGFibGUuXG4gKiAtIENyZWF0ZSBhIEZpbGUtbGlrZSBvYmplY3QgZnJvbSBhIHJlYWRhYmxlIHN0cmVhbSB3aXRob3V0IHJlYWRpbmcgdGhlIHN0cmVhbSBpbnRvIG1lbW9yeS5cbiAqXG4gKiBAcGFyYW0gc3RyZWFtIC0gdGhlIGNvbnRlbnQgb2YgdGhlIGZpbGUgYXMgYSBjYWxsYmFjayByZXR1cm5pbmcgYSBzdHJlYW0uIFdoZW4gYSBGaWxlIG9iamVjdCBtYWRlIHVzaW5nIGNyZWF0ZUZpbGUgaXNcbiAqICAgICAgICAgICAgICAgICAgcGFzc2VkIGluIGEgcmVxdWVzdCdzIGZvcm0gZGF0YSBtYXAsIHRoZSBzdHJlYW0gd2lsbCBub3QgYmUgcmVhZCBpbnRvIG1lbW9yeVxuICogICAgICAgICAgICAgICAgICBhbmQgaW5zdGVhZCB3aWxsIGJlIHN0cmVhbWVkIHdoZW4gdGhlIHJlcXVlc3QgaXMgbWFkZS4gSW4gdGhlIGV2ZW50IG9mIGEgcmV0cnksIHRoZVxuICogICAgICAgICAgICAgICAgICBzdHJlYW0gbmVlZHMgdG8gYmUgcmVhZCBhZ2Fpbiwgc28gdGhpcyBjYWxsYmFjayBTSE9VTEQgcmV0dXJuIGEgZnJlc2ggc3RyZWFtIGlmIHBvc3NpYmxlLlxuICogQHBhcmFtIG5hbWUgLSB0aGUgbmFtZSBvZiB0aGUgZmlsZS5cbiAqIEBwYXJhbSBvcHRpb25zIC0gb3B0aW9uYWwgbWV0YWRhdGEgYWJvdXQgdGhlIGZpbGUsIGUuZy4gZmlsZSBuYW1lLCBmaWxlIHNpemUsIE1JTUUgdHlwZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUZpbGVGcm9tU3RyZWFtKHN0cmVhbSwgbmFtZSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgdmFyIF9hLCBfYiwgX2MsIF9kO1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIHVuaW1wbGVtZW50ZWRNZXRob2RzKSwgeyB0eXBlOiAoX2EgPSBvcHRpb25zLnR5cGUpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IFwiXCIsIGxhc3RNb2RpZmllZDogKF9iID0gb3B0aW9ucy5sYXN0TW9kaWZpZWQpICE9PSBudWxsICYmIF9iICE9PSB2b2lkIDAgPyBfYiA6IG5ldyBEYXRlKCkuZ2V0VGltZSgpLCB3ZWJraXRSZWxhdGl2ZVBhdGg6IChfYyA9IG9wdGlvbnMud2Via2l0UmVsYXRpdmVQYXRoKSAhPT0gbnVsbCAmJiBfYyAhPT0gdm9pZCAwID8gX2MgOiBcIlwiLCBzaXplOiAoX2QgPSBvcHRpb25zLnNpemUpICE9PSBudWxsICYmIF9kICE9PSB2b2lkIDAgPyBfZCA6IC0xLCBuYW1lLCBzdHJlYW06ICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHMgPSBzdHJlYW0oKTtcbiAgICAgICAgICAgIGlmIChpc05vZGVSZWFkYWJsZVN0cmVhbShzKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vdCBzdXBwb3J0ZWQ6IGEgTm9kZSBzdHJlYW0gd2FzIHByb3ZpZGVkIGFzIGlucHV0IHRvIGNyZWF0ZUZpbGVGcm9tU3RyZWFtLlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzO1xuICAgICAgICB9LCBbcmF3Q29udGVudF06IHN0cmVhbSB9KTtcbn1cbi8qKlxuICogQ3JlYXRlIGFuIG9iamVjdCB0aGF0IGltcGxlbWVudHMgdGhlIEZpbGUgaW50ZXJmYWNlLiBUaGlzIG9iamVjdCBpcyBpbnRlbmRlZCB0byBiZVxuICogcGFzc2VkIGludG8gUmVxdWVzdEJvZHlUeXBlLmZvcm1EYXRhLCBhbmQgaXMgbm90IGd1YXJhbnRlZWQgdG8gd29yayBhcyBleHBlY3RlZCBpblxuICogb3RoZXIgc2l0dWF0aW9ucy5cbiAqXG4gKiBVc2UgdGhpcyBmdW5jdGlvbiBjcmVhdGUgYSBGaWxlIG9iamVjdCBmb3IgdXNlIGluIFJlcXVlc3RCb2R5VHlwZS5mb3JtRGF0YSBpbiBlbnZpcm9ubWVudHMgd2hlcmUgdGhlIGdsb2JhbCBGaWxlIG9iamVjdCBpcyB1bmF2YWlsYWJsZS5cbiAqXG4gKiBAcGFyYW0gY29udGVudCAtIHRoZSBjb250ZW50IG9mIHRoZSBmaWxlIGFzIGEgVWludDhBcnJheSBpbiBtZW1vcnkuXG4gKiBAcGFyYW0gbmFtZSAtIHRoZSBuYW1lIG9mIHRoZSBmaWxlLlxuICogQHBhcmFtIG9wdGlvbnMgLSBvcHRpb25hbCBtZXRhZGF0YSBhYm91dCB0aGUgZmlsZSwgZS5nLiBmaWxlIG5hbWUsIGZpbGUgc2l6ZSwgTUlNRSB0eXBlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlRmlsZShjb250ZW50LCBuYW1lLCBvcHRpb25zID0ge30pIHtcbiAgICB2YXIgX2EsIF9iLCBfYztcbiAgICBpZiAoaXNOb2RlTGlrZSkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCB1bmltcGxlbWVudGVkTWV0aG9kcyksIHsgdHlwZTogKF9hID0gb3B0aW9ucy50eXBlKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBcIlwiLCBsYXN0TW9kaWZpZWQ6IChfYiA9IG9wdGlvbnMubGFzdE1vZGlmaWVkKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSwgd2Via2l0UmVsYXRpdmVQYXRoOiAoX2MgPSBvcHRpb25zLndlYmtpdFJlbGF0aXZlUGF0aCkgIT09IG51bGwgJiYgX2MgIT09IHZvaWQgMCA/IF9jIDogXCJcIiwgc2l6ZTogY29udGVudC5ieXRlTGVuZ3RoLCBuYW1lLCBhcnJheUJ1ZmZlcjogYXN5bmMgKCkgPT4gY29udGVudC5idWZmZXIsIHN0cmVhbTogKCkgPT4gbmV3IEJsb2IoW2NvbnRlbnRdKS5zdHJlYW0oKSwgW3Jhd0NvbnRlbnRdOiAoKSA9PiBjb250ZW50IH0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBGaWxlKFtjb250ZW50XSwgbmFtZSwgb3B0aW9ucyk7XG4gICAgfVxufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZmlsZS5qcy5tYXAiLCIvLyBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi5cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbmltcG9ydCB7IEFib3J0RXJyb3IgfSBmcm9tIFwiQGF6dXJlL2Fib3J0LWNvbnRyb2xsZXJcIjtcbmNvbnN0IFN0YW5kYXJkQWJvcnRNZXNzYWdlID0gXCJUaGUgb3BlcmF0aW9uIHdhcyBhYm9ydGVkLlwiO1xuLyoqXG4gKiBBIHdyYXBwZXIgZm9yIHNldFRpbWVvdXQgdGhhdCByZXNvbHZlcyBhIHByb21pc2UgYWZ0ZXIgZGVsYXlJbk1zIG1pbGxpc2Vjb25kcy5cbiAqIEBwYXJhbSBkZWxheUluTXMgLSBUaGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyB0byBiZSBkZWxheWVkLlxuICogQHBhcmFtIHZhbHVlIC0gVGhlIHZhbHVlIHRvIGJlIHJlc29sdmVkIHdpdGggYWZ0ZXIgYSB0aW1lb3V0IG9mIHQgbWlsbGlzZWNvbmRzLlxuICogQHBhcmFtIG9wdGlvbnMgLSBUaGUgb3B0aW9ucyBmb3IgZGVsYXkgLSBjdXJyZW50bHkgYWJvcnQgb3B0aW9uc1xuICogICAgICAgICAgICAgICAgICAtIGFib3J0U2lnbmFsIC0gVGhlIGFib3J0U2lnbmFsIGFzc29jaWF0ZWQgd2l0aCBjb250YWluaW5nIG9wZXJhdGlvbi5cbiAqICAgICAgICAgICAgICAgICAgLSBhYm9ydEVycm9yTXNnIC0gVGhlIGFib3J0IGVycm9yIG1lc3NhZ2UgYXNzb2NpYXRlZCB3aXRoIGNvbnRhaW5pbmcgb3BlcmF0aW9uLlxuICogQHJldHVybnMgUmVzb2x2ZWQgcHJvbWlzZVxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVsYXkoZGVsYXlJbk1zLCB2YWx1ZSwgb3B0aW9ucykge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGxldCB0aW1lciA9IHVuZGVmaW5lZDtcbiAgICAgICAgbGV0IG9uQWJvcnRlZCA9IHVuZGVmaW5lZDtcbiAgICAgICAgY29uc3QgcmVqZWN0T25BYm9ydCA9ICgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiByZWplY3QobmV3IEFib3J0RXJyb3IoKG9wdGlvbnMgPT09IG51bGwgfHwgb3B0aW9ucyA9PT0gdm9pZCAwID8gdm9pZCAwIDogb3B0aW9ucy5hYm9ydEVycm9yTXNnKSA/IG9wdGlvbnMgPT09IG51bGwgfHwgb3B0aW9ucyA9PT0gdm9pZCAwID8gdm9pZCAwIDogb3B0aW9ucy5hYm9ydEVycm9yTXNnIDogU3RhbmRhcmRBYm9ydE1lc3NhZ2UpKTtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgcmVtb3ZlTGlzdGVuZXJzID0gKCkgPT4ge1xuICAgICAgICAgICAgaWYgKChvcHRpb25zID09PSBudWxsIHx8IG9wdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9wdGlvbnMuYWJvcnRTaWduYWwpICYmIG9uQWJvcnRlZCkge1xuICAgICAgICAgICAgICAgIG9wdGlvbnMuYWJvcnRTaWduYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImFib3J0XCIsIG9uQWJvcnRlZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIG9uQWJvcnRlZCA9ICgpID0+IHtcbiAgICAgICAgICAgIGlmICh0aW1lcikge1xuICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZW1vdmVMaXN0ZW5lcnMoKTtcbiAgICAgICAgICAgIHJldHVybiByZWplY3RPbkFib3J0KCk7XG4gICAgICAgIH07XG4gICAgICAgIGlmICgob3B0aW9ucyA9PT0gbnVsbCB8fCBvcHRpb25zID09PSB2b2lkIDAgPyB2b2lkIDAgOiBvcHRpb25zLmFib3J0U2lnbmFsKSAmJiBvcHRpb25zLmFib3J0U2lnbmFsLmFib3J0ZWQpIHtcbiAgICAgICAgICAgIHJldHVybiByZWplY3RPbkFib3J0KCk7XG4gICAgICAgIH1cbiAgICAgICAgdGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIHJlbW92ZUxpc3RlbmVycygpO1xuICAgICAgICAgICAgcmVzb2x2ZSh2YWx1ZSk7XG4gICAgICAgIH0sIGRlbGF5SW5Ncyk7XG4gICAgICAgIGlmIChvcHRpb25zID09PSBudWxsIHx8IG9wdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9wdGlvbnMuYWJvcnRTaWduYWwpIHtcbiAgICAgICAgICAgIG9wdGlvbnMuYWJvcnRTaWduYWwuYWRkRXZlbnRMaXN0ZW5lcihcImFib3J0XCIsIG9uQWJvcnRlZCk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbi8qKlxuICogQGludGVybmFsXG4gKiBAcmV0dXJucyB0aGUgcGFyc2VkIHZhbHVlIG9yIHVuZGVmaW5lZCBpZiB0aGUgcGFyc2VkIHZhbHVlIGlzIGludmFsaWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUhlYWRlclZhbHVlQXNOdW1iZXIocmVzcG9uc2UsIGhlYWRlck5hbWUpIHtcbiAgICBjb25zdCB2YWx1ZSA9IHJlc3BvbnNlLmhlYWRlcnMuZ2V0KGhlYWRlck5hbWUpO1xuICAgIGlmICghdmFsdWUpXG4gICAgICAgIHJldHVybjtcbiAgICBjb25zdCB2YWx1ZUFzTnVtID0gTnVtYmVyKHZhbHVlKTtcbiAgICBpZiAoTnVtYmVyLmlzTmFOKHZhbHVlQXNOdW0pKVxuICAgICAgICByZXR1cm47XG4gICAgcmV0dXJuIHZhbHVlQXNOdW07XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1oZWxwZXJzLmpzLm1hcCIsIi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuZXhwb3J0IGNvbnN0IGN1c3RvbSA9IHt9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5zcGVjdC1icm93c2VyLm1qcy5tYXAiLCIvLyBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi5cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbmltcG9ydCB7IGlzT2JqZWN0IH0gZnJvbSBcIkBhenVyZS9jb3JlLXV0aWxcIjtcbmNvbnN0IFJlZGFjdGVkU3RyaW5nID0gXCJSRURBQ1RFRFwiO1xuLy8gTWFrZSBzdXJlIHRoaXMgbGlzdCBpcyB1cC10by1kYXRlIHdpdGggdGhlIG9uZSB1bmRlciBjb3JlL2xvZ2dlci9SZWFkbWUjS2V5Y29uY2VwdHNcbmNvbnN0IGRlZmF1bHRBbGxvd2VkSGVhZGVyTmFtZXMgPSBbXG4gICAgXCJ4LW1zLWNsaWVudC1yZXF1ZXN0LWlkXCIsXG4gICAgXCJ4LW1zLXJldHVybi1jbGllbnQtcmVxdWVzdC1pZFwiLFxuICAgIFwieC1tcy11c2VyYWdlbnRcIixcbiAgICBcIngtbXMtY29ycmVsYXRpb24tcmVxdWVzdC1pZFwiLFxuICAgIFwieC1tcy1yZXF1ZXN0LWlkXCIsXG4gICAgXCJjbGllbnQtcmVxdWVzdC1pZFwiLFxuICAgIFwibXMtY3ZcIixcbiAgICBcInJldHVybi1jbGllbnQtcmVxdWVzdC1pZFwiLFxuICAgIFwidHJhY2VwYXJlbnRcIixcbiAgICBcIkFjY2Vzcy1Db250cm9sLUFsbG93LUNyZWRlbnRpYWxzXCIsXG4gICAgXCJBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzXCIsXG4gICAgXCJBY2Nlc3MtQ29udHJvbC1BbGxvdy1NZXRob2RzXCIsXG4gICAgXCJBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW5cIixcbiAgICBcIkFjY2Vzcy1Db250cm9sLUV4cG9zZS1IZWFkZXJzXCIsXG4gICAgXCJBY2Nlc3MtQ29udHJvbC1NYXgtQWdlXCIsXG4gICAgXCJBY2Nlc3MtQ29udHJvbC1SZXF1ZXN0LUhlYWRlcnNcIixcbiAgICBcIkFjY2Vzcy1Db250cm9sLVJlcXVlc3QtTWV0aG9kXCIsXG4gICAgXCJPcmlnaW5cIixcbiAgICBcIkFjY2VwdFwiLFxuICAgIFwiQWNjZXB0LUVuY29kaW5nXCIsXG4gICAgXCJDYWNoZS1Db250cm9sXCIsXG4gICAgXCJDb25uZWN0aW9uXCIsXG4gICAgXCJDb250ZW50LUxlbmd0aFwiLFxuICAgIFwiQ29udGVudC1UeXBlXCIsXG4gICAgXCJEYXRlXCIsXG4gICAgXCJFVGFnXCIsXG4gICAgXCJFeHBpcmVzXCIsXG4gICAgXCJJZi1NYXRjaFwiLFxuICAgIFwiSWYtTW9kaWZpZWQtU2luY2VcIixcbiAgICBcIklmLU5vbmUtTWF0Y2hcIixcbiAgICBcIklmLVVubW9kaWZpZWQtU2luY2VcIixcbiAgICBcIkxhc3QtTW9kaWZpZWRcIixcbiAgICBcIlByYWdtYVwiLFxuICAgIFwiUmVxdWVzdC1JZFwiLFxuICAgIFwiUmV0cnktQWZ0ZXJcIixcbiAgICBcIlNlcnZlclwiLFxuICAgIFwiVHJhbnNmZXItRW5jb2RpbmdcIixcbiAgICBcIlVzZXItQWdlbnRcIixcbiAgICBcIldXVy1BdXRoZW50aWNhdGVcIixcbl07XG5jb25zdCBkZWZhdWx0QWxsb3dlZFF1ZXJ5UGFyYW1ldGVycyA9IFtcImFwaS12ZXJzaW9uXCJdO1xuLyoqXG4gKiBAaW50ZXJuYWxcbiAqL1xuZXhwb3J0IGNsYXNzIFNhbml0aXplciB7XG4gICAgY29uc3RydWN0b3IoeyBhZGRpdGlvbmFsQWxsb3dlZEhlYWRlck5hbWVzOiBhbGxvd2VkSGVhZGVyTmFtZXMgPSBbXSwgYWRkaXRpb25hbEFsbG93ZWRRdWVyeVBhcmFtZXRlcnM6IGFsbG93ZWRRdWVyeVBhcmFtZXRlcnMgPSBbXSwgfSA9IHt9KSB7XG4gICAgICAgIGFsbG93ZWRIZWFkZXJOYW1lcyA9IGRlZmF1bHRBbGxvd2VkSGVhZGVyTmFtZXMuY29uY2F0KGFsbG93ZWRIZWFkZXJOYW1lcyk7XG4gICAgICAgIGFsbG93ZWRRdWVyeVBhcmFtZXRlcnMgPSBkZWZhdWx0QWxsb3dlZFF1ZXJ5UGFyYW1ldGVycy5jb25jYXQoYWxsb3dlZFF1ZXJ5UGFyYW1ldGVycyk7XG4gICAgICAgIHRoaXMuYWxsb3dlZEhlYWRlck5hbWVzID0gbmV3IFNldChhbGxvd2VkSGVhZGVyTmFtZXMubWFwKChuKSA9PiBuLnRvTG93ZXJDYXNlKCkpKTtcbiAgICAgICAgdGhpcy5hbGxvd2VkUXVlcnlQYXJhbWV0ZXJzID0gbmV3IFNldChhbGxvd2VkUXVlcnlQYXJhbWV0ZXJzLm1hcCgocCkgPT4gcC50b0xvd2VyQ2FzZSgpKSk7XG4gICAgfVxuICAgIHNhbml0aXplKG9iaikge1xuICAgICAgICBjb25zdCBzZWVuID0gbmV3IFNldCgpO1xuICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkob2JqLCAoa2V5LCB2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgLy8gRW5zdXJlIEVycm9ycyBpbmNsdWRlIHRoZWlyIGludGVyZXN0aW5nIG5vbi1lbnVtZXJhYmxlIG1lbWJlcnNcbiAgICAgICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgdmFsdWUpLCB7IG5hbWU6IHZhbHVlLm5hbWUsIG1lc3NhZ2U6IHZhbHVlLm1lc3NhZ2UgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoa2V5ID09PSBcImhlYWRlcnNcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnNhbml0aXplSGVhZGVycyh2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChrZXkgPT09IFwidXJsXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zYW5pdGl6ZVVybCh2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChrZXkgPT09IFwicXVlcnlcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnNhbml0aXplUXVlcnkodmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoa2V5ID09PSBcImJvZHlcIikge1xuICAgICAgICAgICAgICAgIC8vIERvbid0IGxvZyB0aGUgcmVxdWVzdCBib2R5XG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGtleSA9PT0gXCJyZXNwb25zZVwiKSB7XG4gICAgICAgICAgICAgICAgLy8gRG9uJ3QgbG9nIHJlc3BvbnNlIGFnYWluXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGtleSA9PT0gXCJvcGVyYXRpb25TcGVjXCIpIHtcbiAgICAgICAgICAgICAgICAvLyBXaGVuIHVzaW5nIHNlbmRPcGVyYXRpb25SZXF1ZXN0LCB0aGUgcmVxdWVzdCBjYXJyaWVzIGEgbWFzc2l2ZVxuICAgICAgICAgICAgICAgIC8vIGZpZWxkIHdpdGggdGhlIGF1dG9yZXN0IHNwZWMuIE5vIG5lZWQgdG8gbG9nIGl0LlxuICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSB8fCBpc09iamVjdCh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICBpZiAoc2Vlbi5oYXModmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcIltDaXJjdWxhcl1cIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2Vlbi5hZGQodmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9LCAyKTtcbiAgICB9XG4gICAgc2FuaXRpemVIZWFkZXJzKG9iaikge1xuICAgICAgICBjb25zdCBzYW5pdGl6ZWQgPSB7fTtcbiAgICAgICAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMob2JqKSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuYWxsb3dlZEhlYWRlck5hbWVzLmhhcyhrZXkudG9Mb3dlckNhc2UoKSkpIHtcbiAgICAgICAgICAgICAgICBzYW5pdGl6ZWRba2V5XSA9IG9ialtrZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgc2FuaXRpemVkW2tleV0gPSBSZWRhY3RlZFN0cmluZztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc2FuaXRpemVkO1xuICAgIH1cbiAgICBzYW5pdGl6ZVF1ZXJ5KHZhbHVlKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09IFwib2JqZWN0XCIgfHwgdmFsdWUgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzYW5pdGl6ZWQgPSB7fTtcbiAgICAgICAgZm9yIChjb25zdCBrIG9mIE9iamVjdC5rZXlzKHZhbHVlKSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuYWxsb3dlZFF1ZXJ5UGFyYW1ldGVycy5oYXMoay50b0xvd2VyQ2FzZSgpKSkge1xuICAgICAgICAgICAgICAgIHNhbml0aXplZFtrXSA9IHZhbHVlW2tdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgc2FuaXRpemVkW2tdID0gUmVkYWN0ZWRTdHJpbmc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNhbml0aXplZDtcbiAgICB9XG4gICAgc2FuaXRpemVVcmwodmFsdWUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gXCJzdHJpbmdcIiB8fCB2YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHVybCA9IG5ldyBVUkwodmFsdWUpO1xuICAgICAgICBpZiAoIXVybC5zZWFyY2gpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IFtrZXldIG9mIHVybC5zZWFyY2hQYXJhbXMpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5hbGxvd2VkUXVlcnlQYXJhbWV0ZXJzLmhhcyhrZXkudG9Mb3dlckNhc2UoKSkpIHtcbiAgICAgICAgICAgICAgICB1cmwuc2VhcmNoUGFyYW1zLnNldChrZXksIFJlZGFjdGVkU3RyaW5nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdXJsLnRvU3RyaW5nKCk7XG4gICAgfVxufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c2FuaXRpemVyLmpzLm1hcCIsIi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuaW1wb3J0IHsgZGVsYXkgfSBmcm9tIFwiLi9oZWxwZXJzLmpzXCI7XG4vLyBEZWZhdWx0IG9wdGlvbnMgZm9yIHRoZSBjeWNsZXIgaWYgbm9uZSBhcmUgcHJvdmlkZWRcbmV4cG9ydCBjb25zdCBERUZBVUxUX0NZQ0xFUl9PUFRJT05TID0ge1xuICAgIGZvcmNlZFJlZnJlc2hXaW5kb3dJbk1zOiAxMDAwLCAvLyBGb3JjZSB3YWl0aW5nIGZvciBhIHJlZnJlc2ggMXMgYmVmb3JlIHRoZSB0b2tlbiBleHBpcmVzXG4gICAgcmV0cnlJbnRlcnZhbEluTXM6IDMwMDAsIC8vIEFsbG93IHJlZnJlc2ggYXR0ZW1wdHMgZXZlcnkgM3NcbiAgICByZWZyZXNoV2luZG93SW5NczogMTAwMCAqIDYwICogMiwgLy8gU3RhcnQgcmVmcmVzaGluZyAybSBiZWZvcmUgZXhwaXJ5XG59O1xuLyoqXG4gKiBDb252ZXJ0cyBhbiBhbiB1bnJlbGlhYmxlIGFjY2VzcyB0b2tlbiBnZXR0ZXIgKHdoaWNoIG1heSByZXNvbHZlIHdpdGggbnVsbClcbiAqIGludG8gYW4gQWNjZXNzVG9rZW5HZXR0ZXIgYnkgcmV0cnlpbmcgdGhlIHVucmVsaWFibGUgZ2V0dGVyIGluIGEgcmVndWxhclxuICogaW50ZXJ2YWwuXG4gKlxuICogQHBhcmFtIGdldEFjY2Vzc1Rva2VuIC0gQSBmdW5jdGlvbiB0aGF0IHByb2R1Y2VzIGEgcHJvbWlzZSBvZiBhbiBhY2Nlc3MgdG9rZW4gdGhhdCBtYXkgZmFpbCBieSByZXR1cm5pbmcgbnVsbC5cbiAqIEBwYXJhbSByZXRyeUludGVydmFsSW5NcyAtIFRoZSB0aW1lIChpbiBtaWxsaXNlY29uZHMpIHRvIHdhaXQgYmV0d2VlbiByZXRyeSBhdHRlbXB0cy5cbiAqIEBwYXJhbSByZWZyZXNoVGltZW91dCAtIFRoZSB0aW1lc3RhbXAgYWZ0ZXIgd2hpY2ggdGhlIHJlZnJlc2ggYXR0ZW1wdCB3aWxsIGZhaWwsIHRocm93aW5nIGFuIGV4Y2VwdGlvbi5cbiAqIEByZXR1cm5zIC0gQSBwcm9taXNlIHRoYXQsIGlmIGl0IHJlc29sdmVzLCB3aWxsIHJlc29sdmUgd2l0aCBhbiBhY2Nlc3MgdG9rZW4uXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIGJlZ2luUmVmcmVzaChnZXRBY2Nlc3NUb2tlbiwgcmV0cnlJbnRlcnZhbEluTXMsIHJlZnJlc2hUaW1lb3V0KSB7XG4gICAgLy8gVGhpcyB3cmFwcGVyIGhhbmRsZXMgZXhjZXB0aW9ucyBncmFjZWZ1bGx5IGFzIGxvbmcgYXMgd2UgaGF2ZW4ndCBleGNlZWRlZFxuICAgIC8vIHRoZSB0aW1lb3V0LlxuICAgIGFzeW5jIGZ1bmN0aW9uIHRyeUdldEFjY2Vzc1Rva2VuKCkge1xuICAgICAgICBpZiAoRGF0ZS5ub3coKSA8IHJlZnJlc2hUaW1lb3V0KSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCBnZXRBY2Nlc3NUb2tlbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKF9hKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBmaW5hbFRva2VuID0gYXdhaXQgZ2V0QWNjZXNzVG9rZW4oKTtcbiAgICAgICAgICAgIC8vIFRpbWVvdXQgaXMgdXAsIHNvIHRocm93IGlmIGl0J3Mgc3RpbGwgbnVsbFxuICAgICAgICAgICAgaWYgKGZpbmFsVG9rZW4gPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJGYWlsZWQgdG8gcmVmcmVzaCBhY2Nlc3MgdG9rZW4uXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZpbmFsVG9rZW47XG4gICAgICAgIH1cbiAgICB9XG4gICAgbGV0IHRva2VuID0gYXdhaXQgdHJ5R2V0QWNjZXNzVG9rZW4oKTtcbiAgICB3aGlsZSAodG9rZW4gPT09IG51bGwpIHtcbiAgICAgICAgYXdhaXQgZGVsYXkocmV0cnlJbnRlcnZhbEluTXMpO1xuICAgICAgICB0b2tlbiA9IGF3YWl0IHRyeUdldEFjY2Vzc1Rva2VuKCk7XG4gICAgfVxuICAgIHJldHVybiB0b2tlbjtcbn1cbi8qKlxuICogQ3JlYXRlcyBhIHRva2VuIGN5Y2xlciBmcm9tIGEgY3JlZGVudGlhbCwgc2NvcGVzLCBhbmQgb3B0aW9uYWwgc2V0dGluZ3MuXG4gKlxuICogQSB0b2tlbiBjeWNsZXIgcmVwcmVzZW50cyBhIHdheSB0byByZWxpYWJseSByZXRyaWV2ZSBhIHZhbGlkIGFjY2VzcyB0b2tlblxuICogZnJvbSBhIFRva2VuQ3JlZGVudGlhbC4gSXQgd2lsbCBoYW5kbGUgaW5pdGlhbGl6aW5nIHRoZSB0b2tlbiwgcmVmcmVzaGluZyBpdFxuICogd2hlbiBpdCBuZWFycyBleHBpcmF0aW9uLCBhbmQgc3luY2hyb25pemVzIHJlZnJlc2ggYXR0ZW1wdHMgdG8gYXZvaWRcbiAqIGNvbmN1cnJlbmN5IGhhemFyZHMuXG4gKlxuICogQHBhcmFtIGNyZWRlbnRpYWwgLSB0aGUgdW5kZXJseWluZyBUb2tlbkNyZWRlbnRpYWwgdGhhdCBwcm92aWRlcyB0aGUgYWNjZXNzXG4gKiB0b2tlblxuICogQHBhcmFtIHRva2VuQ3ljbGVyT3B0aW9ucyAtIG9wdGlvbmFsbHkgb3ZlcnJpZGUgZGVmYXVsdCBzZXR0aW5ncyBmb3IgdGhlIGN5Y2xlclxuICpcbiAqIEByZXR1cm5zIC0gYSBmdW5jdGlvbiB0aGF0IHJlbGlhYmx5IHByb2R1Y2VzIGEgdmFsaWQgYWNjZXNzIHRva2VuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVUb2tlbkN5Y2xlcihjcmVkZW50aWFsLCB0b2tlbkN5Y2xlck9wdGlvbnMpIHtcbiAgICBsZXQgcmVmcmVzaFdvcmtlciA9IG51bGw7XG4gICAgbGV0IHRva2VuID0gbnVsbDtcbiAgICBsZXQgdGVuYW50SWQ7XG4gICAgY29uc3Qgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgREVGQVVMVF9DWUNMRVJfT1BUSU9OUyksIHRva2VuQ3ljbGVyT3B0aW9ucyk7XG4gICAgLyoqXG4gICAgICogVGhpcyBsaXR0bGUgaG9sZGVyIGRlZmluZXMgc2V2ZXJhbCBwcmVkaWNhdGVzIHRoYXQgd2UgdXNlIHRvIGNvbnN0cnVjdFxuICAgICAqIHRoZSBydWxlcyBvZiByZWZyZXNoaW5nIHRoZSB0b2tlbi5cbiAgICAgKi9cbiAgICBjb25zdCBjeWNsZXIgPSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBQcm9kdWNlcyB0cnVlIGlmIGEgcmVmcmVzaCBqb2IgaXMgY3VycmVudGx5IGluIHByb2dyZXNzLlxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0IGlzUmVmcmVzaGluZygpIHtcbiAgICAgICAgICAgIHJldHVybiByZWZyZXNoV29ya2VyICE9PSBudWxsO1xuICAgICAgICB9LFxuICAgICAgICAvKipcbiAgICAgICAgICogUHJvZHVjZXMgdHJ1ZSBpZiB0aGUgY3ljbGVyIFNIT1VMRCByZWZyZXNoICh3ZSBhcmUgd2l0aGluIHRoZSByZWZyZXNoXG4gICAgICAgICAqIHdpbmRvdyBhbmQgbm90IGFscmVhZHkgcmVmcmVzaGluZylcbiAgICAgICAgICovXG4gICAgICAgIGdldCBzaG91bGRSZWZyZXNoKCkge1xuICAgICAgICAgICAgdmFyIF9hO1xuICAgICAgICAgICAgcmV0dXJuICghY3ljbGVyLmlzUmVmcmVzaGluZyAmJlxuICAgICAgICAgICAgICAgICgoX2EgPSB0b2tlbiA9PT0gbnVsbCB8fCB0b2tlbiA9PT0gdm9pZCAwID8gdm9pZCAwIDogdG9rZW4uZXhwaXJlc09uVGltZXN0YW1wKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiAwKSAtIG9wdGlvbnMucmVmcmVzaFdpbmRvd0luTXMgPCBEYXRlLm5vdygpKTtcbiAgICAgICAgfSxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFByb2R1Y2VzIHRydWUgaWYgdGhlIGN5Y2xlciBNVVNUIHJlZnJlc2ggKG51bGwgb3IgbmVhcmx5LWV4cGlyZWRcbiAgICAgICAgICogdG9rZW4pLlxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0IG11c3RSZWZyZXNoKCkge1xuICAgICAgICAgICAgcmV0dXJuICh0b2tlbiA9PT0gbnVsbCB8fCB0b2tlbi5leHBpcmVzT25UaW1lc3RhbXAgLSBvcHRpb25zLmZvcmNlZFJlZnJlc2hXaW5kb3dJbk1zIDwgRGF0ZS5ub3coKSk7XG4gICAgICAgIH0sXG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBTdGFydHMgYSByZWZyZXNoIGpvYiBvciByZXR1cm5zIHRoZSBleGlzdGluZyBqb2IgaWYgb25lIGlzIGFscmVhZHlcbiAgICAgKiBydW5uaW5nLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHJlZnJlc2goc2NvcGVzLCBnZXRUb2tlbk9wdGlvbnMpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICBpZiAoIWN5Y2xlci5pc1JlZnJlc2hpbmcpIHtcbiAgICAgICAgICAgIC8vIFdlIGJpbmQgYHNjb3Blc2AgaGVyZSB0byBhdm9pZCBwYXNzaW5nIGl0IGFyb3VuZCBhIGxvdFxuICAgICAgICAgICAgY29uc3QgdHJ5R2V0QWNjZXNzVG9rZW4gPSAoKSA9PiBjcmVkZW50aWFsLmdldFRva2VuKHNjb3BlcywgZ2V0VG9rZW5PcHRpb25zKTtcbiAgICAgICAgICAgIC8vIFRha2UgYWR2YW50YWdlIG9mIHByb21pc2UgY2hhaW5pbmcgdG8gaW5zZXJ0IGFuIGFzc2lnbm1lbnQgdG8gYHRva2VuYFxuICAgICAgICAgICAgLy8gYmVmb3JlIHRoZSByZWZyZXNoIGNhbiBiZSBjb25zaWRlcmVkIGRvbmUuXG4gICAgICAgICAgICByZWZyZXNoV29ya2VyID0gYmVnaW5SZWZyZXNoKHRyeUdldEFjY2Vzc1Rva2VuLCBvcHRpb25zLnJldHJ5SW50ZXJ2YWxJbk1zLCBcbiAgICAgICAgICAgIC8vIElmIHdlIGRvbid0IGhhdmUgYSB0b2tlbiwgdGhlbiB3ZSBzaG91bGQgdGltZW91dCBpbW1lZGlhdGVseVxuICAgICAgICAgICAgKF9hID0gdG9rZW4gPT09IG51bGwgfHwgdG9rZW4gPT09IHZvaWQgMCA/IHZvaWQgMCA6IHRva2VuLmV4cGlyZXNPblRpbWVzdGFtcCkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogRGF0ZS5ub3coKSlcbiAgICAgICAgICAgICAgICAudGhlbigoX3Rva2VuKSA9PiB7XG4gICAgICAgICAgICAgICAgcmVmcmVzaFdvcmtlciA9IG51bGw7XG4gICAgICAgICAgICAgICAgdG9rZW4gPSBfdG9rZW47XG4gICAgICAgICAgICAgICAgdGVuYW50SWQgPSBnZXRUb2tlbk9wdGlvbnMudGVuYW50SWQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRva2VuO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goKHJlYXNvbikgPT4ge1xuICAgICAgICAgICAgICAgIC8vIFdlIGFsc28gc2hvdWxkIHJlc2V0IHRoZSByZWZyZXNoZXIgaWYgd2UgZW50ZXIgYSBmYWlsZWQgc3RhdGUuICBBbGxcbiAgICAgICAgICAgICAgICAvLyBleGlzdGluZyBhd2FpdGVycyB3aWxsIHRocm93LCBidXQgc3Vic2VxdWVudCByZXF1ZXN0cyB3aWxsIHN0YXJ0IGFcbiAgICAgICAgICAgICAgICAvLyBuZXcgcmV0cnkgY2hhaW4uXG4gICAgICAgICAgICAgICAgcmVmcmVzaFdvcmtlciA9IG51bGw7XG4gICAgICAgICAgICAgICAgdG9rZW4gPSBudWxsO1xuICAgICAgICAgICAgICAgIHRlbmFudElkID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIHRocm93IHJlYXNvbjtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZWZyZXNoV29ya2VyO1xuICAgIH1cbiAgICByZXR1cm4gYXN5bmMgKHNjb3BlcywgdG9rZW5PcHRpb25zKSA9PiB7XG4gICAgICAgIC8vXG4gICAgICAgIC8vIFNpbXBsZSBydWxlczpcbiAgICAgICAgLy8gLSBJZiB3ZSBNVVNUIHJlZnJlc2gsIHRoZW4gcmV0dXJuIHRoZSByZWZyZXNoIHRhc2ssIGJsb2NraW5nXG4gICAgICAgIC8vICAgdGhlIHBpcGVsaW5lIHVudGlsIGEgdG9rZW4gaXMgYXZhaWxhYmxlLlxuICAgICAgICAvLyAtIElmIHdlIFNIT1VMRCByZWZyZXNoLCB0aGVuIHJ1biByZWZyZXNoIGJ1dCBkb24ndCByZXR1cm4gaXRcbiAgICAgICAgLy8gICAod2UgY2FuIHN0aWxsIHVzZSB0aGUgY2FjaGVkIHRva2VuKS5cbiAgICAgICAgLy8gLSBSZXR1cm4gdGhlIHRva2VuLCBzaW5jZSBpdCdzIGZpbmUgaWYgd2UgZGlkbid0IHJldHVybiBpblxuICAgICAgICAvLyAgIHN0ZXAgMS5cbiAgICAgICAgLy9cbiAgICAgICAgLy8gSWYgdGhlIHRlbmFudElkIHBhc3NlZCBpbiB0b2tlbiBvcHRpb25zIGlzIGRpZmZlcmVudCB0byB0aGUgb25lIHdlIGhhdmVcbiAgICAgICAgLy8gT3IgaWYgd2UgYXJlIGluIGNsYWltIGNoYWxsZW5nZSBhbmQgdGhlIHRva2VuIHdhcyByZWplY3RlZCBhbmQgYSBuZXcgYWNjZXNzIHRva2VuIG5lZWQgdG8gYmUgaXNzdWVkLCB3ZSBuZWVkIHRvXG4gICAgICAgIC8vIHJlZnJlc2ggdGhlIHRva2VuIHdpdGggdGhlIG5ldyB0ZW5hbnRJZCBvciB0b2tlbi5cbiAgICAgICAgY29uc3QgbXVzdFJlZnJlc2ggPSB0ZW5hbnRJZCAhPT0gdG9rZW5PcHRpb25zLnRlbmFudElkIHx8IEJvb2xlYW4odG9rZW5PcHRpb25zLmNsYWltcykgfHwgY3ljbGVyLm11c3RSZWZyZXNoO1xuICAgICAgICBpZiAobXVzdFJlZnJlc2gpXG4gICAgICAgICAgICByZXR1cm4gcmVmcmVzaChzY29wZXMsIHRva2VuT3B0aW9ucyk7XG4gICAgICAgIGlmIChjeWNsZXIuc2hvdWxkUmVmcmVzaCkge1xuICAgICAgICAgICAgcmVmcmVzaChzY29wZXMsIHRva2VuT3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRva2VuO1xuICAgIH07XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD10b2tlbkN5Y2xlci5qcy5tYXAiLCIvLyBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi5cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbmV4cG9ydCBmdW5jdGlvbiBpc05vZGVSZWFkYWJsZVN0cmVhbSh4KSB7XG4gICAgcmV0dXJuIEJvb2xlYW4oeCAmJiB0eXBlb2YgeFtcInBpcGVcIl0gPT09IFwiZnVuY3Rpb25cIik7XG59XG5leHBvcnQgZnVuY3Rpb24gaXNXZWJSZWFkYWJsZVN0cmVhbSh4KSB7XG4gICAgcmV0dXJuIEJvb2xlYW4oeCAmJlxuICAgICAgICB0eXBlb2YgeC5nZXRSZWFkZXIgPT09IFwiZnVuY3Rpb25cIiAmJlxuICAgICAgICB0eXBlb2YgeC50ZWUgPT09IFwiZnVuY3Rpb25cIik7XG59XG5leHBvcnQgZnVuY3Rpb24gaXNSZWFkYWJsZVN0cmVhbSh4KSB7XG4gICAgcmV0dXJuIGlzTm9kZVJlYWRhYmxlU3RyZWFtKHgpIHx8IGlzV2ViUmVhZGFibGVTdHJlYW0oeCk7XG59XG5leHBvcnQgZnVuY3Rpb24gaXNCbG9iKHgpIHtcbiAgICByZXR1cm4gdHlwZW9mIHguc3RyZWFtID09PSBcImZ1bmN0aW9uXCI7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD10eXBlR3VhcmRzLmpzLm1hcCIsIi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuaW1wb3J0IHsgZ2V0SGVhZGVyTmFtZSwgc2V0UGxhdGZvcm1TcGVjaWZpY0RhdGEgfSBmcm9tIFwiLi91c2VyQWdlbnRQbGF0Zm9ybS5qc1wiO1xuaW1wb3J0IHsgU0RLX1ZFUlNJT04gfSBmcm9tIFwiLi4vY29uc3RhbnRzLmpzXCI7XG5mdW5jdGlvbiBnZXRVc2VyQWdlbnRTdHJpbmcodGVsZW1ldHJ5SW5mbykge1xuICAgIGNvbnN0IHBhcnRzID0gW107XG4gICAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgdGVsZW1ldHJ5SW5mbykge1xuICAgICAgICBjb25zdCB0b2tlbiA9IHZhbHVlID8gYCR7a2V5fS8ke3ZhbHVlfWAgOiBrZXk7XG4gICAgICAgIHBhcnRzLnB1c2godG9rZW4pO1xuICAgIH1cbiAgICByZXR1cm4gcGFydHMuam9pbihcIiBcIik7XG59XG4vKipcbiAqIEBpbnRlcm5hbFxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0VXNlckFnZW50SGVhZGVyTmFtZSgpIHtcbiAgICByZXR1cm4gZ2V0SGVhZGVyTmFtZSgpO1xufVxuLyoqXG4gKiBAaW50ZXJuYWxcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFVzZXJBZ2VudFZhbHVlKHByZWZpeCkge1xuICAgIGNvbnN0IHJ1bnRpbWVJbmZvID0gbmV3IE1hcCgpO1xuICAgIHJ1bnRpbWVJbmZvLnNldChcImNvcmUtcmVzdC1waXBlbGluZVwiLCBTREtfVkVSU0lPTik7XG4gICAgc2V0UGxhdGZvcm1TcGVjaWZpY0RhdGEocnVudGltZUluZm8pO1xuICAgIGNvbnN0IGRlZmF1bHRBZ2VudCA9IGdldFVzZXJBZ2VudFN0cmluZyhydW50aW1lSW5mbyk7XG4gICAgY29uc3QgdXNlckFnZW50VmFsdWUgPSBwcmVmaXggPyBgJHtwcmVmaXh9ICR7ZGVmYXVsdEFnZW50fWAgOiBkZWZhdWx0QWdlbnQ7XG4gICAgcmV0dXJuIHVzZXJBZ2VudFZhbHVlO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dXNlckFnZW50LmpzLm1hcCIsIi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuLypcbiAqIE5PVEU6IFdoZW4gbW92aW5nIHRoaXMgZmlsZSwgcGxlYXNlIHVwZGF0ZSBcImJyb3dzZXJcIiBzZWN0aW9uIGluIHBhY2thZ2UuanNvbi5cbiAqL1xuLyoqXG4gKiBAaW50ZXJuYWxcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEhlYWRlck5hbWUoKSB7XG4gICAgcmV0dXJuIFwieC1tcy11c2VyYWdlbnRcIjtcbn1cbi8qKlxuICogQGludGVybmFsXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXRQbGF0Zm9ybVNwZWNpZmljRGF0YShtYXApIHtcbiAgICB2YXIgX2EsIF9iLCBfYztcbiAgICBjb25zdCBsb2NhbE5hdmlnYXRvciA9IGdsb2JhbFRoaXMubmF2aWdhdG9yO1xuICAgIG1hcC5zZXQoXCJPU1wiLCAoKF9jID0gKF9iID0gKF9hID0gbG9jYWxOYXZpZ2F0b3IgPT09IG51bGwgfHwgbG9jYWxOYXZpZ2F0b3IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGxvY2FsTmF2aWdhdG9yLnVzZXJBZ2VudERhdGEpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5wbGF0Zm9ybSkgIT09IG51bGwgJiYgX2IgIT09IHZvaWQgMCA/IF9iIDogbG9jYWxOYXZpZ2F0b3IgPT09IG51bGwgfHwgbG9jYWxOYXZpZ2F0b3IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGxvY2FsTmF2aWdhdG9yLnBsYXRmb3JtKSAhPT0gbnVsbCAmJiBfYyAhPT0gdm9pZCAwID8gX2MgOiBcInVua25vd25cIikucmVwbGFjZShcIiBcIiwgXCJcIikpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dXNlckFnZW50UGxhdGZvcm0tYnJvd3Nlci5tanMubWFwIiwiLy8gQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG5leHBvcnQgeyBjcmVhdGVTc2VTdHJlYW0gfSBmcm9tIFwiLi9zc2UuanNcIjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsIi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuaW1wb3J0IHsgX19hc3luY0dlbmVyYXRvciwgX19hc3luY1ZhbHVlcywgX19hd2FpdCB9IGZyb20gXCJ0c2xpYlwiO1xuaW1wb3J0IHsgY3JlYXRlU3RyZWFtLCBlbnN1cmVBc3luY0l0ZXJhYmxlIH0gZnJvbSBcIi4vdXRpbHMuanNcIjtcbnZhciBDb250cm9sQ2hhcnM7XG4oZnVuY3Rpb24gKENvbnRyb2xDaGFycykge1xuICAgIENvbnRyb2xDaGFyc1tDb250cm9sQ2hhcnNbXCJOZXdMaW5lXCJdID0gMTBdID0gXCJOZXdMaW5lXCI7XG4gICAgQ29udHJvbENoYXJzW0NvbnRyb2xDaGFyc1tcIkNhcnJpYWdlUmV0dXJuXCJdID0gMTNdID0gXCJDYXJyaWFnZVJldHVyblwiO1xuICAgIENvbnRyb2xDaGFyc1tDb250cm9sQ2hhcnNbXCJTcGFjZVwiXSA9IDMyXSA9IFwiU3BhY2VcIjtcbiAgICBDb250cm9sQ2hhcnNbQ29udHJvbENoYXJzW1wiQ29sb25cIl0gPSA1OF0gPSBcIkNvbG9uXCI7XG59KShDb250cm9sQ2hhcnMgfHwgKENvbnRyb2xDaGFycyA9IHt9KSk7XG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlU3NlU3RyZWFtKGNodW5rU3RyZWFtKSB7XG4gICAgY29uc3QgeyBjYW5jZWwsIGl0ZXJhYmxlIH0gPSBlbnN1cmVBc3luY0l0ZXJhYmxlKGNodW5rU3RyZWFtKTtcbiAgICBjb25zdCBhc3luY0l0ZXIgPSB0b01lc3NhZ2UodG9MaW5lKGl0ZXJhYmxlKSk7XG4gICAgcmV0dXJuIGNyZWF0ZVN0cmVhbShhc3luY0l0ZXIsIGNhbmNlbCk7XG59XG5mdW5jdGlvbiBjb25jYXRCdWZmZXIoYSwgYikge1xuICAgIGNvbnN0IHJlcyA9IG5ldyBVaW50OEFycmF5KGEubGVuZ3RoICsgYi5sZW5ndGgpO1xuICAgIHJlcy5zZXQoYSk7XG4gICAgcmVzLnNldChiLCBhLmxlbmd0aCk7XG4gICAgcmV0dXJuIHJlcztcbn1cbmZ1bmN0aW9uIGNyZWF0ZU1lc3NhZ2UoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgZGF0YTogdW5kZWZpbmVkLFxuICAgICAgICBldmVudDogXCJcIixcbiAgICAgICAgaWQ6IFwiXCIsXG4gICAgICAgIHJldHJ5OiB1bmRlZmluZWQsXG4gICAgfTtcbn1cbmZ1bmN0aW9uIHRvTGluZShjaHVua0l0ZXIpIHtcbiAgICByZXR1cm4gX19hc3luY0dlbmVyYXRvcih0aGlzLCBhcmd1bWVudHMsIGZ1bmN0aW9uKiB0b0xpbmVfMSgpIHtcbiAgICAgICAgdmFyIF9hLCBlXzEsIF9iLCBfYztcbiAgICAgICAgbGV0IGJ1ZjtcbiAgICAgICAgbGV0IGJ1ZklkeCA9IDA7XG4gICAgICAgIGxldCBmaWVsZExlbiA9IC0xO1xuICAgICAgICBsZXQgZGlzY2FyZFRyYWlsaW5nTmV3bGluZSA9IGZhbHNlO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgZm9yICh2YXIgX2QgPSB0cnVlLCBjaHVua0l0ZXJfMSA9IF9fYXN5bmNWYWx1ZXMoY2h1bmtJdGVyKSwgY2h1bmtJdGVyXzFfMTsgY2h1bmtJdGVyXzFfMSA9IHlpZWxkIF9fYXdhaXQoY2h1bmtJdGVyXzEubmV4dCgpKSwgX2EgPSBjaHVua0l0ZXJfMV8xLmRvbmUsICFfYTsgX2QgPSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgX2MgPSBjaHVua0l0ZXJfMV8xLnZhbHVlO1xuICAgICAgICAgICAgICAgIF9kID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgY29uc3QgY2h1bmsgPSBfYztcbiAgICAgICAgICAgICAgICBpZiAoYnVmID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgYnVmID0gY2h1bms7XG4gICAgICAgICAgICAgICAgICAgIGJ1ZklkeCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGZpZWxkTGVuID0gLTE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBidWYgPSBjb25jYXRCdWZmZXIoYnVmLCBjaHVuayk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IGJ1ZkxlbiA9IGJ1Zi5sZW5ndGg7XG4gICAgICAgICAgICAgICAgbGV0IHN0YXJ0ID0gMDtcbiAgICAgICAgICAgICAgICB3aGlsZSAoYnVmSWR4IDwgYnVmTGVuKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkaXNjYXJkVHJhaWxpbmdOZXdsaW5lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYnVmW2J1ZklkeF0gPT09IENvbnRyb2xDaGFycy5OZXdMaW5lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnQgPSArK2J1ZklkeDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc2NhcmRUcmFpbGluZ05ld2xpbmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBsZXQgZW5kID0gLTE7XG4gICAgICAgICAgICAgICAgICAgIGZvciAoOyBidWZJZHggPCBidWZMZW4gJiYgZW5kID09PSAtMTsgKytidWZJZHgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoYnVmW2J1ZklkeF0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIENvbnRyb2xDaGFycy5Db2xvbjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZpZWxkTGVuID09PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmllbGRMZW4gPSBidWZJZHggLSBzdGFydDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIENvbnRyb2xDaGFycy5DYXJyaWFnZVJldHVybjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gV2UgbmVlZCB0byBkaXNjYXJkIHRoZSB0cmFpbGluZyBuZXdsaW5lIGlmIGFueSBidXQgY2FuJ3QgZG9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhhdCBub3cgYmVjYXVzZSB3ZSBuZWVkIHRvIGRpc3BhdGNoIHRoZSBjdXJyZW50IGxpbmUgZmlyc3QuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc2NhcmRUcmFpbGluZ05ld2xpbmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmQgPSBidWZJZHg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgQ29udHJvbENoYXJzLk5ld0xpbmU6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZCA9IGJ1ZklkeDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGVuZCA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFdlIHJlYWNoZWQgdGhlIGVuZCBvZiB0aGUgYnVmZmVyIGJ1dCB0aGUgbGluZSBoYXNuJ3QgZW5kZWQuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBXYWl0IGZvciB0aGUgbmV4dCBjaHVuayBhbmQgdGhlbiBjb250aW51ZSBwYXJzaW5nOlxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgeWllbGQgeWllbGQgX19hd2FpdCh7IGxpbmU6IGJ1Zi5zdWJhcnJheShzdGFydCwgZW5kKSwgZmllbGRMZW4gfSk7XG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0ID0gYnVmSWR4OyAvLyB3ZSdyZSBub3cgb24gdGhlIG5leHQgbGluZVxuICAgICAgICAgICAgICAgICAgICBmaWVsZExlbiA9IC0xO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoc3RhcnQgPT09IGJ1Zkxlbikge1xuICAgICAgICAgICAgICAgICAgICBidWYgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHN0YXJ0ICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGRpc2NhcmQgYWxyZWFkeSBwcm9jZXNzZWQgbGluZXNcbiAgICAgICAgICAgICAgICAgICAgYnVmID0gYnVmLnN1YmFycmF5KHN0YXJ0KTtcbiAgICAgICAgICAgICAgICAgICAgYnVmSWR4IC09IHN0YXJ0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZV8xXzEpIHsgZV8xID0geyBlcnJvcjogZV8xXzEgfTsgfVxuICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgaWYgKCFfZCAmJiAhX2EgJiYgKF9iID0gY2h1bmtJdGVyXzEucmV0dXJuKSkgeWllbGQgX19hd2FpdChfYi5jYWxsKGNodW5rSXRlcl8xKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmaW5hbGx5IHsgaWYgKGVfMSkgdGhyb3cgZV8xLmVycm9yOyB9XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbmZ1bmN0aW9uIHRvTWVzc2FnZShsaW5lSXRlcikge1xuICAgIHJldHVybiBfX2FzeW5jR2VuZXJhdG9yKHRoaXMsIGFyZ3VtZW50cywgZnVuY3Rpb24qIHRvTWVzc2FnZV8xKCkge1xuICAgICAgICB2YXIgX2EsIGVfMiwgX2IsIF9jO1xuICAgICAgICBsZXQgbWVzc2FnZSA9IGNyZWF0ZU1lc3NhZ2UoKTtcbiAgICAgICAgY29uc3QgZGVjb2RlciA9IG5ldyBUZXh0RGVjb2RlcigpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgZm9yICh2YXIgX2QgPSB0cnVlLCBsaW5lSXRlcl8xID0gX19hc3luY1ZhbHVlcyhsaW5lSXRlciksIGxpbmVJdGVyXzFfMTsgbGluZUl0ZXJfMV8xID0geWllbGQgX19hd2FpdChsaW5lSXRlcl8xLm5leHQoKSksIF9hID0gbGluZUl0ZXJfMV8xLmRvbmUsICFfYTsgX2QgPSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgX2MgPSBsaW5lSXRlcl8xXzEudmFsdWU7XG4gICAgICAgICAgICAgICAgX2QgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBjb25zdCB7IGxpbmUsIGZpZWxkTGVuIH0gPSBfYztcbiAgICAgICAgICAgICAgICBpZiAobGluZS5sZW5ndGggPT09IDAgJiYgbWVzc2FnZS5kYXRhICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZW1wdHkgbGluZSBkZW5vdGVzIGVuZCBvZiBtZXNzYWdlLiBZaWVsZCBhbmQgc3RhcnQgYSBuZXcgbWVzc2FnZTpcbiAgICAgICAgICAgICAgICAgICAgeWllbGQgeWllbGQgX19hd2FpdChtZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZSA9IGNyZWF0ZU1lc3NhZ2UoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoZmllbGRMZW4gPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGV4Y2x1ZGUgY29tbWVudHMgYW5kIGxpbmVzIHdpdGggbm8gdmFsdWVzXG4gICAgICAgICAgICAgICAgICAgIC8vIGxpbmUgaXMgb2YgZm9ybWF0IFwiPGZpZWxkPjo8dmFsdWU+XCIgb3IgXCI8ZmllbGQ+OiA8dmFsdWU+XCJcbiAgICAgICAgICAgICAgICAgICAgLy8gaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2Uvc2VydmVyLXNlbnQtZXZlbnRzLmh0bWwjZXZlbnQtc3RyZWFtLWludGVycHJldGF0aW9uXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZpZWxkID0gZGVjb2Rlci5kZWNvZGUobGluZS5zdWJhcnJheSgwLCBmaWVsZExlbikpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZU9mZnNldCA9IGZpZWxkTGVuICsgKGxpbmVbZmllbGRMZW4gKyAxXSA9PT0gQ29udHJvbENoYXJzLlNwYWNlID8gMiA6IDEpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZSA9IGRlY29kZXIuZGVjb2RlKGxpbmUuc3ViYXJyYXkodmFsdWVPZmZzZXQpKTtcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChmaWVsZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcImRhdGFcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlLmRhdGEgPSBtZXNzYWdlLmRhdGEgPyBtZXNzYWdlLmRhdGEgKyBcIlxcblwiICsgdmFsdWUgOiB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJldmVudFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UuZXZlbnQgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJpZFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UuaWQgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJyZXRyeVwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmV0cnkgPSBwYXJzZUludCh2YWx1ZSwgMTApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaXNOYU4ocmV0cnkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UucmV0cnkgPSByZXRyeTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVfMl8xKSB7IGVfMiA9IHsgZXJyb3I6IGVfMl8xIH07IH1cbiAgICAgICAgZmluYWxseSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGlmICghX2QgJiYgIV9hICYmIChfYiA9IGxpbmVJdGVyXzEucmV0dXJuKSkgeWllbGQgX19hd2FpdChfYi5jYWxsKGxpbmVJdGVyXzEpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZpbmFsbHkgeyBpZiAoZV8yKSB0aHJvdyBlXzIuZXJyb3I7IH1cbiAgICAgICAgfVxuICAgIH0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c3NlLmpzLm1hcCIsIi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuaW1wb3J0IHsgX19hc3luY0dlbmVyYXRvciwgX19hd2FpdCB9IGZyb20gXCJ0c2xpYlwiO1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVN0cmVhbShhc3luY0l0ZXIsIGNhbmNlbCkge1xuICAgIGNvbnN0IHN0cmVhbSA9IGl0ZXJhdG9yVG9TdHJlYW0oYXN5bmNJdGVyLCBjYW5jZWwpO1xuICAgIC8qKiBUT0RPOiByZW1vdmUgdGhlc2UgcG9seWZpbGxzIG9uY2UgYWxsIHN1cHBvcnRlZCBydW50aW1lcyBzdXBwb3J0IHRoZW0gKi9cbiAgICByZXR1cm4gcG9seWZpbGxTdHJlYW0oc3RyZWFtLCBjYW5jZWwpO1xufVxuZnVuY3Rpb24gcG9seWZpbGxTdHJlYW0oc3RyZWFtLCBkaXNwb3NlKSB7XG4gICAgbWFrZUFzeW5jSXRlcmFibGUoc3RyZWFtKTtcbiAgICBtYWtlQXN5bmNEaXNwb3NhYmxlKHN0cmVhbSwgZGlzcG9zZSk7XG4gICAgcmV0dXJuIHN0cmVhbTtcbn1cbmZ1bmN0aW9uIG1ha2VBc3luY0Rpc3Bvc2FibGUod2ViU3RyZWFtLCBkaXNwb3NlKSB7XG4gICAgdmFyIF9hO1xuICAgIChfYSA9IFN5bWJvbC5hc3luY0Rpc3Bvc2UpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IChTeW1ib2wuYXN5bmNEaXNwb3NlID0gU3ltYm9sKFwiU3ltYm9sLmFzeW5jRGlzcG9zZVwiKSk7XG4gICAgaWYgKCF3ZWJTdHJlYW1bU3ltYm9sLmFzeW5jRGlzcG9zZV0pIHtcbiAgICAgICAgd2ViU3RyZWFtW1N5bWJvbC5hc3luY0Rpc3Bvc2VdID0gKCkgPT4gZGlzcG9zZSgpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIG1ha2VBc3luY0l0ZXJhYmxlKHdlYlN0cmVhbSkge1xuICAgIGlmICghd2ViU3RyZWFtW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSkge1xuICAgICAgICB3ZWJTdHJlYW1bU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gKCkgPT4gdG9Bc3luY0l0ZXJhYmxlKHdlYlN0cmVhbSk7XG4gICAgfVxuICAgIGlmICghd2ViU3RyZWFtLnZhbHVlcykge1xuICAgICAgICB3ZWJTdHJlYW0udmFsdWVzID0gKCkgPT4gdG9Bc3luY0l0ZXJhYmxlKHdlYlN0cmVhbSk7XG4gICAgfVxufVxuZnVuY3Rpb24gaXRlcmF0b3JUb1N0cmVhbShpdGVyYXRvciwgY2FuY2VsKSB7XG4gICAgcmV0dXJuIG5ldyBSZWFkYWJsZVN0cmVhbSh7XG4gICAgICAgIGFzeW5jIHB1bGwoY29udHJvbGxlcikge1xuICAgICAgICAgICAgY29uc3QgeyB2YWx1ZSwgZG9uZSB9ID0gYXdhaXQgaXRlcmF0b3IubmV4dCgpO1xuICAgICAgICAgICAgaWYgKGRvbmUpIHtcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyLmNsb3NlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyLmVucXVldWUodmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBjYW5jZWwsXG4gICAgfSk7XG59XG5leHBvcnQgZnVuY3Rpb24gZW5zdXJlQXN5bmNJdGVyYWJsZShzdHJlYW0pIHtcbiAgICBpZiAoaXNSZWFkYWJsZVN0cmVhbShzdHJlYW0pKSB7XG4gICAgICAgIG1ha2VBc3luY0l0ZXJhYmxlKHN0cmVhbSk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjYW5jZWw6ICgpID0+IHN0cmVhbS5jYW5jZWwoKSxcbiAgICAgICAgICAgIGl0ZXJhYmxlOiBzdHJlYW0sXG4gICAgICAgIH07XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY2FuY2VsOiBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgICAgc3RyZWFtLnNvY2tldC5lbmQoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBpdGVyYWJsZTogc3RyZWFtLFxuICAgICAgICB9O1xuICAgIH1cbn1cbmZ1bmN0aW9uIGlzUmVhZGFibGVTdHJlYW0oYm9keSkge1xuICAgIHJldHVybiBCb29sZWFuKGJvZHkgJiZcbiAgICAgICAgdHlwZW9mIGJvZHkuZ2V0UmVhZGVyID09PSBcImZ1bmN0aW9uXCIgJiZcbiAgICAgICAgdHlwZW9mIGJvZHkudGVlID09PSBcImZ1bmN0aW9uXCIpO1xufVxuZnVuY3Rpb24gdG9Bc3luY0l0ZXJhYmxlKHN0cmVhbSkge1xuICAgIHJldHVybiBfX2FzeW5jR2VuZXJhdG9yKHRoaXMsIGFyZ3VtZW50cywgZnVuY3Rpb24qIHRvQXN5bmNJdGVyYWJsZV8xKCkge1xuICAgICAgICBjb25zdCByZWFkZXIgPSBzdHJlYW0uZ2V0UmVhZGVyKCk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgdmFsdWUsIGRvbmUgfSA9IHlpZWxkIF9fYXdhaXQocmVhZGVyLnJlYWQoKSk7XG4gICAgICAgICAgICAgICAgaWYgKGRvbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHlpZWxkIF9fYXdhaXQodm9pZCAwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgeWllbGQgeWllbGQgX19hd2FpdCh2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZmluYWxseSB7XG4gICAgICAgICAgICBjb25zdCBjYW5jZWxQcm9taXNlID0gcmVhZGVyLmNhbmNlbCgpO1xuICAgICAgICAgICAgcmVhZGVyLnJlbGVhc2VMb2NrKCk7XG4gICAgICAgICAgICB5aWVsZCBfX2F3YWl0KGNhbmNlbFByb21pc2UpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD11dGlscy5qcy5tYXAiLCIvLyBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi5cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbmV4cG9ydCB7IHVzZUluc3RydW1lbnRlciB9IGZyb20gXCIuL2luc3RydW1lbnRlci5qc1wiO1xuZXhwb3J0IHsgY3JlYXRlVHJhY2luZ0NsaWVudCB9IGZyb20gXCIuL3RyYWNpbmdDbGllbnQuanNcIjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsIi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuaW1wb3J0IHsgY3JlYXRlVHJhY2luZ0NvbnRleHQgfSBmcm9tIFwiLi90cmFjaW5nQ29udGV4dC5qc1wiO1xuaW1wb3J0IHsgc3RhdGUgfSBmcm9tIFwiLi9zdGF0ZS5qc1wiO1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZURlZmF1bHRUcmFjaW5nU3BhbigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBlbmQ6ICgpID0+IHtcbiAgICAgICAgICAgIC8vIG5vb3BcbiAgICAgICAgfSxcbiAgICAgICAgaXNSZWNvcmRpbmc6ICgpID0+IGZhbHNlLFxuICAgICAgICByZWNvcmRFeGNlcHRpb246ICgpID0+IHtcbiAgICAgICAgICAgIC8vIG5vb3BcbiAgICAgICAgfSxcbiAgICAgICAgc2V0QXR0cmlidXRlOiAoKSA9PiB7XG4gICAgICAgICAgICAvLyBub29wXG4gICAgICAgIH0sXG4gICAgICAgIHNldFN0YXR1czogKCkgPT4ge1xuICAgICAgICAgICAgLy8gbm9vcFxuICAgICAgICB9LFxuICAgIH07XG59XG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlRGVmYXVsdEluc3RydW1lbnRlcigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBjcmVhdGVSZXF1ZXN0SGVhZGVyczogKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgICB9LFxuICAgICAgICBwYXJzZVRyYWNlcGFyZW50SGVhZGVyOiAoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9LFxuICAgICAgICBzdGFydFNwYW46IChfbmFtZSwgc3Bhbk9wdGlvbnMpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3BhbjogY3JlYXRlRGVmYXVsdFRyYWNpbmdTcGFuKCksXG4gICAgICAgICAgICAgICAgdHJhY2luZ0NvbnRleHQ6IGNyZWF0ZVRyYWNpbmdDb250ZXh0KHsgcGFyZW50Q29udGV4dDogc3Bhbk9wdGlvbnMudHJhY2luZ0NvbnRleHQgfSksXG4gICAgICAgICAgICB9O1xuICAgICAgICB9LFxuICAgICAgICB3aXRoQ29udGV4dChfY29udGV4dCwgY2FsbGJhY2ssIC4uLmNhbGxiYWNrQXJncykge1xuICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKC4uLmNhbGxiYWNrQXJncyk7XG4gICAgICAgIH0sXG4gICAgfTtcbn1cbi8qKlxuICogRXh0ZW5kcyB0aGUgQXp1cmUgU0RLIHdpdGggc3VwcG9ydCBmb3IgYSBnaXZlbiBpbnN0cnVtZW50ZXIgaW1wbGVtZW50YXRpb24uXG4gKlxuICogQHBhcmFtIGluc3RydW1lbnRlciAtIFRoZSBpbnN0cnVtZW50ZXIgaW1wbGVtZW50YXRpb24gdG8gdXNlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gdXNlSW5zdHJ1bWVudGVyKGluc3RydW1lbnRlcikge1xuICAgIHN0YXRlLmluc3RydW1lbnRlckltcGxlbWVudGF0aW9uID0gaW5zdHJ1bWVudGVyO1xufVxuLyoqXG4gKiBHZXRzIHRoZSBjdXJyZW50bHkgc2V0IGluc3RydW1lbnRlciwgYSBOby1PcCBpbnN0cnVtZW50ZXIgYnkgZGVmYXVsdC5cbiAqXG4gKiBAcmV0dXJucyBUaGUgY3VycmVudGx5IHNldCBpbnN0cnVtZW50ZXJcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEluc3RydW1lbnRlcigpIHtcbiAgICBpZiAoIXN0YXRlLmluc3RydW1lbnRlckltcGxlbWVudGF0aW9uKSB7XG4gICAgICAgIHN0YXRlLmluc3RydW1lbnRlckltcGxlbWVudGF0aW9uID0gY3JlYXRlRGVmYXVsdEluc3RydW1lbnRlcigpO1xuICAgIH1cbiAgICByZXR1cm4gc3RhdGUuaW5zdHJ1bWVudGVySW1wbGVtZW50YXRpb247XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbnN0cnVtZW50ZXIuanMubWFwIiwiLy8gQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4vKipcbiAqIEJyb3dzZXItb25seSBpbXBsZW1lbnRhdGlvbiBvZiB0aGUgbW9kdWxlJ3Mgc3RhdGUuIFRoZSBicm93c2VyIGVzbSB2YXJpYW50IHdpbGwgbm90IGxvYWQgdGhlIGNvbW1vbmpzIHN0YXRlLCBzbyB3ZSBkbyBub3QgbmVlZCB0byBzaGFyZSBzdGF0ZSBiZXR3ZWVuIHRoZSB0d28uXG4gKi9cbmV4cG9ydCBjb25zdCBzdGF0ZSA9IHtcbiAgICBpbnN0cnVtZW50ZXJJbXBsZW1lbnRhdGlvbjogdW5kZWZpbmVkLFxufTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXN0YXRlLWJyb3dzZXIubWpzLm1hcCIsIi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuaW1wb3J0IHsgZ2V0SW5zdHJ1bWVudGVyIH0gZnJvbSBcIi4vaW5zdHJ1bWVudGVyLmpzXCI7XG5pbXBvcnQgeyBrbm93bkNvbnRleHRLZXlzIH0gZnJvbSBcIi4vdHJhY2luZ0NvbnRleHQuanNcIjtcbi8qKlxuICogQ3JlYXRlcyBhIG5ldyB0cmFjaW5nIGNsaWVudC5cbiAqXG4gKiBAcGFyYW0gb3B0aW9ucyAtIE9wdGlvbnMgdXNlZCB0byBjb25maWd1cmUgdGhlIHRyYWNpbmcgY2xpZW50LlxuICogQHJldHVybnMgLSBBbiBpbnN0YW5jZSBvZiB7QGxpbmsgVHJhY2luZ0NsaWVudH0uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVUcmFjaW5nQ2xpZW50KG9wdGlvbnMpIHtcbiAgICBjb25zdCB7IG5hbWVzcGFjZSwgcGFja2FnZU5hbWUsIHBhY2thZ2VWZXJzaW9uIH0gPSBvcHRpb25zO1xuICAgIGZ1bmN0aW9uIHN0YXJ0U3BhbihuYW1lLCBvcGVyYXRpb25PcHRpb25zLCBzcGFuT3B0aW9ucykge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIGNvbnN0IHN0YXJ0U3BhblJlc3VsdCA9IGdldEluc3RydW1lbnRlcigpLnN0YXJ0U3BhbihuYW1lLCBPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIHNwYW5PcHRpb25zKSwgeyBwYWNrYWdlTmFtZTogcGFja2FnZU5hbWUsIHBhY2thZ2VWZXJzaW9uOiBwYWNrYWdlVmVyc2lvbiwgdHJhY2luZ0NvbnRleHQ6IChfYSA9IG9wZXJhdGlvbk9wdGlvbnMgPT09IG51bGwgfHwgb3BlcmF0aW9uT3B0aW9ucyA9PT0gdm9pZCAwID8gdm9pZCAwIDogb3BlcmF0aW9uT3B0aW9ucy50cmFjaW5nT3B0aW9ucykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnRyYWNpbmdDb250ZXh0IH0pKTtcbiAgICAgICAgbGV0IHRyYWNpbmdDb250ZXh0ID0gc3RhcnRTcGFuUmVzdWx0LnRyYWNpbmdDb250ZXh0O1xuICAgICAgICBjb25zdCBzcGFuID0gc3RhcnRTcGFuUmVzdWx0LnNwYW47XG4gICAgICAgIGlmICghdHJhY2luZ0NvbnRleHQuZ2V0VmFsdWUoa25vd25Db250ZXh0S2V5cy5uYW1lc3BhY2UpKSB7XG4gICAgICAgICAgICB0cmFjaW5nQ29udGV4dCA9IHRyYWNpbmdDb250ZXh0LnNldFZhbHVlKGtub3duQ29udGV4dEtleXMubmFtZXNwYWNlLCBuYW1lc3BhY2UpO1xuICAgICAgICB9XG4gICAgICAgIHNwYW4uc2V0QXR0cmlidXRlKFwiYXoubmFtZXNwYWNlXCIsIHRyYWNpbmdDb250ZXh0LmdldFZhbHVlKGtub3duQ29udGV4dEtleXMubmFtZXNwYWNlKSk7XG4gICAgICAgIGNvbnN0IHVwZGF0ZWRPcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgb3BlcmF0aW9uT3B0aW9ucywge1xuICAgICAgICAgICAgdHJhY2luZ09wdGlvbnM6IE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgb3BlcmF0aW9uT3B0aW9ucyA9PT0gbnVsbCB8fCBvcGVyYXRpb25PcHRpb25zID09PSB2b2lkIDAgPyB2b2lkIDAgOiBvcGVyYXRpb25PcHRpb25zLnRyYWNpbmdPcHRpb25zKSwgeyB0cmFjaW5nQ29udGV4dCB9KSxcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzcGFuLFxuICAgICAgICAgICAgdXBkYXRlZE9wdGlvbnMsXG4gICAgICAgIH07XG4gICAgfVxuICAgIGFzeW5jIGZ1bmN0aW9uIHdpdGhTcGFuKG5hbWUsIG9wZXJhdGlvbk9wdGlvbnMsIGNhbGxiYWNrLCBzcGFuT3B0aW9ucykge1xuICAgICAgICBjb25zdCB7IHNwYW4sIHVwZGF0ZWRPcHRpb25zIH0gPSBzdGFydFNwYW4obmFtZSwgb3BlcmF0aW9uT3B0aW9ucywgc3Bhbk9wdGlvbnMpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgd2l0aENvbnRleHQodXBkYXRlZE9wdGlvbnMudHJhY2luZ09wdGlvbnMudHJhY2luZ0NvbnRleHQsICgpID0+IFByb21pc2UucmVzb2x2ZShjYWxsYmFjayh1cGRhdGVkT3B0aW9ucywgc3BhbikpKTtcbiAgICAgICAgICAgIHNwYW4uc2V0U3RhdHVzKHsgc3RhdHVzOiBcInN1Y2Nlc3NcIiB9KTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgc3Bhbi5zZXRTdGF0dXMoeyBzdGF0dXM6IFwiZXJyb3JcIiwgZXJyb3I6IGVyciB9KTtcbiAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgfVxuICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgIHNwYW4uZW5kKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gd2l0aENvbnRleHQoY29udGV4dCwgY2FsbGJhY2ssIC4uLmNhbGxiYWNrQXJncykge1xuICAgICAgICByZXR1cm4gZ2V0SW5zdHJ1bWVudGVyKCkud2l0aENvbnRleHQoY29udGV4dCwgY2FsbGJhY2ssIC4uLmNhbGxiYWNrQXJncyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFBhcnNlcyBhIHRyYWNlcGFyZW50IGhlYWRlciB2YWx1ZSBpbnRvIGEgc3BhbiBpZGVudGlmaWVyLlxuICAgICAqXG4gICAgICogQHBhcmFtIHRyYWNlcGFyZW50SGVhZGVyIC0gVGhlIHRyYWNlcGFyZW50IGhlYWRlciB0byBwYXJzZS5cbiAgICAgKiBAcmV0dXJucyBBbiBpbXBsZW1lbnRhdGlvbi1zcGVjaWZpYyBpZGVudGlmaWVyIGZvciB0aGUgc3Bhbi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBwYXJzZVRyYWNlcGFyZW50SGVhZGVyKHRyYWNlcGFyZW50SGVhZGVyKSB7XG4gICAgICAgIHJldHVybiBnZXRJbnN0cnVtZW50ZXIoKS5wYXJzZVRyYWNlcGFyZW50SGVhZGVyKHRyYWNlcGFyZW50SGVhZGVyKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIHNldCBvZiByZXF1ZXN0IGhlYWRlcnMgdG8gcHJvcGFnYXRlIHRyYWNpbmcgaW5mb3JtYXRpb24gdG8gYSBiYWNrZW5kLlxuICAgICAqXG4gICAgICogQHBhcmFtIHRyYWNpbmdDb250ZXh0IC0gVGhlIGNvbnRleHQgY29udGFpbmluZyB0aGUgc3BhbiB0byBzZXJpYWxpemUuXG4gICAgICogQHJldHVybnMgVGhlIHNldCBvZiBoZWFkZXJzIHRvIGFkZCB0byBhIHJlcXVlc3QuXG4gICAgICovXG4gICAgZnVuY3Rpb24gY3JlYXRlUmVxdWVzdEhlYWRlcnModHJhY2luZ0NvbnRleHQpIHtcbiAgICAgICAgcmV0dXJuIGdldEluc3RydW1lbnRlcigpLmNyZWF0ZVJlcXVlc3RIZWFkZXJzKHRyYWNpbmdDb250ZXh0KTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAgc3RhcnRTcGFuLFxuICAgICAgICB3aXRoU3BhbixcbiAgICAgICAgd2l0aENvbnRleHQsXG4gICAgICAgIHBhcnNlVHJhY2VwYXJlbnRIZWFkZXIsXG4gICAgICAgIGNyZWF0ZVJlcXVlc3RIZWFkZXJzLFxuICAgIH07XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD10cmFjaW5nQ2xpZW50LmpzLm1hcCIsIi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuLyoqIEBpbnRlcm5hbCAqL1xuZXhwb3J0IGNvbnN0IGtub3duQ29udGV4dEtleXMgPSB7XG4gICAgc3BhbjogU3ltYm9sLmZvcihcIkBhenVyZS9jb3JlLXRyYWNpbmcgc3BhblwiKSxcbiAgICBuYW1lc3BhY2U6IFN5bWJvbC5mb3IoXCJAYXp1cmUvY29yZS10cmFjaW5nIG5hbWVzcGFjZVwiKSxcbn07XG4vKipcbiAqIENyZWF0ZXMgYSBuZXcge0BsaW5rIFRyYWNpbmdDb250ZXh0fSB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICogQHBhcmFtIG9wdGlvbnMgLSBBIHNldCBvZiBrbm93biBrZXlzIHRoYXQgbWF5IGJlIHNldCBvbiB0aGUgY29udGV4dC5cbiAqIEByZXR1cm5zIEEgbmV3IHtAbGluayBUcmFjaW5nQ29udGV4dH0gd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAqXG4gKiBAaW50ZXJuYWxcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVRyYWNpbmdDb250ZXh0KG9wdGlvbnMgPSB7fSkge1xuICAgIGxldCBjb250ZXh0ID0gbmV3IFRyYWNpbmdDb250ZXh0SW1wbChvcHRpb25zLnBhcmVudENvbnRleHQpO1xuICAgIGlmIChvcHRpb25zLnNwYW4pIHtcbiAgICAgICAgY29udGV4dCA9IGNvbnRleHQuc2V0VmFsdWUoa25vd25Db250ZXh0S2V5cy5zcGFuLCBvcHRpb25zLnNwYW4pO1xuICAgIH1cbiAgICBpZiAob3B0aW9ucy5uYW1lc3BhY2UpIHtcbiAgICAgICAgY29udGV4dCA9IGNvbnRleHQuc2V0VmFsdWUoa25vd25Db250ZXh0S2V5cy5uYW1lc3BhY2UsIG9wdGlvbnMubmFtZXNwYWNlKTtcbiAgICB9XG4gICAgcmV0dXJuIGNvbnRleHQ7XG59XG4vKiogQGludGVybmFsICovXG5leHBvcnQgY2xhc3MgVHJhY2luZ0NvbnRleHRJbXBsIHtcbiAgICBjb25zdHJ1Y3Rvcihpbml0aWFsQ29udGV4dCkge1xuICAgICAgICB0aGlzLl9jb250ZXh0TWFwID1cbiAgICAgICAgICAgIGluaXRpYWxDb250ZXh0IGluc3RhbmNlb2YgVHJhY2luZ0NvbnRleHRJbXBsXG4gICAgICAgICAgICAgICAgPyBuZXcgTWFwKGluaXRpYWxDb250ZXh0Ll9jb250ZXh0TWFwKVxuICAgICAgICAgICAgICAgIDogbmV3IE1hcCgpO1xuICAgIH1cbiAgICBzZXRWYWx1ZShrZXksIHZhbHVlKSB7XG4gICAgICAgIGNvbnN0IG5ld0NvbnRleHQgPSBuZXcgVHJhY2luZ0NvbnRleHRJbXBsKHRoaXMpO1xuICAgICAgICBuZXdDb250ZXh0Ll9jb250ZXh0TWFwLnNldChrZXksIHZhbHVlKTtcbiAgICAgICAgcmV0dXJuIG5ld0NvbnRleHQ7XG4gICAgfVxuICAgIGdldFZhbHVlKGtleSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fY29udGV4dE1hcC5nZXQoa2V5KTtcbiAgICB9XG4gICAgZGVsZXRlVmFsdWUoa2V5KSB7XG4gICAgICAgIGNvbnN0IG5ld0NvbnRleHQgPSBuZXcgVHJhY2luZ0NvbnRleHRJbXBsKHRoaXMpO1xuICAgICAgICBuZXdDb250ZXh0Ll9jb250ZXh0TWFwLmRlbGV0ZShrZXkpO1xuICAgICAgICByZXR1cm4gbmV3Q29udGV4dDtcbiAgICB9XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD10cmFjaW5nQ29udGV4dC5qcy5tYXAiLCIvLyBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi5cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbi8qKlxuICogcHJvbWlzZS5yYWNlKCkgd3JhcHBlciB0aGF0IGFib3J0cyByZXN0IG9mIHByb21pc2VzIGFzIHNvb24gYXMgdGhlIGZpcnN0IHByb21pc2Ugc2V0dGxlcy5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNhbmNlbGFibGVQcm9taXNlUmFjZShhYm9ydGFibGVQcm9taXNlQnVpbGRlcnMsIG9wdGlvbnMpIHtcbiAgICB2YXIgX2EsIF9iO1xuICAgIGNvbnN0IGFib3J0ZXIgPSBuZXcgQWJvcnRDb250cm9sbGVyKCk7XG4gICAgZnVuY3Rpb24gYWJvcnRIYW5kbGVyKCkge1xuICAgICAgICBhYm9ydGVyLmFib3J0KCk7XG4gICAgfVxuICAgIChfYSA9IG9wdGlvbnMgPT09IG51bGwgfHwgb3B0aW9ucyA9PT0gdm9pZCAwID8gdm9pZCAwIDogb3B0aW9ucy5hYm9ydFNpZ25hbCkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmFkZEV2ZW50TGlzdGVuZXIoXCJhYm9ydFwiLCBhYm9ydEhhbmRsZXIpO1xuICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBhd2FpdCBQcm9taXNlLnJhY2UoYWJvcnRhYmxlUHJvbWlzZUJ1aWxkZXJzLm1hcCgocCkgPT4gcCh7IGFib3J0U2lnbmFsOiBhYm9ydGVyLnNpZ25hbCB9KSkpO1xuICAgIH1cbiAgICBmaW5hbGx5IHtcbiAgICAgICAgYWJvcnRlci5hYm9ydCgpO1xuICAgICAgICAoX2IgPSBvcHRpb25zID09PSBudWxsIHx8IG9wdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9wdGlvbnMuYWJvcnRTaWduYWwpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5yZW1vdmVFdmVudExpc3RlbmVyKFwiYWJvcnRcIiwgYWJvcnRIYW5kbGVyKTtcbiAgICB9XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1hYm9ydGVyVXRpbHMuanMubWFwIiwiLy8gQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4vKipcbiAqIFRoZSBoZWxwZXIgdGhhdCB0cmFuc2Zvcm1zIGJ5dGVzIHdpdGggc3BlY2lmaWMgY2hhcmFjdGVyIGVuY29kaW5nIGludG8gc3RyaW5nXG4gKiBAcGFyYW0gYnl0ZXMgLSB0aGUgdWludDhhcnJheSBieXRlc1xuICogQHBhcmFtIGZvcm1hdCAtIHRoZSBmb3JtYXQgd2UgdXNlIHRvIGVuY29kZSB0aGUgYnl0ZVxuICogQHJldHVybnMgYSBzdHJpbmcgb2YgdGhlIGVuY29kZWQgc3RyaW5nXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1aW50OEFycmF5VG9TdHJpbmcoYnl0ZXMsIGZvcm1hdCkge1xuICAgIHN3aXRjaCAoZm9ybWF0KSB7XG4gICAgICAgIGNhc2UgXCJ1dGYtOFwiOlxuICAgICAgICAgICAgcmV0dXJuIHVpbnQ4QXJyYXlUb1V0ZjhTdHJpbmcoYnl0ZXMpO1xuICAgICAgICBjYXNlIFwiYmFzZTY0XCI6XG4gICAgICAgICAgICByZXR1cm4gdWludDhBcnJheVRvQmFzZTY0KGJ5dGVzKTtcbiAgICAgICAgY2FzZSBcImJhc2U2NHVybFwiOlxuICAgICAgICAgICAgcmV0dXJuIHVpbnQ4QXJyYXlUb0Jhc2U2NFVybChieXRlcyk7XG4gICAgICAgIGNhc2UgXCJoZXhcIjpcbiAgICAgICAgICAgIHJldHVybiB1aW50OEFycmF5VG9IZXhTdHJpbmcoYnl0ZXMpO1xuICAgIH1cbn1cbi8qKlxuICogVGhlIGhlbHBlciB0aGF0IHRyYW5zZm9ybXMgc3RyaW5nIHRvIHNwZWNpZmljIGNoYXJhY3RlciBlbmNvZGVkIGJ5dGVzIGFycmF5LlxuICogQHBhcmFtIHZhbHVlIC0gdGhlIHN0cmluZyB0byBiZSBjb252ZXJ0ZWRcbiAqIEBwYXJhbSBmb3JtYXQgLSB0aGUgZm9ybWF0IHdlIHVzZSB0byBkZWNvZGUgdGhlIHZhbHVlXG4gKiBAcmV0dXJucyBhIHVpbnQ4YXJyYXlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHN0cmluZ1RvVWludDhBcnJheSh2YWx1ZSwgZm9ybWF0KSB7XG4gICAgc3dpdGNoIChmb3JtYXQpIHtcbiAgICAgICAgY2FzZSBcInV0Zi04XCI6XG4gICAgICAgICAgICByZXR1cm4gdXRmOFN0cmluZ1RvVWludDhBcnJheSh2YWx1ZSk7XG4gICAgICAgIGNhc2UgXCJiYXNlNjRcIjpcbiAgICAgICAgICAgIHJldHVybiBiYXNlNjRUb1VpbnQ4QXJyYXkodmFsdWUpO1xuICAgICAgICBjYXNlIFwiYmFzZTY0dXJsXCI6XG4gICAgICAgICAgICByZXR1cm4gYmFzZTY0VXJsVG9VaW50OEFycmF5KHZhbHVlKTtcbiAgICAgICAgY2FzZSBcImhleFwiOlxuICAgICAgICAgICAgcmV0dXJuIGhleFN0cmluZ1RvVWludDhBcnJheSh2YWx1ZSk7XG4gICAgfVxufVxuLyoqXG4gKiBEZWNvZGVzIGEgVWludDhBcnJheSBpbnRvIGEgQmFzZTY0IHN0cmluZy5cbiAqIEBpbnRlcm5hbFxuICovXG5leHBvcnQgZnVuY3Rpb24gdWludDhBcnJheVRvQmFzZTY0KGJ5dGVzKSB7XG4gICAgcmV0dXJuIGJ0b2EoWy4uLmJ5dGVzXS5tYXAoKHgpID0+IFN0cmluZy5mcm9tQ2hhckNvZGUoeCkpLmpvaW4oXCJcIikpO1xufVxuLyoqXG4gKiBEZWNvZGVzIGEgVWludDhBcnJheSBpbnRvIGEgQmFzZTY0VXJsIHN0cmluZy5cbiAqIEBpbnRlcm5hbFxuICovXG5leHBvcnQgZnVuY3Rpb24gdWludDhBcnJheVRvQmFzZTY0VXJsKGJ5dGVzKSB7XG4gICAgcmV0dXJuIHVpbnQ4QXJyYXlUb0Jhc2U2NChieXRlcykucmVwbGFjZSgvXFwrL2csIFwiLVwiKS5yZXBsYWNlKC9cXC8vZywgXCJfXCIpLnJlcGxhY2UoLz0vZywgXCJcIik7XG59XG4vKipcbiAqIERlY29kZXMgYSBVaW50OEFycmF5IGludG8gYSBqYXZhc2NyaXB0IHN0cmluZy5cbiAqIEBpbnRlcm5hbFxuICovXG5leHBvcnQgZnVuY3Rpb24gdWludDhBcnJheVRvVXRmOFN0cmluZyhieXRlcykge1xuICAgIGNvbnN0IGRlY29kZXIgPSBuZXcgVGV4dERlY29kZXIoKTtcbiAgICBjb25zdCBkYXRhU3RyaW5nID0gZGVjb2Rlci5kZWNvZGUoYnl0ZXMpO1xuICAgIHJldHVybiBkYXRhU3RyaW5nO1xufVxuLyoqXG4gKiBEZWNvZGVzIGEgVWludDhBcnJheSBpbnRvIGEgaGV4IHN0cmluZ1xuICogQGludGVybmFsXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1aW50OEFycmF5VG9IZXhTdHJpbmcoYnl0ZXMpIHtcbiAgICByZXR1cm4gWy4uLmJ5dGVzXS5tYXAoKHgpID0+IHgudG9TdHJpbmcoMTYpLnBhZFN0YXJ0KDIsIFwiMFwiKSkuam9pbihcIlwiKTtcbn1cbi8qKlxuICogRW5jb2RlcyBhIEphdmFTY3JpcHQgc3RyaW5nIGludG8gYSBVaW50OEFycmF5LlxuICogQGludGVybmFsXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1dGY4U3RyaW5nVG9VaW50OEFycmF5KHZhbHVlKSB7XG4gICAgcmV0dXJuIG5ldyBUZXh0RW5jb2RlcigpLmVuY29kZSh2YWx1ZSk7XG59XG4vKipcbiAqIEVuY29kZXMgYSBCYXNlNjQgc3RyaW5nIGludG8gYSBVaW50OEFycmF5LlxuICogQGludGVybmFsXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBiYXNlNjRUb1VpbnQ4QXJyYXkodmFsdWUpIHtcbiAgICByZXR1cm4gbmV3IFVpbnQ4QXJyYXkoWy4uLmF0b2IodmFsdWUpXS5tYXAoKHgpID0+IHguY2hhckNvZGVBdCgwKSkpO1xufVxuLyoqXG4gKiBFbmNvZGVzIGEgQmFzZTY0VXJsIHN0cmluZyBpbnRvIGEgVWludDhBcnJheS5cbiAqIEBpbnRlcm5hbFxuICovXG5leHBvcnQgZnVuY3Rpb24gYmFzZTY0VXJsVG9VaW50OEFycmF5KHZhbHVlKSB7XG4gICAgY29uc3QgYmFzZTY0U3RyaW5nID0gdmFsdWUucmVwbGFjZSgvLS9nLCBcIitcIikucmVwbGFjZSgvXy9nLCBcIi9cIik7XG4gICAgcmV0dXJuIGJhc2U2NFRvVWludDhBcnJheShiYXNlNjRTdHJpbmcpO1xufVxuY29uc3QgaGV4RGlnaXRzID0gbmV3IFNldChcIjAxMjM0NTY3ODlhYmNkZWZBQkNERUZcIik7XG4vKipcbiAqIEVuY29kZXMgYSBoZXggc3RyaW5nIGludG8gYSBVaW50OEFycmF5XG4gKiBAaW50ZXJuYWxcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGhleFN0cmluZ1RvVWludDhBcnJheSh2YWx1ZSkge1xuICAgIC8vIElmIHZhbHVlIGhhcyBvZGQgbGVuZ3RoLCB0aGUgbGFzdCBjaGFyYWN0ZXIgd2lsbCBiZSBpZ25vcmVkLCBjb25zaXN0ZW50IHdpdGggTm9kZUpTIEJ1ZmZlciBiZWhhdmlvclxuICAgIGNvbnN0IGJ5dGVzID0gbmV3IFVpbnQ4QXJyYXkodmFsdWUubGVuZ3RoIC8gMik7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB2YWx1ZS5sZW5ndGggLyAyOyArK2kpIHtcbiAgICAgICAgY29uc3QgaGlnaE5pYmJsZSA9IHZhbHVlWzIgKiBpXTtcbiAgICAgICAgY29uc3QgbG93TmliYmxlID0gdmFsdWVbMiAqIGkgKyAxXTtcbiAgICAgICAgaWYgKCFoZXhEaWdpdHMuaGFzKGhpZ2hOaWJibGUpIHx8ICFoZXhEaWdpdHMuaGFzKGxvd05pYmJsZSkpIHtcbiAgICAgICAgICAgIC8vIFJlcGxpY2F0ZSBOb2RlIEJ1ZmZlciBiZWhhdmlvciBieSBleGl0aW5nIGVhcmx5IHdoZW4gd2UgZW5jb3VudGVyIGFuIGludmFsaWQgYnl0ZVxuICAgICAgICAgICAgcmV0dXJuIGJ5dGVzLnNsaWNlKDAsIGkpO1xuICAgICAgICB9XG4gICAgICAgIGJ5dGVzW2ldID0gcGFyc2VJbnQoYCR7aGlnaE5pYmJsZX0ke2xvd05pYmJsZX1gLCAxNik7XG4gICAgfVxuICAgIHJldHVybiBieXRlcztcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWJ5dGVzRW5jb2RpbmctYnJvd3Nlci5tanMubWFwIiwiLy8gQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG52YXIgX2EsIF9iLCBfYywgX2Q7XG4vKipcbiAqIEEgY29uc3RhbnQgdGhhdCBpbmRpY2F0ZXMgd2hldGhlciB0aGUgZW52aXJvbm1lbnQgdGhlIGNvZGUgaXMgcnVubmluZyBpcyBhIFdlYiBCcm93c2VyLlxuICovXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQGF6dXJlL2F6dXJlLXNkay90cy1uby13aW5kb3dcbmV4cG9ydCBjb25zdCBpc0Jyb3dzZXIgPSB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiICYmIHR5cGVvZiB3aW5kb3cuZG9jdW1lbnQgIT09IFwidW5kZWZpbmVkXCI7XG4vKipcbiAqIEEgY29uc3RhbnQgdGhhdCBpbmRpY2F0ZXMgd2hldGhlciB0aGUgZW52aXJvbm1lbnQgdGhlIGNvZGUgaXMgcnVubmluZyBpcyBhIFdlYiBXb3JrZXIuXG4gKi9cbmV4cG9ydCBjb25zdCBpc1dlYldvcmtlciA9IHR5cGVvZiBzZWxmID09PSBcIm9iamVjdFwiICYmXG4gICAgdHlwZW9mIChzZWxmID09PSBudWxsIHx8IHNlbGYgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHNlbGYuaW1wb3J0U2NyaXB0cykgPT09IFwiZnVuY3Rpb25cIiAmJlxuICAgICgoKF9hID0gc2VsZi5jb25zdHJ1Y3RvcikgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLm5hbWUpID09PSBcIkRlZGljYXRlZFdvcmtlckdsb2JhbFNjb3BlXCIgfHxcbiAgICAgICAgKChfYiA9IHNlbGYuY29uc3RydWN0b3IpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5uYW1lKSA9PT0gXCJTZXJ2aWNlV29ya2VyR2xvYmFsU2NvcGVcIiB8fFxuICAgICAgICAoKF9jID0gc2VsZi5jb25zdHJ1Y3RvcikgPT09IG51bGwgfHwgX2MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9jLm5hbWUpID09PSBcIlNoYXJlZFdvcmtlckdsb2JhbFNjb3BlXCIpO1xuLyoqXG4gKiBBIGNvbnN0YW50IHRoYXQgaW5kaWNhdGVzIHdoZXRoZXIgdGhlIGVudmlyb25tZW50IHRoZSBjb2RlIGlzIHJ1bm5pbmcgaXMgRGVuby5cbiAqL1xuZXhwb3J0IGNvbnN0IGlzRGVubyA9IHR5cGVvZiBEZW5vICE9PSBcInVuZGVmaW5lZFwiICYmXG4gICAgdHlwZW9mIERlbm8udmVyc2lvbiAhPT0gXCJ1bmRlZmluZWRcIiAmJlxuICAgIHR5cGVvZiBEZW5vLnZlcnNpb24uZGVubyAhPT0gXCJ1bmRlZmluZWRcIjtcbi8qKlxuICogQSBjb25zdGFudCB0aGF0IGluZGljYXRlcyB3aGV0aGVyIHRoZSBlbnZpcm9ubWVudCB0aGUgY29kZSBpcyBydW5uaW5nIGlzIEJ1bi5zaC5cbiAqL1xuZXhwb3J0IGNvbnN0IGlzQnVuID0gdHlwZW9mIEJ1biAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2YgQnVuLnZlcnNpb24gIT09IFwidW5kZWZpbmVkXCI7XG4vKipcbiAqIEEgY29uc3RhbnQgdGhhdCBpbmRpY2F0ZXMgd2hldGhlciB0aGUgZW52aXJvbm1lbnQgdGhlIGNvZGUgaXMgcnVubmluZyBpcyBhIE5vZGUuanMgY29tcGF0aWJsZSBlbnZpcm9ubWVudC5cbiAqL1xuZXhwb3J0IGNvbnN0IGlzTm9kZUxpa2UgPSB0eXBlb2YgZ2xvYmFsVGhpcy5wcm9jZXNzICE9PSBcInVuZGVmaW5lZFwiICYmXG4gICAgQm9vbGVhbihnbG9iYWxUaGlzLnByb2Nlc3MudmVyc2lvbikgJiZcbiAgICBCb29sZWFuKChfZCA9IGdsb2JhbFRoaXMucHJvY2Vzcy52ZXJzaW9ucykgPT09IG51bGwgfHwgX2QgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9kLm5vZGUpO1xuLyoqXG4gKiBBIGNvbnN0YW50IHRoYXQgaW5kaWNhdGVzIHdoZXRoZXIgdGhlIGVudmlyb25tZW50IHRoZSBjb2RlIGlzIHJ1bm5pbmcgaXMgYSBOb2RlLmpzIGNvbXBhdGlibGUgZW52aXJvbm1lbnQuXG4gKiBAZGVwcmVjYXRlZCBVc2UgYGlzTm9kZUxpa2VgIGluc3RlYWQuXG4gKi9cbmV4cG9ydCBjb25zdCBpc05vZGUgPSBpc05vZGVMaWtlO1xuLyoqXG4gKiBBIGNvbnN0YW50IHRoYXQgaW5kaWNhdGVzIHdoZXRoZXIgdGhlIGVudmlyb25tZW50IHRoZSBjb2RlIGlzIHJ1bm5pbmcgaXMgTm9kZS5KUy5cbiAqL1xuZXhwb3J0IGNvbnN0IGlzTm9kZVJ1bnRpbWUgPSBpc05vZGVMaWtlICYmICFpc0J1biAmJiAhaXNEZW5vO1xuLyoqXG4gKiBBIGNvbnN0YW50IHRoYXQgaW5kaWNhdGVzIHdoZXRoZXIgdGhlIGVudmlyb25tZW50IHRoZSBjb2RlIGlzIHJ1bm5pbmcgaXMgaW4gUmVhY3QtTmF0aXZlLlxuICovXG4vLyBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVhY3QtbmF0aXZlL2Jsb2IvbWFpbi9wYWNrYWdlcy9yZWFjdC1uYXRpdmUvTGlicmFyaWVzL0NvcmUvc2V0VXBOYXZpZ2F0b3IuanNcbmV4cG9ydCBjb25zdCBpc1JlYWN0TmF0aXZlID0gdHlwZW9mIG5hdmlnYXRvciAhPT0gXCJ1bmRlZmluZWRcIiAmJiAobmF2aWdhdG9yID09PSBudWxsIHx8IG5hdmlnYXRvciA9PT0gdm9pZCAwID8gdm9pZCAwIDogbmF2aWdhdG9yLnByb2R1Y3QpID09PSBcIlJlYWN0TmF0aXZlXCI7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jaGVja0Vudmlyb25tZW50LmpzLm1hcCIsIi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuaW1wb3J0IHsgQWJvcnRFcnJvciB9IGZyb20gXCJAYXp1cmUvYWJvcnQtY29udHJvbGxlclwiO1xuLyoqXG4gKiBDcmVhdGVzIGFuIGFib3J0YWJsZSBwcm9taXNlLlxuICogQHBhcmFtIGJ1aWxkUHJvbWlzZSAtIEEgZnVuY3Rpb24gdGhhdCB0YWtlcyB0aGUgcmVzb2x2ZSBhbmQgcmVqZWN0IGZ1bmN0aW9ucyBhcyBwYXJhbWV0ZXJzLlxuICogQHBhcmFtIG9wdGlvbnMgLSBUaGUgb3B0aW9ucyBmb3IgdGhlIGFib3J0YWJsZSBwcm9taXNlLlxuICogQHJldHVybnMgQSBwcm9taXNlIHRoYXQgY2FuIGJlIGFib3J0ZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVBYm9ydGFibGVQcm9taXNlKGJ1aWxkUHJvbWlzZSwgb3B0aW9ucykge1xuICAgIGNvbnN0IHsgY2xlYW51cEJlZm9yZUFib3J0LCBhYm9ydFNpZ25hbCwgYWJvcnRFcnJvck1zZyB9ID0gb3B0aW9ucyAhPT0gbnVsbCAmJiBvcHRpb25zICE9PSB2b2lkIDAgPyBvcHRpb25zIDoge307XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0T25BYm9ydCgpIHtcbiAgICAgICAgICAgIHJlamVjdChuZXcgQWJvcnRFcnJvcihhYm9ydEVycm9yTXNnICE9PSBudWxsICYmIGFib3J0RXJyb3JNc2cgIT09IHZvaWQgMCA/IGFib3J0RXJyb3JNc2cgOiBcIlRoZSBvcGVyYXRpb24gd2FzIGFib3J0ZWQuXCIpKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiByZW1vdmVMaXN0ZW5lcnMoKSB7XG4gICAgICAgICAgICBhYm9ydFNpZ25hbCA9PT0gbnVsbCB8fCBhYm9ydFNpZ25hbCA9PT0gdm9pZCAwID8gdm9pZCAwIDogYWJvcnRTaWduYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImFib3J0XCIsIG9uQWJvcnQpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIG9uQWJvcnQoKSB7XG4gICAgICAgICAgICBjbGVhbnVwQmVmb3JlQWJvcnQgPT09IG51bGwgfHwgY2xlYW51cEJlZm9yZUFib3J0ID09PSB2b2lkIDAgPyB2b2lkIDAgOiBjbGVhbnVwQmVmb3JlQWJvcnQoKTtcbiAgICAgICAgICAgIHJlbW92ZUxpc3RlbmVycygpO1xuICAgICAgICAgICAgcmVqZWN0T25BYm9ydCgpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhYm9ydFNpZ25hbCA9PT0gbnVsbCB8fCBhYm9ydFNpZ25hbCA9PT0gdm9pZCAwID8gdm9pZCAwIDogYWJvcnRTaWduYWwuYWJvcnRlZCkge1xuICAgICAgICAgICAgcmV0dXJuIHJlamVjdE9uQWJvcnQoKTtcbiAgICAgICAgfVxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgYnVpbGRQcm9taXNlKCh4KSA9PiB7XG4gICAgICAgICAgICAgICAgcmVtb3ZlTGlzdGVuZXJzKCk7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh4KTtcbiAgICAgICAgICAgIH0sICh4KSA9PiB7XG4gICAgICAgICAgICAgICAgcmVtb3ZlTGlzdGVuZXJzKCk7XG4gICAgICAgICAgICAgICAgcmVqZWN0KHgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgIH1cbiAgICAgICAgYWJvcnRTaWduYWwgPT09IG51bGwgfHwgYWJvcnRTaWduYWwgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGFib3J0U2lnbmFsLmFkZEV2ZW50TGlzdGVuZXIoXCJhYm9ydFwiLCBvbkFib3J0KTtcbiAgICB9KTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNyZWF0ZUFib3J0YWJsZVByb21pc2UuanMubWFwIiwiLy8gQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG5pbXBvcnQgeyBjcmVhdGVBYm9ydGFibGVQcm9taXNlIH0gZnJvbSBcIi4vY3JlYXRlQWJvcnRhYmxlUHJvbWlzZS5qc1wiO1xuY29uc3QgU3RhbmRhcmRBYm9ydE1lc3NhZ2UgPSBcIlRoZSBkZWxheSB3YXMgYWJvcnRlZC5cIjtcbi8qKlxuICogQSB3cmFwcGVyIGZvciBzZXRUaW1lb3V0IHRoYXQgcmVzb2x2ZXMgYSBwcm9taXNlIGFmdGVyIHRpbWVJbk1zIG1pbGxpc2Vjb25kcy5cbiAqIEBwYXJhbSB0aW1lSW5NcyAtIFRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRvIGJlIGRlbGF5ZWQuXG4gKiBAcGFyYW0gb3B0aW9ucyAtIFRoZSBvcHRpb25zIGZvciBkZWxheSAtIGN1cnJlbnRseSBhYm9ydCBvcHRpb25zXG4gKiBAcmV0dXJucyBQcm9taXNlIHRoYXQgaXMgcmVzb2x2ZWQgYWZ0ZXIgdGltZUluTXNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlbGF5KHRpbWVJbk1zLCBvcHRpb25zKSB7XG4gICAgbGV0IHRva2VuO1xuICAgIGNvbnN0IHsgYWJvcnRTaWduYWwsIGFib3J0RXJyb3JNc2cgfSA9IG9wdGlvbnMgIT09IG51bGwgJiYgb3B0aW9ucyAhPT0gdm9pZCAwID8gb3B0aW9ucyA6IHt9O1xuICAgIHJldHVybiBjcmVhdGVBYm9ydGFibGVQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgIHRva2VuID0gc2V0VGltZW91dChyZXNvbHZlLCB0aW1lSW5Ncyk7XG4gICAgfSwge1xuICAgICAgICBjbGVhbnVwQmVmb3JlQWJvcnQ6ICgpID0+IGNsZWFyVGltZW91dCh0b2tlbiksXG4gICAgICAgIGFib3J0U2lnbmFsLFxuICAgICAgICBhYm9ydEVycm9yTXNnOiBhYm9ydEVycm9yTXNnICE9PSBudWxsICYmIGFib3J0RXJyb3JNc2cgIT09IHZvaWQgMCA/IGFib3J0RXJyb3JNc2cgOiBTdGFuZGFyZEFib3J0TWVzc2FnZSxcbiAgICB9KTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRlbGF5LmpzLm1hcCIsIi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuaW1wb3J0IHsgaXNPYmplY3QgfSBmcm9tIFwiLi9vYmplY3QuanNcIjtcbi8qKlxuICogVHlwZWd1YXJkIGZvciBhbiBlcnJvciBvYmplY3Qgc2hhcGUgKGhhcyBuYW1lIGFuZCBtZXNzYWdlKVxuICogQHBhcmFtIGUgLSBTb21ldGhpbmcgY2F1Z2h0IGJ5IGEgY2F0Y2ggY2xhdXNlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNFcnJvcihlKSB7XG4gICAgaWYgKGlzT2JqZWN0KGUpKSB7XG4gICAgICAgIGNvbnN0IGhhc05hbWUgPSB0eXBlb2YgZS5uYW1lID09PSBcInN0cmluZ1wiO1xuICAgICAgICBjb25zdCBoYXNNZXNzYWdlID0gdHlwZW9mIGUubWVzc2FnZSA9PT0gXCJzdHJpbmdcIjtcbiAgICAgICAgcmV0dXJuIGhhc05hbWUgJiYgaGFzTWVzc2FnZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuLyoqXG4gKiBHaXZlbiB3aGF0IGlzIHRob3VnaHQgdG8gYmUgYW4gZXJyb3Igb2JqZWN0LCByZXR1cm4gdGhlIG1lc3NhZ2UgaWYgcG9zc2libGUuXG4gKiBJZiB0aGUgbWVzc2FnZSBpcyBtaXNzaW5nLCByZXR1cm5zIGEgc3RyaW5naWZpZWQgdmVyc2lvbiBvZiB0aGUgaW5wdXQuXG4gKiBAcGFyYW0gZSAtIFNvbWV0aGluZyB0aHJvd24gZnJvbSBhIHRyeSBibG9ja1xuICogQHJldHVybnMgVGhlIGVycm9yIG1lc3NhZ2Ugb3IgYSBzdHJpbmcgb2YgdGhlIGlucHV0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRFcnJvck1lc3NhZ2UoZSkge1xuICAgIGlmIChpc0Vycm9yKGUpKSB7XG4gICAgICAgIHJldHVybiBlLm1lc3NhZ2U7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBsZXQgc3RyaW5naWZpZWQ7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGUgPT09IFwib2JqZWN0XCIgJiYgZSkge1xuICAgICAgICAgICAgICAgIHN0cmluZ2lmaWVkID0gSlNPTi5zdHJpbmdpZnkoZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBzdHJpbmdpZmllZCA9IFN0cmluZyhlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBzdHJpbmdpZmllZCA9IFwiW3VuYWJsZSB0byBzdHJpbmdpZnkgaW5wdXRdXCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGBVbmtub3duIGVycm9yICR7c3RyaW5naWZpZWR9YDtcbiAgICB9XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1lcnJvci5qcy5tYXAiLCIvLyBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi5cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbmV4cG9ydCB7IGRlbGF5IH0gZnJvbSBcIi4vZGVsYXkuanNcIjtcbmV4cG9ydCB7IGNhbmNlbGFibGVQcm9taXNlUmFjZSwgfSBmcm9tIFwiLi9hYm9ydGVyVXRpbHMuanNcIjtcbmV4cG9ydCB7IGNyZWF0ZUFib3J0YWJsZVByb21pc2UsIH0gZnJvbSBcIi4vY3JlYXRlQWJvcnRhYmxlUHJvbWlzZS5qc1wiO1xuZXhwb3J0IHsgZ2V0UmFuZG9tSW50ZWdlckluY2x1c2l2ZSB9IGZyb20gXCIuL3JhbmRvbS5qc1wiO1xuZXhwb3J0IHsgaXNPYmplY3QgfSBmcm9tIFwiLi9vYmplY3QuanNcIjtcbmV4cG9ydCB7IGlzRXJyb3IsIGdldEVycm9yTWVzc2FnZSB9IGZyb20gXCIuL2Vycm9yLmpzXCI7XG5leHBvcnQgeyBjb21wdXRlU2hhMjU2SGFzaCwgY29tcHV0ZVNoYTI1NkhtYWMgfSBmcm9tIFwiLi9zaGEyNTYuanNcIjtcbmV4cG9ydCB7IGlzRGVmaW5lZCwgaXNPYmplY3RXaXRoUHJvcGVydGllcywgb2JqZWN0SGFzUHJvcGVydHkgfSBmcm9tIFwiLi90eXBlR3VhcmRzLmpzXCI7XG5leHBvcnQgeyByYW5kb21VVUlEIH0gZnJvbSBcIi4vdXVpZFV0aWxzLmpzXCI7XG5leHBvcnQgeyBpc0Jyb3dzZXIsIGlzQnVuLCBpc05vZGUsIGlzTm9kZUxpa2UsIGlzTm9kZVJ1bnRpbWUsIGlzRGVubywgaXNSZWFjdE5hdGl2ZSwgaXNXZWJXb3JrZXIsIH0gZnJvbSBcIi4vY2hlY2tFbnZpcm9ubWVudC5qc1wiO1xuZXhwb3J0IHsgdWludDhBcnJheVRvU3RyaW5nLCBzdHJpbmdUb1VpbnQ4QXJyYXkgfSBmcm9tIFwiLi9ieXRlc0VuY29kaW5nLmpzXCI7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiLCIvLyBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi5cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbi8qKlxuICogSGVscGVyIHRvIGRldGVybWluZSB3aGVuIGFuIGlucHV0IGlzIGEgZ2VuZXJpYyBKUyBvYmplY3QuXG4gKiBAcmV0dXJucyB0cnVlIHdoZW4gaW5wdXQgaXMgYW4gb2JqZWN0IHR5cGUgdGhhdCBpcyBub3QgbnVsbCwgQXJyYXksIFJlZ0V4cCwgb3IgRGF0ZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzT2JqZWN0KGlucHV0KSB7XG4gICAgcmV0dXJuICh0eXBlb2YgaW5wdXQgPT09IFwib2JqZWN0XCIgJiZcbiAgICAgICAgaW5wdXQgIT09IG51bGwgJiZcbiAgICAgICAgIUFycmF5LmlzQXJyYXkoaW5wdXQpICYmXG4gICAgICAgICEoaW5wdXQgaW5zdGFuY2VvZiBSZWdFeHApICYmXG4gICAgICAgICEoaW5wdXQgaW5zdGFuY2VvZiBEYXRlKSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1vYmplY3QuanMubWFwIiwiLy8gQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4vKipcbiAqIFJldHVybnMgYSByYW5kb20gaW50ZWdlciB2YWx1ZSBiZXR3ZWVuIGEgbG93ZXIgYW5kIHVwcGVyIGJvdW5kLFxuICogaW5jbHVzaXZlIG9mIGJvdGggYm91bmRzLlxuICogTm90ZSB0aGF0IHRoaXMgdXNlcyBNYXRoLnJhbmRvbSBhbmQgaXNuJ3Qgc2VjdXJlLiBJZiB5b3UgbmVlZCB0byB1c2VcbiAqIHRoaXMgZm9yIGFueSBraW5kIG9mIHNlY3VyaXR5IHB1cnBvc2UsIGZpbmQgYSBiZXR0ZXIgc291cmNlIG9mIHJhbmRvbS5cbiAqIEBwYXJhbSBtaW4gLSBUaGUgc21hbGxlc3QgaW50ZWdlciB2YWx1ZSBhbGxvd2VkLlxuICogQHBhcmFtIG1heCAtIFRoZSBsYXJnZXN0IGludGVnZXIgdmFsdWUgYWxsb3dlZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFJhbmRvbUludGVnZXJJbmNsdXNpdmUobWluLCBtYXgpIHtcbiAgICAvLyBNYWtlIHN1cmUgaW5wdXRzIGFyZSBpbnRlZ2Vycy5cbiAgICBtaW4gPSBNYXRoLmNlaWwobWluKTtcbiAgICBtYXggPSBNYXRoLmZsb29yKG1heCk7XG4gICAgLy8gUGljayBhIHJhbmRvbSBvZmZzZXQgZnJvbSB6ZXJvIHRvIHRoZSBzaXplIG9mIHRoZSByYW5nZS5cbiAgICAvLyBTaW5jZSBNYXRoLnJhbmRvbSgpIGNhbiBuZXZlciByZXR1cm4gMSwgd2UgaGF2ZSB0byBtYWtlIHRoZSByYW5nZSBvbmUgbGFyZ2VyXG4gICAgLy8gaW4gb3JkZXIgdG8gYmUgaW5jbHVzaXZlIG9mIHRoZSBtYXhpbXVtIHZhbHVlIGFmdGVyIHdlIHRha2UgdGhlIGZsb29yLlxuICAgIGNvbnN0IG9mZnNldCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSk7XG4gICAgcmV0dXJuIG9mZnNldCArIG1pbjtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXJhbmRvbS5qcy5tYXAiLCIvLyBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi5cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbmltcG9ydCB7IHN0cmluZ1RvVWludDhBcnJheSwgdWludDhBcnJheVRvU3RyaW5nIH0gZnJvbSBcIi4vYnl0ZXNFbmNvZGluZy5qc1wiO1xubGV0IHN1YnRsZUNyeXB0bztcbi8qKlxuICogUmV0dXJucyBhIGNhY2hlZCByZWZlcmVuY2UgdG8gdGhlIFdlYiBBUEkgY3J5cHRvLnN1YnRsZSBvYmplY3QuXG4gKiBAaW50ZXJuYWxcbiAqL1xuZnVuY3Rpb24gZ2V0Q3J5cHRvKCkge1xuICAgIGlmIChzdWJ0bGVDcnlwdG8pIHtcbiAgICAgICAgcmV0dXJuIHN1YnRsZUNyeXB0bztcbiAgICB9XG4gICAgaWYgKCFzZWxmLmNyeXB0byB8fCAhc2VsZi5jcnlwdG8uc3VidGxlKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIllvdXIgYnJvd3NlciBlbnZpcm9ubWVudCBkb2VzIG5vdCBzdXBwb3J0IGNyeXB0b2dyYXBoeSBmdW5jdGlvbnMuXCIpO1xuICAgIH1cbiAgICBzdWJ0bGVDcnlwdG8gPSBzZWxmLmNyeXB0by5zdWJ0bGU7XG4gICAgcmV0dXJuIHN1YnRsZUNyeXB0bztcbn1cbi8qKlxuICogR2VuZXJhdGVzIGEgU0hBLTI1NiBITUFDIHNpZ25hdHVyZS5cbiAqIEBwYXJhbSBrZXkgLSBUaGUgSE1BQyBrZXkgcmVwcmVzZW50ZWQgYXMgYSBiYXNlNjQgc3RyaW5nLCB1c2VkIHRvIGdlbmVyYXRlIHRoZSBjcnlwdG9ncmFwaGljIEhNQUMgaGFzaC5cbiAqIEBwYXJhbSBzdHJpbmdUb1NpZ24gLSBUaGUgZGF0YSB0byBiZSBzaWduZWQuXG4gKiBAcGFyYW0gZW5jb2RpbmcgLSBUaGUgdGV4dHVhbCBlbmNvZGluZyB0byB1c2UgZm9yIHRoZSByZXR1cm5lZCBITUFDIGRpZ2VzdC5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNvbXB1dGVTaGEyNTZIbWFjKGtleSwgc3RyaW5nVG9TaWduLCBlbmNvZGluZykge1xuICAgIGNvbnN0IGNyeXB0byA9IGdldENyeXB0bygpO1xuICAgIGNvbnN0IGtleUJ5dGVzID0gc3RyaW5nVG9VaW50OEFycmF5KGtleSwgXCJiYXNlNjRcIik7XG4gICAgY29uc3Qgc3RyaW5nVG9TaWduQnl0ZXMgPSBzdHJpbmdUb1VpbnQ4QXJyYXkoc3RyaW5nVG9TaWduLCBcInV0Zi04XCIpO1xuICAgIGNvbnN0IGNyeXB0b0tleSA9IGF3YWl0IGNyeXB0by5pbXBvcnRLZXkoXCJyYXdcIiwga2V5Qnl0ZXMsIHtcbiAgICAgICAgbmFtZTogXCJITUFDXCIsXG4gICAgICAgIGhhc2g6IHsgbmFtZTogXCJTSEEtMjU2XCIgfSxcbiAgICB9LCBmYWxzZSwgW1wic2lnblwiXSk7XG4gICAgY29uc3Qgc2lnbmF0dXJlID0gYXdhaXQgY3J5cHRvLnNpZ24oe1xuICAgICAgICBuYW1lOiBcIkhNQUNcIixcbiAgICAgICAgaGFzaDogeyBuYW1lOiBcIlNIQS0yNTZcIiB9LFxuICAgIH0sIGNyeXB0b0tleSwgc3RyaW5nVG9TaWduQnl0ZXMpO1xuICAgIHJldHVybiB1aW50OEFycmF5VG9TdHJpbmcobmV3IFVpbnQ4QXJyYXkoc2lnbmF0dXJlKSwgZW5jb2RpbmcpO1xufVxuLyoqXG4gKiBHZW5lcmF0ZXMgYSBTSEEtMjU2IGhhc2guXG4gKiBAcGFyYW0gY29udGVudCAtIFRoZSBkYXRhIHRvIGJlIGluY2x1ZGVkIGluIHRoZSBoYXNoLlxuICogQHBhcmFtIGVuY29kaW5nIC0gVGhlIHRleHR1YWwgZW5jb2RpbmcgdG8gdXNlIGZvciB0aGUgcmV0dXJuZWQgaGFzaC5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNvbXB1dGVTaGEyNTZIYXNoKGNvbnRlbnQsIGVuY29kaW5nKSB7XG4gICAgY29uc3QgY29udGVudEJ5dGVzID0gc3RyaW5nVG9VaW50OEFycmF5KGNvbnRlbnQsIFwidXRmLThcIik7XG4gICAgY29uc3QgZGlnZXN0ID0gYXdhaXQgZ2V0Q3J5cHRvKCkuZGlnZXN0KHsgbmFtZTogXCJTSEEtMjU2XCIgfSwgY29udGVudEJ5dGVzKTtcbiAgICByZXR1cm4gdWludDhBcnJheVRvU3RyaW5nKG5ldyBVaW50OEFycmF5KGRpZ2VzdCksIGVuY29kaW5nKTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXNoYTI1Ni1icm93c2VyLm1qcy5tYXAiLCIvLyBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi5cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbi8qKlxuICogSGVscGVyIFR5cGVHdWFyZCB0aGF0IGNoZWNrcyBpZiBzb21ldGhpbmcgaXMgZGVmaW5lZCBvciBub3QuXG4gKiBAcGFyYW0gdGhpbmcgLSBBbnl0aGluZ1xuICovXG5leHBvcnQgZnVuY3Rpb24gaXNEZWZpbmVkKHRoaW5nKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB0aGluZyAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0aGluZyAhPT0gbnVsbDtcbn1cbi8qKlxuICogSGVscGVyIFR5cGVHdWFyZCB0aGF0IGNoZWNrcyBpZiB0aGUgaW5wdXQgaXMgYW4gb2JqZWN0IHdpdGggdGhlIHNwZWNpZmllZCBwcm9wZXJ0aWVzLlxuICogQHBhcmFtIHRoaW5nIC0gQW55dGhpbmcuXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIFRoZSBuYW1lIG9mIHRoZSBwcm9wZXJ0aWVzIHRoYXQgc2hvdWxkIGFwcGVhciBpbiB0aGUgb2JqZWN0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNPYmplY3RXaXRoUHJvcGVydGllcyh0aGluZywgcHJvcGVydGllcykge1xuICAgIGlmICghaXNEZWZpbmVkKHRoaW5nKSB8fCB0eXBlb2YgdGhpbmcgIT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IHByb3BlcnR5IG9mIHByb3BlcnRpZXMpIHtcbiAgICAgICAgaWYgKCFvYmplY3RIYXNQcm9wZXJ0eSh0aGluZywgcHJvcGVydHkpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG59XG4vKipcbiAqIEhlbHBlciBUeXBlR3VhcmQgdGhhdCBjaGVja3MgaWYgdGhlIGlucHV0IGlzIGFuIG9iamVjdCB3aXRoIHRoZSBzcGVjaWZpZWQgcHJvcGVydHkuXG4gKiBAcGFyYW0gdGhpbmcgLSBBbnkgb2JqZWN0LlxuICogQHBhcmFtIHByb3BlcnR5IC0gVGhlIG5hbWUgb2YgdGhlIHByb3BlcnR5IHRoYXQgc2hvdWxkIGFwcGVhciBpbiB0aGUgb2JqZWN0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gb2JqZWN0SGFzUHJvcGVydHkodGhpbmcsIHByb3BlcnR5KSB7XG4gICAgcmV0dXJuIChpc0RlZmluZWQodGhpbmcpICYmIHR5cGVvZiB0aGluZyA9PT0gXCJvYmplY3RcIiAmJiBwcm9wZXJ0eSBpbiB0aGluZyk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD10eXBlR3VhcmRzLmpzLm1hcCIsIi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuLyoqXG4gKiBHZW5lcmF0ZWQgVW5pdmVyc2FsbHkgVW5pcXVlIElkZW50aWZpZXJcbiAqXG4gKiBAcmV0dXJucyBSRkM0MTIyIHY0IFVVSUQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZVVVSUQoKSB7XG4gICAgbGV0IHV1aWQgPSBcIlwiO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMzI7IGkrKykge1xuICAgICAgICAvLyBHZW5lcmF0ZSBhIHJhbmRvbSBudW1iZXIgYmV0d2VlbiAwIGFuZCAxNVxuICAgICAgICBjb25zdCByYW5kb21OdW1iZXIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxNik7XG4gICAgICAgIC8vIFNldCB0aGUgVVVJRCB2ZXJzaW9uIHRvIDQgaW4gdGhlIDEzdGggcG9zaXRpb25cbiAgICAgICAgaWYgKGkgPT09IDEyKSB7XG4gICAgICAgICAgICB1dWlkICs9IFwiNFwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGkgPT09IDE2KSB7XG4gICAgICAgICAgICAvLyBTZXQgdGhlIFVVSUQgdmFyaWFudCB0byBcIjEwXCIgaW4gdGhlIDE3dGggcG9zaXRpb25cbiAgICAgICAgICAgIHV1aWQgKz0gKHJhbmRvbU51bWJlciAmIDB4MykgfCAweDg7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBBZGQgYSByYW5kb20gaGV4YWRlY2ltYWwgZGlnaXQgdG8gdGhlIFVVSUQgc3RyaW5nXG4gICAgICAgICAgICB1dWlkICs9IHJhbmRvbU51bWJlci50b1N0cmluZygxNik7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQWRkIGh5cGhlbnMgdG8gdGhlIFVVSUQgc3RyaW5nIGF0IHRoZSBhcHByb3ByaWF0ZSBwb3NpdGlvbnNcbiAgICAgICAgaWYgKGkgPT09IDcgfHwgaSA9PT0gMTEgfHwgaSA9PT0gMTUgfHwgaSA9PT0gMTkpIHtcbiAgICAgICAgICAgIHV1aWQgKz0gXCItXCI7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHV1aWQ7XG59XG4vKipcbiAqIEdlbmVyYXRlZCBVbml2ZXJzYWxseSBVbmlxdWUgSWRlbnRpZmllclxuICpcbiAqIEByZXR1cm5zIFJGQzQxMjIgdjQgVVVJRC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJhbmRvbVVVSUQoKSB7XG4gICAgcmV0dXJuIGdlbmVyYXRlVVVJRCgpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dXVpZFV0aWxzLmNvbW1vbi5qcy5tYXAiLCIvLyBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi5cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbnZhciBfYTtcbmltcG9ydCB7IGdlbmVyYXRlVVVJRCB9IGZyb20gXCIuL3V1aWRVdGlscy5jb21tb24uanNcIjtcbi8vIE5PVEU6IFRoaXMgY291bGQgYmUgdW5kZWZpbmVkIGlmIG5vdCB1c2VkIGluIGEgc2VjdXJlIGNvbnRleHRcbmNvbnN0IHV1aWRGdW5jdGlvbiA9IHR5cGVvZiAoKF9hID0gZ2xvYmFsVGhpcyA9PT0gbnVsbCB8fCBnbG9iYWxUaGlzID09PSB2b2lkIDAgPyB2b2lkIDAgOiBnbG9iYWxUaGlzLmNyeXB0bykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnJhbmRvbVVVSUQpID09PSBcImZ1bmN0aW9uXCJcbiAgICA/IGdsb2JhbFRoaXMuY3J5cHRvLnJhbmRvbVVVSUQuYmluZChnbG9iYWxUaGlzLmNyeXB0bylcbiAgICA6IGdlbmVyYXRlVVVJRDtcbi8qKlxuICogR2VuZXJhdGVkIFVuaXZlcnNhbGx5IFVuaXF1ZSBJZGVudGlmaWVyXG4gKlxuICogQHJldHVybnMgUkZDNDEyMiB2NCBVVUlELlxuICovXG5leHBvcnQgZnVuY3Rpb24gcmFuZG9tVVVJRCgpIHtcbiAgICByZXR1cm4gdXVpZEZ1bmN0aW9uKCk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD11dWlkVXRpbHMtYnJvd3Nlci5tanMubWFwIiwiLy8gQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG5pbXBvcnQgeyBsb2cgfSBmcm9tIFwiLi9sb2cuanNcIjtcbmNvbnN0IGRlYnVnRW52VmFyaWFibGUgPSAodHlwZW9mIHByb2Nlc3MgIT09IFwidW5kZWZpbmVkXCIgJiYgcHJvY2Vzcy5lbnYgJiYgcHJvY2Vzcy5lbnYuREVCVUcpIHx8IHVuZGVmaW5lZDtcbmxldCBlbmFibGVkU3RyaW5nO1xubGV0IGVuYWJsZWROYW1lc3BhY2VzID0gW107XG5sZXQgc2tpcHBlZE5hbWVzcGFjZXMgPSBbXTtcbmNvbnN0IGRlYnVnZ2VycyA9IFtdO1xuaWYgKGRlYnVnRW52VmFyaWFibGUpIHtcbiAgICBlbmFibGUoZGVidWdFbnZWYXJpYWJsZSk7XG59XG5jb25zdCBkZWJ1Z09iaiA9IE9iamVjdC5hc3NpZ24oKG5hbWVzcGFjZSkgPT4ge1xuICAgIHJldHVybiBjcmVhdGVEZWJ1Z2dlcihuYW1lc3BhY2UpO1xufSwge1xuICAgIGVuYWJsZSxcbiAgICBlbmFibGVkLFxuICAgIGRpc2FibGUsXG4gICAgbG9nLFxufSk7XG5mdW5jdGlvbiBlbmFibGUobmFtZXNwYWNlcykge1xuICAgIGVuYWJsZWRTdHJpbmcgPSBuYW1lc3BhY2VzO1xuICAgIGVuYWJsZWROYW1lc3BhY2VzID0gW107XG4gICAgc2tpcHBlZE5hbWVzcGFjZXMgPSBbXTtcbiAgICBjb25zdCB3aWxkY2FyZCA9IC9cXCovZztcbiAgICBjb25zdCBuYW1lc3BhY2VMaXN0ID0gbmFtZXNwYWNlcy5zcGxpdChcIixcIikubWFwKChucykgPT4gbnMudHJpbSgpLnJlcGxhY2Uod2lsZGNhcmQsIFwiLio/XCIpKTtcbiAgICBmb3IgKGNvbnN0IG5zIG9mIG5hbWVzcGFjZUxpc3QpIHtcbiAgICAgICAgaWYgKG5zLnN0YXJ0c1dpdGgoXCItXCIpKSB7XG4gICAgICAgICAgICBza2lwcGVkTmFtZXNwYWNlcy5wdXNoKG5ldyBSZWdFeHAoYF4ke25zLnN1YnN0cigxKX0kYCkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZW5hYmxlZE5hbWVzcGFjZXMucHVzaChuZXcgUmVnRXhwKGBeJHtuc30kYCkpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZvciAoY29uc3QgaW5zdGFuY2Ugb2YgZGVidWdnZXJzKSB7XG4gICAgICAgIGluc3RhbmNlLmVuYWJsZWQgPSBlbmFibGVkKGluc3RhbmNlLm5hbWVzcGFjZSk7XG4gICAgfVxufVxuZnVuY3Rpb24gZW5hYmxlZChuYW1lc3BhY2UpIHtcbiAgICBpZiAobmFtZXNwYWNlLmVuZHNXaXRoKFwiKlwiKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgZm9yIChjb25zdCBza2lwcGVkIG9mIHNraXBwZWROYW1lc3BhY2VzKSB7XG4gICAgICAgIGlmIChza2lwcGVkLnRlc3QobmFtZXNwYWNlKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZvciAoY29uc3QgZW5hYmxlZE5hbWVzcGFjZSBvZiBlbmFibGVkTmFtZXNwYWNlcykge1xuICAgICAgICBpZiAoZW5hYmxlZE5hbWVzcGFjZS50ZXN0KG5hbWVzcGFjZSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cbmZ1bmN0aW9uIGRpc2FibGUoKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gZW5hYmxlZFN0cmluZyB8fCBcIlwiO1xuICAgIGVuYWJsZShcIlwiKTtcbiAgICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gY3JlYXRlRGVidWdnZXIobmFtZXNwYWNlKSB7XG4gICAgY29uc3QgbmV3RGVidWdnZXIgPSBPYmplY3QuYXNzaWduKGRlYnVnLCB7XG4gICAgICAgIGVuYWJsZWQ6IGVuYWJsZWQobmFtZXNwYWNlKSxcbiAgICAgICAgZGVzdHJveSxcbiAgICAgICAgbG9nOiBkZWJ1Z09iai5sb2csXG4gICAgICAgIG5hbWVzcGFjZSxcbiAgICAgICAgZXh0ZW5kLFxuICAgIH0pO1xuICAgIGZ1bmN0aW9uIGRlYnVnKC4uLmFyZ3MpIHtcbiAgICAgICAgaWYgKCFuZXdEZWJ1Z2dlci5lbmFibGVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFyZ3MubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgYXJnc1swXSA9IGAke25hbWVzcGFjZX0gJHthcmdzWzBdfWA7XG4gICAgICAgIH1cbiAgICAgICAgbmV3RGVidWdnZXIubG9nKC4uLmFyZ3MpO1xuICAgIH1cbiAgICBkZWJ1Z2dlcnMucHVzaChuZXdEZWJ1Z2dlcik7XG4gICAgcmV0dXJuIG5ld0RlYnVnZ2VyO1xufVxuZnVuY3Rpb24gZGVzdHJveSgpIHtcbiAgICBjb25zdCBpbmRleCA9IGRlYnVnZ2Vycy5pbmRleE9mKHRoaXMpO1xuICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICAgIGRlYnVnZ2Vycy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuZnVuY3Rpb24gZXh0ZW5kKG5hbWVzcGFjZSkge1xuICAgIGNvbnN0IG5ld0RlYnVnZ2VyID0gY3JlYXRlRGVidWdnZXIoYCR7dGhpcy5uYW1lc3BhY2V9OiR7bmFtZXNwYWNlfWApO1xuICAgIG5ld0RlYnVnZ2VyLmxvZyA9IHRoaXMubG9nO1xuICAgIHJldHVybiBuZXdEZWJ1Z2dlcjtcbn1cbmV4cG9ydCBkZWZhdWx0IGRlYnVnT2JqO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGVidWcuanMubWFwIiwiLy8gQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG5pbXBvcnQgZGVidWcgZnJvbSBcIi4vZGVidWcuanNcIjtcbmNvbnN0IHJlZ2lzdGVyZWRMb2dnZXJzID0gbmV3IFNldCgpO1xuY29uc3QgbG9nTGV2ZWxGcm9tRW52ID0gKHR5cGVvZiBwcm9jZXNzICE9PSBcInVuZGVmaW5lZFwiICYmIHByb2Nlc3MuZW52ICYmIHByb2Nlc3MuZW52LkFaVVJFX0xPR19MRVZFTCkgfHwgdW5kZWZpbmVkO1xubGV0IGF6dXJlTG9nTGV2ZWw7XG4vKipcbiAqIFRoZSBBenVyZUxvZ2dlciBwcm92aWRlcyBhIG1lY2hhbmlzbSBmb3Igb3ZlcnJpZGluZyB3aGVyZSBsb2dzIGFyZSBvdXRwdXQgdG8uXG4gKiBCeSBkZWZhdWx0LCBsb2dzIGFyZSBzZW50IHRvIHN0ZGVyci5cbiAqIE92ZXJyaWRlIHRoZSBgbG9nYCBtZXRob2QgdG8gcmVkaXJlY3QgbG9ncyB0byBhbm90aGVyIGxvY2F0aW9uLlxuICovXG5leHBvcnQgY29uc3QgQXp1cmVMb2dnZXIgPSBkZWJ1ZyhcImF6dXJlXCIpO1xuQXp1cmVMb2dnZXIubG9nID0gKC4uLmFyZ3MpID0+IHtcbiAgICBkZWJ1Zy5sb2coLi4uYXJncyk7XG59O1xuY29uc3QgQVpVUkVfTE9HX0xFVkVMUyA9IFtcInZlcmJvc2VcIiwgXCJpbmZvXCIsIFwid2FybmluZ1wiLCBcImVycm9yXCJdO1xuaWYgKGxvZ0xldmVsRnJvbUVudikge1xuICAgIC8vIGF2b2lkIGNhbGxpbmcgc2V0TG9nTGV2ZWwgYmVjYXVzZSB3ZSBkb24ndCB3YW50IGEgbWlzLXNldCBlbnZpcm9ubWVudCB2YXJpYWJsZSB0byBjcmFzaFxuICAgIGlmIChpc0F6dXJlTG9nTGV2ZWwobG9nTGV2ZWxGcm9tRW52KSkge1xuICAgICAgICBzZXRMb2dMZXZlbChsb2dMZXZlbEZyb21FbnYpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihgQVpVUkVfTE9HX0xFVkVMIHNldCB0byB1bmtub3duIGxvZyBsZXZlbCAnJHtsb2dMZXZlbEZyb21FbnZ9JzsgbG9nZ2luZyBpcyBub3QgZW5hYmxlZC4gQWNjZXB0YWJsZSB2YWx1ZXM6ICR7QVpVUkVfTE9HX0xFVkVMUy5qb2luKFwiLCBcIil9LmApO1xuICAgIH1cbn1cbi8qKlxuICogSW1tZWRpYXRlbHkgZW5hYmxlcyBsb2dnaW5nIGF0IHRoZSBzcGVjaWZpZWQgbG9nIGxldmVsLiBJZiBubyBsZXZlbCBpcyBzcGVjaWZpZWQsIGxvZ2dpbmcgaXMgZGlzYWJsZWQuXG4gKiBAcGFyYW0gbGV2ZWwgLSBUaGUgbG9nIGxldmVsIHRvIGVuYWJsZSBmb3IgbG9nZ2luZy5cbiAqIE9wdGlvbnMgZnJvbSBtb3N0IHZlcmJvc2UgdG8gbGVhc3QgdmVyYm9zZSBhcmU6XG4gKiAtIHZlcmJvc2VcbiAqIC0gaW5mb1xuICogLSB3YXJuaW5nXG4gKiAtIGVycm9yXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXRMb2dMZXZlbChsZXZlbCkge1xuICAgIGlmIChsZXZlbCAmJiAhaXNBenVyZUxvZ0xldmVsKGxldmVsKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVua25vd24gbG9nIGxldmVsICcke2xldmVsfScuIEFjY2VwdGFibGUgdmFsdWVzOiAke0FaVVJFX0xPR19MRVZFTFMuam9pbihcIixcIil9YCk7XG4gICAgfVxuICAgIGF6dXJlTG9nTGV2ZWwgPSBsZXZlbDtcbiAgICBjb25zdCBlbmFibGVkTmFtZXNwYWNlcyA9IFtdO1xuICAgIGZvciAoY29uc3QgbG9nZ2VyIG9mIHJlZ2lzdGVyZWRMb2dnZXJzKSB7XG4gICAgICAgIGlmIChzaG91bGRFbmFibGUobG9nZ2VyKSkge1xuICAgICAgICAgICAgZW5hYmxlZE5hbWVzcGFjZXMucHVzaChsb2dnZXIubmFtZXNwYWNlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBkZWJ1Zy5lbmFibGUoZW5hYmxlZE5hbWVzcGFjZXMuam9pbihcIixcIikpO1xufVxuLyoqXG4gKiBSZXRyaWV2ZXMgdGhlIGN1cnJlbnRseSBzcGVjaWZpZWQgbG9nIGxldmVsLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TG9nTGV2ZWwoKSB7XG4gICAgcmV0dXJuIGF6dXJlTG9nTGV2ZWw7XG59XG5jb25zdCBsZXZlbE1hcCA9IHtcbiAgICB2ZXJib3NlOiA0MDAsXG4gICAgaW5mbzogMzAwLFxuICAgIHdhcm5pbmc6IDIwMCxcbiAgICBlcnJvcjogMTAwLFxufTtcbi8qKlxuICogQ3JlYXRlcyBhIGxvZ2dlciBmb3IgdXNlIGJ5IHRoZSBBenVyZSBTREtzIHRoYXQgaW5oZXJpdHMgZnJvbSBgQXp1cmVMb2dnZXJgLlxuICogQHBhcmFtIG5hbWVzcGFjZSAtIFRoZSBuYW1lIG9mIHRoZSBTREsgcGFja2FnZS5cbiAqIEBoaWRkZW5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUNsaWVudExvZ2dlcihuYW1lc3BhY2UpIHtcbiAgICBjb25zdCBjbGllbnRSb290TG9nZ2VyID0gQXp1cmVMb2dnZXIuZXh0ZW5kKG5hbWVzcGFjZSk7XG4gICAgcGF0Y2hMb2dNZXRob2QoQXp1cmVMb2dnZXIsIGNsaWVudFJvb3RMb2dnZXIpO1xuICAgIHJldHVybiB7XG4gICAgICAgIGVycm9yOiBjcmVhdGVMb2dnZXIoY2xpZW50Um9vdExvZ2dlciwgXCJlcnJvclwiKSxcbiAgICAgICAgd2FybmluZzogY3JlYXRlTG9nZ2VyKGNsaWVudFJvb3RMb2dnZXIsIFwid2FybmluZ1wiKSxcbiAgICAgICAgaW5mbzogY3JlYXRlTG9nZ2VyKGNsaWVudFJvb3RMb2dnZXIsIFwiaW5mb1wiKSxcbiAgICAgICAgdmVyYm9zZTogY3JlYXRlTG9nZ2VyKGNsaWVudFJvb3RMb2dnZXIsIFwidmVyYm9zZVwiKSxcbiAgICB9O1xufVxuZnVuY3Rpb24gcGF0Y2hMb2dNZXRob2QocGFyZW50LCBjaGlsZCkge1xuICAgIGNoaWxkLmxvZyA9ICguLi5hcmdzKSA9PiB7XG4gICAgICAgIHBhcmVudC5sb2coLi4uYXJncyk7XG4gICAgfTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZUxvZ2dlcihwYXJlbnQsIGxldmVsKSB7XG4gICAgY29uc3QgbG9nZ2VyID0gT2JqZWN0LmFzc2lnbihwYXJlbnQuZXh0ZW5kKGxldmVsKSwge1xuICAgICAgICBsZXZlbCxcbiAgICB9KTtcbiAgICBwYXRjaExvZ01ldGhvZChwYXJlbnQsIGxvZ2dlcik7XG4gICAgaWYgKHNob3VsZEVuYWJsZShsb2dnZXIpKSB7XG4gICAgICAgIGNvbnN0IGVuYWJsZWROYW1lc3BhY2VzID0gZGVidWcuZGlzYWJsZSgpO1xuICAgICAgICBkZWJ1Zy5lbmFibGUoZW5hYmxlZE5hbWVzcGFjZXMgKyBcIixcIiArIGxvZ2dlci5uYW1lc3BhY2UpO1xuICAgIH1cbiAgICByZWdpc3RlcmVkTG9nZ2Vycy5hZGQobG9nZ2VyKTtcbiAgICByZXR1cm4gbG9nZ2VyO1xufVxuZnVuY3Rpb24gc2hvdWxkRW5hYmxlKGxvZ2dlcikge1xuICAgIHJldHVybiBCb29sZWFuKGF6dXJlTG9nTGV2ZWwgJiYgbGV2ZWxNYXBbbG9nZ2VyLmxldmVsXSA8PSBsZXZlbE1hcFthenVyZUxvZ0xldmVsXSk7XG59XG5mdW5jdGlvbiBpc0F6dXJlTG9nTGV2ZWwobG9nTGV2ZWwpIHtcbiAgICByZXR1cm4gQVpVUkVfTE9HX0xFVkVMUy5pbmNsdWRlcyhsb2dMZXZlbCk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiLCIvLyBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi5cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbmV4cG9ydCBmdW5jdGlvbiBsb2coLi4uYXJncykge1xuICAgIGlmIChhcmdzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY29uc3QgZmlyc3RBcmcgPSBTdHJpbmcoYXJnc1swXSk7XG4gICAgICAgIGlmIChmaXJzdEFyZy5pbmNsdWRlcyhcIjplcnJvclwiKSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvciguLi5hcmdzKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChmaXJzdEFyZy5pbmNsdWRlcyhcIjp3YXJuaW5nXCIpKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oLi4uYXJncyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZmlyc3RBcmcuaW5jbHVkZXMoXCI6aW5mb1wiKSkge1xuICAgICAgICAgICAgY29uc29sZS5pbmZvKC4uLmFyZ3MpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGZpcnN0QXJnLmluY2x1ZGVzKFwiOnZlcmJvc2VcIikpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoLi4uYXJncyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmRlYnVnKC4uLmFyZ3MpO1xuICAgICAgICB9XG4gICAgfVxufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bG9nLWJyb3dzZXIubWpzLm1hcCIsIi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuaW1wb3J0IHsgX19yZXN0IH0gZnJvbSBcInRzbGliXCI7XG5pbXBvcnQgeyBpc1Rva2VuQ3JlZGVudGlhbCB9IGZyb20gXCJAYXp1cmUvY29yZS1hdXRoXCI7XG5pbXBvcnQgeyBjcmVhdGVPcGVuQUkgfSBmcm9tIFwiLi9hcGkvaW5kZXguanNcIjtcbmltcG9ydCB7IGdldENvbXBsZXRpb25zLCBnZXRDaGF0Q29tcGxldGlvbnMsIGdldEltYWdlR2VuZXJhdGlvbnMsIGdldEVtYmVkZGluZ3MsIGdldEF1ZGlvVHJhbnNjcmlwdGlvbiwgZ2V0QXVkaW9UcmFuc2xhdGlvbiwgfSBmcm9tIFwiLi9hcGkvb3BlcmF0aW9ucy5qc1wiO1xuaW1wb3J0IHsgbm9uQXp1cmVQb2xpY3kgfSBmcm9tIFwiLi9hcGkvcG9saWNpZXMvbm9uQXp1cmUuanNcIjtcbmltcG9ydCB7IHN0cmVhbUNoYXRDb21wbGV0aW9ucywgc3RyZWFtQ29tcGxldGlvbnMgfSBmcm9tIFwiLi9hcGkvb3BlcmF0aW9ucy5qc1wiO1xuZnVuY3Rpb24gY3JlYXRlT3BlbkFJRW5kcG9pbnQodmVyc2lvbikge1xuICAgIHJldHVybiBgaHR0cHM6Ly9hcGkub3BlbmFpLmNvbS92JHt2ZXJzaW9ufWA7XG59XG5mdW5jdGlvbiBpc0NyZWQoY3JlZCkge1xuICAgIHJldHVybiBpc1Rva2VuQ3JlZGVudGlhbChjcmVkKSB8fCBjcmVkLmtleSAhPT0gdW5kZWZpbmVkO1xufVxuLyoqXG4gKiBBIGNsaWVudCBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBBenVyZSBPcGVuQUkuXG4gKlxuICogVGhlIGNsaWVudCBuZWVkcyB0aGUgZW5kcG9pbnQgb2YgYW4gT3BlbkFJIHJlc291cmNlIGFuZCBhbiBhdXRoZW50aWNhdGlvblxuICogbWV0aG9kIHN1Y2ggYXMgYW4gQVBJIGtleSBvciB0b2tlbi4gVGhlIEFQSSBrZXkgYW5kIGVuZHBvaW50IGNhbiBiZSBmb3VuZCBpblxuICogdGhlIE9wZW5BSSByZXNvdXJjZSBwYWdlLiBUaGV5IHdpbGwgYmUgbG9jYXRlZCBpbiB0aGUgcmVzb3VyY2UncyBLZXlzIGFuZCBFbmRwb2ludCBwYWdlLlxuICpcbiAqICMjIyBFeGFtcGxlcyBmb3IgYXV0aGVudGljYXRpb246XG4gKlxuICogIyMjIyBBUEkgS2V5XG4gKlxuICogYGBganNcbiAqIGltcG9ydCB7IE9wZW5BSUNsaWVudCB9IGZyb20gXCJAYXp1cmUvb3BlbmFpXCI7XG4gKiBpbXBvcnQgeyBBenVyZUtleUNyZWRlbnRpYWwgfSBmcm9tIFwiQGF6dXJlL2NvcmUtYXV0aFwiO1xuICpcbiAqIGNvbnN0IGVuZHBvaW50ID0gXCI8YXp1cmUgZW5kcG9pbnQ+XCI7XG4gKiBjb25zdCBjcmVkZW50aWFsID0gbmV3IEF6dXJlS2V5Q3JlZGVudGlhbChcIjxhcGkga2V5PlwiKTtcbiAqXG4gKiBjb25zdCBjbGllbnQgPSBuZXcgT3BlbkFJQ2xpZW50KGVuZHBvaW50LCBjcmVkZW50aWFsKTtcbiAqIGBgYFxuICpcbiAqICMjIyMgQXp1cmUgQWN0aXZlIERpcmVjdG9yeVxuICpcbiAqIGBgYGpzXG4gKiBpbXBvcnQgeyBPcGVuQUlDbGllbnQgfSBmcm9tIFwiQGF6dXJlL29wZW5haVwiO1xuICogaW1wb3J0IHsgRGVmYXVsdEF6dXJlQ3JlZGVudGlhbCB9IGZyb20gXCJAYXp1cmUvaWRlbnRpdHlcIjtcbiAqXG4gKiBjb25zdCBlbmRwb2ludCA9IFwiPGF6dXJlIGVuZHBvaW50PlwiO1xuICogY29uc3QgY3JlZGVudGlhbCA9IG5ldyBEZWZhdWx0QXp1cmVDcmVkZW50aWFsKCk7XG4gKlxuICogY29uc3QgY2xpZW50ID0gbmV3IE9wZW5BSUNsaWVudChlbmRwb2ludCwgY3JlZGVudGlhbCk7XG4gKiBgYGBcbiAqL1xuZXhwb3J0IGNsYXNzIE9wZW5BSUNsaWVudCB7XG4gICAgY29uc3RydWN0b3IoZW5kcG9pbnRPck9wZW5BaUtleSwgY3JlZE9yT3B0aW9ucyA9IHt9LCBvcHRpb25zID0ge30pIHtcbiAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgdGhpcy5faXNBenVyZSA9IGZhbHNlO1xuICAgICAgICBsZXQgb3B0cztcbiAgICAgICAgbGV0IGVuZHBvaW50O1xuICAgICAgICBsZXQgY3JlZDtcbiAgICAgICAgaWYgKGlzQ3JlZChjcmVkT3JPcHRpb25zKSkge1xuICAgICAgICAgICAgZW5kcG9pbnQgPSBlbmRwb2ludE9yT3BlbkFpS2V5O1xuICAgICAgICAgICAgY3JlZCA9IGNyZWRPck9wdGlvbnM7XG4gICAgICAgICAgICBvcHRzID0gb3B0aW9ucztcbiAgICAgICAgICAgIHRoaXMuX2lzQXp1cmUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZW5kcG9pbnQgPSBjcmVhdGVPcGVuQUlFbmRwb2ludCgxKTtcbiAgICAgICAgICAgIGNyZWQgPSBlbmRwb2ludE9yT3BlbkFpS2V5O1xuICAgICAgICAgICAgY29uc3QgeyBjcmVkZW50aWFscyB9ID0gY3JlZE9yT3B0aW9ucywgcmVzdE9wdHMgPSBfX3Jlc3QoY3JlZE9yT3B0aW9ucywgW1wiY3JlZGVudGlhbHNcIl0pO1xuICAgICAgICAgICAgb3B0cyA9IE9iamVjdC5hc3NpZ24oeyBjcmVkZW50aWFsczoge1xuICAgICAgICAgICAgICAgICAgICBhcGlLZXlIZWFkZXJOYW1lOiAoX2EgPSBjcmVkZW50aWFscyA9PT0gbnVsbCB8fCBjcmVkZW50aWFscyA9PT0gdm9pZCAwID8gdm9pZCAwIDogY3JlZGVudGlhbHMuYXBpS2V5SGVhZGVyTmFtZSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogXCJBdXRob3JpemF0aW9uXCIsXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlczogY3JlZGVudGlhbHMgPT09IG51bGwgfHwgY3JlZGVudGlhbHMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGNyZWRlbnRpYWxzLnNjb3BlcyxcbiAgICAgICAgICAgICAgICB9IH0sIHJlc3RPcHRzKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9jbGllbnQgPSBjcmVhdGVPcGVuQUkoZW5kcG9pbnQsIGNyZWQsIE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgb3B0cyksICh0aGlzLl9pc0F6dXJlXG4gICAgICAgICAgICA/IHt9XG4gICAgICAgICAgICA6IHtcbiAgICAgICAgICAgICAgICBhZGRpdGlvbmFsUG9saWNpZXM6IFtcbiAgICAgICAgICAgICAgICAgICAgLi4uKChfYiA9IG9wdHMuYWRkaXRpb25hbFBvbGljaWVzKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiBbXSksXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBcInBlckNhbGxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvbGljeTogbm9uQXp1cmVQb2xpY3koKSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSkpKTtcbiAgICB9XG4gICAgc2V0TW9kZWwobW9kZWwsIG9wdGlvbnMpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9pc0F6dXJlKSB7XG4gICAgICAgICAgICBvcHRpb25zLm1vZGVsID0gbW9kZWw7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gaW1wbGVtZW50YXRpb25cbiAgICBhc3luYyBnZXRBdWRpb1RyYW5zbGF0aW9uKGRlcGxveW1lbnROYW1lLCBmaWxlQ29udGVudCwgZm9ybWF0T3JPcHRpb25zLCBpbnB1dE9wdGlvbnMpIHtcbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9IGlucHV0T3B0aW9ucyAhPT0gbnVsbCAmJiBpbnB1dE9wdGlvbnMgIT09IHZvaWQgMCA/IGlucHV0T3B0aW9ucyA6ICh0eXBlb2YgZm9ybWF0T3JPcHRpb25zID09PSBcInN0cmluZ1wiID8ge30gOiBmb3JtYXRPck9wdGlvbnMgIT09IG51bGwgJiYgZm9ybWF0T3JPcHRpb25zICE9PSB2b2lkIDAgPyBmb3JtYXRPck9wdGlvbnMgOiB7fSk7XG4gICAgICAgIGNvbnN0IHJlc3BvbnNlX2Zvcm1hdCA9IHR5cGVvZiBmb3JtYXRPck9wdGlvbnMgPT09IFwic3RyaW5nXCIgPyBmb3JtYXRPck9wdGlvbnMgOiB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMuc2V0TW9kZWwoZGVwbG95bWVudE5hbWUsIG9wdGlvbnMpO1xuICAgICAgICBpZiAocmVzcG9uc2VfZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBnZXRBdWRpb1RyYW5zbGF0aW9uKHRoaXMuX2NsaWVudCwgZGVwbG95bWVudE5hbWUsIGZpbGVDb250ZW50LCBvcHRpb25zKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZ2V0QXVkaW9UcmFuc2xhdGlvbih0aGlzLl9jbGllbnQsIGRlcGxveW1lbnROYW1lLCBmaWxlQ29udGVudCwgcmVzcG9uc2VfZm9ybWF0LCBvcHRpb25zKTtcbiAgICB9XG4gICAgLy8gaW1wbGVtZW50YXRpb25cbiAgICBhc3luYyBnZXRBdWRpb1RyYW5zY3JpcHRpb24oZGVwbG95bWVudE5hbWUsIGZpbGVDb250ZW50LCBmb3JtYXRPck9wdGlvbnMsIGlucHV0T3B0aW9ucykge1xuICAgICAgICBjb25zdCBvcHRpb25zID0gaW5wdXRPcHRpb25zICE9PSBudWxsICYmIGlucHV0T3B0aW9ucyAhPT0gdm9pZCAwID8gaW5wdXRPcHRpb25zIDogKHR5cGVvZiBmb3JtYXRPck9wdGlvbnMgPT09IFwic3RyaW5nXCIgPyB7fSA6IGZvcm1hdE9yT3B0aW9ucyAhPT0gbnVsbCAmJiBmb3JtYXRPck9wdGlvbnMgIT09IHZvaWQgMCA/IGZvcm1hdE9yT3B0aW9ucyA6IHt9KTtcbiAgICAgICAgY29uc3QgcmVzcG9uc2VfZm9ybWF0ID0gdHlwZW9mIGZvcm1hdE9yT3B0aW9ucyA9PT0gXCJzdHJpbmdcIiA/IGZvcm1hdE9yT3B0aW9ucyA6IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5zZXRNb2RlbChkZXBsb3ltZW50TmFtZSwgb3B0aW9ucyk7XG4gICAgICAgIGlmIChyZXNwb25zZV9mb3JtYXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIGdldEF1ZGlvVHJhbnNjcmlwdGlvbih0aGlzLl9jbGllbnQsIGRlcGxveW1lbnROYW1lLCBmaWxlQ29udGVudCwgb3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGdldEF1ZGlvVHJhbnNjcmlwdGlvbih0aGlzLl9jbGllbnQsIGRlcGxveW1lbnROYW1lLCBmaWxlQ29udGVudCwgcmVzcG9uc2VfZm9ybWF0LCBvcHRpb25zKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogR2V0cyBjb21wbGV0aW9ucyBmb3IgdGhlIHByb3ZpZGVkIGlucHV0IHByb21wdHMuXG4gICAgICogQ29tcGxldGlvbnMgc3VwcG9ydCBhIHdpZGUgdmFyaWV0eSBvZiB0YXNrcyBhbmQgZ2VuZXJhdGUgdGV4dCB0aGF0IGNvbnRpbnVlcyBmcm9tIG9yIFwiY29tcGxldGVzXCJcbiAgICAgKiBwcm92aWRlZCBwcm9tcHQgZGF0YS5cbiAgICAgKi9cbiAgICBnZXRDb21wbGV0aW9ucyhkZXBsb3ltZW50TmFtZSwgcHJvbXB0LCBvcHRpb25zID0geyByZXF1ZXN0T3B0aW9uczoge30gfSkge1xuICAgICAgICB0aGlzLnNldE1vZGVsKGRlcGxveW1lbnROYW1lLCBvcHRpb25zKTtcbiAgICAgICAgY29uc3QgeyBhYm9ydFNpZ25hbCwgb25SZXNwb25zZSwgcmVxdWVzdE9wdGlvbnMsIHRyYWNpbmdPcHRpb25zIH0gPSBvcHRpb25zLCByZXN0ID0gX19yZXN0KG9wdGlvbnMsIFtcImFib3J0U2lnbmFsXCIsIFwib25SZXNwb25zZVwiLCBcInJlcXVlc3RPcHRpb25zXCIsIFwidHJhY2luZ09wdGlvbnNcIl0pO1xuICAgICAgICByZXR1cm4gZ2V0Q29tcGxldGlvbnModGhpcy5fY2xpZW50LCBkZXBsb3ltZW50TmFtZSwgT2JqZWN0LmFzc2lnbih7IHByb21wdCB9LCByZXN0KSwgeyBhYm9ydFNpZ25hbCwgb25SZXNwb25zZSwgcmVxdWVzdE9wdGlvbnMsIHRyYWNpbmdPcHRpb25zIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBMaXN0cyB0aGUgY29tcGxldGlvbnMgdG9rZW5zIGFzIHRoZXkgYmVjb21lIGF2YWlsYWJsZSBmb3IgYSBnaXZlbiBwcm9tcHQuXG4gICAgICogQHBhcmFtIGRlcGxveW1lbnROYW1lIC0gVGhlIG5hbWUgb2YgdGhlIG1vZGVsIGRlcGxveW1lbnQgKHdoZW4gdXNpbmcgQXp1cmUgT3BlbkFJKSBvciBtb2RlbCBuYW1lICh3aGVuIHVzaW5nIG5vbi1BenVyZSBPcGVuQUkpIHRvIHVzZSBmb3IgdGhpcyByZXF1ZXN0LlxuICAgICAqIEBwYXJhbSBwcm9tcHQgLSBUaGUgcHJvbXB0IHRvIHVzZSBmb3IgdGhpcyByZXF1ZXN0LlxuICAgICAqIEBwYXJhbSBvcHRpb25zIC0gVGhlIGNvbXBsZXRpb25zIG9wdGlvbnMgZm9yIHRoaXMgY29tcGxldGlvbnMgcmVxdWVzdC5cbiAgICAgKiBAcmV0dXJucyBBbiBhc3luY2hyb25vdXMgaXRlcmFibGUgb2YgY29tcGxldGlvbnMgdG9rZW5zLlxuICAgICAqL1xuICAgIHN0cmVhbUNvbXBsZXRpb25zKGRlcGxveW1lbnROYW1lLCBwcm9tcHQsIG9wdGlvbnMgPSB7fSkge1xuICAgICAgICB0aGlzLnNldE1vZGVsKGRlcGxveW1lbnROYW1lLCBvcHRpb25zKTtcbiAgICAgICAgcmV0dXJuIHN0cmVhbUNvbXBsZXRpb25zKHRoaXMuX2NsaWVudCwgZGVwbG95bWVudE5hbWUsIHByb21wdCwgb3B0aW9ucyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEdldHMgY2hhdCBjb21wbGV0aW9ucyBmb3IgdGhlIHByb3ZpZGVkIGNoYXQgbWVzc2FnZXMuXG4gICAgICogQ29tcGxldGlvbnMgc3VwcG9ydCBhIHdpZGUgdmFyaWV0eSBvZiB0YXNrcyBhbmQgZ2VuZXJhdGUgdGV4dCB0aGF0IGNvbnRpbnVlcyBmcm9tIG9yIFwiY29tcGxldGVzXCJcbiAgICAgKiBwcm92aWRlZCBwcm9tcHQgZGF0YS5cbiAgICAgKi9cbiAgICBnZXRDaGF0Q29tcGxldGlvbnMoZGVwbG95bWVudE5hbWUsIG1lc3NhZ2VzLCBvcHRpb25zID0geyByZXF1ZXN0T3B0aW9uczoge30gfSkge1xuICAgICAgICB0aGlzLnNldE1vZGVsKGRlcGxveW1lbnROYW1lLCBvcHRpb25zKTtcbiAgICAgICAgcmV0dXJuIGdldENoYXRDb21wbGV0aW9ucyh0aGlzLl9jbGllbnQsIGRlcGxveW1lbnROYW1lLCBtZXNzYWdlcywgb3B0aW9ucyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIExpc3RzIHRoZSBjaGF0IGNvbXBsZXRpb25zIHRva2VucyBhcyB0aGV5IGJlY29tZSBhdmFpbGFibGUgZm9yIGEgY2hhdCBjb250ZXh0LlxuICAgICAqIEBwYXJhbSBkZXBsb3ltZW50TmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBtb2RlbCBkZXBsb3ltZW50ICh3aGVuIHVzaW5nIEF6dXJlIE9wZW5BSSkgb3IgbW9kZWwgbmFtZSAod2hlbiB1c2luZyBub24tQXp1cmUgT3BlbkFJKSB0byB1c2UgZm9yIHRoaXMgcmVxdWVzdC5cbiAgICAgKiBAcGFyYW0gbWVzc2FnZXMgLSBUaGUgY2hhdCBjb250ZXh0IG1lc3NhZ2VzIHRvIHVzZSBmb3IgdGhpcyByZXF1ZXN0LlxuICAgICAqIEBwYXJhbSBvcHRpb25zIC0gVGhlIGNoYXQgY29tcGxldGlvbnMgb3B0aW9ucyBmb3IgdGhpcyBjaGF0IGNvbXBsZXRpb25zIHJlcXVlc3QuXG4gICAgICogQHJldHVybnMgQW4gYXN5bmNocm9ub3VzIGl0ZXJhYmxlIG9mIGNoYXQgY29tcGxldGlvbnMgdG9rZW5zLlxuICAgICAqL1xuICAgIHN0cmVhbUNoYXRDb21wbGV0aW9ucyhkZXBsb3ltZW50TmFtZSwgbWVzc2FnZXMsIG9wdGlvbnMgPSB7IHJlcXVlc3RPcHRpb25zOiB7fSB9KSB7XG4gICAgICAgIHRoaXMuc2V0TW9kZWwoZGVwbG95bWVudE5hbWUsIG9wdGlvbnMpO1xuICAgICAgICByZXR1cm4gc3RyZWFtQ2hhdENvbXBsZXRpb25zKHRoaXMuX2NsaWVudCwgZGVwbG95bWVudE5hbWUsIG1lc3NhZ2VzLCBvcHRpb25zKTtcbiAgICB9XG4gICAgLyoqIENyZWF0ZXMgYW4gaW1hZ2UgZ2l2ZW4gYSBwcm9tcHQuICovXG4gICAgZ2V0SW1hZ2VzKGRlcGxveW1lbnROYW1lLCBwcm9tcHQsIG9wdGlvbnMgPSB7IHJlcXVlc3RPcHRpb25zOiB7fSB9KSB7XG4gICAgICAgIHRoaXMuc2V0TW9kZWwoZGVwbG95bWVudE5hbWUsIG9wdGlvbnMpO1xuICAgICAgICBjb25zdCB7IGFib3J0U2lnbmFsLCBvblJlc3BvbnNlLCByZXF1ZXN0T3B0aW9ucywgdHJhY2luZ09wdGlvbnMgfSA9IG9wdGlvbnMsIHJlc3QgPSBfX3Jlc3Qob3B0aW9ucywgW1wiYWJvcnRTaWduYWxcIiwgXCJvblJlc3BvbnNlXCIsIFwicmVxdWVzdE9wdGlvbnNcIiwgXCJ0cmFjaW5nT3B0aW9uc1wiXSk7XG4gICAgICAgIHJldHVybiBnZXRJbWFnZUdlbmVyYXRpb25zKHRoaXMuX2NsaWVudCwgZGVwbG95bWVudE5hbWUsIE9iamVjdC5hc3NpZ24oeyBwcm9tcHQgfSwgcmVzdCksIHsgYWJvcnRTaWduYWwsIG9uUmVzcG9uc2UsIHJlcXVlc3RPcHRpb25zLCB0cmFjaW5nT3B0aW9ucyB9KTtcbiAgICB9XG4gICAgLyoqIFJldHVybiB0aGUgZW1iZWRkaW5ncyBmb3IgYSBnaXZlbiBwcm9tcHQuICovXG4gICAgZ2V0RW1iZWRkaW5ncyhkZXBsb3ltZW50TmFtZSwgaW5wdXQsIG9wdGlvbnMgPSB7IHJlcXVlc3RPcHRpb25zOiB7fSB9KSB7XG4gICAgICAgIHRoaXMuc2V0TW9kZWwoZGVwbG95bWVudE5hbWUsIG9wdGlvbnMpO1xuICAgICAgICBjb25zdCB7IGFib3J0U2lnbmFsLCBvblJlc3BvbnNlLCByZXF1ZXN0T3B0aW9ucywgdHJhY2luZ09wdGlvbnMgfSA9IG9wdGlvbnMsIHJlc3QgPSBfX3Jlc3Qob3B0aW9ucywgW1wiYWJvcnRTaWduYWxcIiwgXCJvblJlc3BvbnNlXCIsIFwicmVxdWVzdE9wdGlvbnNcIiwgXCJ0cmFjaW5nT3B0aW9uc1wiXSk7XG4gICAgICAgIHJldHVybiBnZXRFbWJlZGRpbmdzKHRoaXMuX2NsaWVudCwgZGVwbG95bWVudE5hbWUsIE9iamVjdC5hc3NpZ24oeyBpbnB1dCB9LCByZXN0KSwgeyBhYm9ydFNpZ25hbCwgb25SZXNwb25zZSwgcmVxdWVzdE9wdGlvbnMsIHRyYWNpbmdPcHRpb25zIH0pO1xuICAgIH1cbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPU9wZW5BSUNsaWVudC5qcy5tYXAiLCIvLyBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi5cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbmltcG9ydCBnZXRDbGllbnQgZnJvbSBcIi4uL3Jlc3QvaW5kZXguanNcIjtcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVPcGVuQUkoZW5kcG9pbnQsIGNyZWRlbnRpYWwsIG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IGNsaWVudENvbnRleHQgPSBnZXRDbGllbnQoZW5kcG9pbnQsIGNyZWRlbnRpYWwsIG9wdGlvbnMpO1xuICAgIHJldHVybiBjbGllbnRDb250ZXh0O1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9T3BlbkFJQ29udGV4dC5qcy5tYXAiLCIvLyBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi5cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbmltcG9ydCB7IHdyYXBFcnJvciB9IGZyb20gXCIuL3V0aWwuanNcIjtcbmltcG9ydCB7IHN0cmVhbVRvVGV4dCB9IGZyb20gXCIuL3JlYWRhYmxlU3RyZWFtVXRpbHMuanNcIjtcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRTdHJlYW0ocmVzcG9uc2UpIHtcbiAgICBjb25zdCB7IGJvZHksIHN0YXR1cyB9ID0gYXdhaXQgcmVzcG9uc2UuYXNCcm93c2VyU3RyZWFtKCk7XG4gICAgaWYgKHN0YXR1cyAhPT0gXCIyMDBcIiAmJiBib2R5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29uc3QgdGV4dCA9IGF3YWl0IHN0cmVhbVRvVGV4dChib2R5KTtcbiAgICAgICAgdGhyb3cgd3JhcEVycm9yKCgpID0+IEpTT04ucGFyc2UodGV4dCkuZXJyb3IsIFwiRXJyb3IgcGFyc2luZyByZXNwb25zZSBib2R5XCIpO1xuICAgIH1cbiAgICBpZiAoIWJvZHkpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vIHN0cmVhbSBmb3VuZCBpbiByZXNwb25zZS4gRGlkIHlvdSBlbmFibGUgdGhlIHN0cmVhbSBvcHRpb24/XCIpO1xuICAgIHJldHVybiBib2R5O1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Z2V0U1NFcy5icm93c2VyLmpzLm1hcCIsIi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuaW1wb3J0IHsgZ2V0U3RyZWFtIH0gZnJvbSBcIi4vZ2V0U1NFcy5qc1wiO1xuaW1wb3J0IHsgd3JhcEVycm9yIH0gZnJvbSBcIi4vdXRpbC5qc1wiO1xuaW1wb3J0IHsgY3JlYXRlU3NlU3RyZWFtIH0gZnJvbSBcIkBhenVyZS9jb3JlLXNzZVwiO1xuaW1wb3J0IHsgcG9seWZpbGxTdHJlYW0gfSBmcm9tIFwiLi9yZWFkYWJsZVN0cmVhbVV0aWxzLmpzXCI7XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0T2FpU1NFcyhyZXNwb25zZSwgdG9FdmVudCkge1xuICAgIGNvbnN0IHN0cmluZ1N0cmVhbSA9IGF3YWl0IGdldFN0cmVhbShyZXNwb25zZSk7XG4gICAgY29uc3QgZXZlbnRTdHJlYW0gPSBjcmVhdGVTc2VTdHJlYW0oc3RyaW5nU3RyZWFtKTtcbiAgICBjb25zdCBqc29uUGFyc2VyID0gbmV3IFRyYW5zZm9ybVN0cmVhbSh7XG4gICAgICAgIHRyYW5zZm9ybTogYXN5bmMgKGNodW5rLCBjb250cm9sbGVyKSA9PiB7XG4gICAgICAgICAgICBpZiAoY2h1bmsuZGF0YSA9PT0gXCJbRE9ORV1cIikge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnRyb2xsZXIuZW5xdWV1ZSh0b0V2ZW50KHdyYXBFcnJvcigoKSA9PiBKU09OLnBhcnNlKGNodW5rLmRhdGEpLCBcIkVycm9yIHBhcnNpbmcgYW4gZXZlbnQuIFNlZSAnY2F1c2UnIGZvciBtb3JlIGRldGFpbHNcIikpKTtcbiAgICAgICAgfSxcbiAgICB9KTtcbiAgICAvKiogVE9ETzogcmVtb3ZlIHRoZXNlIHBvbHlmaWxscyBvbmNlIGFsbCBzdXBwb3J0ZWQgcnVudGltZXMgc3VwcG9ydCB0aGVtICovXG4gICAgcmV0dXJuIHBvbHlmaWxsU3RyZWFtKGV2ZW50U3RyZWFtLnBpcGVUaHJvdWdoKGpzb25QYXJzZXIpKTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW9haVNzZS5qcy5tYXAiLCIvLyBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi5cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbmltcG9ydCB7IF9fcmVzdCB9IGZyb20gXCJ0c2xpYlwiO1xuaW1wb3J0IHsgc2VyaWFsaXplQ2hhdFJlcXVlc3RNZXNzYWdlVW5pb24sIHNlcmlhbGl6ZUF6dXJlQ2hhdEV4dGVuc2lvbkNvbmZpZ3VyYXRpb25VbmlvbiwgfSBmcm9tIFwiLi4vdXRpbHMvc2VyaWFsaXplVXRpbC5qc1wiO1xuaW1wb3J0IHsgaXNVbmV4cGVjdGVkLCB9IGZyb20gXCIuLi9yZXN0L2luZGV4LmpzXCI7XG5pbXBvcnQgeyBvcGVyYXRpb25PcHRpb25zVG9SZXF1ZXN0UGFyYW1ldGVycywgfSBmcm9tIFwiQGF6dXJlLXJlc3QvY29yZS1jbGllbnRcIjtcbmltcG9ydCB7IGdldE9haVNTRXMgfSBmcm9tIFwiLi9vYWlTc2UuanNcIjtcbmltcG9ydCB7IGNyZWF0ZUZpbGUgfSBmcm9tIFwiQGF6dXJlL2NvcmUtcmVzdC1waXBlbGluZVwiO1xuaW1wb3J0IHsgc25ha2VDYXNlS2V5cywgY2FtZWxDYXNlS2V5cyB9IGZyb20gXCIuL3V0aWwuanNcIjtcbi8vIGltcGxlbWVudGF0aW9uXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0QXVkaW9UcmFuc2NyaXB0aW9uKGNvbnRleHQsIGRlcGxveW1lbnROYW1lLCBmaWxlQ29udGVudCwgZm9ybWF0T3JPcHRpb25zLCBpbnB1dE9wdGlvbnMpIHtcbiAgICBjb25zdCBvcHRpb25zID0gaW5wdXRPcHRpb25zICE9PSBudWxsICYmIGlucHV0T3B0aW9ucyAhPT0gdm9pZCAwID8gaW5wdXRPcHRpb25zIDogKHR5cGVvZiBmb3JtYXRPck9wdGlvbnMgPT09IFwic3RyaW5nXCIgPyB7fSA6IGZvcm1hdE9yT3B0aW9ucyAhPT0gbnVsbCAmJiBmb3JtYXRPck9wdGlvbnMgIT09IHZvaWQgMCA/IGZvcm1hdE9yT3B0aW9ucyA6IHt9KTtcbiAgICBjb25zdCByZXNwb25zZV9mb3JtYXQgPSB0eXBlb2YgZm9ybWF0T3JPcHRpb25zID09PSBcInN0cmluZ1wiID8gZm9ybWF0T3JPcHRpb25zIDogdW5kZWZpbmVkO1xuICAgIGNvbnN0IHsgYWJvcnRTaWduYWwsIG9uUmVzcG9uc2UsIHJlcXVlc3RPcHRpb25zLCB0cmFjaW5nT3B0aW9ucyB9ID0gb3B0aW9ucywgcmVzdCA9IF9fcmVzdChvcHRpb25zLCBbXCJhYm9ydFNpZ25hbFwiLCBcIm9uUmVzcG9uc2VcIiwgXCJyZXF1ZXN0T3B0aW9uc1wiLCBcInRyYWNpbmdPcHRpb25zXCJdKTtcbiAgICBjb25zdCB7IGJvZHksIHN0YXR1cyB9ID0gYXdhaXQgY29udGV4dFxuICAgICAgICAucGF0aFVuY2hlY2tlZChcImRlcGxveW1lbnRzL3tkZXBsb3ltZW50TmFtZX0vYXVkaW8vdHJhbnNjcmlwdGlvbnNcIiwgZGVwbG95bWVudE5hbWUpXG4gICAgICAgIC5wb3N0KE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgb3BlcmF0aW9uT3B0aW9uc1RvUmVxdWVzdFBhcmFtZXRlcnMoe1xuICAgICAgICBhYm9ydFNpZ25hbCxcbiAgICAgICAgb25SZXNwb25zZSxcbiAgICAgICAgdHJhY2luZ09wdGlvbnMsXG4gICAgICAgIHJlcXVlc3RPcHRpb25zLFxuICAgIH0pKSwgeyBjb250ZW50VHlwZTogXCJtdWx0aXBhcnQvZm9ybS1kYXRhXCIsIGJvZHk6IE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCBzbmFrZUNhc2VLZXlzKHJlc3QpKSwgeyBmaWxlOiBjcmVhdGVGaWxlKGZpbGVDb250ZW50LCBcInBsYWNlaG9sZGVyLndhdlwiKSB9KSwgKHJlc3BvbnNlX2Zvcm1hdCA/IHsgcmVzcG9uc2VfZm9ybWF0IH0gOiB7fSkpIH0pKTtcbiAgICBpZiAoc3RhdHVzICE9PSBcIjIwMFwiKSB7XG4gICAgICAgIHRocm93IGJvZHkuZXJyb3I7XG4gICAgfVxuICAgIHJldHVybiByZXNwb25zZV9mb3JtYXQgIT09IFwidmVyYm9zZV9qc29uXCJcbiAgICAgICAgPyBib2R5XG4gICAgICAgIDogY2FtZWxDYXNlS2V5cyhib2R5KTtcbn1cbi8vIGltcGxlbWVudGF0aW9uXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0QXVkaW9UcmFuc2xhdGlvbihjb250ZXh0LCBkZXBsb3ltZW50TmFtZSwgZmlsZUNvbnRlbnQsIGZvcm1hdE9yT3B0aW9ucywgaW5wdXRPcHRpb25zKSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IGlucHV0T3B0aW9ucyAhPT0gbnVsbCAmJiBpbnB1dE9wdGlvbnMgIT09IHZvaWQgMCA/IGlucHV0T3B0aW9ucyA6ICh0eXBlb2YgZm9ybWF0T3JPcHRpb25zID09PSBcInN0cmluZ1wiID8ge30gOiBmb3JtYXRPck9wdGlvbnMgIT09IG51bGwgJiYgZm9ybWF0T3JPcHRpb25zICE9PSB2b2lkIDAgPyBmb3JtYXRPck9wdGlvbnMgOiB7fSk7XG4gICAgY29uc3QgcmVzcG9uc2VfZm9ybWF0ID0gdHlwZW9mIGZvcm1hdE9yT3B0aW9ucyA9PT0gXCJzdHJpbmdcIiA/IGZvcm1hdE9yT3B0aW9ucyA6IHVuZGVmaW5lZDtcbiAgICBjb25zdCB7IGFib3J0U2lnbmFsLCBvblJlc3BvbnNlLCByZXF1ZXN0T3B0aW9ucywgdHJhY2luZ09wdGlvbnMgfSA9IG9wdGlvbnMsIHJlc3QgPSBfX3Jlc3Qob3B0aW9ucywgW1wiYWJvcnRTaWduYWxcIiwgXCJvblJlc3BvbnNlXCIsIFwicmVxdWVzdE9wdGlvbnNcIiwgXCJ0cmFjaW5nT3B0aW9uc1wiXSk7XG4gICAgY29uc3QgeyBib2R5LCBzdGF0dXMgfSA9IGF3YWl0IGNvbnRleHRcbiAgICAgICAgLnBhdGhVbmNoZWNrZWQoXCJkZXBsb3ltZW50cy97ZGVwbG95bWVudE5hbWV9L2F1ZGlvL3RyYW5zbGF0aW9uc1wiLCBkZXBsb3ltZW50TmFtZSlcbiAgICAgICAgLnBvc3QoT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCBvcGVyYXRpb25PcHRpb25zVG9SZXF1ZXN0UGFyYW1ldGVycyh7XG4gICAgICAgIGFib3J0U2lnbmFsLFxuICAgICAgICBvblJlc3BvbnNlLFxuICAgICAgICB0cmFjaW5nT3B0aW9ucyxcbiAgICAgICAgcmVxdWVzdE9wdGlvbnMsXG4gICAgfSkpLCB7IGNvbnRlbnRUeXBlOiBcIm11bHRpcGFydC9mb3JtLWRhdGFcIiwgYm9keTogT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIHNuYWtlQ2FzZUtleXMocmVzdCkpLCB7IGZpbGU6IGNyZWF0ZUZpbGUoZmlsZUNvbnRlbnQsIFwicGxhY2Vob2xkZXIud2F2XCIpIH0pLCAocmVzcG9uc2VfZm9ybWF0ID8geyByZXNwb25zZV9mb3JtYXQgfSA6IHt9KSkgfSkpO1xuICAgIGlmIChzdGF0dXMgIT09IFwiMjAwXCIpIHtcbiAgICAgICAgdGhyb3cgYm9keS5lcnJvcjtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3BvbnNlX2Zvcm1hdCAhPT0gXCJ2ZXJib3NlX2pzb25cIlxuICAgICAgICA/IGJvZHlcbiAgICAgICAgOiBjYW1lbENhc2VLZXlzKGJvZHkpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIF9nZXRDb21wbGV0aW9uc1NlbmQoY29udGV4dCwgZGVwbG95bWVudElkLCBib2R5LCBvcHRpb25zID0geyByZXF1ZXN0T3B0aW9uczoge30gfSkge1xuICAgIHJldHVybiBjb250ZXh0LnBhdGgoXCIvZGVwbG95bWVudHMve2RlcGxveW1lbnRJZH0vY29tcGxldGlvbnNcIiwgZGVwbG95bWVudElkKS5wb3N0KE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgb3BlcmF0aW9uT3B0aW9uc1RvUmVxdWVzdFBhcmFtZXRlcnMob3B0aW9ucykpLCB7IGJvZHk6IHtcbiAgICAgICAgICAgIHByb21wdDogYm9keVtcInByb21wdFwiXSxcbiAgICAgICAgICAgIG1heF90b2tlbnM6IGJvZHlbXCJtYXhUb2tlbnNcIl0sXG4gICAgICAgICAgICB0ZW1wZXJhdHVyZTogYm9keVtcInRlbXBlcmF0dXJlXCJdLFxuICAgICAgICAgICAgdG9wX3A6IGJvZHlbXCJ0b3BQXCJdLFxuICAgICAgICAgICAgbG9naXRfYmlhczogYm9keVtcImxvZ2l0Qmlhc1wiXSxcbiAgICAgICAgICAgIHVzZXI6IGJvZHlbXCJ1c2VyXCJdLFxuICAgICAgICAgICAgbjogYm9keVtcIm5cIl0sXG4gICAgICAgICAgICBsb2dwcm9iczogYm9keVtcImxvZ3Byb2JzXCJdLFxuICAgICAgICAgICAgc3VmZml4OiBib2R5W1wic3VmZml4XCJdLFxuICAgICAgICAgICAgZWNobzogYm9keVtcImVjaG9cIl0sXG4gICAgICAgICAgICBzdG9wOiBib2R5W1wic3RvcFwiXSxcbiAgICAgICAgICAgIHByZXNlbmNlX3BlbmFsdHk6IGJvZHlbXCJwcmVzZW5jZVBlbmFsdHlcIl0sXG4gICAgICAgICAgICBmcmVxdWVuY3lfcGVuYWx0eTogYm9keVtcImZyZXF1ZW5jeVBlbmFsdHlcIl0sXG4gICAgICAgICAgICBiZXN0X29mOiBib2R5W1wiYmVzdE9mXCJdLFxuICAgICAgICAgICAgc3RyZWFtOiBib2R5W1wic3RyZWFtXCJdLFxuICAgICAgICAgICAgbW9kZWw6IGJvZHlbXCJtb2RlbFwiXSxcbiAgICAgICAgfSB9KSk7XG59XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gX2dldENvbXBsZXRpb25zRGVzZXJpYWxpemUocmVzdWx0KSB7XG4gICAgaWYgKGlzVW5leHBlY3RlZChyZXN1bHQpKSB7XG4gICAgICAgIHRocm93IHJlc3VsdC5ib2R5LmVycm9yO1xuICAgIH1cbiAgICByZXR1cm4gZ2V0Q29tcGxldGlvbnNSZXN1bHQocmVzdWx0LmJvZHkpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGdldENvbXBsZXRpb25zUmVzdWx0KGJvZHkpIHtcbiAgICBjb25zdCB7IGNyZWF0ZWQsIGNob2ljZXMsIHByb21wdF9maWx0ZXJfcmVzdWx0cywgcHJvbXB0X2Fubm90YXRpb25zIH0gPSBib2R5LCByZXN0ID0gX19yZXN0KGJvZHksIFtcImNyZWF0ZWRcIiwgXCJjaG9pY2VzXCIsIFwicHJvbXB0X2ZpbHRlcl9yZXN1bHRzXCIsIFwicHJvbXB0X2Fubm90YXRpb25zXCJdKTtcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgY2FtZWxDYXNlS2V5cyhyZXN0KSksIHsgY3JlYXRlZDogbmV3IERhdGUoY3JlYXRlZCkgfSksIHtcbiAgICAgICAgcHJvbXB0RmlsdGVyUmVzdWx0czogZ2V0Q29udGVudEZpbHRlclJlc3VsdHNGb3JQcm9tcHQoe1xuICAgICAgICAgICAgcHJvbXB0X2ZpbHRlcl9yZXN1bHRzLFxuICAgICAgICAgICAgcHJvbXB0X2Fubm90YXRpb25zLFxuICAgICAgICB9KSxcbiAgICB9KSwgeyBjaG9pY2VzOiBjaG9pY2VzLm1hcCgoX2EpID0+IHtcbiAgICAgICAgICAgIHZhciB7IGNvbnRlbnRfZmlsdGVyX3Jlc3VsdHMgfSA9IF9hLCBjaG9pY2UgPSBfX3Jlc3QoX2EsIFtcImNvbnRlbnRfZmlsdGVyX3Jlc3VsdHNcIl0pO1xuICAgICAgICAgICAgcmV0dXJuIChPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIGNhbWVsQ2FzZUtleXMoY2hvaWNlKSksICghY29udGVudF9maWx0ZXJfcmVzdWx0c1xuICAgICAgICAgICAgICAgID8ge31cbiAgICAgICAgICAgICAgICA6IHtcbiAgICAgICAgICAgICAgICAgICAgY29udGVudEZpbHRlclJlc3VsdHM6IHBhcnNlQ29udGVudEZpbHRlclJlc3VsdHNGb3JDaG9pY2VPdXRwdXQoY29udGVudF9maWx0ZXJfcmVzdWx0cyksXG4gICAgICAgICAgICAgICAgfSkpKTtcbiAgICAgICAgfSkgfSk7XG59XG4vKipcbiAqIEdldHMgY29tcGxldGlvbnMgZm9yIHRoZSBwcm92aWRlZCBpbnB1dCBwcm9tcHRzLlxuICogQ29tcGxldGlvbnMgc3VwcG9ydCBhIHdpZGUgdmFyaWV0eSBvZiB0YXNrcyBhbmQgZ2VuZXJhdGUgdGV4dCB0aGF0IGNvbnRpbnVlcyBmcm9tIG9yIFwiY29tcGxldGVzXCJcbiAqIHByb3ZpZGVkIHByb21wdCBkYXRhLlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0Q29tcGxldGlvbnMoY29udGV4dCwgZGVwbG95bWVudElkLCBib2R5LCBvcHRpb25zID0geyByZXF1ZXN0T3B0aW9uczoge30gfSkge1xuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IF9nZXRDb21wbGV0aW9uc1NlbmQoY29udGV4dCwgZGVwbG95bWVudElkLCBib2R5LCBvcHRpb25zKTtcbiAgICByZXR1cm4gX2dldENvbXBsZXRpb25zRGVzZXJpYWxpemUocmVzdWx0KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBzdHJlYW1Db21wbGV0aW9ucyhjb250ZXh0LCBkZXBsb3ltZW50TmFtZSwgcHJvbXB0LCBvcHRpb25zID0geyByZXF1ZXN0T3B0aW9uczoge30gfSkge1xuICAgIGNvbnN0IHsgYWJvcnRTaWduYWwsIG9uUmVzcG9uc2UsIHJlcXVlc3RPcHRpb25zLCB0cmFjaW5nT3B0aW9ucyB9ID0gb3B0aW9ucywgcmVzdCA9IF9fcmVzdChvcHRpb25zLCBbXCJhYm9ydFNpZ25hbFwiLCBcIm9uUmVzcG9uc2VcIiwgXCJyZXF1ZXN0T3B0aW9uc1wiLCBcInRyYWNpbmdPcHRpb25zXCJdKTtcbiAgICBjb25zdCByZXNwb25zZSA9IF9nZXRDb21wbGV0aW9uc1NlbmQoY29udGV4dCwgZGVwbG95bWVudE5hbWUsIE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7IHByb21wdCB9LCByZXN0KSwgeyBzdHJlYW06IHRydWUgfSksIHsgYWJvcnRTaWduYWwsIG9uUmVzcG9uc2UsIHJlcXVlc3RPcHRpb25zLCB0cmFjaW5nT3B0aW9ucyB9KTtcbiAgICByZXR1cm4gZ2V0T2FpU1NFcyhyZXNwb25zZSwgZ2V0Q29tcGxldGlvbnNSZXN1bHQpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIF9nZXRDaGF0Q29tcGxldGlvbnNTZW5kKGNvbnRleHQsIGRlcGxveW1lbnRJZCwgYm9keSwgb3B0aW9ucyA9IHsgcmVxdWVzdE9wdGlvbnM6IHt9IH0pIHtcbiAgICB2YXIgX2EsIF9iLCBfYywgX2QsIF9lLCBfZiwgX2c7XG4gICAgcmV0dXJuIGNvbnRleHQucGF0aChcIi9kZXBsb3ltZW50cy97ZGVwbG95bWVudElkfS9jaGF0L2NvbXBsZXRpb25zXCIsIGRlcGxveW1lbnRJZCkucG9zdChPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIG9wZXJhdGlvbk9wdGlvbnNUb1JlcXVlc3RQYXJhbWV0ZXJzKG9wdGlvbnMpKSwgeyBib2R5OiB7XG4gICAgICAgICAgICBtb2RlbDogYm9keVtcIm1vZGVsXCJdLFxuICAgICAgICAgICAgc3RyZWFtOiBib2R5W1wic3RyZWFtXCJdLFxuICAgICAgICAgICAgbWF4X3Rva2VuczogYm9keVtcIm1heFRva2Vuc1wiXSxcbiAgICAgICAgICAgIHRlbXBlcmF0dXJlOiBib2R5W1widGVtcGVyYXR1cmVcIl0sXG4gICAgICAgICAgICB0b3BfcDogYm9keVtcInRvcFBcIl0sXG4gICAgICAgICAgICBsb2dpdF9iaWFzOiBib2R5W1wibG9naXRCaWFzXCJdLFxuICAgICAgICAgICAgdXNlcjogYm9keVtcInVzZXJcIl0sXG4gICAgICAgICAgICBuOiBib2R5W1wiblwiXSxcbiAgICAgICAgICAgIHN0b3A6IGJvZHlbXCJzdG9wXCJdLFxuICAgICAgICAgICAgcHJlc2VuY2VfcGVuYWx0eTogYm9keVtcInByZXNlbmNlUGVuYWx0eVwiXSxcbiAgICAgICAgICAgIGZyZXF1ZW5jeV9wZW5hbHR5OiBib2R5W1wiZnJlcXVlbmN5UGVuYWx0eVwiXSxcbiAgICAgICAgICAgIGRhdGFfc291cmNlczogYm9keVtcImRhdGFTb3VyY2VzXCJdID09PSB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICA/IGJvZHlbXCJkYXRhU291cmNlc1wiXVxuICAgICAgICAgICAgICAgIDogYm9keVtcImRhdGFTb3VyY2VzXCJdLm1hcCgocCkgPT4gc2VyaWFsaXplQXp1cmVDaGF0RXh0ZW5zaW9uQ29uZmlndXJhdGlvblVuaW9uKHApKSxcbiAgICAgICAgICAgIGVuaGFuY2VtZW50czogIWJvZHkuZW5oYW5jZW1lbnRzXG4gICAgICAgICAgICAgICAgPyB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICA6IHtcbiAgICAgICAgICAgICAgICAgICAgZ3JvdW5kaW5nOiAhKChfYSA9IGJvZHkuZW5oYW5jZW1lbnRzKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuZ3JvdW5kaW5nKVxuICAgICAgICAgICAgICAgICAgICAgICAgPyB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICAgICAgICAgIDogeyBlbmFibGVkOiAoX2MgPSAoX2IgPSBib2R5LmVuaGFuY2VtZW50cykgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLmdyb3VuZGluZykgPT09IG51bGwgfHwgX2MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9jW1wiZW5hYmxlZFwiXSB9LFxuICAgICAgICAgICAgICAgICAgICBvY3I6ICEoKF9kID0gYm9keS5lbmhhbmNlbWVudHMpID09PSBudWxsIHx8IF9kID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZC5vY3IpXG4gICAgICAgICAgICAgICAgICAgICAgICA/IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgICAgICAgICAgOiB7IGVuYWJsZWQ6IChfZiA9IChfZSA9IGJvZHkuZW5oYW5jZW1lbnRzKSA9PT0gbnVsbCB8fCBfZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2Uub2NyKSA9PT0gbnVsbCB8fCBfZiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2ZbXCJlbmFibGVkXCJdIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNlZWQ6IGJvZHlbXCJzZWVkXCJdLFxuICAgICAgICAgICAgbG9ncHJvYnM6IGJvZHlbXCJsb2dwcm9ic1wiXSxcbiAgICAgICAgICAgIHRvcF9sb2dwcm9iczogYm9keVtcInRvcExvZ3Byb2JzXCJdLFxuICAgICAgICAgICAgcmVzcG9uc2VfZm9ybWF0OiAhYm9keS5yZXNwb25zZUZvcm1hdCA/IHVuZGVmaW5lZCA6IHsgdHlwZTogKF9nID0gYm9keS5yZXNwb25zZUZvcm1hdCkgPT09IG51bGwgfHwgX2cgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9nW1widHlwZVwiXSB9LFxuICAgICAgICAgICAgdG9vbF9jaG9pY2U6IGJvZHlbXCJ0b29sQ2hvaWNlXCJdLFxuICAgICAgICAgICAgdG9vbHM6IGJvZHlbXCJ0b29sc1wiXSxcbiAgICAgICAgICAgIGZ1bmN0aW9uczogYm9keVtcImZ1bmN0aW9uc1wiXSA9PT0gdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgPyBib2R5W1wiZnVuY3Rpb25zXCJdXG4gICAgICAgICAgICAgICAgOiBib2R5W1wiZnVuY3Rpb25zXCJdLm1hcCgocCkgPT4gKHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogcFtcIm5hbWVcIl0sXG4gICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBwW1wiZGVzY3JpcHRpb25cIl0sXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtZXRlcnM6IHBbXCJwYXJhbWV0ZXJzXCJdLFxuICAgICAgICAgICAgICAgIH0pKSxcbiAgICAgICAgICAgIGZ1bmN0aW9uX2NhbGw6IGJvZHlbXCJmdW5jdGlvbkNhbGxcIl0sXG4gICAgICAgICAgICBtZXNzYWdlczogYm9keVtcIm1lc3NhZ2VzXCJdLm1hcCgocCkgPT4gc2VyaWFsaXplQ2hhdFJlcXVlc3RNZXNzYWdlVW5pb24ocCkpLFxuICAgICAgICB9IH0pKTtcbn1cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBfZ2V0Q2hhdENvbXBsZXRpb25zRGVzZXJpYWxpemUocmVzdWx0KSB7XG4gICAgaWYgKGlzVW5leHBlY3RlZChyZXN1bHQpKSB7XG4gICAgICAgIHRocm93IHJlc3VsdC5ib2R5LmVycm9yO1xuICAgIH1cbiAgICByZXR1cm4gZ2V0Q2hhdENvbXBsZXRpb25zUmVzdWx0KHJlc3VsdC5ib2R5KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBnZXRDaGF0Q29tcGxldGlvbnNSZXN1bHQoYm9keSkge1xuICAgIGNvbnN0IHsgY3JlYXRlZCwgY2hvaWNlcywgcHJvbXB0X2ZpbHRlcl9yZXN1bHRzLCBwcm9tcHRfYW5ub3RhdGlvbnMsIHVzYWdlIH0gPSBib2R5LCByZXN0ID0gX19yZXN0KGJvZHksIFtcImNyZWF0ZWRcIiwgXCJjaG9pY2VzXCIsIFwicHJvbXB0X2ZpbHRlcl9yZXN1bHRzXCIsIFwicHJvbXB0X2Fubm90YXRpb25zXCIsIFwidXNhZ2VcIl0pO1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIGNhbWVsQ2FzZUtleXMocmVzdCkpLCB7IGNyZWF0ZWQ6IG5ldyBEYXRlKGNyZWF0ZWQpIH0pLCB7XG4gICAgICAgIHByb21wdEZpbHRlclJlc3VsdHM6IGdldENvbnRlbnRGaWx0ZXJSZXN1bHRzRm9yUHJvbXB0KHtcbiAgICAgICAgICAgIHByb21wdF9maWx0ZXJfcmVzdWx0cyxcbiAgICAgICAgICAgIHByb21wdF9hbm5vdGF0aW9ucyxcbiAgICAgICAgfSksXG4gICAgfSksICghdXNhZ2VcbiAgICAgICAgPyB7fVxuICAgICAgICA6IHtcbiAgICAgICAgICAgIHVzYWdlOiB7XG4gICAgICAgICAgICAgICAgY29tcGxldGlvblRva2VuczogdXNhZ2VbXCJjb21wbGV0aW9uX3Rva2Vuc1wiXSxcbiAgICAgICAgICAgICAgICBwcm9tcHRUb2tlbnM6IHVzYWdlW1wicHJvbXB0X3Rva2Vuc1wiXSxcbiAgICAgICAgICAgICAgICB0b3RhbFRva2VuczogdXNhZ2VbXCJ0b3RhbF90b2tlbnNcIl0sXG4gICAgICAgICAgICB9LFxuICAgICAgICB9KSksIHsgY2hvaWNlczogIWNob2ljZXNcbiAgICAgICAgICAgID8gW11cbiAgICAgICAgICAgIDogY2hvaWNlcy5tYXAoKF9hKSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIHsgY29udGVudF9maWx0ZXJfcmVzdWx0cyB9ID0gX2EsIGNob2ljZSA9IF9fcmVzdChfYSwgW1wiY29udGVudF9maWx0ZXJfcmVzdWx0c1wiXSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIGNhbWVsQ2FzZUtleXMoY2hvaWNlKSksICghY29udGVudF9maWx0ZXJfcmVzdWx0c1xuICAgICAgICAgICAgICAgICAgICA/IHt9XG4gICAgICAgICAgICAgICAgICAgIDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudEZpbHRlclJlc3VsdHM6IHBhcnNlQ29udGVudEZpbHRlclJlc3VsdHNGb3JDaG9pY2VPdXRwdXQoY29udGVudF9maWx0ZXJfcmVzdWx0cyksXG4gICAgICAgICAgICAgICAgICAgIH0pKSk7XG4gICAgICAgICAgICB9KSB9KTtcbn1cbi8qKlxuICogR2V0cyBjaGF0IGNvbXBsZXRpb25zIGZvciB0aGUgcHJvdmlkZWQgY2hhdCBtZXNzYWdlcy5cbiAqIENvbXBsZXRpb25zIHN1cHBvcnQgYSB3aWRlIHZhcmlldHkgb2YgdGFza3MgYW5kIGdlbmVyYXRlIHRleHQgdGhhdCBjb250aW51ZXMgZnJvbSBvciBcImNvbXBsZXRlc1wiXG4gKiBwcm92aWRlZCBwcm9tcHQgZGF0YS5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldENoYXRDb21wbGV0aW9ucyhjb250ZXh0LCBkZXBsb3ltZW50TmFtZSwgbWVzc2FnZXMsIG9wdGlvbnMgPSB7IHJlcXVlc3RPcHRpb25zOiB7fSB9KSB7XG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgX2dldENoYXRDb21wbGV0aW9uc1NlbmRYKGNvbnRleHQsIGRlcGxveW1lbnROYW1lLCBtZXNzYWdlcywgb3B0aW9ucyk7XG4gICAgcmV0dXJuIF9nZXRDaGF0Q29tcGxldGlvbnNEZXNlcmlhbGl6ZShyZXN1bHQpO1xufVxuZnVuY3Rpb24gX2dldENoYXRDb21wbGV0aW9uc1NlbmRYKGNvbnRleHQsIGRlcGxveW1lbnROYW1lLCBtZXNzYWdlcywgb3B0aW9ucyA9IHsgcmVxdWVzdE9wdGlvbnM6IHt9IH0pIHtcbiAgICBjb25zdCB7IGF6dXJlRXh0ZW5zaW9uT3B0aW9ucywgYWJvcnRTaWduYWwsIG9uUmVzcG9uc2UsIHJlcXVlc3RPcHRpb25zLCB0cmFjaW5nT3B0aW9ucyB9ID0gb3B0aW9ucywgcmVzdCA9IF9fcmVzdChvcHRpb25zLCBbXCJhenVyZUV4dGVuc2lvbk9wdGlvbnNcIiwgXCJhYm9ydFNpZ25hbFwiLCBcIm9uUmVzcG9uc2VcIiwgXCJyZXF1ZXN0T3B0aW9uc1wiLCBcInRyYWNpbmdPcHRpb25zXCJdKTtcbiAgICBjb25zdCBjb3JlT3B0aW9ucyA9IHtcbiAgICAgICAgYWJvcnRTaWduYWwsXG4gICAgICAgIG9uUmVzcG9uc2UsXG4gICAgICAgIHJlcXVlc3RPcHRpb25zLFxuICAgICAgICB0cmFjaW5nT3B0aW9ucyxcbiAgICB9O1xuICAgIGNvbnN0IGF6dXJlID0gT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCAoIShhenVyZUV4dGVuc2lvbk9wdGlvbnMgPT09IG51bGwgfHwgYXp1cmVFeHRlbnNpb25PcHRpb25zID09PSB2b2lkIDAgPyB2b2lkIDAgOiBhenVyZUV4dGVuc2lvbk9wdGlvbnMuZXh0ZW5zaW9ucylcbiAgICAgICAgPyB7fVxuICAgICAgICA6IHsgZGF0YVNvdXJjZXM6IGF6dXJlRXh0ZW5zaW9uT3B0aW9ucy5leHRlbnNpb25zIH0pKSwgKCEoYXp1cmVFeHRlbnNpb25PcHRpb25zID09PSBudWxsIHx8IGF6dXJlRXh0ZW5zaW9uT3B0aW9ucyA9PT0gdm9pZCAwID8gdm9pZCAwIDogYXp1cmVFeHRlbnNpb25PcHRpb25zLmVuaGFuY2VtZW50cylcbiAgICAgICAgPyB7fVxuICAgICAgICA6IHsgZW5oYW5jZW1lbnRzOiBhenVyZUV4dGVuc2lvbk9wdGlvbnMuZW5oYW5jZW1lbnRzIH0pKTtcbiAgICByZXR1cm4gX2dldENoYXRDb21wbGV0aW9uc1NlbmQoY29udGV4dCwgZGVwbG95bWVudE5hbWUsIE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7IG1lc3NhZ2VzIH0sIHJlc3QpLCBhenVyZSksIGNvcmVPcHRpb25zKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBzdHJlYW1DaGF0Q29tcGxldGlvbnMoY29udGV4dCwgZGVwbG95bWVudE5hbWUsIG1lc3NhZ2VzLCBvcHRpb25zID0geyByZXF1ZXN0T3B0aW9uczoge30gfSkge1xuICAgIGNvbnN0IHJlc3BvbnNlID0gX2dldENoYXRDb21wbGV0aW9uc1NlbmRYKGNvbnRleHQsIGRlcGxveW1lbnROYW1lLCBtZXNzYWdlcywgT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zKSwgeyBzdHJlYW06IHRydWUgfSkpO1xuICAgIHJldHVybiBnZXRPYWlTU0VzKHJlc3BvbnNlLCBnZXRDaGF0Q29tcGxldGlvbnNSZXN1bHQpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIF9nZXRJbWFnZUdlbmVyYXRpb25zU2VuZChjb250ZXh0LCBkZXBsb3ltZW50SWQsIGJvZHksIG9wdGlvbnMgPSB7IHJlcXVlc3RPcHRpb25zOiB7fSB9KSB7XG4gICAgcmV0dXJuIGNvbnRleHQucGF0aChcIi9kZXBsb3ltZW50cy97ZGVwbG95bWVudElkfS9pbWFnZXMvZ2VuZXJhdGlvbnNcIiwgZGVwbG95bWVudElkKS5wb3N0KE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgb3BlcmF0aW9uT3B0aW9uc1RvUmVxdWVzdFBhcmFtZXRlcnMob3B0aW9ucykpLCB7IGJvZHk6IHtcbiAgICAgICAgICAgIG1vZGVsOiBib2R5W1wibW9kZWxcIl0sXG4gICAgICAgICAgICBwcm9tcHQ6IGJvZHlbXCJwcm9tcHRcIl0sXG4gICAgICAgICAgICBuOiBib2R5W1wiblwiXSxcbiAgICAgICAgICAgIHNpemU6IGJvZHlbXCJzaXplXCJdLFxuICAgICAgICAgICAgcmVzcG9uc2VfZm9ybWF0OiBib2R5W1wicmVzcG9uc2VGb3JtYXRcIl0sXG4gICAgICAgICAgICBxdWFsaXR5OiBib2R5W1wicXVhbGl0eVwiXSxcbiAgICAgICAgICAgIHN0eWxlOiBib2R5W1wic3R5bGVcIl0sXG4gICAgICAgICAgICB1c2VyOiBib2R5W1widXNlclwiXSxcbiAgICAgICAgfSB9KSk7XG59XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gX2dldEltYWdlR2VuZXJhdGlvbnNEZXNlcmlhbGl6ZShyZXN1bHQpIHtcbiAgICBpZiAoaXNVbmV4cGVjdGVkKHJlc3VsdCkpIHtcbiAgICAgICAgdGhyb3cgcmVzdWx0LmJvZHkuZXJyb3I7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIGNyZWF0ZWQ6IG5ldyBEYXRlKHJlc3VsdC5ib2R5W1wiY3JlYXRlZFwiXSksXG4gICAgICAgIGRhdGE6IHJlc3VsdC5ib2R5W1wiZGF0YVwiXS5tYXAoKHApID0+IHtcbiAgICAgICAgICAgIHZhciBfYSwgX2IsIF9jLCBfZCwgX2UsIF9mLCBfZywgX2gsIF9qLCBfaywgX2wsIF9tLCBfbywgX3AsIF9xLCBfciwgX3MsIF90LCBfdSwgX3YsIF93LCBfeCwgX3ksIF96LCBfMCwgXzEsIF8yLCBfMywgXzQsIF81LCBfNiwgXzcsIF84LCBfOSwgXzEwLCBfMTEsIF8xMiwgXzEzLCBfMTQsIF8xNSwgXzE2LCBfMTcsIF8xOCwgXzE5LCBfMjAsIF8yMSwgXzIyLCBfMjMsIF8yNCwgXzI1O1xuICAgICAgICAgICAgcmV0dXJuICh7XG4gICAgICAgICAgICAgICAgdXJsOiBwW1widXJsXCJdLFxuICAgICAgICAgICAgICAgIGJhc2U2NERhdGE6IHBbXCJiNjRfanNvblwiXSxcbiAgICAgICAgICAgICAgICBjb250ZW50RmlsdGVyUmVzdWx0czogIXAuY29udGVudF9maWx0ZXJfcmVzdWx0c1xuICAgICAgICAgICAgICAgICAgICA/IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgICAgICA6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNleHVhbDogISgoX2EgPSBwLmNvbnRlbnRfZmlsdGVyX3Jlc3VsdHMpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5zZXh1YWwpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPyB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V2ZXJpdHk6IChfYyA9IChfYiA9IHAuY29udGVudF9maWx0ZXJfcmVzdWx0cykgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLnNleHVhbCkgPT09IG51bGwgfHwgX2MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9jW1wic2V2ZXJpdHlcIl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlcmVkOiAoX2UgPSAoX2QgPSBwLmNvbnRlbnRfZmlsdGVyX3Jlc3VsdHMpID09PSBudWxsIHx8IF9kID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZC5zZXh1YWwpID09PSBudWxsIHx8IF9lID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZVtcImZpbHRlcmVkXCJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB2aW9sZW5jZTogISgoX2YgPSBwLmNvbnRlbnRfZmlsdGVyX3Jlc3VsdHMpID09PSBudWxsIHx8IF9mID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZi52aW9sZW5jZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXZlcml0eTogKF9oID0gKF9nID0gcC5jb250ZW50X2ZpbHRlcl9yZXN1bHRzKSA9PT0gbnVsbCB8fCBfZyA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2cudmlvbGVuY2UpID09PSBudWxsIHx8IF9oID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfaFtcInNldmVyaXR5XCJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJlZDogKF9rID0gKF9qID0gcC5jb250ZW50X2ZpbHRlcl9yZXN1bHRzKSA9PT0gbnVsbCB8fCBfaiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2oudmlvbGVuY2UpID09PSBudWxsIHx8IF9rID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfa1tcImZpbHRlcmVkXCJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBoYXRlOiAhKChfbCA9IHAuY29udGVudF9maWx0ZXJfcmVzdWx0cykgPT09IG51bGwgfHwgX2wgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9sLmhhdGUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPyB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V2ZXJpdHk6IChfbyA9IChfbSA9IHAuY29udGVudF9maWx0ZXJfcmVzdWx0cykgPT09IG51bGwgfHwgX20gPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9tLmhhdGUpID09PSBudWxsIHx8IF9vID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfb1tcInNldmVyaXR5XCJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJlZDogKF9xID0gKF9wID0gcC5jb250ZW50X2ZpbHRlcl9yZXN1bHRzKSA9PT0gbnVsbCB8fCBfcCA9PT0gdm9pZCAwID8gdm9pZCAwIDogX3AuaGF0ZSkgPT09IG51bGwgfHwgX3EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9xW1wiZmlsdGVyZWRcIl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGZIYXJtOiAhKChfciA9IHAuY29udGVudF9maWx0ZXJfcmVzdWx0cykgPT09IG51bGwgfHwgX3IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9yLnNlbGZfaGFybSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXZlcml0eTogKF90ID0gKF9zID0gcC5jb250ZW50X2ZpbHRlcl9yZXN1bHRzKSA9PT0gbnVsbCB8fCBfcyA9PT0gdm9pZCAwID8gdm9pZCAwIDogX3Muc2VsZl9oYXJtKSA9PT0gbnVsbCB8fCBfdCA9PT0gdm9pZCAwID8gdm9pZCAwIDogX3RbXCJzZXZlcml0eVwiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyZWQ6IChfdiA9IChfdSA9IHAuY29udGVudF9maWx0ZXJfcmVzdWx0cykgPT09IG51bGwgfHwgX3UgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF91LnNlbGZfaGFybSkgPT09IG51bGwgfHwgX3YgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF92W1wiZmlsdGVyZWRcIl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICByZXZpc2VkUHJvbXB0OiBwW1wicmV2aXNlZF9wcm9tcHRcIl0sXG4gICAgICAgICAgICAgICAgcHJvbXB0RmlsdGVyUmVzdWx0czogIXAucHJvbXB0X2ZpbHRlcl9yZXN1bHRzXG4gICAgICAgICAgICAgICAgICAgID8gdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgICAgIDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V4dWFsOiAhKChfdyA9IHAucHJvbXB0X2ZpbHRlcl9yZXN1bHRzKSA9PT0gbnVsbCB8fCBfdyA9PT0gdm9pZCAwID8gdm9pZCAwIDogX3cuc2V4dWFsKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldmVyaXR5OiAoX3kgPSAoX3ggPSBwLnByb21wdF9maWx0ZXJfcmVzdWx0cykgPT09IG51bGwgfHwgX3ggPT09IHZvaWQgMCA/IHZvaWQgMCA6IF94LnNleHVhbCkgPT09IG51bGwgfHwgX3kgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF95W1wic2V2ZXJpdHlcIl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlcmVkOiAoXzAgPSAoX3ogPSBwLnByb21wdF9maWx0ZXJfcmVzdWx0cykgPT09IG51bGwgfHwgX3ogPT09IHZvaWQgMCA/IHZvaWQgMCA6IF96LnNleHVhbCkgPT09IG51bGwgfHwgXzAgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF8wW1wiZmlsdGVyZWRcIl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpb2xlbmNlOiAhKChfMSA9IHAucHJvbXB0X2ZpbHRlcl9yZXN1bHRzKSA9PT0gbnVsbCB8fCBfMSA9PT0gdm9pZCAwID8gdm9pZCAwIDogXzEudmlvbGVuY2UpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPyB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V2ZXJpdHk6IChfMyA9IChfMiA9IHAucHJvbXB0X2ZpbHRlcl9yZXN1bHRzKSA9PT0gbnVsbCB8fCBfMiA9PT0gdm9pZCAwID8gdm9pZCAwIDogXzIudmlvbGVuY2UpID09PSBudWxsIHx8IF8zID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfM1tcInNldmVyaXR5XCJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJlZDogKF81ID0gKF80ID0gcC5wcm9tcHRfZmlsdGVyX3Jlc3VsdHMpID09PSBudWxsIHx8IF80ID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfNC52aW9sZW5jZSkgPT09IG51bGwgfHwgXzUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF81W1wiZmlsdGVyZWRcIl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhdGU6ICEoKF82ID0gcC5wcm9tcHRfZmlsdGVyX3Jlc3VsdHMpID09PSBudWxsIHx8IF82ID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfNi5oYXRlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldmVyaXR5OiAoXzggPSAoXzcgPSBwLnByb21wdF9maWx0ZXJfcmVzdWx0cykgPT09IG51bGwgfHwgXzcgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF83LmhhdGUpID09PSBudWxsIHx8IF84ID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfOFtcInNldmVyaXR5XCJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJlZDogKF8xMCA9IChfOSA9IHAucHJvbXB0X2ZpbHRlcl9yZXN1bHRzKSA9PT0gbnVsbCB8fCBfOSA9PT0gdm9pZCAwID8gdm9pZCAwIDogXzkuaGF0ZSkgPT09IG51bGwgfHwgXzEwID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfMTBbXCJmaWx0ZXJlZFwiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZkhhcm06ICEoKF8xMSA9IHAucHJvbXB0X2ZpbHRlcl9yZXN1bHRzKSA9PT0gbnVsbCB8fCBfMTEgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF8xMS5zZWxmX2hhcm0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPyB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V2ZXJpdHk6IChfMTMgPSAoXzEyID0gcC5wcm9tcHRfZmlsdGVyX3Jlc3VsdHMpID09PSBudWxsIHx8IF8xMiA9PT0gdm9pZCAwID8gdm9pZCAwIDogXzEyLnNlbGZfaGFybSkgPT09IG51bGwgfHwgXzEzID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfMTNbXCJzZXZlcml0eVwiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyZWQ6IChfMTUgPSAoXzE0ID0gcC5wcm9tcHRfZmlsdGVyX3Jlc3VsdHMpID09PSBudWxsIHx8IF8xNCA9PT0gdm9pZCAwID8gdm9pZCAwIDogXzE0LnNlbGZfaGFybSkgPT09IG51bGwgfHwgXzE1ID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfMTVbXCJmaWx0ZXJlZFwiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvZmFuaXR5OiAhKChfMTYgPSBwLnByb21wdF9maWx0ZXJfcmVzdWx0cykgPT09IG51bGwgfHwgXzE2ID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfMTYucHJvZmFuaXR5KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlcmVkOiAoXzE4ID0gKF8xNyA9IHAucHJvbXB0X2ZpbHRlcl9yZXN1bHRzKSA9PT0gbnVsbCB8fCBfMTcgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF8xNy5wcm9mYW5pdHkpID09PSBudWxsIHx8IF8xOCA9PT0gdm9pZCAwID8gdm9pZCAwIDogXzE4W1wiZmlsdGVyZWRcIl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRldGVjdGVkOiAoXzIwID0gKF8xOSA9IHAucHJvbXB0X2ZpbHRlcl9yZXN1bHRzKSA9PT0gbnVsbCB8fCBfMTkgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF8xOS5wcm9mYW5pdHkpID09PSBudWxsIHx8IF8yMCA9PT0gdm9pZCAwID8gdm9pZCAwIDogXzIwW1wiZGV0ZWN0ZWRcIl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGphaWxicmVhazogISgoXzIxID0gcC5wcm9tcHRfZmlsdGVyX3Jlc3VsdHMpID09PSBudWxsIHx8IF8yMSA9PT0gdm9pZCAwID8gdm9pZCAwIDogXzIxLmphaWxicmVhaylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJlZDogKF8yMyA9IChfMjIgPSBwLnByb21wdF9maWx0ZXJfcmVzdWx0cykgPT09IG51bGwgfHwgXzIyID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfMjIuamFpbGJyZWFrKSA9PT0gbnVsbCB8fCBfMjMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF8yM1tcImZpbHRlcmVkXCJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXRlY3RlZDogKF8yNSA9IChfMjQgPSBwLnByb21wdF9maWx0ZXJfcmVzdWx0cykgPT09IG51bGwgfHwgXzI0ID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfMjQuamFpbGJyZWFrKSA9PT0gbnVsbCB8fCBfMjUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF8yNVtcImRldGVjdGVkXCJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSksXG4gICAgfTtcbn1cbi8qKiBDcmVhdGVzIGFuIGltYWdlIGdpdmVuIGEgcHJvbXB0LiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldEltYWdlR2VuZXJhdGlvbnMoY29udGV4dCwgZGVwbG95bWVudElkLCBib2R5LCBvcHRpb25zID0geyByZXF1ZXN0T3B0aW9uczoge30gfSkge1xuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IF9nZXRJbWFnZUdlbmVyYXRpb25zU2VuZChjb250ZXh0LCBkZXBsb3ltZW50SWQsIGJvZHksIG9wdGlvbnMpO1xuICAgIHJldHVybiBfZ2V0SW1hZ2VHZW5lcmF0aW9uc0Rlc2VyaWFsaXplKHJlc3VsdCk7XG59XG5leHBvcnQgZnVuY3Rpb24gX2dldEVtYmVkZGluZ3NTZW5kKGNvbnRleHQsIGRlcGxveW1lbnRJZCwgYm9keSwgb3B0aW9ucyA9IHsgcmVxdWVzdE9wdGlvbnM6IHt9IH0pIHtcbiAgICByZXR1cm4gY29udGV4dC5wYXRoKFwiL2RlcGxveW1lbnRzL3tkZXBsb3ltZW50SWR9L2VtYmVkZGluZ3NcIiwgZGVwbG95bWVudElkKS5wb3N0KE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgb3BlcmF0aW9uT3B0aW9uc1RvUmVxdWVzdFBhcmFtZXRlcnMob3B0aW9ucykpLCB7IGJvZHk6IHtcbiAgICAgICAgICAgIHVzZXI6IGJvZHlbXCJ1c2VyXCJdLFxuICAgICAgICAgICAgbW9kZWw6IGJvZHlbXCJtb2RlbFwiXSxcbiAgICAgICAgICAgIGlucHV0OiBib2R5W1wiaW5wdXRcIl0sXG4gICAgICAgICAgICBkaW1lbnNpb25zOiBib2R5W1wiZGltZW5zaW9uc1wiXSxcbiAgICAgICAgfSB9KSk7XG59XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gX2dldEVtYmVkZGluZ3NEZXNlcmlhbGl6ZShyZXN1bHQpIHtcbiAgICBpZiAoaXNVbmV4cGVjdGVkKHJlc3VsdCkpIHtcbiAgICAgICAgdGhyb3cgcmVzdWx0LmJvZHkuZXJyb3I7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIGRhdGE6IHJlc3VsdC5ib2R5W1wiZGF0YVwiXS5tYXAoKHApID0+ICh7XG4gICAgICAgICAgICBlbWJlZGRpbmc6IHBbXCJlbWJlZGRpbmdcIl0sXG4gICAgICAgICAgICBpbmRleDogcFtcImluZGV4XCJdLFxuICAgICAgICB9KSksXG4gICAgICAgIHVzYWdlOiB7XG4gICAgICAgICAgICBwcm9tcHRUb2tlbnM6IHJlc3VsdC5ib2R5LnVzYWdlW1wicHJvbXB0X3Rva2Vuc1wiXSxcbiAgICAgICAgICAgIHRvdGFsVG9rZW5zOiByZXN1bHQuYm9keS51c2FnZVtcInRvdGFsX3Rva2Vuc1wiXSxcbiAgICAgICAgfSxcbiAgICB9O1xufVxuLyoqIFJldHVybiB0aGUgZW1iZWRkaW5ncyBmb3IgYSBnaXZlbiBwcm9tcHQuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0RW1iZWRkaW5ncyhjb250ZXh0LCBkZXBsb3ltZW50SWQsIGJvZHksIG9wdGlvbnMgPSB7IHJlcXVlc3RPcHRpb25zOiB7fSB9KSB7XG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgX2dldEVtYmVkZGluZ3NTZW5kKGNvbnRleHQsIGRlcGxveW1lbnRJZCwgYm9keSwgb3B0aW9ucyk7XG4gICAgcmV0dXJuIF9nZXRFbWJlZGRpbmdzRGVzZXJpYWxpemUocmVzdWx0KTtcbn1cbmZ1bmN0aW9uIGdldENvbnRlbnRGaWx0ZXJSZXN1bHRzRm9yUHJvbXB0KHsgcHJvbXB0X2Fubm90YXRpb25zLCBwcm9tcHRfZmlsdGVyX3Jlc3VsdHMsIH0pIHtcbiAgICBjb25zdCByZXMgPSBwcm9tcHRfZmlsdGVyX3Jlc3VsdHMgIT09IG51bGwgJiYgcHJvbXB0X2ZpbHRlcl9yZXN1bHRzICE9PSB2b2lkIDAgPyBwcm9tcHRfZmlsdGVyX3Jlc3VsdHMgOiBwcm9tcHRfYW5ub3RhdGlvbnM7XG4gICAgcmV0dXJuIHJlcyA9PT0gbnVsbCB8fCByZXMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHJlcy5tYXAoKF9hKSA9PiB7XG4gICAgICAgIHZhciB7IGNvbnRlbnRfZmlsdGVyX3Jlc3VsdHMgfSA9IF9hLCByZXN0ID0gX19yZXN0KF9hLCBbXCJjb250ZW50X2ZpbHRlcl9yZXN1bHRzXCJdKTtcbiAgICAgICAgcmV0dXJuIChPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIGNhbWVsQ2FzZUtleXMocmVzdCkpLCB7IGNvbnRlbnRGaWx0ZXJSZXN1bHRzOiBwYXJzZUNvbnRlbnRGaWx0ZXJSZXN1bHREZXRhaWxzRm9yUHJvbXB0T3V0cHV0KGNvbnRlbnRfZmlsdGVyX3Jlc3VsdHMpIH0pKTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIHBhcnNlQ29udGVudEZpbHRlclJlc3VsdERldGFpbHNGb3JQcm9tcHRPdXRwdXQoX2EgPSB7fSkge1xuICAgIHZhciB7IGVycm9yIH0gPSBfYSwgcmVzdCA9IF9fcmVzdChfYSwgW1wiZXJyb3JcIl0pO1xuICAgIHJldHVybiBlcnJvciA/IHBhcnNlRXJyb3IoZXJyb3IpIDogY2FtZWxDYXNlS2V5cyhyZXN0KTtcbn1cbmZ1bmN0aW9uIHBhcnNlRXJyb3IoZXJyb3IpIHtcbiAgICB2YXIgX2E7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgZXJyb3I6IE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgZXJyb3IpLCB7IGRldGFpbHM6IChfYSA9IGVycm9yW1wiZGV0YWlsc1wiXSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogW10gfSksXG4gICAgfTtcbn1cbmZ1bmN0aW9uIHBhcnNlQ29udGVudEZpbHRlclJlc3VsdHNGb3JDaG9pY2VPdXRwdXQoX2EgPSB7fSkge1xuICAgIHZhciBfYjtcbiAgICB2YXIgeyBlcnJvciB9ID0gX2EsIHN1Y2Nlc3NSZXN1bHQgPSBfX3Jlc3QoX2EsIFtcImVycm9yXCJdKTtcbiAgICByZXR1cm4gZXJyb3JcbiAgICAgICAgPyB7XG4gICAgICAgICAgICBlcnJvcjogT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCBlcnJvciksIHsgZGV0YWlsczogKF9iID0gZXJyb3JbXCJkZXRhaWxzXCJdKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiBbXSB9KSxcbiAgICAgICAgfVxuICAgICAgICA6IGNhbWVsQ2FzZUtleXMoc3VjY2Vzc1Jlc3VsdCk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1vcGVyYXRpb25zLmpzLm1hcCIsIi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuZXhwb3J0IGZ1bmN0aW9uIG5vbkF6dXJlUG9saWN5KCkge1xuICAgIGNvbnN0IHBvbGljeSA9IHtcbiAgICAgICAgbmFtZTogXCJvcGVuQWlFbmRwb2ludFwiLFxuICAgICAgICBzZW5kUmVxdWVzdDogKHJlcXVlc3QsIG5leHQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBVUkwocmVxdWVzdC51cmwpO1xuICAgICAgICAgICAgY29uc3QgcGFydHMgPSBvYmoucGF0aG5hbWUuc3BsaXQoXCIvXCIpO1xuICAgICAgICAgICAgc3dpdGNoIChwYXJ0c1twYXJ0cy5sZW5ndGggLSAxXSkge1xuICAgICAgICAgICAgICAgIGNhc2UgXCJjb21wbGV0aW9uc1wiOlxuICAgICAgICAgICAgICAgICAgICBpZiAocGFydHNbcGFydHMubGVuZ3RoIC0gMl0gPT09IFwiY2hhdFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvYmoucGF0aG5hbWUgPSBgJHtwYXJ0c1sxXX0vY2hhdC9jb21wbGV0aW9uc2A7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvYmoucGF0aG5hbWUgPSBgJHtwYXJ0c1sxXX0vY29tcGxldGlvbnNgO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJlbWJlZGRpbmdzXCI6XG4gICAgICAgICAgICAgICAgICAgIG9iai5wYXRobmFtZSA9IGAke3BhcnRzWzFdfS9lbWJlZGRpbmdzYDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcImdlbmVyYXRpb25zXCI6XG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJ0c1twYXJ0cy5sZW5ndGggLSAyXSA9PT0gXCJpbWFnZXNcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgb2JqLnBhdGhuYW1lID0gYCR7cGFydHNbMV19L2ltYWdlcy9nZW5lcmF0aW9uc2A7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmV4cGVjdGVkIHBhdGhcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcInRyYW5zY3JpcHRpb25zXCI6XG4gICAgICAgICAgICAgICAgICAgIG9iai5wYXRobmFtZSA9IGAke3BhcnRzWzFdfS9hdWRpby90cmFuc2NyaXB0aW9uc2A7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJ0cmFuc2xhdGlvbnNcIjpcbiAgICAgICAgICAgICAgICAgICAgb2JqLnBhdGhuYW1lID0gYCR7cGFydHNbMV19L2F1ZGlvL3RyYW5zbGF0aW9uc2A7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb2JqLnNlYXJjaFBhcmFtcy5kZWxldGUoXCJhcGktdmVyc2lvblwiKTtcbiAgICAgICAgICAgIHJlcXVlc3QudXJsID0gb2JqLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICByZXR1cm4gbmV4dChyZXF1ZXN0KTtcbiAgICAgICAgfSxcbiAgICB9O1xuICAgIHJldHVybiBwb2xpY3k7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1ub25BenVyZS5qcy5tYXAiLCIvLyBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi5cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbmltcG9ydCB7IF9fYXN5bmNHZW5lcmF0b3IsIF9fYXdhaXQgfSBmcm9tIFwidHNsaWJcIjtcbmV4cG9ydCBmdW5jdGlvbiBwb2x5ZmlsbFN0cmVhbShzdHJlYW0pIHtcbiAgICBtYWtlQXN5bmNJdGVyYWJsZShzdHJlYW0pO1xuICAgIHJldHVybiBzdHJlYW07XG59XG5mdW5jdGlvbiBtYWtlQXN5bmNJdGVyYWJsZSh3ZWJTdHJlYW0pIHtcbiAgICBpZiAoIXdlYlN0cmVhbVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0pIHtcbiAgICAgICAgd2ViU3RyZWFtW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9ICgpID0+IHRvQXN5bmNJdGVyYWJsZSh3ZWJTdHJlYW0pO1xuICAgIH1cbiAgICBpZiAoIXdlYlN0cmVhbS52YWx1ZXMpIHtcbiAgICAgICAgd2ViU3RyZWFtLnZhbHVlcyA9ICgpID0+IHRvQXN5bmNJdGVyYWJsZSh3ZWJTdHJlYW0pO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHRvQXN5bmNJdGVyYWJsZShzdHJlYW0pIHtcbiAgICByZXR1cm4gX19hc3luY0dlbmVyYXRvcih0aGlzLCBhcmd1bWVudHMsIGZ1bmN0aW9uKiB0b0FzeW5jSXRlcmFibGVfMSgpIHtcbiAgICAgICAgY29uc3QgcmVhZGVyID0gc3RyZWFtLmdldFJlYWRlcigpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IHZhbHVlLCBkb25lIH0gPSB5aWVsZCBfX2F3YWl0KHJlYWRlci5yZWFkKCkpO1xuICAgICAgICAgICAgICAgIGlmIChkb25lKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB5aWVsZCBfX2F3YWl0KHZvaWQgMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHlpZWxkIHlpZWxkIF9fYXdhaXQodmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZpbmFsbHkge1xuICAgICAgICAgICAgY29uc3QgY2FuY2VsUHJvbWlzZSA9IHJlYWRlci5jYW5jZWwoKTtcbiAgICAgICAgICAgIHJlYWRlci5yZWxlYXNlTG9jaygpO1xuICAgICAgICAgICAgeWllbGQgX19hd2FpdChjYW5jZWxQcm9taXNlKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHN0cmVhbVRvVGV4dChzdHJlYW0pIHtcbiAgICBjb25zdCByZWFkZXIgPSBzdHJlYW0uZ2V0UmVhZGVyKCk7XG4gICAgY29uc3QgYnVmZmVycyA9IFtdO1xuICAgIGxldCBsZW5ndGggPSAwO1xuICAgIHRyeSB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zdGFudC1jb25kaXRpb25cbiAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgIGNvbnN0IHsgdmFsdWUsIGRvbmUgfSA9IGF3YWl0IHJlYWRlci5yZWFkKCk7XG4gICAgICAgICAgICBpZiAoZG9uZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgVGV4dERlY29kZXIoKS5kZWNvZGUoY29uY2F0QnVmZmVycyhidWZmZXJzLCBsZW5ndGgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxlbmd0aCArPSB2YWx1ZS5sZW5ndGg7XG4gICAgICAgICAgICBidWZmZXJzLnB1c2godmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZpbmFsbHkge1xuICAgICAgICByZWFkZXIucmVsZWFzZUxvY2soKTtcbiAgICB9XG59XG5mdW5jdGlvbiBnZXRCdWZmZXJzTGVuZ3RoKGJ1ZmZlcnMpIHtcbiAgICByZXR1cm4gYnVmZmVycy5yZWR1Y2UoKGFjYywgY3VycikgPT4gYWNjICsgY3Vyci5sZW5ndGgsIDApO1xufVxuZnVuY3Rpb24gY29uY2F0QnVmZmVycyhidWZmZXJzLCBsZW4pIHtcbiAgICBjb25zdCBsZW5ndGggPSBsZW4gIT09IG51bGwgJiYgbGVuICE9PSB2b2lkIDAgPyBsZW4gOiBnZXRCdWZmZXJzTGVuZ3RoKGJ1ZmZlcnMpO1xuICAgIGNvbnN0IHJlcyA9IG5ldyBVaW50OEFycmF5KGxlbmd0aCk7XG4gICAgZm9yIChsZXQgaSA9IDAsIHBvcyA9IDA7IGkgPCBidWZmZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGJ1ZmZlciA9IGJ1ZmZlcnNbaV07XG4gICAgICAgIHJlcy5zZXQoYnVmZmVyLCBwb3MpO1xuICAgICAgICBwb3MgKz0gYnVmZmVyLmxlbmd0aDtcbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXJlYWRhYmxlU3RyZWFtVXRpbHMuanMubWFwIiwiLy8gQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG5leHBvcnQgZnVuY3Rpb24gd3JhcEVycm9yKGYsIG1lc3NhZ2UpIHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBmKCk7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIGNhdGNoIChjYXVzZSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7bWVzc2FnZX06ICR7Y2F1c2V9YCwgeyBjYXVzZSB9KTtcbiAgICB9XG59XG5leHBvcnQgZnVuY3Rpb24gY2FtZWxDYXNlS2V5cyhvYmopIHtcbiAgICBpZiAodHlwZW9mIG9iaiAhPT0gXCJvYmplY3RcIiB8fCAhb2JqKVxuICAgICAgICByZXR1cm4gb2JqO1xuICAgIGlmIChBcnJheS5pc0FycmF5KG9iaikpIHtcbiAgICAgICAgcmV0dXJuIG9iai5tYXAoKHYpID0+IGNhbWVsQ2FzZUtleXModikpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMob2JqKSkge1xuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBvYmpba2V5XTtcbiAgICAgICAgICAgIGNvbnN0IG5ld0tleSA9IHRvY2FtZWxDYXNlKGtleSk7XG4gICAgICAgICAgICBpZiAobmV3S2V5ICE9PSBrZXkpIHtcbiAgICAgICAgICAgICAgICBkZWxldGUgb2JqW2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvYmpbbmV3S2V5XSA9XG4gICAgICAgICAgICAgICAgdHlwZW9mIG9ialtuZXdLZXldID09PSBcIm9iamVjdFwiID8gY2FtZWxDYXNlS2V5cyh2YWx1ZSkgOiB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb2JqO1xuICAgIH1cbn1cbmV4cG9ydCBmdW5jdGlvbiBzbmFrZUNhc2VLZXlzKG9iaikge1xuICAgIGlmICh0eXBlb2Ygb2JqICE9PSBcIm9iamVjdFwiIHx8ICFvYmopXG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkob2JqKSkge1xuICAgICAgICByZXR1cm4gb2JqLm1hcCgodikgPT4gc25ha2VDYXNlS2V5cyh2KSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhvYmopKSB7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IG9ialtrZXldO1xuICAgICAgICAgICAgY29uc3QgbmV3S2V5ID0gdG9TbmFrZUNhc2Uoa2V5KTtcbiAgICAgICAgICAgIGlmIChuZXdLZXkgIT09IGtleSkge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBvYmpba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9ialtuZXdLZXldID1cbiAgICAgICAgICAgICAgICB0eXBlb2Ygb2JqW25ld0tleV0gPT09IFwib2JqZWN0XCIgPyBzbmFrZUNhc2VLZXlzKHZhbHVlKSA6IHZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgfVxufVxuZnVuY3Rpb24gdG9jYW1lbENhc2Uoc3RyKSB7XG4gICAgcmV0dXJuIHN0clxuICAgICAgICAudG9Mb3dlckNhc2UoKVxuICAgICAgICAucmVwbGFjZSgvKFtfXVthLXpdKS9nLCAoZ3JvdXApID0+IGdyb3VwLnRvVXBwZXJDYXNlKCkucmVwbGFjZShcIl9cIiwgXCJcIikpO1xufVxuZnVuY3Rpb24gdG9TbmFrZUNhc2Uoc3RyKSB7XG4gICAgcmV0dXJuIHN0clxuICAgICAgICAucmVwbGFjZSgvKFtBLVpdKS9nLCAoZ3JvdXApID0+IGBfJHtncm91cC50b0xvd2VyQ2FzZSgpfWApXG4gICAgICAgIC5yZXBsYWNlKC9eXy8sIFwiXCIpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dXRpbC5qcy5tYXAiLCIvLyBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi5cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbmltcG9ydCB7IGNyZWF0ZUNsaWVudExvZ2dlciB9IGZyb20gXCJAYXp1cmUvbG9nZ2VyXCI7XG5leHBvcnQgY29uc3QgbG9nZ2VyID0gY3JlYXRlQ2xpZW50TG9nZ2VyKFwib3BlbmFpXCIpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bG9nZ2VyLmpzLm1hcCIsIi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuaW1wb3J0IE9wZW5BSUNsaWVudCBmcm9tIFwiLi9vcGVuQUlDbGllbnQuanNcIjtcbmV4cG9ydCAqIGZyb20gXCIuL29wZW5BSUNsaWVudC5qc1wiO1xuZXhwb3J0ICogZnJvbSBcIi4vcGFyYW1ldGVycy5qc1wiO1xuZXhwb3J0ICogZnJvbSBcIi4vcmVzcG9uc2VzLmpzXCI7XG5leHBvcnQgKiBmcm9tIFwiLi9jbGllbnREZWZpbml0aW9ucy5qc1wiO1xuZXhwb3J0ICogZnJvbSBcIi4vaXNVbmV4cGVjdGVkLmpzXCI7XG5leHBvcnQgKiBmcm9tIFwiLi9tb2RlbHMuanNcIjtcbmV4cG9ydCAqIGZyb20gXCIuL291dHB1dE1vZGVscy5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgT3BlbkFJQ2xpZW50O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwiLy8gQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG5jb25zdCByZXNwb25zZU1hcCA9IHtcbiAgICBcIlBPU1QgL2RlcGxveW1lbnRzL3tkZXBsb3ltZW50SWR9L2F1ZGlvL3RyYW5zY3JpcHRpb25zXCI6IFtcIjIwMFwiXSxcbiAgICBcIlBPU1QgL2RlcGxveW1lbnRzL3tkZXBsb3ltZW50SWR9L2F1ZGlvL3RyYW5zbGF0aW9uc1wiOiBbXCIyMDBcIl0sXG4gICAgXCJQT1NUIC9kZXBsb3ltZW50cy97ZGVwbG95bWVudElkfS9jb21wbGV0aW9uc1wiOiBbXCIyMDBcIl0sXG4gICAgXCJQT1NUIC9kZXBsb3ltZW50cy97ZGVwbG95bWVudElkfS9jaGF0L2NvbXBsZXRpb25zXCI6IFtcIjIwMFwiXSxcbiAgICBcIlBPU1QgL2RlcGxveW1lbnRzL3tkZXBsb3ltZW50SWR9L2ltYWdlcy9nZW5lcmF0aW9uc1wiOiBbXCIyMDBcIl0sXG4gICAgXCJQT1NUIC9kZXBsb3ltZW50cy97ZGVwbG95bWVudElkfS9lbWJlZGRpbmdzXCI6IFtcIjIwMFwiXSxcbiAgICBcIkdFVCAvb3BlcmF0aW9ucy9pbWFnZXMve29wZXJhdGlvbklkfVwiOiBbXCIyMDBcIl0sXG4gICAgXCJQT1NUIC9pbWFnZXMvZ2VuZXJhdGlvbnM6c3VibWl0XCI6IFtcIjIwMlwiXSxcbiAgICBcIkdFVCAvaW1hZ2VzL2dlbmVyYXRpb25zOnN1Ym1pdFwiOiBbXCIyMDBcIiwgXCIyMDJcIl0sXG59O1xuZXhwb3J0IGZ1bmN0aW9uIGlzVW5leHBlY3RlZChyZXNwb25zZSkge1xuICAgIGNvbnN0IGxyb09yaWdpbmFsID0gcmVzcG9uc2UuaGVhZGVyc1tcIngtbXMtb3JpZ2luYWwtdXJsXCJdO1xuICAgIGNvbnN0IHVybCA9IG5ldyBVUkwobHJvT3JpZ2luYWwgIT09IG51bGwgJiYgbHJvT3JpZ2luYWwgIT09IHZvaWQgMCA/IGxyb09yaWdpbmFsIDogcmVzcG9uc2UucmVxdWVzdC51cmwpO1xuICAgIGNvbnN0IG1ldGhvZCA9IHJlc3BvbnNlLnJlcXVlc3QubWV0aG9kO1xuICAgIGxldCBwYXRoRGV0YWlscyA9IHJlc3BvbnNlTWFwW2Ake21ldGhvZH0gJHt1cmwucGF0aG5hbWV9YF07XG4gICAgaWYgKCFwYXRoRGV0YWlscykge1xuICAgICAgICBwYXRoRGV0YWlscyA9IGdldFBhcmFtZXRyaXplZFBhdGhTdWNjZXNzKG1ldGhvZCwgdXJsLnBhdGhuYW1lKTtcbiAgICB9XG4gICAgcmV0dXJuICFwYXRoRGV0YWlscy5pbmNsdWRlcyhyZXNwb25zZS5zdGF0dXMpO1xufVxuZnVuY3Rpb24gZ2V0UGFyYW1ldHJpemVkUGF0aFN1Y2Nlc3MobWV0aG9kLCBwYXRoKSB7XG4gICAgdmFyIF9hLCBfYiwgX2MsIF9kO1xuICAgIGNvbnN0IHBhdGhQYXJ0cyA9IHBhdGguc3BsaXQoXCIvXCIpO1xuICAgIC8vIFRyYXZlcnNlIGxpc3QgdG8gbWF0Y2ggdGhlIGxvbmdlc3QgY2FuZGlkYXRlXG4gICAgLy8gbWF0Y2hlZExlbjogdGhlIGxlbmd0aCBvZiBjYW5kaWRhdGUgcGF0aFxuICAgIC8vIG1hdGNoZWRWYWx1ZTogdGhlIG1hdGNoZWQgc3RhdHVzIGNvZGUgYXJyYXlcbiAgICBsZXQgbWF0Y2hlZExlbiA9IC0xLCBtYXRjaGVkVmFsdWUgPSBbXTtcbiAgICAvLyBJdGVyYXRlIHRoZSByZXNwb25zZU1hcCB0byBmaW5kIGEgbWF0Y2hcbiAgICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhyZXNwb25zZU1hcCkpIHtcbiAgICAgICAgLy8gRXh0cmFjdGluZyB0aGUgcGF0aCBmcm9tIHRoZSBtYXAga2V5IHdoaWNoIGlzIGluIGZvcm1hdFxuICAgICAgICAvLyBHRVQgL3BhdGgvZm9vXG4gICAgICAgIGlmICgha2V5LnN0YXJ0c1dpdGgobWV0aG9kKSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgY2FuZGlkYXRlUGF0aCA9IGdldFBhdGhGcm9tTWFwS2V5KGtleSk7XG4gICAgICAgIC8vIEdldCBlYWNoIHBhcnQgb2YgdGhlIHVybCBwYXRoXG4gICAgICAgIGNvbnN0IGNhbmRpZGF0ZVBhcnRzID0gY2FuZGlkYXRlUGF0aC5zcGxpdChcIi9cIik7XG4gICAgICAgIC8vIHRyYWNrIGlmIHdlIGhhdmUgZm91bmQgYSBtYXRjaCB0byByZXR1cm4gdGhlIHZhbHVlcyBmb3VuZC5cbiAgICAgICAgbGV0IGZvdW5kID0gdHJ1ZTtcbiAgICAgICAgZm9yIChsZXQgaSA9IGNhbmRpZGF0ZVBhcnRzLmxlbmd0aCAtIDEsIGogPSBwYXRoUGFydHMubGVuZ3RoIC0gMTsgaSA+PSAxICYmIGogPj0gMTsgaS0tLCBqLS0pIHtcbiAgICAgICAgICAgIGlmICgoKF9hID0gY2FuZGlkYXRlUGFydHNbaV0pID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5zdGFydHNXaXRoKFwie1wiKSkgJiYgKChfYiA9IGNhbmRpZGF0ZVBhcnRzW2ldKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IuaW5kZXhPZihcIn1cIikpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHN0YXJ0ID0gY2FuZGlkYXRlUGFydHNbaV0uaW5kZXhPZihcIn1cIikgKyAxLCBlbmQgPSAoX2MgPSBjYW5kaWRhdGVQYXJ0c1tpXSkgPT09IG51bGwgfHwgX2MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9jLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAvLyBJZiB0aGUgY3VycmVudCBwYXJ0IG9mIHRoZSBjYW5kaWRhdGUgaXMgYSBcInRlbXBsYXRlXCIgcGFydFxuICAgICAgICAgICAgICAgIC8vIFRyeSB0byB1c2UgdGhlIHN1ZmZpeCBvZiBwYXR0ZXJuIHRvIG1hdGNoIHRoZSBwYXRoXG4gICAgICAgICAgICAgICAgLy8ge2d1aWR9ID09PiAkXG4gICAgICAgICAgICAgICAgLy8ge2d1aWR9OmV4cG9ydCA9PT4gOmV4cG9ydCRcbiAgICAgICAgICAgICAgICBjb25zdCBpc01hdGNoZWQgPSBuZXcgUmVnRXhwKGAkeyhfZCA9IGNhbmRpZGF0ZVBhcnRzW2ldKSA9PT0gbnVsbCB8fCBfZCA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2Quc2xpY2Uoc3RhcnQsIGVuZCl9YCkudGVzdChwYXRoUGFydHNbal0gfHwgXCJcIik7XG4gICAgICAgICAgICAgICAgaWYgKCFpc01hdGNoZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgZm91bmQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gSWYgdGhlIGNhbmRpZGF0ZSBwYXJ0IGlzIG5vdCBhIHRlbXBsYXRlIGFuZFxuICAgICAgICAgICAgLy8gdGhlIHBhcnRzIGRvbid0IG1hdGNoIG1hcmsgdGhlIGNhbmRpZGF0ZSBhcyBub3QgZm91bmRcbiAgICAgICAgICAgIC8vIHRvIG1vdmUgb24gd2l0aCB0aGUgbmV4dCBjYW5kaWRhdGUgcGF0aC5cbiAgICAgICAgICAgIGlmIChjYW5kaWRhdGVQYXJ0c1tpXSAhPT0gcGF0aFBhcnRzW2pdKSB7XG4gICAgICAgICAgICAgICAgZm91bmQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBXZSBmaW5pc2hlZCBldmFsdWF0aW5nIHRoZSBjdXJyZW50IGNhbmRpZGF0ZSBwYXJ0c1xuICAgICAgICAvLyBVcGRhdGUgdGhlIG1hdGNoZWQgdmFsdWUgaWYgYW5kIG9ubHkgaWYgd2UgZm91bmQgdGhlIGxvbmdlciBwYXR0ZXJuXG4gICAgICAgIGlmIChmb3VuZCAmJiBjYW5kaWRhdGVQYXRoLmxlbmd0aCA+IG1hdGNoZWRMZW4pIHtcbiAgICAgICAgICAgIG1hdGNoZWRMZW4gPSBjYW5kaWRhdGVQYXRoLmxlbmd0aDtcbiAgICAgICAgICAgIG1hdGNoZWRWYWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBtYXRjaGVkVmFsdWU7XG59XG5mdW5jdGlvbiBnZXRQYXRoRnJvbU1hcEtleShtYXBLZXkpIHtcbiAgICBjb25zdCBwYXRoU3RhcnQgPSBtYXBLZXkuaW5kZXhPZihcIi9cIik7XG4gICAgcmV0dXJuIG1hcEtleS5zbGljZShwYXRoU3RhcnQpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aXNVbmV4cGVjdGVkLmpzLm1hcCIsIi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuaW1wb3J0IHsgZ2V0Q2xpZW50IH0gZnJvbSBcIkBhenVyZS1yZXN0L2NvcmUtY2xpZW50XCI7XG5pbXBvcnQgeyBsb2dnZXIgfSBmcm9tIFwiLi4vbG9nZ2VyLmpzXCI7XG4vKipcbiAqIEluaXRpYWxpemUgYSBuZXcgaW5zdGFuY2Ugb2YgYE9wZW5BSUNvbnRleHRgXG4gKiBAcGFyYW0gZW5kcG9pbnQgLSBTdXBwb3J0ZWQgQ29nbml0aXZlIFNlcnZpY2VzIGVuZHBvaW50cyAocHJvdG9jb2wgYW5kIGhvc3RuYW1lLCBmb3IgZXhhbXBsZTpcbiAqIGh0dHBzOi8vd2VzdHVzLmFwaS5jb2duaXRpdmUubWljcm9zb2Z0LmNvbSkuXG4gKiBAcGFyYW0gY3JlZGVudGlhbHMgLSB1bmlxdWVseSBpZGVudGlmeSBjbGllbnQgY3JlZGVudGlhbFxuICogQHBhcmFtIG9wdGlvbnMgLSB0aGUgcGFyYW1ldGVyIGZvciBhbGwgb3B0aW9uYWwgcGFyYW1ldGVyc1xuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcmVhdGVDbGllbnQoZW5kcG9pbnQsIGNyZWRlbnRpYWxzLCBvcHRpb25zID0ge30pIHtcbiAgICB2YXIgX2EsIF9iLCBfYywgX2QsIF9lLCBfZiwgX2csIF9oO1xuICAgIGNvbnN0IGJhc2VVcmwgPSAoX2EgPSBvcHRpb25zLmJhc2VVcmwpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IGAke2VuZHBvaW50fS9vcGVuYWlgO1xuICAgIG9wdGlvbnMuYXBpVmVyc2lvbiA9IChfYiA9IG9wdGlvbnMuYXBpVmVyc2lvbikgIT09IG51bGwgJiYgX2IgIT09IHZvaWQgMCA/IF9iIDogXCIyMDI0LTAzLTAxLXByZXZpZXdcIjtcbiAgICBjb25zdCB1c2VyQWdlbnRJbmZvID0gYGF6c2RrLWpzLW9wZW5haS1yZXN0LzEuMC4wLWJldGEuMTJgO1xuICAgIGNvbnN0IHVzZXJBZ2VudFByZWZpeCA9IG9wdGlvbnMudXNlckFnZW50T3B0aW9ucyAmJiBvcHRpb25zLnVzZXJBZ2VudE9wdGlvbnMudXNlckFnZW50UHJlZml4XG4gICAgICAgID8gYCR7b3B0aW9ucy51c2VyQWdlbnRPcHRpb25zLnVzZXJBZ2VudFByZWZpeH0gJHt1c2VyQWdlbnRJbmZvfWBcbiAgICAgICAgOiBgJHt1c2VyQWdlbnRJbmZvfWA7XG4gICAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucyksIHsgdXNlckFnZW50T3B0aW9uczoge1xuICAgICAgICAgICAgdXNlckFnZW50UHJlZml4LFxuICAgICAgICB9LCBsb2dnaW5nT3B0aW9uczoge1xuICAgICAgICAgICAgbG9nZ2VyOiAoX2QgPSAoX2MgPSBvcHRpb25zLmxvZ2dpbmdPcHRpb25zKSA9PT0gbnVsbCB8fCBfYyA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2MubG9nZ2VyKSAhPT0gbnVsbCAmJiBfZCAhPT0gdm9pZCAwID8gX2QgOiBsb2dnZXIuaW5mbyxcbiAgICAgICAgfSwgY3JlZGVudGlhbHM6IHtcbiAgICAgICAgICAgIHNjb3BlczogKF9mID0gKF9lID0gb3B0aW9ucy5jcmVkZW50aWFscykgPT09IG51bGwgfHwgX2UgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9lLnNjb3BlcykgIT09IG51bGwgJiYgX2YgIT09IHZvaWQgMCA/IF9mIDogW1wiaHR0cHM6Ly9jb2duaXRpdmVzZXJ2aWNlcy5henVyZS5jb20vLmRlZmF1bHRcIl0sXG4gICAgICAgICAgICBhcGlLZXlIZWFkZXJOYW1lOiAoX2ggPSAoX2cgPSBvcHRpb25zLmNyZWRlbnRpYWxzKSA9PT0gbnVsbCB8fCBfZyA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2cuYXBpS2V5SGVhZGVyTmFtZSkgIT09IG51bGwgJiYgX2ggIT09IHZvaWQgMCA/IF9oIDogXCJhcGkta2V5XCIsXG4gICAgICAgIH0gfSk7XG4gICAgY29uc3QgY2xpZW50ID0gZ2V0Q2xpZW50KGJhc2VVcmwsIGNyZWRlbnRpYWxzLCBvcHRpb25zKTtcbiAgICByZXR1cm4gY2xpZW50O1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9b3BlbkFJQ2xpZW50LmpzLm1hcCIsIi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuaW1wb3J0IHsgX19yZXN0IH0gZnJvbSBcInRzbGliXCI7XG5pbXBvcnQgeyBzbmFrZUNhc2VLZXlzIH0gZnJvbSBcIi4uL2FwaS91dGlsLmpzXCI7XG4vKiogc2VyaWFsaXplIGZ1bmN0aW9uIGZvciBDaGF0UmVxdWVzdFVzZXJNZXNzYWdlICovXG5mdW5jdGlvbiBzZXJpYWxpemVDaGF0UmVxdWVzdFVzZXJNZXNzYWdlKG9iaikge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJvbGU6IG9ialtcInJvbGVcIl0sXG4gICAgICAgIGNvbnRlbnQ6IHR5cGVvZiBvYmpbXCJjb250ZW50XCJdID09PSBcInN0cmluZ1wiXG4gICAgICAgICAgICA/IG9ialtcImNvbnRlbnRcIl1cbiAgICAgICAgICAgIDogb2JqW1wiY29udGVudFwiXS5tYXAoc2VyaWFsaXplQ2hhdFJlcXVlc3RDb250ZW50SXRlbVVuaW9uKSxcbiAgICAgICAgbmFtZTogb2JqW1wibmFtZVwiXSxcbiAgICB9O1xufVxuLyoqIHNlcmlhbGl6ZSBmdW5jdGlvbiBmb3IgQ2hhdE1lc3NhZ2VJbWFnZUNvbnRlbnRJdGVtICovXG5mdW5jdGlvbiBzZXJpYWxpemVDaGF0UmVxdWVzdENvbnRlbnRJdGVtVW5pb24ob2JqKSB7XG4gICAgc3dpdGNoIChvYmoudHlwZSkge1xuICAgICAgICBjYXNlIFwiaW1hZ2VfdXJsXCI6XG4gICAgICAgICAgICByZXR1cm4gc2VyaWFsaXplQ2hhdE1lc3NhZ2VJbWFnZUNvbnRlbnRJdGVtKG9iaik7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gb2JqO1xuICAgIH1cbn1cbi8qKiBzZXJpYWxpemUgZnVuY3Rpb24gZm9yIENoYXRSZXF1ZXN0QXNzaXN0YW50TWVzc2FnZSAqL1xuZnVuY3Rpb24gc2VyaWFsaXplQ2hhdFJlcXVlc3RBc3Npc3RhbnRNZXNzYWdlKG9iaikge1xuICAgIGlmIChvYmouY29udGVudCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIG9iai5jb250ZW50ID0gbnVsbDtcbiAgICB9XG4gICAgY29uc3QgeyBmdW5jdGlvbkNhbGwsIHRvb2xDYWxscyB9ID0gb2JqLCByZXN0ID0gX19yZXN0KG9iaiwgW1wiZnVuY3Rpb25DYWxsXCIsIFwidG9vbENhbGxzXCJdKTtcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIHNuYWtlQ2FzZUtleXMocmVzdCkpLCAoIXRvb2xDYWxscyB8fCB0b29sQ2FsbHMubGVuZ3RoID09PSAwID8ge30gOiB7IHRvb2xfY2FsbHM6IHRvb2xDYWxscyB9KSksIChmdW5jdGlvbkNhbGwgPyB7IGZ1bmN0aW9uX2NhbGw6IGZ1bmN0aW9uQ2FsbCB9IDoge30pKTtcbn1cbi8qKiBzZXJpYWxpemUgZnVuY3Rpb24gZm9yIENoYXRSZXF1ZXN0VG9vbE1lc3NhZ2UgKi9cbmZ1bmN0aW9uIHNlcmlhbGl6ZUNoYXRSZXF1ZXN0VG9vbE1lc3NhZ2Uob2JqKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcm9sZTogb2JqW1wicm9sZVwiXSxcbiAgICAgICAgY29udGVudDogb2JqW1wiY29udGVudFwiXSxcbiAgICAgICAgdG9vbF9jYWxsX2lkOiBvYmpbXCJ0b29sQ2FsbElkXCJdLFxuICAgIH07XG59XG4vKiogc2VyaWFsaXplIGZ1bmN0aW9uIGZvciBDaGF0UmVxdWVzdE1lc3NhZ2VVbmlvbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNlcmlhbGl6ZUNoYXRSZXF1ZXN0TWVzc2FnZVVuaW9uKG9iaikge1xuICAgIHN3aXRjaCAob2JqLnJvbGUpIHtcbiAgICAgICAgY2FzZSBcInVzZXJcIjpcbiAgICAgICAgICAgIHJldHVybiBzZXJpYWxpemVDaGF0UmVxdWVzdFVzZXJNZXNzYWdlKG9iaik7XG4gICAgICAgIGNhc2UgXCJhc3Npc3RhbnRcIjpcbiAgICAgICAgICAgIHJldHVybiBzZXJpYWxpemVDaGF0UmVxdWVzdEFzc2lzdGFudE1lc3NhZ2Uob2JqKTtcbiAgICAgICAgY2FzZSBcInRvb2xcIjpcbiAgICAgICAgICAgIHJldHVybiBzZXJpYWxpemVDaGF0UmVxdWVzdFRvb2xNZXNzYWdlKG9iaik7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gb2JqO1xuICAgIH1cbn1cbi8qKiBzZXJpYWxpemUgZnVuY3Rpb24gZm9yIENoYXRNZXNzYWdlSW1hZ2VDb250ZW50SXRlbSAqL1xuZnVuY3Rpb24gc2VyaWFsaXplQ2hhdE1lc3NhZ2VJbWFnZUNvbnRlbnRJdGVtKG9iaikge1xuICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6IG9ialtcInR5cGVcIl0sXG4gICAgICAgIGltYWdlX3VybDogeyB1cmw6IG9iai5pbWFnZVVybFtcInVybFwiXSwgZGV0YWlsOiBvYmouaW1hZ2VVcmxbXCJkZXRhaWxcIl0gfSxcbiAgICB9O1xufVxuLyoqIHNlcmlhbGl6ZSBmdW5jdGlvbiBmb3IgQ2hhdE1lc3NhZ2VDb250ZW50SXRlbVVuaW9uICovXG5leHBvcnQgZnVuY3Rpb24gc2VyaWFsaXplQ2hhdE1lc3NhZ2VDb250ZW50SXRlbVVuaW9uKG9iaikge1xuICAgIHN3aXRjaCAob2JqLnR5cGUpIHtcbiAgICAgICAgY2FzZSBcImltYWdlX3VybFwiOlxuICAgICAgICAgICAgcmV0dXJuIHNlcmlhbGl6ZUNoYXRNZXNzYWdlSW1hZ2VDb250ZW50SXRlbShvYmopO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIG9iajtcbiAgICB9XG59XG4vKiogc2VyaWFsaXplIGZ1bmN0aW9uIGZvciBBenVyZVNlYXJjaENoYXRFeHRlbnNpb25Db25maWd1cmF0aW9uICovXG5mdW5jdGlvbiBzZXJpYWxpemVBenVyZVNlYXJjaENoYXRFeHRlbnNpb25Db25maWd1cmF0aW9uKG9iaikge1xuICAgIHZhciBfYSwgX2IsIF9jLCBfZCwgX2UsIF9mLCBfZztcbiAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiBvYmpbXCJ0eXBlXCJdLFxuICAgICAgICBwYXJhbWV0ZXJzOiB7XG4gICAgICAgICAgICBhdXRoZW50aWNhdGlvbjogIW9iai5hdXRoZW50aWNhdGlvblxuICAgICAgICAgICAgICAgID8gb2JqLmF1dGhlbnRpY2F0aW9uXG4gICAgICAgICAgICAgICAgOiBzZXJpYWxpemVPbllvdXJEYXRhQXV0aGVudGljYXRpb25PcHRpb25zVW5pb24ob2JqLmF1dGhlbnRpY2F0aW9uKSxcbiAgICAgICAgICAgIHRvcF9uX2RvY3VtZW50czogb2JqW1widG9wTkRvY3VtZW50c1wiXSxcbiAgICAgICAgICAgIGluX3Njb3BlOiBvYmpbXCJpblNjb3BlXCJdLFxuICAgICAgICAgICAgc3RyaWN0bmVzczogb2JqW1wic3RyaWN0bmVzc1wiXSxcbiAgICAgICAgICAgIHJvbGVfaW5mb3JtYXRpb246IG9ialtcInJvbGVJbmZvcm1hdGlvblwiXSxcbiAgICAgICAgICAgIGVuZHBvaW50OiBvYmpbXCJlbmRwb2ludFwiXSxcbiAgICAgICAgICAgIGluZGV4X25hbWU6IG9ialtcImluZGV4TmFtZVwiXSxcbiAgICAgICAgICAgIGZpZWxkc19tYXBwaW5nOiAhb2JqLmZpZWxkc01hcHBpbmdcbiAgICAgICAgICAgICAgICA/IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgIDoge1xuICAgICAgICAgICAgICAgICAgICB0aXRsZV9maWVsZDogKF9hID0gb2JqLmZpZWxkc01hcHBpbmcpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYVtcInRpdGxlRmllbGRcIl0sXG4gICAgICAgICAgICAgICAgICAgIHVybF9maWVsZDogKF9iID0gb2JqLmZpZWxkc01hcHBpbmcpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYltcInVybEZpZWxkXCJdLFxuICAgICAgICAgICAgICAgICAgICBmaWxlcGF0aF9maWVsZDogKF9jID0gb2JqLmZpZWxkc01hcHBpbmcpID09PSBudWxsIHx8IF9jID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfY1tcImZpbGVwYXRoRmllbGRcIl0sXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnRfZmllbGRzOiAoX2QgPSBvYmouZmllbGRzTWFwcGluZykgPT09IG51bGwgfHwgX2QgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9kW1wiY29udGVudEZpZWxkc1wiXSxcbiAgICAgICAgICAgICAgICAgICAgY29udGVudF9maWVsZHNfc2VwYXJhdG9yOiAoX2UgPSBvYmouZmllbGRzTWFwcGluZykgPT09IG51bGwgfHwgX2UgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9lW1wiY29udGVudEZpZWxkc1NlcGFyYXRvclwiXSxcbiAgICAgICAgICAgICAgICAgICAgdmVjdG9yX2ZpZWxkczogKF9mID0gb2JqLmZpZWxkc01hcHBpbmcpID09PSBudWxsIHx8IF9mID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZltcInZlY3RvckZpZWxkc1wiXSxcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2VfdmVjdG9yX2ZpZWxkczogKF9nID0gb2JqLmZpZWxkc01hcHBpbmcpID09PSBudWxsIHx8IF9nID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZ1tcImltYWdlVmVjdG9yRmllbGRzXCJdLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBxdWVyeV90eXBlOiBvYmpbXCJxdWVyeVR5cGVcIl0sXG4gICAgICAgICAgICBzZW1hbnRpY19jb25maWd1cmF0aW9uOiBvYmpbXCJzZW1hbnRpY0NvbmZpZ3VyYXRpb25cIl0sXG4gICAgICAgICAgICBmaWx0ZXI6IG9ialtcImZpbHRlclwiXSxcbiAgICAgICAgICAgIGVtYmVkZGluZ19kZXBlbmRlbmN5OiAhb2JqLmVtYmVkZGluZ0RlcGVuZGVuY3lcbiAgICAgICAgICAgICAgICA/IG9iai5lbWJlZGRpbmdEZXBlbmRlbmN5XG4gICAgICAgICAgICAgICAgOiBzZXJpYWxpemVPbllvdXJEYXRhVmVjdG9yaXphdGlvblNvdXJjZVVuaW9uKG9iai5lbWJlZGRpbmdEZXBlbmRlbmN5KSxcbiAgICAgICAgfSxcbiAgICB9O1xufVxuLyoqIHNlcmlhbGl6ZSBmdW5jdGlvbiBmb3IgQXp1cmVNYWNoaW5lTGVhcm5pbmdJbmRleENoYXRFeHRlbnNpb25Db25maWd1cmF0aW9uICovXG5mdW5jdGlvbiBzZXJpYWxpemVBenVyZU1hY2hpbmVMZWFybmluZ0luZGV4Q2hhdEV4dGVuc2lvbkNvbmZpZ3VyYXRpb24ob2JqKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogb2JqW1widHlwZVwiXSxcbiAgICAgICAgcGFyYW1ldGVyczoge1xuICAgICAgICAgICAgYXV0aGVudGljYXRpb246ICFvYmouYXV0aGVudGljYXRpb25cbiAgICAgICAgICAgICAgICA/IG9iai5hdXRoZW50aWNhdGlvblxuICAgICAgICAgICAgICAgIDogc2VyaWFsaXplT25Zb3VyRGF0YUF1dGhlbnRpY2F0aW9uT3B0aW9uc1VuaW9uKG9iai5hdXRoZW50aWNhdGlvbiksXG4gICAgICAgICAgICB0b3Bfbl9kb2N1bWVudHM6IG9ialtcInRvcE5Eb2N1bWVudHNcIl0sXG4gICAgICAgICAgICBpbl9zY29wZTogb2JqW1wiaW5TY29wZVwiXSxcbiAgICAgICAgICAgIHN0cmljdG5lc3M6IG9ialtcInN0cmljdG5lc3NcIl0sXG4gICAgICAgICAgICByb2xlX2luZm9ybWF0aW9uOiBvYmpbXCJyb2xlSW5mb3JtYXRpb25cIl0sXG4gICAgICAgICAgICBwcm9qZWN0X3Jlc291cmNlX2lkOiBvYmpbXCJwcm9qZWN0UmVzb3VyY2VJZFwiXSxcbiAgICAgICAgICAgIG5hbWU6IG9ialtcIm5hbWVcIl0sXG4gICAgICAgICAgICB2ZXJzaW9uOiBvYmpbXCJ2ZXJzaW9uXCJdLFxuICAgICAgICAgICAgZmlsdGVyOiBvYmpbXCJmaWx0ZXJcIl0sXG4gICAgICAgIH0sXG4gICAgfTtcbn1cbi8qKiBzZXJpYWxpemUgZnVuY3Rpb24gZm9yIEF6dXJlQ29zbW9zREJDaGF0RXh0ZW5zaW9uQ29uZmlndXJhdGlvbiAqL1xuZnVuY3Rpb24gc2VyaWFsaXplQXp1cmVDb3Ntb3NEQkNoYXRFeHRlbnNpb25Db25maWd1cmF0aW9uKG9iaikge1xuICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6IG9ialtcInR5cGVcIl0sXG4gICAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgICAgIGF1dGhlbnRpY2F0aW9uOiAhb2JqLmF1dGhlbnRpY2F0aW9uXG4gICAgICAgICAgICAgICAgPyBvYmouYXV0aGVudGljYXRpb25cbiAgICAgICAgICAgICAgICA6IHNlcmlhbGl6ZU9uWW91ckRhdGFBdXRoZW50aWNhdGlvbk9wdGlvbnNVbmlvbihvYmouYXV0aGVudGljYXRpb24pLFxuICAgICAgICAgICAgdG9wX25fZG9jdW1lbnRzOiBvYmpbXCJ0b3BORG9jdW1lbnRzXCJdLFxuICAgICAgICAgICAgaW5fc2NvcGU6IG9ialtcImluU2NvcGVcIl0sXG4gICAgICAgICAgICBzdHJpY3RuZXNzOiBvYmpbXCJzdHJpY3RuZXNzXCJdLFxuICAgICAgICAgICAgcm9sZV9pbmZvcm1hdGlvbjogb2JqW1wicm9sZUluZm9ybWF0aW9uXCJdLFxuICAgICAgICAgICAgZGF0YWJhc2VfbmFtZTogb2JqW1wiZGF0YWJhc2VOYW1lXCJdLFxuICAgICAgICAgICAgY29udGFpbmVyX25hbWU6IG9ialtcImNvbnRhaW5lck5hbWVcIl0sXG4gICAgICAgICAgICBpbmRleF9uYW1lOiBvYmpbXCJpbmRleE5hbWVcIl0sXG4gICAgICAgICAgICBmaWVsZHNfbWFwcGluZzoge1xuICAgICAgICAgICAgICAgIHRpdGxlX2ZpZWxkOiBvYmouZmllbGRzTWFwcGluZ1tcInRpdGxlRmllbGRcIl0sXG4gICAgICAgICAgICAgICAgdXJsX2ZpZWxkOiBvYmouZmllbGRzTWFwcGluZ1tcInVybEZpZWxkXCJdLFxuICAgICAgICAgICAgICAgIGZpbGVwYXRoX2ZpZWxkOiBvYmouZmllbGRzTWFwcGluZ1tcImZpbGVwYXRoRmllbGRcIl0sXG4gICAgICAgICAgICAgICAgY29udGVudF9maWVsZHM6IG9iai5maWVsZHNNYXBwaW5nW1wiY29udGVudEZpZWxkc1wiXSxcbiAgICAgICAgICAgICAgICBjb250ZW50X2ZpZWxkc19zZXBhcmF0b3I6IG9iai5maWVsZHNNYXBwaW5nW1wiY29udGVudEZpZWxkc1NlcGFyYXRvclwiXSxcbiAgICAgICAgICAgICAgICB2ZWN0b3JfZmllbGRzOiBvYmouZmllbGRzTWFwcGluZ1tcInZlY3RvckZpZWxkc1wiXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlbWJlZGRpbmdfZGVwZW5kZW5jeTogc2VyaWFsaXplT25Zb3VyRGF0YVZlY3Rvcml6YXRpb25Tb3VyY2VVbmlvbihvYmouZW1iZWRkaW5nRGVwZW5kZW5jeSksXG4gICAgICAgIH0sXG4gICAgfTtcbn1cbi8qKiBzZXJpYWxpemUgZnVuY3Rpb24gZm9yIEVsYXN0aWNzZWFyY2hDaGF0RXh0ZW5zaW9uQ29uZmlndXJhdGlvbiAqL1xuZnVuY3Rpb24gc2VyaWFsaXplRWxhc3RpY3NlYXJjaENoYXRFeHRlbnNpb25Db25maWd1cmF0aW9uKG9iaikge1xuICAgIHZhciBfYSwgX2IsIF9jLCBfZCwgX2UsIF9mO1xuICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6IG9ialtcInR5cGVcIl0sXG4gICAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgICAgIGF1dGhlbnRpY2F0aW9uOiAhb2JqLmF1dGhlbnRpY2F0aW9uXG4gICAgICAgICAgICAgICAgPyBvYmouYXV0aGVudGljYXRpb25cbiAgICAgICAgICAgICAgICA6IHNlcmlhbGl6ZU9uWW91ckRhdGFBdXRoZW50aWNhdGlvbk9wdGlvbnNVbmlvbihvYmouYXV0aGVudGljYXRpb24pLFxuICAgICAgICAgICAgdG9wX25fZG9jdW1lbnRzOiBvYmpbXCJ0b3BORG9jdW1lbnRzXCJdLFxuICAgICAgICAgICAgaW5fc2NvcGU6IG9ialtcImluU2NvcGVcIl0sXG4gICAgICAgICAgICBzdHJpY3RuZXNzOiBvYmpbXCJzdHJpY3RuZXNzXCJdLFxuICAgICAgICAgICAgcm9sZV9pbmZvcm1hdGlvbjogb2JqW1wicm9sZUluZm9ybWF0aW9uXCJdLFxuICAgICAgICAgICAgZW5kcG9pbnQ6IG9ialtcImVuZHBvaW50XCJdLFxuICAgICAgICAgICAgaW5kZXhfbmFtZTogb2JqW1wiaW5kZXhOYW1lXCJdLFxuICAgICAgICAgICAgZmllbGRzX21hcHBpbmc6ICFvYmouZmllbGRzTWFwcGluZ1xuICAgICAgICAgICAgICAgID8gdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgOiB7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlX2ZpZWxkOiAoX2EgPSBvYmouZmllbGRzTWFwcGluZykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hW1widGl0bGVGaWVsZFwiXSxcbiAgICAgICAgICAgICAgICAgICAgdXJsX2ZpZWxkOiAoX2IgPSBvYmouZmllbGRzTWFwcGluZykgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iW1widXJsRmllbGRcIl0sXG4gICAgICAgICAgICAgICAgICAgIGZpbGVwYXRoX2ZpZWxkOiAoX2MgPSBvYmouZmllbGRzTWFwcGluZykgPT09IG51bGwgfHwgX2MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9jW1wiZmlsZXBhdGhGaWVsZFwiXSxcbiAgICAgICAgICAgICAgICAgICAgY29udGVudF9maWVsZHM6IChfZCA9IG9iai5maWVsZHNNYXBwaW5nKSA9PT0gbnVsbCB8fCBfZCA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2RbXCJjb250ZW50RmllbGRzXCJdLFxuICAgICAgICAgICAgICAgICAgICBjb250ZW50X2ZpZWxkc19zZXBhcmF0b3I6IChfZSA9IG9iai5maWVsZHNNYXBwaW5nKSA9PT0gbnVsbCB8fCBfZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2VbXCJjb250ZW50RmllbGRzU2VwYXJhdG9yXCJdLFxuICAgICAgICAgICAgICAgICAgICB2ZWN0b3JfZmllbGRzOiAoX2YgPSBvYmouZmllbGRzTWFwcGluZykgPT09IG51bGwgfHwgX2YgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9mW1widmVjdG9yRmllbGRzXCJdLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBxdWVyeV90eXBlOiBvYmpbXCJxdWVyeVR5cGVcIl0sXG4gICAgICAgICAgICBlbWJlZGRpbmdfZGVwZW5kZW5jeTogIW9iai5lbWJlZGRpbmdEZXBlbmRlbmN5XG4gICAgICAgICAgICAgICAgPyBvYmouZW1iZWRkaW5nRGVwZW5kZW5jeVxuICAgICAgICAgICAgICAgIDogc2VyaWFsaXplT25Zb3VyRGF0YVZlY3Rvcml6YXRpb25Tb3VyY2VVbmlvbihvYmouZW1iZWRkaW5nRGVwZW5kZW5jeSksXG4gICAgICAgIH0sXG4gICAgfTtcbn1cbi8qKiBzZXJpYWxpemUgZnVuY3Rpb24gZm9yIFBpbmVjb25lQ2hhdEV4dGVuc2lvbkNvbmZpZ3VyYXRpb24gKi9cbmZ1bmN0aW9uIHNlcmlhbGl6ZVBpbmVjb25lQ2hhdEV4dGVuc2lvbkNvbmZpZ3VyYXRpb24ob2JqKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogb2JqW1widHlwZVwiXSxcbiAgICAgICAgcGFyYW1ldGVyczoge1xuICAgICAgICAgICAgYXV0aGVudGljYXRpb246ICFvYmouYXV0aGVudGljYXRpb25cbiAgICAgICAgICAgICAgICA/IG9iai5hdXRoZW50aWNhdGlvblxuICAgICAgICAgICAgICAgIDogc2VyaWFsaXplT25Zb3VyRGF0YUF1dGhlbnRpY2F0aW9uT3B0aW9uc1VuaW9uKG9iai5hdXRoZW50aWNhdGlvbiksXG4gICAgICAgICAgICB0b3Bfbl9kb2N1bWVudHM6IG9ialtcInRvcE5Eb2N1bWVudHNcIl0sXG4gICAgICAgICAgICBpbl9zY29wZTogb2JqW1wiaW5TY29wZVwiXSxcbiAgICAgICAgICAgIHN0cmljdG5lc3M6IG9ialtcInN0cmljdG5lc3NcIl0sXG4gICAgICAgICAgICByb2xlX2luZm9ybWF0aW9uOiBvYmpbXCJyb2xlSW5mb3JtYXRpb25cIl0sXG4gICAgICAgICAgICBlbnZpcm9ubWVudDogb2JqW1wiZW52aXJvbm1lbnRcIl0sXG4gICAgICAgICAgICBpbmRleF9uYW1lOiBvYmpbXCJpbmRleE5hbWVcIl0sXG4gICAgICAgICAgICBmaWVsZHNfbWFwcGluZzoge1xuICAgICAgICAgICAgICAgIHRpdGxlX2ZpZWxkOiBvYmouZmllbGRzTWFwcGluZ1tcInRpdGxlRmllbGRcIl0sXG4gICAgICAgICAgICAgICAgdXJsX2ZpZWxkOiBvYmouZmllbGRzTWFwcGluZ1tcInVybEZpZWxkXCJdLFxuICAgICAgICAgICAgICAgIGZpbGVwYXRoX2ZpZWxkOiBvYmouZmllbGRzTWFwcGluZ1tcImZpbGVwYXRoRmllbGRcIl0sXG4gICAgICAgICAgICAgICAgY29udGVudF9maWVsZHM6IG9iai5maWVsZHNNYXBwaW5nW1wiY29udGVudEZpZWxkc1wiXSxcbiAgICAgICAgICAgICAgICBjb250ZW50X2ZpZWxkc19zZXBhcmF0b3I6IG9iai5maWVsZHNNYXBwaW5nW1wiY29udGVudEZpZWxkc1NlcGFyYXRvclwiXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlbWJlZGRpbmdfZGVwZW5kZW5jeTogc2VyaWFsaXplT25Zb3VyRGF0YVZlY3Rvcml6YXRpb25Tb3VyY2VVbmlvbihvYmouZW1iZWRkaW5nRGVwZW5kZW5jeSksXG4gICAgICAgIH0sXG4gICAgfTtcbn1cbi8qKiBzZXJpYWxpemUgZnVuY3Rpb24gZm9yIEF6dXJlQ2hhdEV4dGVuc2lvbkNvbmZpZ3VyYXRpb25VbmlvbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNlcmlhbGl6ZUF6dXJlQ2hhdEV4dGVuc2lvbkNvbmZpZ3VyYXRpb25VbmlvbihvYmopIHtcbiAgICBzd2l0Y2ggKG9iai50eXBlKSB7XG4gICAgICAgIGNhc2UgXCJhenVyZV9zZWFyY2hcIjpcbiAgICAgICAgICAgIHJldHVybiBzZXJpYWxpemVBenVyZVNlYXJjaENoYXRFeHRlbnNpb25Db25maWd1cmF0aW9uKG9iaik7XG4gICAgICAgIGNhc2UgXCJhenVyZV9tbF9pbmRleFwiOlxuICAgICAgICAgICAgcmV0dXJuIHNlcmlhbGl6ZUF6dXJlTWFjaGluZUxlYXJuaW5nSW5kZXhDaGF0RXh0ZW5zaW9uQ29uZmlndXJhdGlvbihvYmopO1xuICAgICAgICBjYXNlIFwiYXp1cmVfY29zbW9zX2RiXCI6XG4gICAgICAgICAgICByZXR1cm4gc2VyaWFsaXplQXp1cmVDb3Ntb3NEQkNoYXRFeHRlbnNpb25Db25maWd1cmF0aW9uKG9iaik7XG4gICAgICAgIGNhc2UgXCJlbGFzdGljc2VhcmNoXCI6XG4gICAgICAgICAgICByZXR1cm4gc2VyaWFsaXplRWxhc3RpY3NlYXJjaENoYXRFeHRlbnNpb25Db25maWd1cmF0aW9uKG9iaik7XG4gICAgICAgIGNhc2UgXCJwaW5lY29uZVwiOlxuICAgICAgICAgICAgcmV0dXJuIHNlcmlhbGl6ZVBpbmVjb25lQ2hhdEV4dGVuc2lvbkNvbmZpZ3VyYXRpb24ob2JqKTtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiBvYmo7XG4gICAgfVxufVxuLyoqIHNlcmlhbGl6ZSBmdW5jdGlvbiBmb3IgT25Zb3VyRGF0YUNvbm5lY3Rpb25TdHJpbmdBdXRoZW50aWNhdGlvbk9wdGlvbnMgKi9cbmZ1bmN0aW9uIHNlcmlhbGl6ZU9uWW91ckRhdGFDb25uZWN0aW9uU3RyaW5nQXV0aGVudGljYXRpb25PcHRpb25zKG9iaikge1xuICAgIHJldHVybiB7IHR5cGU6IG9ialtcInR5cGVcIl0sIGNvbm5lY3Rpb25fc3RyaW5nOiBvYmpbXCJjb25uZWN0aW9uU3RyaW5nXCJdIH07XG59XG4vKiogc2VyaWFsaXplIGZ1bmN0aW9uIGZvciBPbllvdXJEYXRhS2V5QW5kS2V5SWRBdXRoZW50aWNhdGlvbk9wdGlvbnMgKi9cbmZ1bmN0aW9uIHNlcmlhbGl6ZU9uWW91ckRhdGFLZXlBbmRLZXlJZEF1dGhlbnRpY2F0aW9uT3B0aW9ucyhvYmopIHtcbiAgICByZXR1cm4geyB0eXBlOiBvYmpbXCJ0eXBlXCJdLCBrZXk6IG9ialtcImtleVwiXSwga2V5X2lkOiBvYmpbXCJrZXlJZFwiXSB9O1xufVxuLyoqIHNlcmlhbGl6ZSBmdW5jdGlvbiBmb3IgT25Zb3VyRGF0YUVuY29kZWRBcGlLZXlBdXRoZW50aWNhdGlvbk9wdGlvbnMgKi9cbmZ1bmN0aW9uIHNlcmlhbGl6ZU9uWW91ckRhdGFFbmNvZGVkQXBpS2V5QXV0aGVudGljYXRpb25PcHRpb25zKG9iaikge1xuICAgIHJldHVybiB7IHR5cGU6IG9ialtcInR5cGVcIl0sIGVuY29kZWRfYXBpX2tleTogb2JqW1wiZW5jb2RlZEFwaUtleVwiXSB9O1xufVxuLyoqIHNlcmlhbGl6ZSBmdW5jdGlvbiBmb3IgT25Zb3VyRGF0YUFjY2Vzc1Rva2VuQXV0aGVudGljYXRpb25PcHRpb25zICovXG5mdW5jdGlvbiBzZXJpYWxpemVPbllvdXJEYXRhQWNjZXNzVG9rZW5BdXRoZW50aWNhdGlvbk9wdGlvbnMob2JqKSB7XG4gICAgcmV0dXJuIHsgdHlwZTogb2JqW1widHlwZVwiXSwgYWNjZXNzX3Rva2VuOiBvYmpbXCJhY2Nlc3NUb2tlblwiXSB9O1xufVxuLyoqIHNlcmlhbGl6ZSBmdW5jdGlvbiBmb3IgT25Zb3VyRGF0YVVzZXJBc3NpZ25lZE1hbmFnZWRJZGVudGl0eUF1dGhlbnRpY2F0aW9uT3B0aW9ucyAqL1xuZnVuY3Rpb24gc2VyaWFsaXplT25Zb3VyRGF0YVVzZXJBc3NpZ25lZE1hbmFnZWRJZGVudGl0eUF1dGhlbnRpY2F0aW9uT3B0aW9ucyhvYmopIHtcbiAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiBvYmpbXCJ0eXBlXCJdLFxuICAgICAgICBtYW5hZ2VkX2lkZW50aXR5X3Jlc291cmNlX2lkOiBvYmpbXCJtYW5hZ2VkSWRlbnRpdHlSZXNvdXJjZUlkXCJdLFxuICAgIH07XG59XG4vKiogc2VyaWFsaXplIGZ1bmN0aW9uIGZvciBPbllvdXJEYXRhQXV0aGVudGljYXRpb25PcHRpb25zVW5pb24gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXJpYWxpemVPbllvdXJEYXRhQXV0aGVudGljYXRpb25PcHRpb25zVW5pb24ob2JqKSB7XG4gICAgc3dpdGNoIChvYmoudHlwZSkge1xuICAgICAgICBjYXNlIFwiY29ubmVjdGlvbl9zdHJpbmdcIjpcbiAgICAgICAgICAgIHJldHVybiBzZXJpYWxpemVPbllvdXJEYXRhQ29ubmVjdGlvblN0cmluZ0F1dGhlbnRpY2F0aW9uT3B0aW9ucyhvYmopO1xuICAgICAgICBjYXNlIFwia2V5X2FuZF9rZXlfaWRcIjpcbiAgICAgICAgICAgIHJldHVybiBzZXJpYWxpemVPbllvdXJEYXRhS2V5QW5kS2V5SWRBdXRoZW50aWNhdGlvbk9wdGlvbnMob2JqKTtcbiAgICAgICAgY2FzZSBcImVuY29kZWRfYXBpX2tleVwiOlxuICAgICAgICAgICAgcmV0dXJuIHNlcmlhbGl6ZU9uWW91ckRhdGFFbmNvZGVkQXBpS2V5QXV0aGVudGljYXRpb25PcHRpb25zKG9iaik7XG4gICAgICAgIGNhc2UgXCJhY2Nlc3NfdG9rZW5cIjpcbiAgICAgICAgICAgIHJldHVybiBzZXJpYWxpemVPbllvdXJEYXRhQWNjZXNzVG9rZW5BdXRoZW50aWNhdGlvbk9wdGlvbnMob2JqKTtcbiAgICAgICAgY2FzZSBcInVzZXJfYXNzaWduZWRfbWFuYWdlZF9pZGVudGl0eVwiOlxuICAgICAgICAgICAgcmV0dXJuIHNlcmlhbGl6ZU9uWW91ckRhdGFVc2VyQXNzaWduZWRNYW5hZ2VkSWRlbnRpdHlBdXRoZW50aWNhdGlvbk9wdGlvbnMob2JqKTtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiBvYmo7XG4gICAgfVxufVxuLyoqIHNlcmlhbGl6ZSBmdW5jdGlvbiBmb3IgT25Zb3VyRGF0YUVuZHBvaW50VmVjdG9yaXphdGlvblNvdXJjZSAqL1xuZnVuY3Rpb24gc2VyaWFsaXplT25Zb3VyRGF0YUVuZHBvaW50VmVjdG9yaXphdGlvblNvdXJjZShvYmopIHtcbiAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiBvYmpbXCJ0eXBlXCJdLFxuICAgICAgICBlbmRwb2ludDogb2JqW1wiZW5kcG9pbnRcIl0sXG4gICAgICAgIGF1dGhlbnRpY2F0aW9uOiBzZXJpYWxpemVPbllvdXJEYXRhQXV0aGVudGljYXRpb25PcHRpb25zVW5pb24ob2JqLmF1dGhlbnRpY2F0aW9uKSxcbiAgICB9O1xufVxuLyoqIHNlcmlhbGl6ZSBmdW5jdGlvbiBmb3IgT25Zb3VyRGF0YURlcGxveW1lbnROYW1lVmVjdG9yaXphdGlvblNvdXJjZSAqL1xuZnVuY3Rpb24gc2VyaWFsaXplT25Zb3VyRGF0YURlcGxveW1lbnROYW1lVmVjdG9yaXphdGlvblNvdXJjZShvYmopIHtcbiAgICByZXR1cm4geyB0eXBlOiBvYmpbXCJ0eXBlXCJdLCBkZXBsb3ltZW50X25hbWU6IG9ialtcImRlcGxveW1lbnROYW1lXCJdIH07XG59XG4vKiogc2VyaWFsaXplIGZ1bmN0aW9uIGZvciBPbllvdXJEYXRhTW9kZWxJZFZlY3Rvcml6YXRpb25Tb3VyY2UgKi9cbmZ1bmN0aW9uIHNlcmlhbGl6ZU9uWW91ckRhdGFNb2RlbElkVmVjdG9yaXphdGlvblNvdXJjZShvYmopIHtcbiAgICByZXR1cm4geyB0eXBlOiBvYmpbXCJ0eXBlXCJdLCBtb2RlbF9pZDogb2JqW1wibW9kZWxJZFwiXSB9O1xufVxuLyoqIHNlcmlhbGl6ZSBmdW5jdGlvbiBmb3IgT25Zb3VyRGF0YVZlY3Rvcml6YXRpb25Tb3VyY2VVbmlvbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNlcmlhbGl6ZU9uWW91ckRhdGFWZWN0b3JpemF0aW9uU291cmNlVW5pb24ob2JqKSB7XG4gICAgc3dpdGNoIChvYmoudHlwZSkge1xuICAgICAgICBjYXNlIFwiZW5kcG9pbnRcIjpcbiAgICAgICAgICAgIHJldHVybiBzZXJpYWxpemVPbllvdXJEYXRhRW5kcG9pbnRWZWN0b3JpemF0aW9uU291cmNlKG9iaik7XG4gICAgICAgIGNhc2UgXCJkZXBsb3ltZW50X25hbWVcIjpcbiAgICAgICAgICAgIHJldHVybiBzZXJpYWxpemVPbllvdXJEYXRhRGVwbG95bWVudE5hbWVWZWN0b3JpemF0aW9uU291cmNlKG9iaik7XG4gICAgICAgIGNhc2UgXCJtb2RlbF9pZFwiOlxuICAgICAgICAgICAgcmV0dXJuIHNlcmlhbGl6ZU9uWW91ckRhdGFNb2RlbElkVmVjdG9yaXphdGlvblNvdXJjZShvYmopO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIG9iajtcbiAgICB9XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1zZXJpYWxpemVVdGlsLmpzLm1hcCIsIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbkNvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxuXG5QZXJtaXNzaW9uIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBhbmQvb3IgZGlzdHJpYnV0ZSB0aGlzIHNvZnR3YXJlIGZvciBhbnlcbnB1cnBvc2Ugd2l0aCBvciB3aXRob3V0IGZlZSBpcyBoZXJlYnkgZ3JhbnRlZC5cblxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiBBTkQgVEhFIEFVVEhPUiBESVNDTEFJTVMgQUxMIFdBUlJBTlRJRVMgV0lUSFxuUkVHQVJEIFRPIFRISVMgU09GVFdBUkUgSU5DTFVESU5HIEFMTCBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZXG5BTkQgRklUTkVTUy4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUiBCRSBMSUFCTEUgRk9SIEFOWSBTUEVDSUFMLCBESVJFQ1QsXG5JTkRJUkVDVCwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTIE9SIEFOWSBEQU1BR0VTIFdIQVRTT0VWRVIgUkVTVUxUSU5HIEZST01cbkxPU1MgT0YgVVNFLCBEQVRBIE9SIFBST0ZJVFMsIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBORUdMSUdFTkNFIE9SXG5PVEhFUiBUT1JUSU9VUyBBQ1RJT04sIEFSSVNJTkcgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgVVNFIE9SXG5QRVJGT1JNQU5DRSBPRiBUSElTIFNPRlRXQVJFLlxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8qIGdsb2JhbCBSZWZsZWN0LCBQcm9taXNlLCBTdXBwcmVzc2VkRXJyb3IsIFN5bWJvbCAqL1xuXG52YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uKGQsIGIpIHtcbiAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxuICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxuICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGIsIHApKSBkW3BdID0gYltwXTsgfTtcbiAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gX19leHRlbmRzKGQsIGIpIHtcbiAgaWYgKHR5cGVvZiBiICE9PSBcImZ1bmN0aW9uXCIgJiYgYiAhPT0gbnVsbClcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDbGFzcyBleHRlbmRzIHZhbHVlIFwiICsgU3RyaW5nKGIpICsgXCIgaXMgbm90IGEgY29uc3RydWN0b3Igb3IgbnVsbFwiKTtcbiAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbn1cblxuZXhwb3J0IHZhciBfX2Fzc2lnbiA9IGZ1bmN0aW9uKCkge1xuICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gX19hc3NpZ24odCkge1xuICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpIHRbcF0gPSBzW3BdO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHQ7XG4gIH1cbiAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfX3Jlc3QocywgZSkge1xuICB2YXIgdCA9IHt9O1xuICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkgJiYgZS5pbmRleE9mKHApIDwgMClcbiAgICAgIHRbcF0gPSBzW3BdO1xuICBpZiAocyAhPSBudWxsICYmIHR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzID09PSBcImZ1bmN0aW9uXCIpXG4gICAgICBmb3IgKHZhciBpID0gMCwgcCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMocyk7IGkgPCBwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKGUuaW5kZXhPZihwW2ldKSA8IDAgJiYgT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHMsIHBbaV0pKVxuICAgICAgICAgICAgICB0W3BbaV1dID0gc1twW2ldXTtcbiAgICAgIH1cbiAgcmV0dXJuIHQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfX2RlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XG4gIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XG4gIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XG4gIGVsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XG4gIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfX3BhcmFtKHBhcmFtSW5kZXgsIGRlY29yYXRvcikge1xuICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7IGRlY29yYXRvcih0YXJnZXQsIGtleSwgcGFyYW1JbmRleCk7IH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9fZXNEZWNvcmF0ZShjdG9yLCBkZXNjcmlwdG9ySW4sIGRlY29yYXRvcnMsIGNvbnRleHRJbiwgaW5pdGlhbGl6ZXJzLCBleHRyYUluaXRpYWxpemVycykge1xuICBmdW5jdGlvbiBhY2NlcHQoZikgeyBpZiAoZiAhPT0gdm9pZCAwICYmIHR5cGVvZiBmICE9PSBcImZ1bmN0aW9uXCIpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJGdW5jdGlvbiBleHBlY3RlZFwiKTsgcmV0dXJuIGY7IH1cbiAgdmFyIGtpbmQgPSBjb250ZXh0SW4ua2luZCwga2V5ID0ga2luZCA9PT0gXCJnZXR0ZXJcIiA/IFwiZ2V0XCIgOiBraW5kID09PSBcInNldHRlclwiID8gXCJzZXRcIiA6IFwidmFsdWVcIjtcbiAgdmFyIHRhcmdldCA9ICFkZXNjcmlwdG9ySW4gJiYgY3RvciA/IGNvbnRleHRJbltcInN0YXRpY1wiXSA/IGN0b3IgOiBjdG9yLnByb3RvdHlwZSA6IG51bGw7XG4gIHZhciBkZXNjcmlwdG9yID0gZGVzY3JpcHRvckluIHx8ICh0YXJnZXQgPyBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwgY29udGV4dEluLm5hbWUpIDoge30pO1xuICB2YXIgXywgZG9uZSA9IGZhbHNlO1xuICBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgdmFyIGNvbnRleHQgPSB7fTtcbiAgICAgIGZvciAodmFyIHAgaW4gY29udGV4dEluKSBjb250ZXh0W3BdID0gcCA9PT0gXCJhY2Nlc3NcIiA/IHt9IDogY29udGV4dEluW3BdO1xuICAgICAgZm9yICh2YXIgcCBpbiBjb250ZXh0SW4uYWNjZXNzKSBjb250ZXh0LmFjY2Vzc1twXSA9IGNvbnRleHRJbi5hY2Nlc3NbcF07XG4gICAgICBjb250ZXh0LmFkZEluaXRpYWxpemVyID0gZnVuY3Rpb24gKGYpIHsgaWYgKGRvbmUpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgYWRkIGluaXRpYWxpemVycyBhZnRlciBkZWNvcmF0aW9uIGhhcyBjb21wbGV0ZWRcIik7IGV4dHJhSW5pdGlhbGl6ZXJzLnB1c2goYWNjZXB0KGYgfHwgbnVsbCkpOyB9O1xuICAgICAgdmFyIHJlc3VsdCA9ICgwLCBkZWNvcmF0b3JzW2ldKShraW5kID09PSBcImFjY2Vzc29yXCIgPyB7IGdldDogZGVzY3JpcHRvci5nZXQsIHNldDogZGVzY3JpcHRvci5zZXQgfSA6IGRlc2NyaXB0b3Jba2V5XSwgY29udGV4dCk7XG4gICAgICBpZiAoa2luZCA9PT0gXCJhY2Nlc3NvclwiKSB7XG4gICAgICAgICAgaWYgKHJlc3VsdCA9PT0gdm9pZCAwKSBjb250aW51ZTtcbiAgICAgICAgICBpZiAocmVzdWx0ID09PSBudWxsIHx8IHR5cGVvZiByZXN1bHQgIT09IFwib2JqZWN0XCIpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJPYmplY3QgZXhwZWN0ZWRcIik7XG4gICAgICAgICAgaWYgKF8gPSBhY2NlcHQocmVzdWx0LmdldCkpIGRlc2NyaXB0b3IuZ2V0ID0gXztcbiAgICAgICAgICBpZiAoXyA9IGFjY2VwdChyZXN1bHQuc2V0KSkgZGVzY3JpcHRvci5zZXQgPSBfO1xuICAgICAgICAgIGlmIChfID0gYWNjZXB0KHJlc3VsdC5pbml0KSkgaW5pdGlhbGl6ZXJzLnVuc2hpZnQoXyk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChfID0gYWNjZXB0KHJlc3VsdCkpIHtcbiAgICAgICAgICBpZiAoa2luZCA9PT0gXCJmaWVsZFwiKSBpbml0aWFsaXplcnMudW5zaGlmdChfKTtcbiAgICAgICAgICBlbHNlIGRlc2NyaXB0b3Jba2V5XSA9IF87XG4gICAgICB9XG4gIH1cbiAgaWYgKHRhcmdldCkgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgY29udGV4dEluLm5hbWUsIGRlc2NyaXB0b3IpO1xuICBkb25lID0gdHJ1ZTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBfX3J1bkluaXRpYWxpemVycyh0aGlzQXJnLCBpbml0aWFsaXplcnMsIHZhbHVlKSB7XG4gIHZhciB1c2VWYWx1ZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAyO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGluaXRpYWxpemVycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFsdWUgPSB1c2VWYWx1ZSA/IGluaXRpYWxpemVyc1tpXS5jYWxsKHRoaXNBcmcsIHZhbHVlKSA6IGluaXRpYWxpemVyc1tpXS5jYWxsKHRoaXNBcmcpO1xuICB9XG4gIHJldHVybiB1c2VWYWx1ZSA/IHZhbHVlIDogdm9pZCAwO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIF9fcHJvcEtleSh4KSB7XG4gIHJldHVybiB0eXBlb2YgeCA9PT0gXCJzeW1ib2xcIiA/IHggOiBcIlwiLmNvbmNhdCh4KTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBfX3NldEZ1bmN0aW9uTmFtZShmLCBuYW1lLCBwcmVmaXgpIHtcbiAgaWYgKHR5cGVvZiBuYW1lID09PSBcInN5bWJvbFwiKSBuYW1lID0gbmFtZS5kZXNjcmlwdGlvbiA/IFwiW1wiLmNvbmNhdChuYW1lLmRlc2NyaXB0aW9uLCBcIl1cIikgOiBcIlwiO1xuICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KGYsIFwibmFtZVwiLCB7IGNvbmZpZ3VyYWJsZTogdHJ1ZSwgdmFsdWU6IHByZWZpeCA/IFwiXCIuY29uY2F0KHByZWZpeCwgXCIgXCIsIG5hbWUpIDogbmFtZSB9KTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBfX21ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKSB7XG4gIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5tZXRhZGF0YSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gUmVmbGVjdC5tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0ZXIodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfX2dlbmVyYXRvcih0aGlzQXJnLCBib2R5KSB7XG4gIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XG4gIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xuICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cbiAgZnVuY3Rpb24gc3RlcChvcCkge1xuICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xuICAgICAgd2hpbGUgKGcgJiYgKGcgPSAwLCBvcFswXSAmJiAoXyA9IDApKSwgXykgdHJ5IHtcbiAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XG4gICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xuICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcbiAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XG4gICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XG4gICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XG4gICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XG4gICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cbiAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xuICB9XG59XG5cbmV4cG9ydCB2YXIgX19jcmVhdGVCaW5kaW5nID0gT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xuICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xuICB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobSwgayk7XG4gIGlmICghZGVzYyB8fCAoXCJnZXRcIiBpbiBkZXNjID8gIW0uX19lc01vZHVsZSA6IGRlc2Mud3JpdGFibGUgfHwgZGVzYy5jb25maWd1cmFibGUpKSB7XG4gICAgICBkZXNjID0geyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbVtrXTsgfSB9O1xuICB9XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBrMiwgZGVzYyk7XG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xuICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xuICBvW2syXSA9IG1ba107XG59KTtcblxuZXhwb3J0IGZ1bmN0aW9uIF9fZXhwb3J0U3RhcihtLCBvKSB7XG4gIGZvciAodmFyIHAgaW4gbSkgaWYgKHAgIT09IFwiZGVmYXVsdFwiICYmICFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobywgcCkpIF9fY3JlYXRlQmluZGluZyhvLCBtLCBwKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9fdmFsdWVzKG8pIHtcbiAgdmFyIHMgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgU3ltYm9sLml0ZXJhdG9yLCBtID0gcyAmJiBvW3NdLCBpID0gMDtcbiAgaWYgKG0pIHJldHVybiBtLmNhbGwobyk7XG4gIGlmIChvICYmIHR5cGVvZiBvLmxlbmd0aCA9PT0gXCJudW1iZXJcIikgcmV0dXJuIHtcbiAgICAgIG5leHQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAobyAmJiBpID49IG8ubGVuZ3RoKSBvID0gdm9pZCAwO1xuICAgICAgICAgIHJldHVybiB7IHZhbHVlOiBvICYmIG9baSsrXSwgZG9uZTogIW8gfTtcbiAgICAgIH1cbiAgfTtcbiAgdGhyb3cgbmV3IFR5cGVFcnJvcihzID8gXCJPYmplY3QgaXMgbm90IGl0ZXJhYmxlLlwiIDogXCJTeW1ib2wuaXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gX19yZWFkKG8sIG4pIHtcbiAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdO1xuICBpZiAoIW0pIHJldHVybiBvO1xuICB2YXIgaSA9IG0uY2FsbChvKSwgciwgYXIgPSBbXSwgZTtcbiAgdHJ5IHtcbiAgICAgIHdoaWxlICgobiA9PT0gdm9pZCAwIHx8IG4tLSA+IDApICYmICEociA9IGkubmV4dCgpKS5kb25lKSBhci5wdXNoKHIudmFsdWUpO1xuICB9XG4gIGNhdGNoIChlcnJvcikgeyBlID0geyBlcnJvcjogZXJyb3IgfTsgfVxuICBmaW5hbGx5IHtcbiAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKHIgJiYgIXIuZG9uZSAmJiAobSA9IGlbXCJyZXR1cm5cIl0pKSBtLmNhbGwoaSk7XG4gICAgICB9XG4gICAgICBmaW5hbGx5IHsgaWYgKGUpIHRocm93IGUuZXJyb3I7IH1cbiAgfVxuICByZXR1cm4gYXI7XG59XG5cbi8qKiBAZGVwcmVjYXRlZCAqL1xuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkKCkge1xuICBmb3IgKHZhciBhciA9IFtdLCBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKylcbiAgICAgIGFyID0gYXIuY29uY2F0KF9fcmVhZChhcmd1bWVudHNbaV0pKTtcbiAgcmV0dXJuIGFyO1xufVxuXG4vKiogQGRlcHJlY2F0ZWQgKi9cbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZEFycmF5cygpIHtcbiAgZm9yICh2YXIgcyA9IDAsIGkgPSAwLCBpbCA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSBzICs9IGFyZ3VtZW50c1tpXS5sZW5ndGg7XG4gIGZvciAodmFyIHIgPSBBcnJheShzKSwgayA9IDAsIGkgPSAwOyBpIDwgaWw7IGkrKylcbiAgICAgIGZvciAodmFyIGEgPSBhcmd1bWVudHNbaV0sIGogPSAwLCBqbCA9IGEubGVuZ3RoOyBqIDwgamw7IGorKywgaysrKVxuICAgICAgICAgIHJba10gPSBhW2pdO1xuICByZXR1cm4gcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkQXJyYXkodG8sIGZyb20sIHBhY2spIHtcbiAgaWYgKHBhY2sgfHwgYXJndW1lbnRzLmxlbmd0aCA9PT0gMikgZm9yICh2YXIgaSA9IDAsIGwgPSBmcm9tLmxlbmd0aCwgYXI7IGkgPCBsOyBpKyspIHtcbiAgICAgIGlmIChhciB8fCAhKGkgaW4gZnJvbSkpIHtcbiAgICAgICAgICBpZiAoIWFyKSBhciA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGZyb20sIDAsIGkpO1xuICAgICAgICAgIGFyW2ldID0gZnJvbVtpXTtcbiAgICAgIH1cbiAgfVxuICByZXR1cm4gdG8uY29uY2F0KGFyIHx8IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGZyb20pKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXQodikge1xuICByZXR1cm4gdGhpcyBpbnN0YW5jZW9mIF9fYXdhaXQgPyAodGhpcy52ID0gdiwgdGhpcykgOiBuZXcgX19hd2FpdCh2KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNHZW5lcmF0b3IodGhpc0FyZywgX2FyZ3VtZW50cywgZ2VuZXJhdG9yKSB7XG4gIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XG4gIHZhciBnID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pLCBpLCBxID0gW107XG4gIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcbiAgZnVuY3Rpb24gdmVyYihuKSB7IGlmIChnW25dKSBpW25dID0gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChhLCBiKSB7IHEucHVzaChbbiwgdiwgYSwgYl0pID4gMSB8fCByZXN1bWUobiwgdik7IH0pOyB9OyB9XG4gIGZ1bmN0aW9uIHJlc3VtZShuLCB2KSB7IHRyeSB7IHN0ZXAoZ1tuXSh2KSk7IH0gY2F0Y2ggKGUpIHsgc2V0dGxlKHFbMF1bM10sIGUpOyB9IH1cbiAgZnVuY3Rpb24gc3RlcChyKSB7IHIudmFsdWUgaW5zdGFuY2VvZiBfX2F3YWl0ID8gUHJvbWlzZS5yZXNvbHZlKHIudmFsdWUudikudGhlbihmdWxmaWxsLCByZWplY3QpIDogc2V0dGxlKHFbMF1bMl0sIHIpOyB9XG4gIGZ1bmN0aW9uIGZ1bGZpbGwodmFsdWUpIHsgcmVzdW1lKFwibmV4dFwiLCB2YWx1ZSk7IH1cbiAgZnVuY3Rpb24gcmVqZWN0KHZhbHVlKSB7IHJlc3VtZShcInRocm93XCIsIHZhbHVlKTsgfVxuICBmdW5jdGlvbiBzZXR0bGUoZiwgdikgeyBpZiAoZih2KSwgcS5zaGlmdCgpLCBxLmxlbmd0aCkgcmVzdW1lKHFbMF1bMF0sIHFbMF1bMV0pOyB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jRGVsZWdhdG9yKG8pIHtcbiAgdmFyIGksIHA7XG4gIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiwgZnVuY3Rpb24gKGUpIHsgdGhyb3cgZTsgfSksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XG4gIGZ1bmN0aW9uIHZlcmIobiwgZikgeyBpW25dID0gb1tuXSA/IGZ1bmN0aW9uICh2KSB7IHJldHVybiAocCA9ICFwKSA/IHsgdmFsdWU6IF9fYXdhaXQob1tuXSh2KSksIGRvbmU6IGZhbHNlIH0gOiBmID8gZih2KSA6IHY7IH0gOiBmOyB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jVmFsdWVzKG8pIHtcbiAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcbiAgdmFyIG0gPSBvW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSwgaTtcbiAgcmV0dXJuIG0gPyBtLmNhbGwobykgOiAobyA9IHR5cGVvZiBfX3ZhbHVlcyA9PT0gXCJmdW5jdGlvblwiID8gX192YWx1ZXMobykgOiBvW1N5bWJvbC5pdGVyYXRvcl0oKSwgaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGkpO1xuICBmdW5jdGlvbiB2ZXJiKG4pIHsgaVtuXSA9IG9bbl0gJiYgZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHsgdiA9IG9bbl0odiksIHNldHRsZShyZXNvbHZlLCByZWplY3QsIHYuZG9uZSwgdi52YWx1ZSk7IH0pOyB9OyB9XG4gIGZ1bmN0aW9uIHNldHRsZShyZXNvbHZlLCByZWplY3QsIGQsIHYpIHsgUHJvbWlzZS5yZXNvbHZlKHYpLnRoZW4oZnVuY3Rpb24odikgeyByZXNvbHZlKHsgdmFsdWU6IHYsIGRvbmU6IGQgfSk7IH0sIHJlamVjdCk7IH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9fbWFrZVRlbXBsYXRlT2JqZWN0KGNvb2tlZCwgcmF3KSB7XG4gIGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvb2tlZCwgXCJyYXdcIiwgeyB2YWx1ZTogcmF3IH0pOyB9IGVsc2UgeyBjb29rZWQucmF3ID0gcmF3OyB9XG4gIHJldHVybiBjb29rZWQ7XG59O1xuXG52YXIgX19zZXRNb2R1bGVEZWZhdWx0ID0gT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCB2KSB7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBcImRlZmF1bHRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdiB9KTtcbn0pIDogZnVuY3Rpb24obywgdikge1xuICBvW1wiZGVmYXVsdFwiXSA9IHY7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnRTdGFyKG1vZCkge1xuICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xuICB2YXIgcmVzdWx0ID0ge307XG4gIGlmIChtb2QgIT0gbnVsbCkgZm9yICh2YXIgayBpbiBtb2QpIGlmIChrICE9PSBcImRlZmF1bHRcIiAmJiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9kLCBrKSkgX19jcmVhdGVCaW5kaW5nKHJlc3VsdCwgbW9kLCBrKTtcbiAgX19zZXRNb2R1bGVEZWZhdWx0KHJlc3VsdCwgbW9kKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0RGVmYXVsdChtb2QpIHtcbiAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBkZWZhdWx0OiBtb2QgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9fY2xhc3NQcml2YXRlRmllbGRHZXQocmVjZWl2ZXIsIHN0YXRlLCBraW5kLCBmKSB7XG4gIGlmIChraW5kID09PSBcImFcIiAmJiAhZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlByaXZhdGUgYWNjZXNzb3Igd2FzIGRlZmluZWQgd2l0aG91dCBhIGdldHRlclwiKTtcbiAgaWYgKHR5cGVvZiBzdGF0ZSA9PT0gXCJmdW5jdGlvblwiID8gcmVjZWl2ZXIgIT09IHN0YXRlIHx8ICFmIDogIXN0YXRlLmhhcyhyZWNlaXZlcikpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgcmVhZCBwcml2YXRlIG1lbWJlciBmcm9tIGFuIG9iamVjdCB3aG9zZSBjbGFzcyBkaWQgbm90IGRlY2xhcmUgaXRcIik7XG4gIHJldHVybiBraW5kID09PSBcIm1cIiA/IGYgOiBraW5kID09PSBcImFcIiA/IGYuY2FsbChyZWNlaXZlcikgOiBmID8gZi52YWx1ZSA6IHN0YXRlLmdldChyZWNlaXZlcik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfX2NsYXNzUHJpdmF0ZUZpZWxkU2V0KHJlY2VpdmVyLCBzdGF0ZSwgdmFsdWUsIGtpbmQsIGYpIHtcbiAgaWYgKGtpbmQgPT09IFwibVwiKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUHJpdmF0ZSBtZXRob2QgaXMgbm90IHdyaXRhYmxlXCIpO1xuICBpZiAoa2luZCA9PT0gXCJhXCIgJiYgIWYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJQcml2YXRlIGFjY2Vzc29yIHdhcyBkZWZpbmVkIHdpdGhvdXQgYSBzZXR0ZXJcIik7XG4gIGlmICh0eXBlb2Ygc3RhdGUgPT09IFwiZnVuY3Rpb25cIiA/IHJlY2VpdmVyICE9PSBzdGF0ZSB8fCAhZiA6ICFzdGF0ZS5oYXMocmVjZWl2ZXIpKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IHdyaXRlIHByaXZhdGUgbWVtYmVyIHRvIGFuIG9iamVjdCB3aG9zZSBjbGFzcyBkaWQgbm90IGRlY2xhcmUgaXRcIik7XG4gIHJldHVybiAoa2luZCA9PT0gXCJhXCIgPyBmLmNhbGwocmVjZWl2ZXIsIHZhbHVlKSA6IGYgPyBmLnZhbHVlID0gdmFsdWUgOiBzdGF0ZS5zZXQocmVjZWl2ZXIsIHZhbHVlKSksIHZhbHVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZEluKHN0YXRlLCByZWNlaXZlcikge1xuICBpZiAocmVjZWl2ZXIgPT09IG51bGwgfHwgKHR5cGVvZiByZWNlaXZlciAhPT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgcmVjZWl2ZXIgIT09IFwiZnVuY3Rpb25cIikpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgdXNlICdpbicgb3BlcmF0b3Igb24gbm9uLW9iamVjdFwiKTtcbiAgcmV0dXJuIHR5cGVvZiBzdGF0ZSA9PT0gXCJmdW5jdGlvblwiID8gcmVjZWl2ZXIgPT09IHN0YXRlIDogc3RhdGUuaGFzKHJlY2VpdmVyKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9fYWRkRGlzcG9zYWJsZVJlc291cmNlKGVudiwgdmFsdWUsIGFzeW5jKSB7XG4gIGlmICh2YWx1ZSAhPT0gbnVsbCAmJiB2YWx1ZSAhPT0gdm9pZCAwKSB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgdmFsdWUgIT09IFwiZnVuY3Rpb25cIikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIk9iamVjdCBleHBlY3RlZC5cIik7XG4gICAgdmFyIGRpc3Bvc2U7XG4gICAgaWYgKGFzeW5jKSB7XG4gICAgICAgIGlmICghU3ltYm9sLmFzeW5jRGlzcG9zZSkgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0Rpc3Bvc2UgaXMgbm90IGRlZmluZWQuXCIpO1xuICAgICAgICBkaXNwb3NlID0gdmFsdWVbU3ltYm9sLmFzeW5jRGlzcG9zZV07XG4gICAgfVxuICAgIGlmIChkaXNwb3NlID09PSB2b2lkIDApIHtcbiAgICAgICAgaWYgKCFTeW1ib2wuZGlzcG9zZSkgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5kaXNwb3NlIGlzIG5vdCBkZWZpbmVkLlwiKTtcbiAgICAgICAgZGlzcG9zZSA9IHZhbHVlW1N5bWJvbC5kaXNwb3NlXTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBkaXNwb3NlICE9PSBcImZ1bmN0aW9uXCIpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJPYmplY3Qgbm90IGRpc3Bvc2FibGUuXCIpO1xuICAgIGVudi5zdGFjay5wdXNoKHsgdmFsdWU6IHZhbHVlLCBkaXNwb3NlOiBkaXNwb3NlLCBhc3luYzogYXN5bmMgfSk7XG4gIH1cbiAgZWxzZSBpZiAoYXN5bmMpIHtcbiAgICBlbnYuc3RhY2sucHVzaCh7IGFzeW5jOiB0cnVlIH0pO1xuICB9XG4gIHJldHVybiB2YWx1ZTtcbn1cblxudmFyIF9TdXBwcmVzc2VkRXJyb3IgPSB0eXBlb2YgU3VwcHJlc3NlZEVycm9yID09PSBcImZ1bmN0aW9uXCIgPyBTdXBwcmVzc2VkRXJyb3IgOiBmdW5jdGlvbiAoZXJyb3IsIHN1cHByZXNzZWQsIG1lc3NhZ2UpIHtcbiAgdmFyIGUgPSBuZXcgRXJyb3IobWVzc2FnZSk7XG4gIHJldHVybiBlLm5hbWUgPSBcIlN1cHByZXNzZWRFcnJvclwiLCBlLmVycm9yID0gZXJyb3IsIGUuc3VwcHJlc3NlZCA9IHN1cHByZXNzZWQsIGU7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gX19kaXNwb3NlUmVzb3VyY2VzKGVudikge1xuICBmdW5jdGlvbiBmYWlsKGUpIHtcbiAgICBlbnYuZXJyb3IgPSBlbnYuaGFzRXJyb3IgPyBuZXcgX1N1cHByZXNzZWRFcnJvcihlLCBlbnYuZXJyb3IsIFwiQW4gZXJyb3Igd2FzIHN1cHByZXNzZWQgZHVyaW5nIGRpc3Bvc2FsLlwiKSA6IGU7XG4gICAgZW52Lmhhc0Vycm9yID0gdHJ1ZTtcbiAgfVxuICBmdW5jdGlvbiBuZXh0KCkge1xuICAgIHdoaWxlIChlbnYuc3RhY2subGVuZ3RoKSB7XG4gICAgICB2YXIgcmVjID0gZW52LnN0YWNrLnBvcCgpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IHJlYy5kaXNwb3NlICYmIHJlYy5kaXNwb3NlLmNhbGwocmVjLnZhbHVlKTtcbiAgICAgICAgaWYgKHJlYy5hc3luYykgcmV0dXJuIFByb21pc2UucmVzb2x2ZShyZXN1bHQpLnRoZW4obmV4dCwgZnVuY3Rpb24oZSkgeyBmYWlsKGUpOyByZXR1cm4gbmV4dCgpOyB9KTtcbiAgICAgIH1cbiAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgZmFpbChlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGVudi5oYXNFcnJvcikgdGhyb3cgZW52LmVycm9yO1xuICB9XG4gIHJldHVybiBuZXh0KCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgX19leHRlbmRzLFxuICBfX2Fzc2lnbixcbiAgX19yZXN0LFxuICBfX2RlY29yYXRlLFxuICBfX3BhcmFtLFxuICBfX21ldGFkYXRhLFxuICBfX2F3YWl0ZXIsXG4gIF9fZ2VuZXJhdG9yLFxuICBfX2NyZWF0ZUJpbmRpbmcsXG4gIF9fZXhwb3J0U3RhcixcbiAgX192YWx1ZXMsXG4gIF9fcmVhZCxcbiAgX19zcHJlYWQsXG4gIF9fc3ByZWFkQXJyYXlzLFxuICBfX3NwcmVhZEFycmF5LFxuICBfX2F3YWl0LFxuICBfX2FzeW5jR2VuZXJhdG9yLFxuICBfX2FzeW5jRGVsZWdhdG9yLFxuICBfX2FzeW5jVmFsdWVzLFxuICBfX21ha2VUZW1wbGF0ZU9iamVjdCxcbiAgX19pbXBvcnRTdGFyLFxuICBfX2ltcG9ydERlZmF1bHQsXG4gIF9fY2xhc3NQcml2YXRlRmllbGRHZXQsXG4gIF9fY2xhc3NQcml2YXRlRmllbGRTZXQsXG4gIF9fY2xhc3NQcml2YXRlRmllbGRJbixcbiAgX19hZGREaXNwb3NhYmxlUmVzb3VyY2UsXG4gIF9fZGlzcG9zZVJlc291cmNlcyxcbn07XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IE9wZW5BSUNsaWVudCwgQXp1cmVLZXlDcmVkZW50aWFsIH0gZnJvbSBcIkBhenVyZS9vcGVuYWlcIjtcblxuXG5jb25zdCBlbmRwb2ludCA9IFwiaHR0cHM6Ly9haS1ydW0tc3dlLWE5MDlhNS0yLm9wZW5haS5henVyZS5jb20vXCI7XG5jb25zdCBhenVyZUFwaUtleSA9IFwiZmI0ZjY3NmUwNjVjNGUyMzg4NzBlMmFkYzBjZDU5NTZcIiA7XG5cbmNvbnN0IG1lc3NhZ2VzID0gW1xuICB7IHJvbGU6IFwic3lzdGVtXCIsIGNvbnRlbnQ6IFwiWW91IGFyZSBhIGhlbHBmdWwgYXNzaXN0YW50LlwiIH0sXG4gIHsgcm9sZTogXCJ1c2VyXCIsIGNvbnRlbnQ6IFwiRG9lcyBBenVyZSBPcGVuQUkgc3VwcG9ydCBjdXN0b21lciBtYW5hZ2VkIGtleXM/XCIgfSxcbiAgeyByb2xlOiBcImFzc2lzdGFudFwiLCBjb250ZW50OiBcIlllcywgY3VzdG9tZXIgbWFuYWdlZCBrZXlzIGFyZSBzdXBwb3J0ZWQgYnkgQXp1cmUgT3BlbkFJXCIgfSxcbiAgeyByb2xlOiBcInVzZXJcIiwgY29udGVudDogXCJEbyBvdGhlciBBenVyZSBBSSBzZXJ2aWNlcyBzdXBwb3J0IHRoaXMgdG9vXCIgfSxcbl07XG5cbmFzeW5jIGZ1bmN0aW9uIG1haW4oKSB7XG4gIGNvbnNvbGUubG9nKFwiPT0gQ2hhdCBDb21wbGV0aW9ucyBTYW1wbGUgPT1cIik7XG5cbiAgY29uc3QgY2xpZW50ID0gbmV3IE9wZW5BSUNsaWVudChlbmRwb2ludCwgbmV3IEF6dXJlS2V5Q3JlZGVudGlhbChhenVyZUFwaUtleSkpO1xuICBjb25zdCBkZXBsb3ltZW50SWQgPSBcImdwdC0zNS10dXJib1wiO1xuICBjb25zdCByZXN1bHQgPSBhd2FpdCBjbGllbnQuZ2V0Q2hhdENvbXBsZXRpb25zKGRlcGxveW1lbnRJZCwgbWVzc2FnZXMpO1xuXG4gIGZvciAoY29uc3QgY2hvaWNlIG9mIHJlc3VsdC5jaG9pY2VzKSB7XG4gICAgY29uc29sZS5sb2coY2hvaWNlLm1lc3NhZ2UpO1xuICB9XG59XG5cbm1haW4oKS5jYXRjaCgoZXJyKSA9PiB7XG4gIGNvbnNvbGUuZXJyb3IoXCJUaGUgc2FtcGxlIGVuY291bnRlcmVkIGFuIGVycm9yOlwiLCBlcnIpO1xufSk7XG5cbm1haW4oKTsiXSwibmFtZXMiOlsiX3JlZ2VuZXJhdG9yUnVudGltZSIsImUiLCJ0IiwiciIsIk9iamVjdCIsInByb3RvdHlwZSIsIm4iLCJoYXNPd25Qcm9wZXJ0eSIsIm8iLCJkZWZpbmVQcm9wZXJ0eSIsInZhbHVlIiwiaSIsIlN5bWJvbCIsImEiLCJpdGVyYXRvciIsImMiLCJhc3luY0l0ZXJhdG9yIiwidSIsInRvU3RyaW5nVGFnIiwiZGVmaW5lIiwiZW51bWVyYWJsZSIsImNvbmZpZ3VyYWJsZSIsIndyaXRhYmxlIiwid3JhcCIsIkdlbmVyYXRvciIsImNyZWF0ZSIsIkNvbnRleHQiLCJtYWtlSW52b2tlTWV0aG9kIiwidHJ5Q2F0Y2giLCJ0eXBlIiwiYXJnIiwiY2FsbCIsImgiLCJsIiwiZiIsInMiLCJ5IiwiR2VuZXJhdG9yRnVuY3Rpb24iLCJHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSIsInAiLCJkIiwiZ2V0UHJvdG90eXBlT2YiLCJ2IiwidmFsdWVzIiwiZyIsImRlZmluZUl0ZXJhdG9yTWV0aG9kcyIsImZvckVhY2giLCJfaW52b2tlIiwiQXN5bmNJdGVyYXRvciIsImludm9rZSIsIl90eXBlb2YiLCJyZXNvbHZlIiwiX19hd2FpdCIsInRoZW4iLCJjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZyIsIkVycm9yIiwiZG9uZSIsIm1ldGhvZCIsImRlbGVnYXRlIiwibWF5YmVJbnZva2VEZWxlZ2F0ZSIsInNlbnQiLCJfc2VudCIsImRpc3BhdGNoRXhjZXB0aW9uIiwiYWJydXB0IiwiVHlwZUVycm9yIiwicmVzdWx0TmFtZSIsIm5leHQiLCJuZXh0TG9jIiwicHVzaFRyeUVudHJ5IiwidHJ5TG9jIiwiY2F0Y2hMb2MiLCJmaW5hbGx5TG9jIiwiYWZ0ZXJMb2MiLCJ0cnlFbnRyaWVzIiwicHVzaCIsInJlc2V0VHJ5RW50cnkiLCJjb21wbGV0aW9uIiwicmVzZXQiLCJpc05hTiIsImxlbmd0aCIsImRpc3BsYXlOYW1lIiwiaXNHZW5lcmF0b3JGdW5jdGlvbiIsImNvbnN0cnVjdG9yIiwibmFtZSIsIm1hcmsiLCJzZXRQcm90b3R5cGVPZiIsIl9fcHJvdG9fXyIsImF3cmFwIiwiYXN5bmMiLCJQcm9taXNlIiwia2V5cyIsInJldmVyc2UiLCJwb3AiLCJwcmV2IiwiY2hhckF0Iiwic2xpY2UiLCJzdG9wIiwicnZhbCIsImhhbmRsZSIsImNvbXBsZXRlIiwiZmluaXNoIiwiX2NhdGNoIiwiZGVsZWdhdGVZaWVsZCIsIl9jcmVhdGVGb3JPZkl0ZXJhdG9ySGVscGVyIiwiYWxsb3dBcnJheUxpa2UiLCJpdCIsIkFycmF5IiwiaXNBcnJheSIsIl91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheSIsIkYiLCJfZSIsIm5vcm1hbENvbXBsZXRpb24iLCJkaWRFcnIiLCJlcnIiLCJzdGVwIiwiX2UyIiwibWluTGVuIiwiX2FycmF5TGlrZVRvQXJyYXkiLCJ0b1N0cmluZyIsImZyb20iLCJ0ZXN0IiwiYXJyIiwibGVuIiwiYXJyMiIsImFzeW5jR2VuZXJhdG9yU3RlcCIsImdlbiIsInJlamVjdCIsIl9uZXh0IiwiX3Rocm93Iiwia2V5IiwiaW5mbyIsImVycm9yIiwiX2FzeW5jVG9HZW5lcmF0b3IiLCJmbiIsInNlbGYiLCJhcmdzIiwiYXJndW1lbnRzIiwiYXBwbHkiLCJ1bmRlZmluZWQiLCJPcGVuQUlDbGllbnQiLCJBenVyZUtleUNyZWRlbnRpYWwiLCJlbmRwb2ludCIsImF6dXJlQXBpS2V5IiwibWVzc2FnZXMiLCJyb2xlIiwiY29udGVudCIsIm1haW4iLCJfbWFpbiIsIl9jYWxsZWUiLCJjbGllbnQiLCJkZXBsb3ltZW50SWQiLCJyZXN1bHQiLCJfaXRlcmF0b3IiLCJfc3RlcCIsImNob2ljZSIsIl9jYWxsZWUkIiwiX2NvbnRleHQiLCJjb25zb2xlIiwibG9nIiwiZ2V0Q2hhdENvbXBsZXRpb25zIiwiY2hvaWNlcyIsIm1lc3NhZ2UiXSwic291cmNlUm9vdCI6IiJ9