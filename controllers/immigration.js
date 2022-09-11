import HttpStatuses from '../helpers/http_statuses.js';
import Response from '../helpers/response.js';
import catchAsyncError from '../helpers/catch_async_error.js';
import Immigration from '../models/immigration.js';
import Airtable from 'airtable';

Airtable.configure({
 apiKey: process.env.AIRTABLE_API_KEY,
 endpointUrl: 'https://api.airtable.com',
})

const airtable = Airtable.base(process.env.AIRTABLE_BASE)

export default class ImmigrationController {
 static createOne() {
  return catchAsyncError(async function (req, res, next) {
   const immigrant = await Immigration.findOne({owner: req.user.id})

   if(immigrant) {
    Response._sendResponse(res, 409, 'User has already completed the Immigration process');
   } else {
    const data = await Immigration.create({
     owner: req.user.id,
     fullName: req.body.fullName,
     gender: req.body.gender,
     nationality: req.body.nationality,
     hasPassport: req.body.hasPassport,
     passportExpiry: req.body.passportExpiry,
     dob: req.body.dob,
     maritalStatus: req.body.maritalStatus,
     kidsCount: req.body.kidsCount,
     countryOfBirth: req.body.countryOfBirth,
     countryOfResidence: req.body.countryOfResidence,
     occupation: req.body.occupation,
     proofOfFund: req.body.proofOfFund,
     testTaken: req.body.testTaken,
     jobOffer: req.body.jobOffer,
     hasCanadaFriend: req.body.hasCanadaFriend,
     canadaFriendProvince: req.body.canadaFriendProvince,
     hasCriminalOffence: req.body.hasCriminalOffence,
     hasMedicalProblem: req.body.hasMedicalProblem,
     countriesLivedIn: req.body.countriesLivedIn,
     hasCanadaVisaDenial: req.hasCanadaVisaDenial
    })

    airtable('Table 1').create({
     "Full Name": data.fullName,
     "Gender": data.gender,
     "Occupation": data.occupation,
     "Nationality": data.nationality.nationality,
     "Has Passport": data.hasPassport?"Yes":"No",
     "Passport Expiry": data.passportExpiry,
     "Date Of Birth": data.dob,
     "Kids": data.kidsCount,
     "Country Of Birth": data.countryOfBirth.location,
     "Country Of Residence": data.countryOfResidence.location,
     "Proof Of Fund": data.proofOfFund,
     "English Test": data.testTaken.filter(data=>data.actualTest.lang==="English").map(data=>data.actualTest.test)[0],
     "English Test Expiry": data.testTaken.filter(data=>data.actualTest.lang==="English").map(data=>data?.expiry)[0],
     "French Test": data.testTaken.filter(data=>data.actualTest.lang==="French").map(data=>data.actualTest.test)[0],
     "French Test Expiry": data.testTaken.filter(data=>data.actualTest.lang==="French").map(data=>data?.expiry)[0],
     "Has Worked In Canada": data.jobOffer[0].fromCanada?"Yes":"No",
     "Role Played":  data.jobOffer[0].role,
     "Employers Province":  data.jobOffer[0].employerProvince.province,
     "Family/Friend In Canada":  data.hasCanadaFriend?"Yes":"No",
     "Family/Friend Province": data.canadaFriendProvince.province,
     "Criminal Offense": data.hasCriminalOffence?"Yes":"No",
     "Immigrant/Family has medical issue": data.hasMedicalProblem?"Yes":"No",
     "Past Six months Countries Lived In": data.countriesLivedIn.map(data=>data.location).join(", "),
   }, function(err, record) {
     if (err) {
       console.error(err);
       return;
     }
     console.log(record.getId());
   });

    Response.OK(res, "Immigration data submitted successfully", data, HttpStatuses.statusCreated)
   }
  })
  }

  static getImmigration() {
   return catchAsyncError(async function (req, res, next) {
    const data = await Immigration.find({})
    Response.OK(res, "Immigration data retrieved successfully", data)
   })
  }
 }
 