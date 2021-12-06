
import request from "@/helpers/fetchWrapper";
import { GET_TAXONOMY, UPDATE_TAXONOMY } from "@/utils/const";

export const SAVE_NEW_ACTIVITY = async (data) =>{
  const url = data.id ? `${UPDATE_TAXONOMY}activities`
  : `${UPDATE_TAXONOMY}activities/${data.id}`;
  await request()
}


let globalFloorActivities = [];

export const computeTotalProposal = (proposal, floorActivities) => {
  let totalHeader = getTotalHeader(proposal)
  globalFloorActivities = floorActivities 
  let totalActivities = getTotalFloorActivities(proposal, floorActivities)
  let totalRoomActivities = getTotalRoomActivities(proposal)

  return totalHeader + totalRoomActivities + totalActivities
}


const getTotalHeader = (proposal) => {
  if (proposal.acf === undefined) return 0
  const dayCleaned = proposal.acf.days_clean?.length || 0
  const daysCleanerRate = parseInt(proposal.acf.day_cleaner_rate) || 1
  const hours = parseInt(proposal.acf.hours) || 0
  const totalDaysClean = (dayCleaned * hours) * daysCleanerRate 

  return totalDaysClean
}

function getSum(total, num) {  
  return total + Math.round(num);
}

const getTotalFloorActivities = (proposal) => {

  let runningTotal = 0

  proposal.acf.levels.forEach(level => {
    
    if (level.floor_activities === undefined || level.floor_activities === false) return 0

    runningTotal += level.floor_activities.map(a=>getFloorActivityRate(a.activity, a.area )).reduce( 
      (a, b) =>  {
        return getSum(a,b)
      }
    )
    
  });

  return  Math.round(runningTotal)
}

const getTotalRoomActivities = (proposal) => {
  let runningTotal = 0
  return runningTotal
}

const getFloorActivityRate = (activity, area) => {
  function computeArea(fn) {
    return new Function('return ' + fn)();
  }

  const foundActivity = globalFloorActivities.find(a => a.term_id = activity.term_id);

  if (!foundActivity) return 0

  const formula = foundActivity.acf.calculation.replace('=','').replace("Area",area)
  console.log(computeArea(formula), "total same", activity)
  return computeArea(formula)

}