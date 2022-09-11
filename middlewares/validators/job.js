import joi from 'joi';
import isValidObjectId from './validateObjectId.js';

export const editJobSchema = joi.object().keys({
 companyLogo: joi.string().label("Company Logo"),
 title: joi.string().label("Job Title"),
 experienceLevel: joi.number().label("Experience Level"),
 specialties: joi.array().items({
  specialty: joi.string().label('Specialty id'),
  yearsOfExperience: joi.number().label('Years of experience').min(1).max(10)
 }).min(0).max(10).label("Must-have specialties"),
 otherSpecialties: joi.array().items({
  specialty: joi.string().label('Specialty id'),
  yearsOfExperience: joi.number().label('Years of experience').min(1).max(10)
 }).min(0).max(10).label("Nice-to-have specialties"),
 numberOfHires: joi.number().label("Number of hires"),
 description: joi.string().label('Job Description'),
 responsibility: joi.string().label("Job Responsibilities"),
 location: joi.string().label("Job Location"),
 domainUrl: joi.string().label("Domain Url"),
 requiredLanguage: joi.array().items({
  language: joi.string(),
  fluency: joi.string().valid('fluent', 'intermediate', 'basic')
 }).min(0).max(5).label("Required Language"),
 salaryRange: joi.object({
  min: joi.number(),
  max: joi.number()
 }),
 benefits: joi.array().items(joi.string()),
 status: joi.number().valid(0).allow("",null)
})

export const createJobSchema = joi.object().keys({
 companyLogo: joi.string().label("Company Logo"),
 title: joi.string().label("Job Title").required(),
 experienceLevel: joi.number().label("Experience Level").required(),
 specialties: joi.array().items({
  specialty: joi.string().label('Specialty id').required(),
  yearsOfExperience: joi.number().label('Years of experience').min(1).max(10).required()
 }).min(0).max(10).label("Must-have specialties").required(),
 otherSpecialties: joi.array().items({
  specialty: joi.string().label('Specialty id'),
  yearsOfExperience: joi.number().label('Years of experience').min(1).max(10)
 }).min(0).max(10).label("Nice-to-have specialties"),
 numberOfHires: joi.number().label("Number of hires"),
 description: joi.string().label('Job Description').required(),
 responsibility: joi.string().label("Job Responsibilities").required(),
 location: joi.string().label("Job Location").required(),
 domainUrl: joi.string().label("Domain Url"),
 requiredLanguage: joi.array().items({
  language: joi.string().required(),
  fluency: joi.string().valid('fluent', 'intermediate', 'basic').required()
 }).min(0).max(5).label("Required Language").required(),
 salaryRange: joi.object({
  min: joi.number(), 
  max: joi.number()
 }).required(),
 benefits: joi.array().items(joi.string())
})

export const validateSchema = schema => {
 return async (req, res, next) => {
 const {
  location,
  requiredLanguage,
  specialties,
  otherSpecialties
 } = req.body,
 owner = req.user.id

	try {
  req.body.companyLogo = req.file?.path;
  
  const objectIds = [{id: location, name: "location"}]
  requiredLanguage?.forEach((d, i) => d.language ? objectIds.push({id: d.language, name: `requiredLanguage[${i}]`}) : null)
  specialties?.forEach((d, i) => d.specialty ? objectIds.push({id: d.specialty, name: `specialties[${i}]`}) : null)
  otherSpecialties?.forEach((d, i) => d.specialty ? objectIds.push({id: d.specialty, name: `otherSpecialties[${i}]`}) : null)
  
  let errors = []
  
  for( let object of objectIds) {
   console.log(object.id);
   if(object.id) if(!isValidObjectId(object.id)) errors.push(object.name)
  }
  
  if(errors.length) {
   res.status(422).json({
    status: 'fail',
    code: 422,
    message: `${errors.join(', ')} have invalid ObjectId(s)`
   })
  }else {
   await schema.validateAsync(req.body);
   req.body = {...req.body, owner}
    next()

   } 
} catch (err) {
 if (err.details) {
  res.status(422).json({
   status: 'fail',
   code: 422,
   message: err.details[0].message
  })
 } else {
  next(err)
 }
}
}
}