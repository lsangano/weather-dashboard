var APIKey          = "b14277c14bfd1b77e1431a35b989db61"
let cardRow         = $(".card-row");
var searchTerm      = $("#searchTermBox");
let citySearch      = searchTerm.val().trim();
//Find search term to be displayed and store it to local storage

function displayWeather(event) {
    event.preventDefault();
    if (searchTerm.val().trim() !==""){
        city=searchTerm.val().trim();
        currentWeather(city);
        
    var newQuery = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + APIKey;
    fetch (newQuery)
    .then(weather=> {
    return weather.json()
    }).then(city)

   
  if (typeof(Storage) !== "undefined") {
    // Store
    let list = [];
    let cityItems = document.createElement("li");
    list.push("<li>JSON.stringify(city)<li>");
    localStorage.setItem("list", JSON.stringify(city));
    document.getElementById("newList").appendChild(cityItems); 
    // Retrieve
    document.getElementById("newList").innerHTML = JSON.parse(localStorage.getItem("list"));
} else {
    document.getElementById("newList").innerHTML = "Sorry, your browser does not support Web Storage...";
        }
    

    

    
    }
};

function createList () {
    var listItems = $("<li>"+citySearch.toUpperCase()+"</li>");
    $(listItems).attr("class","list-group");
    $(".list-group").append(listItems)
}
//Get current weather to appear in HTML
function currentWeather(city) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + APIKey; 
    var citySearch = city; 
    $.ajax({
        url:queryURL,
        method: "GET",
    }).then(function(weather){

        const today = moment().format("MMM Do YYYY"); 
        document.getElementById("time").innerHTML = today;
        //Display contents to HTML
        let city = document.querySelector('.city');
        city.innerText = `${weather.name}`;

     
        let locationIcon = document.querySelector('.imageLogo'); 
        const iconImage = weather.weather[0].icon;
        locationIcon.innerHTML = `<img src="http://openweathermap.org/img/wn/${iconImage}.png"/>`;
     
        let temperature = document.querySelector('#temperatureAPI');
        temperature.innerHTML = `${Math.round(weather.main.temp)}<span>°F</span>`;
     
        let humidity = document.querySelector('#humidityAPI');
        humidity.innerHTML = `${(weather.main.humidity)}<span>%</span>`;  
        
        let windSpeed = document.querySelector('#windSpeedAPI');
        windSpeed.innerText = weather.wind.speed;
        //Call UVIndex function
        UVIndexx(weather.coord.lon,weather.coord.lat);
        
        
        //5 Day Forcast 
        var forcastQuery = "https://api.openweathermap.org/data/2.5/forecast?q=" + citySearch + "&units=imperial&appid=" + APIKey; 
            $.ajax({
                url:forcastQuery,
                method:"GET"
            }).then(function(weather){
            //Loop contents for all 5 days in the forcast
                for (i=0;i<5;i++){
                    var iconcode= weather.list[((i+1)*8)-1].weather[0].icon;
                    var iconurl="https://openweathermap.org/img/wn/"+iconcode+".png";
                    var tempF= Math.round(weather.list[((i+1)*8)-1].main.temp);
                    var humidity= weather.list[((i+1)*8)-1].main.humidity;
                    //Display contents to particular elements in HTML

                
                    $("#forcastImage"+i).html("<img src="+iconurl+">");
                    $("#forcastTemperature"+i).html(tempF+"°F");
                    $("#forcastHumidity"+i).html(humidity+"%");
                }
                //Dates for each day in 5 day forcast
                var date = moment().add(1,'day').format("MMM Do YYYY"); 
                document.getElementById("date0").innerHTML = date;

                var dateOne = moment().add(2,'day').format("MMM Do YYYY"); 
                document.getElementById("date1").innerHTML = dateOne;

                var dateTwo = moment().add(3,'day').format("MMM Do YYYY"); 
                document.getElementById("date2").innerHTML = dateTwo;

                var dateThree = moment().add(4,'day').format("MMM Do YYYY"); 
                document.getElementById("date3").innerHTML = dateThree;

                var dateFour = moment().add(5,'day').format("MMM Do YYYY"); 
                document.getElementById("date4").innerHTML = dateFour;


            });

    })
} 
//Get the UV Index from the lat and long
function UVIndexx(long,lat){
    //URL for the UV Index
    var uvqURL="https://api.openweathermap.org/data/2.5/uvi?lat="+ lat + "&lon=" + long +  "&appid=69b49d9a8462f9c7fe09dc87b6f1c4c2"; 
    $.ajax({
            url:uvqURL,
            method:"GET"
            }).then(function(weather){
                $('#UVIndexAPI').html(weather.value);
            }).then(function changeInputColor(weather){
                var UVChange =$('#UVIndexAPI').removeClass();
                if (UVChange <=3){
                    $('#UVIndexAPI').addClass('low-risk');
                }
                else if(UVChange >= 6 && value <= 8){
                    $('#UVIndexAPI').addClass('medium-risk');
                }
                else{
                    $('#UVIndexAPI').addClass('high-risk');
                }
            });
           
}

   
            




//Search button eventlistener 
$(".searchBtn").on("click",displayWeather);
