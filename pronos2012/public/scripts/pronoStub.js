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
    var homeInnerHTML="<div id='posts'><div class='post'><span class='author'></span><span class='message'></span><span class='date'></span><span class='time'></span></div></div><form action='/postMessage'  method='POST'  name='messageForm' onsubmit=\"xmlhttpPost('/postMessage', 'messageForm', 'onPost'); return false;\"><textarea name='message'></textarea><input type='submit' value='Envoyer'/></form>";
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
    var pronoInnerHTML = "<div id='pronoFormCont'><span class='remaining'>Mises restantes : </span><span class='capital'></span><form action='/prono'  method='POST'  name='pronoForm' onsubmit=\"xmlhttpPost('/prono', 'pronoForm', 'onProno'); return false;\"\><input type='hidden' name='matchid'></input><h3>Parier sur le gagnant : </h3><div class='pronosLabels'><span class='tier1'>1</span><span class='tier2'>N</span><span class='tier3'>2</span></div><div class='tier1'><label class='teamA' for='prono1'></label><input type='text' onchange='updateCapital(this)' onfocus='saveOldValue(this)' size='2' id='mise1' name='mise1'/> (<span class='cote1'></span>) </div><div class='tier2'><input type='text' onchange='updateCapital(this)' onfocus='saveOldValue(this)' size='2' id='miseN' name='miseN'/> (<span class='coteN'></span>) </div><div class='tier3'><input type='text' onchange='updateCapital(this)' onfocus='saveOldValue(this)' size='2' id='mise2' name='mise2'/> (<span class='cote2'></span>) <label class='teamB' for='prono2'></label></div><div id='pronoMatch'> <h3>Parier sur le score : </h3> <label class='teamA' for='score1'></label><input type='text' size='2'  id='score1' name='score1' onblur='enableBet(\"match\")'/> - <input type='text' size='2' id='score2' name='score2' onblur='enableBet(\"match\")'/><label class='teamB' for='score2'></label><br/><label for='miseMatch'>Mise : </label><input type='text' onchange='updateCapital(this)' onfocus='saveOldValue(this)' size='2' name='miseMatch' id='miseMatch' disabled='disabled'/>(<span id='coteMatch'></span>)</div><div id='pronoCard'> <h3>Parier sur le nombre de cartons : </h3> <label for='pronoCards'>Nombre de cartons : </label><input type='text' size='2' onblur='enableBet(\"cards\")' id='pronoCards' name='pronoCards'/><label for='miseCards'>Mise : </label><input type='text' onchange='updateCapital(this)' onfocus='saveOldValue(this)' size='2' name='miseCards' id='miseCards' disabled='disabled'/>(<span id='coteCards'></span>)</div><input type='submit' value='Envoyer mon pronostic'/></form><span>* Chaque case de mise est indépendante, il est possible de miser sur une ou plusieurs cote, les gains en cas de bons pronostics sont de mise x cote (les cotes sont entre ( )</span></div>";
    document.getElementById("main").innerHTML=pronoInnerHTML;
    Transparency.render(document.getElementById("pronoFormCont"),data);//directives ?
};



function loadProfil(data){
    var profilInnerHTML="<div id='profil'><span>Nom d'utilisateur : </span><span class='username'></span><span>Score : </span><span class='capital'></span><label for='team'>équipe favorite : </label><select id='dteam' name='team'><option value='Allemagne'>Allemagne</option><option value='Angleterre'>Angleterre</option><option value='Croatie'>Croatie</option><option value='Danemark'>Danemark</option><option value='Espagne'>Espagne</option><option value='France'>France</option><option value='Grêce'>Grêce</option><option value='Irlance'>Irlande</option><option value='italie'>Italie</option><option value='Pays-Bas'>Pays-Bas</option><option value='Pologne'>Pologne</option><option value='Portugal'>Portugal</option><option value='République Tchèque'>République Tchèque</option><option value='Russie'>Russie</option><option value='Suède'>Suède</option><option value='Ukraine'>Ukraine</option></select><img id='davatar' width='120px' height='120px'></img></div>";
    var directives = {
	'davatar' : function(){
	    return {src : this.avatar};
	}
    };
    document.getElementById("main").innerHTML=profilInnerHTML;
    Transparency.render(document.getElementById("profil"),data, directives);
    document.querySelector("option[value="+data.team+"]").selected = "selected";
};

function loadRankings(rankings){
    var rankingsInnerHTML="<table border='1' cellpadding='0' cellspacing='0'><thead><tr><th>Pronostiqueur</th><th>Score</th></tr></thead><tbody id='rankings'><tr><td class='username'></td><td class='capital'></td></tr></tbody></table><div id='message'></div>";
    document.getElementById("main").innerHTML=rankingsInnerHTML;
    Transparency.render(document.getElementById("rankings"),rankings);
}

function loadMyPronos(pronos){
    var mypronoInnerHTML="<table border='1' cellpadding='0' cellspacing='0'><thead><tr><th>Match</th><th>1</th><th>N</th><th>2</th><th>score</th><th>mise score</th><th>cartons</th><th>mise cartons</th></tr></thead><tbody id='mypronos'><tr><td class='match'></td><td class='mise1'></td><td class='miseN'></td><td class='mise2'></td><td class='score'></td><td class='miseMatch'></td><td class='pronoCards'></td><td class='miseCards'></td></tr></tbody></table><div id='message'></div>";
    var directives = {
	'score' : function(){
	    if (this.score1) return this.score1+"-"+this.score2;
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
    post.innerHTML=["<span class='author'>",data.author,"</span><span class='message'>",data.message,"</span><span class='date'>",_d.date,"</span><span class='time'>",_d.time,"</span>"].join('');
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
    }else {
	node.innerHTML = cap;
    }
};