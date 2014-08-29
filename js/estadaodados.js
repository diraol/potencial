/* ********** Load ************* */

/* ******* FILTROS ********** */
    var cores = ["#262659", "#265926", "#B88FA3", "#B8B88F"],
    filtro = {
        "esquerda": {
            "pesquisa": "p8",
            "pergunta": "reg-br",
            "nome_cand": "",
            "container": "graf-cand-esq"
        },
        "direita": {
            "pesquisa": "p8",
            "pergunta": "reg-br",
            "nome_cand": "",
            "container": "graf-cand-dir"
        }
    },
    jsonFile = "dados/dados.json",
    mainData = {};

    var label_perguntas = {
        "reg-br": ["Região","Brasil"],
        "reg-ne": ["Região","Nordeste"],
        "reg-nco": ["Região","Norte e Centro-Oeste"],
        "reg-se": ["Região","Sudeste"],
        "reg-s": ["Região","Sul"],
        "esc-fund1": ["Escolaridade","Fundamental"],
        "esc-fund2": ["Escolaridade","5ª a 8ª Série"],
        "esc-med": ["Escolaridade","Ensino Médio"],
        "esc-sup": ["Escolaridade","Ensino Superior"],
        "renda-1sm": ["Renda (SM)","Até 1"],
        "renda-2sm": ["Renda (SM)","Mais de 1 a 2"],
        "renda-5sm": ["Renda (SM)","Mais de 2 a 5"],
        "renda-m5sm": ["Renda (SM)","Mais de 5"],
        "porte-20mil": ["Porte do Município (Habitantes)","Cidades com até 20 mil"],
        "porte-20-a-100mil": ["Porte do Município (Habitantes)","Cidades de 20 a 100 mil"],
        "porte-100mil": ["Porte do Município (Habitantes)","Cidades com mais de 100 mil"]
    }


function candidatos_lado(lado) {
    candidatos = [];
    for (cand in mainData[$("#selecao_pesquisa_" + lado)[0].value].data) {
        candidatos.push(cand);
    }
    return candidatos;
}

function candidatos_possiveis(){
    //Candidatos que aparecem em alguma das pesquisas selecionadas
    var candidatos = [].concat(candidatos_lado("esquerda"));
    cand_dir = [].concat(candidatos_lado("direita"));
    for (idx in cand_dir) {
        if (candidatos.indexOf(cand_dir[idx]) == -1) {
            candidatos.push(cand_dir[idx]);

        }
    }
    return candidatos;
}

function atualizar_fotos(){
    candidatos = candidatos_possiveis();
    fotos = $(".cand");
    for (idx in fotos) {
        nome = fotos[idx].title;
        id = fotos[idx].id;
        if (candidatos.indexOf(nome) == -1) {
            $("#" + id).parent().fadeOut().addClass('oculto');
        } else {
            $("#" + id).parent().show().fadeIn().removeClass('oculto');
        }
    }
}

function limpar_candidato_de_um_lado(lado) {
    if (lado == "esquerda") {
        $("#cand-esq, #graf-cand-esq").fadeOut(200, function(){
            $("#cand-esq, #graf-cand-esq").empty()
            .fadeIn(400);
            $("#cand-esq").addClass("placeholder");
        });
        filtro["esquerda"]["nome_cand"] = "";
    } else {
        $("#cand-dir, #graf-cand-dir").fadeOut(200, function(){
            $("#cand-dir, #graf-cand-dir").empty()
            .fadeIn(400);
            $("#cand-dir").addClass("placeholder");
        });
        filtro["direita"]["nome_cand"] = "";
    }
}

function verifica_candidato(nome, lado) {
    var candidatos_possiveis = candidatos_lado(lado);
    if (candidatos_possiveis.indexOf(nome) == -1) {
        return false;
    } else {
        return true;
    }
}

function emiteAlerta(div_id) {
    jQuery('<div/>', {
        id: 'alerta',
        class: 'alert alert-error',
        text: 'Potencial de voto não aferido nesta pesquisa.'
    }).appendTo('#' + div_id);
}

/* Chamada de mudança de filtro */
function altera_filtro(posicao, item, el) {

    var div_foco = "",
        div_foto = "",
        nome_cand = filtro[posicao]["nome_cand"];

    if (posicao == "esquerda") {
        div_foco = "graf-cand-esq";
        div_foto = "cand-esq";
    } else {
        div_foco = "graf-cand-dir";
        div_foto = "cand-esq";
    }

    if (item == "pesquisa") {
        window.filtro[posicao][item] = $(el)[0].value;
        atualizar_fotos();
    }

    //Evita geração de gráfico casa não tenha candidato(a) selecionado(a)
    if ( !verifica_candidato(nome_cand, posicao) || nome_cand == "") {
        limpar_candidato_de_um_lado(posicao);
        return;
    }

    if (item != "pesquisa")
        window.filtro[posicao][item] = $(el)[0].value;

    var pesquisa = filtro[posicao]["pesquisa"];
    var pergunta = filtro[posicao]["pergunta"];

    //Atualizando Gráfico;
    $("#" + div_foco).empty();
    if (nome_cand) geraGraficoCircular(filtro[posicao]);
}

/* Drag and Drop */
function addNewCloneChildren(toClone, toAppend, newid) {
    $(toAppend).removeClass("placeholder");
    toClone.children().clone().appendTo( toAppend );
    $(toAppend).children()[0].id = newid;
}

