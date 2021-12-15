
import request from "@/helpers/fetchWrapper";
import { GET_TAXONOMY, UPDATE_TAXONOMY } from "@/utils/const";

export const SAVE_NEW_ACTIVITY = async (data) =>{
  const url = data.id ? `${UPDATE_TAXONOMY}activities`
  : `${UPDATE_TAXONOMY}activities/${data.id}`;
  await request()
}


let globalFloorActivities = [];
export let globalSettings = {};

export const setGlobalSettings = (settings) => {
  globalSettings = {...settings.acf}
}

export const computeTotalProposal = (proposal, floorActivities) => {
  let totalHeader = getTotalHeader(proposal)
  globalFloorActivities = floorActivities 
  let totalActivities = getTotalFloorActivities(proposal, floorActivities)
  let totalRoomActivities = getTotalRoomActivities(proposal)

  return parseFloat(totalHeader + totalRoomActivities + totalActivities).toFixed(2)
}


const getTotalHeader = (proposal) => {
  if (proposal?.acf === undefined) return 0
  const dayCleaned = proposal.acf.days_clean?.length || 0
  const daysCleanerRate = parseInt(proposal.acf.day_cleaner_rate) || 1
  const hours = parseInt(proposal.acf.hours) || 0
  const totalDaysClean = (dayCleaned * hours) * daysCleanerRate 

  return totalDaysClean * 52 / 12
}

function getSum(total, num) {  
  return total + Math.round(num);
}

const getTotalFloorActivities = (proposal) => {

  let runningTotal = 0

  if (proposal === null) return 0
  if (proposal.acf.levels === undefined) return 0

  proposal.acf.levels.forEach(level => {
    
    if (level.floor_activities === undefined || 
      level.floor_activities === false ||
      level.floor_activities.length === 0
      ) return 0

    runningTotal += level.floor_activities.map(a=>getFloorActivityRate(a.activity, a.area )).reduce( 
      (a, b) =>  {
        return getSum(a,b)
      }
    , 0)
    
  });

  return  Math.round(runningTotal * 52 / 12)
}


const getTotalRoomActivities = (proposal) => {
  let runningTotal = 0
  let weeklyRunningTotal = 0

  
  if (proposal.acf.levels === undefined) return 0

  proposal.acf.levels.forEach(level => {
    
    if (level.rooms === undefined || level.rooms === false) return 0

    
      let totalWeeklyDailyArray = []
      level.rooms.forEach( room => {
        if(room.activities === false) return 0

        let rate = 0
        
        totalWeeklyDailyArray = room.activities.map(a => {
          
          let totalActivityFreq = getRoomActivityFreqRate(a, proposal)

          let activityRate = parseInt(a?.rate);
          rate = activityRate ? activityRate :  parseInt(globalSettings.rate) 

          let totalWeek = a.weeks.length * rate;
          
          if (a.quantity === 0 || a.quantity === undefined) {
            return 0
          }

          let timeTo = a.time_to_perform_task?.split(':') || 0
          let totalHrs = ( parseInt(timeTo[0]) || 0 )+ ( ( parseInt(timeTo[1]) || 0) / 60 ) + ( (parseInt(timeTo[2]) ||0) / 60 / 60 )
          
          let totalAmt = totalActivityFreq *  parseInt(a.quantity) * totalHrs
          console.log(totalAmt + totalWeek, "total activty")
          return totalAmt + totalWeek

        }) || []

        runningTotal += totalWeeklyDailyArray.reduce( 
          (a, b) =>  {
            return getSum(a,b)
          }
        , 0)

      })
  });

  return runningTotal
}

const getFloorActivityRate = (activity, area) => {
  function computeArea(fn) {
    return new Function('return ' + fn)();
  }

  if (activity === null) return 0;

  const foundActivity = globalFloorActivities?.find(a => a.term_id = activity.term_id) || -1;

  if (!foundActivity || foundActivity === -1) return 0

  const formula = foundActivity.acf.calculation.replace('=','').replace("Area",area)
  
  return computeArea(formula)

}

const getRoomActivityFreqRate = (activity, proposal) => {

  const countWeekdays = activity.frequency.filter( a => parseInt(a) < 5)
  const countSunday = activity.frequency.filter( a => parseInt(a) === 7)
  const countSaturday = activity.frequency.filter( a => parseInt(a) === 6)

  const proposalRate = parseInt(proposal.acf.rate) || 0;
  const proposalSatRate = parseInt(proposal.acf.saturday_rate) || 0;
  const proposalSunRate = parseInt(proposal.acf.sunday_rate) || 0;

  console.log(proposalRate, proposal, 'proposal rate')

  let activityRate = parseInt(activity?.rate);
  const rate = activityRate ? activityRate : proposalRate > 0 ? proposalRate : parseInt(globalSettings.rate) 

  let totalSunday = 0
  let totalSat = 0
  let totalWeeks = 0

  if (countSunday.length > 0 ){
    const sunRate = proposalSunRate > 0 ? proposalSunRate : parseInt(globalSettings.sunday_rate) || 0
    totalSunday = sunRate === 0 ? rate * 1 : sunRate * 1
    totalSunday = totalSunday * 52 / 12
  }

  if (countSaturday.length > 0 ){
    const satRate =  proposalSatRate > 0 ? proposalSatRate : parseInt(globalSettings.saturday_rate) 
    totalSat = satRate === 0 ? rate * 1 : satRate * 1
    totalSat = totalSat * 52 / 12
  }

  if (countWeekdays.length > 0 ){    
    totalWeeks =rate * countWeekdays.length
    totalWeeks = totalWeeks * 52 / 12
  }
  return totalSunday + totalSat + totalWeeks
}

// const getWeeklyTotalActivity = activity