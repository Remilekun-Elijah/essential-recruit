export const JobStatuses = {
 drafted: 0,
 published: 1,
 deleted: 2
}

export const getJobStatusString = num => {
 let output;
 switch(num) {
  case JobStatuses.published: output = 'Published'
  break;
  case JobStatuses.drafted: output = "Drafted"
  break;
  case JobStatuses.deleted: output = "Deleted"
  break;
 }
 return output;
} 