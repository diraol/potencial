/* ********** Load ************* */

/* ******* FILTROS ********** */
var filtro_dados = "reg-br",
    nome_cand_esq = "",
    nome_cand_dir = "",
    cores = ["#EDC511", "#C9040E", "#99D3E0", "#000961"];

/* Chamda de mudança de filtro */
function altera_filtro_potencial(el) {
    filtro_dados = $(el)[0].value;//opcao_selecionada_do_select(el);
    //Atualizando Gráfico da esquerda;
    $("#graf-cand-esq").empty();
    geraGraficoCircular(filtro_dados+"-"+nome_cand_esq, "graf-cand-esq", nome_cand_esq);
    //Atualizando Gráfico da direita;
    $("#graf-cand-dir").empty();
    geraGraficoCircular(filtro_dados+"-"+nome_cand_dir, "graf-cand-dir", nome_cand_dir);
}

/* Drag and Drop */
function addNewCloneChildren(toClone, toAppend, newid) {
    $(toAppend).removeClass("placeholder");
    toClone.children().clone().appendTo( toAppend );
    $(toAppend).children()[0].id = newid;
}

function clearCorrectDroppables(currentDroppable, newid){
    if ( (currentDroppable.id == "cand-esq") ) { //Dropando no box da esquerda
        $("#cand-esq").empty();
        $("#graf-cand-esq").empty();
        if ($("#cand-dir").children()[0]) { //tem filhos?
            if ($("#cand-dir").children()[0].id == newid) {//cand já está no outro lado - remove
                $("#cand-dir").empty();
                $("#graf-cand-dir").empty();
                $("#cand-dir").addClass("placeholder");
            }
        }
    } else if ( (currentDroppable.id == "cand-dir") ) { // Dropando no box da direita
        $("#cand-dir").empty();
        $("#graf-cand-dir").empty();
        if ($("#cand-esq").children()[0]) { //tem filhos?
            if ($("#cand-esq").children()[0].id == newid) {//cand já está no outro lado - remove
                $("#cand-esq").empty();
                $("#graf-cand-esq").empty();
                $("#cand-esq").addClass("placeholder");
            }
        }
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
            addNewCloneChildren(ui.draggable, this, newid);
            geraGraficoCircular(filtro_dados+"-"+candName, "graf-"+this.id, candName);
            if (this.id == "cand-esq"){
                nome_cand_esq = candName;
            } else {
                nome_cand_dir = candName;
            }
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
