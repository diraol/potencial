/* ********** Load ************* */


/* ******* FILTROS ********** */
var filtro_dados = "reg-br";
function opcao_selecionada_do_select(el) {
    var $select = $(el),
        si = $select.get(0).selectedIndex,
        selectedOptGrp = null; 
        console.log(si);
    if (si <= 4) {
        console.log("0");
        selectedOptGrp = $select.children()[0];
    } else if ( 5 <= si || si <= 8 ) {
        console.log("1");
        $selectedOptGrp = $($select.children()[1]);
        si = si - 5;
    } else if ( 9 <= si || si <= 13 ) {
        console.log("2");
        $selectedOptGrp = $($select.children()[2]);
        si = si - 9;
    } else {
        console.log("3");
        $selectedOptGrp = $($select.children()[3]);
        si = si - 14;
    }
    console.log(selectedOptGrp);
    //console.log($selectedOptGrp.children());
    return $selectedOpt;
}
    /* Chamda de mudança de filtro */
function altera_filtro_potencial(el) {
    filtro_dados = opcao_selecionada_do_select(el);
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
        cursor: "move"

    });
    $(".droppable").droppable({
        accept: '.draggable',
        drop: function( event, ui ) {
            var candName = ui.draggable.children()[0].id,
                newid = "clone-"+candName;
            clearCorrectDroppables(this, newid);
            addNewCloneChildren(ui.draggable, this, newid);
            geraGraficoCircular(filtro_dados+"-"+candName, "graf-"+this.id, candName);
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
		        colors: ["#EDC511", "#C9040E", "#99D3E0", "#000961"],
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
			    	valueSuffix: '%'
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
