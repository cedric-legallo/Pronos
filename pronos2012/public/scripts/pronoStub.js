function formatDate(date){
    var _d = date.substring(8,10);
    var _m = date.substring(5,7);
    var _y = date.substring(0,4);
        return{time : date.substring(11,16), date:[_d,_m,_y].join("/")};
};


function loadEvents(data){
    var eventInnerHTML = '<div id="events"><div class="event"><span class="username"></span><span class="dtype"></span><span class="time"></span></div></div>';
    var directives = {
	dtype : function(){
	    switch(this.type){
	    case 'prono' : 
	return " a parié sur le match "+this.datas;
	    case 'comment' : 
		return " a laissé un commentaire sur la page d'accueil";
	    }
	},
	time : function(){
	    var _date = formatDate(this.date);
	    return _date.time+" le "+_date.date;
	}
    };
    document.getElementById("eventsContainer").innerHTML=eventInnerHTML;
    Transparency.render(document.getElementById("events") ,data , directives);
};

function loadHome(data){
    var homeInnerHTML="<div id='posts'><div class='post'><div class='author'></div><div class='message'></div><span class='date'></span><span class='time'></span></div></div><form action='/postMessage'  method='POST'  name='messageForm' onsubmit=\"xmlhttpPost('/postMessage', 'messageForm', 'onPost'); return false;\"><textarea name='message'></textarea><input type='submit' value='Envoyer'/></form>";
    var directives = {
	date : function(){
	    return formatDate(this.date).date;
	},
	time : function(){
	    return formatDate(this.date).time;
	}
    };
    document.getElementById("main").innerHTML=homeInnerHTML;
    Transparency.render(document.getElementById("posts"),data, directives);
};

function loadCalendar(data){
    var calendarInnerHTML="<h2>Cliquer sur un match pour parier dessus</h2><ul id='calendars'><li class='match' title='parier sur le match' onclick='displayProno(this)'><span class='matchid'></span><span class='teamA'></span> - <span class='teamB'></span><span class='date'></span><span class='time'></span></li></ul>";
    var directives = {
	match : function(){
	    return {class:"match "+this.group};
	},
	date : function(){
	    return formatDate(this.date).date;
	},
	time : function(){
	    return formatDate(this.date).time;
	},
	matchid : function(){
	    return this._id;
	}
    };

    document.getElementById("main").innerHTML=calendarInnerHTML;
    Transparency.render(document.getElementById("calendars"),data , directives);
};

function displayProno(src){
    xmlhttpGet('/cotes?matchid='+src.firstChild.innerHTML,loadProno);
};

function loadProno(data){
    var pronoInnerHTML = "<div id='pronoFormCont'><span class='remaining'>Mises restantes : </span><span class='capital'></span><form action='/prono'  method='POST'  name='pronoForm' onsubmit=\"xmlhttpPost('/prono', 'pronoForm', 'onProno'); return false;\"\><input type='hidden' name='matchid'></input><h3>Parier sur le gagnant : </h3><div class='pronosLabels'><span class='tier1'>1</span><span class='tier2'>N</span><span class='tier3'>2</span></div><div class='tier1'><label class='teamA' for='prono1'></label><input type='text' onchange='updateCapital(this)' onfocus='saveOldValue(this)' size='2' id='mise1' name='mise1'/> (<span class='cote1'></span>) </div><div class='tier2'><input type='text' onchange='updateCapital(this)' onfocus='saveOldValue(this)' size='2' id='miseN' name='miseN'/> (<span class='coteN'></span>) </div><div class='tier3'><input type='text' onchange='updateCapital(this)' onfocus='saveOldValue(this)' size='2' id='mise2' name='mise2'/> (<span class='cote2'></span>) <label class='teamB' for='prono2'></label></div><div id='pronoMatch'> <h3>Parier sur le score : </h3> <label class='teamA' for='score1'></label><input type='text' size='2'  id='score1' name='score1' onblur='enableBet(\"match\")'/> - <input type='text' size='2' id='score2' name='score2' onblur='enableBet(\"match\")'/><label class='teamB' for='score2'></label><br/><label for='miseMatch'>Mise : </label><input type='text' onchange='updateCapital(this)' onfocus='saveOldValue(this)' size='2' name='miseMatch' id='miseMatch' disabled='disabled'/>(<span id='coteMatch'></span>)</div><div id='pronoCard'> <h3>Parier sur le nombre de cartons : </h3> <label for='pronoCards'>Nombre de cartons : </label><input type='text' size='2' onblur='enableBet(\"cards\")' id='pronoCards' name='pronoCards'/><label for='miseCards'>Mise : </label><input type='text' onchange='updateCapital(this)' onfocus='saveOldValue(this)' size='2' name='miseCards' id='miseCards' disabled='disabled'/>(<span id='coteCards'></span>)</div><input type='submit' value='Envoyer mon pronostic'/></form><span>* Chaque case de mise est indépendante, il est possible de miser sur une ou plusieurs cotes, les gains en cas de bons pronostics sont de mise x cote, les cotes sont entre ( )</span></div>";
    document.getElementById("main").innerHTML=pronoInnerHTML;
    Transparency.render(document.getElementById("pronoFormCont"),data);//directives ?
};



