# Task checklist

add .env to base folder with:
REACT_APP_MAP_KEY=YOUR_GOOGLE_KEY
REACT_APP_511_API=YOUR_511_KEY

## Basic Function

- [ * ] get 511 API

  - [ * ] get bus lists, real-time location, stops, routes,
  - [ * ] bus locations
  - [ * ] bus real time location
  - [ ] calculate speed

- google map js API
  - [ * ] route function
  - [ * ] icon function

### Connect 511 & map

1. use context Hook
2. click bus -> map show route, bus location.
   1. Add bus table
   2. button on dashboard dispatch mapState
   3. click table on dashboard dispatch mapState
   4. add real-time-bus location
   5. add bus icon
3. calculate speed between stops.
   1. distance
   2. timeline

### [ ] UI design

### [ ] add localstorage
