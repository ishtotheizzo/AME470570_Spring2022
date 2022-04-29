var allImages;
var dashboardImages; 
var jsonObj;
var choices;
var allFriends = [];
var myUserID = "";
var skipNum = 0; 
var currImageIndex = 0;


function feedSelected(index)
      {
        chatActive = false;
      $("body").removeClass().addClass("col2")
        $("#feeds button").removeClass("selected");
        $("#feeds button:nth-of-type("+(index+1)+")").addClass("selected");

        $("#itemList .submenu").fadeOut(0);
        $("#itemDetails .submenu").fadeOut(0);
        $("#itemList .submenu:nth-of-type("+ (index + 1)+")").fadeIn(0);

        skipNum = 0 

        if(index == 0){ // load dashboard

          loadURL("./getDashboardList?skip="+skipNum, function(data){
            dashboardImages = JSON.parse(data); 
            generateDashboardList();
          });

          
        }

        if(index == 1){ // load images
        
          loadURL("./getAllImages", function(data){
            allImages = JSON.parse(data);
            generateImageList();

          });


        }
        if(index == 2){ 

            // load friends
        }
        else{ // load account page
        }
        /*
        */

      }

setInterval("updateChat()", 500);
var chatActive = false;

function chatTyped(event){
  if(event.keyCode === 13){
    var fuid = document.getElementById("friendSelect").value;
    var chatid = [myUserID, fuid].sort().join("");
    var time = new Date().getTime();
    var id = chatid + time;
    var msg = document.getElementById("userChatInput").value;
    var url = "./postChat?id=" + id + "&chatid=" + chatid + "&msg=" + msg + "&time=" + time + "&userid=" + myUserID;
    loadURL(url, function(data){
      document.getElementById("userChatInput").value = "";
      var objDiv = document.getElementById("chatDiv");
      objDiv.scrollTop = objDiv.scrollHeight;
    });
  }
}

var lastChatTime = 0;


function updateChat()
{
  if(!chatActive) return;

  var fuid = document.getElementById("friendSelect").value;
  var chatid = [myUserID, fuid].sort().join("");
  loadURL("./getLatestChat?chatid="+chatid, function(data){
    var list = JSON.parse(data).reverse();
    for(var i = 0; i < list.length; i++){
      if(lastChatTime < list[i].time){
        var cl='me';
        if(list[i].userid === fuid){
          cl="you";
        }

        $("#chatDiv").append("<div class='chatBubble " + cl + "'>" + list[i].msg + "</div>")
        lastChatTime = list[i].time;
      }
    }
    var objDiv = document.getElementById("chatDiv");
    objDiv.scrollTop = objDiv.scrollHeight;
  });
}

function fmSelected(arg, index)
{
  chatActive = false;
  $("#itemDetails .submenu").fadeOut(0);
  $("#itemDetails .submenu#" + arg).fadeIn(0);
  $("#fsubmenu button").removeClass("selected");
  $("#fsubmenu button:nth-of-type("+(index+1)+")").addClass("selected");
  console.log(arg);
  if(arg === "chatFriends"){
    chatActive = true;
    lastChatTime = 0;
    var markup = "";
    for(var i = 0; i < allFriends.length; i++){
      markup += "<option val='"+allFriends[i] +"'>" + allFriends[i] + "</option>"
    }
    console.log(markup);
    document.getElementById("friendSelect").innerHTML = markup;
    $("#friendSelect").formSelect();
    lastChatTime = 0;
    document.getElementById("chatDiv").innerHTML = "";
    chatActive = true;
  }
}

function friendChanged()
{
     lastChatTime = 0;
    document.getElementById("chatDiv").innerHTML = "";
}

function filterChanged()
{
  var fil = document.getElementById("selectedFilter").value;
  $("#fullImage").removeClass().addClass(fil);
  loadURL("./changeFilter?id=" + allImages[currImageIndex].id + "&filter=" + fil, function(data){
      allImages[currImageIndex].filter = fil; 
  });
}