function loadProfil(data){
    var profilInnerHTML="<div id='profil'><form action='/changeTeam'  method='POST'  name='profilForm' onsubmit=\"xmlhttpPost('/changeTeam', 'profilForm', 'changeNation'); return false;\"\><span>Nom d'utilisateur : </span><span class='username'></span><br/><span>Score : </span><span class='capital'></span><br/><label for='team'>Équipe favorite : </label><select id='dteam' name='team'><option value='Allemagne'>Allemagne</option><option value='Angleterre'>Angleterre</option><option value='Croatie'>Croatie</option><option value='Danemark'>Danemark</option><option value='Espagne'>Espagne</option><option value='France'>France</option><option value='Grèce'>Grèce</option><option value='Irlande'>Irlande</option><option value='Italie'>Italie</option><option value='Pays-Bas'>Pays-Bas</option><option value='Pologne'>Pologne</option><option value='Portugal'>Portugal</option><option value='République Tchèque'>République Tchèque</option><option value='Russie'>Russie</option><option value='Suède'>Suède</option><option value='Ukraine'>Ukraine</option></select><input type='submit' value='Modifier mon équipe favorite'/><br/><img id='davatar' width='120px' height='120px'></img></form></div>";
    var directives = {
	'davatar' : function(){
	    return {src : this.avatar};
	}
    };
    document.getElementById("main").innerHTML=profilInnerHTML;
    Transparency.render(document.getElementById("profil"),data, directives);
    document.querySelector("option[value="+data.team+"]").selected = "selected";
};

function changeNation(data){
    document.getElementById("drapeau").src="img/drap/"+data+".gif";
}

function loadRankings(rankings){
    var rankingsInnerHTML="<table border='1' cellpadding='0' cellspacing='0'><thead><tr><th>Pronostiqueur</th><th>Score</th></tr></thead><tbody id='rankings'><tr><td class='username'></td><td class='capital'></td></tr></tbody></table>";
    document.getElementById("main").innerHTML=rankingsInnerHTML;
    Transparency.render(document.getElementById("rankings"),rankings);
}

function loadMyPronos(pronos){
    var mypronoInnerHTML="<table border='1' cellpadding='0' cellspacing='0'><thead><tr><th>Match</th><th>1</th><th>N</th><th>2</th><th>Score</th><th title='score'>Mise</th><th>Cartons</th><th title='cartons'>Mise</th></tr></thead><tbody id='mypronos'><tr><td class='match'></td><td class='mise1'></td><td class='miseN'></td><td class='mise2'></td><td class='score'></td><td class='miseMatch' title='score'></td><td class='pronoCards'></td><td class='miseCards' title='cartons'></td></tr></tbody></table>";
    var directives = {
	'score' : function(){
	    if (this.score1 !== null) return this.score1+"-"+this.score2;
	    return "";
	}
    };
    document.getElementById("main").innerHTML=mypronoInnerHTML;
    Transparency.render(document.getElementById("mypronos"),pronos, directives);
}

