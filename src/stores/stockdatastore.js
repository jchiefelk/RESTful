'use strict';
var AppDispatcher = require('../dispatcher/AppDispatcher');
var appConstants = require('../constants/appConstants');
var objectAssign = require('object-assign');
var EventEmitter = require('events').EventEmitter;
var CHANGE_EVENT = 'change';
var moment = require('moment');

var _store = {
  intradaydata: [],
  status: null
};

function StockData(){
    this.IntraDay = {
        name: null,
        data: [],
        market: null
    };
};

StockData.prototype.updateIntradayTicket = function(item){
  console.log('Update Intraday');
 // console.log(item);
  this.IntraDay.data=[];
  this.IntraDay.name = item.dataset.name;
  for(var x = item.dataset.data.length-1; x >=0 ; x--){
        let data = {
          date: item.dataset.data[x][0],
          close: item.dataset.data[x][4],
          volume: null
        }; 
        if(item.dataset.data[x][5]!=null){
          data.volume = item.dataset.data[x][5].toExponential(2);
        } 

        this.IntraDay.data.push(data);
  };
  StockDataStore.emit(CHANGE_EVENT);
};


StockData.prototype.updateMarket = function(item){
  this.IntraDay.market = item;
};

var Stocks = new StockData();

var StockDataStore = objectAssign({}, EventEmitter.prototype, {
  addChangeListener: function(cb){
    this.on(CHANGE_EVENT, cb);
  },
  removeChangeListener: function(cb){
    this.removeListener(CHANGE_EVENT, cb);
  },
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },
  getInradayTicketData: function() {
    return Stocks.IntraDay;
  },
  getMarket: function(){
    return Stocks.IntraDay.market;
  },
  getStatus: function(){
    return _store.status;
  }

});

AppDispatcher.register(function(payload){
  var action = payload.action;
  switch(action.actionType){
    case appConstants.SAVE_CLICKED:  
      StockDataStore.emit(CHANGE_EVENT);
      break;
    case appConstants.MARKET:
      Stocks.updateMarket(action.data);
      StockDataStore.emitChange(CHANGE_EVENT);
      break;
    case appConstants.INTRADAYTICKET:
      Stocks.updateIntradayTicket(action.data);
      break;
    case appConstants.STATUS:
      _store.status = action.data;
      break;
    default:
      return true;
  }
});
module.exports = StockDataStore;
