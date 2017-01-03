'use strict';

import $ = require('jquery');
import Example = require('./app/example');

const app = function () {
  let instances = {};

  const init = function(){
    instances['example'] = {'body': Example()};
  };

  const getInstance = function(name: string, selector: any) {
    return instances[name][selector.toString()]
  };

  const getInstanceCollection = function(name: string) {
    return instances[name]
  };

  init();
};

app();
