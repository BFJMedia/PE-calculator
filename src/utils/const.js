//export const API_DOMAIN = 'http://localhost:8013/'
export const API_DOMAIN = 'https://hallowed-mind.flywheelstaging.com/'
//export const API_DOMAIN = 'https://planetearthcleaning.com.au/'
export const API_URL = `${API_DOMAIN}wp-json/`
export const PE_URL = `${API_URL}planet-earth/v1`
export const WP_URL = `${API_URL}wp/v2`
export const ACF_URL = `${API_URL}acf/v3`
export const SETTINGS_URL = `${PE_URL}/settings`
export const UPDATE_SETTINGS_URL = `${ACF_URL}/settings/`
export const LOGIN_URL = `${API_URL}jwt-auth/v1/token`
export const USER_ACCESS_URL = `${API_URL}jwt-auth/v1/access`
export const GET_TAXONOMY = `${WP_URL}/`
export const UPDATE_TAXONOMY = `${PE_URL}/taxonomy/`
export const DELETE_TAXONOMY = `${PE_URL}/taxonomy/`
export const PE_PROPOSALS = `${WP_URL}/proposals`
export const UPDATE_PROPOSAL_FIELD = `${ACF_URL}/proposals/`
export const PROPOSAL_PDF = `${PE_URL}/proposals/pdf`

export const DAY_OPTIONS = [
  [1, "M"],
  [2, "T"],
  [3, "W"],
  [4, "T"],
  [5, "F"],
  [6, "S"],
  [7, "S"],
]

export const WEEK_OPTIONS =  [
  [1, "Week 1"],
  [2, "Week 2"],
  [3, "Week 3"],
  [4, "Week 4"]
]

export const DEFAULT_ACTIVITY = {
  activity: {},
  frequency: [],
  weeks: [],
  pre_selected: false,
  time_to_perform_task: [0,0,0],
  text_to_display: '',
  quantity: 0,  
}

export const DEFAULT_ROOM = {
  room_name: {},
  activities: []
}

export const DEFAULT_LEVEL = {
  floor_activities: [],
  level: {  term_id: 0 },
  rooms: [
    { 
      room_name: {}, 
      activities: [] 
    }
  ]
}

export const DEFAULT_FLOOR_ACTIVITY = {
  activity: 0,
  area: 0,
  frequency: [],
  default: true
}