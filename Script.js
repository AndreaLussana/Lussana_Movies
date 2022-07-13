//SessionStorage keys --> DailyTrends - AllMovies - WeeklyTrends - Genres - Research
//AGGIUNGERE NO MATCHING FOUNDS
//Aggiungere filtro con altri film per all movies
var Res = false;
class movie{
    constructor(id, image, title, overview){
        this.id = id;
        this.image = image;
        this.title = title;
        this.genres = [];
        this.overview = overview;
    }
    PushGenres(id){
        this.genres.push(id);
    }
    get Id(){
        return this.id;
    }
}
function start(){
    Genres();
    home();
}

async function request(req) {   //Fetch requests
    const response = await fetch(req);
    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    }
    const movies = await response.json();
    return movies;
}
function SingleAdd(movie){  
    var code = "<a id="+movie.id+" onclick='description(this.id)'> <img src="+movie.image+" alt="+movie.title+" class='poster'></a>";
    document.getElementById("home").innerHTML += code;
}
function MainAdd(trend){    //Load movies on homepage
    const Movies = new Array(trend.results.length);
    console.log(trend);
    for(var i=0;i<trend.results.length;i++){
        if(trend.results[i].poster_path != null){
            image = 'https://image.tmdb.org/t/p/w500' + trend.results[i].poster_path;
            Movies[i] = new movie (trend.results[i].id, image, trend.results[i].title, trend.results[i].overview);
            for(var j=0;j<trend.results[i].genre_ids.length;j++){
                Movies[i].PushGenres(trend.results[i].genre_ids[j]);
            }
            var code = "<a id="+Movies[i].id+" onclick='description(this.id)'> <img src="+Movies[i].image+" alt="+Movies[i].title+" class='poster'></a>";
            document.getElementById("home").innerHTML += code;
            //console.log(Movies[i]);
        }
    }
    return Movies;
}
async function home(){
    var r = 'https://api.themoviedb.org/3/trending/movie/day?api_key=a3260576b13bb5fb2e1ad754d6adf9da';
    const trend = await request(r);
    const Movies = MainAdd(trend);
    sessionStorage.setItem("DailyTrends", JSON.stringify(Movies));
    //const prova = JSON.parse(sessionStorage.getItem("DailyTrends"));
    //console.log("Prova: " + prova[0].title);
}

