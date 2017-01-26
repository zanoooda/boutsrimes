var socket = io();

function initialize(results) {
    var verses = results[0];
    var lines = results[1];
    verses.forEach(function(verse) {
        verse.lines = [];
        lines.forEach(function(line) {
            if(line.verse == verse._id) {
                verse.lines.push(line);
            }
        });
    });
    var str = "";
    var counter = 0;
    verses.forEach(function(verse, i) {
        // Change all
        var index = i + 1;
        if(index == 1 || i % 3 == 0) {
            str += '<div class="row">';
        }
        str += '<div class="verse col-md-4">';
        str += '<div class="well" style="text-align: center">';

        //TODO: Add the id for the div wich contains the verse lines.
        str += '<div style="display: inline-block; text-align: left">';

        str += '<h3 class="text-center">';
        str += verse.title;
        str += '</h3>';

        str += '<br />';

        verse.lines.forEach(function (line) {
            str += '<p>' + line.body + '</p>';
        });

        str += '</div>';

        str += '<div class="input-group">';
        str += '<input id="input-' + verse._id + '" type="text" class="form-control">';
        str += '<span class="input-group-btn">';
        str += '<button class="write btn btn-default" type="button" onclick="writeLine(\'';
        str += verse._id;
        str += '\')">Publish!</button>';
        str += '</span>';
        str += '</div>';

        str += '<div style="display: inline-block; text-align: left">';

        var residual = 4;

        str += '<br />';

        for(var i = 0; i < residual; i++) {
            str += '<p>***</p>';
        }

        str += '</div>';

        str += '<br />';
        str += '<br />';
        str += '<div class="text-right">';
        str += '<span><i>id: ' + verse._id + '</i></span>';
        str += '</div>';

        str += '</div>';
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
    socket.emit('write line', {
        body: $("#input-" + verseId).val(),
        author: null,
        verse: verseId
    });
    //TODO: Refresh the verse view
}

$(document).ready(function () {
    socket.on('initialize', function(results) {
        initialize(results);
        
        socket.on('update verse', function(data) {
             //updateVerse();
        });
    });

    // socket.emit('join author', {
    //     name: "First One"
    // });

    // socket.emit('create verse', {
    //     title: 'SEVEN',
    //     author: '584b34df46006b1a7cc7fd66'
    // });
});