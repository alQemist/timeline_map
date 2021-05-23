function getJsonData(callback){

    if(!callback){
        d3.json('data/map.json',function(data){
            load(data);
        })
    }

    let url = "http://localhost:8888/timeline_map/php/api.php?v=1"

    var xhttp = new XMLHttpRequest();

    xhttp.open("GET", url, true);
    xhttp.onreadystatechange = function () {//Call a function when the state changes.

        if (this.readyState === 4 && this.status === 200 ) {

            let jData = JSON.parse(xhttp.responseText)

            if(callback) {load(jData)}
        }
    }
    xhttp.send();
}