function Drop(id){
    var tit = document.getElementById(id).textContent;
    document.getElementById("dropdownMenuButton").innerHTML = "Genres";
    document.getElementById("dropdownMenuButton1").textContent = tit;
    document.getElementById("home").innerHTML = "";
    if(id=="All"){
        AllMovies();
    }else if(id=="Day"){
        home();
    }else if(id=="Week"){
        TrendWeek();
    }
}
async function AllMovies(){
    var r = 'https://api.themoviedb.org/3/movie/popular?api_key=a3260576b13bb5fb2e1ad754d6adf9da&language=en-US&page=1';
    const trend = await request(r);
    const Movies = MainAdd(trend);
    sessionStorage.setItem("AllMovies", JSON.stringify(Movies));
}
async function TrendWeek(){
    var r = 'https://api.themoviedb.org/3/trending/movie/week?api_key=a3260576b13bb5fb2e1ad754d6adf9da';
    const trend = await request(r);
    const Movies = MainAdd(trend);
    sessionStorage.setItem("WeeklyTrends", JSON.stringify(Movies));
}
async function Genres(){
    var r = ' https://api.themoviedb.org/3/genre/movie/list?api_key=a3260576b13bb5fb2e1ad754d6adf9da&language=en-US';
    const gen = await request(r);
    console.log("Generi: " + gen.genres);
    var doc = document.getElementById("MenuDrop");
    doc.innerHTML += "<a class='dropdown-item' href='#' id='0' onclick='FilterGenres(this.id)'>Reset Genres</a>";   //Utilizzo per resettare il filtro dei generi
    for(var i=0;i<gen.genres.length;i++){
        doc.innerHTML += "<a class='dropdown-item' href='#' id="+gen.genres[i].id+" onclick='FilterGenres(this.id)'>"+gen.genres[i].name+"</a>";
    }
    sessionStorage.setItem("Genres", JSON.stringify(gen.genres));
}
async function FilterGenres(id){
    var find = false;
    //Filtro in base alla prima scelta del filtro (trend of the day, week o all movies)
    document.getElementById("home").innerHTML = "";
    var title = document.getElementById("dropdownMenuButton1").textContent;
    if(id!=0){
        let g = JSON.parse(sessionStorage.getItem("Genres"));
        for(var i=0;i<g.length;i++){
            if(g[i].id == id){
                document.getElementById("dropdownMenuButton").innerHTML = g[i].name;
            }
        }
        if(title=="Trend of the day"){
            const t = JSON.parse(sessionStorage.getItem("DailyTrends"));
            //console.log(t);
            for(var i=0;i<t.length;i++){
                for(var j=0;j<t[i].genres.length;j++){
                    if(t[i].genres[j]==id){
                        SingleAdd(t[i]);
                        find=true;
                    }
                }
            }
        }else if(title=="Trend of the week"){
            const t = JSON.parse(sessionStorage.getItem("WeeklyTrends"));
            //console.log(t);
            for(var i=0;i<t.length;i++){
                for(var j=0;j<t[i].genres.length;j++){
                    if(t[i].genres[j]==id){
                        SingleAdd(t[i]);
                        find=true;
                    }
                }
            }
        }else if(title=="All Movies"){
            const t = JSON.parse(sessionStorage.getItem("AllMovies"));
            //console.log(t);
            for(var i=0;i<t.length;i++){
                for(var j=0;j<t[i].genres.length;j++){
                    if(t[i].genres[j]==id){
                        SingleAdd(t[i]);
                        find=true;
                    }
                }
            }
            if(find==false){
                document.getElementById("home").innerHTML = "<h4 align='center'>No Matching Founds</h4>";
            }
        }
    }else{
        document.getElementById("dropdownMenuButton").innerHTML = "Genres";
        if(title=="Trend of the day"){
            const t = JSON.parse(sessionStorage.getItem("DailyTrends"));
            for(var i=0;i<t.length;i++){
                SingleAdd(t[i]);
            }
        }else if(title=="Trend of the week"){
            const t = JSON.parse(sessionStorage.getItem("WeeklyTrends"));
            for(var i=0;i<t.length;i++){
                SingleAdd(t[i]);
            }
        }else if(title=="All Movies"){
            const t = JSON.parse(sessionStorage.getItem("AllMovies"));
            for(var i=0;i<t.length;i++){
                SingleAdd(t[i]);
            }
        }
    }
    
}
async function description (id){
    var title = document.getElementById("dropdownMenuButton1").textContent;
    var movie;
    if(title=="Trend of the day" && Res == false){  //Res indica se é stato cercato un film o meno
        const t = JSON.parse(sessionStorage.getItem("DailyTrends"));
        for(var i=0;i<t.length;i++){
            if(t[i].id==id){
                 movie = t[i];
            }
        }
    }else if(title=="Trend of the week"){
        const t = JSON.parse(sessionStorage.getItem("WeeklyTrends"));
        for(var i=0;i<t.length;i++){
            if(t[i].id==id){
                 movie = t[i];
            }
        }
    }else if(title=="All Movies"){
        const t = JSON.parse(sessionStorage.getItem("AllMovies"));
        for(var i=0;i<t.length;i++){
            if(t[i].id==id){
                 movie = t[i];
            }
        }
    }else if(title=="Trend of the day" && Res == true){
        const t = JSON.parse(sessionStorage.getItem("Research"));
        for(var i=0;i<t.length;i++){
            if(t[i].id==id){
                 movie = t[i];
            }
        }
        Res = false;
    }
    //Request del video
    var r = "https://api.themoviedb.org/3/movie/"+id+"/videos?api_key=a3260576b13bb5fb2e1ad754d6adf9da&language=en-US";
    const vid = await request(r);
    console.log(vid);
    document.getElementById("home").innerHTML = "";
    var d = "<div class='container'> <div class='row justify-content-between'> <div class='col-4'><img src="+movie.image+" alt="+movie.title+" class='dposter'></div><div class='col-10 divtitle'><h1 class='movtitle'>"+movie.title+"</h1></div></div><div class='row justify-content-center'><div class='col-2 divdesc'>"+movie.overview+"</div></div>";            //Div da chiudere
    if(vid.results.length>0){
        d += "<div class='row justify-content-end'><div class='col-6 divVideo'><iframe width='90%' height='500px' src='https://www.youtube.com/embed/"+vid.results[0].key+"'></iframe></div></div></div></div>";
    }
    
    document.getElementById("home").innerHTML = d;
}
function goHome(){
    document.getElementById("home").innerHTML = "";
    Drop("Day");
}
async function Search(){
    Res = true;
    document.getElementById("home").innerHTML = "";
    var film = document.getElementById("Film").value;
    document.getElementById("Film").value = "";
    var r = "https://api.themoviedb.org/3/search/movie?api_key=a3260576b13bb5fb2e1ad754d6adf9da&query=" + film;
    const RetFilm = await request(r);
    const Movies = MainAdd(RetFilm);
    sessionStorage.setItem("Research", JSON.stringify(Movies));
}