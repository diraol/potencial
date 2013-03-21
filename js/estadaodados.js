function addNewCloneChildren(toClone, toAppend, newid) {
    $(toAppend).empty();
    $(toAppend).removeClass("placeholder");
    toClone.children().clone().appendTo( toAppend );
    $(toAppend).children()[0].id = newid;
}

function clearCorrectDroppables(currentDroppable, newid){
    if ( (currentDroppable.id == "cand-esq") ) {
        if ($("#cand-dir").children()[0]) { //tem filhos?
            if ($("#cand-dir").children()[0].id == newid) {//cand já está no outro lado - remove
                $("#cand-dir").empty();
                $("#cand-dir").addClass("placeholder");
            }
        }
    } else if ( (currentDroppable.id == "cand-dir") ) {
        if ($("#cand-esq").children()[0]) { //tem filhos?
            if ($("#cand-esq").children()[0].id == newid) {//cand já está no outro lado - remove
                $("#cand-esq").empty();
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
        helper: "clone",
        revert: "valid",
        cursor: 'move'
    });
    $(".droppable").droppable({
        accept: '.draggable',
        drop: function( event, ui ) {
            var newid = "clone-"+ui.draggable.children()[0].id;
            clearCorrectDroppables(this, newid);
            addNewCloneChildren(ui.draggable, this, newid);
        }
    });
});
