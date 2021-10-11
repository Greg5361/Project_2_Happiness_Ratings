// from data.js
var tableData = data;
// YOUR CODE HERE!
console.log(tableData);
var selectDateTimeField = d3.select("#datetime");
var selectCityField = d3.select("#city");
var selectStateField = d3.select("#state");
var selectCountryField = d3.select("#country");
var selectShapeField = d3.select("#shape");
function filluptheSelectOptions(data){
    
    var dateTimeUnique = [];
    var cityUnique = [];
    var stateUnique = [];
    var countryUnique = [];
    var shapeUnique = [];
    var arrayDataDatetime = [];
    var arrayDataCity = [];
    var arrayDataState = [];
    var arrayDataCountry = [];
    var arrayDataShape = [];
    data.forEach(data => {
        arrayDataDatetime.push(data["datetime"]);
        
    });
    data.forEach(data => {
        arrayDataCity.push(data["city"]);
        
    });
    data.forEach(data => {
        arrayDataState.push(data["state"]);
        
    });
    data.forEach(data => {
        arrayDataCountry.push(data["country"]);
        
    });
    data.forEach(data => {
        arrayDataShape.push(data["shape"]);
        
    });

    dateTimeUnique = arrayDataDatetime.filter((value, index) => arrayDataDatetime.indexOf(value) === index);
    cityUnique = arrayDataCity.filter((value, index) => arrayDataCity.indexOf(value) === index);
    stateUnique = arrayDataState.filter((value, index) => arrayDataState.indexOf(value) === index);
    countryUnique = arrayDataCountry.filter((value, index) => arrayDataCountry.indexOf(value) === index);
    shapeUnique = arrayDataShape.filter((value, index) => arrayDataShape.indexOf(value) === index);

    dateTimeUnique.forEach(datetime => {
        selectDateTimeField.append("option").text(datetime)
    });

    cityUnique.forEach(city => {
        selectCityField.append("option").text(city)
    });
    stateUnique.forEach(state => {
        selectStateField.append("option").text(state)
    });
    countryUnique.forEach(country => {
        selectCountryField.append("option").text(country)
    });
    shapeUnique.forEach(shape => {
        selectShapeField.append("option").text(shape)
    });

}



function appendData(data){
    var columns = ["datetime", "city", "state", "country", "shape", "duration", "comments"];
    data.forEach(sighting => {
        var row = d3.select("tbody").append("tr");
        columns.forEach(column => row.append("td").text(sighting[column]))
    });
}

appendData(tableData);
filluptheSelectOptions(tableData);

//var inputdateField = d3.select("#datetime");
var filterButton = d3.select("#filter-btn");
var clearFilterButton = d3.select("#clearFilter-btn");
filterButton.on("click", () =>{
    d3.event.preventDefault();
    var filterDate = selectDateTimeField.property("value").trim();
    var filterCity = selectCityField.property("value").trim();
    var filterState = selectStateField.property("value").trim();
    var filterCountry = selectCountryField.property("value").trim();
    var filterShape = selectShapeField.property("value").trim();
    console.log(filterDate);
    var incomingArr = [];
    var outgoingArr = [];
    var finalfiltereredData = [];
    /*if (filterDate != "" && filterCity != "" &&  filterState != "" && filterCountry != "" && filterShape != ""){
        filtereredData = tableData.filter( tableData => ( tableData.datetime === filterDate && tableData.city === filterCity && tableData.state === filterState && tableData.country === filterCountry && tableData.shape === filterShape) );
    }
    else if(filterDate != "" && filterCity != "" &&  filterState != "" && filterCountry != ""){
        filtereredData = tableData.filter( tableData => ( tableData.datetime === filterDate && tableData.city === filterCity && tableData.state === filterState && tableData.country === filterCountry) );
    }
    else if (){

    }*/
    incomingArr = tableData
    for (var i=0; i < 5 ; i++){
        if (i === 0){
            if (filterDate != ""){
                outgoingArr = incomingArr.filter( incomingArr => ( incomingArr.datetime === filterDate ));
            }
            else{
                outgoingArr = incomingArr
            }
        }
        else if (i === 1){
            if (filterCity != ""){
                outgoingArr = incomingArr.filter( incomingArr => ( incomingArr.city === filterCity ));
            }
            else{
                outgoingArr = incomingArr
            }
        }
        else if (i === 2){
            if (filterState != ""){
                outgoingArr = incomingArr.filter( incomingArr => ( incomingArr.state === filterState ));
            }
            else{
                outgoingArr = incomingArr
            }       
        }
        else if (i === 3){
            if (filterCountry != ""){
                outgoingArr = incomingArr.filter( incomingArr => ( incomingArr.country === filterCountry));
            }
            else{
                outgoingArr = incomingArr
            }
        }
        else if (i === 4){
            if (filterShape != ""){
                outgoingArr = incomingArr.filter( incomingArr => ( incomingArr.shape === filterShape ));

                
            }
            else{
                outgoingArr = incomingArr
            }
        }
        incomingArr = outgoingArr;
    }
    
    var filtereredData = outgoingArr;
    outgoingArr = [];
    incomingArr = [];



    d3.select("tbody").html("");

    if ( filtereredData.length > 0 ){
        appendData(filtereredData);
    }
    else{
        d3.select("tbody").append("tr").append("td").text("No UFO sighting for these filters")
    }
});

clearFilterButton.on("click", () => {
    d3.select("tbody").html("");

    document.getElementById('datetime').value = "";
    document.getElementById('city').value = "";
    document.getElementById('state').value = "";
    document.getElementById('country').value = "";
    document.getElementById('shape').value = "";
    
    appendData(tableData);
});


