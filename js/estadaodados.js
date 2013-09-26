/* ********** Load ************* */

/* ******* FILTROS ********** */
    var cores = ["#B8B88F", "#B88FA3", "#265926", "#262659"], //A1 , A4 , C11  , C7
    filtro = {
        "esquerda": {
            "pesquisa": "p3",
            "dado": "reg-br",
            "nome_cand": ""
        },
        "direita": {
            "pesquisa": "p3",
            "dado": "reg-br",
            "nome_cand": ""
        }
    },
    fotos_ocultas = [],
    todos_candidatos = ["dilma","aecio","marina","eduardo","serra","joaquim","gabeira"],
    presentes = {
        "p1": ["dilma","aecio","marina","eduardo","serra","joaquim","gabeira"],
        "p2": ["dilma","aecio","marina","eduardo","joaquim"],
        "p3": ["dilma","aecio","marina","eduardo","serra"]
    }

function ocultar_fotos_listadas(){
    for (var i =0 ; i < fotos_ocultas.length; i++)
        $("#" + fotos_ocultas[i]).fadeOut();
    fotos_ocultas = [];
}

function limpar_candidato_de_um_lado(lado) {
    if (lado == "esquerda") {
        $("#cand-esq").empty();
        $("#cand-esq").addClass("placeholder");
        $("#graf-cand-esq").empty();
        filtro["esquerda"]["nome_cand"] = "";
        emiteAlerta("cand-esq");
    } else {
        $("#cand-dir").empty();
        $("#cand-dir").addClass("placeholder");
        $("#graf-cand-dir").empty();
        filtro["direita"]["nome_cand"] = "";
        emiteAlerta("cand-dir");
    }
}

function verifica_candidatos_pesquisas(nome_corrente, lado) {
    //Verificando se os candidatos aparecem em alguma das pesquisas
    var pesquisas = [];
        pesquisas.push(presentes[$("#selecao_pesquisa_esquerda")[0].value]);
        pesquisas.push(presentes[$("#selecao_pesquisa_direita")[0].value]);

        retorno = true;
    
    var cand_possiveis = [];

    for (var i = 0; i < pesquisas.length ; i++)
        for (var j = 0 ; j < pesquisas[i].length ; j++)
            if (cand_possiveis.indexOf(pesquisas[i][j]) == -1)
                cand_possiveis.push(pesquisas[i][j]);

    for (var i = 0 ; i < todos_candidatos.length ; i++) {
        if (cand_possiveis.indexOf(todos_candidatos[i]) > -1)
            $("#" + todos_candidatos[i]).fadeIn();
        else {
            fotos_ocultas.push(todos_candidatos[i]);
            if(nome_corrente == todos_candidatos[i]) {
                limpar_candidato_de_um_lado(lado);
                retorno = false;
            }
        }
    }
    ocultar_fotos_listadas();
    return retorno
}

function emiteAlerta(div) {
    jQuery('<div/>', {
        id: 'alerta',
        class: 'alert alert-error',
        text: 'Potencial de voto não aferido nesta pesquisa.'
    }).appendTo('#' + div);
}

/* Chamada de mudança de filtro */
function altera_filtro(posicao, item, el) {

    var div_foco = "",
        div_foto = "",
        nome_cand = filtro[posicao].nome_cand;

    if (posicao == "esquerda") {
        div_foco = "graf-cand-esq";
        div_foto = "cand-esq";
    } else {
        div_foco = "graf-cand-dir";
        div_foto = "cand-esq";
    }
  
    if (item == "pesquisa")
        window.filtro[posicao][item] = $(el)[0].value;

    //Evita geração de gráfico casa não tenha candidato(a) selecionado(a)
    if ( !verifica_candidatos_pesquisas(nome_cand, posicao) || nome_cand == "") {
        return;
    }

    if (item != "pesquisa")
        window.filtro[posicao][item] = $(el)[0].value;

    var pesquisa = filtro[posicao].pesquisa;
    var dado = filtro[posicao].dado;

    //Atualizando Gráfico;
    $("#" + div_foco).empty();
    if (nome_cand) geraGraficoCircular(pesquisa+"-"+dado+"-"+nome_cand, div_foco, nome_cand);
}

/* Drag and Drop */
function addNewCloneChildren(toClone, toAppend, newid) {
    $(toAppend).removeClass("placeholder");
    toClone.children().clone().appendTo( toAppend );
    $(toAppend).children()[0].id = newid;
}

