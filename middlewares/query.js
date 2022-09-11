import HttpStatuses from "../helpers/http_statuses.js";
import Response from "../helpers/response.js";
import isValidObjectId from "./validators/validateObjectId.js";


export const validateObjectIds = function(req, res, next) {
 let error = [],
 queries = req.query,
 params = req.params;

 const _queries = [],
 _params = [],
 _qError=[],
 _pError=[];

 Object.keys(queries).forEach((key, i) => _queries.push({name: `${key}=${queries[key]}`, id: queries[key]}))
 Object.keys(params).forEach((key, i) => _params.push({name: `${key}=${params[key]}`, id: params[key]}))


for (let data of _queries) {
 if(data.id) if(!isValidObjectId(data.id)) _qError.push(data.name)
}
for (let data of _params) {
 if(data.id) if(!isValidObjectId(data.id)) _pError.push(data.name)
}

if(_pError.length) error.push(`Invalid ObjectId(s) in the following request params:  ${_pError.join(", ")}`);
if(_qError.length) error.push(`Invalid ObjectId(s) in the following request query: ${_qError.join(", ")}`);

if(_qError.length && _pError.length) error.push(`Invalid ObjectId(s) in the following request query: ${_qError.join(", ")} and Params:  ${_pError.join(", ")}`);

if(error.length)  Response.error(res, error, HttpStatuses.statusBadRequest)
else next()
}