function loadRules(){
    var rulesInnerHTML="<div id='rules'><ul><li>Ce site est un site de pari sur les matchs de l'euro 2012</li><li>Chaque utilisateur démarre avec 100 points qu'il peut miser sur les différents matchs</li><li>Chaque mise est retirée du capital</li><li>Chaque pari gagné est crédité au capital de points de 'mise multiplié par cote'</li><li>On peut parier ou modifier les paris sur un match jusqu'au début de celui-ci</li><li>Le but est d'être le meilleur parieur de la communauté</li></ul></div>";
    document.getElementById("main").innerHTML=rulesInnerHTML;
}


function loadStubDatas(){
    document.getElementById("main").style.width=window.innerWidth - 600+"px";
    xmlhttpGet('/events',loadEvents);
    setInterval(function(){xmlhttpGet('/events',loadEvents);}, 5000);
    setTimeout(function(){
	xmlhttpGet('/home',loadHome);
    },300);
};

function onPost(data){
    var data = JSON.parse(data);
    var node = document.getElementById("posts")
    var post = document.createElement("div");
    post.className="post";
    var _d = formatDate(data.date);
    post.innerHTML=["<div class='author'>",data.author,"</div><div class='message'>",data.message,"</div><span class='date'>",_d.date,"</span><span class='time'>",_d.time,"</span>"].join('');
    document.getElementsByTagName("textarea")[0].value = "";
    node.insertBefore(post, node.firstChild);
};

function onProno(data){
    xmlhttpGet('/userPronos',loadMyPronos)
};

function enableBet(type){
    switch (type){
    case 'match' : 
	var val1 = document.getElementsByName("score1")[0].value;
	var val2 = document.getElementsByName("score2")[0].value;
	if (val1 && val2) {
	    //calcul de la cote
	    var cote=1.5, val1 = parseInt(val1, 10), val2 = parseInt(val2, 10);
	    var cote1= parseFloat(document.querySelector(".cote1").innerHTML);
	    var cote2= parseFloat(document.querySelector(".cote1").innerHTML);
	    var diff= Math.round(Math.abs(cote2-cote1));
	    if (cote1 < cote2){
		cote+=(val2 > 2) ? Math.pow(val2-1,2):val2;
		diff = Math.abs(val1 - diff);
		cote+=(diff > 1) ? (diff-1)*3:1;
	    }else {
		cote+=(val1 > 2) ? Math.pow(val1-1,2):val1;
		diff = Math.abs(val2 - diff);
		cote+=(diff > 1) ? (diff-1)*3:1;
	    }
	    document.getElementById("coteMatch").innerHTML=cote;
	    document.getElementsByName("miseMatch")[0].disabled = "";
	}
	break;
    case 'cards' :
	var nbCards = document.getElementsByName("pronoCards")[0].value;
	if (nbCards) {
	    //calcul de la cote
	    document.getElementById("coteCards").innerHTML=Math.round((Math.pow(nbCards,Math.pow(nbCards,Math.sqrt(2)/3)/3)+0.5)*10)/10;
	    document.getElementsByName("miseCards")[0].disabled = "";
	}
	break;
    }
};

function saveOldValue(src){
    pronoFormValue = src.value;
};

function updateCapital(src){
    var node = document.querySelector(".capital");
    var cap = parseInt(node.innerHTML,10);
    cap += (parseInt(pronoFormValue, 10) || 0) - parseInt(src.value, 10) ;
    if (cap < 0){
	src.value = pronoFormValue;
	node.innerHTML = node.innerHTML + " Impossible de parier plus.";
    }else {
	node.innerHTML = cap;
    }
};

function onLogin(){
    location.href="/";
}