function clearCorrectDroppables(currentDroppable, newid){
    if ( currentDroppable.id == "cand-esq" ) { //Dropando no box da esquerda
        filtro["esquerda"]["nome_cand"] = "";
        $("#cand-esq").empty();
        $("#graf-cand-esq").empty();
    } else if ( currentDroppable.id == "cand-dir" ) { // Dropando no box da direita
        filtro["direita"]["nome_cand"] = "";
        $("#cand-dir").empty();
        $("#graf-cand-dir").empty();
    }
}

$(function() {
    $("#sortable").sortable();
    $("#sortable").disableSelection();
    $(".draggable").draggable({
        refreshPositions: true,
        opacity: 0.35,
        revert: true,
        cursor: "move",
        drag: function (event, ui) {
            $(".tooltip").remove();;
        }
    });
    $(".droppable").droppable({
        accept: '.draggable',
        drop: function( event, ui ) {
            var candName = ui.draggable.children()[0].id,
                newid = "clone-"+candName;
            clearCorrectDroppables(this, newid);
            if (this.id == "cand-esq"){

                //verificando se o candidato existe na pesquisa
                if (presentes[filtro["esquerda"]["pesquisa"]].indexOf(candName) == -1) return;
                filtro["esquerda"]["nome_cand"] = candName;
                var pesquisa = filtro["esquerda"]["pesquisa"],
                    dado = filtro["esquerda"]["dado"];
                geraGraficoCircular(pesquisa+"-"+dado+"-"+candName, "graf-"+this.id, candName);

            } else if (this.id == "cand-dir") {

                if (presentes[filtro["direita"]["pesquisa"]].indexOf(candName) == -1) return;
                filtro["direita"]["nome_cand"] = candName;
                var pesquisa = filtro["direita"]["pesquisa"],
                    dado = filtro["direita"]["dado"];
                geraGraficoCircular(pesquisa+"-"+dado+"-"+candName, "graf-"+this.id, candName);

            }
            addNewCloneChildren(ui.draggable, this, newid);
        }
    });
});

/* HighCharts functions */
function geraGraficoCircular(tabela, container, nome) {
    
    // Parse the data from an inline table using the Highcharts Data plugin
    var graf = Highcharts.data({
    	table: tabela,
    	startRow: 0,
    	endRow: 5,
    	endColumn: 5,
    	
    	complete: function (options) {
    		
    		// Some further processing of the options
    		options.series.reverse(); // to get the stacking right
    			
    		// Create the chart
    		window.chart = new Highcharts.Chart(Highcharts.merge(options, {
		        colors: cores,
			    chart: {
			        renderTo: container,
			        polar: true,
			        type: 'column'
			    },
			    
			    title: {
			        text: "" 
			    },
			    
			    pane: {
			    	size: '85%'
			    },
			    
			    legend: {
                    enabled: false,
			    	reversed: true,
			    	align: 'center',
			    	verticalAlign: 'bottom',
			    	y: 100,
			    	layout: 'horizontal'
			    },
			    
       xAxis: {
	        tickmarkPlacement: 'on',
                    labels: {
                        y: 3,
                        useHTML: true,
			        	formatter: function () {
                            if ( this.isFirst ) {
                                return "<span style='margin-bottom:30px;'>"+ this.value + "</span>";
                            } else {
			        		    return this.value;
                            }
			        	}
                    }
	    },
			        
			    yAxis: {
                    endOnTick: true,
                    showLastLabel: true,
                    tickPosition: "inside",
                    maxPadding: 0.4,
                    max: 50,
                    tickInterval: 10,
			        labels: {
			        	formatter: function () {
			        		return this.value + '%';
			        	}
			        }
			    },
			    
			    tooltip: {
                    formatter: function() {
                        return this.x + ": <b>" + this.y + "%</b> ";
                    }
			    	//valueSuffix: '%'
			    },
			        
			    plotOptions: {
			        series: {
			        	stacking: 'normal',
			        	shadow: true,
			        	groupPadding: 0,
			        	pointPlacement: 'on',
                        borderColor: "#D4D4D4"
			        }
			    }
			}));
			
		}
	});
}


/* Códigos a serem rodados no carregamento da página */

$('.img-rounded').tooltip();
