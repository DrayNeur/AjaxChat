var username = "";
var lastCode = 0;

var getHttpRequest = function() {
    var httpRequest = false;

    if (window.XMLHttpRequest) {
        httpRequest = new XMLHttpRequest();
        if (httpRequest.overrideMimeType) {
            httpRequest.overrideMimeType('text/xml');
        }
    } else if (window.ActiveXObject) {
        try {
            httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
                httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {}
        }
    }
    if (!httpRequest) {
        alert("Error: Unable to create XMLHTTP instance!");
        return false;
    }
    return httpRequest;
}
window.onload = function() {
    $('#opened-chat').css('display', 'none');
}

function sendMessage() {
    var httpRequest = getHttpRequest();
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState == 4) {
            if (httpRequest.responseText == "invalid_request" || httpRequest.responseText != "ok") {
                console.log("Internal server error !")
            }
        }
    }
    httpRequest.open('GET', 'chat_api.php?a=sendMessage&b=' + username + '&c=' + $('#msg').val(), true);
    httpRequest.send();
    $('#msg').val("");
}

function addMessage(username, msg) {
    $("#chat-container").append('<div class="message"><p class="username">' + username + '</p><div class="content alert alert-primary" role="alert">' + msg + '</div></div>');
}

function openChat() {
    username = $('#name').val();
    $('#register').css('display', 'none');
    $('#opened-chat').css('display', 'block');
}
let timeout;
setInterval(function() {
    var httpRequest = getHttpRequest();
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState == 4) {
            if (httpRequest.responseText == "invalid_request" || !httpRequest.responseText.startsWith("receive")) {
                console.log("timed out");
                timeout = false;
            } else {
                var res = httpRequest.responseText.split(":");
                if (res[1] != lastCode) {
                    lastCode = res[1];
                    addMessage(res[2], res[3]);
                    timeout = false;
                }
                timeout = false;
            }
        }
    }
    if (!timeout) {
        httpRequest.open('GET', 'chat_api.php?a=getNewMessage', true);
        httpRequest.send();
        timeout = true;
    }
}, 40);