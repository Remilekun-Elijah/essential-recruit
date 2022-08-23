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
	} catch (error) {
		console.error(
			`an error occurred while loading migration data: ${error.message}`,
		);
	}
}
