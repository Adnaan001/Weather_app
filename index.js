
const APIKEY='efa6f9078f6f2c8f00815e89dfaaa21a';

// for current loc data api link is 
// https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={APIKEY}

// for diff city api link is
// https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={APIKEY}

let your_weather=document.querySelector('#head_p1');
let search_weather=document.querySelector('#head_p2');
let access_granted=false;
let loading_screen=document.querySelector('#loader');
let e404=document.querySelector(".e404");

let current_tab=your_weather;
current_tab.classList.add('active_border');

your_weather.addEventListener('click',()=>{
    search(your_weather);
})

search_weather.addEventListener('click',()=>{
    search(search_weather);
})


let search_bar=document.querySelector('#search_bar');
let permission=document.querySelector('#grant_location');
let your_data=document.querySelector('#your_data');
// let city_data=document.querySelector('#city_data');
let search_icon=document.querySelector(".search_icon");
show_your_data();
function search(clicked_tab)
{
    if(current_tab!==clicked_tab)
    {
        current_tab.classList.remove('active_border');
        current_tab=clicked_tab;
        clicked_tab.classList.add('active_border');
        if(!(search_bar.classList.contains('active')))
        {
            permission.classList.remove('active');
            your_data.classList.remove('active');
            e404.classList.remove('active');
            your_data.setAttribute("style","top:40px;");
            search_bar.classList.add('active');
        }
        else
        {
            show_your_data();
        }
    }
}
let search_data=document.querySelector('#search_data');
search_bar.addEventListener('submit',(e)=>{
    e.preventDefault();
    let city=search_data.value;
    console.log(city);
    if(city==='')
        return;
    else
        show_search_data(city);
})


async function show_search_data(val)
{
    try
    {
        e404.classList.remove('active');
        loading_screen.classList.add('active');
        let res=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${val}&appid=${APIKEY}`);
        let data=await res.json();
        loading_screen.classList.remove('active');
        console.log(data);
        get_data(data);
        your_data.classList.add('active');
    }
    catch(e)
    {
        console.log('city not found=>',e);
        your_data.classList.remove('active');
        e404.classList.add('active');
    }
}

let permission_button=document.querySelector('#permission_button');

permission_button.addEventListener('click',get_location);

function get_location()
{
    if(navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(getposition);
    }
    else
    {
        document.body.innerHTML='CaNt AcCeSs LoCaTiOn';
    }
}

function getposition(position)
{
    let User_coords={
        lat:position.coords.latitude,
        lon:position.coords.longitude
    }
    sessionStorage.setItem('user-coordinates',JSON.stringify(User_coords));
    show_your_data();
}

let namee=document.querySelector('.name');
let city=document.querySelector('.city_img');
let desc=document.querySelector('.climate');
let icon=document.querySelector('.icon');
let temp=document.querySelector('.reading');
let wind_speed=document.querySelector('.w_speed');
let humidity=document.querySelector('.humidity');
let clouds=document.querySelector('#clouds');

async function show_your_data()
{
    your_data.setAttribute("style","top:-20px;");
    const location=sessionStorage.getItem('user-coordinates');
    // console.log(location);
    if(!location)
    {
        e404.classList.remove('active');
        search_bar.classList.remove('active');
        permission.classList.add('active');
    }
    else
    {
        const loc_coords=JSON.parse(location);
        const {lat,lon}=loc_coords;
        // console.log('lat=',lat,'long=',lon)
        e404.classList.remove('active');
        permission.classList.remove('active');
        search_bar.classList.remove('active');
        loading_screen.classList.add('active');
        try
        {
            let res=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKEY}`);
            let data=await res.json();
            loading_screen.classList.remove('active');
            get_data(data);
        }
        catch(e)
        {
            console.log("error in fetching data=>",e);
        }
    }

}

function get_data(data)
{
    console.log("get data is called")
    console.log("data is",data);
    namee.innerHTML=data?.name;
    city.src=`https://flagcdn.com/16x12/${data?.sys?.country?.toLowerCase()}.png`
    desc.innerHTML=data?.weather[0]?.description;
    icon.src=`https://openweathermap.org/img/wn/${data?.weather[0]?.icon}.png`
    temp.innerHTML=`${Math.floor(data?.main?.temp-273.15)}°C`;
    your_data.classList.add('active');
    wind_speed.innerHTML=`${data?.wind?.speed}m/s`;
    humidity.innerHTML=`${data?.main?.humidity}%`;
    clouds.innerHTML=`${data?.clouds?.all}%`;
}

