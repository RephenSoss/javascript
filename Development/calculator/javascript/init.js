$(function(){
    var args = urlArgs();
    var command = clearHtml(args.command);
    
    var url = $('<input />')
        .attr('type', 'text')
        .attr('id', 'url')
        .val('Link to re-run commands will appear here after a command is run.')
        .appendTo($('body'));
    
    
    var calculator = $('<div />')
        .attr('id', 'calculator')
        .appendTo($('body'))
        .append(
            $('<div />')
                .attr('id', 'query')
                .html('QUERY')
                .dblclick(function(){
                    $(this).effect('pulsate');
                    $(this).html('QUERY') ;
                })
        )
        .append(
            $('<input />')
                .attr('id', 'commandline')
                .attr('type', 'text')
                .val(command || 'route:')
                .focus()
                .keypress(function(event){
                    if(event.charCode !=13 || String($(this).val()) === "") return;
                    $(this).blur();
                    var routeInput = $(this).val().split('route:');
                    if(routeInput.length > 0){
                        for(var i=1; i < routeInput.length; i++){
                            var route = new Route({
                                id: routeInput[i].split(" ")[0],
                                BMP: routeInput[i].split(" ")[1],
                                EMP: routeInput[i].split(" ")[2],
                                originalValue: routeInput[1]
                            });
                            route.fadeIn()
                                .appendTo($('body'));
                            $(this).focus();
                            url.val(window.location.origin + window.location.pathname +'?command='+ encodeURI($(this).val()))
                        }
                        
                    }
                
                })
                
        );
    if(command){
        var e = jQuery.Event("keypress");
        e.charCode = 13;
        $('#commandline').trigger(e);
    }
    
    
    function Route(options){
        var self = this;
        self.id = options.id || null;
        self.BMP = options.BMP || null;
        self.EMP = options.EMP || null;
        self.originalValue = options.originalValue || null;
        
        var query =$('#query');
        var firstValue = query.html() === 'QUERY' ? true: false;
        if (firstValue){query.html('');}
        var queryValue = firstValue ? 'RTE_ID = \''+ self.id + "'": ' OR RTE_ID = \'' + self.id + "'"; 
        query.append(queryValue);
        
        var div = $('<div />')
            .attr('id', '#'+ self.id)
            .attr('BMP', '#'+ self.BMP)
            .attr('EMP', '#'+ self.EMP)
            .addClass('route')
            .draggable()
            .droppable({
                accept: ".route",
                activeClass: "routeActive",
                hoverClass: "routeHover",
                drop: function(event, ui) {
                    var bmp1 = $(this).find('.BMP').html().split('BMP:')[1];
                    var emp1 = $(this).find('.EMP').html().split('EMP:')[1];
                    var len1 = $(this).find('.LEN').html().split('LEN:')[1];
                    var bmp2 = ui.helper.find('.BMP').html().split('BMP:')[1];
                    var emp2 = ui.helper.find('.EMP').html().split('EMP:')[1];
                    var len2 = ui.helper.find('.LEN').html().split('LEN:')[1];
                    var bmpdiff = (Math.abs(parseFloat(bmp1,10) - parseFloat(bmp2,10))).toFixed(3);
                    var empdiff = (Math.abs(parseFloat(emp1,10) - parseFloat(emp2,10))).toFixed(3);
                    var lendiff = (Math.abs(parseFloat(len1,10) - parseFloat(len2,10))).toFixed(3);
                    var bmpsum = (Math.abs(parseFloat(bmp1,10) + parseFloat(bmp2,10))).toFixed(3);
                    var empsum = (Math.abs(parseFloat(emp1,10) + parseFloat(emp2,10))).toFixed(3);
                    var lensum = (Math.abs(parseFloat(len1,10) + parseFloat(len2,10))).toFixed(3);
                    ui.helper.find('.DIFF')
                        .html('')
                        .append(
                            $('<div />').html('BMP: ' + bmpdiff)
                        )
                        .append(
                            $('<div />').html('EMP: ' + empdiff)
                        )
                        .append(
                            $('<div />').html('LEN: ' + lendiff)
                        );
                    ui.helper.find('.SUM')
                        .html('')
                        .append(
                            $('<div />').html('BMP: ' + bmpsum)
                        )
                        .append(
                            $('<div />').html('EMP: ' + empsum)
                        )
                        .append(
                            $('<div />').html('LEN: ' + lensum)
                        );
                    
                    var tBMP = ui.helper.find('.TALLY').find('.tallyBMP').html().split('BMP:')[1];
                    var tEMP = ui.helper.find('.TALLY').find('.tallyEMP').html().split('EMP:')[1];
                    var tLEN = ui.helper.find('.TALLY').find('.tallyLEN').html().split('LEN:')[1];
                    var tBMP2 = (Math.abs(parseFloat(bmp1,10) + parseFloat(tBMP,10))).toFixed(3);
                    var tEMP2 = (Math.abs(parseFloat(emp1,10) + parseFloat(tEMP,10))).toFixed(3);
                    var tLEN2 = (Math.abs(parseFloat(len1,10) + parseFloat(tLEN,10))).toFixed(3);
                    
                    ui.helper.find('.TALLY').find('.tallyBMP').html('BMP: ' + tBMP2);
                    ui.helper.find('.TALLY').find('.tallyEMP').html('EMP: ' + tEMP2);
                    ui.helper.find('.TALLY').find('.tallyLEN').html('LEN: ' + tLEN2);
              }
            })
            .dblclick(function(event){
                $(this).effect('drop', function(){
                    $(this).remove();   
                });
            })
            .append(
                $('<div />')
                    .attr('id', self.id)
                    .html(self.id)
            )
            .append(
                $('<div />')
                    .attr('id', self.BMP)
                    .addClass('BMP')
                    .html('BMP: ' + self.BMP)
            )
            .append(
                $('<div />')
                    .attr('id', self.EMP)
                    .addClass('EMP')
                    .html('EMP: ' + self.EMP)
            )
            .append(
                $('<div />')
                    .attr('id','LEN')
                    .addClass('LEN')
                    .html('LEN: ' + ((parseFloat(self.EMP,10) - parseFloat(self.BMP,10))).toFixed(3))
            )
            .append(
                $('<div />')
                    .attr('id', 'DIFF')
                    .addClass('DIFF')
                    .html('Difference')
            )
            .append(
                $('<div />')
                    .attr('id', 'SUM')
                    .addClass('SUM')
                    .html('Sum')
            )
            .append(
                $('<div />')
                    .attr('id', 'TALLY')
                    .addClass('TALLY')
                    .append(
                        $('<div />').html('BMP: ' +  self.BMP).addClass('tallyBMP')
                    )
                    .append(
                        $('<div />').html('EMP: ' + self.EMP).addClass('tallyEMP')
                    )
                    .append(
                        $('<div />').html('LEN: ' + ((parseFloat(self.EMP,10) - parseFloat(self.BMP,10))).toFixed(3)).addClass('tallyLEN')
                    )
            );
        return div;
    }
    
    function urlArgs(url) {
        var args = {};
        var query;
        var i;
        if (url) {
            i= url.indexOf('?');
            query = url.substring(i).substring(1);
        } else {
            query = location.search.substring(1);
        }
        var pairs = query.split("&");
        for (i = 0; i < pairs.length; i++) {
            var pos = pairs[i].indexOf('=');
            if (pos == -1) continue;
            var name = pairs[i].substring(0, pos);
            var value = pairs[i].substring(pos + 1);
            value = decodeURIComponent(value);
            args[name] = value;
        }
        return args;
    }
    function clearHtml(text) {
        if(typeof text != 'string') return false;
        try {
            return String(text).replace(/<(?:.|\n)*?>/gm, '');
        } catch (err) {
            console.log('Clear HTML Error:', err);
            return false;
        }
    }
});