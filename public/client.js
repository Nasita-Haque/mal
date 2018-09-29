$(document).ready(() => {
  let state = {songs: []}
  
  //Retrieve seasonal data
  $("#search-button").click((e) => {
    e.preventDefault()
    let searchTerm = $("#search-term").val().split(/\s+/)
    
    const checkSearchTerm = (term) => {
      //Checks to remove extra white space
      let result = false
      let seasons = ['spring', 'summer', 'fall', 'winter']
      
      //conditions
      let seasonValid = seasons.includes(term[0].toLowerCase()) 
      let yearValid = typeof (parseInt(term[1])) === "number"
      seasonValid && yearValid? result = true : null
      
      return result
    }
    
    if(checkSearchTerm(searchTerm)){
      $.ajax({
        url: `search/${searchTerm[1]}/${searchTerm[0]}`,
        type: "GET",
        data: "data",
        dataType: "json",
        success: (data) => {
          console.log('DATA =>', data)
          state.songs.push(data)
        }
      });
      
    } else {
      alert('Did not work! Try again!')
    }
    
  });
  
  if(state.songs.length > 0) {
    state.songs.map((anime) => {
      $(`<div>${anime.title}</div>`).appendTo('#song-container');
    })
  }
})