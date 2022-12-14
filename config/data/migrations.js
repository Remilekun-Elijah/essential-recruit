import fetch from 'node-fetch';

import * as data from './data.js';

import RelocationIdealTimeline from '../../models/Application/relocationIdealTimeline.js';
import JobSearchStage from '../../models/Application/jobSearchStage.js';
import CountryLocation from '../../models/Application/countryLocation.js';
import CanadaProvince from '../../models/Application/canadaProvince.js';
import WorkConcern from '../../models/Application/workConcern.js';
import EducationLevel from '../../models/Application/educationLevel.js';
import Certification from '../../models/Application/certification.js';
import SpokenLanguage from '../../models/Application/language.js';
import Specialty from '../../models/Application/specialty.js';
import ApplicationStage from '../../models/Application/applicationStage.js';
import Nationality from '../../models/Immigration/nationality.js';
import MaritalStatus from '../../models/Immigration/maritalStatus.js';
import Test from '../../models/Immigration/test.js';
import VisaType from '../../models/Immigration/visaType.js';


async function loadRelocationIdealTimeline() {
	if (!(await RelocationIdealTimeline.estimatedDocumentCount())) {
		await RelocationIdealTimeline.insertMany(
			data.relocationIdealTimeline.map(timeline => {
				return { timeline };
			}),
		);
	}
}

async function loadJobSearchStage() {
	if (!(await JobSearchStage.estimatedDocumentCount())) {
		await JobSearchStage.insertMany(
			data.jobSearchStage.map(stage => {
				return { stage };
			}),
		);
	}
}

async function loadNationalities() {
	if(!(await Nationality.estimatedDocumentCount())) {
		await Nationality.insertMany(
			data.nationality.map(nationality => {
				return { nationality }
			})
		)
	}
}

async function loadMaritalStatus() {
	if(!(await MaritalStatus.estimatedDocumentCount())) {
		await MaritalStatus.insertMany(
			data.maritalStatus.map(status => {
				return { status }
			})
		)
	}
}

async function loadTestData() {
	if(!(await Test.estimatedDocumentCount())) {
		await Test.insertMany(
			data.testData.map(data => data)
		)
	}
}

async function loadVisaType() {
	if(!(await VisaType.estimatedDocumentCount())) {
		await VisaType.insertMany(
			data.visaType.map(type => {
				return { type }
			})
		)
	}
}

async function loadCountryLocations() {
	if (!(await CountryLocation.estimatedDocumentCount())) {
		const locations = await (
			await fetch('https://restcountries.com/v3.1/all?fields=name')
		).json();
		await CountryLocation.insertMany(
			locations.map(location => {
				return { location: location.name.common };
			}),
		);
	}
}

async function loadCanadaProvinces() {
	if (!(await CanadaProvince.estimatedDocumentCount())) {
		await CanadaProvince.insertMany(
			data.canadaProvinces.map(province => {
				return { province };
			}),
		);
	}
}

async function loadWorkConcerns() {
	if (!(await WorkConcern.estimatedDocumentCount())) {
		await WorkConcern.insertMany(
			data.workConcerns.map(concern => {
				return { concern };
			}),
		);
	}
}

async function loadEducationLevels() {
	if (!(await EducationLevel.estimatedDocumentCount())) {
		await EducationLevel.insertMany(
			data.educationLevels.map(({ level, desc }) => ({
				educationLevel: level,
				levelDescription: desc,
			})),
		);
	}
}

async function loadCertifications() {
	if (!(await Certification.estimatedDocumentCount())) {
		await Certification.insertMany(
			data.certifications.map(({ cert, desc }) => ({
				certification: cert,
				certificationDescription: desc,
			})),
		);
	}
}

async function loadSpokenLanguages() {
	if (!(await SpokenLanguage.estimatedDocumentCount())) {
		await SpokenLanguage.insertMany(
			data.spokenLanguages.map(language => ({ language })),
		);
	}
}

async function loadSpecialties() {
	if (!(await Specialty.estimatedDocumentCount())) {
		await Specialty.insertMany(
			data.specialties.map(specialty => ({ specialty })),
		);
	}
}

async function loadApplicationStages() {
	if (!(await ApplicationStage.estimatedDocumentCount())) {
		await ApplicationStage.insertMany(
			data.applicationStages.map(stage => ({ applicationStage: stage })),
		);
	}
}

export default async function loadMigrationData() {
	try {
		await loadRelocationIdealTimeline();
		await loadJobSearchStage();
		await loadCountryLocations();
		await loadCanadaProvinces();
		await loadWorkConcerns();
		await loadEducationLevels();
		await loadCertifications();
		await loadSpokenLanguages();
		await loadSpecialties();
		await loadApplicationStages();
		await loadNationalities();
		await loadMaritalStatus();
		await loadTestData();
		await loadVisaType();
	} catch (error) {
		console.error(
			`an error occurred while loading migration data: ${error.message}`,
		);
	}
}
