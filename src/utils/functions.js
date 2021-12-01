
import request from "@/helpers/fetchWrapper";
import { GET_TAXONOMY, UPDATE_TAXONOMY } from "@/utils/const";

export const SAVE_NEW_ACTIVITY = async (data) =>{
  const url = data.id ? `${UPDATE_TAXONOMY}activities`
  : `${UPDATE_TAXONOMY}activities/${data.id}`;
  await request()
}

export const computeTotalProposal = (proposal) => {
  let totalHeader = getTotalHeader(proposal)
  let totalActivities = getTotalFloorActivities(proposal)
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

const getTotalFloorActivities = (proposal) => {
  let runningTotal = 0
  return runningTotal
}

const getTotalRoomActivities = (proposal) => {
  let runningTotal = 0
  return runningTotal
}