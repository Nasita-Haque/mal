// client-side js
// run by the browser each time your view template is loaded
$(document).ready(() => {
  let state = {}
  //Post seasonal data info
//   document.getElementById("season-info").addEventListener("click", () => {
    
//   })
  
  //Retrieve seasonal data
  document.getElementById("search-button").addEventListener("click", () => {
    $.ajax({
      url: "search",
      type: "GET",
      data: "data",
      dataType: "json",
      success: (data) => {
        // let songs = data["anime"]
        console.log('DATA =>', data)
        // let filterTV = songs.filter((anime) => anime["type"] === "TV")
        // let tv = filterTV.map((anime) => {title: , image_url:})
        // console.log('TEMP', tv)
      }
    });
  });
})