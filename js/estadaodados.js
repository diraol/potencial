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
        appendTo: 'body',
        revert: "valid",
        cursor: 'move'
    });
    $(".droppable").droppable({
        accept: '.draggable',
        drop: function( event, ui ) {
            var candName = ui.draggable.children()[0].id,
                newid = "clone-"+candName;
            clearCorrectDroppables(this, newid);
            addNewCloneChildren(ui.draggable, this, newid);
            geraGraficoCircular("freq-"+candName, "graf-"+this.id, candName);
        }
    });
});

/* HighCharts functions */
function geraGraficoCircular(tabela, container, nome) {
    // Parse the data from an inline table using the Highcharts Data plugin
    var graf = Highcharts.data({
    	table: tabela,
    	startRow: 1,
    	endRow: 6,
    	endColumn: 5,
    	
    	complete: function (options) {
    		
    		// Some further processing of the options
    		options.series.reverse(); // to get the stacking right
    			
    		// Create the chart
    		window.chart = new Highcharts.Chart(Highcharts.merge(options, {
		        colors: ["#C2C7D1", "#AD0303", "#4E7ACC", "#0727A6"],
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
			        	pointPlacement: 'on'
			        }
			    }
			}));
			
		}
	});
}
