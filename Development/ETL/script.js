$(function(){
    function urlArgs(url) {
        // Get's URL arguments
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
    
    
    var args    = urlArgs();
    var user    = $('<input />')
                    .attr('id', 'user')
                    .attr('type', 'text')
                    .val(args.user);
    var routeID = $('<input />')
                    .attr('id', 'routeID')
                    .attr('type', 'text')
                    .val(args.routeID);
    var Type    = $('<input />')
                    .attr('id', 'Type')
                    .attr('type', 'text')
                    .val(args.type); 
    var form    = $('<form />')
                    .addClass('task')
                    .append('<div>User:</div>')
                    .append(user)
                    .append('<div>Route ID:</div>')
                    .append(routeID)
                    .append('<div>Type:</div>')
                    .append(Type);
    
    var xmlLink         = $('<a />');
    var createXMLButton = createXML(xmlLink, 'Generate XML');
    
    function createXML(link, linkText) {
        var xml;
        var linkHREF;
        var downloadFileName;
        var currentTime = new Date();
        var month = currentTime.getMonth() + 1;
        var day = currentTime.getDate();
        var year = currentTime.getFullYear();
        
        xml = '<?xml version="1.0"?>';
        xml += '<job>';
        xml += '<task type="'+args.type+'" id="'+args.routeID+'">';
        xml += '</task>';
        xml += '</job>';
        xml = encodeURI(xml);
        
        linkHREF = 'data:text/xml;charset=utf-8,' + xml;
        downloadFileName = 'ETL_Metadata_'+day+'-'+month+'-'+year+'_' + args.user + '_' + currentTime.getTime();
        link.html(linkText);
        link.attr("download", downloadFileName);
        link.attr("href", linkHREF);
    }
    
    var body    = $('body')
                    .append(form)
                    .append(createXMLButton)
                    .append(xmlLink);    
});