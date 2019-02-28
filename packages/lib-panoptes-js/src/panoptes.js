/* global localStorage */

const Frisbee = require('frisbee')
const { config } = require('./config')

function handleMissingParameter (message) {
  return Promise.reject(new Error(message))
}

function checkForAdminFlag () {
  if (typeof localStorage !== 'undefined' && localStorage !== null) {
    return !!localStorage.getItem('adminFlag') || undefined
  }

  return undefined
}

const headers = {
  'Accept': 'application/vnd.api+json; version=1',
  'Content-Type': 'application/json'
}

const frisbee = new Frisbee({
  headers
})

function resetAuthorization (authorization) {
  if (authorization) frisbee.auth()
}

// TODO: Consider how to integrate a GraphQL option
function get (endpoint, query, authorization = '', host) {
  let fullQuery
  const defaultParams = { admin: checkForAdminFlag(), http_cache: true }
  const apiHost = host || config.host
  if (!endpoint) return handleMissingParameter('Request needs a defined resource endpoint')
  if (authorization) frisbee.jwt(authorization)

  if (query && Object.keys(query).length > 0) {
    if (typeof query !== 'object') return Promise.reject(new TypeError('Query must be an object'))
    fullQuery = Object.assign({}, query, defaultParams)
  } else {
    fullQuery = defaultParams
  }

  return frisbee.get(`${apiHost}${endpoint}`, { body: fullQuery }).then(response => response)
    .then(resetAuthorization(authorization))
}

function post (endpoint, data, authorization = '', host) {
  const defaultParams = { admin: checkForAdminFlag(), http_cache: true }

  if (!endpoint) return handleMissingParameter('Request needs a defined resource endpoint')
  const apiHost = host || config.host
  if (authorization) frisbee.jwt(authorization)

  return frisbee.post(`${apiHost}${endpoint}`, { body: data, query: defaultParams })
    .then(response => response)
    .then(resetAuthorization(authorization))
}

function put (endpoint, data, authorization = '', host) {
  const defaultParams = { admin: checkForAdminFlag(), http_cache: true }
  const apiHost = host || config.host

  if (!endpoint) return handleMissingParameter('Request needs a defined resource endpoint')
  if (!data) return handleMissingParameter('Request needs a defined data for update')
  if (authorization) frisbee.jwt(authorization)

  return frisbee.put(`${apiHost}${endpoint}`, { body: defaultParams })
    .then(response => response)
    .then(resetAuthorization(authorization))
}

function del (endpoint, authorization = '', host) {
  const defaultParams = { admin: checkForAdminFlag(), http_cache: true }
  const apiHost = host || config.host

  if (!endpoint) return handleMissingParameter('Request needs a defined resource endpoint')
  if (authorization) frisbee.jwt(authorization)

  return frisbee.del(`${apiHost}${endpoint}`, { body: defaultParams })
    .then(response => response)
    .then(resetAuthorization(authorization))
}

const requests = {
  get,
  put,
  post,
  del
}

module.exports = requests
