import $ from 'jquery';

$.ajaxSetup({
  headers: {
    'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
  }
});

export var indexTasks = function (successCB, errorCB) {
  var request = {
    type: 'GET',
    url: 'api/tasks?api_key=1',
    success: successCB,
    error: errorCB
  }

  $.ajax(request);
};

export var task = function (id, successCB, errorCB) {
  var request = {
    type: 'GET',
    url: 'api/tasks/' + id + '?api_key=1',
    success: successCB,
    error: errorCB
  }

  $.ajax(request);
}


export var postTask = function (content, successCB, errorCB) {
  var request = {
    type: 'POST',
    url: 'api/tasks?api_key=1',
    data: {
      task: {
        content: content
      }
    },
    success: successCB,
    error: errorCB
  }

  $.ajax(request);
};

export var deleteTask = function (id, successCB, errorCB) {
  var request = {
    type: 'DELETE',
    url: 'api/tasks/' + id + '?api_key=1',
    success: successCB,
    error: errorCB
  }

  $.ajax(request);
}

export var completeTask = function (id, isComplete, successCB, errorCB) {
  var request = {
    type: 'PUT',
    url: 'api/tasks/' + id + '/' + isComplete + '?api_key=1',
    successCB: successCB,
    error: errorCB
  }

  $.ajax(request);
}