import $ from 'jquery';

import {
  indexTasks,
  postTask,
  deleteTask, 
  completeTask, 
  task
} from "./requests.js";

indexTasks(function (response) {
  console.log(response);
  var htmlString = response.tasks.map(function (task) {
    addTask(task.content, task.id, task.created_at, task.completed);
  });
});

$(document).on('click', '.trash-button', function (e) {
  var id = $(this).val()
  var row = $(this).closest('tr')

  deleteTask(id, function(response) {
    if (!response.success) {
      return
    }
    row.remove()
  })
})

$(document).on('change', '.checkbox', function (e) {
  var id = $(this).val();

  task(id, function(response) {
    var isComplete;
    if (response.task.completed) isComplete = 'mark_active';
    else isComplete = 'mark_complete';
    completeTask(id, isComplete);
  })

  

});

window.addEventListener("load", (event) => {
  $('#add-task').on('submit', function (e) {
    e.preventDefault();
    var name = $(this).children('[name=task-name]').val();

    postTask(name, function(response) {
      console.log(response);
      const { content, id, created_at, completed } = response.task;
      addTask(content, id, created_at, completed);
    })
  })
});


var addTask = function (task, id, madeOn, status) {
  $('<tr></tr>').appendTo('tbody')
  $('<td></td>', {
    html: '<input class="checkbox" type="checkbox" value="' + id + '" id="' + id + '" />',
  }).appendTo('tbody tr:last-child');
  $("#" + id).prop('checked', status)

  $('<td></td>', {
    html: task,
  }).appendTo('tbody tr:last-child');

  $('<td></td>', {
    html: madeOn,
  }).appendTo('tbody tr:last-child');

  $('<td></td>', {
    html: '<button class="trash-button ms-5" value="' + id + '">Delete</button>',
  }).appendTo('tbody tr:last-child');
}


//Gets Time
var currentTime = function () {
  var d = new Date();
  var date = [d.getFullYear(), d.getMonth() + 1, d.getDate()];
  var time = [d.getHours(), d.getMinutes(), d.getSeconds()];
  var dateFormat = date.join('-') + 'T' + time.map(function
    (num) {
    if (num < 10) {
      return '0' + num;
    }
    else { return num };
  }).join(':');

  $('.date').text(dateFormat)

  setTimeofDay(d.getHours())
  return dateFormat;
}

//Changes background color and greeting
var setTimeofDay = function (time) {
  var backgroundColor = {
    5: 'Morning',
    12: 'Afternoon',
    17: 'Evening',
    19: 'Night',
  }

  if (time > 4 && time < 12) {
    $('body').addClass(backgroundColor[5])
    $('#greeting').text(backgroundColor[5])
    $('#sun').css('bottom', '-75px')
    $('#sun').css('left', '30%')
  }
  else if (time > 11 && time < 17) {
    $('body').addClass(backgroundColor[12])
    $('#greeting').text(backgroundColor[12])
    $('#sun').css('bottom', '-30px')
    $('#sun').css('left', '48%')
  }
  else if (time > 16 && time < 19) {
    $('body').addClass(backgroundColor[17])
    $('#greeting').text(backgroundColor[17])
    $('#sun').css('bottom', '-75px')
    $('#sun').css('left', '70%')
  }
  else {
    $('body').addClass(backgroundColor[19])
    $('#greeting').text(backgroundColor[19])
    $('#sun').css('bottom', '-75px')
    $('#sun').css('left', '48%')
    $('#sun').css('background-color', 'white')
  }
}
//Updates the clock every 5 seconds
setInterval(currentTime, 5000);

$(document).on('click', '.completed-list', function() {
  $('.active-list').removeClass('active-btn');
  $('.completed-list').addClass('active-btn');
  $('.all-list').removeClass('active-btn');
  indexTasks(function (response) {
    var htmlString = response.tasks.filter(function (task) {
      return task.completed
    });
    displayFilter(htmlString);
  });
});

$(document).on('click', '.active-list', function () {
  $('.active-list').addClass('active-btn');
  $('.completed-list').removeClass('active-btn');
  $('.all-list').removeClass('active-btn');
  indexTasks(function (response) {
    var htmlString = response.tasks.filter(function (task) {
      return !task.completed
    });
    displayFilter(htmlString);
  });
});



$(document).on('click', '.all-list', function () {
  $('.active-list').removeClass('active-btn');
  $('.completed-list').removeClass('active-btn');
  $('.all-list').addClass('active-btn');
  indexTasks(function (response) {
    console.log(response);
    var htmlString = response.tasks.map(function (task) {
      return task;
    });
    displayFilter(htmlString);
  });
});

var displayFilter = function (arr) {
  if (arr.length < 1) { return $('tbody').remove(); }
  $('tbody').remove();
  $('table').append('<tbody></tbody>');
  arr.forEach(function (task) {
    addTask(task.content, task.id, task.created_at, task.completed)
  });
}
