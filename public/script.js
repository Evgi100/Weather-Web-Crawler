var currentCity;
var userCities=[];
var currentDate = new Date();

function grabDate(){
     
}

function convert(data){
   return Math.round(data-273.15)
}

// {{temp.temp-273.15}} °C / {{1.8 x (temp.temp-273.15) + 32}}
function fetch(currentCity) {
    $.get({
        url: 'http://api.openweathermap.org/data/2.5/weather?q=' + currentCity + '&APPID=2c7ca9a42dca75e244be247891827ee1',
        success: function (data) {
            //update the userData using API data
            console.log(data);
            var city={
                name:data.name,
                temp: data.main,
                currentCel:convert(data.main.temp),
                currentFar:Math.round((data.main.temp-273.15)*1.8+32),
                minTempC:Math.round(data.main.temp_min-273.15),
                maxTempC:Math.round(data.main.temp_max-273.15),
                minTempF:Math.round((data.main.temp_min-273.15)*1.8+32),
                maxTempF:Math.round((data.main.temp_max-273.15)*1.8+32),
                description:data.weather,
                sys:data.sys,  
                comments:[], 
                date:currentDate.getDate()
            }
            userCities.push(city);
            _renderCityTemps(userCities);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
}

function grabUserData() {
    currentCity = $("#userInput").val();
    $("#userInput").val('');
    
}

function _renderCityTemps(userCities){
    $('.postCities').empty();
    var source = $('#store-template').html();
    var template = Handlebars.compile(source);
    
    userCities.forEach(function(city){
        var newHTML = template(city);
        $('.postCities').append(newHTML);
    });
}

function createComment(postIndex, newComment) {
    if (newComment) {
        userCities[postIndex].comments.push(newComment);
        renderComments(postIndex);
        // _renderCityTemps(userCities);

    }
    else {
        alert('theres no text in yours comment');
    }
}

function renderComments(postIndex) {
    // var $comments = $('.post').indexOf(postIndex);
    var $comments = $('.comments').eq(postIndex)

    $comments.empty();

    userCities[postIndex].comments.forEach(function (comment) {
        $comments.append('<div class = "row"><button type="button" class="btn btn-circle">\
    </button><div class="postComment col-lg-6">' + comment + '\
    </div><button class="btn btn-xs btn-danger col-lg-6 glyphicon glyphicon-trash deleteComment"></button></div>');

    });

}

$('.postCities').on('click','.commentButton', function(){
   var commentText = $(this).offsetParent().siblings('input').val();
   $(this).offsetParent().siblings('input').val('');

    var postIndex = $('.commentButton').index($(this));

    createComment(postIndex, commentText);
});


$("#search").on('click', function () {
    grabUserData();
    fetch(currentCity);
})

var userinput = document.getElementById("userInput");
var autocomplete = new google.maps.places.Autocomplete(userinput);