function clearCorrectDroppables(currentDroppable){
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
            var candName = ui.draggable.children()[0].title,
                newid = "clone-"+candName;
            clearCorrectDroppables(this);
            if (this.id == "cand-esq"){
                presentes = candidatos_lado("esquerda")
                //verificando se o candidato existe na pesquisa
                if (presentes.indexOf(candName) == -1) return;
                filtro["esquerda"]["nome_cand"] = candName;
                var pesquisa = filtro["esquerda"]["pesquisa"],
                    pergunta = filtro["esquerda"]["pergunta"];
                //geraGraficoCircular(pesquisa+"-"+pergunta+"-"+candName, "graf-"+this.id, candName);
                geraGraficoCircular(filtro["esquerda"]);

            } else if (this.id == "cand-dir") {
                presentes = candidatos_lado("direita")
                //verificando se o candidato existe na pesquisa
                //if (presentes[filtro["direita"]["pesquisa"]].indexOf(candName) == -1) return;
                if (presentes.indexOf(candName) == -1) return;
                filtro["direita"]["nome_cand"] = candName;
                var pesquisa = filtro["direita"]["pesquisa"],
                    pergunta = filtro["direita"]["pergunta"];
                //geraGraficoCircular(pesquisa+"-"+pergunta+"-"+candName, "graf-"+this.id, candName);
                geraGraficoCircular(filtro["direita"]);

            }
            addNewCloneChildren(ui.draggable, this, newid);
        }
    });
});

/* HighCharts functions */
function geraGraficoCircular(chave_filtro) {

    var options = {
            chart: {
                renderTo: chave_filtro['container'],
                polar: true,
                type: 'column',
                reflow: true
            },

            exporting: {
                enabled: false
            },

            title: {
                text: ""
            },

            pane: {
                startAngle: 0
            },

            xAxis: {
                categories: ["Votaria com certeza","Poderia votar","Não votaria de jeito nenhum","Não conhece ou não sabe"],
                tickmarkPlacement: 'on',
                labels: {
                    y: 3,
                    useHTML: true,
                    formatter: function () {
                        if (this.isFirst) {
                            return "<span style='margin-bottom: 30px; white-space: nowrap; margin-left: -15px;'>"+ this.value + "</span>";
                        } else {
                            if (this.value == "Não conhece ou não sabe") {
                            return "<span style='margin-top: 30px; display:block;'></span>"+ this.value;
                            } else {
                                return this.value;
                            }
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
                pointFormat: '<span style="color: {series.color}; font-weight: bold;">{point.y}</span>',
                valueSuffix: '%',
                shared: true
            },

            plotOptions: {
                column: {
                    allowPointSelect: true,
                    colorByPoint: true,
                    colors: cores
                },
                series: {
                    stacking: 'normal',
                    shadow: true,
                    groupPadding: 0,
                    pointPlacement: 'on',
                    borderColor: "#D4D4D4"
                }
            },

            legend: {
                enabled: false,
            },

            series:[{}]
        }

    pergunta_cat = label_perguntas[chave_filtro['pergunta']][0];
    opcao_pergunta = label_perguntas[chave_filtro['pergunta']][1];
    options.series[0].data = mainData[chave_filtro['pesquisa']]["data"][chave_filtro['nome_cand']][pergunta_cat][opcao_pergunta];
    window.chart = new Highcharts.Chart(options);
}

function carrega_combos(){
    //Preenchendo o combo de pesquisas existentes
    for ( var pesquisa in mainData ){
        $('#selecao_pesquisa_esquerda').append(new Option(mainData.pesquisa.nome, pesquisa, true, true));
        $('#selecao_pesquisa_direita').append(new Option(mainData.pesquisa.nome, pesquisa, true, true));
        ultima_pesquisa = pesquisa;
    }
}

function first_load_on_html(){
    var esquerda = $("#selecao_pesquisa_esquerda"),
        direita = $("#selecao_pesquisa_direita"),
        rodape = $("footer small:first"),
        ultima_pesquisa = "";
    $.each(mainData,function(index,value){
        esquerda.prepend($("<option>").attr('value',index).text(value.name));
        direita.prepend($("<option>").attr('value',index).text(value.name));
        rodape.prepend("Na pesquisa de " + value.mes + ", o Ibope entrevistou face a face " + value.entrevistas + " eleitores em " + value.municipios + " municípios de todas as regiões do Brasil entre os dias " + value.dias + " daquele mês.<br/>");
        ultima_pesquisa = index;
    });
    $('#selecao_pesquisa_esquerda option[value='+ultima_pesquisa+']').attr("selected","selected");
    $('#selecao_pesquisa_direita option[value='+ultima_pesquisa+']').attr("selected","selected");
    atualizar_fotos();
}

function preenche_rodape_pesqusias(){
}

/* Códigos a serem rodados no carregamento da página */
$('.img-rounded').tooltip(); /* Adicionando tooltip */
$(document).ready(function(){
    $.getJSON('dados/dados.json').done(function(dados) {
        window.mainData = dados[0];
        first_load_on_html();
        }).error(function(jqxhr, textStatus, error){
            var err = textStatus + ", " + error;
            console.log( "Request Failed: " + err );
        });
});
