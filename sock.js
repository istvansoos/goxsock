    
var WebSocket = require('ws');
var jsonsp = require('jsonsp');
var parser = new jsonsp.Parser();
var buy;
var sell;

parser.on('object', function(obj){
    if(obj.channel_name == "ticker.BTCUSD" && obj.ticker != undefined){
        buy = obj.ticker.buy.value;
        sell = obj.ticker.sell.value;
    }else if(obj.channel_name == "trade.BTC"){
        console.log(obj.trade.trade_type + ", Size:" + obj.trade.amount  +" @ " + obj.trade.price + obj.trade.price_currency +  " ,type: " + obj.trade.properties + "||Buy:"+ buy+ "| Sell: " + sell );
    };
});

var ws = new WebSocket('ws://websocket.mtgox.com/mtgox', {protocolVersion: 8, origin: 'http://www.asdflqwerty.ui'});

ws.on('connect', function() { 
    console.log('connected to server'); 
    unsubscribe('ticker.BTCUSD'); 
    unsubscribe('depth.BTCUSD');
});

ws.on('message', function(message) { 
    //console.log('received a message!');
    parser.parse(message.toString('utf8'));
});

ws.on('disconnect', function() { 
    console.log('disconnected from server'); 
});

ws.on('error', function(data){
    console.log('%s', data);;
});

var subscribe = function(channel) {
    console.log('subscribing to channel:', channel)
    ws.send(JSON.stringify({ op: 'mtgox.subscribe', channel: channel }))
}

var unsubscribe = function(channel) {
    console.log('subscribing to channel:', channel)
    ws.emit('message' ,JSON.stringify({ op: 'unsubscribe', channel: channel }))
}







