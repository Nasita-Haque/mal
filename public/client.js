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
        console.log('DATA =>', data)
      }
    });
  });
})