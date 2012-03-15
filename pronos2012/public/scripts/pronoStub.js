function loadStubDatas(){
    loadEvents();
    loadHome();
};

var events = [
	      {"username" : "C�dric Le Gallo",
	       "type" : "prono",
	       "datas" : "France-Espagne",
	       "date" : "08/03/2012",
	       "time" :"09:58"
	      },
	      {"username" : "C�dric Le Gallo",
	       "type" : "comment",
	       "datas" : "",
	       "date" : "08/03/2012",
	       "time" :"10:02"
	      }

	      ];

var eventsDirectives = {
    dtype : function(){
	switch(this.type){
	case 'prono' : 
	return " a pari� sur le match "+this.datas;
	case 'comment' : 
	return " a laiss� un commentaire sur la page d'accueil";
	}
    }
};

var eventInnerHTML = '<div class="event"><span class="username"></span><span class="dtype"></span><span class="time"></span></div>';

function loadEvents(){
    document.getElementById("events").innerHTML=eventInnerHTML;
    Transparency.render(document.getElementById("events"),events, eventsDirectives);
};

var posts = [
	     {"author": "C�dric Le Gallo",
	      "message": "Bonjour les Pronos",
	      "date": "08/03/2012",
	      "time": "10:02"
	     }
	      
	     ];

var homeInnerHTML="<div id='posts'><div class='post'><span class='author'></span><span class='message'></span><span class='date'></span><span class='time'></span></div></div>";

function loadHome(){
//    document.getElementById("main").innerHTML=homeInnerHTML;
//    Transparency.render(document.getElementById("posts"),posts);
};

function loadPronos(){
    document.getElementById("main").innerHTML=pronosInnerHTML;
};
function loadCalendar(){
    document.getElementById("main").innerHTML=calendarInnerHTML;
};
function loadGroups(){
    document.getElementById("main").innerHTML=groupsInnerHTML;
};

var profil={
    'username':'C�dric Le Gallo',
    'email' : 'clg@toto.fr',
    'team' : 'France',
    'avatar' : 'http://aliveonceagain.files.wordpress.com/2011/07/a2.jpg&w=900&h=900&ei=QPFdT4XZGYTA8QOgiO3CCg&zoom=1&iact=rc&dur=544&sig=118110289234515214814&page=1&tbnh=152&tbnw=174&start=0&ndsp=21&ved=1t:429,r:9,s:0&tx=100&ty=92'
}

var profilInnerHTML="<div id='profil'><label for='username'>Nom d'utilisateur : </label><input type='text' id='username' name='username/><label for='email'>Adresse email : </label><input type='text' id='email' name='email'/><label for='team'>�quipe favorite : </label><select id='dteam' name='team'><option value='Allemagne'>Allemagne</option><option value='Angleterre'>Angleterre</option><option value='Croatie'>Croatie</option><option value='Danemark'>Danemark</option><option value='Espagne'>Espagne</option><option value='France'>France</option><option value='Gr�ce'>Gr�ce</option><option value='Irlance'>Irlande</option><option value='italie'>Italie</option><option value='Pays-Bas'>Pays-Bas</option><option value='Pologne'>Pologne</option><option value='Portugal'>Portugal</option><option value='R�publique Tch�que'>R�publique Tch�que</option><option value='Russie'>Russie</option><option value='Su�de'>Su�de</option><option value='Ukraine'>Ukraine</option></select><img id='davatar' width='120px' height='120px'></img></div>";

var profilDirective = {
    'davatar' : function(){
	return {src : this.avatar};
    }
};

function loadProfil(){
    document.getElementById("main").innerHTML=profilInnerHTML;
    Transparency.render(document.getElementById("profil"),profil, profilDirective);
    document.querySelector("option[value="+profil.team+"]").selected = "selected";
};

var mails = [
	     {"author": "C�dric Le Gallo",
	      "header": "Bonjour !",
	      "message": "Bonjour mon gars",
	      "date": "08/03/2012",
	      "time": "10:02",
	      "status" : "unread"
	     }
	      
	     ];

var mailsInnerHTML="<table><thead><tr><th>Exp�diteur</th><th>Sujet</th><th>Date</th></tr></thead><tbody id='mails'><tr class='dstatus'><td class='author'></td><td class='header'></td><td class='ddate'></td></tr></tbody></table><div id='message'></div>";

var mailsDirective = {
    'dstatus' : function(){
	return {onclick : "displayMessage(this, '"+this.message+"');", class:this.status};
    },
    'ddate' : function(){
	return this.date+"-"+this.time;
    }
};

function loadMails(){
    document.getElementById("main").innerHTML=mailsInnerHTML;
    Transparency.render(document.getElementById("mails"),mails, mailsDirective);
}

function displayMessage(src, message){
    console.log(src);
    console.log(message);
    src.className="read";
    document.getElementById("message").innerHTML=message;
}