var fileUploaded = function()
{
   var file = $('#theFileUploader').get(0);
   var fileObj = $('#theFileUploader').get(0).files[0]
   if(fileObj.size > 5 *1000 * 1000){
    alert("Please upload a smaller file!");
    return;
   }
   var filename = fileObj.name;
   var ext = filename.split(".");
   ext = ext[ext.length-1];
   console.log(ext);

   var fd = new FormData();
   var fileInput = "asurite-s3Upload_" + new Date().getTime().toString() + "." + ext;
   fd.append('fileInput', fileInput);
   fd.append('input', file.files[0]);
   fd.append('date', (new Date()).toString());

    //fd.append('data', data);
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(e) {  
      if (xhr.readyState != 4) { return; }
        // callback logic
         loadURL("./getAllImages", function(data){
            allImages = JSON.parse(data);
            generateImageList();
          }); 
    };
    xhr.open("POST", "/uploadFile", true);
    xhr.send(fd);
}

function updateFriends()
{
  var list = document.getElementById("friendList").value;
  allFriends = list.split(",")
  var url = "./updateFriends?list="+ list
     + "&fname=" + document.getElementById("fname").value
     + "&lname=" + document.getElementById("lname").value
  console.log(url);
  loadURL(url, function(data){
  });
}


	function goBack(){
	   if($('body').hasClass('col3')){
		$("body").removeClass().addClass("col2")
		$("#itemList button").removeClass("selected");
		document.getElementById("itemDetails").innerHTML = "";
	   }
	   else if($('body').hasClass('col2')){
		$("body").removeClass()
		$("#feeds button").removeClass("selected");
		document.getElementById("itemList").innerHTML = "";
	   }
   	   else{
		$("body").removeClass()
	   }

	}

      function start(callback){
        $("#itemList .submenu").fadeOut(0);
        $(".submenu").fadeOut(0);
        $('select').formSelect();
        const element = document.querySelector('.js-choice');
        choices = new Choices(element,{ removeItems: true,removeItemButton: true});
        loadURL("./getAccountInfo", function(data){
          var aInfo = JSON.parse(data);
          myUserID = aInfo.userid;
          document.getElementById("userid").innerHTML = myUserID;
          allFriends = aInfo.friends;
          choices.setValue(aInfo.friends);
          document.getElementById("fname").value = aInfo.fname || "";
          document.getElementById("lname").value = aInfo.lname || "";
        });

      }

      function generateImageList()
      {
        var list = allImages;
        var markup = "";
        var i = 0;
        for (; i < list.length; i++){
          markup += "<button onclick='imgSelected("+i+")'>" +
            "<div style='background-image:url(https://bucket470570.s3-us-west-2.amazonaws.com/" + list[i].url + ")' class='thumbnail'></div>" + 
            "<h1>" + list[i].name + "</h1>" + 
            "</button>";
        }

        if(i==0){
          markup = "<h3> No images yet! Add some.</h3>"
        }

        document.getElementById("images").innerHTML  = markup;
      }

      function generateDashboardList()
      {
        var list = dashboardImages;
        var markup = "";
        var i = 0;
        var j = 0; 

 
        if(list.length < 11){
            for (; i < list.length; i++){
                markup += "<button onclick='imgSelectedDashboard("+i+")'>" +
                  "<div style='background-image:url(https://bucket470570.s3-us-west-2.amazonaws.com/" + list[i].url + ")' class='thumbnail'></div>" + 
                  "<h1>" + list[i].name + "</h1>" + 
                  "<h1>" + list[i].filter + "</h1>"+
                  "</button>";
              }
        }

        else
        {
            var numOfLoop = list.length%10; 
            var j = 0; 

            for(; j < numOfLoop; j++)
            {
                skipNum = numOfLoop*10

            loadURL("./getDashboardList?skip="+skipNum, function(data){
              dashboardImages = JSON.parse(data); 
                generateDashboardList();
             });

             for (; i < list.length; i++){
                markup += "<button onclick='imgSelectedDashboard("+i+")'>" +
                  "<div style='background-image:url(https://bucket470570.s3-us-west-2.amazonaws.com/" + list[i].url + ")' class='thumbnail'></div>" + 
                  "<h1>" + list[i].name + "</h1>" + 
                  "<h1>" + list[i].filter + "</h1>"+
                  "</button>";

              }

            }
            
        }
  
        
        if(i==0){
          markup = "<h3> Your friends haven't uploaded anything! Tell them to :) </h3>"
        }


        document.getElementById("dashboardImages").innerHTML  = markup;
      }

      


      function imgSelected(index){
        $("#itemDetails.submenu").fadeOut();
        $(".submenu#imageEditor").fadeIn();
        currImageIndex = index;
        $("#images button").removeClass("selected");
        $("#images button:nth-of-type("+(index+1)+")").addClass("selected");
        var data = allImages[index];
        var fil = data.filter;
        document.getElementById("fullImage").src = "https://bucket470570.s3-us-west-2.amazonaws.com/" + data.url 
        $("#fullImage").removeClass().addClass(fil);
        document.getElementById("selectedFilter").value = fil;
        $("select").formSelect();
      }

      function imgSelectedDashboard(index){
        var data = dashboardImages[index];
        var fil = data.filter;
        $("#itemDetails.submenu").fadeOut();
        $(".submenu#friendImage").fadeIn();
        $("#images button").removeClass("selected");
        $("#images button:nth-of-type("+(index+1)+")").addClass("selected");
        document.getElementById("fullImageFriend").src = "https://bucket470570.s3-us-west-2.amazonaws.com/" + data.url 
        $("#fullImageFriend").removeClass().addClass(fil);
      }

      

      function generateMarkup(index)
      {
        var list = jsonObj.feed.results;
        var markup = '<a class="waves-effect waves-light btn blue" href="javascript:editFeed('+index+')"><i class="material-icons left">create</i>Edit Feed</a>'
          + '<a class="waves-effect waves-light btn red" style="float:right" href="javascript:deleteFeed('+index+')"><i class="material-icons left">delete</i>Delete Feed</a>'
 //       var markup = "<button onclick=editFeed("+index+")><h2>Edit This Feed<h2></button>"
 //           + "<button onclick=deleteFeed("+index+")><h2>Delete This Feed<h2></button>";
        for (var i = 0; i < list.length; i++){
         markup += "<button onclick='itemClicked("+ i +")'>" +
            "<img src='"+ list[i].artworkUrl100 +"'>" +
            "<h1>" + list[i].name + "</h1>" + 
            "<h2>" + list[i].artistName + "</h2>" + 
            "</button>";
        }

        document.getElementById("itemList").innerHTML  = markup;
      }



      
      
      function deleteImage(){
        var index = currImageIndex;
        var id = allImages[index].id;
        var x = confirm("Are you sure?");
        if(!x) return;
        var url = "./deleteImage?id=" + id;
        loadURL(url, function(data){
          feedSelected(1);
        });
      }
      
      function editImage(){
        var index = currImageIndex;
        var title = allImages[index].name;
        var id = allImages[index].id;
        var newName = prompt("Edit Feed Name:", title);
        var url = "./editImage?id=" + id + "&newName=" + newName;
        loadURL(url, function(data){
          feedSelected(1);
        });
      }

      var main = function(){
  // check whether user is logged in
  loadURL("/loginStatus", function(data){
    if(data === "0"){
      window.location.href='./login.html'
      return;
    }
    else{
      start();
    }
  });
               
}

var doLogout = function()
{
  var x = confirm("Logout now?")
  if(x){
    loadURL("./logout", function(d){window.location.reload()})
  }
}



