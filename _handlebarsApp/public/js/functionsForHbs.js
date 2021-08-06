function saveAnEvent (eventId) {
    return function(event){
        axios.post(`/event/${eventId}/fav`)
        console.log("id: ", eventId)
        console.log("save button clicked!!")
    }
}
    