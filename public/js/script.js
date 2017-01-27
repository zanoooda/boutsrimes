var socket = io();

function initialize(verses) {
    var str = "";
    var counter = 0;
    verses.forEach(function(verse, i) {
        // Change all
        var index = i + 1;
        if(index == 1 || i % 3 == 0) {
            str += '<div class="row">';
        }
        str += '<div id="';
        str += verse._id;
        str += '" class="verse col-md-4">';

        str += renderVerse(verse);
        
        str += '</div>';

        if(index == counter + 3 || index == verses.length) {
            str += '</div>';
            counter = index;
        }
    });
    $('#body').append(str);
    $(".write").click(function() {
        var verseId;
        
    });
}

function writeLine(verseId) {
    //TODO: Check that verse property not saved in database
    socket.emit('write line', {
        body: $('#input-' + verseId).val(),
        verse: verseId
    });
    //TODO: Refresh the verse view
}

function updateVerse(verse) {
    $('#' + verse._id).html(renderVerse(verse));
}
//TODO: Remake it with writing structure first
function renderVerse(verse) {
    htmlString = '';

    htmlString += '<div class="well" style="text-align: center">';

    //TODO: Add the id for the div wich contains the verse lines.
    htmlString += '<div style="display: inline-block; text-align: left">';

    htmlString += '<h3 class="text-center">';
    htmlString += verse.title;
    htmlString += '</h3>';

    htmlString += '<br />';

    verse.lines.forEach(function (line) {
        htmlString += '<p>' + line.body + '</p>';
    });

    htmlString += '</div>';

    htmlString += '<div class="input-group">';
    htmlString += '<input id="input-' + verse._id + '" type="text" class="form-control">';
    htmlString += '<span class="input-group-btn">';
    htmlString += '<button class="write btn btn-default" type="button" onclick="writeLine(\'';
    htmlString += verse._id;
    htmlString += '\')">Publish!</button>';
    htmlString += '</span>';
    htmlString += '</div>';

    htmlString += '<div style="display: inline-block; text-align: left">';

    var residual = 4;

    htmlString += '<br />';

    for(var i = 0; i < residual; i++) {
        htmlString += '<p>***</p>';
    }

    htmlString += '</div>';

    htmlString += '<br />';
    htmlString += '<br />';
    htmlString += '<div class="text-right">';
    htmlString += '<span><i>id: ' + verse._id + '</i></span>';
    htmlString += '</div>';

    htmlString += '</div>';

    return htmlString;
}

$(document).ready(function () {
    socket.on('initialize', function(results) {
        initialize(results);
        
        socket.on('update verse', function(verse) {
             updateVerse(verse);
        });
    });
});

// Console functions for debuging

function createVerse(title) {
    socket.emit('create verse', {
        title: title
    });
}

function joinAuthor(name) {
    socket.emit('join author', {
        name: name
    });
}